'use client';
import { useId, useState } from 'react';

interface Props {
  /**
   * Modal mode. Pass BOTH `open` and `onClose` to get the dismissible drawer.
   *
   * Omit them entirely — `<BusinessIdeaForm />` — and the form renders INLINE in
   * normal document flow with no backdrop, no fixed positioning and no dismiss
   * chrome. That is what a standalone route (`/idea`) needs: the old default of
   * `open = true, onClose = () => {}` turned the route into a full-screen modal
   * whose ×, Cancel and backdrop were all wired to a no-op, so it could never be
   * dismissed, it covered the page's own <h1>, and its footer — pinned to the
   * viewport bottom by `fixed … bottom-0` — sat underneath the fixed mobile tab
   * bar, making the primary CTA untappable.
   */
  open?: boolean;
  onClose?: () => void;
}

type Step = 1 | 2 | 3;

const PHONE = '2349117564724';

const STEPS = [
  { n: '01', label: 'About you' },
  { n: '02', label: 'Your idea' },
  { n: '03', label: 'Details' },
] as const;

function sendToWhatsApp(form: Record<string, string>) {
  const msg = [
    'NEW PROJECT IDEA',
    '',
    `Name: ${form.name}`,
    `Email: ${form.email}`,
    `Type: ${form.type || 'Not specified'}`,
    '',
    'Idea:',
    form.idea,
    '',
    `Budget: ${form.budget || 'Not specified'}`,
    `Timeline: ${form.timeline || 'Not specified'}`,
  ].join('\n');

  const url = `https://api.whatsapp.com/send/?phone=${PHONE}&text=${encodeURIComponent(msg)}&type=phone_number&app_absent=0`;
  window.open(url, '_blank');
}

export default function BusinessIdeaForm({ open, onClose }: Props) {
  // Modal only when a caller actually opts in. A standalone route renders inline.
  const isModal = open !== undefined || onClose !== undefined;
  const close = onClose ?? (() => {});

  const uid = useId();
  const fid = (k: string) => `idea-${k}-${uid}`;

  const [step, setStep] = useState<Step>(1);
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    type: '',
    idea: '',
    budget: '',
    timeline: '',
  });

  const update = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = () => {
    sendToWhatsApp(form);
    setSent(true);
  };

  const reset = () => {
    setStep(1);
    setSent(false);
    setForm({ name: '', email: '', type: '', idea: '', budget: '', timeline: '' });
    close();
  };

  const step1Valid = form.name.trim() && form.email.trim();
  const step2Valid = form.idea.trim().length > 20;

  const projectTypes = [
    'Web App',
    'Mobile App',
    'Dashboard',
    'E-commerce',
    'Landing Page',
    'API / Backend',
    'SaaS Tool',
    'Other',
  ];
  const budgets = [
    'Under $300',
    '$300–$800',
    '$800–$2,000',
    '$2,000–$5,000',
    '$5,000+',
    'Let’s discuss',
  ];
  const timelines = [
    'ASAP (< 2 weeks)',
    '1 month',
    '2–3 months',
    '3–6 months',
    'Flexible',
  ];

  if (isModal && !open) return null;

  const border = 'hsl(var(--border))';

  /* ── Choice chip. 44px minimum hit area on every one. ── */
  const chip = (
    label: string,
    selected: boolean,
    onSelect: () => void,
    extra = '',
  ) => (
    <button
      key={label}
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={`flex min-h-[48px] items-center gap-3 border px-4 py-3 text-left text-sm transition-colors ${extra}`}
      style={{
        borderColor: selected ? 'hsl(var(--primary))' : border,
        backgroundColor: selected ? 'hsl(var(--primary)/0.08)' : 'hsl(var(--background-light))',
        color: selected ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))',
      }}
    >
      <span
        aria-hidden="true"
        className="flex h-4 w-4 flex-shrink-0 items-center justify-center border"
        style={{ borderColor: selected ? 'hsl(var(--primary))' : border }}
      >
        {selected && <span className="h-2 w-2" style={{ backgroundColor: 'hsl(var(--primary))' }} />}
      </span>
      {label}
    </button>
  );

  /* ══ Header — modal chrome only. On a standalone route the page owns the
     heading, so repeating it inside the form is noise. ══════════════════════ */
  const header = isModal && (
    <div
      className="flex flex-shrink-0 items-start justify-between gap-4 border-b px-6 py-4"
      style={{ borderColor: border }}
    >
      <div>
        <p className="micro">New project</p>
        <p className="mt-2 text-base font-semibold leading-tight text-foreground">
          Tell me what you want built
        </p>
      </div>

      <button
        type="button"
        onClick={close}
        className="flex h-11 w-11 flex-shrink-0 items-center justify-center border text-lg leading-none transition-colors hover:border-primary/50"
        style={{ borderColor: border, color: 'hsl(var(--muted-foreground))' }}
        aria-label="Close"
      >
        ×
      </button>
    </div>
  );

  /* ══ Step indicator ══════════════════════════════════════════════════════
     Was `hidden xs:block` — `xs` is not a breakpoint in tailwind.config.ts, so
     the class compiled to nothing and the bar rendered as a bare "1 2 3". The
     current step is now always named; the per-segment names use a real
     breakpoint (`sm`). ── */
  const stepper = !sent && (
    <div
      className={`flex-shrink-0 ${isModal ? 'border-b px-6 py-3' : 'rule-t rule-b py-4'}`}
      style={isModal ? { borderColor: border, backgroundColor: 'hsl(var(--background-light))' } : undefined}
    >
      <p className="flex w-full items-baseline justify-between gap-3">
        <span className="micro micro--strong">Step {STEPS[step - 1].n} / 03</span>
        <span className="micro">{STEPS[step - 1].label}</span>
      </p>

      <div className="mt-3 grid grid-cols-3 gap-2" aria-hidden="true">
        {STEPS.map((s, i) => {
          const reached = step >= i + 1;
          return (
            <div key={s.n}>
              <span
                className="block h-[3px] w-full"
                style={{ backgroundColor: reached ? 'hsl(var(--primary))' : border }}
              />
              <span
                className="micro mt-2 hidden sm:inline-flex"
                style={{ color: reached ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))' }}
              >
                {s.n} {s.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );

  /* ══ Body ════════════════════════════════════════════════════════════════ */
  const body = (
    <div className={isModal ? 'flex-1 overflow-y-auto px-6 py-6' : 'py-8'}>
      {sent ? (
        <div className="flex flex-col gap-6">
          <div>
            <p className="micro micro--accent">Sent</p>
            <h3 className="section-title mt-3 text-[clamp(1.5rem,6vw,2.25rem)] text-foreground">
              Idea received.
            </h3>
            <p className="text-lede mt-4">
              Your idea is on its way to my WhatsApp. I’ll review it and reply within 24 hours at{' '}
              <strong className="text-foreground">{form.email}</strong>.
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <a
              href={`https://api.whatsapp.com/send/?phone=${PHONE}&type=phone_number&app_absent=0`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary min-h-[48px] justify-center"
              data-magnetic
            >
              Open WhatsApp chat
            </a>
            <button
              type="button"
              onClick={reset}
              className="btn btn-outline min-h-[48px] justify-center"
              data-magnetic
            >
              {isModal ? 'Close' : 'Send another idea'}
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* ── STEP 1 ── */}
          {step === 1 && (
            <div className="flex flex-col gap-6">
              <p
                className="border p-4 text-sm leading-relaxed"
                style={{
                  borderColor: 'hsl(var(--primary)/0.28)',
                  color: 'hsl(var(--muted-foreground))',
                }}
              >
                Got a product idea or need something built? Tell me about it — I’ll give you an
                honest scope and quote within 24 hours. No pressure.
              </p>

              <div>
                <label htmlFor={fid('name')} className="micro mb-2 block">
                  Your name <span className="accent">*</span>
                </label>
                <input
                  id={fid('name')}
                  name="name"
                  type="text"
                  required
                  autoComplete="name"
                  inputMode="text"
                  value={form.name}
                  onChange={e => update('name', e.target.value)}
                  placeholder="What should I call you?"
                  className="input w-full"
                />
              </div>

              <div>
                <label htmlFor={fid('email')} className="micro mb-2 block">
                  Email address <span className="accent">*</span>
                </label>
                <input
                  id={fid('email')}
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  inputMode="email"
                  autoCapitalize="none"
                  spellCheck={false}
                  value={form.email}
                  onChange={e => update('email', e.target.value)}
                  placeholder="your@email.com"
                  className="input w-full"
                />
              </div>

              <div role="group" aria-labelledby={fid('type-label')}>
                <p id={fid('type-label')} className="micro mb-2 block">
                  What are you building?
                </p>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {projectTypes.map(t =>
                    chip(t, form.type === t, () => update('type', form.type === t ? '' : t)),
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 2 ── */}
          {step === 2 && (
            <div className="flex flex-col gap-6">
              <div>
                <label htmlFor={fid('idea')} className="micro mb-2 block">
                  Describe your idea <span className="accent">*</span>
                </label>
                <p id={fid('idea-hint')} className="mb-3 text-sm text-muted-foreground">
                  No need to be technical. Just explain what you want, who it’s for, and what
                  problem it solves.
                </p>
                <textarea
                  id={fid('idea')}
                  name="idea"
                  rows={8}
                  required
                  aria-describedby={`${fid('idea-hint')} ${fid('idea-count')}`}
                  autoComplete="off"
                  inputMode="text"
                  value={form.idea}
                  onChange={e => update('idea', e.target.value)}
                  placeholder={
                    'Example: "I want a web app where small businesses can create and send invoices to clients. It should track payment status and send reminders automatically. Target users are freelancers and small teams."'
                  }
                  className="input w-full"
                />
                <p
                  id={fid('idea-count')}
                  aria-live="polite"
                  className="micro mt-2 flex w-full items-center justify-between"
                >
                  <span style={{ color: form.idea.length < 20 ? 'hsl(var(--primary))' : undefined }}>
                    {form.idea.length < 20
                      ? `${20 - form.idea.length} more characters needed`
                      : 'Good detail'}
                  </span>
                  <span>{form.idea.length} chars</span>
                </p>
              </div>

              <div className="p-4 rule-t rule-b rule-l rule-r">
                <p className="micro">Useful things to include</p>
                <ul className="mt-3 flex flex-col gap-1.5">
                  {[
                    'What problem does it solve?',
                    'Who are the users?',
                    'Any apps that inspired it?',
                    'Must-have features for v1?',
                  ].map(q => (
                    <li key={q} className="text-sm leading-relaxed text-muted-foreground">
                      {q}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* ── STEP 3 ── */}
          {step === 3 && (
            <div className="flex flex-col gap-8">
              <div role="group" aria-labelledby={fid('budget-label')}>
                <p id={fid('budget-label')} className="micro mb-2 block">
                  Rough budget <span className="accent">*</span>
                </p>
                <div className="flex flex-col gap-2">
                  {budgets.map(b =>
                    chip(b, form.budget === b, () => update('budget', form.budget === b ? '' : b)),
                  )}
                </div>
              </div>

              <div role="group" aria-labelledby={fid('timeline-label')}>
                <p id={fid('timeline-label')} className="micro mb-2 block">
                  Timeline
                </p>
                <div className="flex flex-col gap-2">
                  {timelines.map(t =>
                    chip(t, form.timeline === t, () =>
                      update('timeline', form.timeline === t ? '' : t),
                    ),
                  )}
                </div>
              </div>

              {/* Summary */}
              <div className="p-4 rule-t rule-b rule-l rule-r">
                <p className="micro micro--strong">Summary</p>
                <dl className="mt-3">
                  {[
                    ['From', `${form.name} · ${form.email}`],
                    ['Type', form.type || '—'],
                    ['Idea', form.idea.slice(0, 80) + (form.idea.length > 80 ? '…' : '')],
                  ].map(([k, v]) => (
                    <div key={k} className="mt-2 flex gap-3 text-sm">
                      <dt className="micro w-16 flex-shrink-0 pt-1">{k}</dt>
                      <dd className="min-w-0 break-words text-muted-foreground">{v}</dd>
                    </div>
                  ))}
                </dl>
                <p className="micro micro--accent mt-4 leading-relaxed">
                  Opens WhatsApp with your idea pre-filled
                </p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );

  /* ══ Footer nav ══════════════════════════════════════════════════════════
     Modal: pinned inside the drawer, with safe-area padding so the buttons
     clear the iPhone home indicator. Inline: in normal flow, so the page's own
     bottom padding keeps it clear of the fixed mobile tab bar. ── */
  const footer = !sent && (
    <div
      className={
        isModal
          ? 'flex flex-shrink-0 items-center justify-between gap-3 border-t px-6 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))]'
          : 'flex flex-col-reverse gap-3 pt-6 rule-t sm:flex-row sm:items-center sm:justify-between'
      }
      style={isModal ? { borderColor: border, backgroundColor: 'hsl(var(--background-light))' } : undefined}
    >
      {(step > 1 || isModal) && (
        <button
          type="button"
          onClick={() => (step > 1 ? setStep(s => (s - 1) as Step) : close())}
          className="btn btn-outline btn-fx-frame min-h-[48px] justify-center"
        >
          {step > 1 ? '← Back' : 'Cancel'}
        </button>
      )}

      {step < 3 ? (
        <button
          type="button"
          onClick={() => setStep(s => (s + 1) as Step)}
          disabled={step === 1 ? !step1Valid : !step2Valid}
          className="btn btn-primary btn-fx-sweep min-h-[48px] justify-center disabled:cursor-not-allowed disabled:opacity-40"
        >
          Continue →
        </button>
      ) : (
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!form.budget}
          className="btn btn-primary btn-fx-sweep min-h-[48px] justify-center disabled:cursor-not-allowed disabled:opacity-40"
        >
          Send via WhatsApp
        </button>
      )}
    </div>
  );

  /* ══ Inline (standalone route) — normal document flow. No backdrop, no
     `fixed`, no dismiss chrome, so nothing can be pinned under the fixed
     mobile tab bar and nothing traps the user. ═════════════════════════════ */
  if (!isModal) {
    return (
      <section aria-label="Drop your business idea">
        {stepper}
        {body}
        {footer}
      </section>
    );
  }

  /* ══ Modal drawer (Footer.tsx) ═══════════════════════════════════════════ */
  return (
    <>
      <div
        className="fixed inset-0 z-[400] bg-black/70 backdrop-blur-sm"
        onClick={close}
        aria-hidden="true"
      />

      <div
        className="fixed bottom-0 right-0 top-16 z-[401] flex w-full max-w-lg flex-col md:top-20"
        style={{
          backgroundColor: 'hsl(var(--background))',
          borderLeft: '1px solid hsl(var(--border))',
          borderTop: '1px solid hsl(var(--border))',
        }}
        role="dialog"
        aria-modal="true"
        aria-label="Drop your business idea"
      >
        {header}
        {stepper}
        {body}
        {footer}
      </div>
    </>
  );
}
