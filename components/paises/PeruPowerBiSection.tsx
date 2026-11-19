import Link from "next/link";
import { ArrowRight, FileText } from "lucide-react";
import { normalizarPais } from "@/config/paises";
import { textoCuotas } from "@/config/cuotas";
import { courseDurationHours } from "@/lib/data/courses";
import { etiquetaHoraLocal, horarioLocal } from "@/lib/paises/horarios";
import { courseBrochurePath } from "@/lib/pricing-gate";

type Props = {
  pais?: string;
  slug?: string;
};

/**
 * Bloque específico de la ficha /pe/cursos/power-bi (Server Component).
 *
 * Cubre el flujo de trabajo de Excel a Power BI sobre el temario real del
 * curso (Power Query, lenguaje M, modelo estrella y DAX), el alcance por nivel
 * (básico-intermedio y avanzado, desde cero) y el esquema de precio en soles
 * (PEN) a través del PDF de temario y precios y del checkout.
 */
export default function PeruPowerBiSection({
  pais = "pe",
  slug = "power-bi",
}: Props) {
  const iso = normalizarPais(pais);
  if (iso !== "pe" || slug !== "power-bi") return null;

  const horasPorNivel = courseDurationHours("power-bi");
  const horario = horarioLocal("pe");
  const horaLocal = etiquetaHoraLocal("pe");
  const cuotas = textoCuotas("pe");
  const brochureHref = courseBrochurePath("power-bi", "pe");

  return (
    <section
      id="peru-power-bi-detalle"
      data-testid="peru-power-bi-section"
      aria-labelledby="peru-power-bi-heading"
      className="border-t border-line bg-canvas px-4 py-14 sm:px-6 lg:px-8 lg:py-20"
    >
      <div className="mx-auto max-w-6xl">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-mute">
          Formación en vivo · Perú
        </p>
        <h2
          id="peru-power-bi-heading"
          className="mt-3 max-w-[34ch] text-balance text-2xl font-bold tracking-tight text-ink sm:text-3xl"
        >
          Curso de Power BI en Perú: de Excel al modelo estrella, niveles y precio en soles
        </h2>
        <p className="mt-4 max-w-[72ch] text-base leading-relaxed text-mute">
          Este curso de Power BI en Perú se dicta en vivo por Zoom en horario de Lima ({horario.inicio} a{" "}
          {horario.fin}, {horaLocal}), con {horasPorNivel} horas por nivel, grabaciones en el campus
          virtual y certificado digital de ProgramBI con código de verificación.
        </p>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <article className="rounded-[26px] border border-line bg-paper p-6">
            <h3 className="text-lg font-bold tracking-tight text-ink">
              Excel y Power BI: flujo de trabajo con Power Query, M y DAX
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-mute">
              En la operación diaria en Perú, la reportería suele partir en hojas de cálculo con
              comprobantes de SUNAT, ventas o registros de planta. En este curso de Power BI en Perú,
              el flujo entre Excel y Power BI comienza en Power Query: importas tus planillas,
              limpias datos, normalizas matrices con <em>Unpivot Columns</em> y replicas consultas en
              el editor avanzado con lenguaje M.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-mute">
              Luego pasas de la hoja plana al modelo estrella, relacionando tablas para construir
              indicadores con DAX (<code>CALCULATE</code>, <code>FILTER</code>,{" "}
              <code>LOOKUPVALUE</code>, <code>SWITCH</code>, <code>YTD</code>, <code>DATEADD</code> y{" "}
              <code>RANKX</code>). Si antes prefieres reforzar tablas dinámicas y fórmulas, revisa
              nuestro{" "}
              <Link
                href="/pe/cursos/excel"
                className="font-semibold text-ink underline decoration-line-strong underline-offset-4 hover:decoration-ink"
              >
                curso de Excel en Perú
              </Link>
              , disponible como curso independiente en el catálogo.
            </p>
          </article>

          <article className="rounded-[26px] border border-line bg-paper p-6">
            <h3 className="text-lg font-bold tracking-tight text-ink">
              Power BI desde cero: nivel básico e intermedio ({horasPorNivel} horas)
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-mute">
              El programa abierto para personas une el Nivel I (Básico) y el Nivel II (Intermedio) en
              un recorrido práctico de {horasPorNivel} horas en vivo para aprender Power BI desde
              cero, sin requisitos de programación ni experiencia previa en DAX.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-mute">
              Partes instalando Power BI Desktop, conectando orígenes de datos y creando tus primeros
              KPIs, tarjetas, mapas y gráficos; luego avanzas a transformación con Power Query,
              administración de relaciones entre tablas, tabla de medidas, títulos dinámicos con{" "}
              <code>SELECTEDVALUE</code>, selector de métricas con <code>SWITCH</code> y publicación
              de reportes en línea.
            </p>
          </article>

          <article className="rounded-[26px] border border-line bg-paper p-6">
            <h3 className="text-lg font-bold tracking-tight text-ink">
              Nivel avanzado: inteligencia de tiempo, RLS e IA ({horasPorNivel} horas)
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-mute">
              El Nivel III (Avanzado) suma {horasPorNivel} horas en vivo dedicadas a funciones DAX
              complejas, seguridad y analítica asistida por inteligencia artificial sobre modelos ya
              estructurados.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-mute">
              El temario abarca acumulados y comparativos temporales (<code>YTD</code>,{" "}
              <code>QTD</code>, <code>MTD</code>, <code>DATEADD</code>,{" "}
              <code>SAMEPERIODLASTYEAR</code>), prorrateo de metas (<code>ISINSCOPE</code>,{" "}
              <code>ENDOFMONTH</code>), rankings con <code>RANKX</code>, parámetros <em>What-if</em>,
              tooltips dinámicos (<code>GENERATESERIES</code>, <code>SUMMARIZE</code>,{" "}
              <code>MINX</code>, <code>MAXX</code>), botones, marcadores, <em>Drillthrough</em>,
              relaciones inactivas (<code>USERELATIONSHIP</code>), seguridad a nivel de filas (RLS) y
              Copilot en Power BI.
            </p>
          </article>

          <article className="rounded-[26px] border border-line bg-paper p-6">
            <h3 className="text-lg font-bold tracking-tight text-ink">
              Precio del curso de Power BI en Perú en soles (PEN)
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-mute">
              El catálogo para Perú se publica en soles peruanos (PEN). El arancel vigente de cada
              nivel de {horasPorNivel} horas y el porcentaje de descuento activo se consultan en el
              PDF de temario y precios de la ficha, y el monto exacto en soles se muestra en el
              checkout antes de confirmar la inscripción.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-mute">
              El pago se procesa con Mercado Pago Perú (tarjeta de crédito o débito, Yape o Plin)
              {cuotas ? ` con ${cuotas}` : ""}, o mediante transferencia en soles coordinada con
              admisiones. Para equipos que requieren capacitación in-company con factura corporativa,
              puedes cotizar en{" "}
              <Link
                href="/pe/cursos/power-bi?para=empresas"
                className="font-semibold text-ink underline decoration-line-strong underline-offset-4 hover:decoration-ink"
              >
                capacitación Power BI para empresas en Perú
              </Link>
              .
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-4">
              <Link
                href={brochureHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-canvas no-underline"
              >
                <FileText size={15} aria-hidden /> Ver temario y precios en soles (PDF)
              </Link>
              <Link
                href="/pe/guias/como-aprender-power-bi-en-peru"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink no-underline underline-offset-4 hover:underline"
              >
                Guía para aprender Power BI en Perú <ArrowRight size={14} aria-hidden />
              </Link>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
