"use client";

import Link from "@/components/datos/EnlaceNavegacionDatos";
import { ArrowRight } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TarjetaInstitucion, type TarjetaInstitucionDatos } from "@/components/datos/TarjetaInstitucion";

const GRUPOS: { id: "U" | "IP" | "CFT"; label: string }[] = [
  { id: "U", label: "Universidades" },
  { id: "IP", label: "Institutos (IP)" },
  { id: "CFT", label: "Técnicos (CFT)" },
];

export function InstitucionesDestacadas({
  instituciones,
}: {
  instituciones: readonly TarjetaInstitucionDatos[];
}) {
  return (
    <section aria-labelledby="instituciones-destacadas-titulo" className="space-y-5">
      <Tabs defaultValue="U" className="flex flex-col gap-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 id="instituciones-destacadas-titulo" className="h2-datos text-foreground">
              Conoce las instituciones
            </h2>
            <p className="mt-2 max-w-xl text-base text-muted-foreground">
              Qué carreras imparte cada una, en qué sedes, cuánto cuesta y cuántos años de
              acreditación tiene, según el Buscador de Carreras 2026 del SIES.
            </p>
          </div>

          <TabsList className="h-11 w-fit rounded-xl bg-wash p-1">
            {GRUPOS.map((g) => (
              <TabsTrigger key={g.id} value={g.id} className="h-9 rounded-lg px-3.5 text-sm font-semibold">
                {g.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {GRUPOS.map((g) => {
          const lista = instituciones.filter((i) => i.tipo === g.id);
          return (
            <TabsContent key={g.id} value={g.id} keepMounted className="mt-0 data-[hidden]:hidden">
              <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {lista.map((inst) => (
                  <li key={inst.key}>
                    <TarjetaInstitucion inst={inst} />
                  </li>
                ))}
              </ul>
            </TabsContent>
          );
        })}
      </Tabs>

      <Link
        href="/datos/carreras/instituciones"
        className="inline-flex min-h-11 items-center gap-2 text-[15px] font-semibold text-foreground underline decoration-2 underline-offset-4 hover:text-blue-700"
      >
        Ver todas las instituciones destacadas
        <ArrowRight className="size-4" aria-hidden="true" />
      </Link>
    </section>
  );
}
