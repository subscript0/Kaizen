"use client";
import { useState, useRef } from "react";
import { useReveal } from '@/lib/motion';

export default function UsesSection() {
  const [tech, setTech] = useState("");
  const [usesList, setUsesList] = useState([
    { id: 1, item: "Next.js 15", category: "Framework" },
    { id: 2, item: "TypeScript", category: "Language" },
    { id: 3, item: "Tailwind CSS", category: "Styling" },
    { id: 4, item: "GSAP", category: "Animation" },
    { id: 5, item: "Framer Motion", category: "Animation" },
    { id: 6, item: "Recharts", category: "Charts" },
    { id: 7, item: "Lucide Icons", category: "Icons" },
    { id: 8, item: "Node.js", category: "Backend" },
    { id: 9, item: "MongoDB", category: "Database" },
    { id: 10, item: "Firebase", category: "Backend" },
  ]);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (tech.trim()) {
      setUsesList([
        ...usesList,
        {
          id: Date.now(),
          item: tech,
          category: "Tool",
        },
      ]);
      setTech("");
    }
  };

  const scopeRef = useRef<HTMLElement>(null);
  // Reveal animation for the section
  useReveal(scopeRef);

  return (
    <section
      id="uses"
      ref={scopeRef}
      className="py-24 px-6 lg:px-12 max-w-[980px] mx-auto"
      data-reveal
    >
      {/* Section number with motion design styling */}
      <p className="section-number mb-6 text-xs font-semibold uppercase tracking-[0.2em] text-primary" data-reveal>
        06 — Uses
      </p>
      {/* Section title */}
      <h2 className="section-title mb-8 text-[clamp(1.5rem,5vw,2.5rem)] font-extrabold leading-none text-foreground" data-reveal>
        What I Use
      </h2>
      {/* Grid using design system spacing */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {usesList.map((use) => (
          <div
            key={use.id}
            data-reveal
            className="group flex flex-col items-center p-6 rounded-xl border border-border/30 bg-background-light/30 backdrop-blur-sm
                       transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1.0)] hover:border-primary/50 hover:shadow-sm"
          >
            {/* Item name */}
            <h3 className="mb-3 text-lg font-semibold text-foreground/80 group-hover:text-foreground transition-colors duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1.0)]">
              {use.item}
            </h3>
            {/* Category */}
            <p className="text-sm text-muted-foreground/60 uppercase tracking-[0.1em]">
              {use.category}
            </p>
          </div>
        ))}
      </div>

      {/* Add new item section */}
      <div data-reveal className="mt-12 pt-8 border-t border-border/50">
        <h3 className="mb-4 text-lg font-semibold text-foreground/80 group-hover:text-foreground transition-colors duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1.0)]">
          Add to my stack
        </h3>
        <form onSubmit={handleAdd} className="space-y-4">
          <div>
            <label
              htmlFor="tech-input"
              className="block mb-2 text-sm font-medium text-muted-foreground/60"
            >
              Technology/Tool
            </label>
            <input
              type="text"
              id="tech-input"
              value={tech}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setTech(e.target.value)
              }
              className="input w-full"
              placeholder="e.g., Docker, AWS, etc."
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary btn-fx-sweep w-full"
          >
            Add to Stack
            <span className="ml-2 transition-transform duration-200 ease-[cubic-bezier(0.25,0.1,0.25,1.0)] group-hover:translate-x-0.5">
              →
            </span>
          </button>
        </form>
      </div>
    </section>
  );
}