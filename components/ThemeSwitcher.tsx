'use client';

import { useEffect, useRef, useState } from 'react';
import { accentThemes, baseModes, type AccentName, type BaseMode } from '@/lib/theme';
import { useTheme } from './ThemeProvider';

// Sun icon
const SunIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="4"/>
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
  </svg>
);

// Moon icon
const MoonIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
  </svg>
);

// Palette icon for the trigger button
const PaletteIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/>
    <circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/>
    <circle cx="8.5"  cy="7.5"  r=".5" fill="currentColor"/>
    <circle cx="6.5"  cy="12.5" r=".5" fill="currentColor"/>
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01a.505.505 0 01-.11-.33c0-.28.22-.5.5-.5H16c3.31 0 6-2.69 6-6 0-4.96-4.48-9-10-9z"/>
  </svg>
);

export default function ThemeSwitcher() {
  const { base, accent, setBase, setAccent, previewBase, previewAccent } = useTheme();
  const [open, setOpen] = useState(false);
  const panelRef  = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (
        panelRef.current  && !panelRef.current.contains(e.target as Node) &&
        buttonRef.current && !buttonRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  const baseModeList  = Object.entries(baseModes)  as [BaseMode,   typeof baseModes[BaseMode]][];
  const accentList    = Object.entries(accentThemes) as [AccentName, typeof accentThemes[AccentName]][];

  return (
    <div className="relative" aria-label="Theme switcher">
      {/* Trigger button */}
      <button
        ref={buttonRef}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="true"
        title="Change theme"
        className={`
          flex items-center justify-center w-9 h-9 rounded-lg border transition-all duration-200
          ${open
            ? 'border-primary bg-primary/10 text-primary'
            : 'border-border text-muted-foreground hover:border-primary/50 hover:text-foreground'
          }
        `}
      >
        <PaletteIcon />
      </button>

      {/* Panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-label="Theme options"
        className={`
          absolute right-0 top-12 z-[200] w-64
          bg-[hsl(var(--background-light))] border border-[hsl(var(--border))]
          rounded-xl shadow-2xl shadow-black/40 p-4
          transition-all duration-200 origin-top-right
          ${open ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-semibold text-[hsl(var(--foreground))] uppercase tracking-widest">
            Theme
          </span>
          <button
            onClick={() => setOpen(false)}
            className="text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors text-lg leading-none"
            aria-label="Close theme panel"
          >
            ×
          </button>
        </div>

        {/* ── Section 1: Base mode ── */}
        <p className="text-[10px] uppercase tracking-widest text-[hsl(var(--muted-foreground))] mb-2">
          Mode
        </p>
        <div className="grid grid-cols-2 gap-2 mb-5">
          {baseModeList.map(([key, cfg]) => {
            const active = base === key;
            return (
              <button
                key={key}
                onClick={() => setBase(key)}
                onMouseEnter={() => previewBase(key)}
                onMouseLeave={() => previewBase(null)}
                className={`
                  relative flex items-center gap-2 px-3 py-2.5 rounded-lg border text-sm font-medium
                  transition-all duration-150
                  ${active
                    ? 'border-[hsl(var(--primary))] bg-[hsl(var(--primary)/0.12)] text-[hsl(var(--primary))]'
                    : 'border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] hover:border-[hsl(var(--primary)/0.4)] hover:text-[hsl(var(--foreground))]'
                  }
                `}
                aria-pressed={active}
              >
                <span className={active ? 'text-[hsl(var(--primary))]' : 'text-[hsl(var(--muted-foreground))]'}>
                  {key === 'dark' ? <MoonIcon /> : <SunIcon />}
                </span>
                {cfg.label}
                {active && (
                  <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[hsl(var(--primary))]" />
                )}
              </button>
            );
          })}
        </div>

        {/* ── Section 2: Accent colour ── */}
        <p className="text-[10px] uppercase tracking-widest text-[hsl(var(--muted-foreground))] mb-2">
          Accent
        </p>
        <div className="flex flex-col gap-1.5">
          {accentList.map(([key, cfg]) => {
            const active = accent === key;
            return (
              <button
                key={key}
                onClick={() => setAccent(key)}
                onMouseEnter={() => previewAccent(key)}
                onMouseLeave={() => previewAccent(null)}
                className={`
                  flex items-center gap-3 px-3 py-2 rounded-lg border text-sm
                  transition-all duration-150 w-full text-left
                  ${active
                    ? 'border-[hsl(var(--primary))] bg-[hsl(var(--primary)/0.08)] text-[hsl(var(--foreground))]'
                    : 'border-transparent text-[hsl(var(--muted-foreground))] hover:border-[hsl(var(--border))] hover:text-[hsl(var(--foreground))]'
                  }
                `}
                aria-pressed={active}
              >
                {/* Swatch */}
                <span
                  className="w-5 h-5 rounded-full flex-shrink-0 ring-2 ring-offset-1 ring-offset-[hsl(var(--background-light))]"
                  style={{
                    background: cfg.swatch,
                    boxShadow: active ? `0 0 0 2px ${cfg.swatch}` : 'none',
                  }}
                  aria-hidden="true"
                />
                <span className="font-medium">{cfg.label}</span>
                {active && (
                  <span className="ml-auto text-[hsl(var(--primary))] text-base leading-none">✓</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer hint */}
        <p className="text-[10px] text-[hsl(var(--muted-foreground))] mt-4 text-center">
          Hover to preview · Click to save
        </p>
      </div>
    </div>
  );
}
