"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import type { ScatterSueldoEmpleoProps } from "./ScatterSueldoEmpleoChart";

const ScatterChartDynamic = dynamic(
  () => import("./ScatterSueldoEmpleoChart"),
  {
    ssr: false,
    loading: () => (
      <Skeleton
        className="h-[420px] w-full rounded-xl border border-border bg-muted/60"
        aria-hidden="true"
      />
    ),
  },
);

export function ScatterSueldoEmpleo(props: ScatterSueldoEmpleoProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (typeof window.IntersectionObserver === "undefined") {
      const timer = window.setTimeout(() => setVisible(true), 0);
      return () => window.clearTimeout(timer);
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "150px" }
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref}>
      {visible ? (
        <ScatterChartDynamic {...props} />
      ) : (
        <Skeleton
          className="h-[420px] w-full rounded-xl border border-border bg-muted/60"
          aria-hidden="true"
        />
      )}
    </div>
  );
}
