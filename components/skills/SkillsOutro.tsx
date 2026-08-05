'use client';

import Link from 'next/link';
import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { personalInfo } from '@/lib/data';
import { trackHireMeNow } from '@/lib/utils';

/**
 * The closing statement — the same ending /about uses.
 *
 * An accent rule draws itself across as the section arrives, a display lockup
 * rises line by line out of its own baseline, and the page stops on a terminal
 * spec band rather than on the last line of copy.
 *
 * The lockup's break is chosen, not left to the engine: `whitespace-nowrap` on
 * each half with the split written into the markup, so no width can hyphenate
 * it or orphan a word. Underlines are drawn elements below the baseline, never
 * `text-decoration`, which at this size cuts straight through the descenders.
 */
export default function SkillsOutro() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end end'] });
  const ruleScale = useTransform(scrollYProgress, [0.1, 0.6], [0, 1]);

  return (
    <section
      ref={ref}
      aria-labelledby="skills-outro-heading"
      className="relative pb-16 pt-20 lg:pb-24 lg:pt-28"
    >
      <div className="measure">
        <motion.div
          aria-hidden="true"
          className="h-px w-full origin-left bg-[hsl(var(--primary))]"
          style={reduce ? undefined : { scaleX: ruleScale }}
        />

        <p className="micro mb-8 mt-6">04 — Next</p>

        <h2 id="skills-outro-heading" className="sr-only">
          See the stack at work
        </h2>

        <Link
          href="/projects"
          className="group block w-fit max-w-full font-black leading-[0.92] tracking-tight"
        >
          <LockupLine text="See the stack" reduce={!!reduce} />
          <LockupLine text="doing actual work" accent reduce={!!reduce} delay={0.06} showArrow />
        </Link>

        <motion.p
          className="text-lede mt-10 max-w-xl"
          initial={reduce ? undefined : { opacity: 0, y: 16 }}
          whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '0px 0px -12% 0px' }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          A stack is only a list until something ships with it. The projects are where each
          of these actually earned its row.
        </motion.p>

        <motion.div
          className="mt-10 flex flex-wrap items-center gap-3"
          initial={reduce ? undefined : { opacity: 0, y: 14 }}
          whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '0px 0px -10% 0px' }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <a
            href={personalInfo.hireWhatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackHireMeNow('skills-outro')}
            className="btn btn-primary"
            data-magnetic
          >
            Hire me now
          </a>
          <Link href="/contact" className="btn btn-outline" data-magnetic>
            Send a brief
          </Link>
        </motion.div>
      </div>

      {/* Terminal band — the page used to stop dead on the last line of copy. */}
      <motion.div
        className="mt-16 lg:mt-20"
        initial={reduce ? undefined : { opacity: 0 }}
        whileInView={reduce ? undefined : { opacity: 1 }}
        viewport={{ once: true, margin: '0px 0px -5% 0px' }}
        transition={{ duration: 0.5 }}
      >
        <div className="spec-bar">
          <span className="micro">Kaizen — Full stack developer</span>
          <span className="micro">05 disciplines · 20 tools</span>
          <span className="micro micro--accent">
            <span aria-hidden="true" className="inline-block h-1.5 w-1.5 bg-[hsl(var(--primary))]" />
            Open to work
          </span>
        </div>
      </motion.div>
    </section>
  );
}

/**
 * One line of the display lockup, rising out of a hard-edged mask. The mask is
 * padded and pulled back with a matching negative margin so descenders are not
 * guillotined by the `overflow: hidden` that makes the reveal read as
 * typesetting rather than a fade.
 */
function LockupLine({
  text,
  accent = false,
  reduce,
  delay = 0,
  showArrow = false,
}: {
  text: string;
  accent?: boolean;
  reduce: boolean;
  delay?: number;
  showArrow?: boolean;
}) {
  return (
    <span className="block overflow-hidden pb-[0.08em]" style={{ marginBottom: '-0.02em' }}>
      <motion.span
        className={`block whitespace-nowrap text-[clamp(1.75rem,7.4vw,4rem)] ${
          accent ? 'accent' : 'text-[hsl(var(--foreground))]'
        } transition-colors duration-200 group-hover:text-[hsl(var(--primary))]`}
        initial={reduce ? undefined : { y: '105%' }}
        whileInView={reduce ? undefined : { y: '0%' }}
        viewport={{ once: true, margin: '0px 0px -12% 0px' }}
        transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
      >
        {text}
        {showArrow ? (
          <span
            aria-hidden="true"
            className="ml-3 inline-block transition-transform duration-300 ease-[var(--ease-spring-2)] group-hover:translate-x-3"
          >
            →
          </span>
        ) : null}
      </motion.span>
    </span>
  );
}
