'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const experiences = [
  {
    id: 1,
    duration: '2024 – Present',
    company: 'Personal Projects / Freelance',
    role: 'Frontend Engineer',
    description:
      'Building and refining frontend systems for web applications with a focus on performance, scalability, and clean architecture. Working independently on real-world projects, translating ideas into production-ready interfaces.',
    highlights: [
      'Developed responsive dashboards with dynamic data rendering and optimized state management',
      'Improved load performance using code splitting, lazy loading, and asset optimization techniques',
      'Designed reusable component structures to maintain consistency across multiple projects',
    ],
  },
  {
    id: 2,
    duration: '2023 – 2024',
    company: 'Self-Directed Learning / Projects',
    role: 'UI Engineer',
    description:
      'Focused on mastering modern frontend development by building and iterating on multiple UI-heavy applications. Emphasis on design precision, usability, and developer workflow.',
    highlights: [
      'Built and deployed interactive web interfaces, including chat-style UIs and productivity tools',
      'Achieved high performance and accessibility standards through testing and optimization',
      'Created reusable UI components and documented them for scalability and reuse',
    ],
  },
];

export default function Experience() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.experience-item').forEach((item) => {
        gsap.to(item, {
          scrollTrigger: { trigger: item, start: 'top 85%' },
          x: 0,
          opacity: 1,
          duration: 0.7,
          ease: 'power3.out',
        });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="experience"
      className="py-24 px-6 lg:px-12 max-w-7xl mx-auto"
      aria-labelledby="experience-heading"
    >
      <p className="section-number mb-4">Career</p>
      <h2 id="experience-heading" className="section-title mb-16">
        My Experience
      </h2>

      <div className="flex flex-col gap-0">
        {experiences.map((exp) => (
          <article
            key={exp.id}
            className="experience-item grid grid-cols-1 md:grid-cols-[220px_1fr] gap-4 md:gap-12 py-8 border-b border-border/50 last:border-0"
          >
            {/* Meta column */}
            <div className="flex flex-col gap-1">
              <p className="text-sm text-muted-foreground font-mono">{exp.duration}</p>
              <p className="text-xs text-primary font-semibold tracking-widest uppercase mt-1">
                {exp.company}
              </p>
            </div>

            {/* Content column */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">{exp.role}</h3>
              <p className="text-muted-foreground leading-relaxed text-sm mb-5">
                {exp.description}
              </p>
              <ul className="flex flex-col gap-2.5">
                {exp.highlights.map((h, j) => (
                  <li key={j} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <span
                      className="mt-2 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0"
                      aria-hidden="true"
                    />
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
