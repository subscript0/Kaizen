/**
 * UI click sound — synthesised, not shipped.
 *
 * A short filtered-noise transient plus a very quiet sine "body", ~50ms total.
 * That combination reads as a mechanical tick (a key switch, a shutter) rather
 * than a beep, which matters because this fires on every button AND every link
 * on the site. No audio asset, no network request, ~1kB of code.
 *
 * The AudioContext is created lazily inside the first real user gesture —
 * browsers refuse to start one before that, and constructing it eagerly leaves
 * a suspended context that never produces sound.
 */

const STORAGE_KEY = 'ui-sound';

/** ON by default. The mute toggle (SoundProvider) is how it gets turned off. */
const DEFAULT_ENABLED = true;

/** Two clicks closer together than this are one physical interaction. */
const MIN_INTERVAL_MS = 45;

type Listener = (enabled: boolean) => void;

let ctx: AudioContext | null = null;
let noise: AudioBuffer | null = null;
let master: GainNode | null = null;
let enabled = DEFAULT_ENABLED;
let hydrated = false;
let lastPlay = 0;
const listeners = new Set<Listener>();

// ── Preference ─────────────────────────────────────────────────────────────

/**
 * Reads localStorage once, then serves from memory. Called from a layout
 * effect, never during render, so it cannot desync SSR and client HTML.
 */
export function isSoundEnabled(): boolean {
  if (!hydrated && typeof window !== 'undefined') {
    hydrated = true;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw === 'on') enabled = true;
      else if (raw === 'off') enabled = false;
    } catch {
      /* private mode / storage disabled — fall back to the default */
    }
  }
  return enabled;
}

export function setSoundEnabled(next: boolean): void {
  enabled = next;
  hydrated = true;
  try {
    window.localStorage.setItem(STORAGE_KEY, next ? 'on' : 'off');
  } catch {
    /* preference just won't survive a reload */
  }
  listeners.forEach((fn) => fn(next));
}

export function subscribeSound(fn: Listener): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

// ── Engine ─────────────────────────────────────────────────────────────────

type Ctor = typeof AudioContext;

function getContext(): AudioContext | null {
  if (ctx) return ctx;
  if (typeof window === 'undefined') return null;
  const Ctor: Ctor | undefined =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: Ctor }).webkitAudioContext;
  if (!Ctor) return null;

  try {
    ctx = new Ctor();
  } catch {
    return null; // no output device, autoplay policy, etc.
  }

  // One master gain for the whole app — the per-click envelopes ride under it,
  // so the overall level is set in exactly one place.
  master = ctx.createGain();
  master.gain.value = 0.5;
  master.connect(ctx.destination);

  // ~60ms of white noise, generated once and reused by every click.
  const len = Math.max(1, Math.floor(ctx.sampleRate * 0.06));
  noise = ctx.createBuffer(1, len, ctx.sampleRate);
  const data = noise.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;

  return ctx;
}

/**
 * Play one click. Safe to call unconditionally — it no-ops when muted, when
 * called outside a gesture before the context exists, or when Web Audio is
 * unavailable. Never throws.
 */
export function playClick(): void {
  if (!isSoundEnabled()) return;

  const now = typeof performance !== 'undefined' ? performance.now() : Date.now();
  if (now - lastPlay < MIN_INTERVAL_MS) return; // de-dupe one physical click
  lastPlay = now;

  const ac = getContext();
  if (!ac || !master || !noise) return;

  // Safari/Chrome park the context as 'suspended' until a gesture resumes it.
  if (ac.state === 'suspended') void ac.resume().catch(() => {});

  try {
    const t = ac.currentTime;
    const DUR = 0.05; // 50ms — inside the 40–60ms brief

    // ── Transient: a bandpassed noise burst. This is what makes it a "tick". ──
    const src = ac.createBufferSource();
    src.buffer = noise;

    const band = ac.createBiquadFilter();
    band.type = 'bandpass';
    band.frequency.value = 1900;
    band.Q.value = 0.9;

    const nGain = ac.createGain();
    // Ramp up over 1.5ms rather than jumping — a hard start is itself an
    // audible pop, which would defeat the point of a subtle tick.
    nGain.gain.setValueAtTime(0.0001, t);
    nGain.gain.exponentialRampToValueAtTime(0.09, t + 0.0015);
    nGain.gain.exponentialRampToValueAtTime(0.0001, t + DUR);

    src.connect(band).connect(nGain).connect(master);
    src.start(t);
    src.stop(t + DUR);

    // ── Body: a very quiet falling sine so the tick has pitch, not just hiss. ──
    const osc = ac.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, t);
    osc.frequency.exponentialRampToValueAtTime(420, t + DUR);

    const oGain = ac.createGain();
    oGain.gain.setValueAtTime(0.0001, t);
    oGain.gain.exponentialRampToValueAtTime(0.035, t + 0.002);
    oGain.gain.exponentialRampToValueAtTime(0.0001, t + DUR);

    osc.connect(oGain).connect(master);
    osc.start(t);
    osc.stop(t + DUR);

    // Let the graph collect itself; nothing above is reused between clicks.
    src.onended = () => {
      src.disconnect();
      band.disconnect();
      nGain.disconnect();
    };
    osc.onended = () => {
      osc.disconnect();
      oGain.disconnect();
    };
  } catch {
    /* a failed click sound is never worth breaking an interaction over */
  }
}

/** Test seam / cleanup. */
export function closeSound(): void {
  try {
    void ctx?.close();
  } catch {
    /* already closed */
  }
  ctx = null;
  master = null;
  noise = null;
}
