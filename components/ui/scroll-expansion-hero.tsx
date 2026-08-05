'use client';

import Image from 'next/image';
import { useRef, type CSSProperties, type ReactNode } from 'react';
import {
  motion,
  useMotionTemplate,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';

/**
 * ScrollExpandMedia — a media plate that expands from a small card to
 * full-bleed as the visitor scrolls, while the title's two halves slide apart
 * around it.
 *
 * ─── Three deliberate departures from the source this was adapted from ──────
 *
 * 1. NO SCROLL HIJACK. The original added a non-passive `wheel` listener plus
 *    `touchmove` handlers and called `window.scrollTo(0, 0)` on every scroll
 *    event until its internal progress counter reached 1. That traps the
 *    visitor: the page refuses to move, `Page Down`/`Space`/`End` do nothing,
 *    a missed `touchend` leaves the lock on forever, and anything below the
 *    hero becomes unreachable.
 *
 *    Here the expansion is driven by *real* scroll position. The section owns a
 *    tall runway; a `position: sticky` stage inside it stays pinned while the
 *    runway passes, and `useScroll` maps that travel to the expansion. The
 *    visual result is identical — the composition holds still and grows — but
 *    the document never stops scrolling, so wheel, trackpad, touch, keyboard,
 *    scrollbar dragging, find-in-page and "skip to content" all keep working.
 *    There is no event listener to leak and no lock to release.
 *
 * 2. THEMED, NOT HARDCODED. The source painted its type `text-blue-200`. This
 *    site's accent is chosen at runtime by the visitor (a colour picker writes
 *    `--primary`), so every colour here is a token: `--foreground`,
 *    `--foreground-muted`, `--primary`. Change the accent and the hero follows.
 *
 * 3. LOCAL MEDIA ONLY. `next.config.ts` ships `images.remotePatterns: []`, so
 *    `next/image` throws on any remote host. Pass paths under `/public`.
 *
 * Reduced motion: the runway collapses to a single viewport, the plate renders
 * already-expanded, and the video does not autoplay. Nothing animates.
 */

export interface ScrollExpandMediaProps {
  /** 'video' renders a muted, looping <video>; 'image' renders next/image. */
  mediaType?: 'video' | 'image';
  /** Local path under /public — remote URLs are not permitted, see note 3. */
  mediaSrc: string;
  /** Poster frame for the video; also the first paint before it buffers. */
  posterSrc?: string;
  /** Optional backdrop that parallaxes and dissolves as the plate takes over. */
  bgImageSrc?: string;
  /** Split on the first space: the halves slide apart around the plate. */
  title?: string;
  /** Micro-label above the title — a date, a role, an issue number. */
  date?: string;
  /** Micro-label in the scroll cue, e.g. "Scroll to expand". */
  scrollToExpand?: string;
  /** Blend the title against the media instead of stacking it on a scrim. */
  textBlend?: boolean;
  /** Forwarded to the <h1> so `aria-labelledby` can target it. */
  titleId?: string;
  /** Alt text for the plate. Ignored for video (which is decorative). */
  mediaAlt?: string;
  /** Everything after the hero — normal document flow, never pinned. */
  children?: ReactNode;
}

/* The collapsed plate. Kept in one place because four motion templates read
   it and they must agree exactly, or the plate jumps at progress 0. */
const MIN_W = 'min(78vw, 340px)';
const MIN_H = 'min(46dvh, 430px)';

/* How far through the runway the plate is fully open. The remainder is a
   deliberate beat of "held open" before the pin releases. */
const OPEN_AT = 0.72;

export default function ScrollExpandMedia({
  mediaType = 'video',
  mediaSrc,
  posterSrc,
  bgImageSrc,
  title,
  date,
  scrollToExpand,
  textBlend = false,
  titleId,
  mediaAlt = '',
  children,
}: ScrollExpandMediaProps) {
  const runwayRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: runwayRef,
    offset: ['start start', 'end end'],
  });

  // A light spring only — enough to take the stair-step out of a trackpad,
  // not enough to feel detached from the finger.
  const progress = useSpring(scrollYProgress, {
    stiffness: 160,
    damping: 34,
    mass: 0.35,
    restDelta: 0.0005,
  });

  const expand = useTransform(progress, [0, OPEN_AT], [0, 1]);

  // Percentages resolve against the sticky stage, NOT `100vw` — vw includes the
  // scrollbar, which would push a 1px sliver of horizontal overflow onto every
  // desktop viewport (invisible, because body{overflow-x:hidden} hides it).
  const plateW = useMotionTemplate`calc(${MIN_W} + (100% - ${MIN_W}) * ${expand})`;
  const plateH = useMotionTemplate`calc(${MIN_H} + (100% - ${MIN_H}) * ${expand})`;

  // Title halves part around the plate as it grows.
  //
  // The travel has to stay inside the free space either side of the lockup, and
  // BOTH scale with the viewport — a `11vw` title in a `11vw` shift clips at
  // every width, not just one. The title is sized so "ABOUT KAIZEN" occupies
  // roughly 7.3em ≈ 63vw at the fluid step, leaving ~18vw of margin per side;
  // the shift is capped below that with room to spare.
  const xLead = useMotionTemplate`calc(min(9.5vw, 180px) * -${expand})`;
  const xTrail = useMotionTemplate`calc(min(9.5vw, 180px) * ${expand})`;

  const bgOpacity = useTransform(expand, [0, 0.85], [0.42, 0]);
  const bgScale = useTransform(expand, [0, 1], [1.14, 1.02]);
  const bgY = useTransform(progress, [0, 1], ['0%', '-12%']);

  const markOpacity = useTransform(expand, [0, 0.5], [1, 0]);
  const cueOpacity = useTransform(expand, [0, 0.22], [1, 0]);
  // The scrim deepens as the plate opens: a 340px card can carry its own
  // colour, a full-bleed frame behind display type cannot.
  const scrimOpacity = useTransform(expand, [0, 1], [0.18, 0.72]);
  const metaOpacity = useTransform(expand, [0.55, 0.95], [0, 1]);
  const mediaScale = useTransform(expand, [0, 1], [1.18, 1]);

  const [lead, ...tail] = (title ?? '').trim().split(/\s+/);
  const trail = tail.join(' ');

  // Reduced motion: one screen, fully open, no scroll-linked anything.
  const staticPlate: CSSProperties = { width: '100%', height: '100%' };

  return (
    <section className="relative" data-scroll-expand>
      <div
        ref={runwayRef}
        className={
          reduce
            ? 'relative h-[100dvh]'
            : // The runway. 100dvh of it is the pinned stage; the rest is the
              // travel that drives the expansion.
              'relative h-[230dvh] md:h-[290dvh]'
        }
      >
        <div className="sticky top-0 flex h-[100dvh] w-full items-center justify-center overflow-hidden">
          {/* ── Backdrop ─────────────────────────────────────────────────── */}
          {bgImageSrc ? (
            <motion.div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 select-none"
              style={reduce ? { opacity: 0 } : { opacity: bgOpacity, scale: bgScale, y: bgY }}
            >
              <Image
                src={bgImageSrc}
                alt=""
                fill
                priority
                sizes="100vw"
                className="object-cover"
                style={{ filter: 'grayscale(1) contrast(1.15) brightness(0.55)' }}
              />
            </motion.div>
          ) : null}

          {/* Registration grid — hairlines only, the Swiss backdrop. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                'linear-gradient(to right, var(--rule-color) 1px, transparent 1px),' +
                'linear-gradient(to bottom, var(--rule-color) 1px, transparent 1px)',
              backgroundSize: '96px 96px',
              maskImage: 'radial-gradient(120% 80% at 50% 45%, #000 20%, transparent 78%)',
              WebkitMaskImage: 'radial-gradient(120% 80% at 50% 45%, #000 20%, transparent 78%)',
              opacity: 0.5,
            }}
          />

          {/* ── The plate ────────────────────────────────────────────────── */}
          <motion.figure
            className="relative m-0 overflow-hidden will-change-[width,height]"
            style={reduce ? staticPlate : { width: plateW, height: plateH }}
          >
            <motion.div
              className="absolute inset-0"
              // Pulled most of the way to monochrome on purpose: the palette is
              // one accent on greyscale, and a fully saturated frame behind the
              // masthead would introduce a second and third colour to the page.
              // What survives the desaturation is the warm lamp glow, which
              // sits close enough to the accent to read as part of the system.
              style={
                reduce
                  ? { filter: 'saturate(0.4) contrast(1.05)' }
                  : { scale: mediaScale, filter: 'saturate(0.4) contrast(1.05)' }
              }
            >
              {mediaType === 'video' ? (
                <video
                  className="h-full w-full object-cover"
                  src={mediaSrc}
                  poster={posterSrc}
                  autoPlay={!reduce}
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  aria-hidden="true"
                  tabIndex={-1}
                />
              ) : (
                <Image
                  src={mediaSrc}
                  alt={mediaAlt}
                  fill
                  priority
                  sizes="100vw"
                  className="object-cover"
                />
              )}
            </motion.div>

            {/* Scrim — deepens as the plate opens, so the title never loses
                contrast against a bright frame of video. */}
            <motion.div
              aria-hidden="true"
              className="absolute inset-0 bg-[hsl(var(--background))]"
              style={reduce ? { opacity: 0.6 } : { opacity: scrimOpacity }}
            />

            {/* Crop marks + hairline: correct on a plate, wrong on a full
                bleed, so they retire exactly as the plate becomes one. */}
            <motion.div
              aria-hidden="true"
              className="crop-frame pointer-events-none absolute inset-0"
              style={reduce ? { opacity: 0 } : { opacity: markOpacity }}
            >
              <span className="absolute inset-0 border border-[hsl(var(--foreground)/0.35)]" />
              <span className="crop crop--tl" />
              <span className="crop crop--tr" />
              <span className="crop crop--bl" />
              <span className="crop crop--br" />
            </motion.div>
          </motion.figure>

          {/* ── Title lockup ─────────────────────────────────────────────── */}
          <div className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center px-[var(--gutter)]">
            {date ? (
              <motion.p
                className="micro micro--accent mb-5"
                style={reduce ? undefined : { opacity: cueOpacity }}
              >
                {date}
              </motion.p>
            ) : null}

            <h1
              id={titleId}
              className="flex w-full flex-wrap items-baseline justify-center gap-x-[0.28em] text-center font-sans text-[clamp(2rem,8.6vw,6.5rem)] font-black uppercase leading-[0.85] tracking-[-0.03em]"
              style={textBlend ? { mixBlendMode: 'difference' } : undefined}
            >
              <motion.span
                className="inline-block text-[hsl(var(--foreground))]"
                style={reduce ? undefined : { x: xLead }}
              >
                {lead}
              </motion.span>
              {trail ? (
                <motion.span
                  className="inline-block text-[hsl(var(--primary))]"
                  style={reduce ? undefined : { x: xTrail }}
                >
                  {trail}
                </motion.span>
              ) : null}
            </h1>

            {/* Reads once the plate is open — the payoff for the scroll. */}
            <motion.div
              className="mt-8 flex items-center gap-4"
              style={reduce ? undefined : { opacity: metaOpacity }}
            >
              <span
                aria-hidden="true"
                className="h-px w-10 bg-[hsl(var(--primary))] md:w-16"
              />
              <span className="micro micro--strong">Full stack developer</span>
              <span
                aria-hidden="true"
                className="h-px w-10 bg-[hsl(var(--primary))] md:w-16"
              />
            </motion.div>
          </div>

          {/* ── Scroll cue ───────────────────────────────────────────────────
              Sits clear of the 80px fixed mobile navbar. */}
          {scrollToExpand ? (
            <motion.div
              aria-hidden="true"
              className="pointer-events-none absolute bottom-[calc(88px+env(safe-area-inset-bottom,0px))] left-1/2 z-20 -translate-x-1/2 md:bottom-9"
              style={reduce ? { opacity: 1 } : { opacity: cueOpacity }}
            >
              <span className="micro flex-col gap-3">
                {scrollToExpand}
                <ScrollTick reduce={!!reduce} />
              </span>
            </motion.div>
          ) : null}
        </div>
      </div>

      {/* Everything below the hero. Ordinary flow — nothing here is pinned,
          so a keyboard user tabbing out of the hero lands straight in it. */}
      <div className="relative bg-[hsl(var(--background))]">{children}</div>
    </section>
  );
}

/** A hairline that drops on a loop — the Swiss substitute for a bouncing chevron. */
function ScrollTick({ reduce }: { reduce: boolean }) {
  return (
    <span className="relative block h-8 w-px overflow-hidden bg-[hsl(var(--foreground)/0.18)]">
      <motion.span
        className="absolute inset-x-0 top-0 block h-3 bg-[hsl(var(--primary))]"
        initial={{ y: -12 }}
        animate={reduce ? { y: 10 } : { y: [-12, 32] }}
        transition={
          reduce ? { duration: 0 } : { duration: 1.6, repeat: Infinity, ease: 'easeInOut' }
        }
      />
    </span>
  );
}
