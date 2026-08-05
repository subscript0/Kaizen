// Small, dependency-free color conversions for the accent color picker.
// Internally the picker works in HSV (matches how a saturation/value square +
// hue strip actually behaves). Site theme variables are stored as bare
// "H S% L%" triplets (see hsl(var(--x)) usage across the codebase), so the
// only thing that ever gets written to a CSS variable is an HSL triplet —
// never raw hex, never a full hsl() string.

export type RGB = [number, number, number];
export interface HSV { h: number; s: number; v: number }

export function isValidHex(value: string): boolean {
  return /^#?[0-9a-fA-F]{6}$/.test(value.trim());
}

export function normalizeHex(value: string): string {
  const v = value.trim();
  return v.startsWith('#') ? v : `#${v}`;
}

export function hexToRgb(hex: string): RGB {
  const clean = normalizeHex(hex).slice(1);
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  return [r, g, b];
}

export function rgbToHex([r, g, b]: RGB): string {
  const toHex = (c: number) => Math.round(Math.min(255, Math.max(0, c))).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function hsvToRgb(h: number, s: number, v: number): RGB {
  s = Math.min(100, Math.max(0, s)) / 100;
  v = Math.min(100, Math.max(0, v)) / 100;
  h = ((h % 360) + 360) % 360;

  const c = v * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = v - c;
  let r = 0, g = 0, b = 0;
  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];

  return [Math.round((r + m) * 255), Math.round((g + m) * 255), Math.round((b + m) * 255)];
}

export function rgbToHsv([r, g, b]: RGB): HSV {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;

  let h = 0;
  if (d !== 0) {
    switch (max) {
      case r: h = 60 * (((g - b) / d) % 6); break;
      case g: h = 60 * ((b - r) / d + 2); break;
      default: h = 60 * ((r - g) / d + 4); break;
    }
  }
  if (h < 0) h += 360;

  const s = max === 0 ? 0 : d / max;
  return { h: Math.round(h), s: Math.round(s * 100), v: Math.round(max * 100) };
}

export function rgbToHslTriplet([r, g, b]: RGB): string {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  const d = max - min;

  let h = 0;
  let s = 0;
  if (d !== 0) {
    s = d / (1 - Math.abs(2 * l - 1));
    switch (max) {
      case r: h = 60 * (((g - b) / d) % 6); break;
      case g: h = 60 * ((b - r) / d + 2); break;
      default: h = 60 * ((r - g) / d + 4); break;
    }
  }
  if (h < 0) h += 360;

  return `${Math.round(h)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

// Reads back a "H S% L%" CSS-variable triplet (e.g. getComputedStyle value of
// --primary) so the picker can open already positioned on the current color.
export function hslTripletToRgb(triplet: string): RGB {
  const parts = triplet.trim().split(/\s+/).map((p) => parseFloat(p));
  const [h, sPct, lPct] = parts;
  const s = (sPct || 0) / 100;
  const l = (lPct || 0) / 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0, g = 0, b = 0;
  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  return [Math.round((r + m) * 255), Math.round((g + m) * 255), Math.round((b + m) * 255)];
}

export function hexToHslTriplet(hex: string): string {
  return rgbToHslTriplet(hexToRgb(hex));
}

export function hsvToHex(hsv: HSV): string {
  return rgbToHex(hsvToRgb(hsv.h, hsv.s, hsv.v));
}