import type { Variants, Transition } from 'framer-motion';

// ────────────────────────────────────────────────────────────────
// Shared framer-motion variants — the editorial rhythm, expressed for
// declarative components. Mirrors the GSAP system in lib/motion.ts
// (rise ~28px, ~0.8s, ease-out) so framer sections and GSAP sections
// feel like one motion language. Reduced motion is handled globally by
// <MotionConfig reducedMotion="user"> in the root layout — with it,
// framer collapses transforms/opacity to their target automatically.
// ────────────────────────────────────────────────────────────────

// Matches --ease-out: cubic-bezier(0.2, 0.9, 0.25, 1).
export const EASE_OUT: Transition['ease'] = [0.2, 0.9, 0.25, 1];

// Tactile spring for interactive elements (buttons, magnetic, chips).
export const SPRING: Transition = { type: 'spring', stiffness: 320, damping: 26, mass: 0.7 };

// Shared viewport for scroll reveals — fire once, a little before fully in view.
export const VIEWPORT = { once: true, margin: '0px 0px -12% 0px' } as const;

/** Rise-and-fade, the default section reveal. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE_OUT },
  },
};

/** Softer, shorter rise for dense/secondary content. */
export const fadeUpSm: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: EASE_OUT },
  },
};

/** Plain fade — for elements that shouldn't move (images, hairlines). */
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6, ease: EASE_OUT } },
};

/** Scale-and-fade — for cards/media that should feel like they settle in. */
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96, y: 18 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE_OUT },
  },
};

/**
 * Stagger container. Put on a parent set to `whileInView="visible"`; give
 * each child one of the item variants above. Children inherit the trigger.
 */
export const stagger: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

/** Tighter stagger for long lists (skills, tags). */
export const staggerTight: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.045 },
  },
};

/**
 * Convenience props for a one-off scroll reveal without wiring a container:
 *   <motion.div {...revealOnce()} />
 * Pass a variant (default fadeUp).
 */
export const revealOnce = (variant: Variants = fadeUp) => ({
  variants: variant,
  initial: 'hidden' as const,
  whileInView: 'visible' as const,
  viewport: VIEWPORT,
});
