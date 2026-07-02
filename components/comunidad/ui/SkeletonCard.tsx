"use client";

export function SkeletonCard({ lines = 3 }: { lines?: number }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 animate-pulse">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-11 h-11 rounded-xl bg-gray-200" />
        <div className="flex-1 space-y-2">
          <div className="h-3.5 bg-gray-200 rounded-lg w-1/3" />
          <div className="h-2.5 bg-gray-100 rounded-lg w-1/4" />
        </div>
      </div>
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className="h-3 bg-gray-100 rounded-lg"
            style={{ width: `${100 - i * 15}%` }}
          />
        ))}
      </div>
    </div>
  );
}

export function SkeletonList({ count = 4 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100 animate-pulse">
          <div className="w-10 h-10 rounded-xl bg-gray-200 shrink-0" />
          <div className="flex-1 space-y-1.5">
            <div className="h-3.5 bg-gray-200 rounded-lg w-2/3" />
            <div className="h-2.5 bg-gray-100 rounded-lg w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function SkeletonStat({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 animate-pulse">
          <div className="w-10 h-10 rounded-xl bg-gray-200 mb-3" />
          <div className="h-6 bg-gray-200 rounded-lg w-1/2 mb-1.5" />
          <div className="h-2.5 bg-gray-100 rounded-lg w-2/3" />
        </div>
      ))}
    </div>
  );
}
