export type BaseMode   = 'dark' | 'light';
export type AccentName = 'ink' | 'yellow';

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

export function buildCSSVars(base: BaseMode, accent: AccentName): Record<string, string> {
  const b = baseModes[base];
  const a = accentThemes[accent] ?? accentThemes.ink;
  const primary = a.primary[base];
  return {
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
