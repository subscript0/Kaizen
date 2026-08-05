'use client';

import { useRef, type ReactNode } from 'react';
import { gsap, parallax, useIsoLayoutEffect } from '@/lib/motion';

interface Props {
  children: ReactNode;
  /**
   * Total travel across the whole scroll pass, as a percentage of the
   * element's own height. Percent rather than pixels so the same value reads
   * identically on a 220px phone thumbnail and a 520px desktop plate.
   */
  distance?: number;
  className?: string;
  /**
   * Overscale the moving layer so its travel never exposes an edge. 8% of
   * travel needs ~8% of extra size; the default leaves headroom.
   */
  overscale?: number;
}

/**
 * Scroll-linked parallax for imagery.
 *
 * Scrubbed, not triggered: the picture is tied to the scroll position rather
 * than playing a canned animation somewhere near it, which is the difference
 * between depth and a tic. Transform-only, so nothing relayouts while it
 * moves — the wrapper clips, the inner layer travels.
 *
 * Does nothing at all under `prefers-reduced-motion`: parallax is the single
 * most reliable way to make a motion-sensitive reader queasy, and an
 * unparallaxed photograph is not a degraded photograph.
 */
export default function Parallax({
  children,
  distance = 10,
  className = '',
  overscale = 1.14,
}: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);

  useIsoLayoutEffect(() => {
    const wrap = wrapRef.current;
    const layer = layerRef.current;
    if (!wrap || !layer) return;

    const ctx = gsap.context(() => {
      const stop = parallax(layer, { distance, trigger: wrap });
      return stop;
    }, wrap);

    return () => ctx.revert();
  }, [distance]);

  return (
    <div ref={wrapRef} className={`relative overflow-hidden ${className}`}>
      <div
        ref={layerRef}
        className="absolute inset-0 will-change-transform"
        style={{ height: `${overscale * 100}%`, top: `${((1 - overscale) * 100) / 2}%` }}
      >
        {children}
      </div>
    </div>
  );
}
