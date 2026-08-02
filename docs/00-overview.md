# What embersave is

**Keep the world alive.**

A shared survival world is like a campfire: everyone contributes to it, and
someone has to keep the ember alive between sessions. embersave is the layer
that does that when nobody is online.

---

## The problem, precisely

Co-op survival games come in two shapes:

- **Host-authoritative.** The world lives on one person's PC. If they're
  offline, nobody plays. (The Forest, most small co-op builders.)
- **Dedicated-server-only.** The world needs a machine up 24/7. Someone pays
  for it and administers it. (Palworld, V Rising, Enshrouded.)

So four friends rent a $12/month server, play hard for three weeks, drift
apart, and cancel by month two. Everyone has done this.

Obsidian solved it in **Grounded** with *Shared Worlds*: the world is a
durable thing any approved player can pick up and host for a session. Hosting
becomes a role you take, not a machine you own. Almost no other game has it.

embersave is that layer, for the games that don't.

---

## The shape of a session

1. Open the launcher. It shows the world — who hosted last, when it synced,
   and whether anyone is in it right now.
2. World free? Claim it. The lease is granted **atomically**, so two people
   clicking at once cannot both win.
3. Your PC downloads the newest save, verifies it, and starts the game server
   locally. Friends join in one click.
4. It checkpoints in the background as you play.
5. You quit; it uploads a final snapshot and releases the world.

**Exactly one machine is ever authoritative.** Everything else in the system
is plumbing around that invariant, and every failure mode worth worrying
about is a way of violating it.

---

## Where the data lives

| | Where | Why |
|---|---|---|
| **Save archives** | Your own Google Drive | You own them. ~1.7 GB/world steady state — fits the free 15 GB. |
| **Lease + metadata** | A tiny always-on service | Needs strong consistency. Kilobytes. Holds no save data. |
| **The game server** | Whoever is hosting right now | That's where the hardware already is. |

Sharing the Drive folder with a friend is what adds them to the world — the
Drive permission model *is* the group membership model.

Because the lease holds no save data, it is free to run and harmless if it
goes down. That is also what makes self-hosting a real option rather than a
checkbox: if the hosted instance disappears, nothing of yours was on it.

---

## What this is honest about not being

| Why people rent a server | Does this replace it? |
|---|---|
| Nobody has to be online for the world to persist | **Yes** |
| Simple setup | **Yes** — that's the point of the launcher |
| World joinable 24/7 | **No.** Someone has to be hosting to play. |
| Dedicated hardware | **No** — though a gaming PC beats a budget VPS for four players |
| Public servers, 30 strangers | **No, by design.** This is a friends system. |

If you run a public community server, keep renting one. If you and three
friends just want your world to still be there next Tuesday, this is for you.

This table is on the landing page verbatim. It is the most trustworthy thing
on it, and it stays.

---

## Games

**Palworld is first** — the MVP and the proving ground. Its adapter is
verified: every capability measured on two real machines rather than taken
from documentation.

Adding a game is a `config/games/*.json` descriptor plus an adapter
implementation, both in the engine repo. The core knows nothing about any
specific game.

The question that decides whether a game is possible at all is **does player
identity survive moving the world to a different machine?** The engine's
issue template for game proposals opens with it, because a "no" there ends
the conversation before any code is written.

The most useful contribution to this project is not code — it is running the
feasibility spike for a game you play. The hard-won part is per-game
empirical knowledge.

---

## Money

There is no billing, no tiers, no locked features, no account upgrade. The
hosted lease service costs essentially nothing to run, so it is free.

If it saves you a server rental, throw a coffee at it. If it doesn't, don't.

Support for new games is funded through a public wishlist rather than pooled
funds. A filled progress bar is a promise with a deadline, and an
investigation that honestly concludes "this game can't work" should be a
technical finding rather than a refund conversation.

---

## Licence

**AGPL-3.0.** Run it, modify it, self-host it freely. If you run a modified
version as a network service, publish your changes.

The intent is narrow: keep a server-rental company from absorbing this and
reselling it closed.

---

## Status

Pre-alpha, but no longer speculative — Palworld is proven to work end to end.

Not ready for other people yet: the installers are unsigned, secrets are
still plaintext on Windows, and nothing has been tested with two distinct
player accounts, which is the last real risk to the Palworld adapter.

The website states this plainly rather than burying it, and ships no download
button until there is something safe to download.
