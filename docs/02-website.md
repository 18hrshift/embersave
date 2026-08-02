# The website

`embersave/web` — the landing page at
[embersave.18hrshift.com](https://embersave.18hrshift.com).

A static brochure. No server, no database, no auth, no analytics.

---

## Stack

| Piece | Choice | Why |
|---|---|---|
| Framework | Next.js 16, App Router | Static export, good defaults, deploys to Vercel with no config |
| Styling | Tailwind CSS v4 | CSS-first config; the palette is a `@theme` block, not a JS object |
| 3D | three.js via `@react-three/fiber` | The hero scene |
| Fonts | `next/font` — Inter, JetBrains Mono | Brand §10. Self-hosted, no network request to Google |
| Output | `output: "export"` | Plain files on the edge; no function to cold-start |

The static export matters beyond performance. embersave's whole pitch is that
it costs almost nothing to run because the operator holds nothing. A marketing
site that needed a server would undercut that on the page making the claim.

---

## Layout

```
web/
├── app/
│   ├── layout.tsx            fonts, metadata, OG tags
│   ├── page.tsx              assembles the sections
│   ├── globals.css           the palette — single source of truth for colour
│   ├── icon.svg              favicon — GENERATED, do not edit
│   └── opengraph-image.tsx   social preview, baked at build time
├── components/
│   ├── ember-scene.tsx       the three.js voxel scene
│   ├── scene-mount.tsx       client-only dynamic import wrapper
│   ├── logo.tsx              renders the delivered mark + lockup
│   ├── nav.tsx
│   ├── hero.tsx
│   ├── sections.tsx          problem, how it works, storage, honesty, games
│   └── footer.tsx
├── lib/
│   └── brand.ts              copy and links — single source of truth for text
├── public/                   GENERATED logo variants, do not edit
└── scripts/
    └── build-logo-assets.mjs derives public/ + app/icon.svg from the source art
```

Logo assets in `public/` and `app/icon.svg` are **derived from
`embersave/ember save logos/`**. Edit the source art and re-run the script;
do not hand-edit the outputs. See
[`04-brand-reconciliation.md`](04-brand-reconciliation.md).

---

## The two source-of-truth rules

Both siblings enforce *config is loaded, not mirrored* mechanically. The
website follows it by construction:

**Colour is declared exactly once**, in `app/globals.css` as a Tailwind
`@theme` block. There is no colour in `lib/brand.ts` and no hex literal in any
component. The 3D scene needs real values in JavaScript, so it reads the CSS
custom properties off the document at mount:

```ts
getComputedStyle(document.documentElement).getPropertyValue("--color-ember")
```

This is why the scene waits one frame before rendering — the first painted
frame is already brand-correct rather than a fallback colour that corrects
itself.

**Copy and links are declared exactly once**, in `lib/brand.ts`. No component
hardcodes a URL or a tagline.

---

## Honesty constraints

The brand checklist (§18) requires that no claim overstate readiness. Two
consequences are load-bearing:

- **There is no download button.** The installers are unsigned. `links.download`
  is `null`, and the footer renders it as plain text reading "Download — soon"
  rather than a link.
- **There is no Discord invite.** The server has not been created.
  `links.discord` is `null` and renders the same way.

`lib/brand.ts` uses `null` for both rather than a placeholder URL, on purpose.
The community repo's `/gift` command refuses to print a `REPLACE_ME` Steam
link at someone trying to give money, on the grounds that a broken link on a
page about gifting is the exact shape of a scam. Same rule here.

When either becomes real, set the href in `lib/brand.ts` and give it an
anchor. Nothing else changes.

---

## The hero scene

`components/ember-scene.tsx`.

The delivered identity is pixel art, so the scene is built from **voxels**.
Smooth geometry beside that logo reads as two different brands.

Brand §12 still governs the rest: a dark neutral environment, a small warm
focal point, and an ember that means *continuity, not destruction*. So there
is no fire simulation, no bloom, and no particles spraying outward.

What is on screen is the product's one invariant, drawn literally:

- A **voxel flame** — the world. Built from an explicit pixel map (`FLAME`)
  extruded three voxels deep and shaded on the logo's own ramp: deep edge,
  ember body, bright inner, pale core. It breathes and sways; it never
  flickers.
- A **dashed ring** of small cubes — the sync path, echoing the dashed frame
  in the mark.
- **Three cube nodes** on the ring — machines in the group.
- A **pale pulse cube** travelling the ring. As it reaches each node, that
  node warms from Cold Blue to Ember Orange and cools after it passes.

That pulse is the lease moving between machines. Exactly one node is lit at a
time, because exactly one machine is ever authoritative.

### Implementation notes worth keeping

- **Tone mapping is off.** R3F applies ACES filmic tone mapping by default,
  which desaturates Ember Orange into a washed tan. Since the palette is read
  from brand tokens, it must render as those tokens — `gl.toneMapping` is set
  to `NoToneMapping`.
- **Instanced colour needs no `vertexColors`.** `InstancedMesh` applies
  `instanceColor` automatically once `setColorAt` has run. Setting
  `vertexColors` on the material makes the shader look for a per-vertex colour
  attribute that `BoxGeometry` does not have, and every cube silently falls
  back to one flat tone — which looks like the ramp was never written.
- **The flame never turns edge-on.** It is a sprite with depth, so a full spin
  would flatten it to a line. It sways within about ±24° instead, which also
  reads calmer than a rotating object.
- **Every extruded layer keeps its full shade.** Dimming outer layers by depth
  hid the pale core behind a darker front slice and flattened the flame to one
  brown mass. Pixel art is flat-shaded; the lighting supplies the form.
- **The scene is client-only.** It needs WebGL and a document, so a static
  export would crash at build time without `dynamic(..., { ssr: false })`.
  That is all `scene-mount.tsx` does.
- **Reduced motion is respected.** `prefers-reduced-motion` switches the
  frameloop to `demand`, so the scene renders one still frame and stops. A
  picture is not a motion hazard, so it is not removed entirely.
- **Mote drift is delta-clamped** so a backgrounded tab does not teleport
  every particle on return.

The scene is decorative and marked `aria-hidden`. The page reads completely
without it, which is also what happens on a machine with no WebGL.

---

## Accessibility

- Every status is carried by an icon **and** a word, never colour alone
  (brand §9).
- The honesty table is a real `<table>` with a caption and scoped headers.
- Focus rings are Ember Orange at 2px with offset, never removed.
- Body copy is Ash on Coal; the brand's warning against Ember Orange text on
  Warm White at small sizes does not apply to this dark UI, but Ember on Coal
  is reserved for headings and controls rather than paragraph text.

---

## Local development

```bash
cd web
npm install
npm run dev        # http://localhost:3000
npm run build      # static export → web/out
npm run typecheck
```

To preview the built output exactly as deployed:

```bash
npm run build && npx serve out
```

---

## Verifying the scene renders

Headless Chrome needs software WebGL, and it is **flaky** — identical runs
alternate between rendering the scene and producing a blank canvas. A blank
result is not evidence of a bug. Retry, and compare file sizes: a rendered
frame is roughly five times larger than an empty one.

```bash
chrome --headless --no-sandbox --use-gl=angle --use-angle=swiftshader \
  --enable-unsafe-swiftshader --window-size=1440,900 \
  --virtual-time-budget=14000 --screenshot=out.png http://localhost:4321/
```
