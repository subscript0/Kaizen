import type { ReactNode } from 'react';

interface SectionHeadProps {
  /** Two-digit section number, e.g. "02". Rendered in the metadata rail. */
  index: string;
  /** Uppercase metadata label, e.g. "APPROACH". Sits opposite the number. */
  label: string;
  title: ReactNode;
  lede?: ReactNode;
  /** Optional CTA, pinned to the right column on wide screens. */
  action?: ReactNode;
  /** Forwarded to the <h2> so `aria-labelledby` on the section keeps working. */
  id?: string;
  className?: string;
  /**
   * Tags the root with `data-reveal` so the section's `useReveal` GSAP stagger
   * picks it up. The whole header animates as one block, which reads better
   * than staggering the rail, heading and lede separately.
   */
  reveal?: boolean;
}

/**
 * The section header used across every page.
 *
 * Three columns: a metadata rail (number + label) capped by its own short
 * hairline, the heading block, and an action pinned to the right edge. The
 * short rule over just the rail is what makes the grid legible — it marks the
 * column boundary without drawing a box around anything.
 *
 * Collapses to a single column under 900px, where the rail's rule becomes a
 * full-width cap over the whole header instead.
 */
export default function SectionHead({
  index,
  label,
  title,
  lede,
  action,
  id,
  className = '',
  reveal = false,
}: SectionHeadProps) {
  return (
    <div className={`section-head ${className}`} {...(reveal ? { 'data-reveal': '' } : {})}>
      <div className="section-head__meta">
        <span className="micro micro--strong">{index}</span>
        <span className="micro">{label}</span>
      </div>

      <div>
        <h2 id={id} className="section-title text-[hsl(var(--foreground))]">
          {title}
        </h2>
        {lede ? <p className="text-lede mt-5">{lede}</p> : null}
      </div>

      {action ? <div className="flex items-start lg:justify-end">{action}</div> : null}
    </div>
  );
}
