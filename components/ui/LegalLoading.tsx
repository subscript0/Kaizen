import { Skeleton, SkeletonMicro, SkeletonPageHeader, SkeletonText } from '@/components/ui/skeleton';

/**
 * The loading shell shared by /privacy-policy and /terms-conditions.
 *
 * Both pages are the same document: a header, then a run of `.rule-t` clause
 * rows laid out `[4rem_1fr]` above `md` — a hanging two-digit index in the
 * left column and the clause body in the right. The only thing that differs
 * is how many clauses there are, so that is the only prop.
 */
export default function LegalLoading({ clauses }: { clauses: number }) {
  return (
    <div aria-busy="true" aria-label="Loading">
      <SkeletonPageHeader />

      <div className="measure mt-12">
        {Array.from({ length: clauses }).map((_, i) => (
          <div
            key={i}
            className="rule-t grid grid-cols-1 gap-x-[var(--gutter)] gap-y-3 py-8 md:grid-cols-[4rem_1fr]"
          >
            <SkeletonMicro className="w-8" />
            <div>
              <Skeleton className="h-5 w-[min(100%,16rem)]" />
              {/* Clause bodies run long and uneven; alternating the count keeps
                  the column from reading as a striped pattern. */}
              <SkeletonText lines={i % 3 === 0 ? 4 : 3} className="mt-4" />
            </div>
          </div>
        ))}
      </div>

      <div className="measure mt-12 flex flex-wrap gap-3 pb-24">
        <Skeleton className="h-11 w-44" />
        <Skeleton className="h-11 w-36" />
      </div>
    </div>
  );
}
