export type BaseMode   = 'dark' | 'light';
export type AccentName = 'yellow';

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
  /**
   * The accent used as TEXT. Pure #FBD509 on a near-white page is ~1.5:1 —
   * unreadable — so light mode sets type in a dark amber that still reads as
   * "the yellow", while dark mode keeps the yellow itself. Fills (buttons,
   * progress bars, dots) keep using `--primary` in both modes; only ink swaps.
   */
  primaryInk: string;
}

export interface AccentTheme {
  label: string;
  swatch: string;
  primary: string;
  primaryHover: string;
  ring: string;
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
    primaryInk:          '44 100% 27%', // #8a6700 — 4.7:1 on paper
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
    primaryInk:          '50 100% 60%', // the yellow itself — 13:1 on #080808
  },
};

export const accentThemes: Record<AccentName, AccentTheme> = {
  yellow: {
    label: 'Yellow',
    swatch: '#FBD509',
    primary: '50 100% 60%',      // #FBD509
    primaryHover: '50 100% 50%', // #E6C000
    ring: '50 100% 60%',
  },
};

export function buildCSSVars(base: BaseMode, accent: AccentName): Record<string, string> {
  const b = baseModes[base];
  const a = accentThemes[accent] ?? accentThemes.yellow;
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
    '--ring':                 a.ring,
    '--primary':              a.primary,
    '--primary-hover':        a.primaryHover,
    '--primary-ink':          b.primaryInk,
    // Near-black, ALWAYS. This was '0 0% 100%' — white type on #FBD509 is
    // 1.4:1, i.e. every primary button on the site was illegible.
    '--primary-foreground':   '0 0% 8%',
    '--secondary':            b.secondary,
    '--secondary-foreground': b.secondaryForeground,
    // `--accent` is the neutral surface token (Tailwind maps `accent` to it).
    // It was never set here, so light mode inherited the dark value.
    '--accent':               b.backgroundLight,
    '--accent-foreground':    b.foreground,
  };
}

export const DEFAULT_BASE:   BaseMode   = 'dark';
export const DEFAULT_ACCENT: AccentName = 'yellow';
