# Deployment

The website is deployed to Vercel and served at
`embersave.18hrshift.com`, with DNS on Cloudflare.

Everything in this document has been done except the DNS record, which is
called out explicitly as outstanding.

---

## Current state

| Thing | Value |
|---|---|
| Vercel team | `john-2121s-projects` (`team_8dSdkFn5WZ016NlBvcVCSRKS`) |
| Vercel project | `embersave` (`prj_5dxR6Lb7KKCBHAGn5JgZjIPK7h2w`) |
| Production URL | `https://embersave-m9wbm8nsz-john-2121s-projects.vercel.app` |
| Custom domain | `embersave.18hrshift.com` — **live**, cert issued |
| Deployment protection | **Disabled** (see below) |
| Framework | Next.js, static export |

The `.vercel/` link data lives in `web/.vercel/` and is gitignored.

---

## DNS

The record below exists in Cloudflare, zone `18hrshift.com`
(`55c4ed6a403b4f74e5f43dfe65155bfc`):

| Type | Name | Target | Proxy |
|---|---|---|---|
| `CNAME` | `embersave` | `cname.vercel-dns.com` | **DNS only** (grey cloud) |

This matches how `atc.18hrshift.com` and `c130.18hrshift.com` are already
configured on the same zone — they resolve through `cname.vercel-dns.com` to
Vercel's IPs, which means Cloudflare's proxy is off for them.

Vercel's CLI suggests an `A` record to `76.76.21.21` instead. Either works;
the CNAME is preferred here only because it matches the existing pattern on
this zone and survives Vercel changing its anycast IPs.

**Do not turn the orange cloud on.** Proxying in front of Vercel breaks
Vercel's certificate issuance and doubles the CDN layer for no benefit.

It was created via the Cloudflare API. Certificate issuance was automatic and
completed a few minutes after the record started resolving.

### Which credential manages this zone

`central-ops/ACCOUNTS.md` is the index of every credential on the VM, and
`central-ops/secrets/central-ops.enc.env` is the SOPS/age-encrypted store.
**Start there**, not by grepping project `.env` files — there are at least two
Cloudflare accounts and the token names are not consistent between them.

Two credentials reach `18hrshift.com`:

| Credential | Zones it can see |
|---|---|
| `bedrock/.env` → `CLOUDFLARE_DNS_API_TOKEN` | `18hrshift.com` |
| `~/.cloudflare/token` | `18hrshift.com`, `sonogee.xyz` |

The tokens in `AAH WEBSITE CLONE/.env` and `Andrew-Forte-SEO/.env` are a
**different Cloudflare account** — `andrewasks.com`, `andrewforte.me`,
`pricedin.tv` only. That is the Team-AAH / 18hrshift estate split, and it is
correct: an AAH token should never be able to edit an 18hrshift zone.

```bash
# Verify which zones a token can reach before using it
curl -s -H "Authorization: Bearer $TOKEN" \
  "https://api.cloudflare.com/client/v4/zones?per_page=50" \
  | python3 -c "import sys,json;print([z['name'] for z in json.load(sys.stdin)['result']])"
```

### Adding a record

```bash
TOK=$(grep -oE '^CLOUDFLARE_DNS_API_TOKEN=.*' ~/Desktop/Projects/bedrock/.env | cut -d= -f2-)
ZONE=55c4ed6a403b4f74e5f43dfe65155bfc

curl -s -X POST "https://api.cloudflare.com/client/v4/zones/$ZONE/dns_records" \
  -H "Authorization: Bearer $TOK" -H "Content-Type: application/json" \
  -d '{"type":"CNAME","name":"<sub>","content":"cname.vercel-dns.com",
       "ttl":1,"proxied":false,"comment":"<what this serves>"}'
```

Then:

```bash
dig +short <sub>.18hrshift.com                      # expect Vercel IPs
curl -sI https://<sub>.18hrshift.com | head -1      # expect HTTP/2 200
```

---

## Deployment protection

Vercel Authentication (SSO) was **on by default** for this team — the first
production deploy returned a `302` to `vercel.com/sso-api`. Other 18hrshift
projects are still gated this way; `atc.18hrshift.com` returns `401`.

A public open-source landing page cannot be behind SSO, so it was disabled
for this project only:

```bash
TOKEN=$(python3 -c "import json,os;print(json.load(open(os.path.expanduser('~/.local/share/com.vercel.cli/auth.json')))['token'])")
curl -X PATCH "https://api.vercel.com/v9/projects/${PROJECT_ID}?teamId=${TEAM_ID}" \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"ssoProtection":null}'
```

There is no CLI command for this; it is a REST-only setting. It can also be
changed in the dashboard under **Project → Settings → Deployment Protection**.

**This is project-scoped.** Other 18hrshift projects were not touched.

---

## Deploying

From `web/`:

```bash
vercel deploy --prod --yes     # production
vercel deploy --yes            # preview URL
```

The project is **not connected to a Git repository**, so there is no
push-to-deploy. Deploys are manual from the CLI.

### If Git deploys get connected later

There is a known trap on this Vercel team, recorded in the estate notes:
Vercel blocks git deployments whose commit author resolves to a GitHub
account outside the team. The deployment shows state `BLOCKED` and the CLI
reports `UNKNOWN`. The durable fix is Vercel-side and done once per author —
open the blocked deployment in the dashboard, choose **Authorize**, then
*"always allow deployments from this author."* Do not chase committer emails.

`vercel deploy --prod` from the CLI bypasses this entirely, which is why the
manual path is used today.

---

## What gets built

`next.config.ts` sets `output: "export"`, so the build produces plain files
in `web/out/` and Vercel serves them from the edge. There is no serverless
function in this project — no cold start, and nothing to pay for beyond
bandwidth.

The OG image at `app/opengraph-image.tsx` needs
`export const dynamic = "force-static"` for this reason; without it the build
fails, because a static export has no image server to generate it on demand.

`turbopack.root` is pinned in `next.config.ts`. Without it Turbopack walks up
past this directory, finds a lockfile on the Desktop, and picks the wrong
workspace root.

---

## Verifying a deploy

```bash
curl -sI https://embersave.18hrshift.com | head -1          # 200
curl -s https://embersave.18hrshift.com | grep -c "Keep the world"   # 1
curl -sI https://embersave.18hrshift.com/opengraph-image | head -1   # 200
```

Beware of shell pipeline buffering when grepping curl output — a false empty
result is easy to produce and easy to misread as missing content. Write the
body to a file first if the answer matters.

---

## Rollback

```bash
vercel ls embersave              # list deployments
vercel rollback <deployment-url> # promote a previous one
```

Since the site is static and stateless, rollback is instant and carries no
data risk.
