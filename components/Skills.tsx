'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const icons: Record<string, React.ReactNode> = {
  JavaScript: (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
      <rect width="32" height="32" rx="4" fill="#F7DF1E"/>
      <path d="M9 25.3l2.3-1.4c.44.78.84 1.44 1.8 1.44.92 0 1.5-.36 1.5-1.76V16h2.82v7.66c0 2.9-1.7 4.22-4.18 4.22-2.24 0-3.54-1.16-4.24-2.58zM19.3 25l2.3-1.33c.6 1 1.38 1.73 2.76 1.73 1.16 0 1.9-.58 1.9-1.38 0-.96-.76-1.3-2.04-1.86l-.7-.3c-2.02-.86-3.36-1.94-3.36-4.22 0-2.1 1.6-3.7 4.1-3.7 1.78 0 3.06.62 3.98 2.24l-2.18 1.4c-.48-.86-.99-1.2-1.8-1.2-.82 0-1.34.52-1.34 1.2 0 .84.52 1.18 1.72 1.7l.7.3c2.38 1.02 3.72 2.06 3.72 4.4 0 2.52-1.98 3.9-4.64 3.9-2.6 0-4.28-1.24-5.1-2.88z" fill="#323330"/>
    </svg>
  ),
  TypeScript: (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
      <rect width="32" height="32" rx="4" fill="#3178C6"/>
      <path d="M18.6 20.5v2.3c.37.19.82.34 1.34.44.52.1 1.07.15 1.64.15.56 0 1.09-.06 1.6-.18.5-.12.94-.31 1.31-.58.37-.27.67-.62.88-1.05.21-.43.32-.96.32-1.57 0-.44-.07-.83-.2-1.16a2.7 2.7 0 00-.57-.88 4.1 4.1 0 00-.9-.68c-.35-.2-.74-.39-1.17-.56-.32-.12-.6-.24-.84-.35a3.4 3.4 0 01-.62-.35 1.6 1.6 0 01-.4-.4.9.9 0 01-.14-.5c0-.17.04-.33.12-.46.08-.13.19-.24.33-.33.14-.09.31-.15.5-.2.2-.04.41-.06.65-.06.17 0 .35.01.54.04.19.03.38.07.56.14.19.06.37.15.54.25.17.1.32.23.45.38v-2.14a5.7 5.7 0 00-1.19-.32 8.4 8.4 0 00-1.46-.12c-.55 0-1.07.06-1.56.19-.49.13-.92.32-1.29.59-.37.27-.66.6-.87 1.01a3.1 3.1 0 00-.32 1.44c0 .72.2 1.32.58 1.82.39.5.97.92 1.75 1.26.33.13.63.26.9.38.28.12.51.25.71.38.2.13.35.28.46.44.11.17.17.36.17.58 0 .17-.04.33-.1.47-.07.14-.17.26-.31.36-.14.1-.31.18-.52.23-.21.05-.45.08-.73.08-.47 0-.94-.09-1.4-.26a4.4 4.4 0 01-1.27-.78zM13 15.3H16v-2H7v2h3v9.7h3V15.3z" fill="white"/>
    </svg>
  ),
  React: (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
      <rect width="32" height="32" rx="4" fill="#20232A"/>
      <ellipse cx="16" cy="16" rx="2.4" ry="2.4" fill="#61DAFB"/>
      <ellipse cx="16" cy="16" rx="9" ry="3.5" stroke="#61DAFB" strokeWidth="1.2" fill="none"/>
      <ellipse cx="16" cy="16" rx="9" ry="3.5" stroke="#61DAFB" strokeWidth="1.2" fill="none" transform="rotate(60 16 16)"/>
      <ellipse cx="16" cy="16" rx="9" ry="3.5" stroke="#61DAFB" strokeWidth="1.2" fill="none" transform="rotate(120 16 16)"/>
    </svg>
  ),
  'Next.js': (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
      <rect width="32" height="32" rx="4" fill="#000000"/>
      <circle cx="16" cy="16" r="9.5" fill="none" stroke="#444" strokeWidth=".5"/>
      <path d="M12.5 11.5h1.5v6.8l7-8.8h1.5v9h-1.5v-6.8l-7 8.8H12.5v-9z" fill="white"/>
    </svg>
  ),
  Redux: (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
      <rect width="32" height="32" rx="4" fill="#764ABC"/>
      <path d="M20.6 19.2a1.1 1.1 0 001.1-1.1 1.1 1.1 0 00-1.1-1.1 1.1 1.1 0 00-1.1 1.1c0 .1 0 .2.1.3-.9 1.5-2.3 2.6-3.9 3.2-.5.2-1.1.1-1.5-.2-.3-.2-.5-.5-.5-.9-.1-.3 0-.7.2-1 .2-.2.3-.4.5-.6l-.3-.3c-.3.2-.6.5-.8.9-.2.4-.2.9 0 1.3.3.8.9 1.3 1.7 1.3.3.1.6 0 .8-.1 1.8-.7 3.3-1.9 4.2-3.4.1.1.3.1.5.1z" fill="white"/>
      <path d="M10.3 18c0-.7.5-1.2 1.1-1.2.6 0 1.1.5 1.1 1.2 0 .1 0 .2-.1.3l2.4-2c.3.1.7.1 1.1 0l1.6 1.3c0-.1 0-.1-.1-.2 0-.6.5-1.1 1.1-1.1.6 0 1.1.5 1.1 1.1 0 .6-.5 1.1-1.1 1.1-.3 0-.6-.1-.8-.3l-1.4-1.2c0 .1.1.3.1.4 0 .6-.5 1.1-1.1 1.1-.6 0-1.1-.5-1.1-1.1 0-.1 0-.3.1-.4l-2.4 2c.1.1.1.3.1.4 0 .6-.5 1.1-1.1 1.1-.6 0-1.1-.5-1.1-1.1v-.4z" fill="white"/>
    </svg>
  ),
  'Tailwind CSS': (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
      <rect width="32" height="32" rx="4" fill="#0F172A"/>
      <path d="M16 10c-2.67 0-4.33 1.33-5 4 1-1.33 2.17-1.83 3.5-1.5.76.19 1.3.74 1.9 1.35.98 1 2.1 2.15 4.6 2.15 2.67 0 4.33-1.33 5-4-1 1.33-2.17 1.83-3.5 1.5-.76-.19-1.3-.74-1.9-1.35C21.62 11.15 20.5 10 18 10h-2zm-5 6c-2.67 0-4.33 1.33-5 4 1-1.33 2.17-1.83 3.5-1.5.76.19 1.3.74 1.9 1.35.98 1 2.1 2.15 4.6 2.15 2.67 0 4.33-1.33 5-4-1 1.33-2.17 1.83-3.5 1.5-.76-.19-1.3-.74-1.9-1.35C16.62 17.15 15.5 16 13 16h-2z" fill="#38BDF8"/>
    </svg>
  ),
  GSAP: (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
      <rect width="32" height="32" rx="4" fill="#0E100F"/>
      <path d="M6 16.5c0-4.3 3.4-7.8 7.6-8 .2 0 .4.2.4.4v2.5c0 .2-.2.4-.4.4C11 12 9.2 14 9.2 16.5c0 2.5 1.9 4.5 4.4 4.7.2 0 .4.2.4.4v2.5c0 .2-.2.4-.4.4C9.4 24.3 6 20.8 6 16.5z" fill="#88CE02"/>
      <path d="M14.5 11h5.5c.3 0 .5.2.5.5v6c0 .3-.2.5-.5.5H16v3h-1.5V11z" fill="#88CE02"/>
    </svg>
  ),
  'Framer Motion': (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
      <rect width="32" height="32" rx="4" fill="#0D0D0D"/>
      <path d="M9 8h14v7H9z" fill="#BB4BFF"/>
      <path d="M9 15h7l7 7H9z" fill="#9333EA"/>
      <path d="M9 22h7" stroke="#6D28D9" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  'Node.js': (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
      <rect width="32" height="32" rx="4" fill="#1A1A1A"/>
      <path d="M16 5.5L26 11v10l-10 5.5L6 21V11L16 5.5z" fill="none" stroke="#539E43" strokeWidth="1.2"/>
      <path d="M16 5.5v21M6 11l10 5.5 10-5.5" fill="none" stroke="#539E43" strokeWidth="1.2"/>
    </svg>
  ),
  'Express.js': (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
      <rect width="32" height="32" rx="4" fill="#000000"/>
      <text x="3" y="19" fontSize="8" fill="white" fontFamily="sans-serif" fontWeight="600">express</text>
      <text x="3" y="26" fontSize="5.5" fill="#888" fontFamily="sans-serif">node framework</text>
    </svg>
  ),
  tRPC: (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
      <rect width="32" height="32" rx="4" fill="#2D6EE8"/>
      <text x="4" y="21" fontSize="11" fill="white" fontFamily="monospace" fontWeight="bold">tRPC</text>
    </svg>
  ),
  PostgreSQL: (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
      <rect width="32" height="32" rx="4" fill="#336791"/>
      <ellipse cx="16" cy="12" rx="7" ry="4.5" fill="none" stroke="white" strokeWidth="1.2"/>
      <path d="M9 12v8c0 2.5 3.1 4.5 7 4.5s7-2 7-4.5v-8" fill="none" stroke="white" strokeWidth="1.2"/>
      <line x1="9" y1="16" x2="23" y2="16" stroke="white" strokeWidth=".8" opacity=".5"/>
      <line x1="19.5" y1="10" x2="22" y2="22" stroke="white" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  ),
  MongoDB: (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
      <rect width="32" height="32" rx="4" fill="#001E2B"/>
      <path d="M16 4.5C16 4.5 9.5 11 9.5 17.5a6.5 6.5 0 0013 0C22.5 11 16 4.5 16 4.5z" fill="#00ED64"/>
      <path d="M16 20v7.5" stroke="#00684A" strokeWidth="2" strokeLinecap="round"/>
      <path d="M16 20v7.5" stroke="#00ED64" strokeWidth="1" strokeLinecap="round"/>
    </svg>
  ),
  Prisma: (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
      <rect width="32" height="32" rx="4" fill="#2D3748"/>
      <path d="M8.5 23.5L16.5 5.5l9 14-17.5 4z" fill="none" stroke="#A78BFA" strokeWidth="1.3" strokeLinejoin="round"/>
      <path d="M8.5 23.5l8-3.5" stroke="#A78BFA" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  ),
  LangChain: (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
      <rect width="32" height="32" rx="4" fill="#1C1C1C"/>
      <path d="M7 16a4 4 0 014-4h2v8h-2a4 4 0 01-4-4z" fill="none" stroke="#1EE3CF" strokeWidth="1.3"/>
      <path d="M25 16a4 4 0 01-4 4h-2v-8h2a4 4 0 014 4z" fill="none" stroke="#1EE3CF" strokeWidth="1.3"/>
      <rect x="13" y="12" width="6" height="8" rx="1" fill="#1EE3CF" opacity=".25"/>
      <line x1="16" y1="12" x2="16" y2="20" stroke="#1EE3CF" strokeWidth="1" strokeDasharray="2 1"/>
    </svg>
  ),
  'OpenAI API': (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
      <rect width="32" height="32" rx="4" fill="#000000"/>
      <path d="M25.5 12.9a6.5 6.5 0 00-.5-5.4A6.5 6.5 0 0118 4.9a6.5 6.5 0 00-4.9-2.2 6.5 6.5 0 00-6.2 4.5 6.5 6.5 0 00-4.3 3.1 6.5 6.5 0 00.8 7.7 6.5 6.5 0 00.5 5.4 6.5 6.5 0 007 3.1 6.5 6.5 0 004.9 2.2 6.5 6.5 0 006.2-4.5 6.5 6.5 0 004.3-3.1 6.5 6.5 0 00-.8-7.7zM16 22.2a4.9 4.9 0 01-3.1-1l5.2-3v5.8a5 5 0 01-2.1.2zM7.2 19.7a4.9 4.9 0 01-.6-3.3l5.2 3-5.2 3a5 5 0 01.6-2.7zm-1-6.8a4.9 4.9 0 012.5-2.1v6l-5.2-3a5 5 0 012.7-.9zm9.8-6.2a4.9 4.9 0 013.1 1l-5.2 3V4.9a5 5 0 012.1.2v1.6zm8.8 6.8a4.9 4.9 0 01-.6 3.3l-5.2-3 5.2-3a5 5 0 01.6 2.7zm-1 6.8a4.9 4.9 0 01-2.5 2.1v-6l5.2 3a5 5 0 01-2.7.9z" fill="white"/>
    </svg>
  ),
  'Vector DBs': (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
      <rect width="32" height="32" rx="4" fill="#3B0764"/>
      <ellipse cx="16" cy="11" rx="8" ry="3.5" fill="none" stroke="#E9D5FF" strokeWidth="1.2"/>
      <path d="M8 11v5c0 1.93 3.58 3.5 8 3.5s8-1.57 8-3.5v-5" fill="none" stroke="#E9D5FF" strokeWidth="1.2"/>
      <path d="M8 16v5c0 1.93 3.58 3.5 8 3.5s8-1.57 8-3.5v-5" fill="none" stroke="#C084FC" strokeWidth="1.2"/>
    </svg>
  ),
  Git: (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
      <rect width="32" height="32" rx="4" fill="#F05032"/>
      <path d="M27.3 14.7L17.3 4.7a1.6 1.6 0 00-2.3 0L13 6.7l2.9 2.9a1.9 1.9 0 012.4 2.4l2.8 2.8a1.9 1.9 0 11-1.1 1.1L17.5 13v6.3a1.9 1.9 0 11-1.6-.1V12.6a1.9 1.9 0 01-1-2.5L12 7.4l-7.3 7.3a1.6 1.6 0 000 2.3l10 10a1.6 1.6 0 002.3 0l10.3-10.3a1.6 1.6 0 000-2.3z" fill="white"/>
    </svg>
  ),
  Docker: (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
      <rect width="32" height="32" rx="4" fill="#2496ED"/>
      <rect x="6.5" y="13" width="3.5" height="3" rx=".4" fill="white"/>
      <rect x="11" y="13" width="3.5" height="3" rx=".4" fill="white"/>
      <rect x="15.5" y="13" width="3.5" height="3" rx=".4" fill="white"/>
      <rect x="11" y="9" width="3.5" height="3" rx=".4" fill="white"/>
      <rect x="15.5" y="9" width="3.5" height="3" rx=".4" fill="white"/>
      <path d="M25.5 15.5s-.8-1.8-3.2-1.5c-.4-1.8-2.3-2.3-2.3-2.3s.4 2.3-1 4.3H6.5S6.2 21.8 11 22.5h11c3.2 0 5.5-2.5 3.5-7z" fill="white" fillOpacity=".9"/>
    </svg>
  ),
  AWS: (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
      <rect width="32" height="32" rx="4" fill="#232F3E"/>
      <path d="M10.5 18.8c-.4-.1-.7-.3-.9-.5-.2-.2-.3-.5-.3-.8 0-.4.2-.8.5-1 .3-.3.8-.5 1.4-.5.3 0 .6 0 .9.1.3.1.5.2.7.3v1c-.2-.2-.4-.3-.7-.4-.3-.1-.5-.1-.8-.1-.3 0-.6.1-.8.3-.2.1-.3.3-.3.6 0 .2.1.3.2.4.2.1.4.2.8.3l.5.1c.5.1.9.3 1.2.6.3.2.4.6.4 1 0 .4-.2.8-.5 1.1-.3.3-.9.5-1.5.5-.4 0-.7 0-1-.1-.3-.1-.6-.3-.8-.5v-1.1c.3.3.5.4.8.6.3.1.6.2.9.2.4 0 .6-.1.8-.2.2-.1.3-.3.3-.5 0-.2-.1-.4-.3-.5-.2-.1-.5-.2-.9-.3l-.6-.2zM16.5 21.3l-2-5.8h1.1l1.4 4.2 1.4-4.2h1l1.4 4.2 1.4-4.2H23l-2 5.8h-1L18.5 17l-1.4 4.3h-1.1-.5zM9.8 23c2.2 1 4.6 1.5 7.2 1.4 3.3-.1 6.2-1.4 8.2-3.4" stroke="#FF9900" strokeWidth="1" strokeLinecap="round" fill="none"/>
      <path d="M24 22l1.5-.5-1-.5" fill="none" stroke="#FF9900" strokeWidth="1" strokeLinejoin="round"/>
    </svg>
  ),
};

const skillsData = [
  {
    category: 'frontend',
    items: ['JavaScript','TypeScript','React','Next.js','Redux','Tailwind CSS','GSAP','Framer Motion'],
  },
  { category: 'backend', items: ['Node.js','Express.js','tRPC'] },
  { category: 'database', items: ['PostgreSQL','MongoDB','Prisma'] },
  { category: 'AI/ML', items: ['LangChain','OpenAI API','Vector DBs'] },
  { category: 'tools', items: ['Git','Docker','AWS'] },
];

export default function Skills() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeCategory, setActiveCategory] = useState('frontend');

  const currentItems =
    skillsData.find((s) => s.category === activeCategory)?.items ?? [];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.skill-item', {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
        scale: 0.8,
        opacity: 0,
        stagger: 0.05,
        duration: 0.45,
        ease: 'back.out(1.4)',
      });
    }, sectionRef);
    return () => ctx.revert();
  }, [activeCategory]);

  return (
    <section
      ref={sectionRef}
      id="skills"
      className="py-24 px-6 lg:px-12 max-w-7xl mx-auto"
      aria-labelledby="skills-heading"
    >
      <p className="section-number mb-4">My Stack</p>
      <h2 id="skills-heading" className="section-title mb-12">
        Tools &amp; Technologies
      </h2>

      {/* Category tabs */}
      <div className="flex flex-wrap gap-2 mb-10" role="tablist">
        {skillsData.map((cat) => (
          <button
            key={cat.category}
            role="tab"
            aria-selected={activeCategory === cat.category}
            onClick={() => setActiveCategory(cat.category)}
            className={`px-4 py-2 text-sm rounded-full border transition-all duration-200 capitalize min-h-[44px] ${
              activeCategory === cat.category
                ? 'border-primary bg-primary/10 text-primary font-medium'
                : 'border-border text-muted-foreground hover:border-primary/50 hover:text-foreground'
            }`}
          >
            {cat.category}
          </button>
        ))}
      </div>

      {/* Icons grid */}
      <div
        className="grid grid-cols-3 xs:grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-3"
        role="tabpanel"
      >
        {currentItems.map((name) => (
          <div key={name} className="skill-item" title={name}>
            <div className="w-10 h-10 flex items-center justify-center drop-shadow-sm">
              {icons[name] ?? (
                <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <span className="text-[9px] font-bold text-primary text-center leading-tight px-1">
                    {name.slice(0, 3).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            <span className="text-[10px] text-muted-foreground text-center leading-tight">
              {name}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
