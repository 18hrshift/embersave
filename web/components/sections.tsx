import { games, honesty, links, status, steps, storage } from "@/lib/brand";

function SectionHeading({
  eyebrow,
  title,
  lede,
}: {
  eyebrow: string;
  title: string;
  lede?: string;
}) {
  return (
    <div className="mb-12 max-w-2xl">
      <p className="mb-3 font-mono text-xs uppercase tracking-widest text-ember">
        {eyebrow}
      </p>
      <h2 className="text-3xl font-bold text-warm-white sm:text-4xl">{title}</h2>
      {lede ? <p className="mt-4 text-lg leading-relaxed text-ash">{lede}</p> : null}
    </div>
  );
}

/** The problem, stated the way the engine README states it. */
export function Problem() {
  return (
    <section className="border-t border-coal-edge/60 py-24">
      <div className="mx-auto max-w-6xl px-5">
        <SectionHeading
          eyebrow="The problem"
          title="Co-op survival games come in two shapes, and both are annoying."
        />

        <div className="grid gap-5 md:grid-cols-2">
          <article className="rounded-xl border border-coal-edge bg-coal-raised p-7">
            <h3 className="mb-2 text-lg font-semibold text-warm-white">
              Host-authoritative
            </h3>
            <p className="leading-relaxed text-ash">
              The world lives on one person's PC. If they're offline, nobody
              plays.
            </p>
          </article>

          <article className="rounded-xl border border-coal-edge bg-coal-raised p-7">
            <h3 className="mb-2 text-lg font-semibold text-warm-white">
              Dedicated-server-only
            </h3>
            <p className="leading-relaxed text-ash">
              The world needs a machine up 24/7. Someone pays for it and
              administers it.
            </p>
          </article>
        </div>

        <p className="mt-8 max-w-2xl leading-relaxed text-ash">
          So four friends rent a{" "}
          <span className="font-mono text-warm-white">$12/month</span> server,
          play hard for three weeks, drift apart, and cancel by month two.{" "}
          <span className="text-warm-white">Everyone has done this.</span>
        </p>

        <p className="mt-4 max-w-2xl leading-relaxed text-ash">
          Hosting should be a role you take, not a machine you own. embersave is
          that layer, for the games that don't have it.
        </p>
      </div>
    </section>
  );
}

/** The five beats of a session. */
export function HowItWorks() {
  return (
    <section id="how" className="border-t border-coal-edge/60 py-24">
      <div className="mx-auto max-w-6xl px-5">
        <SectionHeading
          eyebrow="How it works"
          title="Pass the save, not the problem."
          lede="Exactly one machine is ever authoritative. That invariant is the whole system — everything else is plumbing around it."
        />

        <ol className="relative space-y-px">
          {steps.map((step) => (
            <li
              key={step.n}
              className="group relative flex flex-col gap-3 border-l-2 border-coal-edge py-6 pl-8 transition-colors hover:border-ember sm:flex-row sm:gap-8"
            >
              <span
                className="absolute -left-[7px] top-8 h-3 w-3 rounded-full border-2 border-coal bg-coal-edge transition-colors group-hover:bg-ember"
                aria-hidden="true"
              />
              <span className="shrink-0 font-mono text-sm text-ember sm:w-16">
                {step.n}
              </span>
              <div className="sm:flex-1">
                <h3 className="mb-1.5 text-lg font-semibold text-warm-white">
                  {step.title}
                </h3>
                <p className="max-w-xl leading-relaxed text-ash">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/** Where the data lives — the trust section. */
export function Storage() {
  const accent = {
    safe: "text-safe border-safe/30 bg-safe/10",
    cold: "text-cold border-cold/30 bg-cold/10",
    ember: "text-ember border-ember/30 bg-ember/10",
  } as const;

  return (
    <section id="where" className="border-t border-coal-edge/60 py-24">
      <div className="mx-auto max-w-6xl px-5">
        <SectionHeading
          eyebrow="Your saves"
          title="They live in your own Google Drive. Not ours."
          lede="The saves sit in an ordinary Drive folder you can open, copy, or walk away with. Sharing that folder with a friend is what adds them to the world — the Drive permission model is the group membership model."
        />

        <div className="grid gap-5 md:grid-cols-3">
          {storage.map((row) => (
            <article
              key={row.what}
              className="flex flex-col rounded-xl border border-coal-edge bg-coal-raised p-7"
            >
              <span
                className={`mb-4 inline-flex w-fit rounded-md border px-2.5 py-1 font-mono text-xs ${
                  accent[row.tone as keyof typeof accent]
                }`}
              >
                {row.where}
              </span>
              <h3 className="mb-2 text-lg font-semibold text-warm-white">
                {row.what}
              </h3>
              <p className="leading-relaxed text-ash">{row.why}</p>
            </article>
          ))}
        </div>

        <p className="mt-8 max-w-2xl leading-relaxed text-ash">
          The only thing hosted anywhere else is the lease: a few kilobytes
          saying who's allowed to host right now. It holds no save data, which is
          what makes it free to run and harmless if it goes down.{" "}
          <span className="text-warm-white">
            You can also self-host the whole thing
          </span>{" "}
          — same codebase, different config.
        </p>
      </div>
    </section>
  );
}

/** What this is honest about not being. Kept from the engine README on purpose. */
export function Honesty() {
  return (
    <section id="honest" className="border-t border-coal-edge/60 py-24">
      <div className="mx-auto max-w-6xl px-5">
        <SectionHeading
          eyebrow="What it isn't"
          title="A step up from taking turns. Still below a dedicated server."
          lede="If you run a public community server, keep renting one. If you and three friends just want your world to still be there next Tuesday, this is for you."
        />

        <div className="overflow-hidden rounded-xl border border-coal-edge">
          <table className="w-full text-left">
            <caption className="sr-only">
              Reasons people rent a game server, and whether embersave replaces
              each one
            </caption>
            <thead>
              <tr className="border-b border-coal-edge bg-coal-raised">
                <th scope="col" className="px-6 py-4 text-sm font-semibold text-ash">
                  Why people rent a server
                </th>
                <th scope="col" className="px-6 py-4 text-sm font-semibold text-ash">
                  Does this replace it?
                </th>
              </tr>
            </thead>
            <tbody>
              {honesty.map((row) => (
                <tr
                  key={row.claim}
                  className="border-b border-coal-edge/60 last:border-0"
                >
                  <td className="px-6 py-5 align-top text-warm-white">
                    {row.claim}
                  </td>
                  <td className="px-6 py-5 align-top">
                    {/*
                      Brand §9: never communicate state through colour alone.
                      Every verdict carries a glyph and a word.
                    */}
                    <span
                      className={`mb-1 flex items-center gap-2 font-semibold ${
                        row.answer ? "text-safe" : "text-conflict"
                      }`}
                    >
                      <span aria-hidden="true">{row.answer ? "✓" : "✕"}</span>
                      {row.answer ? "Yes" : "No"}
                    </span>
                    <span className="text-sm text-ash">{row.note}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

/** Games and the adapter invitation. */
export function Games() {
  return (
    <section id="games" className="border-t border-coal-edge/60 py-24">
      <div className="mx-auto max-w-6xl px-5">
        <SectionHeading
          eyebrow="Games"
          title="Palworld first. The core doesn't know what Palworld is."
          lede="Game-specific behaviour lives behind an adapter interface. Adding a game is a config descriptor plus an adapter — if it ever requires touching the coordinator, the abstraction failed and we fix the abstraction."
        />

        <div className="grid gap-5 sm:grid-cols-2">
          {games.map((game) => {
            const verified = game.state === "verified";
            return (
              <article
                key={game.name}
                className={`rounded-xl border p-7 ${
                  verified
                    ? "border-safe/30 bg-safe/5"
                    : "border-dashed border-coal-edge bg-coal-raised"
                }`}
              >
                <div className="mb-3 flex items-center justify-between gap-4">
                  <h3 className="text-lg font-semibold text-warm-white">
                    {game.name}
                  </h3>
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 font-mono text-xs ${
                      verified
                        ? "bg-safe/15 text-safe"
                        : "bg-coal-edge/60 text-ash"
                    }`}
                  >
                    <span aria-hidden="true">{verified ? "✓" : "+"}</span>
                    {game.state}
                  </span>
                </div>
                <p className="leading-relaxed text-ash">{game.note}</p>
              </article>
            );
          })}
        </div>

        <div className="mt-10 rounded-xl border border-coal-edge bg-coal-raised p-7">
          <h3 className="mb-2 text-lg font-semibold text-warm-white">
            The useful contribution isn't code
          </h3>
          <p className="mb-5 max-w-2xl leading-relaxed text-ash">
            It's running the feasibility spike for a game you play. The
            hard-won part of this project is per-game empirical knowledge, and
            the question that decides whether a game is possible at all is
            whether your character survives on someone else's machine.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href={links.gameAdapter}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-ember px-4 py-2.5 text-sm font-semibold text-coal transition-transform hover:-translate-y-0.5"
            >
              Propose a game →
            </a>
            <a
              href={links.spike}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-coal-edge px-4 py-2.5 text-sm font-medium text-warm-white transition-colors hover:border-ash/40"
            >
              Read the spike protocol
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Closing note on price and licence. */
export function Closing() {
  return (
    <section className="border-t border-coal-edge/60 py-24">
      <div className="mx-auto max-w-6xl px-5">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-warm-white sm:text-4xl">
            Free. No tiers, no accounts to upgrade.
          </h2>
          <p className="mt-5 leading-relaxed text-ash">
            The hosted lease service costs essentially nothing to run — a few
            kilobytes per world — so it's free. If it saves you a server rental,
            throw a coffee at it. If it doesn't, don't.
          </p>
          <p className="mt-4 leading-relaxed text-ash">
            Licensed{" "}
            <a
              href={links.license}
              target="_blank"
              rel="noreferrer"
              className="text-ember underline underline-offset-4 hover:text-gold"
            >
              AGPL-3.0
            </a>
            . Run it, modify it, self-host it. If you run a modified version as a
            network service, publish your changes — the intent is narrow: keep a
            server-rental company from absorbing this and reselling it closed.
          </p>

          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <a
              href={links.engine}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-ember px-5 py-3 font-semibold text-coal transition-transform hover:-translate-y-0.5"
            >
              View on GitHub →
            </a>
            <a
              href={links.design}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-coal-edge bg-coal-raised px-5 py-3 font-medium text-warm-white transition-colors hover:border-ash/40"
            >
              Read the design doc
            </a>
          </div>

          <p className="mt-8 font-mono text-sm text-ash/60">{status.detail}</p>
        </div>
      </div>
    </section>
  );
}
