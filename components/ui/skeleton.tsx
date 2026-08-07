import { cn } from '@/lib/utils';

/**
 * Loading placeholders for the whole site.
 *
 * ── The rule these all follow ──────────────────────────────────────────────
 * A skeleton stands in for a SPECIFIC piece of layout at its real size. If the
 * placeholder and the content it replaces are different heights, the page
 * reflows the moment data lands and the visitor loses their place — which is
 * worse than the blank frame the skeleton was added to fix. So every helper
 * here takes its dimensions from the thing it is standing in for, and the
 * page-level compositions below mirror the real components line for line.
 *
 * ── Accessibility ──────────────────────────────────────────────────────────
 * Skeletons are decoration: they carry no information a screen reader can use,
 * and read as a burst of meaningless blank nodes if exposed. Every root here
 * is `aria-hidden` and marked `role="presentation"`; the components that use
 * them announce loading state separately through `aria-busy` / `role="status"`
 * on the real container. Do not "fix" this by adding alt text.
 *
 * The visual (wash, shimmer sweep, reduced-motion behaviour) lives on the
 * `.skeleton` class in app/globals.css.
 */

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Draw as a hairline plate instead of a filled wash — for card-shaped holes. */
  ruled?: boolean;
}

export function Skeleton({ className, ruled, ...props }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      role="presentation"
      className={cn('skeleton', ruled && 'skeleton--ruled', className)}
      {...props}
    />
  );
}

/**
 * A paragraph-shaped run of lines.
 *
 * The last line is short, because real prose almost never fills its final
 * line — a stack of identical full-width bars reads as a table, not as text.
 */
export function SkeletonText({
  lines = 3,
  className,
  lineClassName,
}: {
  lines?: number;
  className?: string;
  lineClassName?: string;
}) {
  return (
    <div aria-hidden="true" role="presentation" className={cn('flex flex-col gap-2.5', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn('h-3.5', i === lines - 1 ? 'w-[62%]' : 'w-full', lineClassName)}
        />
      ))}
    </div>
  );
}

/** An 11px mono micro-label. Sized to `.micro`'s line box, not to a guess. */
export function SkeletonMicro({ className }: { className?: string }) {
  return <Skeleton className={cn('h-2.5 w-24', className)} />;
}

/**
 * The masthead every inner route opens on — see components/PageMasthead.tsx.
 *
 * Heights track that component's real type: the spec rule is an 11px mono row
 * inside `py-3`, and the title is `clamp(2.75rem, 8vw, 5.5rem)` at 0.85
 * leading, so the bar is clamped the same way rather than pinned to one size.
 */
export function SkeletonMasthead({ standfirst = true }: { standfirst?: boolean }) {
  return (
    <header aria-hidden="true" role="presentation" className="relative pt-24 sm:pt-28">
      <div className="bleed-b">
        <div className="measure flex items-baseline justify-between gap-4 py-3">
          <SkeletonMicro className="w-40" />
          <SkeletonMicro className="w-32" />
        </div>
      </div>

      <div className="measure pt-10 sm:pt-14">
        <Skeleton className="h-[clamp(2.3rem,6.8vw,4.7rem)] w-[min(100%,52rem)]" />
        {standfirst ? (
          <SkeletonText lines={2} className="mt-6 max-w-2xl" />
        ) : null}
      </div>
    </header>
  );
}

/**
 * The site's OTHER opening grammar — /blog, /guestbook, /idea and the legal
 * routes do not use PageMasthead. They set a micro-label, then a
 * `.section-title`, then a `.text-lede`, inside a plain `.measure`.
 *
 * `pad` mirrors the differing top clearance those routes use: they float the
 * desktop navbar over the page and each one clears it by a different amount.
 */
export function SkeletonPageHeader({
  pad = 'pt-32 lg:pt-40',
  lede = 2,
}: {
  pad?: string;
  lede?: number;
}) {
  return (
    <div aria-hidden="true" role="presentation" className={cn('measure', pad)}>
      <SkeletonMicro className="mb-6 w-32" />
      {/* `.section-title` is clamp(2rem, 5vw, 3.75rem) at 0.95 leading. */}
      <Skeleton className="h-[clamp(1.9rem,4.75vw,3.56rem)] w-[min(100%,22rem)]" />
      <SkeletonText lines={lede} className="mt-6 max-w-2xl" />
    </div>
  );
}

/**
 * A ruled plate with a run of text in it — the shape `.card` and the crop-marked
 * frames share. `lines` should match what the real card holds.
 */
export function SkeletonCard({
  lines = 3,
  className,
}: {
  lines?: number;
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      role="presentation"
      className={cn('rule-t rule-b rule-l rule-r p-5', className)}
    >
      <div className="flex items-start justify-between gap-3">
        <Skeleton className="h-6 w-6" />
        <SkeletonMicro className="w-10" />
      </div>
      <SkeletonText lines={lines} className="mt-4" />
      <div className="rule-t mt-5 flex items-baseline justify-between gap-3 pt-3">
        <SkeletonMicro className="w-28" />
        <SkeletonMicro className="w-20" />
      </div>
    </div>
  );
}

/**
 * The four-up mono ledger readout GitHubStats renders. Also the right shape
 * for any row of counter tiles.
 */
export function SkeletonStatRow({ count = 4 }: { count?: number }) {
  return (
    <div
      aria-hidden="true"
      role="presentation"
      className="mb-12 grid grid-cols-2 gap-4 sm:grid-cols-4"
    >
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card p-4 sm:p-6">
          {/* Matches the real tile: a 26px/36px mono figure over an 11px label. */}
          <Skeleton className="mb-2.5 h-[1.625rem] w-20 sm:h-9 sm:w-24" />
          <SkeletonMicro className="w-full max-w-[7rem]" />
        </div>
      ))}
    </div>
  );
}

/**
 * A block of body copy under a section heading — the shape most static
 * sections on this site reduce to while their route chunk is in flight.
 */
export function SkeletonSection({
  lines = 4,
  className,
}: {
  lines?: number;
  className?: string;
}) {
  return (
    <section aria-hidden="true" role="presentation" className={cn('measure py-16', className)}>
      <SkeletonMicro />
      <Skeleton className="mt-4 h-9 w-[min(100%,26rem)]" />
      <SkeletonText lines={lines} className="mt-6 max-w-2xl" />
    </section>
  );
}
