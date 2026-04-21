export type BaseMode   = 'dark' | 'light';
export type AccentName = 'blue' | 'red' | 'green' | 'purple' | 'orange' | 'yellow' | 'grey' | 'cyan' | 'tan' | 'pink';

export interface BaseTheme {
  label: string;
  background: string;
  backgroundLight: string;
  foreground: string;
  muted: string;
  mutedForeground: string;
  border: string;
}

export interface AccentTheme {
  label: string;
  swatch: string;
  primary: string;
  primaryHover: string;
  secondary: string;
  ring: string;
}

export const baseModes: Record<BaseMode, BaseTheme> = {
  dark: {
    label: 'Dark',
    background:      '222 20% 8%',
    backgroundLight: '222 18% 12%',
    foreground:      '220 13% 91%',
    muted:           '220 9% 20%',
    mutedForeground: '220 9% 65%',
    border:          '220 13% 20%',
  },
  light: {
    label: 'Light',
    background:      '210 20% 97%',
    backgroundLight: '210 20% 92%',
    foreground:      '222 20% 10%',
    muted:           '210 20% 86%',
    mutedForeground: '215 16% 46%',
    border:          '214 32% 82%',
  },
};

export const accentThemes: Record<AccentName, AccentTheme> = {
  blue: {
    label: 'Blue', swatch: '#2563EB',
    primary: '217 91% 60%', primaryHover: '217 91% 55%',
    secondary: '200 95% 55%', ring: '217 91% 60%',
  },
  red: {
    label: 'Red', swatch: '#EF4444',
    primary: '0 84% 60%', primaryHover: '0 84% 54%',
    secondary: '0 90% 70%', ring: '0 84% 60%',
  },
  green: {
    label: 'Green', swatch: '#22C55E',
    primary: '142 70% 45%', primaryHover: '142 70% 40%',
    secondary: '160 84% 39%', ring: '142 70% 45%',
  },
  purple: {
    label: 'Purple', swatch: '#A855F7',
    primary: '270 70% 60%', primaryHover: '270 70% 54%',
    secondary: '280 60% 65%', ring: '270 70% 60%',
  },
  orange: {
    label: 'Orange', swatch: '#F97316',
    primary: '25 95% 53%', primaryHover: '25 95% 47%',
    secondary: '38 92% 50%', ring: '25 95% 53%',
  },
  yellow: {
    label: 'Yellow', swatch: '#EAB308',
    primary: '47 96% 53%', primaryHover: '47 96% 46%',
    secondary: '54 91% 60%', ring: '47 96% 53%',
  },
  grey: {
    label: 'Grey', swatch: '#94A3B8',
    primary: '215 20% 65%', primaryHover: '215 20% 58%',
    secondary: '215 16% 75%', ring: '215 20% 65%',
  },
  cyan: {
    label: 'Cyan', swatch: '#06B6D4',
    primary: '189 94% 43%', primaryHover: '189 94% 37%',
    secondary: '196 100% 47%', ring: '189 94% 43%',
  },
  tan: {
    label: 'Tan', swatch: '#D4A574',
    primary: '30 52% 64%', primaryHover: '30 52% 57%',
    secondary: '25 60% 72%', ring: '30 52% 64%',
  },
  pink: {
    label: 'Pink', swatch: '#EC4899',
    primary: '330 81% 60%', primaryHover: '330 81% 54%',
    secondary: '316 72% 68%', ring: '330 81% 60%',
  },
};

export function buildCSSVars(base: BaseMode, accent: AccentName): Record<string, string> {
  const b = baseModes[base];
  const a = accentThemes[accent];
  return {
    '--background':           b.background,
    '--background-light':     b.backgroundLight,
    '--foreground':           b.foreground,
    '--muted':                b.muted,
    '--muted-foreground':     b.mutedForeground,
    '--border':               b.border,
    '--ring':                 a.ring,
    '--primary':              a.primary,
    '--primary-hover':        a.primaryHover,
    '--primary-foreground':   '0 0% 100%',
    '--secondary':            a.secondary,
    '--secondary-foreground': '0 0% 100%',
  };
}

export const DEFAULT_BASE:   BaseMode   = 'dark';
export const DEFAULT_ACCENT: AccentName = 'blue';
