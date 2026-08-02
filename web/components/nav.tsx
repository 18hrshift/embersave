import { Wordmark } from "./logo";
import { links, status } from "@/lib/brand";

const sections = [
  { href: "#how", label: "How it works" },
  { href: "#where", label: "Your saves" },
  { href: "#honest", label: "What it isn't" },
  { href: "#games", label: "Games" },
];

export function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-coal-edge/60 bg-coal/80 backdrop-blur-md">
      <nav
        className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5"
        aria-label="Main"
      >
        <a href="#top" className="shrink-0" aria-label="embersave, back to top">
          <Wordmark className="h-7 w-auto" />
        </a>

        <div className="hidden items-center gap-7 md:flex">
          {sections.map((section) => (
            <a
              key={section.href}
              href={section.href}
              className="text-sm text-ash transition-colors hover:text-warm-white"
            >
              {section.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <span
            className="hidden items-center gap-1.5 rounded-full border border-gold/30 bg-gold/10 px-2.5 py-1 font-mono text-[0.7rem] text-gold sm:inline-flex"
            title={status.detail}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-gold" aria-hidden="true" />
            {status.label}
          </span>

          <a
            href={links.engine}
            target="_blank"
            rel="noreferrer"
            className="rounded-md border border-coal-edge bg-coal-raised px-3 py-1.5 text-sm font-medium text-warm-white transition-colors hover:border-ember/50 hover:text-ember"
          >
            Source
          </a>
        </div>
      </nav>
    </header>
  );
}
