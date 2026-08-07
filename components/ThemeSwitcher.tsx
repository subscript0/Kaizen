'use client';

import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
  type PointerEvent,
} from 'react';
import { useTheme, LIGHT_VARIANTS, DARK_VARIANTS, type LightVariant, type DarkVariant } from '@/components/ThemeProvider';
import type { BaseMode } from '@/lib/theme';
import {
  type HSV,
  hexToRgb,
  hslTripletToRgb,
  hsvToHex,
  isValidHex,
  normalizeHex,
  rgbToHsv,
} from '@/lib/color';

const DEFAULT_HSV: HSV = { h: 24, s: 90, v: 85 };

export default function ThemeSwitcher() {
  const {
    base, setBase, previewBase,
    customAccent, setCustomAccent, previewCustomAccent,
    lightVariant, darkVariant, setLightVariant, setDarkVariant,
    previewLightVariant, previewDarkVariant,
  } = useTheme();

  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const svRef = useRef<HTMLDivElement>(null);
  const hueRef = useRef<HTMLDivElement>(null);

  const [hsv, setHsvState] = useState<HSV>(DEFAULT_HSV);
  const hsvRef = useRef<HSV>(DEFAULT_HSV);
  const setHsv = (next: HSV) => {
    hsvRef.current = next;
    setHsvState(next);
  };
  const [hexInput, setHexInput] = useState(hsvToHex(DEFAULT_HSV));

  const baseModeList: [BaseMode, { label: string }][] = [
    ['light', { label: 'Light' }],
    ['dark', { label: 'Dark' }],
  ];

  // ── Click outside (or Escape) closes the panel — the × is a convenience,
  // never the only way out ──────────────────────────────────────────────────
  useEffect(() => {
    if (!open) return;
    const handlePointerDown = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const handleKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKey);
    };
  }, [open]);

  // ── Open already positioned on whatever color is live right now ────────────
  useEffect(() => {
    let next: HSV | null = null;
    if (customAccent) {
      next = rgbToHsv(hexToRgb(customAccent));
    } else if (typeof window !== 'undefined') {
      const current = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim();
      if (current) {
        try { next = rgbToHsv(hslTripletToRgb(current)); } catch { next = null; }
      }
    }
    if (next) {
      setHsv(next);
      setHexInput(hsvToHex(next));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Saturation / Value square ────────────────────────────────────────────
  const updateSV = (clientX: number, clientY: number) => {
    const el = svRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = Math.min(Math.max(clientX - rect.left, 0), rect.width);
    const y = Math.min(Math.max(clientY - rect.top, 0), rect.height);
    const next: HSV = { ...hsvRef.current, s: (x / rect.width) * 100, v: 100 - (y / rect.height) * 100 };
    setHsv(next);
    setHexInput(hsvToHex(next));
    previewCustomAccent(hsvToHex(next));
  };
  const handleSVDown = (e: PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    updateSV(e.clientX, e.clientY);
  };
  const handleSVMove = (e: PointerEvent<HTMLDivElement>) => {
    if (e.buttons !== 1) return;
    updateSV(e.clientX, e.clientY);
  };
  const commitSV = () => setCustomAccent(hsvToHex(hsvRef.current));
  const handleSVKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const step = e.shiftKey ? 10 : 3;
    let { s, v } = hsvRef.current;
    if (e.key === 'ArrowRight') s = Math.min(100, s + step);
    else if (e.key === 'ArrowLeft') s = Math.max(0, s - step);
    else if (e.key === 'ArrowUp') v = Math.min(100, v + step);
    else if (e.key === 'ArrowDown') v = Math.max(0, v - step);
    else return;
    e.preventDefault();
    const next = { ...hsvRef.current, s, v };
    setHsv(next);
    setHexInput(hsvToHex(next));
    previewCustomAccent(hsvToHex(next));
    setCustomAccent(hsvToHex(next));
  };

  // ── Hue slider ────────────────────────────────────────────────────────────
  const updateHue = (clientX: number) => {
    const el = hueRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = Math.min(Math.max(clientX - rect.left, 0), rect.width);
    const next: HSV = { ...hsvRef.current, h: (x / rect.width) * 360 };
    setHsv(next);
    setHexInput(hsvToHex(next));
    previewCustomAccent(hsvToHex(next));
  };
  const handleHueDown = (e: PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    updateHue(e.clientX);
  };
  const handleHueMove = (e: PointerEvent<HTMLDivElement>) => {
    if (e.buttons !== 1) return;
    updateHue(e.clientX);
  };
  const commitHue = () => setCustomAccent(hsvToHex(hsvRef.current));
  const handleHueKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const step = e.shiftKey ? 20 : 5;
    let { h } = hsvRef.current;
    if (e.key === 'ArrowRight') h = Math.min(360, h + step);
    else if (e.key === 'ArrowLeft') h = Math.max(0, h - step);
    else return;
    e.preventDefault();
    const next = { ...hsvRef.current, h };
    setHsv(next);
    setHexInput(hsvToHex(next));
    previewCustomAccent(hsvToHex(next));
    setCustomAccent(hsvToHex(next));
  };

  // ── Hex text field ──────────────────────────────────────────────────────
  const handleHexChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setHexInput(val);
    if (isValidHex(val)) {
      const next = rgbToHsv(hexToRgb(normalizeHex(val)));
      setHsv(next);
      previewCustomAccent(normalizeHex(val));
    }
  };
  const handleHexBlur = () => {
    if (isValidHex(hexInput)) setCustomAccent(normalizeHex(hexInput));
    else setHexInput(hsvToHex(hsvRef.current));
  };

  const currentHex = hsvToHex(hsv);

  // ── Background variants — whichever set applies to the active mode ─────────
  const isDark = base === 'dark';
  const variantEntries = isDark
    ? (Object.entries(DARK_VARIANTS) as [DarkVariant, { label: string; background: string } | null][])
    : (Object.entries(LIGHT_VARIANTS) as [LightVariant, { label: string; background: string } | null][]);
  const activeVariant = isDark ? darkVariant : lightVariant;

  return (
    <div ref={wrapperRef} className="relative inline-block">
      <button
        onClick={() => setOpen((v) => !v)}
        className="group relative inline-flex h-10 w-10 items-center justify-center rounded border border-border/30 bg-background-light/30 backdrop-blur-sm transition-all duration-200 hover:border-primary/50 hover:bg-primary/5"
        aria-label="Theme picker"
        aria-expanded={open}
      >
        <PaletteIcon className="h-5 w-5 text-muted-foreground/80 transition-colors duration-200 group-hover:text-primary" />
      </button>

      {/* Mobile-only dimming backdrop — purely visual; the click-outside
          handler above already closes on any outside tap regardless */}
      {open && (
        <div aria-hidden="true" className="fixed inset-0 z-[190] bg-black/20 sm:hidden" />
      )}

      {/* Panel — absolute (not fixed) throughout: fixed's containing block
          keeps searching past a position:relative ancestor for one with an
          active `transform`, and GSAP's entrance tween on the nav leaves
          exactly that (translate3d) on this wrapper's own ancestor. Staying
          absolute means the wrapperRef div below — which we do control —
          settles the containing block immediately, no matter what the nav's
          entrance animation is doing further up the tree. */}
      <div
        ref={panelRef}
        role="dialog"
        aria-label="Theme options"
        className={`absolute right-0 bottom-full mb-2 origin-bottom-right md:bottom-auto md:top-14 md:mb-0 md:origin-top-right z-[200] w-[min(20rem,calc(100vw-2rem))] max-h-[min(75vh,calc(100vh-5.5rem))] overflow-y-auto rounded-2xl p-4 shadow-2xl shadow-black/40 transition-all duration-200 ${
          open ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'
        }`}
        style={{
          backgroundColor: 'hsl(var(--background-light))',
          border: '1px solid hsl(var(--border))',
          borderRadius: 'var(--radius, 1rem)',
        }}
      >
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'hsl(var(--foreground))' }}>
            Theme
          </span>
          <button
            onClick={() => setOpen(false)}
            className="text-lg leading-none transition-colors"
            style={{ color: 'hsl(var(--muted-foreground))' }}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* Base mode */}
        <p className="mb-2 text-[10px] uppercase tracking-widest" style={{ color: 'hsl(var(--muted-foreground))' }}>
          Mode
        </p>
        <div className="mb-5 grid grid-cols-2 gap-2">
          {baseModeList.map(([key, cfg]) => {
            const active = base === key;
            return (
              <button
                key={key}
                onClick={() => { setBase(key); }}
                onMouseEnter={() => previewBase(key as 'dark' | 'light')}
                onMouseLeave={() => previewBase(null)}
                aria-pressed={active}
                className="relative flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium transition-all duration-150"
                style={{
                  borderColor: active ? 'hsl(var(--primary))' : 'hsl(var(--border))',
                  backgroundColor: active ? 'hsl(var(--primary) / 0.12)' : 'transparent',
                  color: active ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))',
                }}
              >
                {key === 'dark' ? <MoonIcon /> : <SunIcon />}
                {cfg.label}
                {active && (
                  <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full" style={{ backgroundColor: 'hsl(var(--primary))' }} />
                )}
              </button>
            );
          })}
        </div>

        {/* Background tone — options depend on which mode is active */}
        <p className="mb-2 text-[10px] uppercase tracking-widest" style={{ color: 'hsl(var(--muted-foreground))' }}>
          Background
        </p>
        <div className="mb-5 flex gap-2">
          {variantEntries.map(([key, def]) => {
            const active = activeVariant === key;
            const commit = () => (isDark ? setDarkVariant(key as DarkVariant) : setLightVariant(key as LightVariant));
            const preview = (v: string | null) =>
              isDark ? previewDarkVariant(v as DarkVariant | null) : previewLightVariant(v as LightVariant | null);
            return (
              <button
                key={key}
                onClick={commit}
                onMouseEnter={() => preview(key)}
                onMouseLeave={() => preview(null)}
                aria-pressed={active}
                className="flex flex-1 flex-col items-center gap-1.5"
              >
                <span
                  className="h-8 w-full rounded-lg border-2 transition-all duration-150"
                  style={{
                    backgroundColor: def ? `hsl(${def.background})` : 'transparent',
                    borderColor: active ? 'hsl(var(--primary))' : 'hsl(var(--border))',
                  }}
                />
                <span
                  className="text-[10px] capitalize"
                  style={{ color: active ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))' }}
                >
                  {def ? def.label : 'Pure'}
                </span>
              </button>
            );
          })}
        </div>

        {/* Accent color */}
        <div className="mb-1 flex items-center justify-between">
          <p className="text-[10px] uppercase tracking-widest" style={{ color: 'hsl(var(--muted-foreground))' }}>
            Accent Color
          </p>
          {customAccent && (
            <button
              onClick={() => setCustomAccent(null)}
              className="text-[10px] uppercase tracking-widest transition-colors hover:opacity-80"
              style={{ color: 'hsl(var(--primary))' }}
            >
              Reset
            </button>
          )}
        </div>

        <div
          ref={svRef}
          role="slider"
          tabIndex={0}
          aria-label="Saturation and brightness"
          /* `role="slider"` REQUIRES aria-valuenow; without it a screen reader
             announces the control but no value, so this was a slider that
             refused to say where it was. Awkward here because the box is two
             dimensional and the role only models one axis: saturation is the
             horizontal one and takes the numeric slot, and `aria-valuetext`
             overrides the announcement so both figures are actually read out.
             (The hue slider below is genuinely 1D and needs no such trick.) */
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(hsv.s)}
          aria-valuetext={`Saturation ${Math.round(hsv.s)}%, brightness ${Math.round(hsv.v)}%`}
          onPointerDown={handleSVDown}
          onPointerMove={handleSVMove}
          onPointerUp={commitSV}
          onKeyDown={handleSVKeyDown}
          className="relative mt-2 h-32 w-full cursor-crosshair touch-none rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
          style={{ background: `linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, transparent), hsl(${hsv.h}, 100%, 50%)` }}
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-[0_0_0_1px_rgba(0,0,0,0.35)]"
            style={{ left: `${hsv.s}%`, top: `${100 - hsv.v}%`, backgroundColor: currentHex }}
          />
        </div>

        <div
          ref={hueRef}
          role="slider"
          tabIndex={0}
          aria-label="Hue"
          aria-valuemin={0}
          aria-valuemax={360}
          aria-valuenow={Math.round(hsv.h)}
          onPointerDown={handleHueDown}
          onPointerMove={handleHueMove}
          onPointerUp={commitHue}
          onKeyDown={handleHueKeyDown}
          className="relative mt-3 h-4 w-full cursor-pointer touch-none rounded-full outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
          style={{ background: 'linear-gradient(to right, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00)' }}
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-[0_0_0_1px_rgba(0,0,0,0.35)]"
            style={{ left: `${(hsv.h / 360) * 100}%`, backgroundColor: `hsl(${hsv.h}, 100%, 50%)` }}
          />
        </div>

        <div className="mt-3 flex items-center gap-2">
          <span aria-hidden="true" className="h-7 w-7 shrink-0 rounded-md border" style={{ backgroundColor: currentHex, borderColor: 'hsl(var(--border))' }} />
          <input
            type="text"
            value={hexInput}
            onChange={handleHexChange}
            onBlur={handleHexBlur}
            onKeyDown={(e) => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur(); }}
            spellCheck={false}
            aria-label="Accent color hex value"
            className="flex-1 rounded-md border bg-transparent px-2 py-1.5 font-mono text-xs uppercase tracking-wide outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
            style={{ borderColor: 'hsl(var(--border))', color: 'hsl(var(--foreground))' }}
          />
        </div>

        <p className="mt-3 text-center text-[10px]" style={{ color: 'hsl(var(--muted-foreground))' }}>
          Saved automatically — tap anywhere outside to close
        </p>
      </div>
    </div>
  );
}

// Helper icon components (inline SVGs)
function PaletteIcon({ className = '' } = {}) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="8" r="2" />
      <circle cx="16" cy="12" r="2" />
      <circle cx="12" cy="18" r="2" />
      <path d="M4.93 9.07a10 10 0 1 1 12.42 3.91" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}