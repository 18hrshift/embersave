import { Wordmark } from "./logo";
import { brand, links } from "@/lib/brand";

/*
  Only links a visitor has a reason to open. The engine's design notes,
  roadmap, and spike protocol are working documents for the people building
  it — linking them here made the site read as an internal status page.
*/
const project = [
  { href: links.engine, label: "GitHub", external: true },
  { href: links.requestGame, label: "Request a game", external: true },
  { href: links.license, label: "Licence", external: true },
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
              Project
            </h2>
            <ul className="space-y-2">
              {project.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-ash transition-colors hover:text-warm-white"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="mb-3 font-mono text-xs uppercase tracking-widest text-ash/50">
              Coming
            </h2>
            {/*
              links.discord and links.download are null until those things
              exist. Rendering them as plain, unlinked text is the honest form
              — a dead invite on a page asking people to join is worse than no
              invite at all.
            */}
            <ul className="space-y-2">
              <li>
                <span className="text-sm text-ash/40" title="Not created yet">
                  Discord
                </span>
              </li>
              <li>
                <span className="text-sm text-ash/40" title="No public build yet">
                  Download
                </span>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </footer>
  );
}
