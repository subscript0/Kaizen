'use client';

import Link from 'next/link';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { personalInfo, socialLinks } from '@/lib/data';

/**
 * The closing statement.
 *
 * Three defects in the old ending are fixed here:
 *
 *  - The email was set at display size and broke mid-word, orphaning a lone
 *    "m" on its own line ("chiemeried321@gmail.co" / "m"). It is now split at
 *    the @ into a deliberate two-line lockup: 23 characters cannot fit one
 *    390px line at any size that still reads as display type, so the break is
 *    chosen rather than left to the engine. `break-keep` on each half stops the
 *    browser inventing a second one.
 *  - The yellow underlines ran straight through the descenders and read as
 *    strikethroughs. Links use a drawn rule *underneath* the text instead —
 *    a separate element that wipes in on hover, clear of the baseline.
 *  - The page stopped dead on the last line. It now closes on a terminal spec
 *    band, the same registration device the rest of the site ends on.
 */

const [EMAIL_USER, EMAIL_DOMAIN] = personalInfo.email.split('@');

export default function AboutOutro() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end end'] });
  const ruleScale = useTransform(scrollYProgress, [0.1, 0.6], [0, 1]);

  return (
    <section ref={ref} className="relative pb-16 pt-20 lg:pb-24 lg:pt-28" aria-labelledby="outro-heading">
      <div className="measure">
        <motion.div
          aria-hidden="true"
          className="h-px w-full origin-left bg-[hsl(var(--primary))]"
          style={reduce ? undefined : { scaleX: ruleScale }}
        />

        <p className="micro mb-8 mt-6">Get in touch</p>

        <h2 id="outro-heading" className="sr-only">
          Contact
        </h2>

        <a
          href={`mailto:${personalInfo.email}`}
          className="group block w-fit max-w-full font-black leading-[0.92] tracking-tight"
        >
          <EmailLine text={EMAIL_USER} reduce={!!reduce} />
          <EmailLine text={`@${EMAIL_DOMAIN}`} accent reduce={!!reduce} delay={0.06} showArrow />
        </a>

        <motion.p
          className="text-lede mt-10 max-w-xl"
          initial={reduce ? undefined : { opacity: 0, y: 16 }}
          whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '0px 0px -12% 0px' }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          Freelance and contract work, remote. Happiest on products where the frontend and the
          backend have to agree with each other.
        </motion.p>

        <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3">
          {socialLinks.map((social, i) => (
            <motion.span
              key={social.name}
              initial={reduce ? undefined : { opacity: 0, y: 12 }}
              whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '0px 0px -10% 0px' }}
              transition={{ duration: 0.4, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
            >
              <UnderlinedLink href={social.url} external>
                {social.name}
              </UnderlinedLink>
            </motion.span>
          ))}
          <motion.span
            initial={reduce ? undefined : { opacity: 0, y: 12 }}
            whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '0px 0px -10% 0px' }}
            transition={{ duration: 0.4, delay: socialLinks.length * 0.07, ease: [0.22, 1, 0.36, 1] }}
          >
            <UnderlinedLink href="/projects">See the work</UnderlinedLink>
          </motion.span>
        </div>
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
          <span className="micro">Freelance &amp; contract</span>
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
 * One line of the email lockup. `break-keep` + `w-fit` mean the line is never
 * hyphenated or broken by the engine; the only break is the one we chose.
 */
function EmailLine({
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
    <span className="block overflow-hidden pb-[0.06em]">
      <motion.span
        className={`block whitespace-nowrap text-[clamp(1.75rem,8.2vw,4rem)] ${
          accent ? 'accent' : 'text-[hsl(var(--foreground))]'
        } transition-colors duration-200 group-hover:text-[hsl(var(--primary))]`}
        style={{ wordBreak: 'keep-all' }}
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

/**
 * A link whose rule is a drawn element beneath the baseline rather than
 * `text-decoration`. The accent underline used to sit on the baseline and cut
 * through every descender, which read as a strikethrough.
 */
function UnderlinedLink({
  href,
  children,
  external = false,
}: {
  href: string;
  children: React.ReactNode;
  external?: boolean;
}) {
  const className =
    'group/link relative inline-flex min-h-[44px] items-center text-sm text-[hsl(var(--foreground))] no-underline transition-colors duration-200 hover:text-[hsl(var(--primary-ink,var(--primary)))]';

  const inner = (
    <>
      {children}
      <span
        aria-hidden="true"
        className="absolute bottom-[10px] left-0 h-px w-full origin-left scale-x-0 bg-[hsl(var(--primary))] transition-transform duration-300 ease-[var(--ease-spring-2)] group-hover/link:scale-x-100"
      />
    </>
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {inner}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {inner}
    </Link>
  );
}
