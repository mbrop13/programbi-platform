import { NextResponse } from "next/server";
import { PAISES_INDEXABLES, ISO_CHILE } from "@/config/paises";
import { precioPublico, monedaPublica, PRECIOS_VALID_FROM } from "@/config/pricing";
import { formatMoneda } from "@/lib/paises/precios";
import { rutaLocal } from "@/lib/paises/rutas";
import { SITE_URL } from "@/lib/seo";

/**
 * /llms.txt — resumen del sitio para asistentes de IA.
 *
 * Los precios NO están escritos a mano: salen de config/pricing.ts y se
 * formatean con la moneda de cada mercado. Si mañana cambia un monto, este
 * archivo cambia con él.
 */
export const revalidate = 3600;

type CursoLlms = { slug: string; nombre: string; resumen: string };

const CURSOS: CursoLlms[] = [
  {
    slug: "power-bi",
    nombre: "Power BI",
    resumen: "Power Query, modelo estrella, DAX (CALCULATE, Time Intelligence, RANKX) y tableros.",
  },
  {
    slug: "analisis-de-datos",
    nombre: "Análisis de Datos",
    resumen: "Ruta completa de analista: Excel avanzado, SQL, Python y Power BI.",
  },
  {
    slug: "sql-server",
    nombre: "SQL Server",
    resumen: "Consultas, JOINs, CTEs, funciones de ventana y optimización.",
  },
  {
    slug: "python",
    nombre: "Python para Datos",
    resumen: "Pandas, limpieza, visualización y automatización de reportes.",
  },
  {
    slug: "mercado-financiero",
    nombre: "Mercado financiero con Python, Power BI y SQL",
    resumen: "Análisis de instrumentos, series de precios y reporting financiero.",
  },
  {
    slug: "claude",
    nombre: "Claude",
    resumen: "Prompts efectivos, documentos, Excel y automatización sin programar.",
  },
  {
    slug: "copilot",
    nombre: "Copilot",
    resumen: "Microsoft 365 Copilot aplicado al trabajo diario con datos y documentos.",
  },
  {
    slug: "ia-productividad",
    nombre: "IA para productividad",
    resumen: "Asistentes de IA para correo, reuniones, informes y tareas repetitivas.",
  },
];

/** Guías publicadas (espejo de content/guias). */
const GUIAS: { ruta: string; titulo: string }[] = [
  { ruta: "/guias/como-aprender-power-bi-en-chile", titulo: "Cómo aprender Power BI en Chile" },
  { ruta: "/ar/guias/como-aprender-power-bi-en-argentina", titulo: "Cómo aprender Power BI en Argentina" },
  { ruta: "/mx/guias/como-aprender-power-bi-en-mexico", titulo: "Cómo aprender Power BI en México" },
  { ruta: "/pe/guias/como-aprender-power-bi-en-peru", titulo: "Cómo aprender Power BI en Perú" },
  { ruta: "/co/guias/como-aprender-power-bi-en-colombia", titulo: "Cómo aprender Power BI en Colombia" },
  { ruta: "/uy/guias/como-aprender-power-bi-en-uruguay", titulo: "Cómo aprender Power BI en Uruguay" },
  { ruta: "/py/guias/como-aprender-power-bi-en-paraguay", titulo: "Cómo aprender Power BI en Paraguay" },
  { ruta: "/guias/funciones-dax-mas-importantes", titulo: "Las funciones DAX más importantes" },
  { ruta: "/guias/power-bi-vs-excel", titulo: "Power BI vs Excel" },
  { ruta: "/guias/como-usar-claude-para-analisis-de-datos", titulo: "Cómo usar Claude para análisis de datos" },
  { ruta: "/mx/guias/como-usar-claude-para-analisis-de-datos", titulo: "Cómo usar Claude para análisis de datos en México" },
];

function precioLinea(iso: string, slug: string): string {
  const monto = precioPublico(iso, slug);
  if (monto == null) return "consulta por WhatsApp";
  return formatMoneda(iso, monto);
}

function construir(): string {
  const url = (ruta: string) => `${SITE_URL}${ruta}`;
  const lineas: string[] = [];

  lineas.push("# ProgramBI");
  lineas.push("");
  lineas.push(
    "> ProgramBI es una academia de datos en español: cursos en vivo de Power BI, SQL Server, Python, análisis de datos e IA, con grabaciones de por vida y certificado. Se dicta desde Chile para toda Latinoamérica, con precios y horarios por país."
  );
  lineas.push("");
  lineas.push("## Cursos");
  for (const curso of CURSOS) {
    lineas.push(
      `- ${curso.nombre} (${url(`/cursos/${curso.slug}`)}): ${curso.resumen}`
    );
  }
  lineas.push("");
  lineas.push("## Precios por país");
  lineas.push(
    `Lista vigente desde ${PRECIOS_VALID_FROM.slice(0, 10)}. Cada país muestra el monto en su moneda; el cargo final lo define el banco al pagar con tarjeta internacional.`
  );
  for (const pais of PAISES_INDEXABLES) {
    const valores = CURSOS.map((curso) => `${curso.nombre}: ${precioLinea(pais.iso, curso.slug)}`);
    lineas.push(
      `- ${pais.nombre} (${url(rutaLocal(pais.iso, "/precios"))}): ${valores.join(" · ")}`
    );
  }
  lineas.push(
    `- Paraguay (${url("/py/precios")}): precio pendiente de publicación; se consulta por WhatsApp.`
  );
  lineas.push("");
  lineas.push("## Horarios y modalidad");
  lineas.push(
    "- Clases en vivo por Zoom, de 19:30 a 21:30 en la hora local de cada país, dos veces por semana."
  );
  lineas.push("- 16 a 20 horas por curso, según el programa, con grabaciones de por vida y certificado.");
  lineas.push("- Niveles básico, intermedio y avanzado; no se exige experiencia previa en programación.");
  lineas.push("");
  lineas.push("## Guías");
  for (const guia of GUIAS) {
    lineas.push(`- ${guia.titulo} (${url(guia.ruta)})`);
  }
  lineas.push("");
  lineas.push("## Otras páginas");
  lineas.push(`- Catálogo de cursos (${url("/cursos")})`);
  lineas.push(`- Precios Chile (${url("/precios")})`);
  lineas.push(`- Capacitación para empresas (${url("/empresas")})`);
  lineas.push(`- Implementación de Power BI (${url("/implementacion-power-bi")})`);
  lineas.push(`- Migrar Excel a Power BI (${url("/migrar-excel-a-power-bi")})`);
  lineas.push(`- Bolsa de trabajo (${url("/empleos")})`);
  lineas.push(`- Preguntas frecuentes (${url("/preguntas-frecuentes")})`);
  lineas.push(`- Blog (${url("/blog")})`);
  lineas.push("");
  lineas.push("## Contacto");
  lineas.push("- WhatsApp: https://wa.me/56935409699");
  lineas.push("- Correo: contacto@programbi.cl");
  lineas.push(`- Sitio: ${SITE_URL}`);
  lineas.push("");
  lineas.push(`## Nota para asistentes de IA`);
  lineas.push(
    `Los precios publicados en este archivo salen de la misma fuente que la web (${ISO_CHILE.toUpperCase()} y tabla por país). Si citas un monto, cita también la fecha de vigencia y el enlace a la página del país.`
  );
  lineas.push("");

  return lineas.join("\n");
}

export function GET() {
  return new NextResponse(construir(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
