"use client";

import { useEffect, useState, type ComponentType, type ReactNode } from "react";
import type { JobPublic } from "@/lib/jobs/types";
import type { VacantesFilters } from "@/components/empleos/vacantes-types";

type ClientProps = {
  initialJobs: JobPublic[];
  initialTotal: number;
  initialFilters: VacantesFilters;
};

/**
 * SSR only renders `children` (server board). The interactive client is
 * imported in useEffect so Next never SSRs useRouter/usePathname on Vercel.
 */
export default function VacantesHydrate({
  children,
  initialJobs,
  initialTotal,
  initialFilters,
}: ClientProps & { children: ReactNode }) {
  const [Client, setClient] = useState<ComponentType<ClientProps> | null>(null);

  useEffect(() => {
    let cancelled = false;
    void import("@/components/empleos/EmpleosPageClient").then((mod) => {
      if (!cancelled) setClient(() => mod.default);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!Client) return children;
  return (
    <Client
      initialJobs={initialJobs}
      initialTotal={initialTotal}
      initialFilters={initialFilters}
    />
  );
}
