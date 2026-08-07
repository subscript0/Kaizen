import { Skeleton, SkeletonMicro, SkeletonText } from '@/components/ui/skeleton';

/** /idea — back link, header, then the three-step brief form. */
export default function Loading() {
  return (
    <section
      aria-busy="true"
      aria-label="Loading"
      className="min-h-[100dvh] pb-[max(120px,calc(104px+env(safe-area-inset-bottom)))] pt-24 md:pb-24 md:pt-32"
    >
      <div className="measure">
        <div className="mx-auto w-full max-w-2xl">
          <SkeletonMicro className="w-32" />

          <div className="mt-8">
            <SkeletonMicro className="w-28" />
            {/* `.text-display` — clamp(2.5rem, 7vw, 5.75rem) at 0.92 leading. */}
            <Skeleton className="mt-4 h-[clamp(2.3rem,6.4vw,5.3rem)] w-[min(100%,20rem)]" />
            <Skeleton className="mt-2 h-[clamp(2.3rem,6.4vw,5.3rem)] w-[min(100%,14rem)]" />
            <SkeletonText lines={3} className="mt-6" />
          </div>

          <div className="mt-12">
            {/* Stepper */}
            <div className="flex items-center gap-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-1.5 flex-1" />
              ))}
            </div>

            <div className="mt-8 flex flex-col gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i}>
                  <SkeletonMicro className="mb-2 w-24" />
                  <Skeleton ruled className="h-12 w-full" />
                </div>
              ))}
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
