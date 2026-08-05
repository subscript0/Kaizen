'use client';

import { useRef } from 'react';
import { usePathname } from 'next/navigation';
import gsap from 'gsap';
import { useIsoLayoutEffect } from '@/lib/motion';

/**
 * Route transition — a registration wipe.
 *
 * `template.tsx` remounts on every navigation, so each new route starts with
 * five full-height bands already covering the viewport. They lift off the top
 * edge one after another, left to right, each dragging a hairline accent rule
 * along its trailing edge — so what the eye actually follows is five
 * registration marks sweeping up the sheet, which is the same 1px the entire
 * site is drawn with, briefly given somewhere to go. The destination's name
 * sits centred in mono underneath while they clear.
 *
 * ── The three rules this had to satisfy ──────────────────────────────────
 *
 * 1. FAST. A visitor sees this on every single click, and anything they see
 *    that often reads as latency, not as craft. The bands are fully clear of
 *    the viewport in ~420ms; the old transition ran ~1500ms.
 *
 * 2. NEVER BLOCKS INPUT. The old stage held `pointer-events: auto` for its
 *    entire run, so the site was dead to clicks for a second and a half after
 *    every navigation. This one accepts pointer events only while the bands
 *    genuinely cover the page (~90ms, so a stray click cannot land on a link
 *    the visitor cannot see) and releases them the moment the wipe starts.
 *
 * 3. FAILS VISIBLE. This is the important one. The version this replaces
 *    rendered `{children}` at inline `opacity: 0` in the server HTML and
 *    relied entirely on a GSAP timeline to bring it back. Any break in that
 *    one path — a thrown error, an interrupted navigation, a backgrounded tab
 *    where requestAnimationFrame is throttled and GSAP simply never ticks —
 *    left the whole site invisible behind a click-blocking overlay, and there
 *    was no second path to recover it.
 *
 *    Four things changed:
 *
 *      · The content entrance is TRANSFORM ONLY. Nothing in this file can set
 *        the page's opacity to 0, so no failure can hide it. The worst case a
 *        dead JS path can produce is a page sitting 16px lower than it should.
 *      · The overlay is `display: none` in the markup and switched on by
 *        script. No JS means no overlay at all, rather than an overlay with
 *        nothing to remove it.
 *      · A backgrounded tab is detected up front (`visibilityState`) and skips
 *        the animation entirely, because that is the case where rAF-driven
 *        motion cannot be trusted to complete.
 *      · Everything runs inside try/catch, behind a watchdog timer, with the
 *        same `reveal()` on the unmount path. Four independent routes to a
 *        visible page.
 */

const BAND_COUNT = 5;
const BAND_DURATION = 0.27; // one band's travel
// 0.05s lead-in + 4 gaps × 0.03 + 0.27 travel ⇒ the last band is clear of the
// viewport at 440ms. The viewport itself stops being covered much earlier than
// that, when the *first* band clears at ~320ms.
const BAND_STAGGER = 0.03;
const CONTENT_RISE = 16; // px
const BLOCK_MS = 90; // pointer events swallowed only while genuinely opaque
const WATCHDOG_MS = 1200;

/**
 * The route this template last ran for. Module scope, so it survives remounts
 * but resets on a hard reload, and it answers two questions at once:
 *
 *  · `null` ⇒ this is the initial page load. A full-bleed wipe on arrival is
 *    pure delay in front of the thing the visitor came for, so the first paint
 *    is never transitioned. (This used to be justified by the Preloader
 *    covering that moment; the Preloader is gone and the rule is now simply
 *    that nothing should stand between arriving and reading.)
 *  · unchanged ⇒ the component remounted without the route changing, which is
 *    what React Strict Mode's double-invoke looks like in development. Not a
 *    navigation, so not a transition.
 */
let lastPath: string | null = null;

function routeLabel(pathname: string): string {
  if (!pathname || pathname === '/') return 'Index';
  const last = pathname.split('/').filter(Boolean).pop() ?? 'Index';
  return last.replace(/[-_]/g, ' ');
}

export default function Template({ children }: { children: React.ReactNode }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const bandsRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useIsoLayoutEffect(() => {
    const stage = stageRef.current;
    const bandWrap = bandsRef.current;
    const label = labelRef.current;
    const content = contentRef.current;
    if (!content) return;

    let watchdog = 0;
    let done = false;

    /**
     * The one function that matters: page on screen, overlay out of the way,
     * no inline residue left behind.
     */
    const reveal = () => {
      if (done) return;
      done = true;
      clearTimeout(watchdog);
      document.removeEventListener('visibilitychange', onHide);
      if (stage) {
        stage.style.display = 'none';
        stage.style.pointerEvents = 'none';
      }
      // `clearProps`, not `set({ y: 0 })`. GSAP leaves `transform:
      // translate(0px, 0px)` behind after a y-tween, and ANY transform other
      // than `none` makes this wrapper a stacking context — which traps every
      // overlay a page renders inside it. Wiping the inline styles is what
      // lets a page-level drawer or modal reach the root stacking context.
      gsap.set(content, { clearProps: 'all' });
      content.style.removeProperty('transform');
      content.style.removeProperty('will-change');
    };

    function onHide() {
      // A tab that goes to the background stops getting animation frames. Do
      // not leave the page mid-transition waiting for a tick that isn't coming.
      if (document.visibilityState !== 'visible') reveal();
    }

    try {
      const isNavigation = lastPath !== null && lastPath !== pathname;
      lastPath = pathname;

      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const hidden = document.visibilityState !== 'visible';

      // Nothing to animate over: the first paint is never transitioned, a
      // hidden tab cannot be trusted to tick, and either way the page must
      // just be there.
      if (!isNavigation || hidden || !stage || !bandWrap || !label) {
        reveal();
        return;
      }

      watchdog = window.setTimeout(reveal, WATCHDOG_MS);
      document.addEventListener('visibilitychange', onHide);

      // Switched on here rather than in the markup, so the server HTML never
      // contains a viewport-covering panel that JS is then required to remove.
      stage.style.display = 'block';
      stage.style.pointerEvents = 'auto';

      const bands = Array.from(bandWrap.children) as HTMLElement[];

      if (reduce) {
        // Fade only. No bands lifting, no travel, no rise on the content —
        // just the covering colour dissolving off the new page.
        gsap.set(bands, { yPercent: 0 });
        gsap.set(label, { opacity: 0 });
        stage.style.pointerEvents = 'none';
        const tl = gsap.timeline({ onComplete: reveal });
        tl.to(stage, { opacity: 0, duration: 0.2, ease: 'none' });
        return () => {
          clearTimeout(watchdog);
          tl.kill();
          stage.style.opacity = '1';
          reveal();
        };
      }

      gsap.set(bands, { yPercent: 0 });
      gsap.set(label, { opacity: 0, y: 5 });
      // Transform only — see the header. The page is never hidden.
      gsap.set(content, { y: CONTENT_RISE, willChange: 'transform' });

      const tl = gsap.timeline({ onComplete: reveal });

      tl
        // The destination announces itself, then gets out of the way.
        .to(label, { opacity: 1, y: 0, duration: 0.12, ease: 'power2.out' }, 0)
        .call(
          () => {
            stage.style.pointerEvents = 'none';
          },
          undefined,
          BLOCK_MS / 1000,
        )
        .to(
          bands,
          {
            yPercent: -100,
            duration: BAND_DURATION,
            ease: 'power4.inOut',
            stagger: BAND_STAGGER,
          },
          0.05,
        )
        .to(label, { opacity: 0, duration: 0.13, ease: 'power1.in' }, 0.1)
        .to(content, { y: 0, duration: 0.42, ease: 'power3.out' }, 0.08);

      return () => {
        clearTimeout(watchdog);
        tl.kill();
        reveal(); // never unmount leaving the next route shifted or covered
      };
    } catch (err) {
      // Failure contract: log, then get out of the way. A transition that
      // breaks must never be able to leave the page covered or shifted.
      console.error('[Template] transition failed, revealing the page anyway:', err);
      reveal();
    }
    // Re-runs on every navigation because `template.tsx` remounts; the
    // pathname is read fresh each time for the label.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div
        ref={stageRef}
        aria-hidden="true"
        className="fixed inset-0 z-[9995] overflow-hidden"
        style={{ display: 'none', pointerEvents: 'none' }}
      >
        <div ref={bandsRef} className="absolute inset-0 flex">
          {Array.from({ length: BAND_COUNT }).map((_, i) => (
            <div
              key={i}
              className="h-full flex-1 will-change-transform"
              style={{
                backgroundColor: 'hsl(var(--background))',
                // The trailing edge of each band IS a hairline rule — the same
                // 1px the whole site is drawn with. Five of them sweeping up
                // the page in sequence is the entire idea.
                borderBottom: '1px solid hsl(var(--primary))',
                // A hair of vertical overlap, so sub-pixel rounding between
                // neighbouring bands never shows a seam of the page behind.
                marginLeft: i === 0 ? 0 : '-0.5px',
              }}
            />
          ))}
        </div>

        <div
          ref={labelRef}
          className="pointer-events-none absolute inset-x-0 bottom-12 flex justify-center px-[var(--gutter)] font-mono text-[0.6875rem] font-medium uppercase tracking-[0.22em]"
          style={{ color: 'hsl(var(--foreground-muted))' }}
        >
          <span className="flex items-center gap-2.5">
            <span
              aria-hidden="true"
              className="inline-block h-1.5 w-1.5"
              style={{ backgroundColor: 'hsl(var(--primary))' }}
            />
            {routeLabel(pathname)}
          </span>
        </div>
      </div>

      <div ref={contentRef}>{children}</div>
    </>
  );
}
