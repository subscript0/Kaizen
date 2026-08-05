'use client';

import { useEffect, useRef } from 'react';

interface Props {
  children: React.ReactNode;
  className?: string;
  /** How strongly the element follows the cursor (0–1). */
  strength?: number;
  /** Radius (px) around the element where the pull begins. */
  radius?: number;
  as?: 'div' | 'span' | 'li';
}

/**
 * Generic magnetic wrapper — the element eases toward the cursor when it's
 * within `radius`, and springs back on leave. Disabled on touch / reduced-motion.
 * Uses a rAF loop with lerp so motion feels weighty, not twitchy.
 */
export default function Magnetic({
  children,
  className = '',
  strength = 0.4,
  radius = 90,
  as: Tag = 'div',
}: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(hover: none)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let targetX = 0, targetY = 0;
    let curX = 0, curY = 0;
    let raf = 0;
    let active = false;

    const loop = () => {
      curX += (targetX - curX) * 0.15;
      curY += (targetY - curY) * 0.15;
      el.style.transform = `translate(${curX.toFixed(2)}px, ${curY.toFixed(2)}px)`;
      if (Math.abs(targetX - curX) > 0.1 || Math.abs(targetY - curY) > 0.1 || active) {
        raf = requestAnimationFrame(loop);
      } else {
        el.style.transform = '';
        raf = 0;
      }
    };
    const kick = () => { if (!raf) raf = requestAnimationFrame(loop); };

    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);
      const reach = Math.max(r.width, r.height) / 2 + radius;
      if (dist < reach) {
        active = true;
        targetX = dx * strength;
        targetY = dy * strength;
      } else if (active) {
        active = false;
        targetX = 0; targetY = 0;
      }
      kick();
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
    };
  }, [strength, radius]);

  return (
    <Tag
      // @ts-expect-error – ref typing across the union of tag elements
      ref={ref}
      className={className}
      style={{ display: 'inline-block', willChange: 'transform' }}
    >
      {children}
    </Tag>
  );
}
