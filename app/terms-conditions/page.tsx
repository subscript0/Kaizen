import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Link from 'next/link';
import { personalInfo } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Terms & Conditions',
  description: 'Terms and conditions for Kaizen portfolio.',
};

const UPDATED = '27 July 2026';

/**
 * Numbered clause — deliberately identical to the one in
 * `app/privacy-policy/page.tsx`. This page used to open with a bare `<h1>`
 * flush to the top edge, no eyebrow and no measure, so the two sibling legal
 * pages read as two unrelated documents. Keep the pair in step.
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

export default function TermsConditions() {
  return (
    <>
      <div className="measure pt-32 lg:pt-40">
        <p className="micro micro--accent mb-6">Legal</p>

        <h1 className="section-title text-[hsl(var(--foreground))]">
          Terms &amp; Conditions<span className="accent">.</span>
        </h1>

        <p className="text-lede mt-6">
          The terms you agree to by using mekaizen.netlify.app, operated by Kaizen.
        </p>

        <div className="rule-t mt-10 flex flex-wrap items-baseline justify-between gap-4 pt-3">
          <span className="micro">Last updated</span>
          <span className="micro micro--strong">{UPDATED}</span>
        </div>

        <div className="mt-10">
          <Clause index="01" title="Acceptance">
            <p>
              Please read these terms and conditions (&ldquo;Terms&rdquo;) carefully before using
              the mekaizen.netlify.app website (the &ldquo;Service&rdquo;) operated by Kaizen
              (&ldquo;us&rdquo;, &ldquo;we&rdquo; or &ldquo;our&rdquo;).
            </p>
            <p>
              By accessing or using the Service you agree to be bound by these Terms. If you
              disagree with any part of them, you may not access the Service.
            </p>
          </Clause>

          <Clause index="02" title="Links to other websites">
            <p>
              The Service may contain links to third-party websites or services that are not owned
              or controlled by Kaizen.
            </p>
            <p>
              Kaizen has no control over, and assumes no responsibility for, the content, privacy
              policies or practices of any third-party website or service.
            </p>
          </Clause>

          <Clause index="03" title="Termination">
            <p>
              We may terminate or suspend access to the Service immediately, without prior notice or
              liability, for any reason whatsoever — including, without limitation, if you breach
              these Terms.
            </p>
          </Clause>

          <Clause index="04" title="Governing law">
            <p>
              These Terms are governed and construed in accordance with the laws of Nigeria, without
              regard to its conflict of law provisions.
            </p>
          </Clause>

          <Clause index="05" title="Changes">
            <p>
              We reserve the right, at our sole discretion, to modify or replace these Terms at any
              time. Where a revision is material we will try to give at least 30 days&rsquo; notice
              before the new terms take effect. What counts as a material change is determined at
              our sole discretion.
            </p>
          </Clause>

          <Clause index="06" title="Contact us">
            <p>If you have any questions about these Terms, get in touch.</p>
          </Clause>
        </div>

        <div className="rule-t flex flex-wrap items-center gap-3 pt-8">
          <a href={`mailto:${personalInfo.email}`} className="btn btn-primary btn-fx-sweep">
            {personalInfo.email}
          </a>
          <Link href="/privacy-policy" className="btn btn-outline" data-magnetic>
            Privacy Policy
          </Link>
          <Link href="/" className="btn btn-outline btn-fx-swap" data-label="← Back home">
            <span className="btn-fx-swap__label">← Back home</span>
          </Link>
        </div>
      </div>
    </>
  );
}
