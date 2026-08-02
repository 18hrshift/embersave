import type { NextConfig } from "next";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  /*
    This app sits inside a folder that has lockfiles above it on the Desktop.
    Without pinning the root, Turbopack walks up and picks the wrong one.
  */
  turbopack: { root: dirname(fileURLToPath(import.meta.url)) },

  // The site is a static brochure: no server data, no auth, no revalidation.
  // Exporting it means Vercel serves plain files from the edge and there is
  // no function to cold-start, which matches the project's claim that the
  // hosted surface costs essentially nothing to run.
  output: "export",

  // `output: export` has no image optimization server.
  images: { unoptimized: true },
};

export default nextConfig;
