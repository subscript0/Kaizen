'use client';

import { useEffect, useLayoutEffect, useRef, useState, type RefObject } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CustomEase } from 'gsap/CustomEase';

// ──────────────────────────────────────────────────────────────────────────
// Shared GSAP motion system — editorial, restrained, intentional.
//
// Everything the site animates goes through here so the whole page shares one
// rhythm: the same rise distance, the same curve, the same stagger interval.
// Sections import these helpers rather than re-wiring ScrollTrigger by hand.
//
// Three rules the helpers below enforce for you:
//
//  1. TRANSFORM AND OPACITY ONLY. Nothing here animates width, height, top,
//     left or any other layout property — those run on the main thread and
//     force layout on every frame.
//  2. REDUCED MOTION IS A REAL PATH, NOT A DEAD END. Every helper checks the
//     media query and falls back to "already in its final state", never to
//     "stuck at opacity 0".
//  3. FAIL VISIBLE. A reveal hides content before showing it, which means any
//     bug in the reveal is a bug that hides the website. Every hidden element
//     is watched by an IntersectionObserver + timeout that force-shows it if
//     the tween never arrived — see `SAFETY_MS`. IO and setTimeout both keep
//     firing in a backgrounded tab where requestAnimationFrame (and therefore
//     GSAP) is throttled to a standstill, which is exactly the case that used
//     to photograph as a blank page.
// ──────────────────────────────────────────────────────────────────────────

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, CustomEase);
}

/** SSR-safe layout effect — avoids React's server warning. */
export const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

// ── Easing ────────────────────────────────────────────────────────────────
// These strings are the CSS custom properties from globals.css, so the same
// token can be handed to a CSS transition or to GSAP. GSAP does not natively
// understand `cubic-bezier(...)`; without the registration below it silently
// swaps in its default ease and logs "Invalid ease", which is why so much of
// the site was moving on a curve nobody chose. Registering each string as a
// named CustomEase makes `ease: EASE` mean what it says everywhere.

export const EASE: string = 'cubic-bezier(0.25, 0.1, 0.25, 1.0)'; // ui — smooth reveal
export const EASE_SOFT: string = 'cubic-bezier(0.3, 0, 0.7, 1)'; // gentle entrance
export const EASE_EXPRESSIVE: string = 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'; // lively
export const EASE_SNAP: string = 'cubic-bezier(0.4, 0, 0.2, 1)'; // snap
export const EASE_AMBIENT: string = 'cubic-bezier(0.4, 0, 0.6, 1)'; // ambient float

/** The curve reveals use by default: fast out of the gate, long settle. */
export const EASE_EDITORIAL = 'power3.out';

const CUBIC_RE = /cubic-bezier\(\s*([-\d.]+)\s*,\s*([-\d.]+)\s*,\s*([-\d.]+)\s*,\s*([-\d.]+)\s*\)/;

if (typeof window !== 'undefined') {
  const register = (css: string) => {
    const m = CUBIC_RE.exec(css);
    if (!m) return;
    const [, x1, y1, x2, y2] = m;
    try {
      gsap.registerEase(css, CustomEase.create(css, `M0,0 C${x1},${y1} ${x2},${y2} 1,1`));
    } catch {
      /* a malformed curve must never take the page down with it */
    }
  };
  [EASE, EASE_SOFT, EASE_EXPRESSIVE, EASE_SNAP, EASE_AMBIENT].forEach(register);
  // Components occasionally hand GSAP the raw custom property name. Alias
  // those to the same curves instead of letting them fall through to the
  // default ease.
  const alias: Record<string, string> = {
    'var(--ease-spring-1)': EASE_SNAP,
    'var(--ease-spring-2)': EASE,
    'var(--ease-spring-3)': EASE_SOFT,
    'var(--ease-spring-4)': EASE_EXPRESSIVE,
    'var(--ease-spring-5)': EASE_AMBIENT,
  };
  Object.entries(alias).forEach(([name, css]) => {
    const parsed = gsap.parseEase(css);
    if (parsed) gsap.registerEase(name, parsed);
  });
}

// CSS variable names for easy reference
export const CSS_VARS = {
  EASE_SPRING_1: '--ease-spring-1',
  EASE_SPRING_2: '--ease-spring-2',
  EASE_SPRING_3: '--ease-spring-3',
  EASE_SPRING_4: '--ease-spring-4',
  EASE_SPRING_5: '--ease-spring-5',
  DURATION_SHORT: '--duration-short',
  DURATION_BASE: '--duration-base',
  DURATION_MEDIUM: '--duration-medium',
  DURATION_LONG: '--duration-long',
  RADIUS: '--radius',
} as const;

// ── Reduced motion ────────────────────────────────────────────────────────

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true;

/**
 * Hook: returns true if the user prefers reduced motion.
 * Reacts to changes in the system preference.
 */
export function useReducedMotion() {
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    // Read in an effect, not in the initialiser: the server renders `false`,
    // so seeding state from the media query would make the first client render
    // disagree with the server HTML and trip a hydration mismatch.
    setReducedMotion(media.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    media.addEventListener('change', handler);
    return () => media.removeEventListener('change', handler);
  }, []);

  return reducedMotion;
}

// ── Fail-visible safety net ───────────────────────────────────────────────
// How long an element is allowed to sit hidden inside the viewport before we
// assume the tween that was supposed to show it is never coming.
const SAFETY_MS = 1600;

function watchForStuckElements(els: Element[]): () => void {
  if (typeof IntersectionObserver === 'undefined') return () => {};

  const timers = new Map<Element, number>();

  const rescue = (el: Element) => {
    timers.delete(el);
    if (!el.isConnected) return;
    const opacity = parseFloat(getComputedStyle(el).opacity || '1');
    if (opacity > 0.02) return; // it arrived, or it is on its way
    // It did not arrive. Show it. This is deliberately blunt — a page with no
    // animation is a working page; a page of invisible text is not.
    gsap.killTweensOf(el);
    gsap.set(el, { opacity: 1, y: 0, clearProps: 'transform,willChange' });
  };

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const el = entry.target;
        if (entry.isIntersecting) {
          if (!timers.has(el)) timers.set(el, window.setTimeout(() => rescue(el), SAFETY_MS));
        } else {
          const t = timers.get(el);
          if (t) {
            clearTimeout(t);
            timers.delete(el);
          }
        }
      });
    },
    { rootMargin: '0px' },
  );

  els.forEach((el) => io.observe(el));

  return () => {
    io.disconnect();
    timers.forEach((t) => clearTimeout(t));
    timers.clear();
  };
}

// ── Reveal ────────────────────────────────────────────────────────────────

export interface RevealOptions {
  /** Rise distance in px. */
  y?: number;
  /** Starting opacity (0 = fade in). */
  opacity?: number;
  duration?: number;
  /** Seconds between siblings that enter together. This is the choreography. */
  stagger?: number;
  delay?: number;
  ease?: string;
  start?: string;
  /** Elements entering within this many seconds of each other share a stagger. */
  interval?: number;
  /** Replay when the element leaves and re-enters. Default: reveal once. */
  repeat?: boolean;
}

const REVEAL_DEFAULTS: Required<Omit<RevealOptions, 'repeat'>> & { repeat: boolean } = {
  y: 24,
  opacity: 0,
  // Scroll reveals are storytelling, not UI feedback — they get the long
  // settle. Anything the visitor triggers themselves stays at 150–400ms.
  duration: 0.62,
  stagger: 0.075,
  delay: 0,
  ease: EASE_EDITORIAL,
  start: 'top 86%',
  interval: 0.12,
  repeat: false,
};

/**
 * Reveal one or more elements on scroll with a consistent rise-and-fade.
 *
 * Elements that cross the trigger line together are collected into one batch
 * and staggered as a group — that group rhythm is the difference between "the
 * section arrived" and "twelve things appeared simultaneously". Elements far
 * apart in the document get their own batch, so a long page still reads as a
 * sequence of arrivals rather than one wave.
 *
 * Returns a cleanup function. Call inside `gsap.context()` and return it from
 * the context callback so the observers are torn down with the tweens.
 */
export function revealOnScroll(
  targets: gsap.TweenTarget,
  options: RevealOptions = {},
): () => void {
  const { y, opacity, duration, stagger, delay, ease, start, interval, repeat } = {
    ...REVEAL_DEFAULTS,
    ...options,
  };

  const els = gsap.utils.toArray<Element>(targets);
  if (!els.length) return () => {};

  if (prefersReducedMotion()) {
    // Reduced means gentler, not absent — but a rise-and-fade tied to scroll
    // position is exactly the vestibular trigger the preference exists for, so
    // these simply start where they finish.
    gsap.set(els, { opacity: 1, y: 0, clearProps: 'transform' });
    return () => {};
  }

  gsap.set(els, { opacity, y, willChange: 'transform, opacity' });

  const show = (batch: Element[]) =>
    gsap.to(batch, {
      y: 0,
      opacity: 1,
      duration,
      delay,
      ease,
      stagger,
      overwrite: 'auto',
      onComplete: () => gsap.set(batch, { clearProps: 'willChange' }),
    });

  const triggers = ScrollTrigger.batch(els, {
    start,
    once: !repeat,
    interval,
    onEnter: show,
    ...(repeat
      ? {
          onEnterBack: show,
          onLeave: (batch: Element[]) => gsap.set(batch, { opacity, y }),
          onLeaveBack: (batch: Element[]) => gsap.set(batch, { opacity, y }),
        }
      : {}),
  });

  const stopWatching = watchForStuckElements(els);

  return () => {
    stopWatching();
    triggers.forEach((t) => t.kill());
  };
}

/**
 * Hook: reveal all elements matching `selector` inside `scopeRef` on scroll.
 * Handles registration, reduced-motion, the safety net, and cleanup.
 *
 * `options` is compared by value, not by identity. It used to sit in the
 * dependency array as an object, and callers pass an inline literal — so the
 * effect tore down and rebuilt every ScrollTrigger on *every render*. On the
 * contact page that meant each keystroke in the form re-hid and re-animated
 * the whole section underneath the visitor's hands.
 *
 * Pass `deps` when the set of matched elements can change after mount (a tab
 * switch, an async fetch resolving) so freshly mounted nodes get picked up.
 */
export function useReveal(
  scopeRef: RefObject<HTMLElement | null>,
  selector = '[data-reveal]',
  options: RevealOptions = {},
  deps: React.DependencyList = [],
) {
  const optionsKey = JSON.stringify(options);
  const optionsRef = useRef(options);
  optionsRef.current = options;

  useEffect(() => {
    const scope = scopeRef.current;
    if (!scope) return;

    const ctx = gsap.context(() => {
      const cleanup = revealOnScroll(scope.querySelectorAll(selector), optionsRef.current);
      return cleanup;
    }, scope);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scopeRef, selector, optionsKey, ...deps]);
}

// ── Scroll-linked storytelling ────────────────────────────────────────────

export interface ParallaxOptions {
  /** Total travel in px across the whole scroll pass. */
  distance?: number;
  /** Defaults to the element itself. */
  trigger?: Element | string | null;
  start?: string;
  end?: string;
}

/**
 * Move an element against the scroll. Scrubbed, so it is genuinely tied to
 * scroll position rather than playing a canned animation near it.
 *
 * `yPercent` rather than `y`: the offset scales with the element, so the same
 * call reads identically on a 220px phone thumbnail and a 520px desktop plate.
 * Give the moving element ~12% of extra height (or a scale) so the travel does
 * not expose an edge.
 */
export function parallax(targets: gsap.TweenTarget, options: ParallaxOptions = {}): () => void {
  const { distance = 8, trigger, start = 'top bottom', end = 'bottom top' } = options;
  const els = gsap.utils.toArray<Element>(targets);
  if (!els.length || prefersReducedMotion()) return () => {};

  const tweens = els.map((el) =>
    gsap.fromTo(
      el,
      { yPercent: -distance / 2 },
      {
        yPercent: distance / 2,
        ease: 'none',
        scrollTrigger: { trigger: trigger ?? el, start, end, scrub: true },
      },
    ),
  );

  return () => tweens.forEach((t) => t.scrollTrigger?.kill());
}

/**
 * Drive an element's `scaleX`/`scaleY` from 0→1 across a scroll range — the
 * timeline spine, the progress rule, the section meter. Transform-only, so the
 * browser never relayouts while it grows.
 */
export function scrubScale(
  target: gsap.TweenTarget,
  {
    axis = 'y',
    trigger,
    start = 'top 70%',
    end = 'bottom 70%',
  }: { axis?: 'x' | 'y'; trigger?: Element | null; start?: string; end?: string } = {},
): () => void {
  const els = gsap.utils.toArray<Element>(target);
  if (!els.length) return () => {};
  const prop = axis === 'x' ? 'scaleX' : 'scaleY';

  if (prefersReducedMotion()) {
    gsap.set(els, { [prop]: 1 });
    return () => {};
  }

  const tween = gsap.fromTo(
    els,
    { [prop]: 0 },
    {
      [prop]: 1,
      ease: 'none',
      scrollTrigger: { trigger: trigger ?? (els[0] as Element), start, end, scrub: 0.4 },
    },
  );
  return () => tween.scrollTrigger?.kill();
}

/**
 * Draw hairlines in as they arrive — a rule that grows from its own origin
 * instead of fading on. Batched like `revealOnScroll`, so a run of rules
 * strokes in one after another rather than all at once.
 *
 * The caller owns `transform-origin` (Tailwind's `origin-left` / `origin-top`),
 * because which end a rule grows from is a design decision, not a default.
 */
export function drawIn(
  targets: gsap.TweenTarget,
  {
    axis = 'x',
    duration = 0.7,
    stagger = 0.08,
    delay = 0,
    start = 'top 92%',
    ease = EASE_EDITORIAL,
    interval = 0.12,
  }: {
    axis?: 'x' | 'y';
    duration?: number;
    stagger?: number;
    delay?: number;
    start?: string;
    ease?: string;
    interval?: number;
  } = {},
): () => void {
  const els = gsap.utils.toArray<Element>(targets);
  if (!els.length) return () => {};
  const prop = axis === 'x' ? 'scaleX' : 'scaleY';

  if (prefersReducedMotion()) {
    gsap.set(els, { [prop]: 1 });
    return () => {};
  }

  gsap.set(els, { [prop]: 0 });

  const triggers = ScrollTrigger.batch(els, {
    start,
    once: true,
    interval,
    onEnter: (batch: Element[]) =>
      gsap.to(batch, { [prop]: 1, duration, stagger, delay, ease, overwrite: 'auto' }),
  });

  // These are decorative, so the net is a plain sweep rather than the
  // per-element observer the content reveals get — but a section framed by
  // hairlines that never drew is still a section missing its frame.
  const safety = window.setTimeout(() => {
    els.forEach((el) => {
      // `Number(...)`, not `=== 0`: `getProperty` hands back a string for some
      // transform components depending on how the element was last written to,
      // and a strict comparison against 0 silently never matches.
      if (Number(gsap.getProperty(el, prop)) < 0.01) gsap.set(el, { [prop]: 1 });
    });
  }, 4000);

  return () => {
    clearTimeout(safety);
    triggers.forEach((t) => t.kill());
  };
}

/**
 * Report which of `items` is "current" as the reader scrolls past them — the
 * engine behind a sticky index that advances with the content.
 *
 * Deliberately **not** a ScrollTrigger pin. Pinning rewrites the document with
 * a spacer element and fights momentum scrolling on touch; a CSS
 * `position: sticky` panel plus this observer gets the same effect with none
 * of the jank, and degrades to a plain stacked list the moment the sticky
 * context is removed at a breakpoint.
 */
export function trackActiveItem(
  items: Element[],
  onChange: (index: number) => void,
  { start = 'top 55%', end = 'bottom 45%' }: { start?: string; end?: string } = {},
): () => void {
  if (!items.length) return () => {};

  const active = new Set<number>();
  const publish = () => {
    if (!active.size) return;
    onChange(Math.min(...active));
  };

  const triggers = items.map((el, i) =>
    ScrollTrigger.create({
      trigger: el,
      start,
      end,
      onToggle: (self) => {
        if (self.isActive) active.add(i);
        else active.delete(i);
        publish();
      },
    }),
  );

  return () => triggers.forEach((t) => t.kill());
}

/**
 * Count a number up when it scrolls into view.
 *
 * Writes through `onUpdate` rather than tweening a DOM property so the caller
 * owns formatting (thousands separators, suffixes). Reduced motion and any
 * non-finite value jump straight to the final figure.
 */
export function countUp(
  el: Element,
  to: number,
  {
    duration = 1.1,
    from = 0,
    start = 'top 88%',
    onUpdate,
  }: { duration?: number; from?: number; start?: string; onUpdate: (v: number) => void },
): () => void {
  if (!Number.isFinite(to)) {
    onUpdate(to);
    return () => {};
  }
  if (prefersReducedMotion()) {
    onUpdate(to);
    return () => {};
  }

  const state = { v: from };
  onUpdate(from);

  const tween = gsap.to(state, {
    v: to,
    duration,
    ease: 'power2.out',
    onUpdate: () => onUpdate(state.v),
    onComplete: () => onUpdate(to),
    scrollTrigger: { trigger: el, start, once: true },
  });

  // Same contract as the reveal: if the tween never runs (throttled tab,
  // ScrollTrigger failure) the real number still has to appear.
  const safety = window.setTimeout(() => {
    if (tween.progress() === 0) onUpdate(to);
  }, 3000);

  return () => {
    clearTimeout(safety);
    tween.scrollTrigger?.kill();
    tween.kill();
  };
}

/**
 * Split a text node into per-word spans wrapped in overflow-clipped boxes, so
 * words can rise out from behind a hard edge — the typographic reveal, where
 * the mask is the baseline itself.
 *
 * Returns the elements to animate plus a `restore` that puts the original text
 * back, because the split markup must not outlive the animation for screen
 * readers or for copy-paste. The source element keeps its text in an
 * `aria-label` while it is split.
 */
export function splitWords(el: HTMLElement): { words: HTMLElement[]; restore: () => void } {
  const original = el.innerHTML;
  const text = el.textContent ?? '';
  const words = text.split(/(\s+)/).filter((w) => w.length > 0);
  if (!words.length) return { words: [], restore: () => {} };

  const frag = document.createDocumentFragment();
  const out: HTMLElement[] = [];

  words.forEach((word) => {
    if (/^\s+$/.test(word)) {
      frag.appendChild(document.createTextNode(word));
      return;
    }
    const mask = document.createElement('span');
    mask.style.display = 'inline-block';
    mask.style.overflow = 'hidden';
    mask.style.verticalAlign = 'top';
    // A descender clipped by `overflow: hidden` is a typographic bug, not a
    // reveal. Pad the mask and pull it back with a negative margin.
    mask.style.paddingBottom = '0.16em';
    mask.style.marginBottom = '-0.16em';

    const inner = document.createElement('span');
    inner.style.display = 'inline-block';
    inner.style.willChange = 'transform';
    inner.textContent = word;

    mask.appendChild(inner);
    frag.appendChild(mask);
    out.push(inner);
  });

  el.setAttribute('aria-label', text);
  el.textContent = '';
  el.appendChild(frag);

  return {
    words: out,
    restore: () => {
      el.innerHTML = original;
      el.removeAttribute('aria-label');
    },
  };
}

/**
 * Rise a heading in word by word from behind its own baseline.
 * Falls back to a plain group fade when motion is reduced — the DOM is never
 * split in that case, so nothing is left for a screen reader to stumble over.
 */
export function revealWords(
  el: HTMLElement,
  {
    duration = 0.7,
    stagger = 0.045,
    start = 'top 88%',
    ease = 'power3.out',
  }: { duration?: number; stagger?: number; start?: string; ease?: string } = {},
): () => void {
  if (prefersReducedMotion()) {
    gsap.set(el, { opacity: 1, y: 0 });
    return () => {};
  }

  const { words, restore } = splitWords(el);
  if (!words.length) return () => {};

  gsap.set(words, { yPercent: 108, opacity: 0 });

  const tween = gsap.to(words, {
    yPercent: 0,
    opacity: 1,
    duration,
    stagger,
    ease,
    onComplete: () => gsap.set(words, { clearProps: 'willChange' }),
    scrollTrigger: { trigger: el, start, once: true },
  });

  const stopWatching = watchForStuckElements(words);

  return () => {
    stopWatching();
    tween.scrollTrigger?.kill();
    tween.kill();
    restore();
  };
}

/**
 * One `ScrollTrigger.refresh()` after images and fonts settle. Late-loading
 * media changes every element's offset, and a trigger measured against the
 * old layout fires in the wrong place (usually: never).
 */
export function refreshTriggersWhenSettled() {
  if (typeof window === 'undefined') return;
  const refresh = () => ScrollTrigger.refresh();
  if (document.readyState === 'complete') {
    requestAnimationFrame(refresh);
  } else {
    window.addEventListener('load', () => requestAnimationFrame(refresh), { once: true });
  }
  document.fonts?.ready.then(refresh).catch(() => {});
}

export { gsap, ScrollTrigger };
