import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { rutaLocal } from "@/lib/paises/rutas";

type FilaComparativa = {
  slug: "chatgpt" | "gemini" | "claude" | "ia-productividad";
  nombre: string;
  enfoque: string;
  eligeSi: string;
  path: string;
};

const FILAS: readonly FilaComparativa[] = [
  {
    slug: "chatgpt",
    nombre: "ChatGPT",
    enfoque: "Excel, CSV, Projects, plugins y ChatGPT Work",
    eligeSi:
      "Trabajas con planillas de Excel o CSV a diario, necesitas analizar datos sin programar, armar Projects con documentos o automatizar tareas con ChatGPT Work.",
    path: "/cursos/chatgpt",
  },
  {
    slug: "gemini",
    nombre: "Gemini",
    enfoque: "Google Workspace, PDF, Gemini Notebook y Deep Research",
    eligeSi:
      "Tu equipo usa Google Workspace (Gmail, Docs, Sheets, Meet) y quieres extraer datos de PDF, investigar con Deep Research y trabajar con Gemini Notebook (NotebookLM).",
    path: "/cursos/gemini",
  },
  {
    slug: "claude",
    nombre: "Claude",
    enfoque: "Projects, Artifacts, Docs, Slides, Excel y Cowork",
    eligeSi:
      "Buscas redacción precisa, análisis de documentos largos, Artifacts interactivos, Projects de equipo y automatización ligera con Claude Cowork.",
    path: "/cursos/claude",
  },
  {
    slug: "ia-productividad",
    nombre: "IA en Productividad",
    enfoque: "Criterio transversal y combinación de herramientas",
    eligeSi:
      "Quieres un recorrido práctico multi-herramienta para combinar distintas plataformas de IA en tu rutina diaria sin casarte con un solo ecosistema.",
    path: "/cursos/ia-productividad",
  },
];

export default function ComparativaCursosIA({
  slug,
  pais,
}: {
  slug: "chatgpt" | "gemini";
  pais: string;
}) {
  const heading =
    slug === "chatgpt"
      ? "ChatGPT, Gemini o Claude: qué curso elegir"
      : "Gemini, ChatGPT o Claude: qué curso elegir";

  return (
    <section
      aria-labelledby="comparativa-cursos-ia"
      className="mt-12 border-t border-line pt-12"
    >
      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-mute">
        Comparativa de cursos de IA
      </p>
      <h2
        id="comparativa-cursos-ia"
        className="mt-3 text-2xl font-bold tracking-tight text-ink sm:text-3xl"
      >
        {heading}
      </h2>
      <p className="mt-3 max-w-[64ch] text-sm leading-relaxed text-mute">
        Cada curso trabaja 20 horas en vivo sobre un ecosistema distinto. Elige según las
        herramientas que ya usas en tu oficina.
      </p>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-line bg-paper">
        <table className="w-full min-w-[580px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-line bg-canvas text-[11px] font-bold uppercase tracking-[0.14em] text-mute">
              <th scope="col" className="px-4 py-3.5">
                Curso
              </th>
              <th scope="col" className="px-4 py-3.5">
                Ecosistema principal
              </th>
              <th scope="col" className="px-4 py-3.5">
                Elige este si…
              </th>
              <th scope="col" className="px-4 py-3.5 text-right">
                Ficha
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {FILAS.map((fila) => {
              const esActual = fila.slug === slug;
              return (
                <tr key={fila.slug} className={esActual ? "bg-wash/50" : undefined}>
                  <td className="px-4 py-4 align-top font-semibold text-ink whitespace-nowrap">
                    {fila.nombre}
                    {esActual ? (
                      <span className="ml-2 inline-block rounded-full border border-line bg-canvas px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-mute">
                        Este curso
                      </span>
                    ) : null}
                  </td>
                  <td className="px-4 py-4 align-top text-mute">{fila.enfoque}</td>
                  <td className="px-4 py-4 align-top leading-relaxed text-ink">{fila.eligeSi}</td>
                  <td className="px-4 py-4 align-top text-right whitespace-nowrap">
                    <Link
                      href={rutaLocal(pais, fila.path)}
                      className="inline-flex items-center gap-1 font-semibold text-ink no-underline underline-offset-4 hover:underline"
                    >
                      {esActual ? "Ver ficha" : "Ver curso"}
                      <ArrowRight size={14} aria-hidden />
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
