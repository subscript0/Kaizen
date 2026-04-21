// ─────────────────────────────────────────────────────────────────────────────
// THEME CONFIG
// To add a new base mode or accent: add one entry here. Nothing else changes.
// ─────────────────────────────────────────────────────────────────────────────

export type BaseMode   = 'dark' | 'light';
export type AccentName = 'blue' | 'red' | 'green' | 'purple' | 'orange';

// CSS variable values are HSL components only (no `hsl()` wrapper)
// matching the existing pattern already used in globals.css

export interface BaseTheme {
  label:            string;
  background:       string;
  backgroundLight:  string;
  foreground:       string;
  muted:            string;
  mutedForeground:  string;
  border:           string;
}

export interface AccentTheme {
  label:     string;
  swatch:    string;   // actual hex for the UI swatch preview
  primary:   string;
  primaryHover: string;
  secondary: string;
  ring:      string;
}

// ── Base modes ────────────────────────────────────────────────────────────────
export const baseModes: Record<BaseMode, BaseTheme> = {
  dark: {
    label:           'Dark',
    background:      '222 20% 8%',
    backgroundLight: '222 18% 12%',
    foreground:      '220 13% 91%',
    muted:           '220 9% 20%',
    mutedForeground: '220 9% 65%',
    border:          '220 13% 20%',
  },
  light: {
    label:           'Light',
    background:      '210 20% 97%',
    backgroundLight: '210 20% 92%',
    foreground:      '222 20% 10%',
    muted:           '210 20% 86%',
    mutedForeground: '215 16% 46%',
    border:          '214 32% 82%',
  },
};

// ── Accent themes ─────────────────────────────────────────────────────────────
export const accentThemes: Record<AccentName, AccentTheme> = {
  blue: {
    label:        'Blue',
    swatch:       '#2563EB',
    primary:      '217 91% 60%',
    primaryHover: '217 91% 55%',
    secondary:    '200 95% 55%',
    ring:         '217 91% 60%',
  },
  red: {
    label:        'Red',
    swatch:       '#EF4444',
    primary:      '0 84% 60%',
    primaryHover: '0 84% 54%',
    secondary:    '0 90% 70%',
    ring:         '0 84% 60%',
  },
  green: {
    label:        'Green',
    swatch:       '#22C55E',
    primary:      '142 70% 45%',
    primaryHover: '142 70% 40%',
    secondary:    '160 84% 39%',
    ring:         '142 70% 45%',
  },
  purple: {
    label:        'Purple',
    swatch:       '#A855F7',
    primary:      '270 70% 60%',
    primaryHover: '270 70% 54%',
    secondary:    '280 60% 65%',
    ring:         '270 70% 60%',
  },
  orange: {
    label:        'Orange',
    swatch:       '#F97316',
    primary:      '25 95% 53%',
    primaryHover: '25 95% 47%',
    secondary:    '38 92% 50%',
    ring:         '25 95% 53%',
  },
};

// ── Merged token builder ──────────────────────────────────────────────────────
export function buildCSSVars(base: BaseMode, accent: AccentName): Record<string, string> {
  const b = baseModes[base];
  const a = accentThemes[accent];
  return {
    '--background':         b.background,
    '--background-light':   b.backgroundLight,
    '--foreground':         b.foreground,
    '--muted':              b.muted,
    '--muted-foreground':   b.mutedForeground,
    '--border':             b.border,
    '--ring':               a.ring,
    '--primary':            a.primary,
    '--primary-hover':      a.primaryHover,
    '--primary-foreground': '0 0% 100%',
    '--secondary':          a.secondary,
    '--secondary-foreground': '0 0% 100%',
  };
}

export const DEFAULT_BASE:   BaseMode   = 'dark';
export const DEFAULT_ACCENT: AccentName = 'blue';
