"use client";

import dynamic from "next/dynamic";

const LeadForm = dynamic(() => import("@/components/marketing/LeadForm"), {
  ssr: false,
  // Reserva el alto aproximado de la sección de cotización para evitar saltos
  // de layout al hidratar el formulario debajo del pliegue.
  loading: () => (
    <section
      aria-busy="true"
      aria-label="Formulario de cotización"
      className="border-t border-border bg-bg"
    >
      <div className="mx-auto flex min-h-[680px] max-w-[1440px] items-center justify-center px-4 py-16 sm:px-6 lg:px-8 xl:px-10">
        <p className="text-sm text-text-muted">Cargando formulario de cotización...</p>
      </div>
    </section>
  ),
});

/** Below-fold client widgets split out of the home critical JS path. */
export default function HomeDeferred() {
  return <LeadForm />;
}
