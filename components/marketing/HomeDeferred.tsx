"use client";

import dynamic from "next/dynamic";

const LeadForm = dynamic(() => import("@/components/marketing/LeadForm"), {
  ssr: false,
  // El formulario ya no va al final: se reserva su alto para que al montarse
  // no empuje la FAQ ni los enlaces que quedan debajo.
  loading: () => <div aria-hidden className="min-h-[1400px] border-t border-line lg:min-h-[1035px]" />,
});

/** Below-fold client widgets — split out of the home critical JS path. */
export default function HomeDeferred() {
  return <LeadForm />;
}
