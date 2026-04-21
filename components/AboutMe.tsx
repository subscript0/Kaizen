"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function AboutMe() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const quoteRef = useRef<HTMLHeadingElement>(null);
  const bioRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Heading line animation
      gsap.from(headingRef.current, {
        scrollTrigger: {
          trigger: headingRef.current,
          start: "top 90%",
        },
        y: 30,
        opacity: 0,
        duration: 0.6,
        ease: "power3.out",
      });

      // Quote animation
      gsap.from(quoteRef.current, {
        scrollTrigger: {
          trigger: quoteRef.current,
          start: "top 85%",
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      });

      // Bio paragraphs staggered
      gsap.from(bioRef.current?.children ?? [], {
        scrollTrigger: {
          trigger: bioRef.current,
          start: "top 85%",
        },
        y: 30,
        opacity: 0,
        stagger: 0.12,
        duration: 0.6,
        ease: "power3.out",
      });

      // Image reveal
      gsap.from(imageRef.current, {
        scrollTrigger: {
          trigger: imageRef.current,
          start: "top 80%",
        },
        scale: 0.95,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative py-24 md:py-32 px-6 md:px-12 overflow-hidden"
      aria-labelledby="about-heading"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div ref={headingRef} className="mb-8">
          <p className="text-primary text-sm font-semibold tracking-wider uppercase mb-2">
            About Me
          </p>
          <div className="w-12 h-0.5 bg-primary/60 rounded-full" />
        </div>

        {/* Quote */}
        <h2
          ref={quoteRef}
          id="about-heading"
          className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight max-w-4xl text-foreground mb-12 md:mb-16"
        >
          Turning complex problems into{" "}
          <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            elegant, high-performance
          </span>{" "}
          digital experiences.
        </h2>

        {/* Two column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left column - Bio */}
          <div ref={bioRef} className="space-y-5">
            <div className="space-y-4">
              <p className="text-muted-foreground leading-relaxed text-base">
                I'm a frontend architect with over 6 years of experience crafting
                high-stakes dashboards, fintech portals, and AI-powered tools.
                I don't just write code — I build systems that scale, perform,
                and delight users.
              </p>
              <p className="text-muted-foreground leading-relaxed text-base">
                My philosophy is rooted in clean architecture, real-time data
                integrity, and obsessive performance tuning. Every component I
                ship is an investment in long-term maintainability and
                user-centric design.
              </p>
              <p className="text-muted-foreground leading-relaxed text-base">
                When I'm not pushing pixels, I contribute to open-source,
                mentor junior engineers, and explore the intersection of
                generative AI and UI/UX.
              </p>
            </div>

            {/* Contact button */}
            <div className="pt-4">
              <a
                href="mailto:chiemeried321@gmail.com"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-all duration-300 group"
              >
                <span className="font-medium">chiemeried321@gmail.com</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          </div>

          {/* Right column - Image only */}
          <div
            ref={imageRef}
            className="relative group flex justify-center"
          >
            <div className="relative aspect-square w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/projects/images/me.jpg"
                alt="Kaizen — Frontend Architect"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 400px"
                priority
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
            </div>
            {/* Decorative borders */}
            <div className="absolute -bottom-3 -right-3 w-24 h-24 border-2 border-primary/30 rounded-2xl -z-10" />
            <div className="absolute -top-3 -left-3 w-20 h-20 border-2 border-primary/20 rounded-2xl -z-10" />
          </div>
        </div>
      </div>
    </section>
  );
}
