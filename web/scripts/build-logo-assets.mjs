/**
 * Generate every web logo asset from ONE source file:
 * `ember save logos/embersave logo.svg` — the full lockup.
 *
 * The mark is derived from the lockup by narrowing the viewBox to the mark's
 * square, rather than read from a separate file. Two files drift; a crop
 * cannot. When the lockup is revised, the mark is revised with it.
 *
 * The source art is drawn for a light background: the sync frame and the
 * "ember" half of the wordmark are near-black (#131718 and neighbours), which
 * disappears on Coal. Dark variants remap that family to Warm White and leave
 * every orange untouched.
 *
 * Run: node scripts/build-logo-assets.mjs
 *
 * Outputs in public/ and app/icon.svg are DERIVED. Edit the source art.
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const SOURCE = join(here, "..", "..", "ember save logos", "embersave logo.svg");
const PUBLIC = join(here, "..", "public");
const APP = join(here, "..", "app");

/** The near-black family used for the frame and the "ember" wordmark. */
const DARK_FAMILY = ["#131718", "#141819", "#14191a", "#151819", "#15191a"];
const ON_DARK = "#f7f4ee"; // Warm White

/** The mark occupies the leading square of the lockup artboard. */
const MARK_WIDTH = 322.61;

const lockup = readFileSync(SOURCE, "utf8");

const viewBox = lockup.match(/viewBox="([^"]+)"/)?.[1];
if (!viewBox) throw new Error("source lockup has no viewBox");
const [minX, minY, width, height] = viewBox.split(/\s+/).map(Number);

if (Math.abs(width - 1310.76) > 1) {
  throw new Error(
    `source lockup artboard is ${width} wide, expected ~1310.76. ` +
      `The art was re-cut — re-check MARK_WIDTH before trusting the mark crop.`,
  );
}

/** Remap the near-black fills so the art survives a dark background. */
function toDark(svg) {
  let out = svg;
  let replaced = 0;
  for (const hex of DARK_FAMILY) {
    const pattern = new RegExp(hex, "gi");
    replaced += (out.match(pattern) || []).length;
    out = out.replace(pattern, ON_DARK);
  }
  if (replaced === 0) {
    throw new Error(
      "no near-black fills found in the source art. Its palette changed — " +
        "check DARK_FAMILY before shipping an invisible logo.",
    );
  }
  return out;
}

/** Narrow the artboard to the mark. Paths outside the viewBox are clipped. */
function cropToMark(svg) {
  return svg.replace(
    /viewBox="[^"]+"/,
    `viewBox="${minX} ${minY} ${MARK_WIDTH} ${height}"`,
  );
}

const lockupDark = toDark(lockup);

mkdirSync(PUBLIC, { recursive: true });

const outputs = {
  "embersave-lockup.svg": lockup,
  "embersave-lockup-dark.svg": lockupDark,
  "embersave-mark.svg": cropToMark(lockup),
  "embersave-mark-dark.svg": cropToMark(lockupDark),
};

for (const [name, contents] of Object.entries(outputs)) {
  writeFileSync(join(PUBLIC, name), contents);
  console.log(`public/${name}`);
}

/*
  The favicon is the dark mark on a Coal tile. Browser chrome is light as
  often as dark, so the tile guarantees the frame stays visible instead of
  depending on the surrounding UI. Painted right after </defs> so it sits
  behind the artwork.
*/
const tile =
  `<rect x="${minX}" y="${minY}" width="${MARK_WIDTH}" height="${height}" ` +
  `rx="${(MARK_WIDTH * 0.18).toFixed(2)}" fill="#17191c"/>`;

const icon = cropToMark(lockupDark).replace(/(<\/defs>)/, `$1\n  ${tile}`);
if (!icon.includes(tile)) throw new Error("could not insert the favicon tile after </defs>");

writeFileSync(join(APP, "icon.svg"), icon);
console.log("app/icon.svg");
