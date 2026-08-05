'use client';

import { useEffect, useRef } from 'react';
import { useReducedMotion } from '@/lib/motion';

/**
 * Motion.dev-inspired cursor for the neobrutalist theme.
 *
 *   <MagneticCursor />   →  behaves like  <Cursor magnetic morph />
 *
 * - A small SHARP square dot follows the pointer (no rounding — matches the
 *   sharp-edge design).
 * - A bordered "box" trails behind. When it hovers an interactive target
 *   ([data-cursor], a, button, inputs…) it MORPHS to wrap that target's
 *   bounding box and the dot is magnetically pulled toward the target centre.
 * - Fully disabled on touch devices and for reduced-motion users; native
 *   cursor is only hidden while this is active.
 */
export default function MagneticCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      if (window.matchMedia('(hover: none)').matches) return;
    } catch {
      return;
    }
    if (reduceMotion) return;

    const dot = dotRef.current;
    const box = boxRef.current;
    if (!dot || !box) return;

    const root = document.documentElement;
    root.classList.add('has-custom-cursor');

    const SELECTOR = 'a, button, [role="button"], [data-cursor], input, textarea, select, label';

    // pointer + eased positions
    let mx = window.innerWidth / 2, my = window.innerHeight / 2;
    let dx = mx, dy = my;            // dot
    let bx = mx, by = my;            // box centre
    let bw = 12, bh = 12;            // box size (eased)
    let tw = 12, th = 12;            // target box size
    let target: HTMLElement | null = null;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX; my = e.clientY;
      // refresh target rect live (elements can move/scroll)
      const el = (e.target as HTMLElement)?.closest?.(SELECTOR) as HTMLElement | null;
      target = el;
    };

    const onDown = () => box.classList.add('is-down');
    const onUp = () => box.classList.remove('is-down');

    const lerp = (a: number, b: number, n: number) => a + (b - a) * n;

    const loop = () => {
      try {
        let cxTarget = mx, cyTarget = my;

        if (target) {
          const r = target.getBoundingClientRect();
          const pad = 8;
          tw = r.width + pad * 2;
          th = r.height + pad * 2;
          // magnetic: pull toward the target centre
          cxTarget = r.left + r.width / 2;
          cyTarget = r.top + r.height / 2;
          box.classList.add('is-morph');
        } else {
          tw = 12; th = 12;
          box.classList.remove('is-morph');
        }

        // dot: quick follow, gently magnetised when a target is active
        const dotTargetX = target ? lerp(mx, cxTarget, 0.35) : mx;
        const dotTargetY = target ? lerp(my, cyTarget, 0.35) : my;
        dx = lerp(dx, dotTargetX, 0.22);
        dy = lerp(dy, dotTargetY, 0.22);
        dot.style.transform = `translate3d(${dx}px, ${dy}px, 0) translate(-50%, -50%)`;

        // box: slower trail + size morph
        bx = lerp(bx, cxTarget, 0.16);
        by = lerp(by, cyTarget, 0.16);
        bw = lerp(bw, tw, 0.2);
        bh = lerp(bh, th, 0.2);
        box.style.transform = `translate3d(${bx}px, ${by}px, 0) translate(-50%, -50%)`;
        box.style.width = `${bw}px`;
        box.style.height = `${bh}px`;
      } catch (err) {
        console.error('[MagneticCursor] frame failed, stopping cursor animation:', err);
        root.classList.remove('has-custom-cursor');
        return;
      }

      raf = requestAnimationFrame(loop);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);
    raf = requestAnimationFrame(loop);

    return () => {
      root.classList.remove('has-custom-cursor');
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      cancelAnimationFrame(raf);
    };
  }, [reduceMotion]);

  return (
    <>
      <div ref={boxRef} className="mag-cursor-box" aria-hidden="true" />
      <div ref={dotRef} className="mag-cursor-dot" aria-hidden="true" />
    </>
  );
}