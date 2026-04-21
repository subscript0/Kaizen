'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

// ── All skills with inline SVG icons ─────────────────────────────────────────
const ALL_SKILLS = [
  {
    name: 'HTML5',
    category: 'frontend',
    icon: (
      <svg viewBox="0 0 32 32" className="w-8 h-8">
        <rect width="32" height="32" rx="4" fill="#E44D26"/>
        <path d="M7 4l1.8 20.4L16 27l7.2-2.6L25 4H7zm14.4 6H12.6l.2 2.4h8.4l-.6 6.8-4.6 1.3-4.6-1.3-.3-3.6h2.3l.2 1.8 2.4.6 2.4-.6.3-3H11.8L11 8h10.6l-.2 2z" fill="white"/>
      </svg>
    ),
  },
  {
    name: 'CSS3',
    category: 'frontend',
    icon: (
      <svg viewBox="0 0 32 32" className="w-8 h-8">
        <rect width="32" height="32" rx="4" fill="#1572B6"/>
        <path d="M7 4l1.8 20.4L16 27l7.2-2.6L25 4H7zm13.6 8.4l-.2 2-4.4 1.2-4.4-1.2-.3-3.4h2.3l.2 1.8 2.2.6 2.2-.6.2-2.4H11.4L11.2 8H21l-.2 2-4.8 1.3-4.8-1.3H21z" fill="white"/>
      </svg>
    ),
  },
  {
    name: 'JavaScript',
    category: 'frontend',
    icon: (
      <svg viewBox="0 0 32 32" className="w-8 h-8">
        <rect width="32" height="32" rx="4" fill="#F7DF1E"/>
        <path d="M9 25.3l2.3-1.4c.44.78.84 1.44 1.8 1.44.92 0 1.5-.36 1.5-1.76V16h2.82v7.66c0 2.9-1.7 4.22-4.18 4.22-2.24 0-3.54-1.16-4.24-2.58zM19.3 25l2.3-1.33c.6 1 1.38 1.73 2.76 1.73 1.16 0 1.9-.58 1.9-1.38 0-.96-.76-1.3-2.04-1.86l-.7-.3c-2.02-.86-3.36-1.94-3.36-4.22 0-2.1 1.6-3.7 4.1-3.7 1.78 0 3.06.62 3.98 2.24l-2.18 1.4c-.48-.86-.99-1.2-1.8-1.2-.82 0-1.34.52-1.34 1.2 0 .84.52 1.18 1.72 1.7l.7.3c2.38 1.02 3.72 2.06 3.72 4.4 0 2.52-1.98 3.9-4.64 3.9-2.6 0-4.28-1.24-5.1-2.88z" fill="#323330"/>
      </svg>
    ),
  },
  {
    name: 'TypeScript',
    category: 'frontend',
    icon: (
      <svg viewBox="0 0 32 32" className="w-8 h-8">
        <rect width="32" height="32" rx="4" fill="#3178C6"/>
        <path d="M18.6 20.5v2.3c.37.19.82.34 1.34.44.52.1 1.07.15 1.64.15.56 0 1.09-.06 1.6-.18.5-.12.94-.31 1.31-.58.37-.27.67-.62.88-1.05.21-.43.32-.96.32-1.57 0-.44-.07-.83-.2-1.16a2.7 2.7 0 00-.57-.88 4.1 4.1 0 00-.9-.68 9.7 9.7 0 00-1.17-.56c-.32-.12-.6-.24-.84-.35a3.4 3.4 0 01-.62-.35 1.6 1.6 0 01-.4-.4.9.9 0 01-.14-.5c0-.17.04-.33.12-.46.08-.13.19-.24.33-.33.14-.09.31-.15.5-.2.2-.04.41-.06.65-.06.17 0 .35.01.54.04.19.03.38.07.56.14.19.06.37.15.54.25.17.1.32.23.45.38v-2.14a5.7 5.7 0 00-1.19-.32 8.4 8.4 0 00-1.46-.12c-.55 0-1.07.06-1.56.19-.49.13-.92.32-1.29.59a2.8 2.8 0 00-.87 1.01 3.1 3.1 0 00-.32 1.44c0 .72.2 1.32.58 1.82.39.5.97.92 1.75 1.26.33.13.63.26.9.38.28.12.51.25.71.38.2.13.35.28.46.44.11.17.17.36.17.58 0 .17-.04.33-.1.47-.07.14-.17.26-.31.36-.14.1-.31.18-.52.23-.21.05-.45.08-.73.08-.47 0-.94-.09-1.4-.26a4.4 4.4 0 01-1.27-.78zM13 15.3H16v-2H7v2h3v9.7h3V15.3z" fill="white"/>
      </svg>
    ),
  },
  {
    name: 'React',
    category: 'frontend',
    icon: (
      <svg viewBox="0 0 32 32" className="w-8 h-8">
        <rect width="32" height="32" rx="4" fill="#20232A"/>
        <ellipse cx="16" cy="16" rx="2.4" ry="2.4" fill="#61DAFB"/>
        <ellipse cx="16" cy="16" rx="9" ry="3.5" stroke="#61DAFB" strokeWidth="1.2" fill="none"/>
        <ellipse cx="16" cy="16" rx="9" ry="3.5" stroke="#61DAFB" strokeWidth="1.2" fill="none" transform="rotate(60 16 16)"/>
        <ellipse cx="16" cy="16" rx="9" ry="3.5" stroke="#61DAFB" strokeWidth="1.2" fill="none" transform="rotate(120 16 16)"/>
      </svg>
    ),
  },
  {
    name: 'React Native',
    category: 'frontend',
    icon: (
      <svg viewBox="0 0 32 32" className="w-8 h-8">
        <rect width="32" height="32" rx="4" fill="#1A1A2E"/>
        <ellipse cx="16" cy="16" rx="2.4" ry="2.4" fill="#61DAFB"/>
        <ellipse cx="16" cy="16" rx="9" ry="3.5" stroke="#61DAFB" strokeWidth="1.2" fill="none"/>
        <ellipse cx="16" cy="16" rx="9" ry="3.5" stroke="#61DAFB" strokeWidth="1.2" fill="none" transform="rotate(60 16 16)"/>
        <ellipse cx="16" cy="16" rx="9" ry="3.5" stroke="#61DAFB" strokeWidth="1.2" fill="none" transform="rotate(120 16 16)"/>
        <rect x="5" y="26" width="22" height="3" rx="1.5" fill="#61DAFB" opacity=".4"/>
      </svg>
    ),
  },
  {
    name: 'Next.js',
    category: 'frontend',
    icon: (
      <svg viewBox="0 0 32 32" className="w-8 h-8">
        <rect width="32" height="32" rx="4" fill="#000"/>
        <path d="M12.5 11.5h1.5v6.8l7-8.8h1.5v9h-1.5v-6.8l-7 8.8H12.5v-9z" fill="white"/>
      </svg>
    ),
  },
  {
    name: 'Tailwind',
    category: 'frontend',
    icon: (
      <svg viewBox="0 0 32 32" className="w-8 h-8">
        <rect width="32" height="32" rx="4" fill="#0F172A"/>
        <path d="M16 10c-2.67 0-4.33 1.33-5 4 1-1.33 2.17-1.83 3.5-1.5.76.19 1.3.74 1.9 1.35.98 1 2.1 2.15 4.6 2.15 2.67 0 4.33-1.33 5-4-1 1.33-2.17 1.83-3.5 1.5-.76-.19-1.3-.74-1.9-1.35C21.62 11.15 20.5 10 18 10h-2zm-5 6c-2.67 0-4.33 1.33-5 4 1-1.33 2.17-1.83 3.5-1.5.76.19 1.3.74 1.9 1.35.98 1 2.1 2.15 4.6 2.15 2.67 0 4.33-1.33 5-4-1 1.33-2.17 1.83-3.5 1.5-.76-.19-1.3-.74-1.9-1.35C16.62 17.15 15.5 16 13 16h-2z" fill="#38BDF8"/>
      </svg>
    ),
  },
  {
    name: 'Node.js',
    category: 'backend',
    icon: (
      <svg viewBox="0 0 32 32" className="w-8 h-8">
        <rect width="32" height="32" rx="4" fill="#1A1A1A"/>
        <path d="M16 5.5L26 11v10l-10 5.5L6 21V11L16 5.5z" fill="none" stroke="#539E43" strokeWidth="1.2"/>
        <path d="M16 5.5v21M6 11l10 5.5 10-5.5" fill="none" stroke="#539E43" strokeWidth="1.2"/>
      </svg>
    ),
  },
  {
    name: 'MongoDB',
    category: 'backend',
    icon: (
      <svg viewBox="0 0 32 32" className="w-8 h-8">
        <rect width="32" height="32" rx="4" fill="#001E2B"/>
        <path d="M16 4.5C16 4.5 9.5 11 9.5 17.5a6.5 6.5 0 0013 0C22.5 11 16 4.5 16 4.5z" fill="#00ED64"/>
        <path d="M16 20v7.5" stroke="#00684A" strokeWidth="2" strokeLinecap="round"/>
        <path d="M16 20v7.5" stroke="#00ED64" strokeWidth="1" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    name: 'Firebase',
    category: 'backend',
    icon: (
      <svg viewBox="0 0 32 32" className="w-8 h-8">
        <rect width="32" height="32" rx="4" fill="#1C1C1C"/>
        <path d="M8 22.8l3.6-14.1 3 5.5L17 8l7 14.8L16 26 8 22.8z" fill="#FFA000"/>
        <path d="M8 22.8l3.6-14.1 3 5.5L8 22.8z" fill="#F57F17"/>
        <path d="M14.6 14.2L17 8l7 14.8-9.4-8.6z" fill="#FFCA28"/>
        <path d="M8 22.8L16 26l7-3.2H8z" fill="#FFA000" opacity=".6"/>
      </svg>
    ),
  },
  {
    name: 'Git',
    category: 'tools',
    icon: (
      <svg viewBox="0 0 32 32" className="w-8 h-8">
        <rect width="32" height="32" rx="4" fill="#F05032"/>
        <path d="M27.3 14.7L17.3 4.7a1.6 1.6 0 00-2.3 0L13 6.7l2.9 2.9a1.9 1.9 0 012.4 2.4l2.8 2.8a1.9 1.9 0 11-1.1 1.1L17.5 13v6.3a1.9 1.9 0 11-1.6-.1V12.6a1.9 1.9 0 01-1-2.5L12 7.4l-7.3 7.3a1.6 1.6 0 000 2.3l10 10a1.6 1.6 0 002.3 0l10.3-10.3a1.6 1.6 0 000-2.3z" fill="white"/>
      </svg>
    ),
  },
  {
    name: 'Docker',
    category: 'tools',
    icon: (
      <svg viewBox="0 0 32 32" className="w-8 h-8">
        <rect width="32" height="32" rx="4" fill="#2496ED"/>
        <rect x="6.5" y="13" width="3.5" height="3" rx=".4" fill="white"/>
        <rect x="11"  y="13" width="3.5" height="3" rx=".4" fill="white"/>
        <rect x="15.5" y="13" width="3.5" height="3" rx=".4" fill="white"/>
        <rect x="11"  y="9"  width="3.5" height="3" rx=".4" fill="white"/>
        <rect x="15.5" y="9"  width="3.5" height="3" rx=".4" fill="white"/>
        <path d="M25.5 15.5s-.8-1.8-3.2-1.5c-.4-1.8-2.3-2.3-2.3-2.3s.4 2.3-1 4.3H6.5S6.2 21.8 11 22.5h11c3.2 0 5.5-2.5 3.5-7z" fill="white" fillOpacity=".9"/>
      </svg>
    ),
  },
  {
    name: 'GitHub',
    category: 'tools',
    icon: (
      <svg viewBox="0 0 32 32" className="w-8 h-8">
        <rect width="32" height="32" rx="4" fill="#24292E"/>
        <path d="M16 6.4C10.7 6.4 6.4 10.7 6.4 16c0 4.2 2.7 7.8 6.5 9.1.5.1.6-.2.6-.4v-1.5c-2.6.6-3.2-1.2-3.2-1.2-.4-1.1-1-1.4-1-1.4-.8-.6.1-.6.1-.6.9.1 1.4.9 1.4.9.8 1.4 2.1 1 2.6.8.1-.6.3-1 .6-1.2-2.1-.2-4.3-1-4.3-4.6 0-1 .4-1.9 1-2.5-.1-.2-.4-1.2.1-2.5 0 0 .8-.3 2.6 1a9 9 0 014.8 0c1.8-1.3 2.6-1 2.6-1 .5 1.3.2 2.3.1 2.5.6.6 1 1.5 1 2.5 0 3.6-2.2 4.4-4.3 4.6.3.3.6.9.6 1.8v2.7c0 .3.2.5.6.4 3.8-1.3 6.5-4.9 6.5-9.1C25.6 10.7 21.3 6.4 16 6.4z" fill="white"/>
      </svg>
    ),
  },
  {
    name: 'TSX',
    category: 'frontend',
    icon: (
      <svg viewBox="0 0 32 32" className="w-8 h-8">
        <rect width="32" height="32" rx="4" fill="#1e40af"/>
        <text x="4" y="22" fontSize="11" fill="white" fontFamily="monospace" fontWeight="bold">.tsx</text>
      </svg>
    ),
  },
  {
    name: 'JSON',
    category: 'tools',
    icon: (
      <svg viewBox="0 0 32 32" className="w-8 h-8">
        <rect width="32" height="32" rx="4" fill="#1C1C1C"/>
        <text x="3" y="22" fontSize="10" fill="#F7DF1E" fontFamily="monospace" fontWeight="bold">JSON</text>
      </svg>
    ),
  },
];

const CATEGORIES = ['all', 'frontend', 'backend', 'tools'] as const;
type Category = typeof CATEGORIES[number];

export default function Skills() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeCategory, setActiveCategory] = useState<Category>('all');

  const filtered = activeCategory === 'all'
    ? ALL_SKILLS
    : ALL_SKILLS.filter(s => s.category === activeCategory);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.skill-item', {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
        scale: 0.8,
        opacity: 0,
        stagger: 0.04,
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
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            role="tab"
            aria-selected={activeCategory === cat}
            onClick={() => setActiveCategory(cat)}
            className="px-4 py-2 text-sm rounded-full border transition-all duration-200 capitalize min-h-[44px]"
            style={{
              borderColor: activeCategory === cat ? 'hsl(var(--primary))' : 'hsl(var(--border))',
              backgroundColor: activeCategory === cat ? 'hsl(var(--primary) / 0.1)' : 'transparent',
              color: activeCategory === cat ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))',
              fontWeight: activeCategory === cat ? '600' : '400',
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Icons grid */}
      <div
        className="grid grid-cols-4 xs:grid-cols-5 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-4"
        role="tabpanel"
      >
        {filtered.map((skill) => (
          <div key={skill.name} className="skill-item group flex flex-col items-center gap-2 p-3 rounded-xl border transition-all duration-200 cursor-default"
            style={{ borderColor: 'hsl(var(--border))', backgroundColor: 'hsl(var(--background-light))' }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.borderColor = 'hsl(var(--primary) / 0.5)';
              (e.currentTarget as HTMLElement).style.backgroundColor = 'hsl(var(--primary) / 0.05)';
              (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.borderColor = 'hsl(var(--border))';
              (e.currentTarget as HTMLElement).style.backgroundColor = 'hsl(var(--background-light))';
              (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
            }}
          >
            <div className="w-8 h-8 flex items-center justify-center drop-shadow-sm">
              {skill.icon}
            </div>
            <span className="text-[10px] text-center leading-tight"
              style={{ color: 'hsl(var(--muted-foreground))' }}>
              {skill.name}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
