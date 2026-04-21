"use client";
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { testimonials } from '@/lib/data';
import { User, Circle, X, Minimize2, Maximize2 } from 'lucide-react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface Testimonial {
  id: number;
  content: string;
  name: string;
  role: string;
  company: string;
}

const EditorBlock = ({ testimonial }: { testimonial: Testimonial }) => {
  const lines = testimonial.content.split('\n');
  const fileName = `${testimonial.name.toLowerCase().replace(/\s/g, '_')}_feedback.js`;

  return (
    <div className="rounded-lg overflow-hidden shadow-xl border border-gray-700 bg-[#1e1e1e] transition-all hover:shadow-2xl hover:border-gray-600">
      {/* Window Title Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#2d2d2d] border-b border-gray-700">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#ff5f56] hover:bg-[#ff5f56]/80 transition-colors" />
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e] hover:bg-[#ffbd2e]/80 transition-colors" />
            <div className="w-3 h-3 rounded-full bg-[#27c93f] hover:bg-[#27c93f]/80 transition-colors" />
          </div>
          <span className="ml-2 text-xs text-gray-400 font-mono">{fileName}</span>
        </div>
        <div className="flex gap-1 text-gray-400">
          <Minimize2 className="w-3 h-3 hover:text-white cursor-pointer" />
          <Maximize2 className="w-3 h-3 hover:text-white cursor-pointer" />
          <X className="w-3 h-3 hover:text-white cursor-pointer" />
        </div>
      </div>

      {/* Editor Content */}
      <div className="flex font-mono text-sm">
        {/* Line Numbers */}
        <div className="flex flex-col items-end px-3 py-4 bg-[#1e1e1e] text-gray-500 select-none border-r border-gray-800">
          {lines.map((_, idx) => (
            <div key={idx} className="leading-6">
              {idx + 1}
            </div>
          ))}
        </div>

        {/* Code Area */}
        <pre className="flex-1 py-4 px-3 overflow-x-auto">
          <code className="text-gray-300 leading-6 whitespace-pre-wrap">
            {lines.map((line, idx) => (
              <div key={idx}>
                {line.trim() === '' ? (
                  <br />
                ) : (
                  <span className="text-[#9cdcfe]">{line}</span>
                )}
              </div>
            ))}
            {/* Add a cursor effect at the end */}
            <span className="inline-block w-2 h-4 bg-[#007acc] animate-pulse ml-0.5" />
          </code>
        </pre>
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between px-4 py-1.5 bg-[#007acc] text-white text-xs border-t border-[#007acc]">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="font-mono">TypeScript</span>
            <span className="text-white/70">|</span>
            <span className="font-mono">UTF-8</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
              <User className="w-3 h-3" />
            </div>
            <span className="font-medium">{testimonial.name}</span>
            <span className="text-white/70">•</span>
            <span>{testimonial.role}</span>
            <span className="text-white/70">@</span>
            <span>{testimonial.company}</span>
          </div>
          <span className="font-mono">Ln {lines.length}, Col 1</span>
          <span className="font-mono">Spaces: 2</span>
        </div>
      </div>
    </div>
  );
};

export default function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.testimonial-card').forEach((card, i) => {
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: 'top 88%',
          },
          y: 40,
          opacity: 0,
          duration: 0.8,
          delay: i * 0.15,
          ease: 'power3.out',
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="testimonials"
      className="py-24 px-6 lg:px-12 max-w-7xl mx-auto"
      aria-labelledby="testimonials-heading"
    >
      <p className="section-number mb-4">Social Proof</p>
      <h2 id="testimonials-heading" className="section-title mb-16">
        What Clients Say
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {testimonials.map((t) => (
          <div key={t.id} className="testimonial-card">
            <EditorBlock testimonial={t} />
          </div>
        ))}
      </div>
    </section>
  );
}
