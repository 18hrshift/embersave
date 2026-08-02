# Deployment

The website is a Next.js **static export** deployed to Vercel, with DNS on
Cloudflare, serving [embersave.18hrshift.com](https://embersave.18hrshift.com).

> Project IDs, zone IDs, and the location of the credentials that manage them
> are deliberately **not** in this repository. They live in the operator's
> private ops notes. This document covers the process; it does not map the
> infrastructure.

---

## What gets built

`next.config.ts` sets `output: "export"`, so a build produces plain files in
`web/out/` and Vercel serves them from the edge. **There is no serverless
function in this project** — no cold start, nothing to pay for beyond
bandwidth.

That is a deliberate match to the product's claim: embersave costs almost
nothing to run because the operator holds nothing. A marketing site that
needed a server would undercut that on the page making the argument.

Two consequences worth knowing:

- `app/opengraph-image.tsx` needs `export const dynamic = "force-static"`.
  Without it the build fails, because a static export has no image server to
  generate the preview on demand.
- `turbopack.root` is pinned in `next.config.ts`. Without it Turbopack walks
  up past this directory, finds an unrelated lockfile, and picks the wrong
  workspace root.

---

## Deploying

From `web/`:

```bash
vercel deploy --prod --yes     # production
vercel deploy --yes            # preview URL
```

The project is **not connected to a Git repository**, so there is no
push-to-deploy. Deploys are manual from the CLI, and a push to `main` does not
ship anything on its own.

---

## DNS

The site is served from a subdomain of `18hrshift.com`, whose DNS is on
Cloudflare:

| Type | Name | Target | Proxy |
|---|---|---|---|
| `CNAME` | `embersave` | `cname.vercel-dns.com` | **DNS only** (grey cloud) |

**Do not enable the Cloudflare proxy** (orange cloud) in front of Vercel. It
breaks Vercel's certificate issuance and stacks two CDNs for no benefit. Every
other Vercel-backed subdomain on this zone is configured the same way.

Certificate issuance is automatic and usually completes within a few minutes
of the record resolving.

---

## Deployment protection

Vercel Authentication (SSO) is **on by default** for new projects on this
team. A first production deploy will return `302 → vercel.com/sso-api` instead
of the page.

A public landing page cannot sit behind SSO, so it is disabled for this
project. There is no CLI command for it — it is a REST-only setting, or a
toggle under **Project → Settings → Deployment Protection** in the dashboard.

The setting is **project-scoped**; disabling it here does not affect any other
project.

---

## Verifying a deploy

```bash
curl -sI https://embersave.18hrshift.com | head -1                    # 200
curl -s  https://embersave.18hrshift.com -o /tmp/es.html
grep -c "Keep the world" /tmp/es.html                                 # 1
curl -sI https://embersave.18hrshift.com/opengraph-image | head -1    # 200
```

Write the body to a file before grepping. Piping `curl` straight into `grep`
can produce a false empty result that reads like missing content.

---

## Rollback

```bash
vercel ls embersave              # list deployments
vercel rollback <deployment-url> # promote a previous one
```

The site is static and stateless, so rollback is instant and carries no data
risk.
