'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function Preloader() {
  const preloaderRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const preloader = preloaderRef.current;
    const text = textRef.current;
    if (!preloader || !text) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      // Animate text in
      tl.from(text, {
        y: 60,
        opacity: 0,
        duration: 0.6,
        ease: 'power3.out',
      })
        // Hold
        .to({}, { duration: 0.4 })
        // Animate text out
        .to(text, {
          y: -60,
          opacity: 0,
          duration: 0.5,
          ease: 'power3.in',
        })
        // Slide preloader up
        .to(preloader, {
          yPercent: -100,
          duration: 0.8,
          ease: 'power4.inOut',
          onComplete: () => {
            preloader.style.display = 'none';
          },
        });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div ref={preloaderRef} className="preloader">
      <div ref={textRef} className="preloader__text">
        KAIZEN
      </div>
    </div>
  );
}
