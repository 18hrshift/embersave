import { Wordmark } from "./logo";
import { brand, links } from "@/lib/brand";

const docs = [
  { href: links.design, label: "Design" },
  { href: links.roadmap, label: "Roadmap" },
  { href: links.spike, label: "Spike protocol" },
  { href: links.license, label: "Licence" },
];

export function Footer() {
  return (
    <footer className="border-t border-coal-edge/60 py-12">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-xs">
          <Wordmark className="h-7 w-auto" />
          <p className="mt-3 text-sm leading-relaxed text-ash">{brand.short}</p>
          <p className="mt-4 text-sm text-ash/60">
            Built by{" "}
            <a
              href={links.org}
              target="_blank"
              rel="noreferrer"
              className="text-ash transition-colors hover:text-ember"
            >
              18hrshift
            </a>
          </p>
        </div>

        <nav className="flex gap-12" aria-label="Footer">
          <div>
            <h2 className="mb-3 font-mono text-xs uppercase tracking-widest text-ash/50">
              Docs
            </h2>
            <ul className="space-y-2">
              {docs.map((doc) => (
                <li key={doc.label}>
                  <a
                    href={doc.href}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-ash transition-colors hover:text-warm-white"
                  >
                    {doc.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="mb-3 font-mono text-xs uppercase tracking-widest text-ash/50">
              Project
            </h2>
            <ul className="space-y-2">
              <li>
                <a
                  href={links.engine}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-ash transition-colors hover:text-warm-white"
                >
                  GitHub
                </a>
              </li>
              {/*
                links.discord is null until the server exists. Rendering it as
                plain, unlinked text is the honest form — a dead invite on a
                page asking people to join a community is worse than no invite.
              */}
              <li>
                <span
                  className="text-sm text-ash/40"
                  title="Scoped, not created yet"
                >
                  Discord — soon
                </span>
              </li>
              <li>
                <span
                  className="text-sm text-ash/40"
                  title="Installers are unsigned; no download page yet"
                >
                  Download — soon
                </span>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </footer>
  );
}
