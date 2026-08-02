/**
 * Site content and links, in one place.
 *
 * Nothing else in `app/` or `components/` may hardcode a URL, a tagline, or a
 * status word — the engine and community repos both enforce that rule
 * mechanically, and the website inherits it.
 *
 * Colour is deliberately NOT here. It lives once, in app/globals.css `@theme`.
 */

export const brand = {
  /** Brand §7: always lowercase, including at the start of a sentence. */
  name: "embersave",
  tagline: "Keep the world alive.",
  short: "Open-source shared save syncing for survival games.",
  description:
    "embersave is an open-source launcher that keeps one shared survival world moving between players, so nobody has to wait for the host to come online.",
} as const;

/**
 * Links. A `null` href means the thing does not exist yet, and the UI must
 * render it as unavailable rather than as a dead link.
 *
 * The community repo's `/gift` command refuses to print a placeholder Steam
 * link at someone trying to give money, on the grounds that a broken link on a
 * page about gifting is the exact shape of a scam. Same rule here.
 */
export const links = {
  engine: "https://github.com/18hrshift/palworld-shared-world",
  org: "https://github.com/18hrshift",
  license: "https://github.com/18hrshift/palworld-shared-world/blob/main/LICENSE",
  design:
    "https://github.com/18hrshift/palworld-shared-world/blob/main/docs/00-design.md",
  roadmap:
    "https://github.com/18hrshift/palworld-shared-world/blob/main/docs/03-roadmap.md",
  spike:
    "https://github.com/18hrshift/palworld-shared-world/blob/main/docs/05-phase0-spike.md",
  gameAdapter:
    "https://github.com/18hrshift/palworld-shared-world/issues/new?template=game_adapter.md",

  /** Scoped in the community repo, not created. No link until it exists. */
  discord: null,
  /** Installers exist but are unsigned and pre-alpha. No download page yet. */
  download: null,
} as const;

/**
 * Project status, stated plainly. The engine README makes a point of not
 * printing a test count that will rot; the website makes the same trade by
 * describing state rather than counting things.
 */
export const status = {
  label: "pre-alpha",
  detail: "Palworld works end to end. Installers are unsigned. Not ready for strangers yet.",
} as const;

/** How it works — the five beats from the engine README, compressed. */
export const steps = [
  {
    n: "01",
    title: "Open the launcher",
    body: "It shows the world: who hosted last, when it synced, and whether anyone is in it right now.",
  },
  {
    n: "02",
    title: "Claim the world",
    body: "If nobody is hosting, take it. The lease is atomic — two people clicking at once cannot both win.",
  },
  {
    n: "03",
    title: "Your PC becomes the server",
    body: "It pulls the newest save, verifies it, and starts the game server locally. Friends join in one click.",
  },
  {
    n: "04",
    title: "Checkpoints as you play",
    body: "The world is snapshotted in the background. Older versions stay restorable.",
  },
  {
    n: "05",
    title: "Pass it on",
    body: "Quit, and it uploads a final snapshot and releases the world. Someone else hosts tomorrow, from their house.",
  },
] as const;

/**
 * Brand §18 asks that no claim suggest data loss is impossible, and the engine
 * README ships a table of what the project is *not*. Keeping that table on the
 * marketing page is the point: it is the most trustworthy thing on it.
 */
export const honesty = [
  { claim: "Nobody has to be online for the world to persist", answer: true, note: "The whole point." },
  { claim: "Simple setup", answer: true, note: "One app. No VPS, no port forwarding tutorial." },
  { claim: "World joinable 24/7", answer: false, note: "Someone has to be hosting to play." },
  { claim: "Dedicated hardware", answer: false, note: "Though a gaming PC beats a budget VPS for four players." },
  { claim: "Public servers, 30 strangers", answer: false, note: "By design. This is a friends system." },
] as const;

/** Where things live. Mirrors the engine README's storage table. */
export const storage = [
  {
    what: "Save archives",
    where: "Your Google Drive",
    why: "You own them. Sharing the folder is what adds a friend to the world.",
    tone: "safe",
  },
  {
    what: "Lease + metadata",
    where: "A tiny always-on service",
    why: "Needs strong consistency. Kilobytes. Holds no save data.",
    tone: "cold",
  },
  {
    what: "The game server",
    where: "Whoever is hosting",
    why: "That is where the hardware already is.",
    tone: "ember",
  },
] as const;

export const games = [
  { name: "Palworld", state: "verified", note: "Proven on two machines, end to end." },
  { name: "Your game", state: "open", note: "An adapter is a config file and an interface." },
] as const;
