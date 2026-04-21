"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { personalInfo } from "@/lib/data";
import { trackBookACall } from "@/lib/utils";
import { ArrowRight, Code, Zap, Sparkles, ChevronDown } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Banner() {
  const containerRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<HTMLDivElement>(null);
  const floatingIconsRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMounted, setIsMounted] = useState(false);

  // Animated counter for stats
  useEffect(() => {
    if (!statsRef.current) return;
    const stats = statsRef.current.querySelectorAll(".stat-value");
    stats.forEach((stat) => {
      const target = parseInt(stat.getAttribute("data-target") || "0", 10);
      let current = 0;
      const increment = target / 60;
      const updateCounter = () => {
        current += increment;
        if (current < target) {
          stat.textContent = Math.floor(current).toString();
          requestAnimationFrame(updateCounter);
        } else {
          stat.textContent = target.toString();
        }
      };
      updateCounter();
    });
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 1.8 });

      tl.from(headingRef.current, {
        y: 80,
        opacity: 0,
        duration: 1,
        ease: "power4.out",
      })
        .from(
          subRef.current,
          { y: 40, opacity: 0, duration: 0.8, ease: "power3.out" },
          "-=0.6"
        )
        .from(
          ctaRef.current,
          { y: 30, opacity: 0, duration: 0.7, ease: "back.out(0.7)" },
          "-=0.5"
        )
        .from(
          statsRef.current?.children ?? [],
          {
            y: 25,
            opacity: 0,
            stagger: 0.1,
            duration: 0.6,
            ease: "power3.out",
          },
          "-=0.4"
        )
        .from(
          arrowRef.current,
          { opacity: 0, y: 15, duration: 0.5, ease: "power2.out" },
          "-=0.2"
        );

      // Gentle floating icons
      gsap.to(floatingIconsRef.current?.children ?? [], {
        y: "random(-15, 15)",
        x: "random(-10, 10)",
        rotation: "random(-8, 8)",
        duration: "random(4, 7)",
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: 0.15,
      });
    }, containerRef);

    return () => ctx.revert();
  }, [isMounted]);

  // Subtle parallax on mouse move (no glow)
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 12;
      const y = (e.clientY / window.innerHeight - 0.5) * 12;
      setMousePosition({ x, y });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section
      ref={containerRef}
      id="home"
      className="relative min-h-screen flex flex-col justify-center pt-20 pb-16 px-6 lg:px-12 overflow-hidden"
      aria-label="Hero section"
    >
      {/* Clean background - no distracting glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
      </div>

      {/* Floating icons - subtle */}
      <div
        ref={floatingIconsRef}
        className="absolute inset-0 pointer-events-none z-0"
      >
        <Code className="absolute top-[20%] left-[8%] w-7 h-7 text-primary/15" />
        <Zap className="absolute bottom-[25%] right-[12%] w-8 h-8 text-primary/10" />
        <Sparkles className="absolute top-[45%] right-[18%] w-5 h-5 text-primary/20" />
        <div className="absolute bottom-[35%] left-[6%] w-10 h-10 border border-primary/10 rounded-full" />
        <div className="absolute top-[65%] left-[88%] w-2 h-2 bg-primary/20 rounded-full" />
        <div className="absolute top-[30%] left-[85%] w-1.5 h-1.5 bg-primary/30 rounded-full" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto w-full">
        {/* Role label with fade-in */}
        <div className="mb-6 overflow-hidden">
          <p className="text-primary text-sm font-semibold tracking-[0.2em] uppercase">
            {personalInfo.tagline}
          </p>
        </div>

        {/* Main heading with parallax */}
        <h1
          ref={headingRef}
          className="text-[clamp(2.8rem,8vw,6rem)] font-bold leading-[1.05] tracking-[-0.02em] mb-6 max-w-4xl"
          style={{
            transform: `translateX(${mousePosition.x * -0.2}px) translateY(${mousePosition.y * -0.1}px)`,
          }}
        >
          FullStack
          <br />
          <span className="relative inline-block">
            <span className="text-primary relative z-10">Developer</span>
            <span className="absolute bottom-1 left-0 w-full h-2 bg-primary/10 -z-0 rounded-full" />
          </span>
          <span className="text-muted-foreground">.</span>
        </h1>

        {/* Subtitle */}
        <p
          ref={subRef}
          className="text-base md:text-lg text-muted-foreground max-w-xl leading-relaxed mb-8"
          style={{
            transform: `translateX(${mousePosition.x * -0.3}px) translateY(${mousePosition.y * -0.2}px)`,
          }}
        >
          {personalInfo.positioning}
        </p>

        {/* CTA buttons */}
        <div
          ref={ctaRef}
          className="flex flex-wrap gap-4 mb-20"
          style={{
            transform: `translateY(${mousePosition.y * -0.2}px)`,
          }}
        >
          <a
            href={personalInfo.calendlyUrl}
            className="group relative inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-md font-medium transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
            onClick={() => trackBookACall("hero")}
          >
            Book a Call
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </a>
          <a
            href="#projects"
            className="inline-flex items-center gap-2 px-6 py-2.5 border border-border rounded-md text-foreground hover:bg-primary/5 hover:border-primary/40 transition-all duration-300 hover:-translate-y-0.5"
          >
            View Work
          </a>
        </div>

        {/* Stats */}
        <div
          ref={statsRef}
          className="flex flex-wrap gap-8 border-t border-border/40 pt-8"
          aria-label="Key statistics"
        >
          {personalInfo.stats.map((stat) => (
            <div
              key={stat.label}
              className="group"
              style={{
                transform: `translateY(${mousePosition.y * -0.05}px)`,
              }}
            >
              <p className="text-2xl md:text-3xl font-bold text-foreground tabular-nums">
                <span className="stat-value" data-target={parseInt(stat.value, 10)}>
                  0
                </span>
                {stat.value.includes("+") ? "+" : ""}
              </p>
              <p className="text-xs text-muted-foreground mt-1 group-hover:text-primary transition-colors">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Scroll indicator */}
        <div
          ref={arrowRef}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground cursor-pointer"
          aria-hidden="true"
          onClick={() => {
            document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
          }}
        >
          <span className="text-[11px] tracking-[0.2em] uppercase font-mono opacity-70">
            Scroll
          </span>
          <ChevronDown className="w-4 h-4 animate-bounce" />
        </div>
      </div>
    </section>
  );
}
