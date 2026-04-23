'use client';

import { useState } from 'react';
import { personalInfo, socialLinks } from '@/lib/data';
import { trackBookACall } from '@/lib/utils';
import BusinessIdeaForm from './BusinessIdeaForm';

const services = [
  { icon: '⚡', title: 'MVP Development', desc: 'Full-stack web app from scratch — fast, clean, production-ready.' },
  { icon: '📊', title: 'Dashboard & Data UI', desc: 'Complex data made simple. Charts, tables, real-time feeds.' },
  { icon: '🔌', title: 'API Integration', desc: 'Connect your product to any third-party — payments, auth, AI.' },
  { icon: '🛠', title: 'Debug & Improve', desc: 'Take over an existing codebase and make it faster or cleaner.' },
];

const faqs = [
  {
    q: 'How do we start?',
    a: 'Drop your idea using the form below or book a call. I\'ll review it and respond within 24 hours with questions or a rough scope.',
  },
  {
    q: 'What\'s your typical timeline?',
    a: 'A landing page: 1–3 days. A small web app: 2–4 weeks. A full product: 4–10 weeks. Depends on scope — I\'ll give you a real estimate upfront.',
  },
  {
    q: 'Do you work with non-technical founders?',
    a: 'Yes, most of my clients are. I translate your business idea into technical requirements. You don\'t need to know code.',
  },
  {
    q: 'What happens after delivery?',
    a: 'I hand over the source code, deploy the project, and include a 2-week support window for fixes and questions.',
  },
];

export default function Footer() {
  const [ideaOpen,    setIdeaOpen]    = useState(false);
  const [openFaq,     setOpenFaq]     = useState<number | null>(null);
  const year = new Date().getFullYear();

  return (
    <>
      <BusinessIdeaForm open={ideaOpen} onClose={() => setIdeaOpen(false)} />

      <footer
        className="border-t"
        style={{ borderColor: 'hsl(var(--border) / 0.5)' }}
        aria-label="Site footer"
      >
        {/* ── 1. SERVICES ── */}
        <div className="px-6 lg:px-12 max-w-7xl mx-auto py-20">
          <p className="section-number mb-3">What I Build</p>
          <h2 className="section-title mb-12">Services</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {services.map(s => (
              <div
                key={s.title}
                className="p-5 rounded-xl border transition-all duration-200 hover:-translate-y-1 group"
                style={{
                  borderColor: 'hsl(var(--border))',
                  backgroundColor: 'hsl(var(--background-light))',
                }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = 'hsl(var(--primary) / 0.4)'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = 'hsl(var(--border))'}
              >
                <div className="text-2xl mb-3">{s.icon}</div>
                <h3 className="font-semibold text-sm mb-2" style={{ color: 'hsl(var(--foreground))' }}>{s.title}</h3>
                <p className="text-xs leading-relaxed" style={{ color: 'hsl(var(--muted-foreground))' }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── 2. LET'S CONNECT (big CTA) ── */}
        <div
          className="px-6 lg:px-12 max-w-7xl mx-auto py-20 border-t"
          style={{ borderColor: 'hsl(var(--border) / 0.4)' }}
        >
          {/* Main heading */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <p className="section-number mb-4">Let&apos;s Connect</p>
              <h2
                className="text-[clamp(2.4rem,5.5vw,4.5rem)] font-bold tracking-tight leading-[1.05] mb-6"
                style={{ color: 'hsl(var(--foreground))' }}
              >
                Have an idea?<br />
                <span style={{ color: 'hsl(var(--primary))' }}>Let&apos;s build it.</span>
              </h2>
              <p className="text-base leading-relaxed mb-8 max-w-md" style={{ color: 'hsl(var(--muted-foreground))' }}>
                Whether you need a product built from scratch, a feature added to an existing app, or just want to talk through an idea — I&apos;m available.
              </p>

              {/* CTA buttons */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setIdeaOpen(true)}
                  className="btn-primary text-sm"
                >
                  Drop Your Idea 💡
                </button>
                <a
                  href={personalInfo.calendlyUrl}
                  className="btn-outline text-sm"
                  onClick={() => trackBookACall('footer')}
                >
                  Book a Call
                </a>
                <a
                  href={`mailto:${personalInfo.email}`}
                  className="btn-outline text-sm"
                >
                  Send Email
                </a>
              </div>
            </div>

            {/* Contact detail cards */}
            <div className="flex flex-col gap-3">
              {/* Response time promise */}
              <div
                className="flex items-start gap-4 p-4 rounded-xl border"
                style={{ borderColor: 'hsl(var(--primary) / 0.25)', backgroundColor: 'hsl(var(--primary) / 0.04)' }}
              >
                <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: 'hsl(var(--primary) / 0.12)' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                    stroke="hsl(var(--primary))" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold mb-0.5" style={{ color: 'hsl(var(--foreground))' }}>
                    Fast Response
                  </p>
                  <p className="text-xs leading-relaxed" style={{ color: 'hsl(var(--muted-foreground))' }}>
                    I reply to every message within 24 hours — usually much faster.
                  </p>
                </div>
              </div>

              <div
                className="flex items-start gap-4 p-4 rounded-xl border"
                style={{ borderColor: 'hsl(var(--border))', backgroundColor: 'hsl(var(--background-light))' }}
              >
                <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: 'hsl(142 70% 45% / 0.12)' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                    stroke="hsl(142, 70%, 45%)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold mb-0.5" style={{ color: 'hsl(var(--foreground))' }}>
                    Available Now
                  </p>
                  <p className="text-xs leading-relaxed" style={{ color: 'hsl(var(--muted-foreground))' }}>
                    Currently taking on new projects. Slots are limited — reach out early.
                  </p>
                </div>
              </div>

              <div
                className="flex items-start gap-4 p-4 rounded-xl border"
                style={{ borderColor: 'hsl(var(--border))', backgroundColor: 'hsl(var(--background-light))' }}
              >
                <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: 'hsl(var(--secondary) / 0.12)' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                    stroke="hsl(var(--secondary))" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold mb-0.5" style={{ color: 'hsl(var(--foreground))' }}>
                    No Jargon
                  </p>
                  <p className="text-xs leading-relaxed" style={{ color: 'hsl(var(--muted-foreground))' }}>
                    You don&apos;t need to be technical. Just tell me what you want to build.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── 3. FAQ ── */}
        <div
          className="px-6 lg:px-12 max-w-7xl mx-auto py-16 border-t"
          style={{ borderColor: 'hsl(var(--border) / 0.4)' }}
        >
          <p className="section-number mb-3">Common Questions</p>
          <h2 className="section-title mb-10">FAQ</h2>
          <div className="max-w-2xl flex flex-col gap-0">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="border-b"
                style={{ borderColor: 'hsl(var(--border) / 0.5)' }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="flex items-center justify-between w-full py-5 text-left gap-4"
                  aria-expanded={openFaq === i}
                >
                  <span className="text-sm font-semibold" style={{ color: 'hsl(var(--foreground))' }}>
                    {faq.q}
                  </span>
                  <span
                    className="text-xl flex-shrink-0 transition-transform duration-200"
                    style={{
                      color: 'hsl(var(--muted-foreground))',
                      transform: openFaq === i ? 'rotate(45deg)' : 'rotate(0)',
                    }}
                  >+</span>
                </button>
                <div
                  className="overflow-hidden transition-all duration-300"
                  style={{ maxHeight: openFaq === i ? '120px' : '0px' }}
                >
                  <p className="text-sm leading-relaxed pb-5" style={{ color: 'hsl(var(--muted-foreground))' }}>
                    {faq.a}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── 4. Bottom bar ── */}
        <div
          className="px-6 lg:px-12 max-w-7xl mx-auto py-8 border-t flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
          style={{ borderColor: 'hsl(var(--border) / 0.5)' }}
        >
          <p
            className="text-3xl font-bold tracking-tight select-none"
            style={{ color: 'hsl(var(--foreground) / 0.12)' }}
          >
            KAIZEN
          </p>

          <nav className="flex flex-wrap gap-6" aria-label="Social links">
            {socialLinks.map(s => (
              <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer"
                className="text-xs uppercase tracking-widest transition-colors hover:text-primary"
                style={{ color: 'hsl(var(--muted-foreground))' }}>
                {s.name}
              </a>
            ))}
            <a href={`mailto:${personalInfo.email}`}
              className="text-xs uppercase tracking-widest transition-colors hover:text-primary"
              style={{ color: 'hsl(var(--muted-foreground))' }}>
              Email
            </a>
          </nav>

          <p className="text-xs" style={{ color: 'hsl(var(--muted-foreground))' }}>
            © {year} Kaizen. Built with Next.js.
          </p>
        </div>
      </footer>
    </>
  );
}
