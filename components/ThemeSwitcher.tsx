'use client';

import { useEffect, useRef, useState } from 'react';
import { accentThemes, baseModes, type AccentName, type BaseMode } from '@/lib/theme';
import { useTheme } from './ThemeProvider';

const SunIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
  </svg>
);

const MoonIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
  </svg>
);

const PaletteIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (
        panelRef.current  && !panelRef.current.contains(e.target as Node) &&
        buttonRef.current && !buttonRef.current.contains(e.target as Node)
      ) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  const baseModeList = Object.entries(baseModes)   as [BaseMode,   (typeof baseModes)[BaseMode]][];
  const accentList   = Object.entries(accentThemes) as [AccentName, (typeof accentThemes)[AccentName]][];

  return (
    <div className="relative" aria-label="Theme switcher">
      {/* Trigger */}
      <button
        ref={buttonRef}
        onClick={() => setOpen(v => !v)}
        aria-expanded={open}
        aria-haspopup="true"
        title="Change theme"
        className={`flex items-center justify-center w-9 h-9 rounded-lg border transition-all duration-200 ${
          open
            ? 'border-[hsl(var(--primary))] bg-[hsl(var(--primary)/0.12)] text-[hsl(var(--primary))]'
            : 'border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] hover:border-[hsl(var(--primary)/0.5)] hover:text-[hsl(var(--foreground))]'
        }`}
      >
        <PaletteIcon />
      </button>

      {/* Panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-label="Theme options"
        className={`absolute right-0 top-12 z-[200] w-72 rounded-xl shadow-2xl shadow-black/40 p-4 transition-all duration-200 origin-top-right ${
          open ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'
        }`}
        style={{
          backgroundColor: 'hsl(var(--background-light))',
          border: '1px solid hsl(var(--border))',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'hsl(var(--foreground))' }}>
            Theme
          </span>
          <button
            onClick={() => setOpen(false)}
            className="text-lg leading-none transition-colors"
            style={{ color: 'hsl(var(--muted-foreground))' }}
            aria-label="Close"
          >×</button>
        </div>

        {/* Base mode */}
        <p className="text-[10px] uppercase tracking-widest mb-2" style={{ color: 'hsl(var(--muted-foreground))' }}>
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
                aria-pressed={active}
                className="relative flex items-center gap-2 px-3 py-2.5 rounded-lg border text-sm font-medium transition-all duration-150"
                style={{
                  borderColor: active ? 'hsl(var(--primary))' : 'hsl(var(--border))',
                  backgroundColor: active ? 'hsl(var(--primary) / 0.12)' : 'transparent',
                  color: active ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))',
                }}
              >
                {key === 'dark' ? <MoonIcon /> : <SunIcon />}
                {cfg.label}
                {active && <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'hsl(var(--primary))' }} />}
              </button>
            );
          })}
        </div>

        {/* Accent colours — 2-column grid of swatches */}
        <p className="text-[10px] uppercase tracking-widest mb-3" style={{ color: 'hsl(var(--muted-foreground))' }}>
          Accent
        </p>
        <div className="grid grid-cols-5 gap-2 mb-3">
          {accentList.map(([key, cfg]) => {
            const active = accent === key;
            return (
              <button
                key={key}
                onClick={() => setAccent(key)}
                onMouseEnter={() => previewAccent(key)}
                onMouseLeave={() => previewAccent(null)}
                aria-pressed={active}
                title={cfg.label}
                className="flex flex-col items-center gap-1.5 group"
              >
                {/* Swatch circle */}
                <span
                  className="w-8 h-8 rounded-full transition-transform duration-150 group-hover:scale-110"
                  style={{
                    backgroundColor: cfg.swatch,
                    boxShadow: active ? `0 0 0 2px hsl(var(--background-light)), 0 0 0 4px ${cfg.swatch}` : 'none',
                    transform: active ? 'scale(1.1)' : undefined,
                  }}
                />
                {/* Label */}
                <span
                  className="text-[9px] leading-tight font-medium"
                  style={{ color: active ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))' }}
                >
                  {cfg.label}
                </span>
              </button>
            );
          })}
        </div>

        <p className="text-[10px] text-center mt-3" style={{ color: 'hsl(var(--muted-foreground))' }}>
          Hover to preview · Click to save
        </p>
      </div>
    </div>
  );
}
