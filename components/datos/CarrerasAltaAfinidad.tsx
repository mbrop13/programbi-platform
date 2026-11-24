import Link from "@/components/datos/EnlaceNavegacionDatos";
import { ArrowUpRight } from "lucide-react";

const CARRERAS_ALTA_AFINIDAD = [
  {
    slug: "ingenieria-comercial",
    nombre: "Ingeniería Comercial",
    enfoque: "Power BI y Excel",
  },
  {
    slug: "ingenieria-industrial",
    nombre: "Ingeniería Industrial",
    enfoque: "Power BI y Análisis de Datos",
  },
  {
    slug: "ingenieria-civil-industrial",
    nombre: "Ingeniería Civil Industrial",
    enfoque: "Power BI y Análisis de Datos",
  },
  {
    slug: "contador-auditor",
    nombre: "Contador Auditor",
    enfoque: "Excel y Power BI",
  },
  {
    slug: "ingenieria-en-computacion-e-informatica",
    nombre: "Ingeniería en Computación e Informática",
    enfoque: "SQL Server, Python y Datos",
  },
] as const;

/** Bloque SSR con enlaces directos a las 5 fichas de carreras con mayor afinidad a datos, Power BI y SQL. */
export function CarrerasAltaAfinidad() {
  return (
    <section
      aria-labelledby="carreras-alta-afinidad-titulo"
      className="rounded-xl border border-border bg-card p-5 shadow-xs sm:p-6"
    >
      <div className="space-y-1.5">
        <h2
          id="carreras-alta-afinidad-titulo"
          className="text-lg font-semibold tracking-tight text-foreground sm:text-xl"
        >
          Carreras con alta afinidad a datos, Power BI y SQL
        </h2>
        <p className="text-sm text-muted-foreground">
          Revisa sueldos, empleabilidad y aranceles de las carreras donde el análisis de datos,
          Power BI y SQL tienen mayor demanda laboral en Chile.
        </p>
      </div>

      <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {CARRERAS_ALTA_AFINIDAD.map((carrera) => (
          <li key={carrera.slug}>
            <Link
              href={`/datos/carreras/${carrera.slug}`}
              className="group flex h-full items-center justify-between gap-3 rounded-lg border border-border bg-background px-4 py-3 transition-colors hover:border-blue-600/50 hover:bg-muted/40"
            >
              <div className="min-w-0">
                <div className="text-sm font-semibold text-foreground group-hover:text-blue-700 group-hover:underline">
                  {carrera.nombre}
                </div>
                <div className="text-xs text-muted-foreground">{carrera.enfoque}</div>
              </div>
              <ArrowUpRight
                className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-blue-700"
                aria-hidden="true"
              />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
