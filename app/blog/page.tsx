import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Thoughts on frontend engineering, performance, and building for SaaS and fintech.',
};

/**
 * The whole page used to be a `min-h-screen` flex column with `justify-center`,
 * which floated four lines of text at ~40% down the viewport — ~330px of dead
 * space above and ~450px below, reading as neither centred nor top-aligned.
 * It's top-aligned on the site's normal page rhythm now, and the emptiness is
 * composed rather than merely empty: the queue below states what's coming, so
 * the page carries information instead of an apology.
 */

const QUEUE = [
  {
    index: '01',
    title: 'Architecture that survives the second feature',
    note: 'Reusable components, honest boundaries, and the data flow decisions that stop a codebase rotting.',
  },
  {
    index: '02',
    title: 'Performance as a requirement, not a pass',
    note: 'Treating Core Web Vitals as product requirements: bundle splitting, lazy loading, server components.',
  },
  {
    index: '03',
    title: 'Building with an attacker in mind',
    note: 'What learning offensive security changed about how I design auth, sessions and data access.',
  },
];

export default function BlogPage() {
  return (
    <>
      <div className="measure pt-32 lg:pt-40">
        <p className="micro micro--accent mb-6">01 — Writing</p>

        <h1 className="section-title text-[hsl(var(--foreground))]">
          Blog<span className="accent">.</span>
        </h1>

        <p className="text-lede mt-6">
          Notes on frontend architecture, performance patterns, and building products that hold up
          after launch. Nothing published yet — the first pieces are drafted below.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <Link href="/projects" className="btn btn-primary" data-magnetic>
            See the work instead
          </Link>
          {/* Was `btn-outline` with no `btn`, so it never picked up the shared
              min-height and measured 101x24 — well under the 44px tap target. */}
          <Link href="/" className="btn btn-outline" data-magnetic>
            ← Back home
          </Link>
        </div>
      </div>

      {/* Full-bleed rule, content still inside the measure — the signature move */}
      <div className="bleed-t mt-16 lg:mt-20">
        <div className="measure pt-10">
          <div className="rule-t mb-8 flex max-w-[22rem] items-baseline justify-between gap-4 pt-3">
            <span className="micro micro--strong">In the queue</span>
            <span className="micro">03 drafts</span>
          </div>

          <ol className="rule-t">
            {QUEUE.map((item) => (
              <li
                key={item.index}
                className="rule-b grid grid-cols-[2.5rem_1fr] items-baseline gap-x-4 gap-y-2 py-6 md:grid-cols-[4rem_1fr]"
              >
                <span className="micro">{item.index}</span>
                <div>
                  <h2 className="text-lg font-semibold leading-snug text-[hsl(var(--foreground))]">
                    {item.title}
                  </h2>
                  <p className="mt-2 max-w-[54ch] text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">
                    {item.note}
                  </p>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="micro">Want one of these first?</span>
            <Link
              href="/contact"
              className="micro micro--accent inline-flex min-h-[44px] items-center transition-opacity duration-200 hover:opacity-80"
            >
              Get in touch →
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
