import Link from 'next/link';

export default function LegalSection() {
  return (
    <section id="legal" className="py-24 px-6 lg:px-12 max-w-[980px] mx-auto" data-reveal>
      <p className="section-number mb-6 text-xs font-semibold uppercase tracking-[0.2em] text-primary" data-reveal>
        07 — Legal
      </p>
      <h2 className="section-title mb-8 text-[clamp(1.5rem,5vw,2.5rem)] font-extrabold leading-none text-foreground" data-reveal>
        Legal
      </h2>
      <div className="space-y-6">
        <div
          data-reveal
          className="card p-6 hover:border-primary/30 hover:shadow-sm transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1.0)]"
        >
          <h3 className="mb-3 font-semibold text-foreground transition-colors duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1.0)] hover:text-primary">
            Privacy Policy
          </h3>
          <p className="text-sm text-muted-foreground/80">
            We respect your privacy and are committed to protecting your personal data.
            This privacy policy explains how we collect, use, disclose, and safeguard your
            information when you visit our website.
          </p>
          <Link
            href="/privacy-policy"
            className="btn btn-outline mt-4 inline-flex items-center gap-2 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1.0)]"
            data-magnetic
          >
            Read Privacy Policy
          </Link>
        </div>

        <div
          data-reveal
          className="card p-6 hover:border-primary/30 hover:shadow-sm transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1.0)]"
        >
          <h3 className="mb-3 font-semibold text-foreground transition-colors duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1.0)] hover:text-primary">
            Terms & Conditions
          </h3>
          <p className="text-sm text-muted-foreground/80">
            Please read these terms and conditions carefully before using our website.
            These terms govern your use of our website and services.
          </p>
          <Link
            href="/terms-conditions"
            className="btn btn-outline mt-4 inline-flex items-center gap-2 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1.0)]"
            data-magnetic
          >
            Read Terms & Conditions
          </Link>
        </div>
      </div>
    </section>
  );
}