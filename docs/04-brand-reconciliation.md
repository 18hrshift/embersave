# Brand reconciliation: the doc vs the artwork

The written brand guidelines and the delivered logo art disagree in two
places. This document records which one the website follows and why, so the
difference is a decision on the record rather than a drift nobody noticed.

**Sources**

- `palworld-shared-world/docs/09-brand-guidelines.md` — the written spec
- `embersave/ember save logos/` — the delivered artwork (added 2026-08-02)

---

## 1. Ember Orange

| Source | Value |
|---|---|
| Brand doc §9 | `#F26A3D` — a coral / salmon orange |
| Logo artwork | a ramp around `#F27903`, with `#D34610`, `#FCA91C`, `#FCD68D` |

**The website follows the artwork.**

The two are close enough that placing them side by side reads as a mistake
rather than as a palette — the logo would look like it was pasted in from a
different brand. Since the logo is the artefact users actually see, the page
matches it.

The site's ember tokens are therefore:

| Token | Value | Role |
|---|---|---|
| `--color-ember` | `#F27903` | primary accent, links, CTAs |
| `--color-ember-deep` | `#D34610` | flame edge in the 3D scene |
| `--color-ember-bright` | `#FCA91C` | flame mid-tone, node highlight |
| `--color-ember-core` | `#FCD68D` | flame core, the lease pulse |

Everything else in §9 is unchanged and still authoritative: Coal `#17191C`
(the artwork's near-black `#131718` family is close enough to need no
change), Ash, Warm White, and the four state colours.

**To resolve properly:** update §9 in the engine repo to the artwork's ramp,
then delete this section. Until someone does, the doc and the site disagree
and this file is the reason.

---

## 2. The mark is pixel art

The brand doc §8 describes a "simple geometric ember" and explicitly rules out
realistic flames, and §10 asks for a rounded humanist wordmark set in Inter.

The delivered mark is **pixel art**: a blocky flame inside a dashed sync frame
with corner brackets, and a pixel wordmark where "ember" is dark and "save" is
orange.

**The website follows the artwork**, because a logo is a stronger commitment
than a paragraph describing one. Consequences:

- The nav and footer render the delivered lockup as an image. There is no
  Inter-set wordmark anywhere — the wordmark is part of the art.
- The hero's 3D scene is built from **voxels**, not smooth geometry. A
  lathe-turned sphere beside a pixel logo reads as two brands. The flame is an
  explicit pixel map extruded a few voxels deep, shaded on the ramp above.
- The sync ring is **dashed**, echoing the dashed frame in the mark.
- Body copy is still Inter. Setting paragraphs in a pixel face would cost
  readability for no gain, and §10's reasoning about legibility still holds
  for text.

The doc's underlying intent survives: the ember still reads as continuity
rather than destruction, there is no bloom or glow effect, and the flame never
flickers — it breathes and sways.

---

## 3. Assets on a dark background

The delivered SVGs are drawn for a light background. The sync frame and the
"ember" half of the wordmark are near-black (`#131718` and four neighbours),
which disappears on Coal.

`web/scripts/build-logo-assets.mjs` generates dark-background variants by
remapping that near-black family to Warm White, and emits the favicon as the
dark mark on a Coal tile. It throws if it finds no near-black fills, so a
change to the source art fails the build rather than silently shipping an
invisible logo.

Outputs are derived. **Edit the source art, not `web/public/`.**

```bash
cd web && node scripts/build-logo-assets.mjs
```

| Output | Use |
|---|---|
| `public/embersave-mark.svg` | mark, light backgrounds |
| `public/embersave-mark-dark.svg` | mark, dark backgrounds |
| `public/embersave-lockup.svg` | full lockup, light backgrounds |
| `public/embersave-lockup-dark.svg` | full lockup, dark backgrounds — nav, footer, OG |
| `app/icon.svg` | favicon: dark mark on a Coal tile |

---

## 4. Assets deliberately not used

`banner.png` and the two profile images (`bot pfp.png`, `embersave pfp.png`)
are Discord/bot assets and belong to the community repo's surfaces. They are
not used on the website.
