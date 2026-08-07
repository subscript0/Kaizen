'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { EASE } from '@/lib/motion';
import ThemeSwitcher from './ThemeSwitcher';
import { useTheme } from './ThemeProvider';
import {
  Home,
  FolderKanban,
  User,
  Code2,
  MoreHorizontal,
  BookOpen,
  Mail,
  X,
  type LucideIcon,
} from 'lucide-react';
// This file needs `lucide-react` — npm install lucide-react (if not already a dependency)

const MotionLink = motion(Link);

type NavLink = { label: string; href: string };
type MobileTab = NavLink & { icon: LucideIcon };

// Desktop pill — the full site map, motion.dev-style terse labels.
const navLinks: NavLink[] = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Projects', href: '/projects' },
  { label: 'Skills', href: '/skills' },
  { label: 'Guestbook', href: '/guestbook' },
  { label: 'Contact', href: '/contact' },
];

// Mobile bottom bar — 4 primary destinations + a "More" sheet for the rest.
const mobileTabs: MobileTab[] = [
  { label: 'Home', href: '/', icon: Home },
  { label: 'About', href: '/about', icon: User },
  { label: 'Projects', href: '/projects', icon: FolderKanban },
  { label: 'Skills', href: '/skills', icon: Code2 },
];

const moreLinks: MobileTab[] = [
  { label: 'Guestbook', href: '/guestbook', icon: BookOpen },
  { label: 'Contact', href: '/contact', icon: Mail },
];

const springy = { type: 'spring', stiffness: 350, damping: 26 } as const;

export default function Navbar() {
  const [moreOpen, setMoreOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [reduce, setReduce] = useState(false);
  const pathname = usePathname();
  const introRef = useRef<HTMLDivElement>(null);
  const { base } = useTheme();

  // The theme system swaps CSS-variable values rather than toggling a
  // `.dark` class, so Tailwind's `dark:` variant never fires here — read
  // `base` directly instead. Dark mode wants pure white nav text; light
  // mode wants a crisp near-black, both clearer/higher-contrast than the
  // warm `--foreground` token used for body copy elsewhere on the site.
  const isDark = base === 'dark';
  const navText = isDark ? 'text-white' : 'text-neutral-900';
  const navTextMuted = isDark ? 'text-white/55' : 'text-neutral-900/55';
  const navTextMutedHover = isDark ? 'hover:text-white' : 'hover:text-neutral-900';

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname === href || pathname?.startsWith(`${href}/`);

  // ── Scrolled state (adds depth to the floating pill) ─────────────────────
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ── Reduced-motion preference ─────────────────────────────────────────────
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReduce(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  // ── Lock body scroll while the "More" sheet is open ───────────────────────
  useEffect(() => {
    document.body.style.overflow = moreOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [moreOpen]);

  // ── Close "More" on Escape ─────────────────────────────────────────────────
  useEffect(() => {
    if (!moreOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMoreOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [moreOpen]);

  // ── Close "More" whenever the route changes ───────────────────────────────
  useEffect(() => { setMoreOpen(false); }, [pathname]);

  // ── Editorial entrance for the desktop pill — respects reduced-motion ─────
  useEffect(() => {
    const scope = introRef.current;
    if (!scope) return;
    const items = scope.querySelectorAll<HTMLElement>('[data-nav-intro]');
    if (reduce) { gsap.set(items, { opacity: 1, y: 0 }); return; }
    const ctx = gsap.context(() => {
      gsap.fromTo(
        items,
        { y: -14, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: EASE, stagger: 0.07, delay: 0.15 },
      );
    }, scope);
    return () => ctx.revert();
  }, [reduce]);

  const moreActive = moreLinks.some((l) => isActive(l.href)) || moreOpen;
  const bubbleTransition = reduce ? { duration: 0 } : springy;

  return (
    <>
      {/* ══ Desktop — floating glass pill, motion.dev-style ═══════════════════ */}
      <header
        ref={introRef}
        className="fixed top-4 inset-x-0 z-[60] hidden md:flex justify-center"
      >
        {/* Compact floating bar at the original size and transparency — the
            scrim stays light enough to read content passing underneath. Sharp
            corners, mono labels and the accent tick are the Swiss treatment;
            only the geometry and opacity came back. */}
        <div
          className={`flex w-fit items-center gap-1 border px-2 py-2 backdrop-blur-xl transition-[border-color,background-color] duration-300 ${
            scrolled
              ? 'border-foreground/15 bg-background-light/40'
              : 'border-foreground/10 bg-background-light/20'
          }`}
        >
          <MotionLink
            href="/"
            data-nav-intro
            whileTap={{ scale: 0.98 }}
            transition={springy}
            className={`inline-flex items-baseline border border-border/30 bg-background-light/30 px-3.5 py-1.5 font-sans text-sm font-bold leading-none tracking-tight backdrop-blur-sm transition-colors duration-200 hover:border-primary/50 hover:text-primary ${navText}`}
          >
            Kaizen<span className="text-primary">.</span>
          </MotionLink>

          <nav data-nav-intro className="relative flex items-center gap-0.5 pl-1" aria-label="Main navigation">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <MotionLink
                  key={link.label}
                  href={link.href}
                  whileTap={{ scale: 0.97 }}
                  className={`micro relative px-3.5 py-1.5 transition-colors duration-200 ${
                    active ? '!text-[hsl(var(--primary))]' : `${navTextMuted} ${navTextMutedHover}`
                  }`}
                  aria-current={active ? 'page' : undefined}
                >
                  {/* Active marker is a 1px accent rule pinned to the bottom
                      edge — a registration tick, not a bubble. */}
                  {active && (
                    <motion.span
                      layoutId="desktop-nav-pill"
                      transition={bubbleTransition}
                      className="absolute inset-x-0 bottom-0 h-px bg-primary"
                    />
                  )}
                  <span className="relative z-10">{link.label}</span>
                </MotionLink>
              );
            })}
          </nav>

          <div data-nav-intro className="ml-1 flex items-center border-l border-foreground/10 pl-2">
            <ThemeSwitcher />
          </div>
        </div>
      </header>

      {/* ══ Mobile — floating bottom tab bar ══════════════════════════════════ */}
      <nav
        aria-label="Mobile navigation"
        className="fixed inset-x-0 bottom-0 z-[60] px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-2 md:hidden"
      >
        <div className="relative mx-auto max-w-[420px]">
          {/* Tap-outside-to-close backdrop */}
          <AnimatePresence>
            {moreOpen && (
              <motion.button
                key="backdrop"
                type="button"
                aria-hidden="true"
                tabIndex={-1}
                onClick={() => setMoreOpen(false)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduce ? 0 : 0.2 }}
                className="fixed inset-0 z-[55] cursor-default bg-background/50 backdrop-blur-[2px]"
              />
            )}
          </AnimatePresence>

          {/* "More" sheet */}
          <AnimatePresence>
            {moreOpen && (
              <motion.div
                key="sheet"
                id="mobile-more-menu"
                role="menu"
                initial={{ opacity: 0, y: 12, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 12, scale: 0.98 }}
                transition={bubbleTransition}
                className="absolute inset-x-0 bottom-full z-[56] mb-3 border border-foreground/10 bg-background-light/50 p-2 backdrop-blur-xl"
              >
                <div className="flex items-center justify-between px-3 py-2">
                  <span className={`font-mono text-[11px] uppercase tracking-wider ${navTextMuted}`}>
                    More
                  </span>
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setMoreOpen(false)}
                    aria-label="Close menu"
                    className={`rounded-full p-1 ${navTextMuted} ${navTextMutedHover}`}
                  >
                    <X size={16} />
                  </motion.button>
                </div>

                <div className="flex flex-col gap-0.5">
                  {moreLinks.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.href);
                    return (
                      <MotionLink
                        key={item.label}
                        href={item.href}
                        role="menuitem"
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setMoreOpen(false)}
                        aria-current={active ? 'page' : undefined}
                        className={`micro flex items-center gap-3 px-3 py-3 transition-colors ${
                          active
                            ? '!text-[hsl(var(--primary))]'
                            : `${navTextMuted} hover:bg-foreground/5 ${navTextMutedHover}`
                        }`}
                      >
                        <Icon size={18} strokeWidth={1.75} />
                        {item.label}
                      </MotionLink>
                    );
                  })}
                </div>

                <div className="mt-1 flex items-center justify-between border-t border-foreground/10 px-3 pt-2">
                  <span className={`font-mono text-[11px] uppercase tracking-wider ${navTextMuted}`}>
                    Theme
                  </span>
                  <ThemeSwitcher />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* The bar itself */}
          {/* Opacity raised from /35: at that level page copy read straight
              through the bar on long routes (legal pages, guestbook), colliding
              with the tab labels. The blur alone doesn't separate them — the
              bar needs enough fill to actually be a surface. */}
          <div className="relative z-10 flex items-stretch justify-between border border-foreground/10 bg-background/85 px-2 backdrop-blur-xl">
            {mobileTabs.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <MotionLink
                  key={item.label}
                  href={item.href}
                  whileTap={{ scale: 0.92 }}
                  aria-current={active ? 'page' : undefined}
                  className="relative flex flex-1 flex-col items-center justify-end gap-1 py-2.5"
                >
                  {/* Accent tick on the top edge instead of a floating circle
                      badge — same layoutId, so it still slides between tabs. */}
                  {active && (
                    <motion.span
                      layoutId="mobile-nav-bubble"
                      transition={bubbleTransition}
                      className="absolute inset-x-1 top-0 h-px bg-primary"
                    />
                  )}
                  <Icon
                    size={20}
                    strokeWidth={active ? 2.25 : 1.75}
                    className={active ? 'text-primary' : navTextMuted}
                  />
                  <span className={`micro !text-[10px] ${active ? '!text-[hsl(var(--primary))]' : ''}`}>
                    {item.label}
                  </span>
                </MotionLink>
              );
            })}

            <motion.button
              type="button"
              whileTap={{ scale: 0.92 }}
              onClick={() => setMoreOpen((v) => !v)}
              aria-haspopup="menu"
              aria-expanded={moreOpen}
              aria-controls="mobile-more-menu"
              className="relative flex flex-1 flex-col items-center justify-end gap-1 py-2.5"
            >
              {moreActive && (
                <motion.span
                  layoutId="mobile-nav-bubble"
                  transition={bubbleTransition}
                  className="absolute inset-x-1 top-0 h-px bg-primary"
                />
              )}
              <MoreHorizontal
                size={20}
                strokeWidth={moreActive ? 2.25 : 1.75}
                className={moreActive ? 'text-primary' : navTextMuted}
              />
              <span className={`micro !text-[10px] ${moreActive ? '!text-[hsl(var(--primary))]' : ''}`}>
                More
              </span>
            </motion.button>
          </div>
        </div>
      </nav>
    </>
  );
}