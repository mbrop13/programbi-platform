import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { RUTA_DATOS, fichaCurso, pasoDeRuta, rutaFichaCurso } from "@/lib/guias/curso";

/**
 * Ruta de aprendizaje visual (Excel → SQL Server → Power BI → Python →
 * Análisis de datos). Marca el paso del curso de la guía y enlaza cada paso a
 * su ficha. Sin JS: la versión mobile es una línea vertical con conectores y
 * la de escritorio una fila de tarjetas.
 */
export default function RutaAprendizaje({ iso, cursoActual }: { iso: string; cursoActual: string }) {
  const indice = pasoDeRuta(cursoActual);
  if (indice < 0) return null;

  return (
    <nav
      aria-labelledby="ruta-aprendizaje"
      data-testid="ruta-aprendizaje"
      className="mt-12 rounded-[26px] border border-line bg-wash/60 px-5 py-6"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="ruta-aprendizaje" className="text-[11px] font-bold uppercase tracking-[0.18em] text-mute">
          Ruta de aprendizaje
        </h2>
        <p className="text-xs text-faint">Cada paso es un curso en vivo, por separado</p>
      </div>

      <ol className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-5">
        {RUTA_DATOS.map((paso, i) => {
          const actual = i === indice;
          const hecho = i < indice;
          const ficha = fichaCurso(paso.curso);
          return (
            <li key={paso.curso} className="relative">
              <Link
                href={rutaFichaCurso(iso, paso.curso)}
                aria-current={actual ? "step" : undefined}
                className={`group flex h-full flex-col justify-between gap-2 rounded-2xl border px-4 py-3 no-underline transition-colors ${
                  actual
                    ? "border-ink bg-ink text-canvas"
                    : "border-line-strong bg-paper text-ink hover:border-ink/30"
                }`}
              >
                <span
                  className={`text-[10px] font-bold uppercase tracking-[0.16em] ${
                    actual ? "text-canvas/70" : "text-faint"
                  }`}
                >
                  Paso {i + 1}
                  {hecho ? " · antes" : actual ? " · aquí" : ""}
                </span>
                <span>
                  <span className="block text-sm font-bold leading-tight">{paso.nombre}</span>
                  <span className={`mt-0.5 block text-xs leading-snug ${actual ? "text-canvas/70" : "text-mute"}`}>
                    {paso.detalle}
                  </span>
                </span>
                <span
                  className={`inline-flex items-center gap-1 text-xs font-semibold ${
                    actual ? "text-canvas" : "text-ink"
                  }`}
                >
                  {ficha.horas != null ? `${ficha.horas} h` : "Ver curso"}
                  <ArrowRight size={12} aria-hidden />
                </span>
              </Link>
            </li>
          );
        })}
      </ol>
      <p className="mt-4 text-xs leading-relaxed text-mute">
        No necesitas hacerlos todos: la ruta completa es la del analista de datos. Si ya usas Excel, parte en SQL; si ya
        consultas bases, parte en Power BI.
      </p>
    </nav>
  );
}
