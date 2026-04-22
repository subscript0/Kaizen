'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

function TermLine({
  prefix,
  text,
  color = 'hsl(var(--foreground))',
  delay = 0,
}: {
  prefix: string;
  text: string;
  color?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let i = 0;
    const span = el.querySelector('.term-text') as HTMLSpanElement;
    if (!span) return;
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        span.textContent = text.slice(0, i);
        i++;
        if (i > text.length) clearInterval(interval);
      }, 22);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timer);
  }, [text, delay]);

  return (
    <div ref={ref} className="flex items-start gap-2 font-mono text-xs leading-relaxed">
      <span style={{ color: 'hsl(var(--primary))' }}>{prefix}</span>
      <span className="term-text" style={{ color }} />
    </div>
  );
}

function ProgressBar({
  label,
  pct,
  color,
  badge,
}: {
  label: string;
  pct: number;
  color: string;
  badge?: string;
}) {
  const barRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = barRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.width = `${pct}%`;
          obs.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [pct]);

  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono" style={{ color: 'hsl(var(--muted-foreground))' }}>
            {label}
          </span>
          {badge && (
            <span
              className="text-[9px] px-1.5 py-0.5 rounded font-mono"
              style={{ backgroundColor: `${color}20`, color }}
            >
              {badge}
            </span>
          )}
        </div>
        <span className="text-[11px] font-mono" style={{ color }}>
          {pct}%
        </span>
      </div>
      <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'hsl(var(--muted))' }}>
        <div
          ref={barRef}
          className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{ width: '0%', backgroundColor: color }}
        />
      </div>
    </div>
  );
}

export default function AboutMe() {
  const sectionRef  = useRef<HTMLElement>(null);
  const quoteRef    = useRef<HTMLHeadingElement>(null);
  const leftRef     = useRef<HTMLDivElement>(null);
  const rightRef    = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(quoteRef.current, {
        scrollTrigger: { trigger: quoteRef.current, start: 'top 85%' },
        y: 60, opacity: 0, duration: 1, ease: 'power3.out',
      });
      gsap.from(leftRef.current?.children ?? [], {
        scrollTrigger: { trigger: leftRef.current, start: 'top 85%' },
        y: 40, opacity: 0, stagger: 0.12, duration: 0.8, ease: 'power3.out',
      });
      gsap.from(rightRef.current?.children ?? [], {
        scrollTrigger: { trigger: rightRef.current, start: 'top 85%' },
        y: 30, opacity: 0, stagger: 0.15, duration: 0.8, ease: 'power3.out',
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="py-24 px-6 lg:px-12 max-w-7xl mx-auto"
      aria-labelledby="about-heading"
    >
      <p className="section-number mb-4">About Me</p>

      {/* Large quote */}
      <h2
        ref={quoteRef}
        id="about-heading"
        className="text-[clamp(1.4rem,3.2vw,2.4rem)] font-semibold leading-[1.3] max-w-4xl mb-16"
        style={{ color: 'hsl(var(--foreground) / 0.9)' }}
      >
        I build systems end-to-end —{' '}
        <span style={{ color: 'hsl(var(--primary))' }}>clean architecture,</span>{' '}
        reliable data flow, and interfaces that just work.
      </h2>

      {/* ── 3-column layout: bio | image | cards ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_220px_1fr] gap-10 lg:gap-12 items-start">

        {/* ── Left: bio text ── */}
        <div ref={leftRef} className="flex flex-col gap-5">
          <div className="flex items-center gap-3">
            <p className="text-sm font-semibold tracking-widest uppercase" style={{ color: 'hsl(var(--primary))' }}>
              This is me.
            </p>
            {/* Mobile-only image */}
            <div className="lg:hidden w-12 h-12 rounded-full overflow-hidden border-2 flex-shrink-0"
              style={{ borderColor: 'hsl(var(--primary) / 0.4)' }}>
              <Image
                src="/me.jpg"
                alt="Kaizen"
                width={48}
                height={48}
                className="object-cover w-full h-full"
              />
            </div>
          </div>

          <h3 className="text-xl font-bold" style={{ color: 'hsl(var(--foreground))' }}>
            Hi, I&apos;m Kaizen.
          </h3>

          <p className="leading-relaxed text-sm" style={{ color: 'hsl(var(--muted-foreground))' }}>
            I&apos;m a full stack developer with around 5 years of experience building web
            applications, dashboards, and system-driven interfaces. I work across both
            frontend and backend — turning complex ideas into clean, functional products
            without unnecessary complexity.
          </p>
          <p className="leading-relaxed text-sm" style={{ color: 'hsl(var(--muted-foreground))' }}>
            My work centres on practical architecture, reusable components, and reliable
            data flow between client and server. I care less about trends and more about
            building systems that are stable, scalable, and maintainable over time.
          </p>
          <p className="leading-relaxed text-sm" style={{ color: 'hsl(var(--muted-foreground))' }}>
            Currently expanding into cybersecurity — learning how modern products are
            attacked and defended, and how to apply that thinking to the systems I build.
          </p>

          <a
            href="mailto:chiemeried321@gmail.com"
            className="text-sm font-medium mt-1 self-start hover:underline underline-offset-4 transition-colors"
            style={{ color: 'hsl(var(--primary))' }}
          >
            chiemeried321@gmail.com →
          </a>

          {/* Stack badges */}
          <div className="flex flex-wrap gap-2 pt-1">
            {['Next.js', 'TypeScript', 'Node.js', 'React', 'MongoDB', 'Firebase'].map(tag => (
              <span
                key={tag}
                className="text-[11px] px-2.5 py-1 rounded-full border font-mono"
                style={{
                  borderColor: 'hsl(var(--border))',
                  color: 'hsl(var(--muted-foreground))',
                  backgroundColor: 'hsl(var(--background-light))',
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* ── Centre: profile image (desktop only) ── */}
        <div className="hidden lg:flex flex-col items-center gap-4">
          <div
            className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden border-2"
            style={{ borderColor: 'hsl(var(--primary) / 0.3)' }}
          >
            <Image
              src="/me.jpg"
              alt="Kaizen — Full Stack Developer"
              fill
              className="object-cover object-top"
              sizes="220px"
              priority
            />
            {/* Subtle gradient overlay at bottom */}
            <div
              className="absolute bottom-0 left-0 right-0 h-1/3"
              style={{
                background: 'linear-gradient(to top, hsl(var(--background-light)), transparent)',
              }}
            />
          </div>
          {/* Floating badge below image */}
          <div
            className="w-full rounded-xl border p-3 text-center"
            style={{
              borderColor: 'hsl(var(--border))',
              backgroundColor: 'hsl(var(--background-light))',
            }}
          >
            <p className="text-xs font-semibold" style={{ color: 'hsl(var(--foreground))' }}>
              Kaizen
            </p>
            <p className="text-[10px] mt-0.5" style={{ color: 'hsl(var(--muted-foreground))' }}>
              Full Stack Developer
            </p>
            <div className="flex items-center justify-center gap-1.5 mt-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px]" style={{ color: 'hsl(var(--muted-foreground))' }}>
                Open to work
              </span>
            </div>
          </div>
        </div>

        {/* ── Right: terminal + cybersecurity card ── */}
        <div ref={rightRef} className="flex flex-col gap-4">

          {/* Terminal */}
          <div
            className="rounded-xl border overflow-hidden"
            style={{ borderColor: 'hsl(var(--border))', backgroundColor: 'hsl(var(--background-light))' }}
          >
            <div
              className="flex items-center gap-2 px-4 py-2.5 border-b"
              style={{ borderColor: 'hsl(var(--border))', backgroundColor: 'hsl(var(--muted))' }}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
              <span className="ml-3 text-[11px] font-mono" style={{ color: 'hsl(var(--muted-foreground))' }}>
                kaizen@dev:~$
              </span>
            </div>
            <div className="p-4 flex flex-col gap-2.5">
              <TermLine prefix=">"  text="whoami"                            delay={400} />
              <TermLine prefix="→"  text="Kaizen — Full Stack Developer"     delay={800}  color="hsl(var(--foreground))" />
              <TermLine prefix=">"  text="cat stack.txt"                     delay={1300} />
              <TermLine prefix="→"  text="frontend + backend + learning sec" delay={1700} color="hsl(var(--secondary))" />
              <TermLine prefix=">"  text="ls current/"                       delay={2200} />
              <TermLine prefix="→"  text="building/  freelance/  go-sabi/"   delay={2600} color="hsl(var(--foreground))" />
              <div className="flex items-center gap-2 font-mono text-xs mt-1">
                <span style={{ color: 'hsl(var(--primary))' }}>{'>'}</span>
                <span className="inline-block w-2 h-[14px] animate-pulse"
                  style={{ backgroundColor: 'hsl(var(--primary))' }} />
              </div>
            </div>
          </div>

          {/* Cybersecurity learning card */}
          <div
            className="rounded-xl border p-4"
            style={{
              borderColor: 'hsl(142 70% 45% / 0.25)',
              backgroundColor: 'hsl(142 70% 45% / 0.04)',
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: 'hsl(142, 70%, 45%)' }} />
                <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'hsl(142, 70%, 45%)' }}>
                  Currently Learning
                </span>
              </div>
              <span
                className="text-[9px] font-mono px-2 py-0.5 rounded-full"
                style={{ backgroundColor: 'hsl(38 92% 50% / 0.15)', color: 'hsl(38, 92%, 50%)' }}
              >
                BEGINNER
              </span>
            </div>

            {/* Badge row */}
            <div
              className="flex items-start gap-3 mb-4 p-3 rounded-lg border"
              style={{ borderColor: 'hsl(var(--border))', backgroundColor: 'hsl(var(--background))' }}
            >
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ backgroundColor: 'hsl(142 70% 45% / 0.15)' }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                  stroke="hsl(142, 70%, 45%)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold" style={{ color: 'hsl(var(--foreground))' }}>
                  Go Sabi — Cybersecurity
                </p>
                <p className="text-[11px] leading-relaxed mt-1" style={{ color: 'hsl(var(--muted-foreground))' }}>
                  Just getting started — learning the fundamentals of network
                  security, ethical hacking, and how systems get compromised.
                  Still early days but committed to seeing it through.
                </p>
              </div>
            </div>

            {/* Progress bars — honest beginner numbers */}
            <div className="flex flex-col gap-3 mb-4">
              <ProgressBar label="Linux & Networking"   pct={32} color="hsl(142, 70%, 45%)" badge="intro" />
              <ProgressBar label="Ethical Hacking"      pct={18} color="hsl(var(--primary))"  badge="intro" />
              <ProgressBar label="Secure Coding"        pct={25} color="hsl(var(--secondary))" badge="learning" />
              <ProgressBar label="CTF / Practice Labs"  pct={12} color="hsl(38, 92%, 50%)"   badge="just started" />
            </div>

            {/* Module tracker */}
            <div
              className="pt-3 border-t flex items-center justify-between flex-wrap gap-2"
              style={{ borderColor: 'hsl(var(--border))' }}
            >
              <span className="text-[11px] font-mono" style={{ color: 'hsl(var(--muted-foreground))' }}>
                Programme progress
              </span>
              <div className="flex items-center gap-2">
                <div className="flex gap-0.5" aria-label="5 out of 10 modules complete">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <div
                      key={i}
                      className="w-3 h-3 rounded-sm transition-colors"
                      style={{
                        backgroundColor: i < 5
                          ? 'hsl(142, 70%, 45%)'
                          : 'hsl(var(--muted))',
                      }}
                    />
                  ))}
                </div>
                <span className="text-[11px] font-mono font-bold" style={{ color: 'hsl(142, 70%, 45%)' }}>
                  5/10
                </span>
              </div>
            </div>

            {/* Honest note */}
            <p
              className="text-[10px] mt-3 font-mono leading-relaxed"
              style={{ color: 'hsl(var(--muted-foreground))' }}
            >
              # still learning — building foundations before going deeper
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}