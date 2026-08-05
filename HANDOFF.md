# Kaizen Portfolio — Session Handoff

_Last updated: 2026-08-03_

## Where we are right now

The site has been converted to **Swiss / International Typographic style, filtered
through a dev-tool landing page aesthetic** (neo-brutalist / editorial-minimal).
The design system is in place and enforced; most pages inherit it automatically.
Dev server: `http://localhost:3000`. All routes return 200.

### The design brief (the target)

- Monospaced uppercase micro-labels with wide letter-spacing, used as **metadata**
  rather than decoration (`01 — INDEX`, `AVAILABLE FOR WORK`, `29 SECTIONS`)
- Hairline rules and corner brackets / crop marks — borrowed from print
  registration marks
- Strict grid alignment, items pinned to column edges, section numbering (`01`)
- Sharp corners everywhere — no rounded radii, no shadows, no gradients
- Monochrome base + **one** accent, where the accent does semantic work
  (it highlights the load-bearing word in a headline)
- Heavy grotesque sans for display type (Inter / Helvetica Now family) against
  generous whitespace
- Small, dense buttons with arrow glyphs and uppercase mono labels

---

## The architecture — read this before editing anything

### `tailwind.config.ts` is the enforcement point

Every `borderRadius` key (**including `full`**) resolves to `0px`, and every
`boxShadow` key resolves to `none`. This is deliberate and load-bearing:

- A stray `rounded-full` or `shadow-lg` anywhere in the codebase is a no-op.
- Whole components converted without being touched — the projects page
  (`GitHubStats`) got sharp stat boxes, square contribution cells and ruled tabs
  purely from this change.
- **Do not relax these per-component.** If something needs a radius, the design
  is wrong, not the config.

Caveat: **arbitrary values bypass the theme.** `shadow-[0_20px_45px…]` and
`rounded-[8px]` still render. Those were stripped by hand; if you add new ones
they will punch a hole in the system.

### `app/globals.css` is the design system

Key primitives (all in `@layer components`):

| Class | Purpose |
| --- | --- |
| `.micro` (aliases: `.eyebrow`, `.section-number`, `.nb-label`) | Mono uppercase metadata label, 11px, `0.18em` tracking, tabular figures. **Muted by default.** |
| `.micro--accent` / `.micro--strong` | The only sanctioned colour escalations |
| `.micro--ruled` | Separates items with a hairline instead of a bullet |
| `.accent` | Marks the load-bearing word in a headline. **This is the accent's only job.** |
| `.crop-frame` + `.crop.crop--tl/tr/bl/br` | Print registration marks (four border-drawn L-shapes) |
| `.rule`, `.rule-t/b/l/r` | Hairline rules, one weight (`--rule`) |
| `.measure`, `.grid-12` | The single column measure + 12-col grid (4-col under 768px) |
| `.section-head` | Numbered, ruled section header |

Tokens: `--rule`, `--rule-color`, `--crop-len`, `--gutter`, `--measure`,
`--radius: 0`.

**Micro-labels are metadata, not decoration.** They used to be `color: primary`,
which is precisely what turned them into ornament. They are muted now so the
accent stays free to do semantic work. Please keep it that way.

### Typography — one typeface

`--font-display` is now just `--font-sans` (Geist Sans, a neo-grotesque in the
Inter / Helvetica Now family). The decorative **Sekuya display face was removed**
from `app/layout.tsx`. Hierarchy comes from scale and whitespace, never from
introducing a second personality. Geist Mono carries every micro-label.

### Surfaces

`.card`, `.nb-card`, `.testimonial-card`, `.skill-item`, `.approach-card` all
share **one** flat spec: hairline border, sharp corners, no shadow, no lift.
Hover shifts border colour and background only. `.liquid-glass` survives as
nav/hero chrome (translucency + blur for legibility) but its gradient sheen
border is gone.

---

## What's done

- **Foundation:** `globals.css` design system, `tailwind.config.ts` enforcement,
  `app/layout.tsx` fonts.
- **`components/Hero.tsx`** — rebuilt from scratch on the new system: crop marks,
  `01 — INDEX` / `AVAILABLE FOR WORK` spec row, accent on "products", grayscale
  portrait plate with caption, ruled stack spec, tabular `01/02/03` counts,
  draggable proof chip.
- **`components/Navbar.tsx`** — ruled bar instead of floating pill; mono uppercase
  labels; active state is a 1px accent tick (desktop bottom edge, mobile top
  edge) instead of a bubble; mobile circle badges removed.
- **`components/HeroVideoBackground.tsx`** — footage forced to `grayscale`
  (monochrome base), wash raised to `0.62`, decorative gradient overlay removed,
  scrim extended so the lower metadata rows sit on near-solid background.
- **Sitewide sweep:** 11 arbitrary `shadow-[…]` values and 8 `hover:-translate-y-*`
  lifts removed; decorative glows deleted from `Banner.tsx`,
  `ui/minimalist-hero.tsx`, `app/skills/page.tsx`.
- **`SpotlightCursor` removed** from `app/layout.tsx` — it painted a soft
  accent-coloured radial gradient under the pointer (exactly the ambient glow the
  brief rules out). `MagneticCursor` still provides a sharp custom cursor.
  Re-add the import + tag to restore.

Pages verified visually at 1440px and 390px: `/`, `/about`, `/contact`,
`/projects`, `/skills`.

## What's left

These still carry `rounded-*` classes (harmless — the config neutralises them)
but have **not been designed** to the system: no micro-labels, no rules, no grid,
no section numbering. In rough priority order:

1. `app/skills/page.tsx` — the icon cloud page
2. `app/projects/[slug]/page.tsx` — project detail
3. `components/BusinessIdeaForm.tsx` — the `/idea` form
4. `components/ThemeSwitcher.tsx`
5. `components/AboutMe.tsx`
6. `components/GitHubStats.tsx` — already reads well; mostly needs `.section-head`

Pattern to follow: `components/Hero.tsx`. Use `.measure` + `.grid-12`, pin items
to column edges, number the section, separate blocks with `.rule-t`/`.rule-b`,
and label metadata with `.micro`.

Remaining `bg-gradient-*` instances (`HeroVideoBackground`, `skills`, `Contact`,
`Projects`) are all **functional scrims** for text legibility over imagery — they
are fine, do not remove them reflexively.

---

## Known bugs

- **Preloader can hang for reduced-motion visitors.** `components/Preloader.tsx`'s
  `prefers-reduced-motion` path does `setPercent(100); await loadedPromise;` with
  **no timeout**. `loadedPromise` is tied to the window `load` event, which never
  fires if `/videos/hero-bg.mp4` stalls — so the visitor is stuck behind the
  preloader indefinitely. The normal path is capped (`MAX_MS = 6000`) and is fine.
  Pre-existing; not yet fixed.
- Pre-existing `tsc` errors in `components/ui/circular-testimonials.tsx`,
  `components/ui/flow-field-background.tsx`,
  `components/ui/interactive-icon-cloud.tsx`, `lib/motion.ts`. Untouched, unrelated.
- `motion() is deprecated. Use motion.create() instead.` — from
  `const MotionLink = motion(Link)` in `Navbar.tsx`. Cosmetic console warning.
- `app/globals.css.tmp.429242.08ef8c86bcb1` is a stray interrupted-write temp file.
  Its contents are **superseded** — safe to delete.

---

## Gotchas learned

- **`pkill -9 -f next-server` self-kills the shell** (the pattern matches pkill's
  own command line). Use `pkill -9 -f "[n]ext-server"`.
- Background `npm run dev` / chromium via shell `&` gets killed by the sandbox —
  use the Bash tool's `run_in_background: true`. Do **not** prefix commands with
  `export PATH=/usr/bin:/bin` (breaks npm/next resolution).
- If the site "won't load": stale `next-server` workers squat on ports 3000-3003.
  Fix: `pkill -9 -f "[n]ext-server" && rm -rf .next && npm run dev`.
- **Headless screenshots need three fixes**, not one. The GSAP preloader never
  completes headless (see the bug above), and `--virtual-time-budget` does not
  advance it. Drive Chrome over CDP with
  `--disable-background-timer-throttling --disable-backgrounding-occluded-windows
  --disable-renderer-backgrounding`, then before capturing, `Runtime.evaluate`:
  1. remove any `div.fixed.inset-0` with computed `z-index >= 9000` (the preloader);
  2. force `[data-reveal]` elements to `opacity: 1; transform: none` — GSAP scroll
     reveals are gated behind the preloader finishing, so ~16 of 24 elements on
     `/about` sit at opacity 0 and the page photographs completely blank.

  To tell "broken" from "hidden": evaluate `main.innerHTML.length` next to the
  count of `[data-reveal]` at opacity 0. Large HTML + many hidden reveals means
  the content is fine.
- CSS specificity trap that already bit once: `.crop-frame > .crop` (0,2,0) sets
  `border-width: 0`, which beats a bare `.crop--tl` (0,1,0) and makes the crop
  marks invisible. The modifiers are scoped as `.crop-frame > .crop--tl` to match
  weight. Keep new modifiers at the same specificity.
