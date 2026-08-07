import { Skeleton, SkeletonMasthead, SkeletonMicro, SkeletonText } from '@/components/ui/skeleton';

/** /contact — masthead, then the statement and the form. */
export default function Loading() {
  return (
    <div aria-busy="true" aria-label="Loading">
      <SkeletonMasthead />

      <div className="measure py-16">
        <SkeletonText lines={3} className="max-w-2xl" />

        <div className="mt-14 grid grid-cols-1 gap-x-[var(--gutter)] gap-y-6 md:grid-cols-2">
          {/* Name + email sit side by side, message spans both. */}
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i}>
              <SkeletonMicro className="mb-2 w-20" />
              <Skeleton ruled className="h-12 w-full" />
            </div>
          ))}
          <div className="md:col-span-2">
            <SkeletonMicro className="mb-2 w-24" />
            <Skeleton ruled className="h-40 w-full" />
          </div>
        </div>

        <Skeleton className="mt-6 h-12 w-40" />
      </div>
    </div>
  );
}
