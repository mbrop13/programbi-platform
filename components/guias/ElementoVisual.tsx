import { Check } from "lucide-react";
import { GuiaToolVisual, GuiaVisualBadge } from "@/components/guias/GuiaEditorialPrimitives";
import RutaAprendizaje from "@/components/guias/RutaAprendizaje";
import TablaComparativa from "@/components/guias/TablaComparativa";
import { filasComparativa } from "@/components/guias/comparativa";
import { encabezadosVisibles } from "@/components/guias/indice";
import { CUOTAS_SIN_INTERES } from "@/config/cuotas";
import { ISO_CHILE } from "@/config/paises";
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
  { paso: "01", titulo: "Elige el curso", detalle: "Con clases en vivo por Zoom" },
  { paso: "02", titulo: "Paga en moneda local", detalle: `O hasta ${CUOTAS_SIN_INTERES} cuotas sin interés` },
  { paso: "03", titulo: "Entra al campus", detalle: "Zoom, clases y material para practicar durante el curso" },
  { paso: "04", titulo: "Completa el programa", detalle: "Certificado al terminar" },
];

const BLOQUES_PROMPT_CLAUDE = [
  { num: "01", label: "Rol", detalle: "Quién analiza (control de gestión, finanzas, ventas)" },
  { num: "02", label: "Contexto", detalle: "Planilla, periodo, moneda local y regla de negocio" },
  { num: "03", label: "Tarea", detalle: "Limpiar, calcular variación o proponer fórmula exacta" },
  { num: "04", label: "Formato y límite", detalle: "Tabla lista y regla explícita: no inventar cifras" },
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
      <p className="text-sm font-semibold text-[var(--g-ink)]">{titulo}</p>
      <ol className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {TARJETAS_FLUJO.map((item) => (
          <li
            key={item.paso}
            className="rounded-xl border border-[var(--g-border)] bg-[var(--g-bg)] p-4 shadow-[var(--g-card-shadow)]"
          >
            <span className="font-mono text-xs font-semibold tabular-nums text-[var(--g-accent)]">
              {item.paso}
            </span>
            <p className="mt-2 text-sm font-semibold text-[var(--g-ink)]">{item.titulo}</p>
            <p className="mt-1 text-xs leading-relaxed text-[var(--g-muted)]">{item.detalle}</p>
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
        <p className="text-sm font-semibold text-[var(--g-ink)]">
          Anatomía de un prompt profesional para trabajar con datos
        </p>
        <GuiaVisualBadge tone="ok">Verificado antes de enviar</GuiaVisualBadge>
      </div>
      <ol className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {BLOQUES_PROMPT_CLAUDE.map((b) => (
          <li
            key={b.num}
            className="rounded-xl border border-[var(--g-border)] bg-[var(--g-bg)] p-4 shadow-[var(--g-card-shadow)]"
          >
            <span className="font-mono text-xs font-semibold uppercase tracking-wider tabular-nums text-[var(--g-accent)]">
              {b.num} · {b.label}
            </span>
            <p className="mt-1.5 text-xs leading-relaxed text-[var(--g-muted)]">{b.detalle}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

function BloqueDaxContexto() {
  const pilares = [
    { nombre: "01. Modelo en estrella", detalle: "Tabla de hechos (Ventas) conectada 1 a muchos a dimensiones (Fecha, Cliente, Producto)." },
    { nombre: "02. Contexto de filtro", detalle: "Los segmentadores y ejes del informe filtran las filas antes de evaluar la medida." },
    { nombre: "03. CALCULATE y DIVIDE", detalle: "Modifica el contexto con CALCULATE y evita divisiones por cero con DIVIDE." },
  ];
  return (
    <div>
      <p className="text-sm font-semibold text-[var(--g-ink)]">Cómo calcula Power BI cualquier medida DAX en 3 pasos</p>
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {pilares.map((pilar) => (
          <div
            key={pilar.nombre}
            className="rounded-xl border border-[var(--g-border)] bg-[var(--g-bg)] p-4 shadow-[var(--g-card-shadow)]"
          >
            <p className="text-sm font-bold tabular-nums text-[var(--g-ink)]">{pilar.nombre}</p>
            <p className="mt-1.5 text-xs leading-relaxed text-[var(--g-muted)]">{pilar.detalle}</p>
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
      <p className="text-sm font-semibold text-[var(--g-ink)]">Regla rápida: qué elegir según la tarea de hoy</p>
      <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        {casos.map((item) => (
          <div
            key={item.caso}
            className="flex items-start justify-between gap-3 rounded-xl border border-[var(--g-border)] bg-[var(--g-bg)] px-4 py-3 shadow-[var(--g-card-shadow)]"
          >
            <div>
              <p className="text-xs font-semibold text-[var(--g-ink)]">{item.caso}</p>
              <p className="mt-0.5 text-xs text-[var(--g-muted)]">{item.nota}</p>
            </div>
            <GuiaVisualBadge tone={item.ganador === "Power BI" ? "accent" : "neutral"} className="shrink-0">
              {item.ganador}
            </GuiaVisualBadge>
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
    <ol className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
      {secciones.map((sec, idx) => (
        <li key={sec.id}>
          <a
            href={`#${sec.id}`}
            className="flex min-h-[44px] items-baseline gap-3 rounded-xl border border-[var(--g-border)] bg-[var(--g-bg)] px-3.5 py-2.5 text-sm font-medium text-[var(--g-ink)] no-underline shadow-[var(--g-card-shadow)] transition-all hover:-translate-y-0.5 hover:border-[var(--g-border-strong)] hover:text-[var(--g-accent)] hover:shadow-[var(--g-card-shadow-hover)]"
          >
            <span className="font-mono text-xs font-semibold tabular-nums text-[var(--g-accent)]">
              {String(idx + 1).padStart(2, "0")}
            </span>
            <span>{sec.texto}</span>
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
        <ul className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {[
            "Horario local compatible dos días a la semana",
            "Computadora con los programas gratuitos instalados",
            "Un problema real de tu trabajo para llevar a clase",
            "Acceso a las grabaciones si faltas una sesión",
          ].map((item) => (
            <li
              key={item}
              className="flex items-start gap-2.5 rounded-xl border border-[var(--g-border)] bg-[var(--g-bg)] px-4 py-3 text-sm text-[var(--g-ink)] shadow-[var(--g-card-shadow)]"
            >
              <Check size={15} className="mt-0.5 shrink-0 text-[var(--g-ok)]" aria-hidden />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );
    case "barras":
      return (
        <div className="space-y-3">
          <p className="text-xs leading-relaxed text-[var(--g-muted)]">
            Referencia visual de cómo escalan los cargos cuando sumas SQL, modelado en BI y automatización a tu rol actual.
          </p>
          {[
            { nivel: "Junior · Excel / Reportes manuales", porcentaje: "35%", color: "bg-[var(--g-subtle)]" },
            { nivel: "Semi-senior · Power BI + SQL Server", porcentaje: "65%", color: "bg-[var(--g-ink)]" },
            { nivel: "Senior · Stack completo + Python / IA", porcentaje: "92%", color: "bg-[var(--g-accent)]" },
          ].map((fila) => (
            <div key={fila.nivel} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-medium text-[var(--g-ink)]">
                <span>{fila.nivel}</span>
                <span className="tabular-nums text-[var(--g-subtle)]">Progresión</span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-[var(--g-wash)]">
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
      className="mt-8 rounded-2xl border border-[var(--g-border)] bg-[var(--g-surface)] p-5 shadow-[var(--g-card-shadow)] sm:p-6"
    >
      <div className="flex items-center gap-3">
        <GuiaToolVisual tool={guia.course} course={guia.course} size="sm" />
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.06em] text-[var(--g-subtle)]">
            Esquema de referencia
          </p>
          <h2
            id="elemento-visual-guia"
            className="mt-0.5 text-lg font-bold tracking-tight text-[var(--g-ink)]"
          >
            {titulo}
          </h2>
        </div>
      </div>
      <div className="mt-4">
        <Contenido variante={variante} guia={guia} iso={iso} />
      </div>
    </section>
  );
}
