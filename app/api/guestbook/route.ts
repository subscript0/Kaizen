import { NextResponse } from 'next/server';
import {
  createEntry,
  GuestbookError,
  isConfigured,
  LIMITS,
  listEntries,
  MOOD_KEYS,
  PAGE_SIZE,
  type MoodKey,
} from '@/lib/guestbook';

/**
 * The guestbook API — the only thing allowed to touch the table.
 *
 * `lib/guestbook.ts` holds a service-role key, so this handler is the entire
 * security boundary. Everything a visitor sends is treated as hostile until it
 * has been through `clean()` and the checks below.
 *
 * Node runtime, not Edge: the in-memory rate limiter below wants a process that
 * lives longer than a single request, and `AbortSignal.timeout` behaves
 * consistently here.
 */
export const runtime = 'nodejs';
// Every response is per-request. Without this, GET would be statically
// optimised at build time and the wall would be frozen at whatever it held the
// moment the site was deployed.
export const dynamic = 'force-dynamic';

/* ── Rate limiting ────────────────────────────────────────────────────────
   In-memory and therefore per-instance and best-effort: serverless spreads
   requests across instances that do not share this Map, and a cold start
   resets it. It is not a defence against a determined attacker — it is there
   to stop one bored person emptying a paste buffer into the wall. Real
   protection would need a shared store (Upstash, Supabase itself) and is worth
   adding only if this ever gets abused.
   ───────────────────────────────────────────────────────────────────────── */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_POSTS_PER_WINDOW = 3;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);

  if (recent.length >= MAX_POSTS_PER_WINDOW) {
    hits.set(ip, recent);
    return true;
  }

  recent.push(now);
  hits.set(ip, recent);

  // Opportunistic sweep so the Map cannot grow without bound on a long-lived
  // instance. Cheap, and only runs on writes.
  if (hits.size > 500) {
    for (const [key, times] of hits) {
      if (!times.some((t) => now - t < WINDOW_MS)) hits.delete(key);
    }
  }
  return false;
}

function clientIp(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for');
  // Vercel appends proxies, so the client is the FIRST entry, not the last.
  if (forwarded) return forwarded.split(',')[0].trim();
  return req.headers.get('x-real-ip') ?? 'unknown';
}

/**
 * Collapse whitespace and drop control characters.
 *
 * React escapes on render, so this is not about XSS — it is about a note that
 * is 400 newlines, or one carrying zero-width joiners to fake a blank entry,
 * blowing a hole in the layout of the wall.
 */
function clean(value: unknown, max: number): string {
  if (typeof value !== 'string') return '';
  return (
    value
      // C0 + C1 control ranges, the zero-width characters and the BOM.
      // Written as \u escapes, not literal bytes, so the intent survives a
      // copy-paste and the source stays plain ASCII.
      // eslint-disable-next-line no-control-regex
      .replace(/[\u0000-\u001F\u007F-\u009F\u200B-\u200D\uFEFF]/g, ' ')
      // Newlines and tabs went with the range above; this folds what is left
      // so a note cannot be padded out with long runs of spaces.
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, max)
  );
}

export async function GET() {
  if (!isConfigured()) {
    return NextResponse.json(
      { entries: [], configured: false, error: 'The guestbook is not connected yet.' },
      { status: 200 },
    );
  }

  try {
    const entries = await listEntries(PAGE_SIZE);
    return NextResponse.json({ entries, configured: true });
  } catch (err) {
    const status = err instanceof GuestbookError ? err.status : 500;
    console.error('[guestbook] read failed:', err);
    // The wall being unreachable must not read as "there are no notes" — the
    // client shows a retry rather than an empty state.
    return NextResponse.json(
      { entries: [], configured: true, error: 'Could not load the wall.' },
      { status },
    );
  }
}

export async function POST(req: Request) {
  if (!isConfigured()) {
    return NextResponse.json({ error: 'The guestbook is not connected yet.' }, { status: 503 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Malformed request.' }, { status: 400 });
  }

  // Honeypot. A real visitor never sees this field, so anything in it is a bot.
  // Answer 200 so the bot believes it succeeded and does not go looking for a
  // different way in.
  if (clean(body.website, 100)) {
    return NextResponse.json({ ok: true, entry: null });
  }

  const name = clean(body.name, LIMITS.name);
  const location = clean(body.location, LIMITS.location);
  const message = clean(body.message, LIMITS.message);
  const mood = body.mood;

  if (!name) return NextResponse.json({ error: 'Add your name.' }, { status: 400 });
  if (!message) return NextResponse.json({ error: 'The message is empty.' }, { status: 400 });
  if (typeof mood !== 'string' || !MOOD_KEYS.includes(mood as MoodKey)) {
    return NextResponse.json({ error: 'Pick why you stopped by.' }, { status: 400 });
  }

  if (rateLimited(clientIp(req))) {
    return NextResponse.json(
      { error: 'That is a few notes in a row — try again a bit later.' },
      { status: 429 },
    );
  }

  try {
    const entry = await createEntry({
      name,
      location: location || null,
      mood: mood as MoodKey,
      message,
    });
    return NextResponse.json({ ok: true, entry }, { status: 201 });
  } catch (err) {
    const status = err instanceof GuestbookError ? err.status : 500;
    console.error('[guestbook] write failed:', err);
    return NextResponse.json({ error: 'Could not save your note. Try again?' }, { status });
  }
}
