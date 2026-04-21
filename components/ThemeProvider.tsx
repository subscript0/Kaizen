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
} from '@/lib/theme';

// ── Context ───────────────────────────────────────────────────────────────────
interface ThemeCtx {
  base:        BaseMode;
  accent:      AccentName;
  setBase:     (b: BaseMode)   => void;
  setAccent:   (a: AccentName) => void;
  previewBase:   (b: BaseMode   | null) => void;
  previewAccent: (a: AccentName | null) => void;
}

const ThemeContext = createContext<ThemeCtx>({
  base:   DEFAULT_BASE,
  accent: DEFAULT_ACCENT,
  setBase:       () => {},
  setAccent:     () => {},
  previewBase:   () => {},
  previewAccent: () => {},
});

export const useTheme = () => useContext(ThemeContext);

// ── Helper: apply CSS vars to <html> ─────────────────────────────────────────
function applyVars(vars: Record<string, string>) {
  const root = document.documentElement;
  Object.entries(vars).forEach(([k, v]) => root.style.setProperty(k, v));
}

// ── Provider ─────────────────────────────────────────────────────────────────
export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [base,   setBaseState]   = useState<BaseMode>(DEFAULT_BASE);
  const [accent, setAccentState] = useState<AccentName>(DEFAULT_ACCENT);

  // Refs track the "locked" values so previews can revert cleanly
  const lockedBase   = useRef<BaseMode>(DEFAULT_BASE);
  const lockedAccent = useRef<AccentName>(DEFAULT_ACCENT);

  // ── Restore from localStorage on mount (client only) ─────────────────────
  useEffect(() => {
    const savedBase   = localStorage.getItem('theme-base')   as BaseMode   | null;
    const savedAccent = localStorage.getItem('theme-accent') as AccentName | null;
    const b = savedBase   ?? DEFAULT_BASE;
    const a = savedAccent ?? DEFAULT_ACCENT;
    lockedBase.current   = b;
    lockedAccent.current = a;
    setBaseState(b);
    setAccentState(a);
    applyVars(buildCSSVars(b, a));
  }, []);

  // ── Apply whenever locked state changes ──────────────────────────────────
  const setBase = useCallback((b: BaseMode) => {
    lockedBase.current = b;
    setBaseState(b);
    localStorage.setItem('theme-base', b);
    applyVars(buildCSSVars(b, lockedAccent.current));
  }, []);

  const setAccent = useCallback((a: AccentName) => {
    lockedAccent.current = a;
    setAccentState(a);
    localStorage.setItem('theme-accent', a);
    applyVars(buildCSSVars(lockedBase.current, a));
  }, []);

  // ── Hover preview — revert to locked on null ──────────────────────────────
  const previewBase = useCallback((b: BaseMode | null) => {
    applyVars(buildCSSVars(b ?? lockedBase.current, lockedAccent.current));
  }, []);

  const previewAccent = useCallback((a: AccentName | null) => {
    applyVars(buildCSSVars(lockedBase.current, a ?? lockedAccent.current));
  }, []);

  return (
    <ThemeContext.Provider
      value={{ base, accent, setBase, setAccent, previewBase, previewAccent }}
    >
      {children}
    </ThemeContext.Provider>
  );
}
