"use client";

import { useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import StatusPage from "@/components/shared/StatusPage";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("UI error:", error);
  }, [error]);

  return (
    <>
      <Navbar />
      <main>
        <StatusPage
          code="500"
          title="No pudimos cargar esta página"
          description="Ocurrió un error inesperado. Reintenta o vuelve al inicio."
          actions={
            <>
              <button
                type="button"
                onClick={() => reset()}
                className="inline-flex h-12 items-center rounded-full bg-ink px-7 text-base font-semibold text-canvas transition-transform active:scale-[0.98]"
              >
                Reintentar
              </button>
              <Link
                href="/"
                className="inline-flex h-12 items-center rounded-full border border-line bg-paper px-7 text-base font-medium text-ink no-underline transition-colors hover:bg-wash active:scale-[0.98]"
              >
                Ir al inicio
              </Link>
            </>
          }
        />
      </main>
      <Footer />
    </>
  );
}
