'use client';

import { useEffect, useRef } from 'react';
import { useTheme } from '../ThemeProvider';

/**
 * A soft warm spotlight that eases toward the cursor. Only renders in the
 * dark "Ink" theme (it would wash out on paper). Disabled on touch and for
 * reduced-motion users. Pointer-events: none, sits behind content.
 */
export default function SpotlightCursor() {
  const { base } = useTheme();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (base !== 'dark') return;
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(hover: none)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let tx = window.innerWidth / 2, ty = window.innerHeight / 2;
    let cx = tx, cy = ty;
    let raf = 0;

    const loop = () => {
      try {
        // Use motion-inspired easing factor (similar to ease-spring-3)
        const easeFactor = 0.12; // Tuned for smooth, responsive feel
        cx += (tx - cx) * easeFactor;
        cy += (ty - cy) * easeFactor;
        el.style.transform = `translate3d(${cx}px, ${cy}px, 0) translate(-50%, -50%)`;
      } catch (err) {
        console.error('[SpotlightCursor] frame failed, stopping:', err);
        return;
      }
      raf = requestAnimationFrame(loop);
    };
    const onMove = (e: MouseEvent) => { tx = e.clientX; ty = e.clientY; };

    window.addEventListener('mousemove', onMove, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => { window.removeEventListener('mousemove', onMove); cancelAnimationFrame(raf); };
  }, [base]);

  if (base !== 'dark') return null;

  return (
    <div
      ref={ref}
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: 'var(--cursor-size, 420px)',
        height: 'var(--cursor-size, 420px)',
        borderRadius: '50%',
        pointerEvents: 'none',
        zIndex: 1,
        background:
          'radial-gradient(circle, hsl(var(--primary) / 0.10) 0%, hsl(var(--primary) / 0.05) 30%, transparent 68%)',
        mixBlendMode: 'screen',
      }}
    />
  );
}