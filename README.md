# embersave

**Keep the world alive.**

Open-source shared save syncing for survival games. A group's world keeps
moving between players, so nobody waits for one person to come online.

This directory is the **umbrella**: the brand, the public website, and the map
of how the pieces relate. It is not the engine and not the bot — those live in
their own repositories and are **not modified from here**.

---

## What embersave is

Co-op survival games come in two shapes. Either the world lives on one
person's PC and nobody plays when they're offline, or it needs a dedicated
server up 24/7 that somebody pays for and administers.

embersave is a third option: a launcher that hands one shared world around a
friend group. Your PC becomes the server when it's your turn, checkpoints as
you play, and releases the world when you quit. Someone else picks it up
tomorrow from their house.

**Exactly one machine is ever authoritative.** That invariant is the whole
system — everything else is plumbing around it.

It is deliberately a step *up* from taking turns and a step *below* a
dedicated server. See [`docs/00-overview.md`](docs/00-overview.md) for what
that trade buys and costs.

---

## The three repositories

| Repository | Role | Location | State |
|---|---|---|---|
| **engine** | The product. Launcher, agent, lease protocol, snapshots, game adapters. | [`18hrshift/palworld-shared-world`](https://github.com/18hrshift/palworld-shared-world) | Phases 0–1 done, Phase 2 core built. Pre-alpha. |
| **community** | Discord bot, brand, service desk, the adapter funding flywheel. | `embersave-community` (local; no git remote yet) | Bot built and tested. Never run against a real server. |
| **web** | This repo's [`web/`](web) — the public landing page. | `embersave/web` | Built here. |

Full relationship map, including which repo owns which decision and where the
contracts between them live: [`docs/01-repositories.md`](docs/01-repositories.md).

> **The engine repo is still named `palworld-shared-world`.** That is
> intentional — renaming breaks clones and every existing doc link for no
> benefit today. Its own brand doc says to rename when the second game adapter
> ships, since that is the moment the old name becomes actively misleading
> rather than merely dated.

---

## This directory

```
embersave/
├── README.md                  you are here — the umbrella
├── docs/
│   ├── 00-overview.md         what the product is, and what it is not
│   ├── 01-repositories.md     how the three repos relate; who owns what
│   ├── 02-website.md          architecture of web/, and the rules it inherits
│   ├── 03-deployment.md       Vercel + Cloudflare runbook for the domain
│   └── 04-brand-reconciliation.md  where the brand doc and the artwork disagree
├── ember save logos/          the delivered brand art (source of truth)
└── web/                       the landing page (Next.js, three.js)
```

The site is live at
**[embersave.18hrshift.com](https://embersave.18hrshift.com)**.

### Running the website

```bash
cd web
npm install
npm run dev        # http://localhost:3000
npm run build      # static export to web/out
npm run typecheck
```

---

## Brand, in one screen

The canonical brand document lives in the engine repo at
[`docs/09-brand-guidelines.md`](https://github.com/18hrshift/palworld-shared-world/blob/main/docs/09-brand-guidelines.md).
It is the source of truth; the summary below exists so nobody has to guess.

- **embersave is always lowercase**, including at the start of a sentence.
- **Tagline:** Keep the world alive.
- **Voice:** an experienced co-op teammate who understands infrastructure.
  Direct, reassuring, specific. Calm especially when something goes wrong.
- **Palette:** Ember Orange `#F27903` (from the artwork — the doc says
  `#F26A3D`; see [`docs/04-brand-reconciliation.md`](docs/04-brand-reconciliation.md)),
  Coal `#17191C`, Ash `#A7ADB4`, Warm White `#F7F4EE`; Campfire Gold, Safe
  Green, Conflict Red, Cold Blue for states.
- **The mark is pixel art** — a blocky flame in a dashed sync frame. The
  wordmark is part of the artwork, not type.
- **Type:** Inter for interface and copy, JetBrains Mono where the exact value
  matters.
- **The ember means continuity, not destruction.** No heavy glow, no flicker.
- **Never communicate status by colour alone** — every state gets an icon and
  a word.

---

## Rules this directory inherits

Both sibling repos enforce two estate rules mechanically, and the website is
held to them too:

- **Config is loaded, not mirrored.** A constant that duplicates a config
  value is drift with a nicer name. On the website, colour is declared exactly
  once — in `web/app/globals.css` — and the 3D scene reads those custom
  properties off the document rather than repeating hex values in JavaScript.
- **Documentation is a claim, not a wish.** Nothing here describes a feature
  that does not exist. The website has no download button because the
  installers are unsigned, and no Discord link because the server has not been
  created.

---

## Status

**Pre-alpha.** Palworld works end to end on two real machines. The installers
are unsigned, so Windows SmartScreen warns on first launch. Nothing has been
tested with two distinct player accounts, which remains the last real risk to
the Palworld adapter.

Not ready for strangers yet. The website says so, on purpose.

**Licence: AGPL-3.0**, matching both sibling repos.

Built by [18hrshift](https://github.com/18hrshift).
