'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useReveal } from '@/lib/motion';
import { LIMITS, MOODS, type GuestbookEntry, type MoodKey } from '@/lib/guestbook';

/**
 * The guestbook — a wall of notes, backed by a real table.
 *
 * ── The design ─────────────────────────────────────────────────────────────
 * Three things carry the personality, and each does real work:
 *
 *  1. A MOOD. Signing asks why you stopped by. It gives every note a glyph
 *     readable from across the page and gives the wall texture without a
 *     second typeface.
 *  2. A TALLY. The moods add up into a live readout, so the wall says
 *     something in aggregate before you have read a single note.
 *  3. A TILT. Cards sit a fraction off square and straighten on hover. The
 *     angles come from the card's index, never `Math.random()` — a random tilt
 *     differs between server and client and tears the tree down with a
 *     hydration mismatch. The angle rides the independent `rotate` property
 *     (see `.note-card` in globals.css) because `transform` on these elements
 *     is already claimed by the hover lift and by GSAP's scroll reveal.
 *
 * ── The data ───────────────────────────────────────────────────────────────
 * Notes live in Supabase and are read and written through `/api/guestbook`,
 * which owns all validation and rate limiting. This component never holds a
 * key and never talks to the database.
 *
 * The wall is fetched AFTER mount rather than server-rendered. That is a
 * deliberate trade: the page stays statically servable and fast, and the
 * guestbook — the one part that must be live — pays a spinner for it. It also
 * means a database outage degrades to "could not load the wall" instead of
 * failing the whole route.
 *
 * A post is optimistic: the note appears instantly and is rolled back if the
 * request fails, so a slow connection never feels like a dropped click.
 */

const MOOD_BY_KEY = Object.fromEntries(MOODS.map((m) => [m.key, m])) as Record<
  MoodKey,
  (typeof MOODS)[number]
>;

/** Deterministic, so server and client draw the same angles. */
const TILT = [-1.5, 1, -0.7, 1.6, -1.2, 0.6];

type Status = 'loading' | 'ready' | 'offline' | 'error';

/** Optimistic rows carry a temporary id until the real row comes back. */
interface WallEntry extends GuestbookEntry {
  pending?: boolean;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function GuestbookSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [entries, setEntries] = useState<WallEntry[]>([]);
  const [status, setStatus] = useState<Status>('loading');
  const [mood, setMood] = useState<MoodKey>('wave');
  const [form, setForm] = useState({ name: '', location: '', message: '', website: '' });
  const [error, setError] = useState<string | null>(null);
  const [posting, setPosting] = useState(false);
  const [posted, setPosted] = useState(false);

  const load = useCallback(async () => {
    setStatus('loading');
    try {
      const res = await fetch('/api/guestbook', { cache: 'no-store' });
      const data = await res.json();
      if (!res.ok) {
        setStatus('error');
        return;
      }
      setEntries(data.entries ?? []);
      setStatus(data.configured ? 'ready' : 'offline');
    } catch {
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // No `deps`: the header and form reveal on scroll once. Re-running this every
  // time a note arrives would re-hide and re-animate the whole section
  // underneath the person reading it.
  useReveal(sectionRef, '[data-reveal]', { y: 20, duration: 0.6, stagger: 0.06, start: 'top 88%' });

  const tally = useMemo(() => {
    const counts = new Map<MoodKey, number>();
    for (const e of entries) counts.set(e.mood, (counts.get(e.mood) ?? 0) + 1);
    return MOODS.map((m) => ({ ...m, count: counts.get(m.key) ?? 0 }));
  }, [entries]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (posting) return;

    const name = form.name.trim();
    const message = form.message.trim();

    // The old handler returned silently on an empty field, so the button
    // looked broken. Say what is missing instead.
    if (!name && !message) return setError('Add your name and a message.');
    if (!name) return setError('What should I call you?');
    if (!message) return setError('The message is empty.');

    setError(null);
    setPosting(true);

    const optimistic: WallEntry = {
      id: `pending-${Date.now()}`,
      name,
      location: form.location.trim() || null,
      mood,
      message,
      created_at: new Date().toISOString(),
      pending: true,
    };
    setEntries((prev) => [optimistic, ...prev]);

    try {
      const res = await fetch('/api/guestbook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          location: form.location.trim(),
          message,
          mood,
          website: form.website, // honeypot — always empty for a real visitor
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setEntries((prev) => prev.filter((x) => x.id !== optimistic.id));
        setError(data?.error ?? 'Could not save your note. Try again?');
        return;
      }

      // Swap the placeholder for the row the database actually stored.
      setEntries((prev) =>
        prev.map((x) => (x.id === optimistic.id ? { ...(data.entry as GuestbookEntry) } : x)),
      );
      setForm({ name: '', location: '', message: '', website: '' });
      setMood('wave');
      setPosted(true);
    } catch {
      setEntries((prev) => prev.filter((x) => x.id !== optimistic.id));
      setError('Network trouble — your note did not send.');
    } finally {
      setPosting(false);
    }
  };

  const remaining = LIMITS.message - form.message.length;
  const canPost = status === 'ready';

  return (
    /* Bottom padding is load-bearing on mobile: the tab bar in
       `components/Navbar.tsx` is `fixed inset-x-0 bottom-0` and eats the last
       ~80px of the viewport, so the submit has to clear it by a real margin. */
    <section
      ref={sectionRef}
      id="guestbook"
      className="pb-[max(120px,calc(104px+env(safe-area-inset-bottom)))] pt-10 md:pb-24 md:pt-16"
    >
      <div className="measure">
        <div className="mx-auto w-full max-w-[980px]">
          {/* ── Header ──────────────────────────────────────────────────── */}
          <header data-reveal>
            <p className="micro">05 — Guestbook</p>
            <h1 className="section-title mt-4 text-foreground">
              Sign the wall<span className="accent">.</span>
            </h1>
            <p className="text-lede mt-5 max-w-2xl">
              No account, no comment thread, no algorithm. Pick why you stopped by, leave a
              note, and it stays up here.
            </p>
          </header>

          {/* ── Mood tally ───────────────────────────────────────────────── */}
          <div data-reveal className="rule-t mt-10 pt-6">
            <div className="flex items-baseline justify-between gap-4">
              <span className="micro micro--strong">The wall so far</span>
              <span className="micro">
                {status === 'loading'
                  ? 'Loading…'
                  : `${entries.length} ${entries.length === 1 ? 'note' : 'notes'}`}
              </span>
            </div>

            <ul className="mt-5 grid grid-cols-3 gap-x-4 gap-y-5 sm:grid-cols-6">
              {tally.map((m) => (
                <li key={m.key} className="flex flex-col items-start gap-1">
                  <span aria-hidden="true" className="text-2xl leading-none md:text-3xl">
                    {m.glyph}
                  </span>
                  <span
                    className={`font-sans text-2xl font-black leading-none tracking-tight md:text-3xl ${
                      m.count > 0
                        ? 'text-[hsl(var(--primary-ink,var(--primary)))]'
                        : 'text-[hsl(var(--foreground)/0.22)]'
                    }`}
                  >
                    {String(m.count).padStart(2, '0')}
                  </span>
                  <span className="micro leading-tight">{m.label}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* ── The wall ─────────────────────────────────────────────────
              CSS columns rather than a grid: notes are different heights and
              this packs them without measuring anything or shipping a masonry
              library. `break-inside-avoid` stops a card splitting across a
              column boundary. */}
          {status === 'loading' ? (
            <ul aria-hidden="true" className="mt-8 columns-1 gap-4 sm:columns-2 lg:columns-3">
              {[0, 1, 2, 3].map((i) => (
                <li key={i} className="mb-4 break-inside-avoid">
                  <div
                    className="rule-t rule-b rule-l rule-r animate-pulse bg-[hsl(var(--foreground)/0.04)] p-5"
                    style={{ height: `${140 + (i % 3) * 34}px` }}
                  />
                </li>
              ))}
            </ul>
          ) : status === 'error' ? (
            <Placeholder
              glyph="⚠"
              title="Could not load the wall."
              note="The notes are safe — this is a connection problem."
              action={
                <button type="button" onClick={load} className="btn btn-outline mt-5" data-magnetic>
                  Try again
                </button>
              }
            />
          ) : entries.length === 0 ? (
            <Placeholder
              glyph="👋"
              title="Nothing up here yet."
              note={
                status === 'offline'
                  ? 'The guestbook is not connected yet.'
                  : 'Be the first name on the wall'
              }
            />
          ) : (
            <ul className="mt-8 columns-1 gap-4 sm:columns-2 lg:columns-3">
              {entries.map((entry, i) => {
                const m = MOOD_BY_KEY[entry.mood] ?? MOOD_BY_KEY.wave;
                return (
                  <li key={entry.id} className="mb-4 break-inside-avoid">
                    <article
                      style={{ '--tilt': `${TILT[i % TILT.length]}deg` } as React.CSSProperties}
                      className={`note-card group rule-t rule-b rule-l rule-r relative h-full bg-[hsl(var(--background-light)/0.35)] p-5 transition-[transform,border-color,background-color,opacity] duration-300 ease-[var(--ease-spring-2)] hover:-translate-y-1 hover:border-[hsl(var(--primary)/0.55)] hover:bg-[hsl(var(--background-light)/0.7)] motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${
                        entry.pending ? 'opacity-60' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <span
                          aria-hidden="true"
                          className="text-2xl leading-none transition-transform duration-300 ease-[var(--ease-spring-2)] group-hover:scale-110 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                        >
                          {m.glyph}
                        </span>
                        <span className="micro shrink-0">
                          {entry.pending ? 'Sending…' : String(entries.length - i).padStart(2, '0')}
                        </span>
                      </div>

                      <p className="mt-4 text-[0.95rem] leading-relaxed text-[hsl(var(--foreground)/0.9)]">
                        {entry.message}
                      </p>

                      <div className="rule-t mt-5 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 pt-3">
                        <span className="micro micro--strong">
                          {entry.name}
                          {entry.location ? (
                            <span className="text-[hsl(var(--foreground-muted))]">
                              {' · '}
                              {entry.location}
                            </span>
                          ) : null}
                        </span>
                        <span className="micro">{formatDate(entry.created_at)}</span>
                      </div>

                      {/* Sighted readers get the glyph; screen readers get words. */}
                      <span className="sr-only">{m.label}</span>
                    </article>
                  </li>
                );
              })}
            </ul>
          )}

          {/* ── Sign ─────────────────────────────────────────────────────── */}
          <div data-reveal className="rule-t mt-14 pt-8">
            <h2 className="text-xl font-semibold text-foreground md:text-2xl">
              {posted ? 'Add another?' : 'Leave a note'}
            </h2>

            <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-6" noValidate>
              {/* Mood picker. Real radios in a fieldset — arrow keys, labels and
                  focus rings all come for free; the chip is the label styled
                  off `:checked`. */}
              <fieldset className="min-w-0" disabled={!canPost || posting}>
                <legend className="micro mb-3">Why are you here?</legend>
                <div className="flex flex-wrap gap-2">
                  {MOODS.map((m) => (
                    <label
                      key={m.key}
                      className={`inline-flex select-none items-center gap-2 border px-3 py-2 text-xs transition-[background-color,border-color,transform] duration-200 ease-[var(--ease-spring-2)] focus-within:ring-2 focus-within:ring-[hsl(var(--primary)/0.5)] motion-reduce:transition-none ${
                        canPost && !posting ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'
                      } ${
                        mood === m.key
                          ? 'border-[hsl(var(--primary))] bg-[hsl(var(--primary)/0.12)] text-[hsl(var(--foreground))]'
                          : 'border-[var(--rule-color)] text-[hsl(var(--foreground-muted))] hover:border-[hsl(var(--foreground)/0.35)] hover:-translate-y-px motion-reduce:hover:translate-y-0'
                      }`}
                    >
                      <input
                        type="radio"
                        name="mood"
                        value={m.key}
                        checked={mood === m.key}
                        onChange={() => setMood(m.key)}
                        className="sr-only"
                      />
                      <span aria-hidden="true" className="text-base leading-none">
                        {m.glyph}
                      </span>
                      <span className="font-mono uppercase tracking-[0.08em]">{m.label}</span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="guest-name" className="micro mb-2 block">
                    Name
                  </label>
                  <input
                    type="text"
                    id="guest-name"
                    name="name"
                    autoComplete="name"
                    enterKeyHint="next"
                    maxLength={LIMITS.name}
                    disabled={!canPost || posting}
                    value={form.name}
                    onChange={(e) => {
                      setForm({ ...form, name: e.target.value });
                      setError(null);
                    }}
                    className="input w-full"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label htmlFor="guest-location" className="micro mb-2 block">
                    Where from <span className="text-[hsl(var(--foreground)/0.4)]">(optional)</span>
                  </label>
                  <input
                    type="text"
                    id="guest-location"
                    name="location"
                    autoComplete="country-name"
                    enterKeyHint="next"
                    maxLength={LIMITS.location}
                    disabled={!canPost || posting}
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    className="input w-full"
                    placeholder="Lagos, Berlin, anywhere"
                  />
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-baseline justify-between gap-3">
                  <label htmlFor="guest-message" className="micro">
                    Message
                  </label>
                  <span
                    className={`micro ${
                      remaining < 40 ? 'text-[hsl(var(--primary-ink,var(--primary)))]' : ''
                    }`}
                  >
                    {remaining}
                  </span>
                </div>
                <textarea
                  id="guest-message"
                  name="message"
                  autoComplete="off"
                  enterKeyHint="enter"
                  rows={4}
                  maxLength={LIMITS.message}
                  disabled={!canPost || posting}
                  value={form.message}
                  onChange={(e) => {
                    setForm({ ...form, message: e.target.value });
                    setError(null);
                  }}
                  className="input w-full"
                  placeholder="Say anything — a hello, a question, a bad pun."
                />
              </div>

              {/* Honeypot. Off-screen rather than `display:none`, which some
                  bots specifically skip. `tabIndex={-1}` and `aria-hidden`
                  keep it away from keyboards and screen readers. */}
              <div aria-hidden="true" className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden">
                <label htmlFor="guest-website">Website</label>
                <input
                  type="text"
                  id="guest-website"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  value={form.website}
                  onChange={(e) => setForm({ ...form, website: e.target.value })}
                />
              </div>

              {error ? (
                <p role="alert" className="micro micro--accent">
                  {error}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={!canPost || posting}
                className="btn btn-primary btn-fx-sweep min-h-[48px] w-full justify-center disabled:cursor-not-allowed disabled:opacity-50"
              >
                {posting ? 'Posting…' : 'Post message'}
                {posting ? null : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path
                      d="M4 12h15M13 6l6 6-6 6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="square"
                    />
                  </svg>
                )}
              </button>

              {status === 'offline' ? (
                <p className="micro">
                  The guestbook is not connected yet — set SUPABASE_URL and
                  SUPABASE_SERVICE_ROLE_KEY to switch it on.
                </p>
              ) : null}

              {/* Announced politely, without stealing focus. */}
              <p role="status" aria-live="polite" className="sr-only">
                {posted ? 'Your note was added to the wall.' : ''}
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Empty / error state — same crop-marked plate the rest of the site uses. */
function Placeholder({
  glyph,
  title,
  note,
  action,
}: {
  glyph: string;
  title: string;
  note: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="crop-frame rule-t rule-b rule-l rule-r relative mt-8 px-6 py-16 text-center">
      <span aria-hidden="true" className="crop crop--tl" />
      <span aria-hidden="true" className="crop crop--tr" />
      <span aria-hidden="true" className="crop crop--bl" />
      <span aria-hidden="true" className="crop crop--br" />
      <p aria-hidden="true" className="text-4xl">
        {glyph}
      </p>
      <p className="mt-4 text-lg font-semibold text-foreground">{title}</p>
      <p className="micro mt-2">{note}</p>
      {action}
    </div>
  );
}
