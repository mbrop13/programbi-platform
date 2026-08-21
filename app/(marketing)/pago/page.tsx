import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import PagoClient from "./PagoClient";

export const metadata: Metadata = {
  title: "Inscripción | ProgramBI",
  description: "Selecciona tus cursos, revisa fechas disponibles y completa tu inscripción en ProgramBI.",
};

export default async function PagoPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  return (
    <Suspense fallback={
      <section className="flex min-h-[60vh] items-center justify-center bg-canvas">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-line border-t-ink" />
          <span className="text-sm text-mute">Cargando…</span>
        </div>
      </section>
    }>
      <PagoClient />
    </Suspense>
  );
}
