'use client';

import type { RefObject } from 'react';
import { gsap, revealOnScroll, revealWords, useIsoLayoutEffect } from '@/lib/motion';

interface Options {
  /**
   * Rise the heading word by word out from behind its own baseline. Turn this
   * off for headings that contain markup — a `<br>` or a coloured `<span>` —
   * because the splitter works on text content and would flatten them.
   */
  words?: boolean;
  /** Where the header starts arriving, in ScrollTrigger terms. */
  start?: string;
}

/**
 * Choreographs the shared `<SectionHead>` so every section on the site
 * introduces itself in the same order rather than arriving as one block.
 *
 * The order is the reading order, and the offsets are what make it read as a
 * sequence instead of a coincidence:
 *
 *   1. the metadata rail — section number, then label
 *   2. the heading, word by word, rising from behind its own baseline
 *   3. the lede, a beat later
 *   4. the action, last, because it is the thing you do after reading
 *
 * Use this **instead of** `<SectionHead reveal>`, not alongside it: the
 * `reveal` prop tags the whole header as one `[data-reveal]` block, and the
 * section's own `useReveal` would then fade the entire header in at once,
 * underneath this.
 */
export function useSectionIntro(
  scopeRef: RefObject<HTMLElement | null>,
  { words = true, start = 'top 88%' }: Options = {},
) {
  useIsoLayoutEffect(() => {
    const scope = scopeRef.current;
    if (!scope) return;
    const head = scope.querySelector<HTMLElement>('.section-head');
    if (!head) return;

    const ctx = gsap.context(() => {
      const cleanups: Array<() => void> = [];

      const meta = head.querySelectorAll('.section-head__meta > *');
      if (meta.length) {
        cleanups.push(revealOnScroll(meta, { y: 12, duration: 0.5, stagger: 0.07, start }));
      }

      const heading = head.querySelector<HTMLElement>('h2');
      if (heading) {
        cleanups.push(
          words
            ? revealWords(heading, { start, stagger: 0.04, duration: 0.66 })
            : revealOnScroll(heading, { y: 22, duration: 0.62, start }),
        );
      }

      const lede = head.querySelector<HTMLElement>('.text-lede');
      if (lede) {
        cleanups.push(revealOnScroll(lede, { y: 16, duration: 0.55, delay: 0.16, start }));
      }

      // `<SectionHead>` renders meta, heading block, then the action — so the
      // action is the third child, and only ever the third. Matching
      // `:last-child` instead would silently grab the heading block on the
      // sections that pass no action, double-animating it underneath the
      // word reveal above.
      const action = head.querySelector<HTMLElement>(':scope > div:nth-child(3)');
      if (action) {
        cleanups.push(revealOnScroll(action, { y: 10, duration: 0.45, delay: 0.24, start }));
      }

      return () => cleanups.forEach((c) => c());
    }, head);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [words, start]);
}

export default useSectionIntro;
