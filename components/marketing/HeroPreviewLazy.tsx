"use client";

import { useEffect, useState, type ComponentType } from "react";
import HeroPreviewShell from "@/components/marketing/HeroPreviewShell";

export default function HeroPreviewLazy() {
  const [Preview, setPreview] = useState<ComponentType | null>(null);

  useEffect(() => {
    let alive = true;
    const load = () => {
      import("@/components/marketing/HeroPreview").then((mod) => {
        if (alive) setPreview(() => mod.default);
      });
    };
    const ric = window.requestIdleCallback?.bind(window);
    if (ric) {
      const id = ric(load, { timeout: 1800 });
      return () => {
        alive = false;
        window.cancelIdleCallback?.(id);
      };
    }
    const t = window.setTimeout(load, 1);
    return () => {
      alive = false;
      window.clearTimeout(t);
    };
  }, []);

  if (!Preview) return <HeroPreviewShell />;
  return <Preview />;
}
