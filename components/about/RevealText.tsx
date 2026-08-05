'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Fragment, type ElementType } from 'react';

interface RevealTextProps {
  /** Plain text. Split on whitespace; each word rises out of its own mask. */
  text: string;
  /** Words listed here are painted in the accent. Case-insensitive, punctuation-tolerant. */
  accentWords?: string[];
  as?: ElementType;
  className?: string;
  /** Seconds between consecutive words. Keep it small — this is type, not a queue. */
  stagger?: number;
  delay?: number;
  id?: string;
}

const normalise = (w: string) => w.replace(/[^\p{L}\p{N}]/gu, '').toLowerCase();

/**
 * Word-by-word rise. Each word sits in an `overflow-hidden` inline-block, so
 * the glyphs are genuinely clipped by the line above rather than just faded —
 * that clip is what makes it read as typesetting rather than a fade-in.
 *
 * `whileInView` with `once` means it plays exactly once per visit and costs
 * nothing afterwards. Reduced motion renders the finished state with no masks,
 * no transforms and no observer.
 */
export default function RevealText({
  text,
  accentWords = [],
  as: Tag = 'p',
  className = '',
  stagger = 0.028,
  delay = 0,
  id,
}: RevealTextProps) {
  const reduce = useReducedMotion();
  const accents = new Set(accentWords.map(normalise));
  const words = text.split(' ');

  if (reduce) {
    return (
      <Tag id={id} className={className}>
        {words.map((word, i) => (
          <span key={i} className={accents.has(normalise(word)) ? 'accent' : undefined}>
            {word}
            {i < words.length - 1 ? ' ' : ''}
          </span>
        ))}
      </Tag>
    );
  }

  return (
    <Tag id={id} className={className}>
      {words.map((word, i) => (
        <Fragment key={i}>
          {/* The padding + matching negative margin give descenders room inside
              the mask; without it every "g" and "y" is guillotined. */}
          <span
            className="inline-block overflow-hidden pb-[0.14em] align-bottom"
            style={{ marginBottom: '-0.14em' }}
          >
            <motion.span
              className={`inline-block ${accents.has(normalise(word)) ? 'accent' : ''}`}
              initial={{ y: '108%' }}
              whileInView={{ y: '0%' }}
              viewport={{ once: true, margin: '0px 0px -12% 0px' }}
              transition={{
                duration: 0.62,
                delay: delay + i * stagger,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {word}
            </motion.span>
          </span>
          {/* The space lives BETWEEN the masks, never inside one — a trailing
              space inside an `overflow-hidden` inline-block is trimmed, which
              runs every word together. */}
          {i < words.length - 1 ? ' ' : ''}
        </Fragment>
      ))}
    </Tag>
  );
}
