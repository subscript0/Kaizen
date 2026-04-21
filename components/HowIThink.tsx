"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Lightbulb, Layers, Zap, Rocket } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const approaches = [
  {
    number: "01",
    title: "Business-First Thinking",
    body: "Before touching code, I understand the goal: what metric needs to move? Every UI decision traces back to a business outcome — conversion rate, time-to-insight, support ticket reduction.",
    icon: Lightbulb,
    gradient: "from-amber-500 to-orange-500",
  },
  {
    number: "02",
    title: "Systems Over Screens",
    body: "I design for scale. Component architecture, data-fetching strategies, and state management patterns are planned upfront so the codebase can grow without rewrites.",
    icon: Layers,
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    number: "03",
    title: "Performance as a Feature",
    body: "A 3-second load is a lost user. I treat Lighthouse scores and Core Web Vitals as product requirements, not nice-to-haves. Bundle splitting, lazy loading, and server components are defaults.",
    icon: Zap,
    gradient: "from-purple-500 to-pink-500",
  },
  {
    number: "04",
    title: "Ship, Then Sharpen",
    body: "I bias toward momentum. A working feature that ships beats a perfect feature that doesn't. I ship iteratively, measure, then improve — informed by real user behaviour.",
    icon: Rocket,
    gradient: "from-emerald-500 to-teal-500",
  },
];

export default function HowIThink() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headerRef.current, {
        scrollTrigger: { trigger: headerRef.current, start: "top 85%" },
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      });

      gsap.utils.toArray<HTMLElement>(".approach-card").forEach((card, i) => {
        gsap.from(card, {
          scrollTrigger: { trigger: card, start: "top 88%" },
          y: 50,
          opacity: 0,
          duration: 0.6,
          delay: i * 0.1,
          ease: "back.out(0.6)",
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="approach"
      className="relative py-24 md:py-32 px-6 md:px-12 overflow-hidden"
      aria-labelledby="approach-heading"
    >
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/3 right-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto">
        <div ref={headerRef} className="text-center mb-16 md:mb-20">
          <p className="text-primary text-sm font-semibold tracking-wider uppercase mb-3">
            Philosophy
          </p>
          <h2
            id="approach-heading"
            className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent"
          >
            How I Think
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-primary to-primary/40 rounded-full mx-auto mb-6" />
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
            I build systems, not just screens. Every project starts with
            understanding the business goal, then designing for scalability,
            performance, and real-user needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {approaches.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.number}
                className="approach-card group relative bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-6 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5 hover:border-primary/30 hover:-translate-y-1"
              >
                <div className="absolute top-4 right-4 text-4xl font-black text-foreground/5 group-hover:text-foreground/10 transition-colors">
                  {item.number}
                </div>
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.gradient} p-2.5 mb-4 shadow-lg transition-transform group-hover:scale-110 duration-300`}
                >
                  <Icon className="w-full h-full text-white" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {item.body}
                </p>
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent transition-all duration-300 group-hover:w-full" />
              </div>
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <p className="text-xs text-muted-foreground font-mono">— kaizen —</p>
        </div>
      </div>
    </section>
  );
}