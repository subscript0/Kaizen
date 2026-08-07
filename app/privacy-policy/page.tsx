import type { Metadata } from 'next';
import type { CSSProperties, ReactNode } from 'react';
import Link from 'next/link';
import { personalInfo } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy policy for Kaizen portfolio website.',
};

const UPDATED = '27 July 2026';

/**
 * Numbered clause. The two legal pages are siblings and now share one header
 * treatment and one clause rhythm — /terms-conditions used to open with a bare
 * `<h1>` flush to the top edge and no eyebrow at all, so the pair read as two
 * unrelated documents. Keep the two files in step when either changes.
 */
function Clause({ index, title, children }: { index: string; title: string; children: ReactNode }) {
  return (
    <section className="rule-t grid grid-cols-1 gap-x-[var(--gutter)] gap-y-3 py-8 md:grid-cols-[4rem_1fr]">
      <span className="micro md:pt-1.5">{index}</span>
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-[hsl(var(--foreground))]">
          {title}
        </h2>
        <div className="mt-4 max-w-[68ch] space-y-4 text-[0.9375rem] leading-relaxed text-[hsl(var(--muted-foreground))]">
          {children}
        </div>
      </div>
    </section>
  );
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item} className="grid grid-cols-[1rem_1fr] gap-2">
          <span className="text-[hsl(var(--primary))]" aria-hidden="true">
            —
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default function PrivacyPolicy() {
  return (
    <>
      {/* Multi-step entrance — see the keyframes in app/globals.css. These
          routes carry no scroll reveal, so this is the only motion on them. */}
      <div className="measure pt-32 lg:pt-40">
        <p className="step-in micro micro--accent mb-6" style={{ '--step': 0 } as CSSProperties}>
          Legal
        </p>

        <h1
          className="step-in section-title text-[hsl(var(--foreground))]"
          style={{ '--step': 1 } as CSSProperties}
        >
          Privacy Policy<span className="accent">.</span>
        </h1>

        <p className="step-in text-lede mt-6" style={{ '--step': 2 } as CSSProperties}>
          How this site collects, uses and safeguards the information you choose to share with it.
        </p>

        <div
          className="step-in rule-t mt-10 flex flex-wrap items-baseline justify-between gap-4 pt-3"
          style={{ '--step': 3 } as CSSProperties}
        >
          <span className="micro">Last updated</span>
          <span className="micro micro--strong">{UPDATED}</span>
        </div>

        <div className="mt-10">
          <Clause index="01" title="Introduction">
            <p>
              Welcome to Kaizen ({personalInfo.name}). This privacy policy explains how we collect,
              use, disclose and safeguard your information when you visit this website.
            </p>
          </Clause>

          <Clause index="02" title="Information we collect">
            <p>We may collect personal information that you voluntarily provide when you:</p>
            <Bullets
              items={[
                'Contact us through the website',
                'Subscribe to our newsletter',
                'Leave a message in our guestbook',
                'Start a WhatsApp conversation with us through a "Hire me now" button',
              ]}
            />
            <p>The information collected may include:</p>
            <Bullets
              items={['Name', 'Email address', 'Phone number (if provided)', 'Message content']}
            />
          </Clause>

          <Clause index="03" title="How we use your information">
            <p>We may use the information we collect for:</p>
            <Bullets
              items={[
                'Responding to your enquiries and providing support',
                'Sending you emails about our services',
                'Improving the website and its services',
                'Complying with legal obligations',
              ]}
            />
          </Clause>

          <Clause index="04" title="Sharing your information">
            <p>
              We do not sell, trade or otherwise transfer your personal information to outside
              parties, except where necessary to comply with the law, enforce our site policies, or
              protect the rights, property or safety of ourselves or others.
            </p>
          </Clause>

          <Clause index="05" title="Cookies">
            <p>
              This website uses cookies to improve your experience and to collect analytical data.
              You can set your browser to warn you each time a cookie is sent, or to refuse cookies
              entirely.
            </p>
          </Clause>

          <Clause index="06" title="Data security">
            <p>
              We use a range of security measures to protect your personal information when you
              enter, submit or access it.
            </p>
          </Clause>

          <Clause index="07" title="Your rights">
            <p>You have the right to:</p>
            <Bullets
              items={[
                'Request access to your personal data',
                'Request correction of your personal data',
                'Request deletion of your personal data',
                'Object to processing of your personal data',
                'Request restriction of processing',
                'Request portability of your personal data',
              ]}
            />
          </Clause>

          <Clause index="08" title="Changes to this policy">
            <p>
              We reserve the right to modify this privacy policy at any time. Changes take effect
              immediately on posting, so please review it periodically.
            </p>
          </Clause>

          <Clause index="09" title="Contact us">
            <p>
              To access, correct, amend or delete any personal information we hold about you, to
              register a complaint, or simply to ask for more detail, get in touch.
            </p>
          </Clause>
        </div>

        {/* Pulled out of the paragraph flow: as an inline link the address was a
            196x21 tap target, and its default underline ran straight through the
            descenders of the address like a strikethrough. */}
        <div className="rule-t flex flex-wrap items-center gap-3 pt-8">
          <a href={`mailto:${personalInfo.email}`} className="btn btn-primary btn-fx-sweep">
            {personalInfo.email}
          </a>
          <Link href="/terms-conditions" className="btn btn-outline btn-fx-frame">
            Terms &amp; Conditions
          </Link>
          <Link href="/" className="btn btn-outline btn-fx-swap" data-label="← Back home">
            <span className="btn-fx-swap__label">← Back home</span>
          </Link>
        </div>
      </div>
    </>
  );
}
