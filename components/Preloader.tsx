"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function Preloader() {
  const preloaderRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const textLinesRef = useRef<HTMLDivElement[]>([]);
  const barRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const shapesRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const preloader = preloaderRef.current;
    const container = containerRef.current;
    const textLines = textLinesRef.current;
    const bar = barRef.current;
    const progress = progressRef.current;
    const shapes = shapesRef.current;

    if (!preloader || !container) return;

    const ctx = gsap.context(() => {
      gsap.set(textLines, { y: 100, opacity: 0 });
      gsap.set(bar, { scaleX: 0, transformOrigin: "left" });
      gsap.set(shapes, { scale: 0, opacity: 0, rotation: 0 });
      gsap.set(progress, { width: "0%" });

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.to(shapes, {
        scale: 1,
        opacity: 0.15,
        duration: 0.8,
        stagger: 0.1,
        ease: "back.out(1.2)",
      })
        .to(textLines[0], { y: 0, opacity: 1, duration: 0.6 }, "-=0.4")
        .to(textLines[1], { y: 0, opacity: 1, duration: 0.6 }, "-=0.3")
        .to(bar, { scaleX: 1, duration: 1.2, ease: "power2.inOut" }, "-=0.2")
        .to(progress, { width: "100%", duration: 1.0, ease: "none" }, "-=1.2")
        .to({}, { duration: 0.3 })
        .to(textLines, {
          y: -80,
          opacity: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: "power2.in",
        })
        .to(shapes, {
          scale: 0,
          opacity: 0,
          duration: 0.6,
          stagger: 0.05,
          ease: "back.in(1)",
        })
        .to(
          container,
          {
            yPercent: -100,
            duration: 0.9,
            ease: "power4.inOut",
            onComplete: () => {
              preloader.style.display = "none";
            },
          },
          "-=0.2"
        );
    });

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={preloaderRef}
      className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
      style={{ backgroundColor: "hsl(var(--background))" }}
    >
      <div ref={containerRef} className="relative w-full h-full">

        {/* Blurred glow shapes — use primary accent colour */}
        <div
          ref={(el) => { if (el) shapesRef.current[0] = el; }}
          className="absolute top-[15%] left-[10%] w-32 h-32 rounded-full blur-3xl"
          style={{ backgroundColor: "hsl(var(--primary) / 0.25)" }}
        />
        <div
          ref={(el) => { if (el) shapesRef.current[1] = el; }}
          className="absolute bottom-[20%] right-[15%] w-48 h-48 rounded-full blur-3xl"
          style={{ backgroundColor: "hsl(var(--secondary) / 0.2)" }}
        />
        <div
          ref={(el) => { if (el) shapesRef.current[2] = el; }}
          className="absolute top-[40%] right-[30%] w-24 h-24 rounded-lg rotate-12"
          style={{ border: "2px solid hsl(var(--primary) / 0.3)" }}
        />
        <div
          ref={(el) => { if (el) shapesRef.current[3] = el; }}
          className="absolute bottom-[30%] left-[20%] w-16 h-16 rounded-md"
          style={{ backgroundColor: "hsl(var(--primary) / 0.15)" }}
        />

        {/* Main content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center space-y-8">

          {/* Text */}
          <div className="text-center overflow-hidden">
            <div
              ref={(el) => { if (el) textLinesRef.current[0] = el; }}
              className="text-6xl md:text-8xl font-bold tracking-tighter"
              style={{ color: "hsl(var(--foreground))" }}
            >
              KAI<span style={{ color: "hsl(var(--primary))" }}>ZEN</span>
            </div>
            <div
              ref={(el) => { if (el) textLinesRef.current[1] = el; }}
              className="text-sm md:text-base tracking-widest mt-4 uppercase"
              style={{ color: "hsl(var(--muted-foreground))" }}
            >
              Continuous Improvement
            </div>
          </div>

          {/* Loading bar track */}
          <div
            className="w-64 md:w-96 h-[2px] rounded-full overflow-hidden"
            style={{ backgroundColor: "hsl(var(--muted))" }}
          >
            <div
              ref={barRef}
              className="h-full w-full rounded-full origin-left"
              style={{
                background:
                  "linear-gradient(to right, hsl(var(--primary)), hsl(var(--secondary)))",
              }}
            />
          </div>

          {/* Loading label */}
          <div
            ref={progressRef}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 text-xs font-mono tracking-widest"
            style={{ color: "hsl(var(--muted-foreground))" }}
          >
            LOADING...
          </div>
        </div>
      </div>
    </div>
  );
}