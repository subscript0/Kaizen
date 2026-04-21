"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { experiences } from "@/lib/data";
import { Briefcase, Calendar, MapPin } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Experience() {
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

      gsap.utils.toArray<HTMLElement>(".exp-card").forEach((card, i) => {
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
      id="experience"
      className="relative py-24 md:py-32 px-6 md:px-12 overflow-hidden"
      aria-labelledby="experience-heading"
    >
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/3 left-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-5xl mx-auto">
        <div ref={headerRef} className="text-center mb-16 md:mb-20">
          <p className="text-primary text-sm font-semibold tracking-wider uppercase mb-3">
            Career
          </p>
          <h2
            id="experience-heading"
            className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent"
          >
            My Experience
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-primary to-primary/40 rounded-full mx-auto mb-6" />
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
            Building and refining frontend systems with a focus on performance,
            scalability, and clean architecture.
          </p>
        </div>

        <div className="space-y-8">
          {experiences.map((exp) => (   // ✅ removed unused 'idx' parameter
            <div
              key={exp.id}
              className="exp-card relative bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-6 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5 hover:border-primary/30 hover:-translate-y-1"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-foreground">{exp.role}</h3>
                  <div className="flex items-center gap-2 text-muted-foreground mt-1">
                    <Briefcase className="w-4 h-4" />
                    <span className="font-medium">{exp.company}</span>
                    <span className="text-border">|</span>
                    <Calendar className="w-4 h-4" />
                    <span>{exp.duration}</span>
                  </div>
                </div>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-4">
                {exp.description}
              </p>
              <ul className="space-y-2">
                {exp.highlights.map((highlight, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="text-primary mt-1">▹</span>
                    {highlight}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}