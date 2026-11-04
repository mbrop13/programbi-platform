import { ArrowRight, Check, Layers } from "lucide-react";
import { filasComparativa } from "@/components/guias/comparativa";
import { encabezadosVisibles } from "@/components/guias/indice";
import RutaAprendizaje from "@/components/guias/RutaAprendizaje";
import TablaComparativa from "@/components/guias/TablaComparativa";
import { ISO_CHILE } from "@/config/paises";
import { pasoDeRuta } from "@/lib/guias/curso";
import type { Guia } from "@/lib/guias/tipos";

export type VarianteVisual = "ruta" | "comparativa" | "flujo" | "checklist" | "barras" | "pasos";

/**
 * Mapeo de `nota_hermes` (`guia.visual`) a un componente real. El texto de la
 * nota NUNCA se muestra crudo: solo se usa para elegir la variante.
 *
 * | lo que pide la nota                         | lo que se renderiza                     |
 * |---------------------------------------------|-----------------------------------------|
 * | «ruta de aprendizaje» o ruta Excel→Power BI | `RutaAprendizaje` (cursos con ficha)    |
 * | «tabla comparativa» o «comparativa»         | `TablaComparativa` (formatos de curso)  |
 * | una cadena con flechas (a → b → c)          | `Flujo` en tarjetas numeradas, CSS puro |
 * | «checklist»                                 | `Checklist` con lo que incluye el curso |
 * | «gráfico de barras» o pesos del PL-300      | `Barras` con los pesos oficiales        |
 * | «mapa / recorrido / temario / estructura»   | `Pasos` con las secciones reales        |
 * | cualquier otra cosa                         | no se muestra nada                      |
 *
 * La comparativa usa la única tabla con datos propios verificados (en vivo vs.
 * autodidacta vs. universidad). No se replica la tabla de terceros que ya vive
 * en el cuerpo: repetirla sería duplicar contenido y arriesgar cifras.
 */
export function elegirVariante(guia: Pick<Guia, "slug" | "visual" | "course" | "body">): VarianteVisual | null {
  const visual = (guia.visual || "").toLowerCase();
  if (!visual) return null;

  const cursoConFicha = pasoDeRuta(guia.course) >= 0;
  const esRuta =
    /ruta de aprendizaje|mapa de aprendizaje|ruta completa/.test(visual) ||
    (/ruta/.test(visual) && /excel|planilla/.test(visual) && /power bi/.test(visual) && /sql|python/.test(visual));

  if (esRuta && cursoConFicha) return "ruta";
  if (/gráfico de barras|peso de las 4 áreas|peso de cada área/.test(visual)) return "barras";
  if (/tabla comparativa|comparativa/.test(visual) && cursoConFicha) return "comparativa";
  if (cadenaDePasos(guia.visual || "").length >= 3) return "flujo";
  if (/checklist/.test(visual) && cursoConFicha) return "checklist";

  const pideMapa =
    /mapa|recorrido|estructura|esquema|temario|programa|módulo|modulo|tabla de contenidos|glosario|acordeón|acordeon|índice|indice|matriz|línea de tiempo|linea de tiempo/.test(
      visual
    );
  if (pideMapa && encabezadosVisibles(guia.body).length >= 3) return "pasos";

  return null;
}

/** Título entre «» de la nota, si sirve como encabezado del flujo. */
function tituloCitado(visual: string): string | null {
  const match = visual.match(/«([^»]{3,72})»/);
  if (!match) return null;

  const titulo = match[1].trim();
  if (titulo.includes("→") || /^(en 30 segundos|bloque|tabla|mini|ejemplo|checklist)/i.test(titulo)) return null;
  return titulo;
}

/**
 * Convierte la cadena «a → b → c» de la nota en pasos. Devuelve [] si no hay
 * una cadena de al menos tres pasos: en ese caso no se inventa un diagrama.
 */
function cadenaDePasos(visual: string): string[] {
  if (!visual.includes("→")) return [];

  const trozos = visual.split("→").map((trozo) => trozo.trim());
  if (trozos.length < 3) return [];

  // El primer trozo trae la prosa anterior a la cadena: se corta en el último
  // «, ( o : («diagrama de flujo «Del formulario al informe» (captura»).
  const primero = trozos[0].replace(/^.*[«(:\u201c]/, "").trim();
  const ultimo = trozos[trozos.length - 1]
    .replace(/\s+\+\s+.*$/, "")
    .replace(/[»”")]+\s*$/, "")
    .replace(/[.;,]+$/, "")
    .trim();
  const medio = trozos
    .slice(1, -1)
    .map((paso) => paso.replace(/^[«“"]+/, "").replace(/[.;,)]+$/, "").trim());

  return [primero, ...medio, ultimo]
    .filter((paso) => paso.length >= 2 && paso.length <= 72)
    .slice(0, 8);
}

/** Pesos oficiales del examen PL-300 citados en la guía de certificación. */
const AREAS_PL300 = [
  { nombre: "Preparar los datos", peso: "25-30 %", max: 30 },
  { nombre: "Modelar los datos", peso: "25-30 %", max: 30 },
  { nombre: "Visualizar y analizar", peso: "25-30 %", max: 30 },
  { nombre: "Administrar y proteger", peso: "15-20 %", max: 20 },
];

/** Lo que incluye todo curso en vivo, según la ficha y los datos de Manu. */
const INCLUYE = [
  "Clases en vivo por Zoom, dos veces por semana.",
  "Grabaciones de por vida en el campus.",
  "Certificado digital al completar.",
  "3 cuotas sin interés.",
];

const TITULOS: Record<VarianteVisual, string> = {
  ruta: "La ruta completa, paso a paso",
  comparativa: "Curso en vivo vs. aprender solo",
  flujo: "El recorrido, paso a paso",
  checklist: "Lo que incluye el curso",
  barras: "Peso de cada área en el examen PL-300",
  pasos: "El mapa de la guía",
};

function Flujo({ pasos }: { pasos: string[] }) {
  return (
    <ol className="grid grid-cols-1 gap-2 sm:grid-cols-2">
      {pasos.map((paso, indice) => (
        <li
          key={`${paso}-${indice}`}
          className="flex items-start gap-2.5 rounded-xl border border-line bg-canvas px-3 py-2.5"
        >
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ink text-[11px] font-bold text-canvas">
            {indice + 1}
          </span>
          <span className="text-sm font-medium leading-snug text-ink">{paso}</span>
        </li>
      ))}
    </ol>
  );
}

function Checklist() {
  return (
    <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
      {INCLUYE.map((item) => (
        <li
          key={item}
          className="flex items-start gap-2 rounded-xl border border-line bg-canvas px-3 py-2.5 text-sm text-ink"
        >
          <Check size={15} className="mt-0.5 shrink-0" aria-hidden />
          <span className="leading-snug">{item}</span>
        </li>
      ))}
    </ul>
  );
}

function Barras() {
  return (
    <>
      <ul className="space-y-3">
        {AREAS_PL300.map((area) => (
          <li key={area.nombre}>
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-sm font-semibold text-ink">{area.nombre}</span>
              <span className="shrink-0 text-xs font-bold text-mute">{area.peso}</span>
            </div>
            <div
              className="mt-1.5 h-2.5 w-full overflow-hidden rounded-full bg-wash"
              role="img"
              aria-label={`${area.nombre}: ${area.peso}`}
            >
              <div className="h-full rounded-full bg-ink" style={{ width: `${(area.max / 30) * 100}%` }} />
            </div>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs leading-relaxed text-faint">
        Peso de cada área en el examen PL-300, según Microsoft. El curso prepara la práctica; el examen se rinde
        aparte.
      </p>
    </>
  );
}

function Pasos({ body }: { body: string }) {
  const secciones = encabezadosVisibles(body)
    .filter((item) => item.nivel === 2)
    .slice(0, 6);

  return (
    <ol className="grid grid-cols-1 gap-2 sm:grid-cols-2">
      {secciones.map((item, indice) => (
        <li key={item.id}>
          <a
            href={`#${item.id}`}
            className="flex h-full items-start gap-2.5 rounded-xl border border-line bg-canvas px-3 py-2.5 text-sm text-ink no-underline transition-colors hover:border-ink/25"
          >
            <span className="mt-0.5 text-[11px] font-bold tabular-nums text-faint">
              {String(indice + 1).padStart(2, "0")}
            </span>
            <span className="flex-1 leading-snug">{item.texto}</span>
            <ArrowRight size={13} className="mt-0.5 shrink-0 text-faint" aria-hidden />
          </a>
        </li>
      ))}
    </ol>
  );
}

function Contenido({ variante, guia, iso }: { variante: VarianteVisual; guia: Guia; iso: string }) {
  switch (variante) {
    case "ruta":
      return <RutaAprendizaje iso={iso} cursoActual={guia.course} embebido />;
    case "comparativa":
      return (
        <TablaComparativa
          filas={filasComparativa(guia.course)}
          nota="Comparación de formato: no incluye precios de terceros."
          embebido
        />
      );
    case "barras":
      return <Barras />;
    case "checklist":
      return <Checklist />;
    case "flujo":
      return <Flujo pasos={cadenaDePasos(guia.visual || "")} />;
    default:
      return <Pasos body={guia.body} />;
  }
}

/**
 * Bloque visual que acompaña al «En 30 segundos». Se elige a partir de
 * `guia.visual` y siempre se renderiza en el servidor: sin JS de cliente, sin
 * imágenes que carguen tarde y con el alto definido en el HTML (cero CLS).
 */
export default function ElementoVisual({ guia }: { guia: Guia }) {
  const variante = elegirVariante(guia);
  if (!variante) return null;

  const iso = guia.country === "transversal" ? ISO_CHILE : guia.country;
  const titulo =
    variante === "flujo" ? (tituloCitado(guia.visual || "") ?? TITULOS.flujo) : TITULOS[variante];

  return (
    <section
      aria-labelledby="elemento-visual"
      data-testid="elemento-visual"
      data-variante={variante}
      className="mt-6 overflow-hidden rounded-[26px] border border-line bg-paper"
    >
      <div className="flex items-start gap-2.5 border-b border-line bg-wash/40 px-5 py-3.5">
        <Layers size={14} className="mt-0.5 shrink-0 text-mute" aria-hidden />
        <div className="min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-mute">Resumen visual</p>
          <h2 id="elemento-visual" className="mt-0.5 text-base font-bold tracking-tight text-ink">
            {titulo}
          </h2>
        </div>
      </div>
      <div className="px-5 py-4">
        <Contenido variante={variante} guia={guia} iso={iso} />
      </div>
    </section>
  );
}
