import { ImageResponse } from "next/og";
import { readFileSync } from "node:fs";
import { join } from "node:path";

/*
  Generated at build time — the site is a static export, so this becomes a
  plain PNG on disk rather than a function.

  Brand §17 gives the social preview line: "Your world. Any host."
*/

/* `output: export` has no image server, so this must be baked at build time. */
export const dynamic = "force-static";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "embersave — your world, any host";

/**
 * The real lockup, inlined as a data URI.
 *
 * Satori renders `<img>` from a data URI reliably; hand-redrawing the pixel
 * art here would guarantee it drifts from the delivered asset.
 */
function lockupDataUri() {
  const svg = readFileSync(
    join(process.cwd(), "public", "embersave-lockup-dark.svg"),
    "utf8",
  );
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}

export default function OpengraphImage() {
  const lockup = lockupDataUri();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#17191C",
          padding: 72,
          fontFamily: "sans-serif",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={lockup} width={440} height={104} alt="embersave" />

        <div style={{ display: "flex", flexDirection: "column" }}>
          <span
            style={{
              fontSize: 82,
              fontWeight: 700,
              color: "#F7F4EE",
              letterSpacing: -2,
              lineHeight: 1.05,
            }}
          >
            Your world.
          </span>
          <span
            style={{
              fontSize: 82,
              fontWeight: 700,
              color: "#F27903",
              letterSpacing: -2,
              lineHeight: 1.05,
            }}
          >
            Any host.
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontSize: 27, color: "#A7ADB4" }}>
            Open-source shared save syncing for survival games.
          </span>
        </div>

        {/* A single ember line along the bottom edge. */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: 1200,
            height: 8,
            background: "#F27903",
            display: "flex",
          }}
        />
      </div>
    ),
    size,
  );
}
