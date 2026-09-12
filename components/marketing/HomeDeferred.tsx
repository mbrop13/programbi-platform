"use client";

import dynamic from "next/dynamic";

const LeadForm = dynamic(() => import("@/components/marketing/LeadForm"), { ssr: false });

/** Below-fold client widgets — split out of the home critical JS path. */
export default function HomeDeferred() {
  return <LeadForm />;
}
