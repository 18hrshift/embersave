<div align="center">

<img src="web/public/embersave-lockup.svg#gh-light-mode-only" alt="embersave" width="380">
<img src="web/public/embersave-lockup-dark.svg#gh-dark-mode-only" alt="embersave" width="380">

**Keep the world alive.**

Open-source shared save syncing for survival games.

[embersave.18hrshift.com](https://embersave.18hrshift.com) · AGPL-3.0

</div>

---

## What it is

Co-op survival games come in two shapes, and both are annoying. Either the
world lives on one person's PC and nobody plays when they're offline, or it
needs a dedicated server running 24/7 that somebody pays for and administers.

So four friends rent a $12/month server, play hard for three weeks, drift
apart, and cancel by month two. Everyone has done this.

**embersave is a third option.** It's a launcher that hands one shared world
around a friend group. Your PC becomes the server when it's your turn, saves
in the background while you play, and passes the world on when you quit.
Someone else picks it up tomorrow, from their house.

Nobody has to be online for the world to still be there.

## How a session goes

1. **Open the launcher.** It shows the world — who hosted last, when it
   synced, and whether anyone's in it right now.
2. **Claim it.** If nobody's hosting, take it. Only one person can hold the
   world at a time, so two of you clicking at once can never split it in two.
3. **Your PC becomes the server.** It pulls the newest save, checks it, and
   starts the game locally. Friends join in one click.
4. **It saves as you play.** Older versions stay recoverable.
5. **Quit, and it passes on.** The final save uploads and the world is
   released for whoever's next.

## Where your saves live

**In your own Google Drive.** Not ours.

They sit in an ordinary folder you can open, copy, or walk away with. Adding a
friend to the world is just sharing that folder with them — no accounts to
manage, no invite system to learn.

The only thing stored anywhere else is a few kilobytes noting whose turn it
is. No save data ever touches it, which is why it's free to run and why
nothing of yours is lost if it goes down. You can also run the whole thing
yourself if you'd rather not rely on us at all.

## What it isn't

| Why people rent a server | Does this replace it? |
|---|---|
| Nobody has to be online for the world to persist | **Yes** |
| Simple setup | **Yes** — one app |
| World joinable 24/7 | **No.** Someone has to be hosting to play. |
| Dedicated hardware | **No** — though a gaming PC beats a budget VPS for four players |
| Public servers, 30 strangers | **No, by design.** This is a friends system. |

If you run a public community server, keep renting one. If you and three
friends just want your world to still be there next Tuesday, this is for you.

## Status

**In development.** It works today on **Palworld** — tested end to end with
two people alternating as host on one world.

**There is no public build yet.** When there is, it'll be linked from the site
and from here. Nothing about it is subscription-based; there are no tiers and
nothing to upgrade.

Want your game supported? The thing that decides whether a game can work is
simple: *does your character still exist when someone else hosts?*
[Tell us which game you play](https://github.com/18hrshift/embersave/issues/new?template=game-request.md)
— if you already know the answer for it, that alone is a real contribution.

---

## This repository

embersave is one brand over a few codebases. **This repo holds the brand and
the website** — the launcher itself lives separately.

| | What |
|---|---|
| [`web/`](web) | The site at embersave.18hrshift.com |
| [`docs/`](docs) | How the pieces fit together |
| [`ember save logos/`](ember%20save%20logos) | Brand artwork — the source every web asset is generated from |

### Running the site

```bash
cd web
npm install
npm run dev        # http://localhost:3000
npm run build      # static export → web/out
npm run typecheck
```

### Regenerating logo assets

Everything in `web/public/` and `web/app/icon.svg` is **generated** from
`ember save logos/embersave logo.svg`. Edit the artwork, then:

```bash
cd web && node scripts/build-logo-assets.mjs
```

Don't hand-edit the outputs — they'll be overwritten, and the script exists so
the mark and the wordmark can't drift apart.

### Docs

| Doc | What it answers |
|---|---|
| [`00-overview.md`](docs/00-overview.md) | What embersave is, in more depth |
| [`01-repositories.md`](docs/01-repositories.md) | How the codebases relate; where a change belongs |
| [`02-website.md`](docs/02-website.md) | How the site is built |
| [`03-deployment.md`](docs/03-deployment.md) | How it's deployed |
| [`04-brand-reconciliation.md`](docs/04-brand-reconciliation.md) | Where the brand doc and the artwork disagree |

## Licence

**[AGPL-3.0](LICENSE).** Run it, modify it, self-host it freely. If you run a
modified version as a network service, publish your changes.

The intent is narrow: keep a server-rental company from absorbing this and
reselling it closed.

Built by [18hrshift](https://github.com/18hrshift).
