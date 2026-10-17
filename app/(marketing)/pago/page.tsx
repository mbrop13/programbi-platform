import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import PagoClient from "./PagoClient";
import { estadosPublicos } from "@/lib/paises/cobro";
import { getCheckoutCatalog } from "@/lib/pago/catalogo";

export const metadata: Metadata = {
  title: "Inscripción | ProgramBI",
  description: "Selecciona tus cursos, revisa fechas disponibles y completa tu inscripción en ProgramBI.",
  alternates: { canonical: "/pago" },
};

function uno(value: string | string[] | undefined) {
  return typeof value === "string" ? value : "";
}

export default async function PagoPage({
  searchParams,
}: {
  searchParams: Promise<{ curso?: string | string[]; nivel?: string | string[]; servicio?: string | string[] }>;
}) {
  const query = await searchParams;
  const supabase = await createClient();
  const catalogPromise = getCheckoutCatalog();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  const catalog = await catalogPromise;

  return (
    <Suspense fallback={
      <section className="flex min-h-[60vh] items-center justify-center bg-canvas">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-line border-t-ink" />
          <span className="text-sm text-mute">Cargando…</span>
        </div>
      </section>
    }>
      <PagoClient
        estados={estadosPublicos()}
        catalog={catalog}
        curso={uno(query.curso)}
        nivel={uno(query.nivel)}
        servicio={uno(query.servicio)}
        userEmail={user.email ?? ""}
      />
    </Suspense>
  );
}
