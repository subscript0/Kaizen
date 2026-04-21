'use client';

import { useEffect } from 'react';

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    let lenis: {
      raf: (time: number) => void;
      destroy: () => void;
    } | null = null;

    const initLenis = async () => {
      // Dynamic import to avoid SSR issues
      const LenisModule = await import('@studio-freight/lenis');
      const Lenis = LenisModule.default;

      lenis = new Lenis({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        smoothWheel: true,
      });

      function raf(time: number) {
        lenis!.raf(time);
        requestAnimationFrame(raf);
      }

      requestAnimationFrame(raf);
    };

    initLenis();

    return () => {
      lenis?.destroy();
    };
  }, []);

  return <>{children}</>;
}
