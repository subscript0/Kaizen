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
      gsap.from(headingRef.current, {
        scrollTrigger: { trigger: headingRef.current, start: "top 90%" },
        y: 30,
        opacity: 0,
        duration: 0.6,
        ease: "power3.out",
      });

      gsap.from(quoteRef.current, {
        scrollTrigger: { trigger: quoteRef.current, start: "top 85%" },
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      });

      gsap.from(bioRef.current?.children ?? [], {
        scrollTrigger: { trigger: bioRef.current, start: "top 85%" },
        y: 30,
        opacity: 0,
        stagger: 0.12,
        duration: 0.6,
        ease: "power3.out",
      });

      gsap.from(imageRef.current, {
        scrollTrigger: { trigger: imageRef.current, start: "top 80%" },
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
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto">
        <div ref={headingRef} className="mb-8">
          <p className="text-primary text-sm font-semibold tracking-wider uppercase mb-2">
            About Me
          </p>
          <div className="w-12 h-0.5 bg-primary/60 rounded-full" />
        </div>

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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          <div ref={bioRef} className="space-y-5">
            <div className="space-y-4">
         <p className="text-muted-foreground leading-relaxed text-base">
  I’m a full stack developer with around 5 years of experience building
  web applications, dashboards, and system-driven interfaces. I work across
  both frontend and backend, focusing on turning complex ideas into clean,
  functional products without unnecessary complexity.
</p>
<p className="text-muted-foreground leading-relaxed text-base">
  My work is centered on practical architecture, reusable components,
  and reliable data flow between client and server. I care less about
  trends and more about building systems that are stable, scalable,
  and maintainable over time.
</p>
<p className="text-muted-foreground leading-relaxed text-base">
  I spend a lot of time improving how I think about systems, API design,
  and problem-solving. I’m also exploring the intersection of frontend
  development, cybersecurity, and AI to better understand how modern
  products are built and secured end-to-end.
</p>

            </div>

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

          <div ref={imageRef} className="relative group flex justify-center">
            <div className="relative aspect-square w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/projects/images/me.jpg"
                alt="Kaizen — Full-Stack Developer"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 400px"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
            </div>
            <div className="absolute -bottom-3 -right-3 w-24 h-24 border-2 border-primary/30 rounded-2xl -z-10" />
            <div className="absolute -top-3 -left-3 w-20 h-20 border-2 border-primary/20 rounded-2xl -z-10" />
          </div>
        </div>
      </div>
    </section>
  );
}