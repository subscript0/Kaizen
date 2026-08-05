'use client';

import Image from 'next/image';
import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import SectionHead from '@/components/SectionHead';
import RevealText from '@/components/about/RevealText';
import { capabilities, type Capability, type Tech } from './capabilities';
import TechMark from './TechMark';

/**
 * The body of /skills: seven disciplines, read one at a time.
 *
 * ── The scroll mechanic, and why it survives a scroll JUMP ──────────────────
 *
 * Each chapter owns its own plate, and that plate is `position: sticky` inside
 * its OWN chapter — nothing is coordinated across chapters, and nothing is
 * pinned by ScrollTrigger. The consequences are the point:
 *
 *  - Two plates can never superimpose. A sticky element cannot leave its own
 *    containing block, so chapter 3's plate is physically incapable of being on
 *    screen while chapter 4's is. The old deck cross-faded five absolutely
 *    positioned cards through one shared stage, which is what put two of them
 *    on top of each other whenever the scroll position moved faster than the
 *    transition — an anchor jump, a scrollbar drag, a restored scroll on
 *    reload. There is no shared stage here to land in the middle of.
 *  - There is no measured pin distance to desync. A GSAP pin injects a spacer
 *    sized from a measurement taken at refresh time; when a mobile URL bar
 *    resizes the viewport, that number is stale and the pin releases in the
 *    wrong place. `position: sticky` is resolved by the compositor against the
 *    live viewport on every frame, so there is nothing to go stale.
 *  - Nothing is absolutely positioned, so every chapter contributes its real
 *    height to the document. The page is as tall as its content and no taller —
 *    which is what stops the dead space under short copy that the previous
 *    build had.
 *
 * The only scroll-LINKED motion is a few percent of parallax inside each plate,
 * driven by `useScroll` on that chapter. It is a pure function of scroll
 * position with no spring in the path, so an instant jump resolves to exactly
 * one correct frame instead of animating through the frames in between.
 *
 * Below `lg` the sticky context is simply absent: each chapter is a plate, a
 * heading and a list, stacked. Same markup, no breakpoint-specific component.
 *
 * ── Colour ─────────────────────────────────────────────────────────────────
 * Plates paint unfiltered. Each one is already drawn in its own discipline's
 * hue (`PLATE` in capabilities.ts, mirrored by the build script), and the same
 * hue tints any tool in that chapter with no brand mark of its own — so a
 * chapter reads as one colour rather than as artwork plus unrelated glyphs. An
 * earlier build pushed every plate through `grayscale(1)`; that was written for
 * photographic plates, where a second full palette beside the brand marks would
 * have buried them, and it has no work left to do now the artwork IS the
 * chapter's colour.
 */

const nn = (n: number) => String(n).padStart(2, '0');

export default function DisciplineChapters() {
  return (
    <section aria-labelledby="disciplines-heading" className="relative">
      <div className="measure pb-12 pt-4 md:pb-16">
        <SectionHead
          index="02"
          label="Disciplines"
          id="disciplines-heading"
          title={
            <>
              One discipline at a time<span className="accent">.</span>
            </>
          }
          lede="Each chapter opens on a plate that names the discipline, then lists the tools it is built from and what each one does in the work."
        />
      </div>

      {capabilities.map((cap, i) => (
        <Chapter key={cap.id} cap={cap} index={i} total={capabilities.length} />
      ))}
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   One chapter
   ══════════════════════════════════════════════════════════════════════════ */

function Chapter({ cap, index, total }: { cap: Capability; index: number; total: number }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  // The whole pass of the chapter through the viewport, so the parallax is
  // still travelling while the plate is stuck.
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const imageY = useTransform(scrollYProgress, [0, 1], ['-4%', '4%']);

  // Plates alternate sides so seven chapters read as a rhythm rather than
  // seven identical rows. The number stays with the plate either way.
  const flipped = index % 2 === 1;

  return (
    <article
      ref={ref}
      aria-labelledby={`discipline-${cap.id}`}
      className="bleed-t relative"
    >
      <div className="measure grid-12 items-start py-12 md:py-16 lg:py-24">
        {/* ══ Plate ═════════════════════════════════════════════════════════
            `self-start` is what makes the sticky work: a grid item defaults to
            stretching to the full row height, which leaves `position: sticky`
            no room to travel inside its own cell. */}
        <motion.figure
          className={`crop-frame col-span-4 self-start md:col-span-12 lg:sticky lg:top-24 lg:col-span-6 lg:row-start-1 ${
            flipped ? 'lg:col-start-1' : 'lg:col-start-7'
          }`}
          initial={reduce ? undefined : { opacity: 0, y: 26 }}
          whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '0px 0px -12% 0px' }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="rule-t rule-b rule-l rule-r relative aspect-[16/10] overflow-hidden">
            {/* The moving layer is 12% taller than its frame, so ±4% of travel
                never exposes an edge. */}
            <motion.div
              className="absolute inset-x-0 -top-[6%] h-[112%] will-change-transform"
              style={reduce ? undefined : { y: imageY }}
            >
              <Image
                src={cap.image}
                alt={cap.alt}
                fill
                sizes="(min-width: 1024px) 46vw, (min-width: 768px) 50vw, 100vw"
                priority={index === 0}
                className="object-cover"
              />
            </motion.div>
          </div>

          <figcaption className="rule-b flex items-baseline justify-between gap-3 py-3">
            <span className="micro">
              Plate {nn(index + 1)} / {nn(total)}
            </span>
            {/* Cloud and Design are one-tool chapters, so this cannot be a
                hardcoded plural. */}
            <span className="micro">
              {nn(cap.techs.length)} {cap.techs.length === 1 ? 'tool' : 'tools'}
            </span>
          </figcaption>

          <span aria-hidden="true" className="crop crop--tl" />
          <span aria-hidden="true" className="crop crop--tr" />
          <span aria-hidden="true" className="crop crop--bl" />
          <span aria-hidden="true" className="crop crop--br" />
        </motion.figure>

        {/* ══ Copy ══════════════════════════════════════════════════════════ */}
        <div
          className={`col-span-4 mt-8 md:col-span-12 lg:col-span-6 lg:row-start-1 lg:mt-0 ${
            flipped ? 'lg:col-start-7' : 'lg:col-start-1'
          }`}
        >
          <motion.div
            className="rule-t flex items-baseline justify-between gap-3 pt-3"
            initial={reduce ? undefined : { opacity: 0, y: 12 }}
            whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '0px 0px -15% 0px' }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="micro micro--accent">{nn(index + 1)}</span>
            <span className="micro">{cap.label}</span>
          </motion.div>

          <h3
            id={`discipline-${cap.id}`}
            className="section-title mt-5 text-[hsl(var(--foreground))]"
          >
            {cap.title}
          </h3>

          <RevealText text={cap.lede} className="text-lede mt-5" stagger={0.012} />

          {/* Spec chips — short items in a wrapping row, never one long label. */}
          <ul className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
            {cap.spec.map((item) => (
              <li key={item} className="micro">
                <span aria-hidden="true" className="h-1 w-1 bg-[hsl(var(--primary))]" />
                {item}
              </li>
            ))}
          </ul>

          <ul className="rule-t mt-8">
            {cap.techs.map((tech, i) => (
              <TechRow key={tech.name} tech={tech} index={i} />
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   One tool
   ══════════════════════════════════════════════════════════════════════════ */

/**
 * Mark, name, note — a ruled row on the page surface, not a card and not a
 * cell. The mark is unhoused on purpose: a brand mark is recognised by its
 * colour and its silhouette, and a tile around it takes the silhouette away.
 *
 * The note sits on its own line below the name on narrow screens and swings up
 * beside it, right-aligned, from `md`. It is never truncated — the previous
 * build clipped every note to a stub on the width where it had the most room.
 */
function TechRow({ tech, index }: { tech: Tech; index: number }) {
  const reduce = useReducedMotion();

  return (
    <motion.li
      className="rule-b flex items-start gap-4 py-3"
      initial={reduce ? undefined : { opacity: 0, y: 10 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -8% 0px' }}
      transition={{
        duration: 0.4,
        // Capped so an eight-tool list still finishes inside half a second.
        delay: Math.min(index, 6) * 0.05,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <TechMark tech={tech} className="mt-px h-6 w-6 md:h-7 md:w-7" />

      <div className="min-w-0 flex-1 md:flex md:items-baseline md:justify-between md:gap-6">
        <span className="block text-sm font-semibold tracking-tight text-[hsl(var(--foreground))] md:shrink-0">
          {tech.name}
        </span>
        <span className="mt-1 block font-mono text-[11px] leading-snug text-[hsl(var(--foreground-muted))] md:mt-0 md:text-right">
          {tech.note}
        </span>
      </div>
    </motion.li>
  );
}
