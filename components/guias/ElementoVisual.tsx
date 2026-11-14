import { ArrowRight, Check, Layers, ShieldCheck, Sparkles } from "lucide-react";
import { filasComparativa } from "@/components/guias/comparativa";
import { encabezadosVisibles } from "@/components/guias/indice";
import RutaAprendizaje from "@/components/guias/RutaAprendizaje";
import TablaComparativa from "@/components/guias/TablaComparativa";
import { ISO_CHILE } from "@/config/paises";
import { CUOTAS_SIN_INTERES } from "@/config/cuotas";
import { pasoDeRuta } from "@/lib/guias/curso";
import type { Guia } from "@/lib/guias/tipos";
import { courseBrochurePath } from "@/lib/pricing-gate";

export type VarianteVisual =
  | "ruta"
  | "comparativa"
  | "flujo"
  | "checklist"
  | "barras"
  | "pasos"
  | "prompt"
  | "dax"
  | "bi-vs-excel";

/**
 * Lee la nota del campo `nota_hermes` (`ELEMENTO VISUAL: ...`) y asigna un
 * diagrama editorial nativo también para las guías de Claude, DAX y Power BI vs Excel.
 */
export function elegirVariante(guia: Pick<Guia, "slug" | "visual" | "course" | "body">): VarianteVisual | null {
  if (guia.slug === "funciones-dax-mas-importantes") return "dax";
  if (guia.slug === "power-bi-vs-excel") return "bi-vs-excel";

  const nota = guia.visual;
  if (!nota) {
    if (guia.course === "claude") return "prompt";
    return null;
  }

  const texto = nota.toLowerCase();
  if (texto.includes("comparativ") || texto.includes("vs")) return "comparativa";
  if (texto.includes("ruta")) return pasoDeRuta(guia.course) >= 0 ? "ruta" : "pasos";
  if (texto.includes("flujo")) return "flujo";
  if (texto.includes("barra") || texto.includes("gráfico") || texto.includes("grafico") || texto.includes("sueldo")) {
    return "barras";
  }
  if (texto.includes("checklist")) return "checklist";
  if (texto.includes("timeline") || texto.includes("pasos") || texto.includes("módulos") || texto.includes("modulos")) {
    return "pasos";
  }
  if (guia.course === "claude") return "prompt";
  return null;
}

const TARJETAS_FLUJO = [
  { paso: "1", titulo: "Elige el curso", detalle: "Con clases en vivo por Zoom" },
  { paso: "2", titulo: "Paga en moneda local", detalle: `O hasta ${CUOTAS_SIN_INTERES} cuotas sin interés` },
  { paso: "3", titulo: "Entra al campus", detalle: "Zoom, clases y material para practicar durante el curso" },
  { paso: "4", titulo: "Completa el programa", detalle: "Certificado al terminar" },
];

const BLOQUES_PROMPT_CLAUDE = [
  { num: "01", label: "Rol", detalle: "Quién analiza (control de gestión, finanzas, ventas)" },
  { num: "02", label: "Contexto", detalle: "Planilla, periodo, moneda local y regla de negocio" },
  { num: "03", label: "Tarea", detalle: "Limpiar, calcular variación o proponer fórmula exacta" },
  { num: "04", label: "Formato + Límite", detalle: "Tabla lista y regla explícita: no inventar cifras" },
];

function FlujoGenerico({ guia }: { guia: Guia }) {
  const titulo =
    guia.visual?.match(/[«"“]([^»"”]+)[»"”]/)?.[1]?.trim() ||
    (guia.course === "claude"
      ? "Del archivo crudo al análisis verificado con Claude"
      : "Cómo funcionará tu cursada en vivo");

  if (guia.course === "claude") {
    return <BloquePromptClaude />;
  }

  return (
    <div>
      <p className="text-sm font-semibold text-ink">{titulo}</p>
      <ol className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {TARJETAS_FLUJO.map((item) => (
          <li key={item.paso} className="rounded-2xl border border-line bg-canvas p-4">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-ink text-xs font-bold text-canvas">
              {item.paso}
            </span>
            <p className="mt-2.5 text-sm font-semibold text-ink">{item.titulo}</p>
            <p className="mt-1 text-xs leading-relaxed text-mute">{item.detalle}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

function BloquePromptClaude() {
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="inline-flex items-center gap-2 text-sm font-semibold text-ink">
          <Sparkles size={15} className="text-[#D97757]" aria-hidden />
          Anatomía de un prompt profesional para trabajar con datos
        </p>
        <span className="inline-flex items-center gap-1 rounded-full border border-emerald-600/30 bg-emerald-600/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-800">
          <ShieldCheck size={12} aria-hidden /> Verificado antes de enviar
        </span>
      </div>
      <ol className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {BLOQUES_PROMPT_CLAUDE.map((b) => (
          <li
            key={b.num}
            className="rounded-2xl border border-line bg-canvas p-4 transition-colors hover:border-[#D97757]/50"
          >
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#B84B29]">
              {b.num} · {b.label}
            </span>
            <p className="mt-1.5 text-xs leading-relaxed text-mute">{b.detalle}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

function BloqueDaxContexto() {
  const pilares = [
    { nombre: "1. Modelo en estrella", detalle: "Tabla de hechos (Ventas) conectada 1→* a dimensiones (Fecha, Cliente, Producto)." },
    { nombre: "2. Contexto de filtro", detalle: "Los segmentadores y ejes del informe filtran las filas antes de evaluar la medida." },
    { nombre: "3. CALCULATE + DIVIDE", detalle: "Modifica el contexto con CALCULATE y evita divisiones por cero con DIVIDE." },
  ];
  return (
    <div>
      <p className="text-sm font-semibold text-ink">Cómo calcula Power BI cualquier medida DAX en 3 pasos</p>
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {pilares.map((pilar) => (
          <div key={pilar.nombre} className="rounded-2xl border border-line bg-canvas p-4">
            <p className="text-sm font-bold text-ink">{pilar.nombre}</p>
            <p className="mt-1.5 text-xs leading-relaxed text-mute">{pilar.detalle}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function BloqueBiVsExcel() {
  const casos = [
    { caso: "Presupuestos manuales y simulaciones rápidas", ganador: "Excel", nota: "Flexibilidad por celda" },
    { caso: "Reportes mensuales de más de 5 áreas o ERPs", ganador: "Power BI", nota: "Modelo único sin copiar y pegar" },
    { caso: "Más de 200 mil filas o archivos lentos", ganador: "Power BI", nota: "Motor comprimido VertiPaq" },
    { caso: "Permisos por sucursal o vendedor (RLS)", ganador: "Power BI", nota: "Un enlace con seguridad por rol" },
  ];
  return (
    <div>
      <p className="text-sm font-semibold text-ink">Regla rápida: qué elegir según la tarea de hoy</p>
      <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        {casos.map((item) => (
          <div key={item.caso} className="flex items-start justify-between gap-3 rounded-2xl border border-line bg-canvas px-4 py-3">
            <div>
              <p className="text-xs font-semibold text-ink">{item.caso}</p>
              <p className="mt-0.5 text-[11px] text-mute">{item.nota}</p>
            </div>
            <span
              className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                item.ganador === "Power BI"
                  ? "bg-[#F2C811]/30 text-ink"
                  : "bg-[#217346]/15 text-[#14532D]"
              }`}
            >
              {item.ganador}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function PasosDeContenido({ guia }: { guia: Guia }) {
  const secciones = encabezadosVisibles(guia.body)
    .filter((item) => !/en 30 segundos|preguntas frecuentes/i.test(item.texto))
    .slice(0, 6);

  if (secciones.length < 2) {
    return <FlujoGenerico guia={guia} />;
  }

  return (
    <ol className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
      {secciones.map((sec, idx) => (
        <li key={sec.id} className="flex items-start gap-2.5 rounded-2xl border border-line bg-canvas px-3.5 py-3">
          <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-wash text-[11px] font-bold text-ink">
            {idx + 1}
          </span>
          <a href={`#${sec.id}`} className="text-xs font-medium leading-snug text-ink no-underline hover:underline">
            {sec.texto}
          </a>
        </li>
      ))}
    </ol>
  );
}

const TITULOS: Record<VarianteVisual, string> = {
  ruta: "Tu posición en la ruta de aprendizaje",
  comparativa: "Curso en vivo vs. aprender solo",
  flujo: "Cómo funciona el flujo de principio a fin",
  checklist: "Qué revisar antes de inscribirte",
  barras: "Rangos del mercado que aparecen en la guía",
  pasos: "Recorrido por las etapas de esta guía",
  prompt: "Método práctico para usar Claude sin errores",
  dax: "Lógica detrás de las medidas DAX",
  "bi-vs-excel": "Excel o Power BI según el problema",
};

function Contenido({ variante, guia, iso }: { variante: VarianteVisual; guia: Guia; iso: string }) {
  switch (variante) {
    case "ruta":
      return <RutaAprendizaje iso={iso} cursoActual={guia.course} embebido />;
    case "comparativa":
      return (
        <TablaComparativa
          filas={filasComparativa(guia.course)}
          brochureHref={courseBrochurePath(guia.course, iso)}
          nota="Comparación cualitativa entre cursar en vivo, estudiar con videos por tu cuenta o hacer una carrera."
          embebido
        />
      );
    case "prompt":
      return <BloquePromptClaude />;
    case "dax":
      return <BloqueDaxContexto />;
    case "bi-vs-excel":
      return <BloqueBiVsExcel />;
    case "flujo":
      return <FlujoGenerico guia={guia} />;
    case "checklist":
      return (
        <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {[
            "Horario local compatible dos días a la semana",
            "Computadora con los programas gratuitos instalados",
            "Un problema real de tu trabajo para llevar a clase",
            "Acceso a las grabaciones si faltas una sesión",
          ].map((item) => (
            <li key={item} className="flex items-start gap-2 rounded-2xl border border-line bg-canvas px-4 py-3 text-sm text-ink">
              <Check size={15} className="mt-0.5 shrink-0 text-ink" aria-hidden />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );
    case "barras":
      return (
        <div className="space-y-3">
          <p className="text-xs leading-relaxed text-mute">
            Referencia visual de cómo escalan los cargos cuando sumas SQL, modelado en BI y automatización a tu rol actual.
          </p>
          {[
            { nivel: "Junior · Excel / Reportes manuales", porcentaje: "35%", color: "bg-line-strong" },
            { nivel: "Semi-senior · Power BI + SQL Server", porcentaje: "65%", color: "bg-ink" },
            { nivel: "Senior · Stack completo + Python / IA", porcentaje: "92%", color: "bg-emerald-700" },
          ].map((fila) => (
            <div key={fila.nivel} className="space-y-1">
              <div className="flex items-center justify-between text-xs font-medium text-ink">
                <span>{fila.nivel}</span>
                <span className="inline-flex items-center gap-1 text-mute">
                  Progresión <ArrowRight size={11} aria-hidden />
                </span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-wash">
                <div className={`h-full rounded-full ${fila.color}`} style={{ width: fila.porcentaje }} />
              </div>
            </div>
          ))}
        </div>
      );
    case "pasos":
      return <PasosDeContenido guia={guia} />;
  }
}

/**
 * Elemento visual de la guía (esquema práctico y siempre en SSR, sin CLS).
 */
export default function ElementoVisual({ guia }: { guia: Guia }) {
  const variante = elegirVariante(guia);
  if (!variante) return null;

  const iso = guia.country === "transversal" ? ISO_CHILE : guia.country;
  const titulo = TITULOS[variante];

  return (
    <section
      aria-labelledby="elemento-visual-guia"
      data-testid="elemento-visual"
      data-variante={variante}
      className="mt-8 rounded-[26px] border border-line-strong bg-paper p-5 shadow-sm"
    >
      <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-mute">
        <Layers size={13} aria-hidden />
        <span>Esquema de referencia</span>
      </div>
      <h2 id="elemento-visual-guia" className="mt-1.5 text-lg font-bold tracking-tight text-ink">
        {titulo}
      </h2>
      <div className="mt-4">
        <Contenido variante={variante} guia={guia} iso={iso} />
      </div>
    </section>
  );
}
