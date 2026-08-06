'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { motion, useInView, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import StackedTitle from '@/components/Stackedtitle';
import RevealText from '@/components/about/RevealText';

// The identity plate that stands in for a portrait. Facts only — every row
// restates something this page already says out loud.
const PLATE_SPEC = [
  { k: 'Role', v: 'Full-Stack Developer' },
  { k: 'Works on', v: 'Frontend · Backend · Product Design' },
  { k: 'Learning', v: 'Cybersecurity · Cloud' },
  { k: 'Status', v: 'Open to Work' },
];

const CHAPTERS = [
  {
    index: '01',
    label: 'Origin',
    lead: true,
    body: "Hi, I'm Kaizen—a full-stack developer passionate about building modern digital products from the ground up. I enjoy transforming ideas into intuitive, scalable applications by combining thoughtful product design with reliable engineering. Every project is another opportunity to learn, improve, and build something meaningful.",
  },
  {
    index: '02',
    label: 'Approach',
    lead: false,
    body: "My approach is simple: build software that's easy to use, easy to maintain, and built to grow. I focus on clean architecture, reusable components, responsive interfaces, and dependable backend systems while paying close attention to performance, accessibility, and developer experience.",
  },
  {
    index: '03',
    label: 'Now',
    lead: false,
    body: "Today I'm expanding beyond full-stack development into cloud engineering and cybersecurity while continuing to design and build modern web applications. I'm constantly exploring new technologies, improving my workflow, and pushing myself to become a more complete engineer.",
  },
];

/**
 * The narrative body of /about.
 *
 * A sticky identity plate and chapter rail on the left; the chapters
 * themselves on the right. The plate is not decoration — it tracks which
 * chapter is in the reading band and names it, so the pinned column is visibly
 * *doing something* rather than merely refusing to scroll.
 *
 * All motion is framer-motion. The previous build ran a GSAP `useReveal` over
 * `[data-reveal]` here AND a second GSAP tween writing `opacity` on the same
 * chapter elements for the focus effect — two writers on one property, which is
 * what made the dimming stutter. There is exactly one writer per property now.
 */
export default function AboutMe() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);

  const report = useCallback((index: number, inView: boolean) => {
    if (inView) setActive(index);
  }, []);

  return (
    <section id="about" className="relative py-20 lg:py-28" aria-labelledby="about-heading">
      <div className="measure">
        <StackedTitle
          parallax
          first="Who I"
          second="Am"
          id="about-heading"
          sizeClassName="text-[clamp(2.5rem,11vw,6rem)]"
        />
      </div>

      <div className="measure mt-16 grid grid-cols-1 items-start gap-12 lg:mt-24 lg:grid-cols-[300px_1fr] lg:gap-16">
        {/* ══ Sticky column — plate + chapter rail ═════════════════════════ */}
        <div className="flex flex-col gap-8 lg:sticky lg:top-24">
          <IdentityPlate active={active} reduce={!!reduce} />
          <ChapterRail active={active} reduce={!!reduce} />
        </div>

        {/* ══ Chapters ═════════════════════════════════════════════════════ */}
        <div className="flex flex-col gap-16 lg:gap-24">
          {CHAPTERS.map((chapter, i) => (
            <Chapter
              key={chapter.index}
              chapter={chapter}
              i={i}
              isActive={active === i}
              reduce={!!reduce}
              report={report}
            />
          ))}
        </div>
      </div>

    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   Identity plate
   ══════════════════════════════════════════════════════════════════════════ */

/**
 * The portrait plate. The 3/4 crop-marked frame was always built to take a
 * photograph — this is that photograph dropped in.
 *
 * The image sits BEHIND the existing typographic layer rather than replacing
 * it, so the plate still carries Fig. 01, the wordmark, the spec rows and the
 * live "Reading" row. Two things keep that type legible over a photo, and both
 * are borrowed from the scroll-expanding hero this site used to open on:
 *
 *  - the photo is pulled most of the way to monochrome, so it cannot introduce
 *    a second and third colour into a page built on greyscale plus one accent;
 *  - a scrim sits between photo and type, weighted to the top and bottom edges
 *    where the micro-labels actually are, rather than a flat wash that would
 *    grey out the middle of the picture for no reason.
 *
 * A parallax drift on the image plays against the opposite drift already on the
 * wordmark, which is what stops the plate reading as a flat sticker.
 */
function IdentityPlate({ active, reduce }: { active: number; reduce: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  // A whisper of parallax on the wordmark inside a fixed frame — enough to
  // register as depth, not enough to read as movement.
  const markY = useTransform(scrollYProgress, [0, 1], [16, -16]);
  // The photo drifts the other way. The layer is 12% taller than the frame so
  // this travel can never expose an edge.
  const photoY = useTransform(scrollYProgress, [0, 1], ['-5%', '5%']);

  return (
    <motion.figure
      ref={ref}
      className="crop-frame rule-t rule-b rule-l rule-r relative mx-auto w-full max-w-[320px] overflow-hidden"
      initial={reduce ? undefined : { opacity: 0, y: 24 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <span className="crop crop--tl z-20" aria-hidden="true" />
      <span className="crop crop--tr z-20" aria-hidden="true" />
      <span className="crop crop--bl z-20" aria-hidden="true" />
      <span className="crop crop--br z-20" aria-hidden="true" />

      {/* ── The photograph ─────────────────────────────────────────────── */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-x-0 -top-[6%] h-[112%] will-change-transform"
        style={reduce ? undefined : { y: photoY }}
      >
        <Image
          src="/me.jpg"
          alt=""
          fill
          sizes="320px"
          className="object-cover"
          style={{ filter: 'saturate(0.58) contrast(1.06)' }}
        />
      </motion.div>

      {/* Scrim — weighted to the rails, transparent through the middle. */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to bottom,' +
            'hsl(var(--background) / 0.84) 0%,' +
            'hsl(var(--background) / 0.30) 28%,' +
            'hsl(var(--background) / 0.38) 56%,' +
            'hsl(var(--background) / 0.92) 100%)',
        }}
      />

      <div className="relative z-10 flex aspect-[3/4] flex-col justify-between p-6">
        <div className="flex items-baseline justify-between gap-3">
          <span className="micro micro--strong">Fig. 01</span>
          <span className="micro micro--accent">
            <motion.span
              aria-hidden="true"
              className="inline-block h-1.5 w-1.5 bg-[hsl(var(--primary))]"
              animate={reduce ? undefined : { opacity: [1, 0.2, 1] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
            />
            Open to work
          </span>
        </div>

        <motion.p
          className="text-[clamp(2.25rem,10vw,3rem)] font-black uppercase leading-[0.82] tracking-tight text-[hsl(var(--foreground))]"
          style={reduce ? undefined : { y: markY }}
        >
          Kai<span className="accent">zen</span>
        </motion.p>

        <div>
          <dl className="grid grid-cols-1">
            {PLATE_SPEC.map(({ k, v }, i) => (
              <motion.div
                key={k}
                className="rule-t flex items-baseline justify-between gap-3 py-2"
                initial={reduce ? undefined : { opacity: 0, x: -8 }}
                whileInView={reduce ? undefined : { opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '0px 0px -8% 0px' }}
                transition={{ duration: 0.4, delay: 0.15 + i * 0.06 }}
              >
                <dt className="micro shrink-0">{k}</dt>
                <dd className="text-right text-xs text-[hsl(var(--foreground)/0.85)]">{v}</dd>
              </motion.div>
            ))}
          </dl>

          {/* The live row: the plate names whichever chapter is being read. */}
          <div className="rule-t mt-2 flex items-baseline justify-between gap-3 pt-3">
            <span className="micro shrink-0">Reading</span>
            <span aria-hidden="true" className="relative block h-4 flex-1 overflow-hidden">
              {CHAPTERS.map((c, i) => (
                <motion.span
                  key={c.index}
                  className="micro micro--accent absolute inset-0 justify-end"
                  initial={false}
                  animate={
                    reduce
                      ? { opacity: active === i ? 1 : 0 }
                      : {
                          y: active === i ? '0%' : active > i ? '-120%' : '120%',
                          opacity: active === i ? 1 : 0,
                        }
                  }
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                >
                  {c.index} {c.label}
                </motion.span>
              ))}
            </span>
          </div>
        </div>
      </div>
    </motion.figure>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   Chapter rail — one accent bar that slides between rows via shared layout
   ══════════════════════════════════════════════════════════════════════════ */

function ChapterRail({ active, reduce }: { active: number; reduce: boolean }) {
  return (
    <ol className="hidden lg:block" aria-hidden="true">
      {CHAPTERS.map((c, i) => (
        <li key={c.index} className="rule-t relative flex items-center gap-3 py-3 pl-4">
          {active === i ? (
            <motion.span
              layoutId={reduce ? undefined : 'about-chapter-marker'}
              className="absolute left-0 top-0 h-full w-[2px] bg-[hsl(var(--primary))]"
              transition={{ type: 'spring', stiffness: 380, damping: 34 }}
            />
          ) : null}
          <span
            className="micro transition-colors duration-200"
            style={active === i ? { color: 'hsl(var(--primary-ink, var(--primary)))' } : undefined}
          >
            {c.index}
          </span>
          <span
            className="micro transition-colors duration-200"
            style={active === i ? { color: 'hsl(var(--foreground))' } : undefined}
          >
            {c.label}
          </span>
        </li>
      ))}
    </ol>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   Chapter
   ══════════════════════════════════════════════════════════════════════════ */

function Chapter({
  chapter,
  i,
  isActive,
  reduce,
  report,
}: {
  chapter: (typeof CHAPTERS)[number];
  i: number;
  isActive: boolean;
  reduce: boolean;
  report: (index: number, inView: boolean) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  // A narrow band across the middle of the viewport is the "reading position".
  const inView = useInView(ref, { margin: '-45% 0px -45% 0px' });

  useEffect(() => {
    report(i, inView);
  }, [inView, i, report]);

  return (
    <motion.div
      ref={ref}
      initial={false}
      animate={reduce ? undefined : { opacity: isActive ? 1 : 0.42 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        className="rule-t mb-5 flex items-baseline justify-between gap-3 pt-3"
        initial={reduce ? undefined : { opacity: 0, y: 14 }}
        whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '0px 0px -15% 0px' }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        <span
          className="micro transition-colors duration-200"
          style={isActive ? { color: 'hsl(var(--primary-ink, var(--primary)))' } : undefined}
        >
          {chapter.index}
        </span>
        <span className="micro">{chapter.label}</span>
      </motion.div>

      {/*
        The opening chapter used to carry a serif drop cap — a third typeface
        that split "H" off "i, I'm Kaizen", spanned two lines and left an indent
        notch. Hierarchy comes from scale instead: the lead chapter is simply
        set larger and in fuller ink.
      */}
      <RevealText
        text={chapter.body}
        className={
          chapter.lead
            ? 'text-[clamp(1.25rem,4.4vw,1.6rem)] leading-[1.45] text-[hsl(var(--foreground)/0.94)]'
            : 'text-[clamp(1.0625rem,2.6vw,1.25rem)] leading-relaxed text-[hsl(var(--muted-foreground))]'
        }
        stagger={chapter.lead ? 0.014 : 0.008}
      />
    </motion.div>
  );
}
