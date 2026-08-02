/**
 * Generate web-ready logo assets from the source art in `ember save logos/`.
 *
 * The delivered SVGs are drawn for a light background: the sync frame and the
 * "ember" half of the wordmark are near-black (#131718 and neighbours), which
 * disappears on Coal. This script emits a dark-background variant by mapping
 * that near-black family to Warm White, and leaves every orange untouched.
 *
 * Run: node scripts/build-logo-assets.mjs
 *
 * Regenerate whenever the source art changes. The outputs in public/ are
 * derived files — edit the source art, not them.
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const SRC = join(here, "..", "..", "ember save logos");
const OUT = join(here, "..", "public");

/** The near-black family used for the frame and the "ember" wordmark. */
const DARK_FAMILY = ["#131718", "#141819", "#14191a", "#151819", "#15191a"];
const ON_DARK = "#f7f4ee"; // Warm White

const jobs = [
  { from: "Asset 1.svg", light: "embersave-mark.svg", dark: "embersave-mark-dark.svg" },
  { from: "embersave logo.svg", light: "embersave-lockup.svg", dark: "embersave-lockup-dark.svg" },
];

mkdirSync(OUT, { recursive: true });

for (const job of jobs) {
  const source = readFileSync(join(SRC, job.from), "utf8");

  writeFileSync(join(OUT, job.light), source);

  let darkened = source;
  let replaced = 0;
  for (const hex of DARK_FAMILY) {
    const pattern = new RegExp(hex, "gi");
    const hits = darkened.match(pattern);
    if (hits) replaced += hits.length;
    darkened = darkened.replace(pattern, ON_DARK);
  }

  if (replaced === 0) {
    throw new Error(
      `${job.from}: no near-black fills found. The source art changed — ` +
        `check DARK_FAMILY against its actual palette before trusting the output.`,
    );
  }

  writeFileSync(join(OUT, job.dark), darkened);
  console.log(`${job.from} -> ${job.light}, ${job.dark} (${replaced} fills remapped)`);

  /*
    The favicon is the dark-variant mark on a Coal tile. Browser chrome is
    light as often as dark, so the tile guarantees the frame stays visible
    instead of depending on the surrounding UI.
  */
  if (job.from === "Asset 1.svg") {
    const viewBox = darkened.match(/viewBox="([^"]+)"/)?.[1];
    if (!viewBox) throw new Error("mark SVG has no viewBox; cannot build the favicon");
    const [, , w, h] = viewBox.split(/\s+/).map(Number);

    // Painted first, so it sits behind the artwork.
    const tile = `<rect x="0" y="0" width="${w}" height="${h}" rx="${(w * 0.18).toFixed(2)}" fill="#17191c"/>`;
    const icon = darkened.replace(/(<\/defs>)/, `$1\n  ${tile}`);
    if (icon === darkened) throw new Error("could not insert the favicon tile after </defs>");

    const iconPath = join(here, "..", "app", "icon.svg");
    writeFileSync(iconPath, icon);
    console.log(`${job.from} -> app/icon.svg (favicon tile ${w}x${h})`);
  }
}
