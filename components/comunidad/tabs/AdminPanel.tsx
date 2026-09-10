"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/** @deprecated El panel vive ahora en /admin con rutas por sección. */
export default function AdminPanel() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/admin");
  }, [router]);
  return null;
}
