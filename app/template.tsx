'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function Template({ children }: { children: React.ReactNode }) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;

    const ctx = gsap.context(() => {
      // Slide in from right on enter
      gsap.from(overlay.nextElementSibling, {
        x: 30,
        opacity: 0,
        duration: 0.6,
        ease: 'power3.out',
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <>
      <div ref={overlayRef} aria-hidden="true" />
      <div>{children}</div>
    </>
  );
}
