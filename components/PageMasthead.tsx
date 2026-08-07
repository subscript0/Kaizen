import type { CSSProperties, ReactNode } from 'react';

interface PageMastheadProps {
  /** Two-digit section number, e.g. "01" — the masthead is always section one. */
  index: string;
  /** Uppercase metadata label, e.g. "Projects". */
  label: string;
  /** Split on the first space: the first word is ink, the rest a tonal tint. */
  title: string;
  /** Forwarded to the <h1> so `aria-labelledby` can target it. */
  titleId?: string;
  /** Right-hand micro-label on the spec rule. */
  meta?: string;
  /** Optional one-line standfirst under the title. */
  children?: ReactNode;
}

/**
 * The opening of an inner route — /about, /projects, /skills, /contact.
 *
 * ── What this replaces, and why ─────────────────────────────────────────────
 *
 * Each of those four routes used to open on `ScrollExpandMedia`: a plate
 * centred in a 100dvh sticky stage, held there by a 230–290dvh runway, with
 * "Scroll to expand" underneath. It was a genuinely nice piece of motion and it
 * cost the site its navigation. A visitor landing on /projects got a full
 * screen with no project on it, and had to scroll roughly two-and-a-half
 * viewports before the index appeared — which is what "hard to navigate" meant.
 * Four routes each spending their first screen on a title is also why the site
 * read as long: ~10dvh of masthead was buying ~290dvh of runway.
 *
 * What replaces it is an ordinary document header. Same grammar as the home
 * page's opening — a bleeding hairline with metadata straddling it, then the
 * title — at a size that leaves the rest of the first screen for the content
 * the page is actually about. No runway, no pin, no scroll cue.
 *
 * The tonal split on the title is kept from the old lockup: first word in ink,
 * the remainder at 45%. It was a colour split (`--primary`, i.e. a full-size
 * word in the accent) until the palette pass; as a tint it survives whatever
 * accent the visitor picks.
 *
 * `pt-24` clears the desktop navbar, which floats at `top-4` and is ~56px tall.
 * The old hero could ignore that because it owned the viewport edge to edge.
 */
export default function PageMasthead({
  index,
  label,
  title,
  titleId,
  meta = 'Full stack developer',
  children,
}: PageMastheadProps) {
  const [lead, ...tail] = title.trim().split(/\s+/);
  const trail = tail.join(' ');

  return (
    <header className="relative pt-24 sm:pt-28">
      {/* Spec rule — bleeds the full width, its contents held to the measure.
          `.step-in` goes on the INNER `.measure`, never on the `.bleed-b`
          wrapper: that wrapper's whole job is the hairline that runs past the
          measure to both viewport edges, and `clip-path` on it would cut the
          rule back to the content column. */}
      <div className="bleed-b">
        <div
          className="step-in measure flex items-baseline justify-between gap-4 py-3"
          style={{ '--step': 0 } as CSSProperties}
        >
          <span className="micro micro--ruled">
            <span className="micro--strong">{index}</span>
            <span>{label}</span>
          </span>
          <span className="micro">{meta}</span>
        </div>
      </div>

      <div className="measure pt-10 sm:pt-14">
        {/* Was `.animate-fade-rise` — one soft move for the whole lockup. The
            masthead now arrives in steps (wipe, overshoot, settle) and the
            three rows are offset by `--step`, so the eye reads spec rule →
            title → standfirst in that order instead of seeing one blur. */}
        <h1
          id={titleId}
          className="step-in font-sans text-[clamp(2.75rem,8vw,5.5rem)] font-black uppercase leading-[0.85] tracking-[-0.03em]"
          style={{ '--step': 1 } as CSSProperties}
        >
          <span className="text-[hsl(var(--foreground))]">{lead}</span>
          {trail ? (
            <span className="text-[hsl(var(--foreground)/0.45)]"> {trail}</span>
          ) : null}
        </h1>

        {children ? (
          <div className="step-in mt-6" style={{ '--step': 2 } as CSSProperties}>
            {children}
          </div>
        ) : null}
      </div>
    </header>
  );
}
