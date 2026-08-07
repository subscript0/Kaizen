export type BaseMode   = 'dark' | 'light';
export type AccentName = 'ink' | 'yellow';

/** The four things the UI needs to be able to SAY, independent of the accent. */
export type SemanticName = 'success' | 'warning' | 'danger' | 'info';

/**
 * A semantic state, in the same three parts as an accent (see AccentTheme):
 * a FILL, the INK that stays legible on that fill, and the state used as TYPE
 * on the page itself.
 *
 * `foreground` is hand-set per mode rather than run through `onPrimary()`.
 * That helper's "lightness >= 55 → dark ink" rule is a decent guess for an
 * arbitrary user-picked colour but it is wrong for saturated yellows — white
 * on hsl(38 92% 50%) measures 2.75:1 — and these four values are fixed, so
 * there is nothing to guess.
 *
 * All twelve triplets below are measured against their own surface:
 * `ink` clears 4.5:1 on the mode's page colour, `foreground` clears 4.5:1 on
 * its own `fill`.
 */
export interface SemanticTheme {
  fill: string;
  foreground: string;
  ink: string;
}

export const semantics: Record<BaseMode, Record<SemanticName, SemanticTheme>> = {
  // On paper the fills have to go DARK to hold white ink, and the type colours
  // go darker still — a mid-tone green or amber is invisible on #f7f7f7.
  light: {
    success: { fill: '152 62% 30%', foreground: '0 0% 97%', ink: '152 70% 24%' },
    warning: { fill: '38 92% 50%',  foreground: '0 0% 8%',  ink: '32 90% 30%'  },
    danger:  { fill: '0 72% 42%',   foreground: '0 0% 97%', ink: '0 70% 38%'   },
    info:    { fill: '210 85% 38%', foreground: '0 0% 97%', ink: '210 85% 33%' },
  },
  // On the dark page the same four hues move up in lightness instead.
  dark: {
    success: { fill: '152 55% 45%', foreground: '0 0% 8%',  ink: '152 55% 62%' },
    warning: { fill: '38 92% 55%',  foreground: '0 0% 8%',  ink: '38 92% 62%'  },
    danger:  { fill: '0 72% 46%',   foreground: '0 0% 97%', ink: '0 80% 68%'   },
    info:    { fill: '205 85% 52%', foreground: '0 0% 8%',  ink: '205 85% 66%' },
  },
};

export interface BaseTheme {
  label: string;
  background: string;
  backgroundLight: string;
  foreground: string;
  muted: string;
  mutedForeground: string;
  border: string;
  /** Neutral chip fill — always the INVERSE of the surface, in both modes. */
  secondary: string;
  secondaryForeground: string;
}

export interface AccentTheme {
  label: string;
  swatch: string;
  /**
   * Keyed by base mode, because a NEUTRAL accent has to invert with the surface
   * it sits on — near-black on paper, near-white on the dark page — while a
   * chromatic one (yellow) is the same colour in both. A single string could
   * only express the second case, which is why the default accent could never
   * be anything but a bright hue before.
   */
  primary: Record<BaseMode, string>;
  primaryHover: Record<BaseMode, string>;
  /**
   * The accent used as TEXT. Pure #FBD509 on a near-white page is ~1.5:1 —
   * unreadable — so the yellow accent sets light-mode type in a dark amber that
   * still reads as "the yellow", while dark mode keeps the yellow itself. Fills
   * (buttons, progress bars, dots) keep using `--primary`; only ink swaps.
   */
  ink: Record<BaseMode, string>;
}

export const baseModes: Record<BaseMode, BaseTheme> = {
  // Light mode — paper, not "inverted dark". The page is a neutral off-white
  // and surfaces sit ABOVE it in pure white (in dark mode surfaces also sit
  // above the page, just by getting lighter — same rule, not a mirror).
  light: {
    label: 'Light',
    background:          '0 0% 97%',    // #f7f7f7 — paper
    backgroundLight:     '0 0% 100%',   // #ffffff — surfaces lift off the page
    foreground:          '0 0% 9%',     // #171717 — ink, 16.6:1 on paper
    muted:               '0 0% 88%',    // #e0e0e0
    mutedForeground:     '0 0% 38%',    // #616161 — 5.5:1, passes AA
    border:              '0 0% 84%',    // #d6d6d6 — hairline that survives paper
    secondary:           '0 0% 12%',    // ink chip
    secondaryForeground: '0 0% 97%',
  },
  // Dark mode — Motion.design values, unchanged.
  dark: {
    label: 'Dark',
    background:          '0 0% 3%',     // #080808
    backgroundLight:     '0 0% 4%',     // #0a0a0a
    foreground:          '60 3% 93%',   // #E6E6DC
    muted:               '56 5% 56%',   // #909890
    mutedForeground:     '56 5% 56%',   // #909890
    border:              '0 0% 14%',    // #242424
    secondary:           '0 0% 95%',    // paper chip
    secondaryForeground: '0 0% 12%',
  },
};

export const accentThemes: Record<AccentName, AccentTheme> = {
  // The default. An accent does not have to be a HUE — here it is the ink
  // itself, so the page carries one colour (the paper) and one contrast (the
  // type). Emphasis comes from weight, scale and rules rather than from a
  // second colour competing with the photography and the work.
  ink: {
    label: 'Ink',
    swatch: '#171717',
    primary:      { light: '0 0% 9%',   dark: '60 3% 93%' },
    primaryHover: { light: '0 0% 25%',  dark: '60 3% 78%' },
    ink:          { light: '0 0% 9%',   dark: '60 3% 93%' },
  },
  yellow: {
    label: 'Yellow',
    swatch: '#FBD509',
    primary:      { light: '50 100% 60%', dark: '50 100% 60%' }, // #FBD509
    primaryHover: { light: '50 100% 50%', dark: '50 100% 50%' }, // #E6C000
    ink:          { light: '44 100% 27%', dark: '50 100% 60%' }, // #8a6700 — 4.7:1 on paper
  },
};

/**
 * Type that stays legible ON a fill of the given colour. `--primary-foreground`
 * used to be the constant `0 0% 8%`, which is only correct for a bright accent:
 * the moment the accent is dark (the neutral default, or any dark colour the
 * visitor picks) every primary button became near-black on near-black.
 */
export function onPrimary(primaryTriplet: string): string {
  const lightness = parseFloat(primaryTriplet.split(/\s+/)[2]);
  return lightness >= 55 ? '0 0% 8%' : '0 0% 97%';
}

/**
 * Flattens the semantic table for `base` into CSS custom properties.
 *
 * Kept separate from the accent tokens on purpose: the accent is repaintable
 * (preset, or any hex the visitor picks) and these are not. An error message
 * has to stay red on a site whose owner chose a red accent, and a "saved"
 * confirmation must not turn red because someone chose red.
 */
export function buildSemanticVars(base: BaseMode): Record<string, string> {
  const table = semantics[base];
  const vars: Record<string, string> = {};
  for (const [name, s] of Object.entries(table)) {
    vars[`--${name}`] = s.fill;
    vars[`--${name}-foreground`] = s.foreground;
    vars[`--${name}-ink`] = s.ink;
  }
  return vars;
}

export function buildCSSVars(base: BaseMode, accent: AccentName): Record<string, string> {
  const b = baseModes[base];
  const a = accentThemes[accent] ?? accentThemes.ink;
  const primary = a.primary[base];
  const onDark = a.primary.dark;
  return {
    // Semantic state tokens follow the BASE MODE only — never the accent.
    ...buildSemanticVars(base),

    // ── Accent, resolved for a DARK surface, whatever the base mode is ──
    // The hero is a dark media block in both themes (`.hero-media` in
    // globals.css), and the default accent is NEUTRAL — it is the ink itself,
    // so in light mode `--primary` is near-black. Painted onto the dark hero
    // that is invisible: the nameplate's full stop, the "available for work"
    // dot and the primary button all vanish.
    //
    // These are the same accent resolved against a dark surface, which for a
    // preset simply means its dark-mode entry. Anything sitting on a dark
    // surface regardless of theme should use these rather than `--primary`.
    '--primary-on-dark':            onDark,
    '--primary-ink-on-dark':        a.ink.dark,
    '--primary-foreground-on-dark': onPrimary(onDark),
    '--background':           b.background,
    '--background-light':     b.backgroundLight,
    '--foreground':           b.foreground,
    // BOTH spellings. Components reference `--foreground-muted` (the globals
    // component layer) and `--muted-foreground` (arbitrary Tailwind values)
    // interchangeably; setting only one left the other pinned to the dark
    // value forever, which is why light mode had 2.6:1 metadata type.
    '--foreground-muted':     b.mutedForeground,
    '--muted-foreground':     b.mutedForeground,
    '--muted':                b.muted,
    '--border':               b.border,
    '--input':                b.border,
    '--ring':                 primary,
    '--primary':              primary,
    '--primary-hover':        a.primaryHover[base],
    '--primary-ink':          a.ink[base],
    '--primary-foreground':   onPrimary(primary),
    '--secondary':            b.secondary,
    '--secondary-foreground': b.secondaryForeground,
    // `--accent` is the neutral surface token (Tailwind maps `accent` to it).
    // It was never set here, so light mode inherited the dark value.
    '--accent':               b.backgroundLight,
    '--accent-foreground':    b.foreground,
  };
}

// The site opens on paper with an ink accent. Dark mode and the yellow are
// both still one tap away in the theme picker — they are no longer the first
// impression, which read as loud to everyone who wasn't already used to it.
export const DEFAULT_BASE:   BaseMode   = 'light';
export const DEFAULT_ACCENT: AccentName = 'ink';
