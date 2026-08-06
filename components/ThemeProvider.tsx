'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  type AccentName,
  type BaseMode,
  DEFAULT_ACCENT,
  DEFAULT_BASE,
  buildCSSVars,
  onPrimary,
} from '@/lib/theme';
import { hexToHslTriplet } from '@/lib/color';

// ── Background tone presets ───────────────────────────────────────────────────
// Additive, same idea as customAccent below: never touches buildCSSVars or
// BaseMode, just overrides --background / --background-light on top of
// whatever the base/accent preset already set. "Pure" means "don't override
// anything" — i.e. whatever buildCSSVars already produces for that mode.
export type LightVariant = 'pure' | 'milky' | 'frost';
export type DarkVariant = 'pure' | 'midnight' | 'espresso';

interface VariantDef { label: string; background: string; backgroundLight: string }

// backgroundLight is LIGHTER than background in both sets. That is the rule the
// whole system runs on — a surface always lifts off the page — and the light
// variants used to invert it (surfaces darker than the page), which is the
// "dark mode with the colours flipped" tell the light theme was suffering from.
export const LIGHT_VARIANTS: Record<LightVariant, VariantDef | null> = {
  pure: null,
  milky: { label: 'Milky', background: '40 32% 95%', backgroundLight: '40 45% 99%' },
  frost: { label: 'Frost', background: '210 28% 96%', backgroundLight: '210 45% 100%' },
};

export const DARK_VARIANTS: Record<DarkVariant, VariantDef | null> = {
  pure: null,
  midnight: { label: 'Midnight', background: '224 35% 8%', backgroundLight: '224 28% 12%' },
  espresso: { label: 'Espresso', background: '24 20% 9%', backgroundLight: '24 16% 13%' },
};

// ── Context ───────────────────────────────────────────────────────────────────
interface ThemeCtx {
  base: BaseMode;
  accent: AccentName;
  customAccent: string | null;
  lightVariant: LightVariant;
  darkVariant: DarkVariant;
  setBase: (b: BaseMode) => void;
  setAccent: (a: AccentName) => void;
  setCustomAccent: (hex: string | null) => void;
  setLightVariant: (v: LightVariant) => void;
  setDarkVariant: (v: DarkVariant) => void;
  previewBase: (b: BaseMode | null) => void;
  previewAccent: (a: AccentName | null) => void;
  previewCustomAccent: (hex: string) => void;
  previewLightVariant: (v: LightVariant | null) => void;
  previewDarkVariant: (v: DarkVariant | null) => void;
}

const ThemeContext = createContext<ThemeCtx>({
  base: DEFAULT_BASE,
  accent: DEFAULT_ACCENT,
  customAccent: null,
  lightVariant: 'pure',
  darkVariant: 'pure',
  setBase: () => {},
  setAccent: () => {},
  setCustomAccent: () => {},
  setLightVariant: () => {},
  setDarkVariant: () => {},
  previewBase: () => {},
  previewAccent: () => {},
  previewCustomAccent: () => {},
  previewLightVariant: () => {},
  previewDarkVariant: () => {},
});

export const useTheme = () => useContext(ThemeContext);

// ── Helpers ───────────────────────────────────────────────────────────────────
function applyVars(vars: Record<string, string>) {
  const root = document.documentElement;
  Object.entries(vars).forEach(([k, v]) => root.style.setProperty(k, v));
}

// Overrides the accent AFTER buildCSSVars has run, so it only needs to touch
// the tokens buildCSSVars derives from the accent — see lib/theme.ts.
//
// `--accent` is deliberately NOT set here. It is the neutral SURFACE token
// (Tailwind maps `bg-accent` to it), and painting the picked colour into it
// used to turn every accent-coloured surface on the site into the accent hue.
// The tokens that genuinely follow the accent are --primary, its hover tint,
// the focus ring, and --primary-ink (the same colour, made legible as type).
function applyCustomAccent(hex: string, base: BaseMode) {
  const [h, s, l] = hexToHslTriplet(hex).split(/\s+/);
  const hue = parseFloat(h);
  const sat = parseFloat(s);
  const light = parseFloat(l);
  const root = document.documentElement;

  root.style.setProperty('--primary', `${hue} ${sat}% ${light}%`);
  root.style.setProperty('--primary-hover', `${hue} ${sat}% ${Math.max(0, light - 8)}%`);
  root.style.setProperty('--ring', `${hue} ${sat}% ${light}%`);
  // Button labels follow the picked colour's lightness. Without this the
  // foreground stayed at whatever the last preset set, so picking anything dark
  // — now easy to do, since the default accent IS dark — printed near-black
  // type on a near-black fill.
  root.style.setProperty('--primary-foreground', onPrimary(`${hue} ${sat}% ${light}%`));

  // On light paper an accent lighter than ~32% lightness is unreadable as
  // type, so the ink variant is darkened until it isn't. On dark the accent is
  // used as-is — picking a bright one is the whole point there.
  const inkLight = base === 'light' ? Math.min(light, 32) : light;
  root.style.setProperty('--primary-ink', `${hue} ${sat}% ${inkLight}%`);
}

function applyBackgroundVariant(base: BaseMode, lightVariant: LightVariant, darkVariant: DarkVariant) {
  const def = base === 'dark' ? DARK_VARIANTS[darkVariant] : LIGHT_VARIANTS[lightVariant];
  if (!def) return; // "pure" — leave whatever buildCSSVars(base, accent) already set
  const root = document.documentElement;
  root.style.setProperty('--background', def.background);
  root.style.setProperty('--background-light', def.backgroundLight);
}

// ── Provider ─────────────────────────────────────────────────────────────────
export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [base, setBaseState] = useState<BaseMode>(DEFAULT_BASE);
  const [accent, setAccentState] = useState<AccentName>(DEFAULT_ACCENT);
  const [customAccent, setCustomAccentState] = useState<string | null>(null);
  const [lightVariant, setLightVariantState] = useState<LightVariant>('pure');
  const [darkVariant, setDarkVariantState] = useState<DarkVariant>('pure');

  // Refs track the "locked" values so previews can revert cleanly
  const lockedBase = useRef<BaseMode>(DEFAULT_BASE);
  const lockedAccent = useRef<AccentName>(DEFAULT_ACCENT);
  const lockedCustomAccent = useRef<string | null>(null);
  const lockedLightVariant = useRef<LightVariant>('pure');
  const lockedDarkVariant = useRef<DarkVariant>('pure');

  const reapplyOverrides = () => {
    if (lockedCustomAccent.current) applyCustomAccent(lockedCustomAccent.current, lockedBase.current);
    applyBackgroundVariant(lockedBase.current, lockedLightVariant.current, lockedDarkVariant.current);
  };

  // ── Restore from localStorage on mount (client only) ─────────────────────
  useEffect(() => {
    const savedBase = localStorage.getItem('theme-base') as BaseMode | null;
    const savedAccent = localStorage.getItem('theme-accent') as AccentName | null;
    const savedCustom = localStorage.getItem('theme-custom-accent');
    const savedLightVariant = localStorage.getItem('theme-light-variant') as LightVariant | null;
    const savedDarkVariant = localStorage.getItem('theme-dark-variant') as DarkVariant | null;

    const b = savedBase ?? DEFAULT_BASE;
    const a = savedAccent ?? DEFAULT_ACCENT;
    const lv = savedLightVariant ?? 'pure';
    const dv = savedDarkVariant ?? 'pure';

    lockedBase.current = b;
    lockedAccent.current = a;
    lockedCustomAccent.current = savedCustom;
    lockedLightVariant.current = lv;
    lockedDarkVariant.current = dv;

    setBaseState(b);
    setAccentState(a);
    setCustomAccentState(savedCustom);
    setLightVariantState(lv);
    setDarkVariantState(dv);

    applyVars(buildCSSVars(b, a));
    reapplyOverrides();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Apply whenever locked state changes ──────────────────────────────────
  const setBase = useCallback((b: BaseMode) => {
    lockedBase.current = b;
    setBaseState(b);
    localStorage.setItem('theme-base', b);
    applyVars(buildCSSVars(b, lockedAccent.current));
    reapplyOverrides(); // custom accent + whichever variant applies to the new mode
  }, []);

  const setAccent = useCallback((a: AccentName) => {
    lockedAccent.current = a;
    lockedCustomAccent.current = null;
    setAccentState(a);
    setCustomAccentState(null);
    localStorage.setItem('theme-accent', a);
    localStorage.removeItem('theme-custom-accent');
    applyVars(buildCSSVars(lockedBase.current, a));
    applyBackgroundVariant(lockedBase.current, lockedLightVariant.current, lockedDarkVariant.current);
  }, []);

  const setCustomAccent = useCallback((hex: string | null) => {
    lockedCustomAccent.current = hex;
    setCustomAccentState(hex);
    if (hex) {
      localStorage.setItem('theme-custom-accent', hex);
      applyCustomAccent(hex, lockedBase.current);
    } else {
      localStorage.removeItem('theme-custom-accent');
      applyVars(buildCSSVars(lockedBase.current, lockedAccent.current));
      applyBackgroundVariant(lockedBase.current, lockedLightVariant.current, lockedDarkVariant.current);
    }
  }, []);

  const setLightVariant = useCallback((v: LightVariant) => {
    lockedLightVariant.current = v;
    setLightVariantState(v);
    localStorage.setItem('theme-light-variant', v);
    if (lockedBase.current === 'light') applyBackgroundVariant('light', v, lockedDarkVariant.current);
  }, []);

  const setDarkVariant = useCallback((v: DarkVariant) => {
    lockedDarkVariant.current = v;
    setDarkVariantState(v);
    localStorage.setItem('theme-dark-variant', v);
    if (lockedBase.current === 'dark') applyBackgroundVariant('dark', lockedLightVariant.current, v);
  }, []);

  // ── Hover / drag preview — revert to locked on null ───────────────────────
  const previewBase = useCallback((b: BaseMode | null) => {
    applyVars(buildCSSVars(b ?? lockedBase.current, lockedAccent.current));
    if (lockedCustomAccent.current) applyCustomAccent(lockedCustomAccent.current, b ?? lockedBase.current);
    applyBackgroundVariant(b ?? lockedBase.current, lockedLightVariant.current, lockedDarkVariant.current);
  }, []);

  const previewAccent = useCallback((a: AccentName | null) => {
    applyVars(buildCSSVars(lockedBase.current, a ?? lockedAccent.current));
    applyBackgroundVariant(lockedBase.current, lockedLightVariant.current, lockedDarkVariant.current);
  }, []);

  const previewCustomAccent = useCallback((hex: string) => {
    applyCustomAccent(hex, lockedBase.current);
  }, []);

  const previewLightVariant = useCallback((v: LightVariant | null) => {
    if (lockedBase.current !== 'light') return;
    applyBackgroundVariant('light', v ?? lockedLightVariant.current, lockedDarkVariant.current);
  }, []);

  const previewDarkVariant = useCallback((v: DarkVariant | null) => {
    if (lockedBase.current !== 'dark') return;
    applyBackgroundVariant('dark', lockedLightVariant.current, v ?? lockedDarkVariant.current);
  }, []);

  return (
    <ThemeContext.Provider
      value={{
        base,
        accent,
        customAccent,
        lightVariant,
        darkVariant,
        setBase,
        setAccent,
        setCustomAccent,
        setLightVariant,
        setDarkVariant,
        previewBase,
        previewAccent,
        previewCustomAccent,
        previewLightVariant,
        previewDarkVariant,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}