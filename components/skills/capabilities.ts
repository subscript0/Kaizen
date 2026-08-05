import {
  Bug,
  Cloud,
  Code2,
  Database,
  Network,
  Radar,
  ServerCog,
  ShieldCheck,
  Smartphone,
  type LucideIcon,
} from 'lucide-react';

/**
 * The content of /skills — the single source of truth for the stack.
 *
 * Seven disciplines: frontend, backend, database, tooling, cloud, design and
 * cybersecurity. `skills` in `lib/data.ts` is DERIVED from this list rather
 * than written out a second time; the two used to be maintained by hand and
 * drifted, so the home page's capability panel advertised tools that the skills
 * page had already dropped. Add a tool here and both surfaces pick it up.
 *
 * ── Plate colour ───────────────────────────────────────────────────────────
 * Each discipline owns a hue. It is baked into that discipline's plate and
 * reused to tint any tool in the list that has no brand mark of its own, so a
 * chapter reads as one colour rather than as artwork plus unrelated glyphs.
 * `scripts/build-skill-plates.py` carries the same seven hexes — change one and
 * change it there, then re-run the script.
 *
 * ── Imagery ────────────────────────────────────────────────────────────────
 * Every plate is a local file under `/public/skills`. Nothing here points at a
 * CDN: `next.config.ts` ships `images.remotePatterns: []`, so a remote host
 * throws at request time, and this machine has no outbound network anyway — a
 * remote plate would render as a blank rectangle nobody could catch in review.
 *
 * The plates are TYPOGRAPHIC, not photographic: each one sets its own
 * discipline — FRONTEND, BACKEND, DATABASE — in display type in that
 * discipline's colour. They replaced product screenshots, which were the right
 * kind of image for /projects and the wrong kind here: a Kanban board next to
 * the word "Frontend" was an arbitrary pairing, so the reader had to take the
 * caption's word for the connection. A plate that says FRONTEND needs no
 * caption to be about frontend, and it still reads at the thumbnail size the
 * column collapses to on mobile.
 *
 * ── Marks ──────────────────────────────────────────────────────────────────
 * Path data comes from `./marks.ts`, inlined from the Simple Icons set. NOT
 * from `/logo/*.png` — that directory does not exist in the repo, so every one
 * of those would render broken.
 *
 * `color` overrides only where the true brand colour would be invisible on the
 * near-black surface (the achromatic marks: Next.js, Express and GitHub). The
 * site runs BOTH a near-black and a near-white theme with no `dark` class to
 * branch on, so each override is one hex picked to clear both.
 *
 * Simple Icons publishes no mark for AWS, VS Code or React Native — verified
 * against the local `react-icons/si` set, which carries none of them — so those
 * fall back to a Lucide glyph tinted to the brand's colour. The same fallback
 * carries the cybersecurity practices, which are disciplines rather than
 * products and have no mark to publish.
 */

/** Used for the Lucide fallback when a tech has no brand colour at all. */
export const NEUTRAL_MARK = 'hsl(var(--foreground-muted))';

/**
 * One hue per discipline. Hex WITHOUT '#', matching `Tech['color']`.
 * Each is picked to clear both the near-black and the near-white theme.
 */
export const PLATE = {
  frontend: '4FD6FF',
  backend: '6EE787',
  database: '7C9CFF',
  tools: '2FD9C0',
  cloud: 'FF9E2C',
  design: 'C084FC',
  security: 'FF5470',
} as const;

export type Tech = {
  name: string;
  /** ≤ 52 chars — sits on one line beside the name on wide screens. */
  note: string;
  /** Simple Icons slug, keyed into `marks.ts`. Omitted when there is no mark. */
  slug?: string;
  /**
   * Hex WITHOUT '#'. Omit to get the true brand colour. Set only when the brand
   * colour would disappear against the near-black surface. Also tints the
   * Lucide fallback.
   */
  color?: string;
  /** Drawn when there is no published brand mark. */
  icon?: LucideIcon;
};

export type Capability = {
  /** Matches the `category` key derived into `lib/data.ts`. */
  id: string;
  title: string;
  /** Uppercase metadata label for the micro rails. */
  label: string;
  lede: string;
  /**
   * Spec chips under the heading. An ARRAY, not one string: `.micro` is an
   * `inline-flex` with `line-height: 1`, so a single long label either runs off
   * a 390px screen or wraps into overlapping lines. Short items in a wrapping
   * row do neither.
   */
  spec: string[];
  /** Local path under /public. Remote hosts do not work here — see the note. */
  image: string;
  alt: string;
  techs: Tech[];
};

export const capabilities: Capability[] = [
  {
    id: 'frontend',
    title: 'Frontend',
    label: 'Interface',
    lede: 'Interfaces that answer before you finish the gesture — typed, token-driven, and built on real elements.',
    spec: ['Semantic markup', 'Typed components', 'Design tokens'],
    image: '/skills/frontend.jpg',
    alt: 'Title plate reading FRONTEND in large cyan display type, with HTML5, CSS3, React, Next.js and Tailwind listed alongside it',
    techs: [
      { name: 'HTML5', note: 'Semantic structure, landmarks, real elements.', slug: 'html5' },
      { name: 'CSS3', note: 'Layout, cascade and motion without a helper.', slug: 'css' },
      { name: 'JavaScript', note: 'The language everything else compiles down to.', slug: 'javascript' },
      { name: 'TypeScript', note: 'Types as the first test, before runtime.', slug: 'typescript' },
      { name: 'React', note: 'Component model behind every surface I ship.', slug: 'react' },
      // Next.js's mark is pure black — lifted to a neutral so it survives the
      // near-black surface without inventing a colour the brand does not have.
      { name: 'Next.js', note: 'App Router and the routing this site runs on.', slug: 'nextdotjs', color: 'A3A3A3' },
      // No published mark of its own; a device glyph in React's cyan reads as
      // "React, on a phone" without pretending to be a second React logo.
      { name: 'React Native', note: 'The same component model, shipped to a phone.', icon: Smartphone, color: '61DAFB' },
      { name: 'Tailwind CSS', note: 'Token-driven styling, never raw hex.', slug: 'tailwindcss' },
    ],
  },
  {
    id: 'backend',
    title: 'Backend',
    label: 'Services',
    lede: 'APIs that stay boring under load, with the contract typed all the way to the client.',
    spec: ['REST endpoints', 'Idempotent writes', 'Typed contracts'],
    image: '/skills/backend.jpg',
    alt: 'Title plate reading BACKEND in large green display type, with Node.js, Express, Python and PHP listed alongside it',
    techs: [
      { name: 'Node.js', note: 'Runtime for APIs, jobs and real-time work.', slug: 'nodedotjs' },
      // Express's mark is pure black, same treatment as Next.js.
      { name: 'Express.js', note: 'Thin middleware where a framework is overkill.', slug: 'express', color: 'A3A3A3' },
      { name: 'Python', note: 'Scripts, automation and anything data-shaped.', slug: 'python' },
      { name: 'PHP', note: 'Server-rendered stacks and the estates that run them.', slug: 'php' },
    ],
  },
  {
    id: 'database',
    title: 'Database',
    label: 'State',
    lede: 'State modelled once and queried everywhere — schema first, migrations in version control.',
    spec: ['Schema first', 'Indexed reads', 'Reversible migrations'],
    image: '/skills/database.jpg',
    alt: 'Title plate reading DATABASE in large indigo display type, with SQL, MongoDB, Neon, Supabase and Firebase listed alongside it',
    techs: [
      // "SQL" is a language, not a product, so there is no mark to use.
      { name: 'SQL', note: 'Joins, indexes and queries that stay fast.', icon: Database, color: PLATE.database },
      { name: 'MongoDB', note: 'Documents for shapes a table resists.', slug: 'mongodb' },
      { name: 'Neon (PostgreSQL)', note: 'Serverless Postgres with branchable databases.', slug: 'neon' },
      { name: 'Supabase', note: 'Postgres, auth and storage behind one API.', slug: 'supabase' },
      { name: 'Firebase', note: 'Realtime sync and auth for a fast launch.', slug: 'firebase' },
    ],
  },
  {
    id: 'tools',
    title: 'Tooling',
    label: 'Delivery',
    lede: 'The same build, everywhere, every time — packaged once and shipped without ceremony.',
    spec: ['Readable history', 'Reproducible images', 'One deploy'],
    image: '/skills/tools.jpg',
    alt: 'Title plate reading TOOLING in large teal display type, with Git, GitHub, Docker, npm, pnpm and Linux listed alongside it',
    techs: [
      { name: 'Git', note: 'Branch discipline and a readable history.', slug: 'git' },
      // GitHub's mark is near-black, same treatment as Next.js and Express.
      { name: 'GitHub', note: 'Reviews, releases and CI in one place.', slug: 'github', color: 'A3A3A3' },
      { name: 'Docker', note: 'Reproducible images, local matches production.', slug: 'docker' },
      // Dropped from Simple Icons for trademark reasons — Lucide glyph in the
      // editor's blue.
      { name: 'VS Code', note: 'Editor, debugger and terminal in one window.', icon: Code2, color: '3B9EFF' },
      { name: 'npm', note: 'Registry and scripts for the whole toolchain.', slug: 'npm' },
      { name: 'pnpm', note: 'Content-addressed installs, no duplicate trees.', slug: 'pnpm' },
      { name: 'Postman', note: 'Requests captured and replayed against an API.', slug: 'postman' },
      { name: 'Linux', note: 'What everything here is built and run on.', slug: 'linux' },
    ],
  },
  {
    id: 'cloud',
    title: 'Cloud',
    label: 'Infrastructure',
    lede: 'Somewhere for the work to live that does not fall over on the day it finally gets traffic.',
    spec: ['Hosting', 'Object storage', 'CDN delivery'],
    image: '/skills/cloud.jpg',
    alt: 'Title plate reading CLOUD in large orange display type, with AWS, hosting, storage and delivery listed alongside it',
    techs: [
      // Also dropped from Simple Icons — Lucide glyph in AWS orange.
      { name: 'Amazon Web Services', note: 'Hosting, storage and delivery for shipped work.', icon: Cloud, color: 'FF9900' },
    ],
  },
  {
    id: 'design',
    title: 'Design',
    label: 'Craft',
    lede: 'Decisions made in the file, not in the code — spacing, type and states settled before a build starts.',
    spec: ['Layout systems', 'Type scale', 'Component states'],
    image: '/skills/design.jpg',
    alt: 'Title plate reading DESIGN in large violet display type, with Figma, layout, type scale and component states listed alongside it',
    techs: [
      { name: 'Figma', note: 'Where a layout is settled before it is built.', slug: 'figma' },
    ],
  },
  {
    id: 'security',
    title: 'Cybersecurity',
    label: 'Defence',
    lede: 'Reading a system the way an attacker would, then writing down exactly how to close it.',
    spec: ['Recon', 'Web app testing', 'Hardening'],
    image: '/skills/security.jpg',
    alt: 'Title plate reading CYBERSECURITY in large red display type, with Linux, networking, OSINT and web security listed alongside it',
    techs: [
      { name: 'Linux', note: 'Shell, permissions and the tooling that lives there.', slug: 'linux' },
      // The rest are practices rather than products, so they take the
      // discipline's own colour instead of a brand's.
      { name: 'Networking', note: 'TCP/IP, DNS, and how traffic actually moves.', icon: Network, color: PLATE.security },
      { name: 'OSINT', note: 'Public sources, assembled into a real picture.', icon: Radar, color: PLATE.security },
      { name: 'Web Security', note: 'The OWASP Top 10, and fixing what it finds.', icon: ShieldCheck, color: PLATE.security },
      { name: 'Ethical Hacking', note: 'Authorised testing, findings written up.', icon: Bug, color: PLATE.security },
      { name: 'Server Administration', note: 'Hardening, users, services and backups.', icon: ServerCog, color: PLATE.security },
    ],
  },
];

/**
 * Every tool, flattened, in the order the disciplines are read — DEDUPED by
 * name. Linux is claimed by both Tooling and Cybersecurity, and the mark wall
 * and the marquee both key their children by `tech.name`, so a raw flatMap
 * hands React two children with the same key.
 */
export const ALL_TECHS: Tech[] = capabilities
  .flatMap((c) => c.techs)
  .filter((tech, i, all) => all.findIndex((t) => t.name === tech.name) === i);

/**
 * Distinct tools — what the ledger counts and what the mark wall lights up.
 * Deliberately the deduped length rather than the sum of the chapters, so the
 * figure on screen matches the number of marks a visitor can actually count.
 */
export const TOTAL_TECHS = ALL_TECHS.length;

/** Names only — for the marquee band and the screen-reader list under it. */
export const TECH_NAMES: string[] = ALL_TECHS.map((t) => t.name);
