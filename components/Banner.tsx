"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { personalInfo } from "@/lib/data";
import { trackHireMeNow } from "@/lib/utils";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import Magnetic from "@/components/motion/Magnetic";
import ScrambleOnView from "@/components/motion/ScrambleOnView";
import { GridPattern } from "@/components/ui/grid-pattern";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

// gsap wants layout-effect timing (set the "before" state pre-paint so the
// hero never flashes its final frame), but that warns under SSR — pick once.
const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

// The display headline, split into words so each can "arrive" on its own beat.
// `accent` = solid lime highlight block (the Flux move); `dim` = muted trailing
// clause. Splitting here keeps the JSX declarative and the stagger uniform.
type Word = { text: string; accent?: boolean; dim?: boolean };
const HEADLINE: Word[] = [
  { text: "Full-stack" },
  { text: "developer", accent: true },
  { text: "building", dim: true },
  { text: "high-performance", dim: true },
  { text: "products.", dim: true },
];

// Hard-shadow tech chips under the headline — proof-of-stack at a glance.
const TAGS = ["React", "Next.js", "TypeScript", "Node", "GSAP"];

export default function Banner() {
  const containerRef = useRef<HTMLElement>(null);
  const parallaxRef = useRef<HTMLDivElement>(null); // scroll-scrub owns this
  const mouseLayerRef = useRef<HTMLDivElement>(null); // pointer-parallax owns this
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const tagsRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<HTMLDivElement>(null);
  const glyphScrollRef = useRef<HTMLDivElement>(null); // scroll-scrub owns this
  const glyphRef = useRef<HTMLDivElement>(null); // intro + float own this

  // ── Animated stat counters ────────────────────────────────────────
  // The hero is above the fold, so we count on mount rather than on scroll.
  useEffect(() => {
    if (!statsRef.current) return;
    const reduce = prefersReducedMotion();
    const stats = statsRef.current.querySelectorAll<HTMLElement>(".stat-value");
    stats.forEach((stat) => {
      const target = parseInt(stat.getAttribute("data-target") || "0", 10);
      if (reduce) {
        stat.textContent = target.toString();
        return;
      }
      let current = 0;
      const increment = target / 60;
      const tick = () => {
        current += increment;
        if (current < target) {
          stat.textContent = Math.floor(current).toString();
          requestAnimationFrame(tick);
        } else {
          stat.textContent = target.toString();
        }
      };
      tick();
    });
  }, []);

  // ── Entrance + scroll choreography ────────────────────────────────
  // Every animated node has exactly ONE writer of its transform to avoid the
  // jitter the old build had (parallax + scroll fighting over the same `y`).
  useIsoLayoutEffect(() => {
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      // Word-arrive entrance: staggered rise + fade (transform/opacity only —
      // no masks, so the accent block's hard shadow is never clipped).
      const tl = gsap.timeline({
        delay: 0.15,
        defaults: { ease: "var(--ease-spring-2)" },
      });

      tl.from(eyebrowRef.current, {
        y: 14,
        opacity: 0,
        duration: 0.6,
        ease: "var(--ease-spring-1)",
      })
        .from(
          ".hero-word",
          { yPercent: 60, opacity: 0, duration: 0.7, stagger: 0.07 },
          "-=0.25"
        )
        .from(
          ".hero-accent-fill",
          {
            scaleX: 0,
            transformOrigin: "left center",
            duration: 0.5,
            ease: "expo.out",
          },
          "-=0.35"
        )
        .from(
          subRef.current,
          { y: 20, opacity: 0, duration: 0.6, ease: "var(--ease-spring-3)" },
          "-=0.3"
        )
        .from(
          tagsRef.current?.children ?? [],
          { y: 14, opacity: 0, duration: 0.5, stagger: 0.05 },
          "-=0.2"
        )
        .from(
          ctaRef.current?.children ?? [],
          { y: 16, opacity: 0, duration: 0.5, stagger: 0.08 },
          "-=0.25"
        )
        .from(
          statsRef.current?.children ?? [],
          { y: 16, opacity: 0, duration: 0.5, stagger: 0.07 },
          "-=0.3"
        )
        .from(arrowRef.current, { opacity: 0, duration: 0.5 }, "-=0.15");

      // Editorial "K": fade/scale in (never from scale 0), then breathe forever.
      // Intro touches scale+opacity, the loop touches y+rotation — disjoint
      // properties, so they compose cleanly instead of fighting.
      gsap.fromTo(
        glyphRef.current,
        { opacity: 0, scale: 0.96 },
        { opacity: 1, scale: 1, duration: 1.4, delay: 0.5, ease: "var(--ease-spring-2)" }
      );
      gsap.to(glyphRef.current, {
        y: 20,
        rotation: 2,
        duration: 9,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 1.4,
      });

      // Scroll exit: the composition drifts up and dims as the hero leaves.
      // Only transform/opacity, and only on nodes no other tween touches.
      gsap
        .timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 0.6,
          },
        })
        .to(parallaxRef.current, { y: -60, opacity: 0.4, ease: "none" }, 0)
        .to(glyphScrollRef.current, { y: -120, ease: "none" }, 0)
        .to(arrowRef.current, { opacity: 0, y: 16, ease: "none" }, 0);
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // ── Quiet pointer parallax ────────────────────────────────────────
  // Confined to its own layer so it never collides with the scroll-scrub.
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const el = mouseLayerRef.current;
    if (!el || window.matchMedia("(hover: none)").matches) return;
    let raf = 0;
    const handle = (e: MouseEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const x = (e.clientX / window.innerWidth - 0.5) * 12;
        const y = (e.clientY / window.innerHeight - 0.5) * 12;
        gsap.to(el, { x: -x, y: -y * 0.7, duration: 0.9, ease: "var(--ease-spring-2)" });
      });
    };
    window.addEventListener("mousemove", handle, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handle);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section
      ref={containerRef}
      id="home"
      className="relative min-h-screen flex flex-col justify-center pt-28 pb-24 px-6 lg:px-12 overflow-hidden"
      aria-label="Hero section"
    >
      {/* Barely-there paper wash — flat, editorial, behind everything. */}
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        {/* Editorial grid — themed to the ink palette + radially masked so it
            dissolves toward the edges. Home page only (lives in the hero). */}
        <GridPattern
          width={48}
          height={48}
          squares={[
            [3, 2],
            [6, 5],
            [10, 3],
            [13, 7],
            [8, 8],
          ]}
          className="[mask-image:radial-gradient(680px_circle_at_65%_35%,white,transparent)] stroke-foreground/[0.06] fill-foreground/[0.035]"
        />
        {/* The two 120px-blur colour blooms that used to sit here are gone:
            "monochrome base, no gradients" leaves no room for ambient glow.
            The grid pattern above and this hairline carry the backdrop now. */}
        <div className="absolute inset-x-6 top-28 h-px bg-foreground/10 lg:inset-x-12" />
      </div>

      {/* Oversized "K" mark. Scroll layer wraps float layer → single writer each.
          Sits behind content (z-0) at low opacity, so text stays fully legible. */}
      <div
        ref={glyphScrollRef}
        aria-hidden="true"
        className="pointer-events-none absolute right-[-6vw] top-1/2 z-0 -translate-y-1/2 select-none"
      >
        <div
          ref={glyphRef}
          className="font-serif italic leading-none text-primary/[0.06] text-[46vw] lg:text-[32vw]"
        >
          K
        </div>
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <div ref={parallaxRef}>
          <div ref={mouseLayerRef} className="will-change-transform">
            {/* Eyebrow — mono meta label, decoded on view, + availability pill */}
            <div
              ref={eyebrowRef}
              className="mb-7 flex flex-wrap items-center gap-x-4 gap-y-3"
            >
              <span className="flex items-center gap-2.5 nb-label">
                <span className="inline-block h-2 w-2 bg-secondary" />
                <ScrambleOnView text={personalInfo.tagline} />
              </span>
              <span
                className="inline-flex items-center gap-2 border-2 border-foreground bg-secondary px-2.5 py-1 font-mono text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-foreground"
              >
                <span className="inline-block h-1.5 w-1.5 animate-pulse bg-primary" />
                Available for work
              </span>
            </div>

            {/* Display heading — word-arrive stagger, one solid-lime accent word */}
            <h1 className="max-w-5xl font-serif font-medium leading-[1.04] tracking-[-0.02em] text-[clamp(2.6rem,8.5vw,6.5rem)]">
              {HEADLINE.map((word, i) => (
                <span
                  key={`${word.text}-${i}`}
                  className="mr-[0.28em] inline-block"
                >
                  {word.accent ? (
                    // Highlight block: lime fill, ink text, hard shadow. The fill
                    // is a separate layer so it can wipe in behind the glyphs.
                    <span className="relative inline-block px-[0.18em] text-[hsl(var(--secondary-foreground))]">
                      <span
                        className="hero-accent-fill absolute inset-0 -z-10 border-2 border-foreground bg-secondary"
                        aria-hidden="true"
                      />
                      <span className="hero-word inline-block not-italic">
                        {word.text}
                      </span>
                    </span>
                  ) : (
                    <span
                      className={`hero-word inline-block ${
                        word.dim ? "text-muted-foreground/80" : ""
                      }`}
                    >
                      {word.text}
                    </span>
                  )}
                </span>
              ))}
            </h1>

            {/* Subtitle */}
            <p
              ref={subRef}
              className="mt-8 max-w-xl text-lg leading-relaxed text-muted-foreground md:text-xl"
            >
              {personalInfo.positioning}
            </p>

            {/* Tech chips — hard-shadow tags */}
            <div ref={tagsRef} className="mt-8 flex flex-wrap gap-3">
              {TAGS.map((tag) => (
                <span
                  key={tag}
                  className="border-2 border-foreground bg-background-light px-3 py-1.5 font-mono text-xs font-medium uppercase tracking-wider text-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* CTAs — magnetic primary (→ work), outline secondary (→ call) */}
            <div ref={ctaRef} className="mt-10 flex flex-wrap items-center gap-4">
              <Magnetic strength={0.3} radius={80}>
                <Link href="/projects" className="nb-btn group">
                  View Work
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-200 ease-out group-hover:translate-x-0.5 group-" />
                </Link>
              </Magnetic>
              <Magnetic strength={0.3} radius={80}>
                <a
                  href={personalInfo.hireWhatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackHireMeNow("hero")}
                  className="nb-btn nb-btn--outline group"
                >
                  Hire me now
                  <span className="font-mono transition-transform duration-200 ease-out group-hover:translate-x-0.5">
                    ↗
                  </span>
                </a>
              </Magnetic>
            </div>

            {/* Stats — editorial ledger row */}
            <div
              ref={statsRef}
              className="mt-16 flex flex-wrap gap-x-12 gap-y-6 border-t-2 border-foreground/80 pt-8"
              aria-label="Key statistics"
            >
              {personalInfo.stats.map((stat) => {
                const hasPlus = stat.value.includes("+");
                const target = parseInt(stat.value, 10);
                return (
                  <div key={stat.label} className="group">
                    <p className="font-serif text-4xl font-medium tabular-nums text-foreground md:text-5xl">
                      <span
                        className="stat-value"
                        data-target={target}
                        aria-hidden="true"
                      >
                        0
                      </span>
                      {hasPlus ? "+" : ""}
                      <span className="sr-only">{stat.value}</span>
                    </p>
                    <p className="mt-2 font-mono text-[0.7rem] uppercase tracking-widest text-muted-foreground transition-colors group-hover:text-primary">
                      {stat.label}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Continue cue → About page. Reduced-motion drops the bounce via the wrapper. */}
      <div
        ref={arrowRef}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
      >
        <Link
          href="/about"
          aria-label="Continue to About"
          className="group flex flex-col items-center gap-2 text-muted-foreground transition-colors hover:text-primary motion-reduce:*:animate-none"
        >
          <span className="font-mono text-[0.65rem] uppercase tracking-[0.25em] opacity-70">
            About
          </span>
          <ChevronDown className="h-4 w-4 animate-bounce" />
        </Link>
      </div>
    </section>
  );
}