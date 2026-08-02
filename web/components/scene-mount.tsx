"use client";

import dynamic from "next/dynamic";

/**
 * The scene needs WebGL and a document, so it cannot be prerendered — the site
 * is a static export and would crash at build time otherwise.
 *
 * There is no loading spinner on purpose. The hero is fully legible without
 * the canvas; the scene arrives underneath it a moment later and nothing
 * reflows when it does.
 */
const EmberScene = dynamic(() => import("./ember-scene"), { ssr: false });

export default function SceneMount() {
  return <EmberScene />;
}
