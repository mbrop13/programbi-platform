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
      <section className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-gray-200 border-t-blue-500 rounded-full animate-spin" />
          <span className="text-sm text-gray-400">Cargando...</span>
        </div>
      </section>
    }>
      <PagoClient />
    </Suspense>
  );
}
