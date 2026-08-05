'use client';

import { useRef, useState, type FormEvent } from 'react';
import {
  Github, Twitter, MessageCircle,
  Zap, BarChart3, Plug, Wrench,
  Clock, Activity, ShieldCheck,
  type LucideIcon,
} from 'lucide-react';
import { personalInfo, socialLinks } from '@/lib/data';
import { trackHireMeNow, cn } from '@/lib/utils';
import { gsap, revealOnScroll, useIsoLayoutEffect, useReveal } from '@/lib/motion';
import Magnetic from './motion/Magnetic';
import ServiceStage, { type Service } from '@/components/contact/ServiceStage';
import ContactStatement from '@/components/contact/ContactStatement';
import RevealText from '@/components/about/RevealText';

/**
 * The body of /contact, in the same language as /about:
 *
 *   ServiceStage      a sticky plate that shows whichever service is in the
 *                     reading band, with the services scrolling past it
 *   ContactStatement  a pinned statement that lights word by word as you scroll
 *   04 Let's connect  the editorial CTA lockup and the three promises
 *   05 Send a message the working form
 *
 * The hero (`components/contact/ContactHero.tsx`) is mounted by the route, not
 * here, because it is a full-bleed pinned section and this component owns the
 * page's measured column.
 */

const SOCIAL_ICONS: Record<string, LucideIcon> = {
  GitHub: Github,
  Twitter: Twitter,
  WhatsApp: MessageCircle,
};

// Real screenshots from shipped projects (see lib/data.ts `projects`) — not
// stock photography. Each service is illustrated with an actual product,
// not a generic image, same "real over fabricated" rule as the rest of the
// site (no fake testimonials, live GitHub stats, honest project metrics).
//
// Icons are lucide line icons, not emoji: emoji are full-colour bitmaps that
// drag four extra hues into a palette that is monochrome plus one yellow, and
// they render as a different typeface on every OS.
//
// How these are framed — and why nothing crops them any more — is documented
// at the top of `components/contact/ServiceStage.tsx`.
const services: Service[] = [
  {
    Icon: Zap,
    title: 'MVP Development',
    desc: 'A full-stack web app from scratch — fast, clean, and production-ready rather than a demo that falls over on the second user.',
    thumb: '/projects/images/quickinvoice.jpg',
    thumbAlt: 'QuickInvoice invoice generator — line-item editor with client details and a running total',
  },
  {
    Icon: BarChart3,
    title: 'Dashboard & Data UI',
    desc: 'Complex data made legible. Charts, tables and real-time feeds that stay readable once the numbers get ugly.',
    thumb: '/projects/images/spendwise.jpg',
    thumbAlt: 'SpendWise personal-finance dashboard — spending chart, category breakdown and recent transactions',
  },
  {
    Icon: Plug,
    title: 'API Integration',
    desc: 'Connecting your product to whatever it has to talk to — payments, auth, AI — including the failure cases nobody demos.',
    thumb: '/projects/images/devboard.jpg',
    thumbAlt: 'DevBoard project board — task columns backed by a Node.js and MongoDB API',
  },
  {
    Icon: Wrench,
    title: 'Debug & Improve',
    desc: 'Taking over an existing codebase and making it faster, cleaner or simply understandable again.',
    thumb: '/projects/images/studytrack.jpg',
    thumbAlt: 'StudyTrack learning tracker — study sessions plotted against weekly goals',
  },
];

// Contact promise cards. All three tiles are deliberately identical: they are
// siblings saying three equivalent things, so colouring one yellow and one red
// was hierarchy the content does not have. The accent stays reserved for the
// page's one primary action.
const promises = [
  {
    Icon: Clock,
    title: 'Fast Response',
    desc: 'I reply to every message within 24 hours — usually much faster.',
  },
  {
    Icon: Activity,
    title: 'Available Now',
    desc: 'Currently taking on new projects. Slots are limited — reach out early.',
  },
  {
    Icon: ShieldCheck,
    title: 'No Jargon',
    desc: "You don't need to be technical. Just tell me what you want to build.",
  },
];

// Contact form — client-side only (no API route in this repo). Submitting
// builds a mailto: link pre-filled with the form's data and hands off to
// the visitor's own email client, same "no backend needed" spirit as the
// WhatsApp handoff in BusinessIdeaForm.
type ContactFormState = {
  name: string;
  email: string;
  message: string;
  needs: string[];
};

const initialContactForm: ContactFormState = { name: '', email: '', message: '', needs: [] };

export default function Contact() {
  const scopeRef = useRef<HTMLElement>(null);

  // Rise-and-fade any [data-reveal] element as it enters the viewport.
  //
  // The options object matters here more than anywhere else on the site. It
  // used to sit in `useReveal`'s dependency array by identity, and this
  // component re-renders on every keystroke in the form below — so every
  // character typed tore down and rebuilt the section's ScrollTriggers,
  // re-hiding and re-animating the page underneath the visitor's hands.
  // `useReveal` now compares by value.
  useReveal(scopeRef, '[data-reveal]', { y: 24, duration: 0.62, stagger: 0.08 });

  // Both blocks below are headed by hand-built markup rather than
  // `<SectionHead>` — each heading carries a line break and a coloured span,
  // and the word splitter works on text content, so it would flatten both.
  // Their choreography is set up here instead: eyebrow, then heading, a beat
  // apart, in reading order. The lede that follows is a `<RevealText>`, which
  // owns its own word-by-word rise.
  useIsoLayoutEffect(() => {
    const scope = scopeRef.current;
    if (!scope) return;

    const ctx = gsap.context(() => {
      const cleanups: Array<() => void> = [];
      cleanups.push(
        revealOnScroll('[data-eyebrow]', { y: 12, duration: 0.5, start: 'top 90%' }),
      );
      cleanups.push(
        revealOnScroll('[data-heading]', { y: 26, duration: 0.66, delay: 0.08, start: 'top 90%' }),
      );
      return () => cleanups.forEach((c) => c());
    }, scope);

    return () => ctx.revert();
  }, []);

  const [form, setForm] = useState<ContactFormState>(initialContactForm);
  const [submitted, setSubmitted] = useState(false);

  const updateField = (key: 'name' | 'email' | 'message', value: string) =>
    setForm(f => ({ ...f, [key]: value }));

  const toggleNeed = (need: string) =>
    setForm(f => ({
      ...f,
      needs: f.needs.includes(need) ? f.needs.filter(n => n !== need) : [...f.needs, need],
    }));

  const isFormValid = form.name.trim() !== '' && form.email.trim() !== '' && form.message.trim() !== '';

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isFormValid) return;

    const subject = `Project inquiry from ${form.name}`;
    const body = [
      `Name: ${form.name}`,
      `Email: ${form.email}`,
      `Looking for: ${form.needs.length ? form.needs.join(', ') : 'Not specified'}`,
      '',
      form.message,
    ].join('\n');

    window.location.href = `mailto:${personalInfo.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSubmitted(true);
  };

  return (
    <>
      {/* ── 02 · Services ── */}
      <ServiceStage services={services} />

      {/* ── 03 · Working brief (pinned) ── */}
      <ContactStatement />

      <section ref={scopeRef} id="contact" aria-label="Contact">
        {/* ── 04 · LET'S CONNECT (big editorial CTA) ──────────────────────
            Full-bleed hairline, content still inside the measure — the
            signature move of this style. */}
        <div className="bleed-t relative pt-14 lg:pt-20">
          <div className="measure">
            <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
              <div>
                <p className="micro micro--accent mb-6" data-eyebrow>
                  04 — Let’s connect
                </p>
                <h2 className="section-title mb-6 text-foreground" data-heading>
                  Have an idea?
                  <br />
                  Let’s <span className="accent">build it.</span>
                </h2>
                <RevealText
                  text="Whether you need a product built from scratch, a feature added to an existing app, or just want to talk an idea through — I’m available."
                  className="text-lede mb-9"
                  stagger={0.01}
                />

                <div className="flex flex-wrap gap-4" data-reveal>
                  <Magnetic strength={0.3} radius={50}>
                    <a
                      href={personalInfo.hireWhatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary group"
                      onClick={() => trackHireMeNow('contact')}
                    >
                      Hire me now
                      <span className="transition-transform duration-300 ease-[var(--ease-spring-2)] group-hover:translate-x-0.5">→</span>
                    </a>
                  </Magnetic>
                  <Magnetic strength={0.3} radius={50}>
                    <a
                      href={`mailto:${personalInfo.email}`}
                      className="btn btn-outline group"
                    >
                      Send Email
                      <span className="transition-transform duration-300 ease-[var(--ease-spring-2)] group-hover:translate-x-0.5">→</span>
                    </a>
                  </Magnetic>
                </div>
              </div>

              {/* Contact promise cards. Left-aligned, like everything else on
                  the page — centring three tiles beside a left-aligned column
                  put four different text edges in one row. */}
              <div className="rule-b flex flex-col">
                {promises.map(({ Icon, ...p }, i) => (
                  <div
                    key={p.title}
                    data-reveal
                    className="rule-t group relative flex items-start gap-5 py-6 transition-colors duration-300 ease-[var(--ease-spring-2)]"
                  >
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-y-0 left-0 w-px origin-top scale-y-0 bg-[hsl(var(--primary))] transition-transform duration-300 ease-[var(--ease-spring-2)] group-hover:scale-y-100"
                    />
                    <span className="micro mt-1 shrink-0 tabular-nums">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center border border-[hsl(var(--border))] bg-[hsl(var(--foreground)_/0.04)]">
                      <Icon
                        aria-hidden="true"
                        strokeWidth={1.5}
                        className="h-4 w-4 text-[hsl(var(--foreground)_/0.7)] transition-colors duration-300 group-hover:text-[hsl(var(--primary-ink,var(--primary)))]"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="mb-1 text-sm font-medium text-foreground/85">{p.title}</p>
                      <p className="text-xs leading-relaxed text-muted-foreground/80">{p.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── 05 · SEND A MESSAGE (working contact form) ── */}
        <div
          id="send"
          className="bleed-t relative mt-16 scroll-mt-24 pt-14 md:scroll-mt-28 lg:mt-24 lg:pt-20"
        >
          <div className="measure">
            <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
              {/* Left: pitch + social links */}
              <div>
                <p className="micro micro--accent mb-6" data-eyebrow>
                  05 — Send a message
                </p>
                <h2 className="section-title mb-6 text-foreground" data-heading>
                  Or send the
                  <br />
                  details <span className="accent">directly.</span>
                </h2>
                <RevealText
                  text="Fill this out and your email client opens with everything pre-filled — no database, no spam, no middleman. Just a message straight to my inbox."
                  className="text-lede mb-10"
                  stagger={0.01}
                />

                <div data-reveal>
                  <p className="micro rule-t w-full max-w-[16rem] pt-3">Or find me here</p>
                  <div className="mt-4 flex items-center gap-4">
                    {socialLinks.map(s => {
                      const Icon = SOCIAL_ICONS[s.name];
                      if (!Icon) return null;
                      return (
                        <a
                          key={s.name}
                          href={s.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={s.name}
                          /* Square, not `rounded-full`: the radius resolved to 0
                             through the Tailwind config anyway, so the class was
                             describing a shape the site does not have. */
                          className="group flex h-11 w-11 items-center justify-center border border-[hsl(var(--border))] text-muted-foreground/80 transition-colors duration-300 ease-[var(--ease-spring-2)] hover:border-[hsl(var(--primary))] hover:text-[hsl(var(--primary-ink,var(--primary)))]"
                        >
                          <Icon className="h-4 w-4 transition-transform duration-300 ease-[var(--ease-spring-2)] group-hover:-translate-y-0.5" />
                        </a>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Right: the form itself */}
              <form onSubmit={handleSubmit} className="card p-6 sm:p-8" data-reveal>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="cf-name" className="micro mb-2 block">
                      Name
                    </label>
                    <input
                      id="cf-name"
                      type="text"
                      required
                      name="name"
                      autoComplete="name"
                      autoCapitalize="words"
                      value={form.name}
                      onChange={e => updateField('name', e.target.value)}
                      placeholder="Your name"
                      className="input"
                    />
                  </div>
                  <div>
                    <label htmlFor="cf-email" className="micro mb-2 block">
                      Email
                    </label>
                    <input
                      id="cf-email"
                      type="email"
                      required
                      name="email"
                      autoComplete="email"
                      inputMode="email"
                      autoCapitalize="off"
                      spellCheck={false}
                      value={form.email}
                      onChange={e => updateField('email', e.target.value)}
                      placeholder="you@email.com"
                      className="input"
                    />
                  </div>
                </div>

                <fieldset className="mt-4">
                  <legend className="micro mb-2 block">
                    What are you looking for?{' '}
                    <span className="normal-case tracking-normal text-muted-foreground/50">(optional)</span>
                  </legend>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {services.map(({ Icon, ...s }) => {
                      const active = form.needs.includes(s.title);
                      return (
                        <button
                          key={s.title}
                          type="button"
                          aria-pressed={active}
                          onClick={() => toggleNeed(s.title)}
                          className={cn(
                            'flex min-h-[44px] items-center gap-2.5 border px-3 py-2.5 text-left text-xs font-medium transition-colors duration-300 ease-[var(--ease-spring-2)]',
                            active
                              ? 'border-primary bg-primary/10 text-primary'
                              : 'border-border/50 bg-background-light/30 text-muted-foreground hover:border-border hover:text-foreground/80'
                          )}
                        >
                          <Icon aria-hidden="true" strokeWidth={1.5} className="h-4 w-4 flex-shrink-0" />
                          {s.title}
                        </button>
                      );
                    })}
                  </div>
                </fieldset>

                <div className="mt-4">
                  <label htmlFor="cf-message" className="micro mb-2 block">
                    Message
                  </label>
                  <textarea
                    id="cf-message"
                    required
                    rows={5}
                    name="message"
                    autoComplete="off"
                    value={form.message}
                    onChange={e => updateField('message', e.target.value)}
                    placeholder="What are you building? What problem are you trying to solve?"
                    className="input"
                  />
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-4">
                  {/* Never rendered `disabled`. An empty form is the state this
                      button is in when the visitor first sees it, and a greyed-out
                      primary action reads as "this page is broken" rather than
                      "fill the form in". The inputs are `required`, so the browser's
                      own validation catches an incomplete submit and focuses the
                      offending field — better feedback than a dead button. */}
                  <button type="submit" className="btn btn-primary btn-fx-sweep">
                    Send Message
                  </button>
                  <p className="text-xs text-muted-foreground/70">
                    Opens your email client — nothing is stored or sent to a server.
                  </p>
                </div>

                {submitted && (
                  <p className="mt-4 text-xs text-primary" role="status">
                    Opening your email client now. If nothing happened, email me directly at{' '}
                    <a href={`mailto:${personalInfo.email}`} className="underline underline-offset-2">
                      {personalInfo.email}
                    </a>.
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
