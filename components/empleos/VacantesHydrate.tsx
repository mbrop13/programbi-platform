"use client";

import { useEffect, useState, type ReactNode } from "react";
import dynamic from "next/dynamic";
import type { VacantesFilters } from "@/components/empleos/EmpleosPageClient";
import type { JobPublic } from "@/lib/jobs/types";

const EmpleosPageClient = dynamic(
  () => import("@/components/empleos/EmpleosPageClient"),
  { ssr: false }
);

/**
 * SSR paints `children` (server board). After mount, swap to the interactive
 * client so useRouter/usePathname never run during Vercel SSR.
 */
export default function VacantesHydrate({
  children,
  initialJobs,
  initialTotal,
  initialFilters,
}: {
  children: ReactNode;
  initialJobs: JobPublic[];
  initialTotal: number;
  initialFilters: VacantesFilters;
}) {
  const [live, setLive] = useState(false);
  useEffect(() => setLive(true), []);
  if (!live) return children;
  return (
    <EmpleosPageClient
      initialJobs={initialJobs}
      initialTotal={initialTotal}
      initialFilters={initialFilters}
    />
  );
}
