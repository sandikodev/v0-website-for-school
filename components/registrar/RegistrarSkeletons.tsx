"use client";

export function RegistrarHeaderSkeleton() {
  return (
    <div className="mb-8 text-center">
      <div className="mx-auto h-8 w-64 animate-pulse rounded bg-slate-200" />
      <div className="mx-auto mt-2 h-4 w-80 animate-pulse rounded bg-slate-100" />
    </div>
  );
}

export function SearchCardSkeleton() {
  return (
    <div className="mb-6 rounded-2xl border border-slate-200 bg-white/70 p-6 shadow-sm">
      <div className="mb-4 h-20 w-full animate-pulse rounded-xl bg-slate-100" />
      <div className="h-12 w-full animate-pulse rounded-lg bg-slate-100" />
    </div>
  );
}

export function StatusCardSkeleton() {
  return <div className="h-16 w-full animate-pulse rounded-xl bg-slate-100" />;
}

export function InterviewListSkeleton({ items = 3 }: { items?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: items }).map((_, index) => (
        <div
           
          key={index}
          className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 animate-pulse rounded-2xl bg-slate-200" />
              <div className="space-y-2">
                <div className="h-4 w-40 animate-pulse rounded bg-slate-200" />
                <div className="flex gap-2">
                  <div className="h-4 w-28 animate-pulse rounded-full bg-slate-100" />
                  <div className="h-4 w-24 animate-pulse rounded-full bg-slate-100" />
                </div>
              </div>
            </div>
            <div className="h-7 w-24 animate-pulse rounded bg-slate-200" />
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            <div className="h-12 animate-pulse rounded-xl bg-slate-100" />
            <div className="h-12 animate-pulse rounded-xl bg-slate-100" />
            <div className="h-12 animate-pulse rounded-xl bg-slate-100" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function SubmissionDetailsSkeleton() {
  return (
    <div className="space-y-6">
      {/* Biodata */}
      <div className="rounded-2xl border border-slate-200 bg-white/70 p-4 shadow-sm">
        <div className="mb-3 h-5 w-48 animate-pulse rounded bg-slate-200" />
        <div className="grid gap-3 md:grid-cols-3">
          <div className="md:col-span-3 h-6 w-full animate-pulse rounded bg-slate-100" />
          <div className="h-6 w-full animate-pulse rounded bg-slate-100" />
          <div className="h-6 w-full animate-pulse rounded bg-slate-100" />
          <div className="h-6 w-full animate-pulse rounded bg-slate-100" />
        </div>
      </div>
      {/* Parents */}
      <div className="rounded-2xl border border-slate-200 bg-white/70 p-4 shadow-sm">
        <div className="mb-3 h-5 w-56 animate-pulse rounded bg-slate-200" />
        <div className="grid gap-3 md:grid-cols-2">
          <div className="h-6 w-full animate-pulse rounded bg-slate-100" />
          <div className="h-6 w-full animate-pulse rounded bg-slate-100" />
          <div className="h-6 w-full animate-pulse rounded bg-slate-100" />
        </div>
      </div>
      {/* Documents */}
      <div className="rounded-2xl border border-slate-200 bg-white/70 p-4 shadow-sm">
        <div className="mb-3 h-5 w-48 animate-pulse rounded bg-slate-200" />
        <div className="space-y-2">
          <div className="h-10 w-full animate-pulse rounded bg-slate-100" />
          <div className="h-10 w-full animate-pulse rounded bg-slate-100" />
        </div>
      </div>
    </div>
  );
}

export function NavigationSkeleton() {
  return <div className="h-12 w-full animate-pulse rounded-xl bg-slate-100" />;
}


