/**
 * Guestbook storage.
 *
 * ── Why plain `fetch` and not `@supabase/supabase-js` ──────────────────────
 * The only two things this needs are "insert a row" and "read the last N rows".
 * Supabase exposes both over PostgREST as ordinary HTTP, so the client library
 * would add ~40kB and a dependency to save about fifteen lines. `fetch` also
 * runs unchanged on Node, Edge and during a build, which the SDK does not
 * always do cleanly.
 *
 * ── Why the SERVICE ROLE key, and why this file is server-only ─────────────
 * Neither env var is `NEXT_PUBLIC_`, so neither is ever bundled for the
 * browser. Every read and write goes through `app/api/guestbook/route.ts`,
 * which is the only gatekeeper — it validates, rate-limits and strips fields
 * before anything reaches the table.
 *
 * The alternative (anon key in the browser + RLS policies) puts an
 * insert-permitted key on every visitor's machine and makes the policy the only
 * thing standing between a bot and the table. Keeping the key on the server
 * means the table can have RLS on with NO policies at all: nothing but this
 * code can touch it.
 *
 * ── Setup ──────────────────────────────────────────────────────────────────
 * Run this once in the Supabase SQL editor, then set the two env vars:
 *
 *   create table public.guestbook (
 *     id          uuid primary key default gen_random_uuid(),
 *     name        text        not null,
 *     location    text,
 *     mood        text        not null,
 *     message     text        not null,
 *     created_at  timestamptz not null default now()
 *   );
 *
 *   create index guestbook_created_at_idx on public.guestbook (created_at desc);
 *
 *   -- RLS on with no policies: the service role bypasses it, everyone else is
 *   -- denied. Do NOT add a permissive policy unless you also stop using the
 *   -- service role key.
 *   alter table public.guestbook enable row level security;
 */

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const TABLE = 'guestbook';
/** Never let a slow database hold a request open indefinitely. */
const TIMEOUT_MS = 8000;

/** One source of truth — the API validates against this and the UI renders it. */
export const MOODS = [
  { key: 'wave', glyph: '👋', label: 'Just saying hi' },
  { key: 'fire', glyph: '🔥', label: 'Love your work' },
  { key: 'idea', glyph: '💡', label: 'Got an idea' },
  { key: 'work', glyph: '🤝', label: 'Let’s work' },
  { key: 'ship', glyph: '🚀', label: 'Ship it' },
  { key: 'coffee', glyph: '☕', label: 'Coffee sometime' },
] as const;

export type MoodKey = (typeof MOODS)[number]['key'];

export const MOOD_KEYS: readonly MoodKey[] = MOODS.map((m) => m.key);

export const LIMITS = { name: 40, location: 40, message: 400 } as const;

/** How many notes the wall shows. */
export const PAGE_SIZE = 100;

export interface GuestbookEntry {
  id: string;
  name: string;
  location: string | null;
  mood: MoodKey;
  message: string;
  created_at: string;
}

export interface NewEntry {
  name: string;
  location?: string | null;
  mood: MoodKey;
  message: string;
}

/**
 * False when the env vars are absent. The page has to keep working in that
 * state — a portfolio that 500s because a side feature is unconfigured is a
 * worse outcome than a guestbook that politely says it is offline.
 */
export function isConfigured(): boolean {
  return Boolean(SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY);
}

function headers(extra: Record<string, string> = {}): Record<string, string> {
  return {
    apikey: SUPABASE_SERVICE_ROLE_KEY as string,
    Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
    ...extra,
  };
}

function endpoint(query = ''): string {
  return `${SUPABASE_URL}/rest/v1/${TABLE}${query}`;
}

export class GuestbookError extends Error {
  constructor(message: string, readonly status = 500) {
    super(message);
    this.name = 'GuestbookError';
  }
}

/** Newest first. */
export async function listEntries(limit = PAGE_SIZE): Promise<GuestbookEntry[]> {
  if (!isConfigured()) throw new GuestbookError('Guestbook is not configured', 503);

  const capped = Math.min(Math.max(1, limit), PAGE_SIZE);
  const res = await fetch(
    endpoint(`?select=id,name,location,mood,message,created_at&order=created_at.desc&limit=${capped}`),
    { headers: headers(), signal: AbortSignal.timeout(TIMEOUT_MS), cache: 'no-store' },
  );

  if (!res.ok) {
    throw new GuestbookError(`Could not read the guestbook (${res.status})`, 502);
  }
  return (await res.json()) as GuestbookEntry[];
}

export async function createEntry(entry: NewEntry): Promise<GuestbookEntry> {
  if (!isConfigured()) throw new GuestbookError('Guestbook is not configured', 503);

  const res = await fetch(endpoint(), {
    method: 'POST',
    headers: headers({
      'Content-Type': 'application/json',
      // Ask PostgREST to hand back the inserted row so the UI can render the
      // real record — with the database's own id and timestamp — instead of
      // guessing what was stored.
      Prefer: 'return=representation',
    }),
    body: JSON.stringify({
      name: entry.name,
      location: entry.location ?? null,
      mood: entry.mood,
      message: entry.message,
    }),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });

  if (!res.ok) {
    throw new GuestbookError(`Could not save the note (${res.status})`, 502);
  }

  const rows = (await res.json()) as GuestbookEntry[];
  const row = rows?.[0];
  if (!row) throw new GuestbookError('The note was not returned after saving', 502);
  return row;
}
