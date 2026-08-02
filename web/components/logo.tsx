/**
 * The embersave mark and wordmark.
 *
 * These render the delivered art from `ember save logos/`, not a redrawing of
 * it. `scripts/build-logo-assets.mjs` copies the source SVGs into public/ and
 * emits `-dark` variants with the near-black fills remapped to Warm White,
 * because the sync frame and the "ember" half of the wordmark are drawn for a
 * light background and vanish on Coal.
 *
 * The art is pixel art. It is deliberately not reproduced as smooth geometry.
 */

/** Aspect ratios of the source artboards, used to avoid layout shift. */
const MARK_RATIO = 322.61 / 309.99;
const LOCKUP_RATIO = 1310.76 / 309.99;

export function Logo({
  className = "",
  onDark = true,
}: {
  className?: string;
  onDark?: boolean;
}) {
  return (
    <img
      src={onDark ? "/embersave-mark-dark.svg" : "/embersave-mark.svg"}
      alt=""
      aria-hidden="true"
      width={Math.round(32 * MARK_RATIO)}
      height={32}
      className={className}
    />
  );
}

/**
 * The full lockup: mark plus wordmark. Used wherever the brand signs itself.
 *
 * The wordmark is part of the artwork, so there is no text node here — the
 * `alt` carries the name for assistive tech and search.
 */
export function Wordmark({
  className = "",
  onDark = true,
}: {
  className?: string;
  onDark?: boolean;
}) {
  return (
    <img
      src={onDark ? "/embersave-lockup-dark.svg" : "/embersave-lockup.svg"}
      alt="embersave"
      width={Math.round(28 * LOCKUP_RATIO)}
      height={28}
      className={className}
    />
  );
}
