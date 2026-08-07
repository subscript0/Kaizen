import type { Metadata } from 'next';
import type { CSSProperties } from 'react';
import Link from 'next/link';
import BusinessIdeaForm from '@/components/BusinessIdeaForm';

export const metadata: Metadata = {
  title: 'Drop an Idea',
  description:
    'Got a product idea or need something built? Share it in three quick steps — get an honest scope and quote within 24 hours.',
};

export default function IdeaPage() {
  return (
    /* The bottom padding is load-bearing on mobile: the tab bar in
       `components/Navbar.tsx` is `fixed inset-x-0 bottom-0` and occupies the
       last ~80px of the viewport, so the form's own CTA has to end above it. */
    <section className="min-h-[100dvh] pb-[max(120px,calc(104px+env(safe-area-inset-bottom)))] pt-24 md:pb-24 md:pt-32">
      <div className="measure">
        <div className="mx-auto w-full max-w-2xl">
          <Link
            href="/"
            className="micro transition-transform duration-150 hover:-translate-x-1"
          >
            ← Back to home
          </Link>

          {/* Multi-step entrance — see the keyframes in app/globals.css. */}
          <header className="mt-8">
            <p className="step-in micro" style={{ '--step': 0 } as CSSProperties}>
              01 — Let’s build
            </p>
            <h1
              className="step-in text-display mt-4 text-foreground"
              style={{ '--step': 1 } as CSSProperties}
            >
              Drop an
              <span className="accent block">Idea.</span>
            </h1>
            <p className="step-in text-lede mt-6" style={{ '--step': 2 } as CSSProperties}>
              Got a product in your head or need something built? Walk me through it in three quick
              steps. I’ll come back with an honest scope and quote within{' '}
              <strong className="text-foreground">24 hours</strong> — no pressure, no sales pitch.
            </p>
          </header>

          <div className="mt-12">
            <BusinessIdeaForm />
          </div>
        </div>
      </div>
    </section>
  );
}
