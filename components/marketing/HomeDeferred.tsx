"use client";

import dynamic from "next/dynamic";

const LeadForm = dynamic(() => import("@/components/marketing/LeadForm"), {
  ssr: false,
  loading: () => (
    <section
      aria-busy="true"
      aria-label="Cargando formulario de asesoría"
      className="border-t border-[var(--h-border)] bg-[var(--h-bg)] py-16 lg:py-24"
    >
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-10 px-4 sm:px-6 lg:grid-cols-12 lg:items-start lg:px-8 xl:gap-14">
        <div className="lg:col-span-5">
          <p className="text-sm font-medium text-[var(--h-muted)]">
            Cargando formulario de asesoría...
          </p>
          <div className="mt-4 h-10 w-3/4 rounded-lg bg-[var(--h-wash)]" />
          <div className="mt-4 h-4 w-full rounded bg-[var(--h-wash)]" />
          <div className="mt-2 h-4 w-5/6 rounded bg-[var(--h-wash)]" />
        </div>
        <div className="min-h-[520px] rounded-2xl border border-[var(--h-border-strong)] bg-[var(--h-surface)] p-6 sm:p-8 lg:col-span-7">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="h-[72px] rounded-xl bg-[var(--h-wash)]" />
            <div className="h-[72px] rounded-xl bg-[var(--h-wash)]" />
          </div>
          <div className="mt-5 h-[72px] rounded-xl bg-[var(--h-wash)]" />
          <div className="mt-5 h-32 rounded-xl bg-[var(--h-wash)]" />
          <div className="mt-5 h-28 rounded-xl bg-[var(--h-wash)]" />
          <div className="mt-6 h-12 w-56 rounded-lg bg-[var(--h-wash)]" />
        </div>
      </div>
    </section>
  ),
});

/** Below-fold client widgets: split out of the home critical JS path. */
export default function HomeDeferred() {
  return <LeadForm />;
}
