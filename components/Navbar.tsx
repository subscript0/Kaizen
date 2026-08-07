'use client';
import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
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

/**
 * The full-screen menu carries the WHOLE site map, not just the two
 * destinations that overflow the tab bar. A full-screen takeover for two links
 * is disproportionate — it reads as a mistake. Showing everything makes the
 * takeover earn its size, and means "More" answers "where else can I go?"
 * rather than "what didn't fit?".
 */
const menuLinks: MobileTab[] = [...mobileTabs, ...moreLinks];

const springy = { type: 'spring', stiffness: 350, damping: 26 } as const;

/**
 * `closing` is a real state, not a flourish. The exit is a CSS animation, so
 * the node has to stay mounted until it finishes — `animationend` on the panel
 * is what promotes `closing` to `closed`. Unmounting on click instead would
 * cut the animation off at frame one.
 */
type MenuState = 'closed' | 'open' | 'closing';

export default function Navbar() {
  const [menuState, setMenuState] = useState<MenuState>('closed');
  const [scrolled, setScrolled] = useState(false);
  const [reduce, setReduce] = useState(false);
  const pathname = usePathname();
  const introRef = useRef<HTMLDivElement>(null);
  const { base } = useTheme();

  const menuOpen = menuState !== 'closed';
  const closeMenu = useCallback(
    () => setMenuState((s) => (s === 'open' ? 'closing' : s)),
    [],
  );

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

  // ── Lock body scroll while the menu is up ─────────────────────────────────
  // Held through `closing` too: releasing it the instant the close is
  // requested lets the page behind jump back to its scroll position while the
  // panel is still visibly folding away over the top of it.
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  // ── Close on Escape ───────────────────────────────────────────────────────
  useEffect(() => {
    if (menuState !== 'open') return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeMenu(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuState, closeMenu]);

  // ── Close whenever the route changes ──────────────────────────────────────
  // Straight to `closed`, not `closing`: the page underneath is already the
  // new route, so animating the old menu off it is animating a lie. Tapping a
  // link inside the menu plays the exit via `closeMenu`; this is the net for
  // navigations that start somewhere else (back button, a link on the page).
  useEffect(() => { setMenuState('closed'); }, [pathname]);

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

  const moreActive = moreLinks.some((l) => isActive(l.href)) || menuOpen;
  const bubbleTransition = reduce ? { duration: 0 } : springy;

  /**
   * `animationend` bubbles, so every `.menu-row` in the list fires this too.
   * Only the panel's own animation marks the exit as finished — without the
   * target check the first row to finish would unmount the menu mid-animation.
   */
  const onPanelAnimationEnd = (e: React.AnimationEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget) return;
    setMenuState((s) => (s === 'closing' ? 'closed' : s));
  };

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
              onClick={() => setMenuState((s) => (s === 'open' ? 'closing' : 'open'))}
              aria-haspopup="dialog"
              aria-expanded={menuState === 'open'}
              aria-controls="mobile-menu"
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

      {/* ══ Mobile — full-screen menu ═════════════════════════════════════════
          Every moving part is a CSS keyframe (`.menu-*` in app/globals.css);
          React contributes nothing but the `data-state` string. That is why
          `closing` exists — see the MenuState note at the top of this file.

          Rendered OUTSIDE the <nav> above on purpose. Inside it, the menu
          would inherit that element's `bottom-0` positioning context and its
          `max-w-[420px]` column, so a "full-screen" overlay would be neither
          full-screen nor at the top of the page. ── */}
      {menuOpen && (
        <div
          id="mobile-menu"
          data-state={menuState}
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          className="menu-overlay md:hidden"
        >
          {/* Tap-anywhere-outside to dismiss. A real <button> rather than a
              div with onClick, so it is reachable and operable by keyboard. */}
          <button
            type="button"
            aria-label="Close menu"
            onClick={closeMenu}
            className="menu-scrim cursor-default"
          />

          <div className="menu-panel" onAnimationEnd={onPanelAnimationEnd}>
            <div className="menu-head">
              <span className="micro micro--strong">Menu</span>
              <button
                type="button"
                onClick={closeMenu}
                aria-label="Close menu"
                /* 44px box around a 16px glyph — the icon is the affordance,
                   the padding is the tap target. */
                className={`-m-3 p-3 ${navTextMuted} ${navTextMutedHover}`}
              >
                <X size={18} />
              </button>
            </div>

            <nav className="menu-list" aria-label="Site menu">
              {menuLinks.map((item, i) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={closeMenu}
                    aria-current={active ? 'page' : undefined}
                    className="menu-row menu-link"
                    style={{ '--step': i } as CSSProperties}
                  >
                    <span className="menu-link__index" aria-hidden="true">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div
              className="menu-row menu-foot"
              style={{ '--step': menuLinks.length } as CSSProperties}
            >
              <span className="micro">Theme</span>
              <ThemeSwitcher />
            </div>
          </div>
        </div>
      )}
    </>
  );
}