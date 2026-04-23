'use client';

import { useState } from 'react';

interface Props {
  open: boolean;
  onClose: () => void;
}

type Step = 1 | 2 | 3;

const PHONE = '2349117564724';

function sendToWhatsApp(form: Record<string, string>) {
  const msg = [
    `🚀 *New Project Idea*`,
    ``,
    `👤 *Name:* ${form.name}`,
    `📧 *Email:* ${form.email}`,
    `🏷 *Type:* ${form.type || 'Not specified'}`,
    ``,
    `💡 *Idea:*`,
    form.idea,
    ``,
    `💰 *Budget:* ${form.budget || 'Not specified'}`,
    `⏱ *Timeline:* ${form.timeline || 'Not specified'}`,
  ].join('\n');

  const url = `https://api.whatsapp.com/send/?phone=${PHONE}&text=${encodeURIComponent(msg)}&type=phone_number&app_absent=0`;
  window.open(url, '_blank');
}

export default function BusinessIdeaForm({ open, onClose }: Props) {
  const [step,  setStep]  = useState<Step>(1);
  const [sent,  setSent]  = useState(false);
  const [form,  setForm]  = useState({
    name: '', email: '', type: '', idea: '', budget: '', timeline: '',
  });

  const update = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = () => {
    sendToWhatsApp(form);
    setSent(true);
  };

  const reset = () => {
    setStep(1); setSent(false);
    setForm({ name:'', email:'', type:'', idea:'', budget:'', timeline:'' });
    onClose();
  };

  const step1Valid = form.name.trim() && form.email.trim();
  const step2Valid = form.idea.trim().length > 20;

  const inputCls = `w-full rounded-xl border px-4 py-3 text-sm bg-transparent outline-none transition-all duration-200
    focus:border-[hsl(var(--primary))] focus:ring-2 focus:ring-[hsl(var(--primary)/0.15)]`;
  const inputStyle = { borderColor:'hsl(var(--border))', color:'hsl(var(--foreground))' };

  const projectTypes = ['Web App','Mobile App','Dashboard','E-commerce','Landing Page','API / Backend','SaaS Tool','Other'];
  const budgets      = ['Under $300','$300–$800','$800–$2,000','$2,000–$5,000','$5,000+','Let\'s discuss'];
  const timelines    = ['ASAP (< 2 weeks)','1 month','2–3 months','3–6 months','Flexible'];

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[400] bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* ── Drawer — starts BELOW navbar (top-16 md:top-20) ── */}
      <div
        className="fixed top-16 md:top-20 right-0 bottom-0 z-[401] flex flex-col w-full max-w-lg shadow-2xl"
        style={{
          backgroundColor: 'hsl(var(--background))',
          borderLeft: '1px solid hsl(var(--border))',
          borderTop:  '1px solid hsl(var(--border))',
        }}
        role="dialog"
        aria-modal="true"
        aria-label="Drop your business idea"
      >
        {/* ── Header ── */}
        <div
          className="flex-shrink-0 flex items-center justify-between px-6 py-4 border-b"
          style={{ borderColor:'hsl(var(--border))' }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center text-lg"
              style={{ backgroundColor:'hsl(var(--primary)/0.12)' }}
            >💡</div>
            <div>
              <p className="text-[10px] uppercase tracking-widest font-semibold"
                style={{ color:'hsl(var(--primary))' }}>New Project</p>
              <h2 className="font-bold text-base leading-tight"
                style={{ color:'hsl(var(--foreground))' }}>Drop Your Idea</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-lg border flex items-center justify-center text-xl leading-none transition-colors hover:border-[hsl(var(--primary))]"
            style={{ borderColor:'hsl(var(--border))', color:'hsl(var(--muted-foreground))' }}
            aria-label="Close"
          >×</button>
        </div>

        {/* ── Step bar ── */}
        {!sent && (
          <div
            className="flex-shrink-0 flex items-center gap-0 px-6 py-3 border-b"
            style={{ borderColor:'hsl(var(--border))', backgroundColor:'hsl(var(--background-light))' }}
          >
            {(['About You','Your Idea','Details'] as const).map((label, i) => {
              const s = (i + 1) as Step;
              const active  = step === s;
              const done    = step > s;
              return (
                <div key={s} className="flex items-center flex-1">
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold transition-all"
                      style={{
                        backgroundColor: done ? 'hsl(142,70%,45%)' : active ? 'hsl(var(--primary))' : 'hsl(var(--muted))',
                        color: (active || done) ? 'white' : 'hsl(var(--muted-foreground))',
                      }}
                    >{done ? '✓' : s}</div>
                    <span
                      className="text-[11px] font-medium hidden xs:block"
                      style={{ color: active ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))' }}
                    >{label}</span>
                  </div>
                  {s < 3 && (
                    <div className="flex-1 h-px mx-2"
                      style={{ backgroundColor: step > s ? 'hsl(142,70%,45%)' : 'hsl(var(--border))' }} />
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ── Scrollable body ── */}
        <div className="flex-1 overflow-y-auto px-6 py-6">

          {/* SUCCESS */}
          {sent ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-5 py-10">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center text-3xl"
                style={{ backgroundColor:'hsl(142,70%,45%/0.12)', border:'2px solid hsl(142,70%,45%/0.3)' }}
              >🚀</div>
              <div>
                <h3 className="text-xl font-bold mb-2" style={{ color:'hsl(var(--foreground))' }}>
                  Idea Sent!
                </h3>
                <p className="text-sm leading-relaxed max-w-xs" style={{ color:'hsl(var(--muted-foreground))' }}>
                  Your idea has been sent to my WhatsApp. I&apos;ll review it and reply within 24 hours at{' '}
                  <strong style={{ color:'hsl(var(--foreground))' }}>{form.email}</strong>.
                </p>
              </div>
              <div className="flex flex-col gap-2 w-full max-w-xs">
                <button onClick={reset} className="btn-primary text-sm w-full justify-center">
                  Close
                </button>
                <a
                  href={`https://api.whatsapp.com/send/?phone=${PHONE}&type=phone_number&app_absent=0`}
                  target="_blank" rel="noopener noreferrer"
                  className="btn-outline text-sm w-full justify-center"
                >
                  Open WhatsApp Chat
                </a>
              </div>
            </div>
          ) : (
            <>
              {/* ── STEP 1 ── */}
              {step === 1 && (
                <div className="flex flex-col gap-5">
                  <div className="rounded-xl p-4 border text-sm leading-relaxed"
                    style={{ borderColor:'hsl(var(--primary)/0.2)', backgroundColor:'hsl(var(--primary)/0.04)', color:'hsl(var(--muted-foreground))' }}>
                    Got a product idea or need something built? Tell me about it — I&apos;ll give you an honest scope and quote within 24 hours. No pressure.
                  </div>

                  <div>
                    <label className="text-xs font-semibold block mb-2" style={{ color:'hsl(var(--muted-foreground))' }}>
                      Your Name *
                    </label>
                    <input type="text" value={form.name} onChange={e => update('name', e.target.value)}
                      placeholder="What should I call you?" className={inputCls} style={inputStyle} />
                  </div>

                  <div>
                    <label className="text-xs font-semibold block mb-2" style={{ color:'hsl(var(--muted-foreground))' }}>
                      Email Address *
                    </label>
                    <input type="email" value={form.email} onChange={e => update('email', e.target.value)}
                      placeholder="your@email.com" className={inputCls} style={inputStyle} />
                  </div>

                  <div>
                    <label className="text-xs font-semibold block mb-2" style={{ color:'hsl(var(--muted-foreground))' }}>
                      What are you building?
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {projectTypes.map(t => (
                        <button key={t} onClick={() => update('type', t)}
                          className="px-3 py-2.5 rounded-xl border text-xs font-medium transition-all text-left"
                          style={{
                            borderColor: form.type === t ? 'hsl(var(--primary))' : 'hsl(var(--border))',
                            backgroundColor: form.type === t ? 'hsl(var(--primary)/0.1)' : 'hsl(var(--background-light))',
                            color: form.type === t ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))',
                          }}
                        >
                          {form.type === t && <span className="mr-1">✓</span>}
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ── STEP 2 ── */}
              {step === 2 && (
                <div className="flex flex-col gap-5">
                  <div>
                    <label className="text-xs font-semibold block mb-1" style={{ color:'hsl(var(--muted-foreground))' }}>
                      Describe your idea *
                    </label>
                    <p className="text-[11px] mb-2" style={{ color:'hsl(var(--muted-foreground))' }}>
                      No need to be technical. Just explain what you want, who it&apos;s for, and what problem it solves.
                    </p>
                    <textarea rows={8} value={form.idea} onChange={e => update('idea', e.target.value)}
                      placeholder={`Example:\n"I want a web app where small businesses can create and send invoices to clients. It should track payment status and send reminders automatically. Target users are freelancers and small teams."`}
                      className={inputCls} style={{ ...inputStyle, resize:'none' }} />
                    <div className="flex justify-between mt-1">
                      <p className="text-[10px]" style={{ color: form.idea.length < 20 ? 'hsl(0,84%,60%)' : 'hsl(142,70%,45%)' }}>
                        {form.idea.length < 20 ? `${20 - form.idea.length} more characters needed` : '✓ Good detail'}
                      </p>
                      <p className="text-[10px]" style={{ color:'hsl(var(--muted-foreground))' }}>
                        {form.idea.length} chars
                      </p>
                    </div>
                  </div>

                  {/* Prompt questions */}
                  <div className="rounded-xl border p-4" style={{ borderColor:'hsl(var(--border))', backgroundColor:'hsl(var(--background-light))' }}>
                    <p className="text-[11px] font-semibold mb-2" style={{ color:'hsl(var(--muted-foreground))' }}>
                      💭 Useful things to include:
                    </p>
                    {['What problem does it solve?','Who are the users?','Any apps that inspired it?','Must-have features for v1?'].map(q => (
                      <p key={q} className="text-[11px] leading-relaxed" style={{ color:'hsl(var(--muted-foreground))' }}>
                        · {q}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              {/* ── STEP 3 ── */}
              {step === 3 && (
                <div className="flex flex-col gap-6">
                  <div>
                    <label className="text-xs font-semibold block mb-2" style={{ color:'hsl(var(--muted-foreground))' }}>
                      Rough Budget
                    </label>
                    <div className="flex flex-col gap-2">
                      {budgets.map(b => (
                        <button key={b} onClick={() => update('budget', b)}
                          className="flex items-center gap-3 px-4 py-3 rounded-xl border text-sm transition-all"
                          style={{
                            borderColor: form.budget === b ? 'hsl(var(--primary))' : 'hsl(var(--border))',
                            backgroundColor: form.budget === b ? 'hsl(var(--primary)/0.08)' : 'hsl(var(--background-light))',
                            color: form.budget === b ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))',
                          }}
                        >
                          <span
                            className="w-4 h-4 rounded-full border flex-shrink-0 flex items-center justify-center"
                            style={{ borderColor: form.budget === b ? 'hsl(var(--primary))' : 'hsl(var(--border))' }}
                          >
                            {form.budget === b && (
                              <span className="w-2 h-2 rounded-full" style={{ backgroundColor:'hsl(var(--primary))' }} />
                            )}
                          </span>
                          {b}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold block mb-2" style={{ color:'hsl(var(--muted-foreground))' }}>
                      Timeline
                    </label>
                    <div className="grid grid-cols-1 gap-2">
                      {timelines.map(t => (
                        <button key={t} onClick={() => update('timeline', t)}
                          className="flex items-center gap-3 px-4 py-2.5 rounded-xl border text-sm transition-all"
                          style={{
                            borderColor: form.timeline === t ? 'hsl(var(--primary))' : 'hsl(var(--border))',
                            backgroundColor: form.timeline === t ? 'hsl(var(--primary)/0.08)' : 'hsl(var(--background-light))',
                            color: form.timeline === t ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))',
                          }}
                        >
                          <span
                            className="w-4 h-4 rounded-full border flex-shrink-0 flex items-center justify-center"
                            style={{ borderColor: form.timeline === t ? 'hsl(var(--primary))' : 'hsl(var(--border))' }}
                          >
                            {form.timeline === t && (
                              <span className="w-2 h-2 rounded-full" style={{ backgroundColor:'hsl(var(--primary))' }} />
                            )}
                          </span>
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="rounded-xl border p-4" style={{ borderColor:'hsl(var(--border))', backgroundColor:'hsl(var(--background-light))' }}>
                    <p className="text-[11px] font-semibold mb-2" style={{ color:'hsl(var(--foreground))' }}>
                      📋 Summary
                    </p>
                    <p className="text-[11px]" style={{ color:'hsl(var(--muted-foreground))' }}>
                      <strong style={{ color:'hsl(var(--foreground))' }}>From:</strong> {form.name} · {form.email}
                    </p>
                    <p className="text-[11px] mt-1" style={{ color:'hsl(var(--muted-foreground))' }}>
                      <strong style={{ color:'hsl(var(--foreground))' }}>Type:</strong> {form.type || '—'}
                    </p>
                    <p className="text-[11px] mt-1 line-clamp-2" style={{ color:'hsl(var(--muted-foreground))' }}>
                      <strong style={{ color:'hsl(var(--foreground))' }}>Idea:</strong> {form.idea.slice(0, 80)}{form.idea.length > 80 ? '…' : ''}
                    </p>
                    <p className="text-[11px] mt-2 rounded-lg p-2"
                      style={{ backgroundColor:'hsl(142,70%,45%/0.1)', color:'hsl(142,70%,45%)' }}>
                      ✓ This will open WhatsApp with your idea pre-filled and send it directly to Kaizen.
                    </p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* ── Footer nav ── */}
        {!sent && (
          <div
            className="flex-shrink-0 flex items-center justify-between px-6 py-4 border-t"
            style={{ borderColor:'hsl(var(--border))', backgroundColor:'hsl(var(--background-light))' }}
          >
            <button
              onClick={() => step > 1 ? setStep(s => (s - 1) as Step) : onClose()}
              className="text-sm transition-colors px-4 py-2 rounded-lg"
              style={{ color:'hsl(var(--muted-foreground))' }}
            >
              {step > 1 ? '← Back' : 'Cancel'}
            </button>

            {step < 3 ? (
              <button
                onClick={() => setStep(s => (s + 1) as Step)}
                disabled={step === 1 ? !step1Valid : !step2Valid}
                className="btn-primary text-sm disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Continue →
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!form.budget}
                className="btn-primary text-sm disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z"/>
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.126.553 4.122 1.523 5.855L0 24l6.338-1.502A11.946 11.946 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.891 0-3.663-.519-5.18-1.423l-.37-.222-3.836.91.974-3.72-.242-.382A9.955 9.955 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
                </svg>
                Send via WhatsApp
              </button>
            )}
          </div>
        )}
      </div>
    </>
  );
}