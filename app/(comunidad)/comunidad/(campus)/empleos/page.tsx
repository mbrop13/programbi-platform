import { Suspense } from "react";
import EmpleosTab from "@/components/comunidad/tabs/EmpleosTab";

export default function EmpleosPage() {
  return (
    <Suspense fallback={<div className="h-40 rounded-xl border border-border bg-surface animate-pulse" />}>
      <EmpleosTab />
    </Suspense>
  );
}
