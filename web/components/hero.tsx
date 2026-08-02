import SceneMount from "./scene-mount";
import { brand, links, status } from "@/lib/brand";

export function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] items-center overflow-hidden pt-16"
    >
      {/* The scene sits behind the copy and is decorative — the page reads without it. */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <SceneMount />
        {/* Hold contrast under the headline regardless of what the scene is doing. */}
        <div className="absolute inset-0 bg-gradient-to-r from-coal via-coal/85 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-coal to-transparent" />
      </div>

      <div className="relative mx-auto w-full max-w-6xl px-5">
        <div className="max-w-2xl">
          <p className="reveal mb-5 inline-flex items-center gap-2 rounded-full border border-coal-edge bg-coal-raised/80 px-3 py-1 font-mono text-xs text-ash">
            open source
            <span className="text-coal-edge" aria-hidden="true">
              /
            </span>
            AGPL-3.0
            <span className="text-coal-edge" aria-hidden="true">
              /
            </span>
            free
          </p>

          <h1 className="reveal text-5xl font-bold leading-[1.05] text-warm-white sm:text-6xl lg:text-7xl">
            Keep the world
            <br />
            <span className="text-ember">alive.</span>
          </h1>

          <p className="reveal mt-6 max-w-xl text-lg leading-relaxed text-ash">
            {brand.description}
          </p>

          <p className="reveal mt-4 max-w-xl leading-relaxed text-ash/80">
            Your PC becomes the server when it's your turn, and hands the world
            on when you're done. One shared save, passed around a friend group —
            no rented box, no 24/7 machine, no waiting on one person.
          </p>

          <div className="reveal mt-9 flex flex-wrap items-center gap-3">
            <a
              href={links.engine}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center gap-2 rounded-lg bg-ember px-5 py-3 font-semibold text-coal transition-transform hover:-translate-y-0.5"
            >
              Read the source
              <span
                className="transition-transform group-hover:translate-x-0.5"
                aria-hidden="true"
              >
                →
              </span>
            </a>

            <a
              href="#how"
              className="inline-flex items-center gap-2 rounded-lg border border-coal-edge bg-coal-raised px-5 py-3 font-medium text-warm-white transition-colors hover:border-ash/40"
            >
              How it works
            </a>
          </div>

          {/*
            Brand §18: no claim may overstate readiness. The engine README is
            blunt that this is not ready for strangers, so the landing page is
            blunt too — and there is deliberately no download button yet,
            because the installers are unsigned.
          */}
          <p className="reveal mt-8 flex items-start gap-2.5 font-mono text-sm text-ash/70">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" aria-hidden="true" />
            <span>
              <span className="text-gold">{status.label}</span> — {status.detail}
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
