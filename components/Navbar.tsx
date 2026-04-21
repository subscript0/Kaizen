'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { personalInfo, socialLinks } from '@/lib/data';
import { trackBookACall } from '@/lib/utils';
import ThemeSwitcher from './ThemeSwitcher';

const navLinks = [
  { label: 'Home',       href: '/' },
  { label: 'About Me',   href: '#about' },
  { label: 'Experience', href: '#experience' },
  { label: 'Projects',   href: '#projects' },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const handleNavClick = (href: string) => {
    setMenuOpen(false);
    if (href.startsWith('#')) {
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'border-b border-[hsl(var(--border)/0.5)] bg-[hsl(var(--background)/0.85)] backdrop-blur-md'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between h-16 md:h-20">

          {/* Logo */}
          <Link
            href="/"
            className="text-foreground font-bold text-lg tracking-tight hover:text-primary transition-colors"
            aria-label="Kaizen - Home"
          >
            K<span className="text-primary">.</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => {
                  if (link.href.startsWith('#')) { e.preventDefault(); handleNavClick(link.href); }
                }}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-primary transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>

          {/* Desktop right: socials + ThemeSwitcher + CTA */}
          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-4 mr-2">
              {socialLinks.map((s) => (
                <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer"
                   className="text-xs text-muted-foreground hover:text-primary transition-colors uppercase tracking-widest">
                  {s.name}
                </a>
              ))}
            </div>

            {/* ── Theme switcher ── */}
            <ThemeSwitcher />

            <a
              href={personalInfo.calendlyUrl}
              className="btn-primary text-sm ml-1"
              onClick={() => trackBookACall('navbar')}
            >
              Book a Call
            </a>
          </div>

          {/* Mobile: theme + hamburger */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeSwitcher />
            <button
              className="flex flex-col justify-center items-center w-11 h-11 gap-1.5 z-50 relative"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
            >
              <span className={`block w-6 h-0.5 bg-foreground transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`block w-6 h-0.5 bg-foreground transition-all duration-300 ${menuOpen ? 'opacity-0 scale-x-0' : ''}`} />
              <span className={`block w-6 h-0.5 bg-foreground transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu overlay */}
      <div
        className={`fixed inset-0 z-40 bg-[hsl(var(--background)/0.97)] backdrop-blur-lg flex flex-col justify-center px-8 transition-all duration-500 md:hidden ${
          menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden={!menuOpen}
      >
        <nav className="flex flex-col gap-6 mb-12">
          {navLinks.map((link, i) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => { if (link.href.startsWith('#')) e.preventDefault(); handleNavClick(link.href); }}
              className="text-3xl font-bold text-foreground hover:text-primary transition-colors"
              style={{
                transitionDelay: menuOpen ? `${i * 60}ms` : '0ms',
                transform:       menuOpen ? 'translateX(0)' : 'translateX(-20px)',
                opacity:         menuOpen ? 1 : 0,
                transition: `opacity 0.4s ease ${i * 60}ms, transform 0.4s ease ${i * 60}ms, color 0.2s`,
              }}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <a
          href={personalInfo.calendlyUrl}
          className="btn-primary w-full justify-center text-base mb-8"
          onClick={() => { trackBookACall('mobile_menu'); setMenuOpen(false); }}
        >
          Book a Call
        </a>

        <div className="flex gap-6">
          {socialLinks.map((s) => (
            <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer"
               className="text-sm text-muted-foreground hover:text-primary transition-colors uppercase tracking-widest">
              {s.name}
            </a>
          ))}
        </div>
      </div>
    </>
  );
}
