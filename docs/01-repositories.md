# How the repositories relate

embersave is three codebases with one brand, in two repos: this one (brand,
docs, website) and `18hrshift/embersave-app` (the engine at its root, the
community bot in `community/`). The codebases are deliberately separate, and
the seams between them are contracts rather than imports.

This document is the map. It is the reason the umbrella directory exists.

---

## The map

```
                        ┌───────────────────────────────┐
                        │  embersave  (this directory)  │
                        │  brand · docs · website       │
                        └───────────────┬───────────────┘
                                        │  describes, links to
                        ┌───────────────┴───────────────┐
                        │                               │
            ┌───────────▼───────────┐       ┌───────────▼───────────┐
            │  engine               │       │  community            │
            │  embersave-app        │◄─────►│  embersave-app/       │
            │  (repo root)          │       │  community/           │
            │                       │ bridge│  Discord bot (Sparky) │
            │  launcher · agent     │contract  service desk         │
            │  lease · snapshots    │       │  adapter flywheel     │
            │  game adapters        │       │  dashboard (scoped)   │
            └───────────────────────┘       └───────────────────────┘
```

Nothing in this directory imports from either sibling. The website links to
them and restates their claims; it does not depend on their code.

---

## engine: `18hrshift/embersave-app`, repo root

Renamed from `palworld-shared-world` when it moved to the `18hrshift` org on
2026-10-27. The home-ops clone is still at `~/Desktop/Projects/palworld-shared-world`.

**The product.** Everything that touches a save file lives here.

| Area | What it is |
|---|---|
| `src/launcher/` | The desktop app users open |
| `src-tauri/` | Tauri shell; ships the agent as a single executable |
| `src/agent/` | Runs the game server, checkpoints, uploads |
| `src/control-plane/` | The lease — who is allowed to host right now |
| `src/snapshot/` | Snapshot chain and the thinning ladder |
| `src/adapters/` | Per-game behaviour, behind an interface |
| `config/games/*.json` | One descriptor per supported game |
| `contracts/` | `game-adapter-v1` and `shared-save-config-v1` schemas |

**Owns:** the lease protocol, the storage split, the snapshot format, the
adapter interface, and the canonical brand document
(`docs/09-brand-guidelines.md`).

**Current state:** Phases 0 and 1 complete, Phase 2's core built. Palworld is
the only adapter and it is verified on two real machines. Installers are
unsigned. Secrets are still plaintext on Windows.

**Deliberate constraint:** the core knows nothing about Palworld. If adding a
game ever requires touching the coordinator, the abstraction failed and the
abstraction gets fixed — not the coordinator.

---

## community: `18hrshift/embersave-app`, `community/`

**The social half.** The Discord server, the bot that runs it, and the
funding flywheel for new game adapters. Paths below are relative to
`community/`.

| Area | What it is |
|---|---|
| `src/domain/` | The rules. Plain arguments in, plain results out — no Discord types |
| `src/commands/` | Interaction plumbing, one file per feature area |
| `src/discord/` | Signature verification, response builders, REST client |
| `src/store/` | Store interface, in-memory and Postgres implementations |
| `config/brand.json` | Brand values; nothing in source may hardcode them |
| `api/` | Vercel entry point — thin |

**Owns:** the ticket lifecycle, the game-request status ladder, and the
community-facing brand vocabulary.

**Current state:** kept in the "Status, honestly" table of
`community/README.md`, not restated here. On 2026-10-27 it said the bot is live
in the Discord server and the dashboard is scoped only.

**History:** this was the separate `embersave-community` repo until 2026-10-27,
when it was merged into `embersave-app` under `community/` with its history
kept (18hrshift/embersave-app#1). The old repo is archived with a pointer
README. The bot still deploys with the Vercel CLI from `community/` to the
`embersave-community` Vercel project; that project is not connected to Git.

**Architectural note:** HTTP interactions, no gateway. There is no always-on
process, because embersave's pitch is that it costs almost nothing to run. A
community bot on a paid always-on host would be the most expensive component
in the stack.

---

## web — `embersave/web` (this directory)

**The public face.** A static landing page. No server, no database, no auth.

**Owns:** nothing the other two depend on. That is the point — it can be
rewritten or thrown away without touching the product.

See [`02-website.md`](02-website.md).

---

## The seams

### engine ↔ community: the control-plane bridge

The community bot wants to say things like *"your ember is cooling — Sam
passed the torch 4 minutes ago."* That needs world state from the engine's
control plane.

**The contract is written; the bridge is not built.** It needs the engine
side to exist first. Until then the bot has no knowledge of any world.

This is the only runtime coupling between the two, and it is deliberately
one-directional: the community side reads, and never writes save state.

### engine → web: claims

The website restates the engine's README and design docs — the storage table,
the honesty table, the five session steps. Those are **copied claims, not
imports**, which means they can drift.

`web/lib/brand.ts` is the single place any of it is written down. When the
engine's claims change, that file is the only thing to update.

### brand → everything

The canonical brand document lives in the **engine** repo, not here, because
it predates this directory and the engine is the thing people clone.

Both the community bot (`community/config/brand.json`) and the website
(`web/app/globals.css` + `web/lib/brand.ts`) restate parts of it locally so
they can enforce "config is loaded, not mirrored" within their own boundary.

---

## Nothing here propagates on its own

Worth being blunt about, because two of these look automatic and are not.

| Change | Does it propagate? | What it actually takes |
|---|---|---|
| Push to `18hrshift/embersave` | **No.** The site does not redeploy. | The Vercel project is not connected to Git. Run `vercel deploy --prod` from `web/`. |
| Flipping a repo's visibility | **No.** No link updates. | Every URL on the site is a literal string in `web/lib/brand.ts`. Edit it, rebuild, redeploy. |
| Editing the engine's brand doc | **No.** | The site's palette lives in `web/app/globals.css`; copy lives in `web/lib/brand.ts`. Both are restatements. |
| Editing artwork in `ember save logos/` | **No**, but it is one command. | `cd web && node scripts/build-logo-assets.mjs`, then rebuild. |

The Git/deploy split is deliberate for now — a push is not a release, so the
public repo can be updated without shipping the site, and vice versa. If that
stops being useful, connect the Vercel project to the repo and the first row
becomes automatic. Nothing else on this list ever will be.

### When the engine repo goes public

It is private today, so the site deliberately links to
`18hrshift/embersave` — the project's public home — rather than to a repo
that would 404 for every visitor.

When `embersave-app` opens, three things need doing by hand, all in
`web/lib/brand.ts` (there is a comment there saying so):

1. Add `engine: "https://github.com/18hrshift/embersave-app"`.
2. Re-point the hero and closing CTAs at it, and restore the "Read the
   source" label — right now they say "View on GitHub" because the launcher's
   source genuinely is not public and the page must not imply otherwise.
3. Move `license` and `requestGame` back, since that repo is their canonical
   home and already carries the game-adapter issue template.

Then rebuild and redeploy. Opening that repo also makes `community/` public,
so check it for anything that should stay private first.

### What the engine repo doesn't know

`embersave-app` has **no note in it** about this umbrella, the live
site, or the fact that a public page links to it. Anyone working only in that
repo would not discover any of it.

Adding that note was deliberately left undone: that repo is live work with its
own `test.sh` gate, and at the time of writing it had uncommitted changes in
its working tree. Dropping a doc into someone else's in-flight branch is how
you cause a merge conflict for no reason.

**It is still worth doing** once that work lands — a few lines in its README
pointing at `18hrshift/embersave` and the live site.

---

## Where a change belongs

| If you are changing… | Go to |
|---|---|
| How saves sync, lease, or restore | engine |
| Adding a game | engine (`config/games/` + an adapter) |
| What the bot says or does | community |
| Discord server structure | community |
| Marketing copy, landing page | web (`lib/brand.ts` first) |
| Colours, voice, the name | engine `docs/09-brand-guidelines.md`, then propagate |
| How the three fit together | this directory |

---

## What must not happen from here

This umbrella directory is documentation and a website. Working in it must
never modify the app repo. It is live work with its own test gates (one for
the engine, one in `community/`) and branch state that this directory knows
nothing about.

If something here implies a change over there, the change is made there, by
its own rules, with its own `bash test.sh` gate.
