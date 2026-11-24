/**
 * Contenido de `/llms.txt` y `/llms-full.txt`.
 *
 * Regla de la casa: acá no se escribe a mano ningún monto, hora, cuota,
 * credencial ni cantidad de cursos. Los precios públicos (arancel vigente con
 * descuento, precio normal y porcentaje de descuento) salen de
 * `config/pricing.ts` + `lib/paises/precios.ts`; las cuotas de
 * `config/cuotas.ts`; las horas, niveles y cursos de `lib/data/courses.ts` y
 * `lib/data/course-views.ts`; y el equipo docente de `lib/data/mentors.ts` y
 * `lib/data/equipo.ts`. El temario completo y las fechas exactas de inicio se
 * descargan en el PDF de cada curso.
 */

import { MEDIOS_CUOTAS, NOTA_CUOTAS, textoCuotas } from "@/config/cuotas";
import { esIndexable, getPais, ISO_CHILE, PAISES } from "@/config/paises";
import { precioListaPublico, precioPublico, tienePrecioPublico } from "@/config/pricing";
import { comparativasAcademiaHub, RUTA_LISTICLE } from "@/lib/data/academias";
import { comparisons } from "@/lib/data/comparisons";
import { courses, getGroupedCourses, type Course } from "@/lib/data/courses";
import { catalogHours, levelsForView } from "@/lib/data/course-views";
import { EQUIPO_INDEXABLE, rutaPerfil } from "@/lib/data/equipo";
import { mentors } from "@/lib/data/mentors";
import { faqDePais } from "@/lib/faq/contenido";
import { GUIAS } from "@/lib/guias/generado";
import { PLANTILLAS } from "@/lib/data/plantillas";
import { HORA_CLASE_CHILE } from "@/lib/paises/horarios";
import { formatMoneda, porcentajeDescuento } from "@/lib/paises/precios";
import { rutaLocal } from "@/lib/paises/rutas";
import { courseBrochurePath } from "@/lib/pricing-gate";
import { SITE_URL } from "@/lib/seo";

/** Resumen que encabeza los dos archivos. Debe ser el mismo en ambos. */
const RESUMEN =
  `ProgramBI es una academia de datos en español (+5.000 estudiantes formados, 30+ clientes corporativos y 100% clases en vivo por Zoom): cursos de Power BI, SQL Server, Python, análisis de datos e IA, con campus virtual con clases y material durante el curso y certificado verificable. Opera con sede en Chile para Latinoamérica, Estados Unidos y España, con aranceles transparentes en moneda local —precio vigente, precio normal y porcentaje de descuento— (${textoCuotas()}) y temario y fechas en el PDF de cada curso.`;

const url = (ruta: string) => `${SITE_URL}${ruta}`;

/**
 * Enlace en sintaxis Markdown, como pide llmstxt.org. Lighthouse (auditoría de
 * agentes IA) solo cuenta `[texto](url)`; los bullets con la URL entre
 * paréntesis se leen como texto plano. Todo bullet que apunte a una página del
 * sitio debe pasar por acá.
 */
const md = (texto: string, href: string) => `[${texto}](${href})`;

/** Datos de contacto reales, desde `config/paises.ts`. */
const CONTACTO = getPais(ISO_CHILE).contacto;
const CORREO = CONTACTO.email;
const WHATSAPP = CONTACTO.whatsapp ?? url("/preguntas-frecuentes");
/** El mismo enlace, sin esquema, para usarlo como texto visible del bullet. */
const WHATSAPP_TEXTO = WHATSAPP.replace(/^https?:\/\//, "");

/** Cursos en el orden del catálogo (los grupos de navegación), sin perder ni repetir ninguno. */
function cursosEnOrden(): Course[] {
  const vistos = new Set<string>();
  const lista: Course[] = [];
  const agregar = (curso: Course) => {
    if (vistos.has(curso.slug)) return;
    vistos.add(curso.slug);
    lista.push(curso);
  };
  for (const grupo of getGroupedCourses()) {
    for (const curso of grupo.items) agregar(curso);
  }
  for (const curso of courses) agregar(curso);
  return lista;
}

const CURSOS = cursosEnOrden();

/** Mercados principales con tabla propia en moneda local para la matriz detallada. */
const MERCADOS_MATRIZ = ["cl", "ar", "mx", "pe", "co", "uy", "es"] as const;
const MERCADOS_MATRIZ_SET = new Set<string>(MERCADOS_MATRIZ);

/** Guías publicadas: las de país indexable más las transversales. Mismo filtro que el sitemap. */
const GUIAS_PUBLICADAS = GUIAS.filter(
  (guia) => guia.country === "transversal" || esIndexable(guia.country)
);

/**
 * Páginas de nicho de la fase 5.
 *
 * Las cuatro rutas viven en `app/(marketing)/<ruta>/page.tsx` y entran al
 * sitemap de Chile. Si alguna se retira, hay que quitarla también de acá para
 * no anunciar un 404 a los asistentes.
 */
const LANDINGS_NICHO = [
  {
    path: "/power-bi-para-finanzas",
    nombre: "Power BI para finanzas",
    resumen: "Power BI aplicado a equipos de finanzas y control de gestión.",
  },
  {
    path: "/power-bi-sql-server-python",
    nombre: "Power BI con SQL Server y Python",
    resumen: "Las tres herramientas en una misma ruta de análisis: consulta, automatiza y visualiza.",
  },
  {
    path: "/power-bi-mineria-chile",
    nombre: "Power BI y análisis de datos para minería en Chile",
    resumen: "Power BI, SQL y Python aplicados a faena, reportes de turno, OEE y mantenimiento.",
  },
  {
    path: "/capacitacion-empresas",
    nombre: "Capacitación para empresas",
    resumen: "Formación in-company en vivo, con los datos de la empresa y factura.",
  },
] as const;

/**
 * FAQ que entran en `llms-full.txt`. Son las que un asistente necesita para
 * responder precio, horario, modalidad, certificado y requisitos; el listado
 * completo vive en `/preguntas-frecuentes`. Se resuelven por id contra
 * `lib/faq/contenido.ts`, así que si una cambia, cambia acá.
 */
const IDS_FAQ = new Set([
  "que-es-programbi",
  "online-o-grabado",
  "grabaciones-de-por-vida",
  "duracion-power-bi",
  "duracion-analisis",
  "que-curso-me-conviene",
  "proximo-inicio",
  "a-que-hora",
  "que-dias",
  "cuanto-cuestan",
  "precio-que-veo",
  "licencia-power-bi",
  "cuotas-sin-interes",
  "formas-de-pago",
  "como-me-inscribo",
  "un-solo-nivel",
  "recibo-certificado",
  "certificado-vs-pl300",
  "computador",
  "mac",
]);

/** Países que se publican: únicamente los mercados indexables. */
const PAISES_PUBLICADOS = PAISES.filter((pais) => pais.indexable);

/** Formatea un monto con `formatMoneda` normalizando espacios no separables y explicitando la moneda. */
function montoTexto(iso: string, monto: number): string {
  const pais = getPais(iso);
  const texto = formatMoneda(iso, monto).replace(/\u00a0/g, " ").trim();
  if (texto.includes("US$")) {
    return `${pais.simbolo}${texto.replace(/\s*US\$/, "").trim()} ${pais.moneda}`;
  }
  return texto.includes(pais.moneda) ? texto : `${texto} ${pais.moneda}`;
}

/**
 * Arancel vigente con precio normal y porcentaje de descuento desde
 * `config/pricing.ts` + `lib/paises/precios.ts`, o consulta por WhatsApp si no
 * está aprobado (hoy Paraguay).
 */
function precioTransparenteTexto(iso: string, slug: string): string {
  const valor = precioPublico(iso, slug);
  if (valor == null) return "Consulta por WhatsApp";
  const cobroTexto = montoTexto(iso, valor);
  const lista = precioListaPublico(iso, slug);
  if (lista != null && lista > valor) {
    const dcto = porcentajeDescuento(lista, valor);
    return `${cobroTexto} (precio normal ${montoTexto(iso, lista)}, ${dcto}% de descuento)`;
  }
  return cobroTexto;
}

/** Celda de la columna de cuotas: pago único en los mercados sin cuotas. */
function cuotasCelda(iso: string): string {
  return textoCuotas(iso) || "Pago único con tarjeta";
}

/** Resumen exacto de los aranceles vigentes en un país (sin "Desde"). */
function resumenPreciosPais(iso: string): string {
  if (!tienePrecioPublico(iso)) return "Consulta por WhatsApp";
  const estandar = precioTransparenteTexto(iso, "power-bi");
  const analisis = precioTransparenteTexto(iso, "analisis-de-datos");
  const financiero = precioTransparenteTexto(iso, "mercado-financiero");
  return `cursos estándar de 20 h ${estandar}; Análisis de Datos y Minería ${analisis}; Mercado Financiero ${financiero}`;
}

/** Nivel del curso tal como está cargado en el catálogo, con la inicial en mayúscula. */
function nivelTexto(curso: Course): string {
  const nivel = curso.level.trim();
  return nivel ? nivel.charAt(0).toUpperCase() + nivel.slice(1) : "No declarado";
}

/** Horas totales reales sumando todos los niveles públicos del programa. */
function horasTotalesCurso(curso: Course): number {
  const niveles = levelsForView(curso, "publico");
  if (niveles.length === 0) return catalogHours(curso);
  const suma = niveles.reduce((total, nivel) => total + (nivel.durationHours ?? catalogHours(curso)), 0);
  return suma > 0 ? suma : catalogHours(curso);
}

/** Resumen corto de estructura y horas para listados y tablas. */
function duracionCorta(curso: Course): string {
  const niveles = levelsForView(curso, "publico");
  const horasNivel = catalogHours(curso);
  const total = horasTotalesCurso(curso);
  if (niveles.length <= 1) {
    return `${horasNivel} h · 1 nivel (${niveles[0]?.name ?? "Completo"})`;
  }
  return `${niveles.length} niveles × ${horasNivel} h = ${total} h (${niveles.map((n) => n.name).join(" + ")})`;
}

/** «20 horas por nivel (40 horas en total) · 2 niveles: Básico-Intermedio, Avanzado». */
function duracionTexto(curso: Course): string {
  const niveles = levelsForView(curso, "publico");
  const horasNivel = catalogHours(curso);
  const total = horasTotalesCurso(curso);
  if (niveles.length === 0) return `${horasNivel} horas`;
  if (niveles.length === 1) {
    return `${horasNivel} horas · 1 nivel (${niveles[0].name})`;
  }
  return `${horasNivel} horas por nivel (${total} horas en total) · ${niveles.length} niveles: ${niveles.map((nivel) => nivel.name).join(", ")}`;
}

/** Encabezado común: título, resumen y las líneas propias de cada archivo. */
function encabezado(titulo: string, propias: string[]): string[] {
  return [`# ${titulo}`, "", `> ${RESUMEN}`, "", ...propias, ""];
}

/** Cursos agrupados en 1 nivel vs 2 niveles, con horas reales y arancel vigente en Chile. */
function bloqueCursos(): string[] {
  const unNivel = CURSOS.filter((curso) => levelsForView(curso, "publico").length <= 1);
  const dosNiveles = CURSOS.filter((curso) => levelsForView(curso, "publico").length > 1);
  const lineas = [
    `## Cursos (${CURSOS.length})`,
    `El catálogo distingue entre ${unNivel.length} cursos de 1 nivel y ${dosNiveles.length} cursos de 2 niveles (cada nivel se inscribe por separado):`,
    "",
    `### Cursos de 1 nivel (${unNivel.length})`,
  ];
  for (const curso of unNivel) {
    lineas.push(
      `- ${md(curso.title, url(`/cursos/${curso.slug}`))}: ${duracionCorta(curso)} · ${precioTransparenteTexto(ISO_CHILE, curso.slug)} · ${curso.shortDescription}`
    );
  }
  lineas.push("", `### Cursos de 2 niveles (${dosNiveles.length})`);
  for (const curso of dosNiveles) {
    lineas.push(
      `- ${md(curso.title, url(`/cursos/${curso.slug}`))}: ${duracionCorta(curso)} · ${precioTransparenteTexto(ISO_CHILE, curso.slug)} por nivel · ${curso.shortDescription}`
    );
  }
  lineas.push("");
  return lineas;
}

/** Ficha completa de cada curso, para `llms-full.txt`. */
function bloqueCursosDetalle(): string[] {
  const lineas = [`## Cursos (${CURSOS.length})`];
  lineas.push(
    `Cada ficha declara horas por nivel y totales, requisitos y el arancel vigente en Chile (con precio normal, porcentaje de descuento y ${textoCuotas(ISO_CHILE)}). El temario completo y las fechas de inicio se descargan en el PDF de cada curso.`
  );
  lineas.push("");
  for (const curso of CURSOS) {
    const porNivel = levelsForView(curso, "publico").length > 1 ? " por nivel" : "";
    lineas.push(`### ${curso.title}`);
    lineas.push(`- URL: ${md(curso.title, url(`/cursos/${curso.slug}`))}`);
    lineas.push(`- Resumen: ${curso.shortDescription}`);
    lineas.push(`- Nivel: ${nivelTexto(curso)}`);
    lineas.push(`- Duración y estructura: ${duracionTexto(curso)}`);
    lineas.push(
      `- Arancel Chile: ${precioTransparenteTexto(ISO_CHILE, curso.slug)}${porNivel} (${textoCuotas(ISO_CHILE)}) · ${md("PDF de temario y precios", url(courseBrochurePath(curso.slug, ISO_CHILE)))} con temario completo y próximas fechas.`
    );
    lineas.push("");
  }
  return lineas;
}

function bloqueLandings(): string[] {
  const lineas = ["## Landings de nicho"];
  for (const landing of LANDINGS_NICHO) {
    lineas.push(`- ${md(landing.nombre, url(landing.path))}: ${landing.resumen}`);
  }
  lineas.push("");
  return lineas;
}

/** Tabla resumen por país para `/llms.txt` con aranceles vigentes, precios normales y descuentos. */
function bloquePrecios(): string[] {
  const lineas = [
    "## Precios por país",
    `Aranceles vigentes publicados en la moneda de cada país (precio con descuento, precio normal y porcentaje de descuento), con ${textoCuotas()} salvo en Estados Unidos y España, donde el pago es único con tarjeta. El temario detallado y las fechas de cada cohorte se descargan en el PDF de cada curso.`,
    "",
    "| País | Moneda | Estándar (20 h*) | Análisis de Datos / Minería | Mercado Financiero (30 h) | Cuotas | Página |",
    "|---|---|---|---|---|---|---|",
  ];

  const mercadosPrincipales = MERCADOS_MATRIZ.map((iso) => getPais(iso));
  const otrosPublicados = PAISES_PUBLICADOS.filter(
    (pais) => !MERCADOS_MATRIZ_SET.has(pais.iso) && tienePrecioPublico(pais.iso)
  );
  const sinPrecio = PAISES_PUBLICADOS.filter((pais) => !tienePrecioPublico(pais.iso));

  for (const pais of [...mercadosPrincipales, ...otrosPublicados]) {
    const href = url(rutaLocal(pais.iso, "/precios"));
    lineas.push(
      `| ${pais.nombre} | ${pais.moneda} | ${precioTransparenteTexto(pais.iso, "power-bi")} | ${precioTransparenteTexto(pais.iso, "analisis-de-datos")} | ${precioTransparenteTexto(pais.iso, "mercado-financiero")} | ${cuotasCelda(pais.iso)} | ${md(`/precios`, href)} |`
    );
  }
  for (const pais of sinPrecio) {
    const href = url(rutaLocal(pais.iso, "/precios"));
    lineas.push(
      `| ${pais.nombre} | ${pais.moneda} | Consulta por WhatsApp | Consulta por WhatsApp | Consulta por WhatsApp | ${textoCuotas(pais.iso)} | ${md(`/precios`, href)} |`
    );
  }

  lineas.push(
    "",
    "* Cursos estándar de 20 h por nivel: Power BI, SQL Server, Python, Excel, Machine Learning, Copilot, Claude, ChatGPT, Gemini, Power Automate, IA en Productividad y Microsoft Access.",
    ""
  );
  return lineas;
}

/** Matriz detallada por curso y por país para `/llms-full.txt`, tomada de `config/pricing.ts`. */
function bloquePreciosDetalle(): string[] {
  const mercados = MERCADOS_MATRIZ.map((iso) => getPais(iso));
  const otrosUsd = PAISES_PUBLICADOS.filter(
    (pais) => !MERCADOS_MATRIZ_SET.has(pais.iso) && tienePrecioPublico(pais.iso)
  );
  const sinPrecio = PAISES_PUBLICADOS.filter((pais) => !tienePrecioPublico(pais.iso));

  const lineas = [
    "## Aranceles por país y por curso",
    `Cada celda informa el arancel vigente por nivel/programa junto a su precio normal y porcentaje de descuento en la moneda de cada mercado (fuente: \`config/pricing.ts\`), pagadero en ${textoCuotas()} (en Estados Unidos y España, pago único con tarjeta). El temario detallado y las fechas exactas de inicio se descargan en el PDF de cada curso.`,
    "",
    "### Mercados principales en moneda local (Chile, Argentina, México, Perú, Colombia, Uruguay y España)",
    "",
    `| Curso | Estructura | ${mercados.map((p) => `${p.nombre} (${p.moneda})`).join(" | ")} |`,
    `|---|---|${mercados.map(() => "---").join("|")}|`,
  ];

  for (const curso of CURSOS) {
    const celdas = mercados.map((pais) => precioTransparenteTexto(pais.iso, curso.slug));
    lineas.push(`| ${md(curso.title, url(`/cursos/${curso.slug}`))} | ${duracionCorta(curso)} | ${celdas.join(" | ")} |`);
  }

  if (otrosUsd.length > 0) {
    lineas.push(
      "",
      "### Otros mercados indexables publicados (USD)",
      "",
      "| País | Moneda | Estándar | Análisis de Datos / Minería | Mercado Financiero | Cuotas | Página |",
      "|---|---|---|---|---|---|---|"
    );
    for (const pais of otrosUsd) {
      lineas.push(
        `| ${pais.nombre} | ${pais.moneda} | ${precioTransparenteTexto(pais.iso, "power-bi")} | ${precioTransparenteTexto(pais.iso, "analisis-de-datos")} | ${precioTransparenteTexto(pais.iso, "mercado-financiero")} | ${cuotasCelda(pais.iso)} | ${md(`Precios ${pais.nombre}`, url(rutaLocal(pais.iso, "/precios")))} |`
      );
    }
  }

  if (sinPrecio.length > 0) {
    lineas.push("", "### Países sin precio público aprobado");
    for (const pais of sinPrecio) {
      lineas.push(
        `- ${pais.nombre} (${md(`Precios ${pais.nombre}`, url(rutaLocal(pais.iso, "/precios")))}): sin precio público aprobado; el arancel vigente y el PDF de temario y precios se consultan por WhatsApp (${md(WHATSAPP_TEXTO, WHATSAPP)}), con ${textoCuotas(pais.iso)}.`
      );
    }
  }

  lineas.push(
    "",
    "Nota: los aranceles publicados ya incluyen el porcentaje de descuento indicado respecto al precio normal; cupones adicionales y las fechas de próximas cohortes se entregan en el PDF de temario y precios de cada curso.",
    ""
  );
  return lineas;
}

/** Cuotas, certificado, horario y compatibilidad: lo que no se negocia. */
function bloquePoliticas(): string[] {
  return [
    "## Políticas y condiciones",
    `- Cuotas: ${NOTA_CUOTAS} Aplica en todos los países salvo Estados Unidos y España (allí el pago es único con tarjeta), con ${MEDIOS_CUOTAS.join(" o ")}; la disponibilidad final la confirma la pasarela en el checkout.`,
    `- Horario: clases en vivo por Zoom de ${HORA_CLASE_CHILE.inicio} a ${HORA_CLASE_CHILE.fin} hora de Chile, dos veces por semana; cada país ve el equivalente en su hora local.`,
    "- Campus virtual: acceso al campus virtual con las clases y el material usado para que puedas practicar durante el curso.",
    `- Certificado: al completar el curso se entrega un certificado de ProgramBI, incluido en el valor, con un código público con formato PBI-XXX-XXXXXX que se verifica en ${md("verificar-certificado", url("/verificar-certificado"))}. La ficha pública de cada certificado se abre desde su código en \`/certificado/<codigo>\`.`,
    "- Certificación PL-300: es un examen de Microsoft, distinto del certificado de ProgramBI; se rinde y se paga aparte.",
    "- Mac: Power BI Desktop funciona solo en Windows. En macOS se trabaja con Power BI web desde el navegador.",
    "",
  ];
}

/** Lista corta y consistente con las fichas y config real, para el resumen. */
function bloqueDatosClave(): string[] {
  const unNivel20 = CURSOS.filter(
    (c) => levelsForView(c, "publico").length === 1 && catalogHours(c) === 20
  );
  const unNivel30 = CURSOS.filter(
    (c) => levelsForView(c, "publico").length === 1 && catalogHours(c) === 30
  );
  const dosNiveles20 = CURSOS.filter(
    (c) => levelsForView(c, "publico").length === 2 && catalogHours(c) === 20
  );
  const dosNiveles60 = CURSOS.filter(
    (c) => levelsForView(c, "publico").length === 2 && catalogHours(c) === 60
  );

  return [
    "## Datos clave",
    `- Trayectoria y respaldo (E-E-A-T): +5.000 estudiantes formados, 30+ clientes corporativos y 100% clases en vivo.`,
    `- Catálogo: ${CURSOS.length} cursos con ficha propia, divididos en programas de 1 nivel y de 2 niveles.`,
    `- Cursos de 1 nivel: ${unNivel20.map((c) => c.title).join(", ")} (20 horas cada uno) y ${unNivel30.map((c) => c.title).join(", ")} (30 horas).`,
    `- Cursos de 2 niveles: ${dosNiveles20.map((c) => c.title).join(", ")} (Básico-Intermedio 20 h + Avanzado 20 h = 40 h totales) y ${dosNiveles60.map((c) => c.title).join(", ")} (Básico-Intermedio 60 h + Avanzado 60 h = 120 h totales).`,
    `- Modalidad: clases en vivo por Zoom, dos veces por semana, de ${HORA_CLASE_CHILE.inicio} a ${HORA_CLASE_CHILE.fin} hora de Chile; cada versión por país muestra su hora local.`,
    "- Certificado: incluido al completar el curso, con código público verificable en línea.",
    `- Aranceles vigentes: en Chile, ${resumenPreciosPais(ISO_CHILE)} (${textoCuotas(ISO_CHILE)}), con tablas en moneda local para Argentina, México, Perú, Colombia, Uruguay y España; las fechas de inicio están en el PDF de temario de cada curso.`,
    "- Campus virtual: acceso al campus virtual con las clases y material usado para que puedas practicar durante el curso.",
    "",
  ];
}

/** Todas las guías publicadas, agrupadas por país, incluyendo el listicle Power BI Chile 2026. */
function bloqueGuiasDetalle(): string[] {
  const lineas = [`## Guías publicadas (${GUIAS_PUBLICADAS.length + 1})`];
  lineas.push(
    "Las transversales aplican a todos los países; el resto tiene la versión de su mercado. Cada línea indica la fecha de actualización."
  );
  lineas.push("");

  const transversal = GUIAS_PUBLICADAS.filter((guia) => guia.country === "transversal");
  if (transversal.length > 0) {
    lineas.push("### Transversales");
    for (const guia of transversal) {
      lineas.push(`- ${md(guia.h1, url(guia.path))} — ${guia.description} · actualizada ${guia.updated}`);
    }
    lineas.push("");
  }

  for (const pais of PAISES) {
    const guias = GUIAS_PUBLICADAS.filter((guia) => guia.country === pais.iso);
    if (guias.length === 0 && pais.iso !== ISO_CHILE) continue;
    lineas.push(`### ${pais.nombre}`);
    if (pais.iso === ISO_CHILE) {
      lineas.push(
        `- ${md("Mejores cursos de Power BI en Chile (2026)", url(RUTA_LISTICLE))} — Comparativa con datos de precio, horas en vivo, formato y certificado de opciones verificadas en Chile.`
      );
    }
    for (const guia of guias) {
      lineas.push(`- ${md(guia.h1, url(guia.path))} — ${guia.description} · actualizada ${guia.updated}`);
    }
    lineas.push("");
  }
  return lineas;
}

/** Comparativas de herramientas y de academias, desde los mismos datos del sitemap. */
function bloqueComparativas(): string[] {
  const lineas = ["## Comparativas"];
  lineas.push(
    `- ${md("Índice de comparativas", url("/versus"))}: todas las comparativas de herramientas y academias, su veredicto y la fecha de revisión.`
  );
  for (const comp of comparisons) {
    lineas.push(`- ${md(comp.title, url(`/versus/${comp.slug}`))}: ${comp.seoDescription}`);
  }
  for (const tarjeta of comparativasAcademiaHub()) {
    lineas.push(`- ${md(tarjeta.title, url(tarjeta.href))}: ${tarjeta.description}`);
  }
  lineas.push("");
  return lineas;
}

function bloqueHerramientas(conDetalle = false): string[] {
  const lineas = [
    "## Herramientas gratuitas, plantillas y recursos",
    `- ${md("Biblioteca de plantillas y datasets (Power BI, DAX, SQL y Python)", url("/plantillas"))}: 8 recursos descargables gratuitos con datasets CSV, medidas DAX, ejercicios SQL y notebooks.`,
    `- ${md("Simulador gratuito examen Microsoft PL-300", url("/simulador-pl-300"))}: 40 preguntas técnicas en español por dominio oficial, puntaje sobre 1000 y explicaciones.`,
    `- ${md("Conversor de fórmulas Excel a DAX", url("/herramientas/excel-a-dax"))}: traductor interactivo con 28 equivalencias clave de Excel a DAX para Power BI.`,
    `- ${md("Benchmark y calculadora de sueldos analista de datos Chile", url("/sueldos-analista-datos-chile"))}: rangos salariales referenciales en Chile y calculadora Bruto ↔ Líquido.`,
    `- ${md("Diagnóstico de madurez analítica para empresas", url("/empresas/diagnostico"))}: autoevaluación gratuita para equipos y áreas de datos.`,
    `- ${md("Calculadora de capacitación corporativa", url("/empresas/calculadora-capacitacion"))}: estimación de impacto y ahorro en horas para programas B2B.`,
  ];

  if (conDetalle) {
    lineas.push("", "### Plantillas descargables incluidas");
    for (const p of PLANTILLAS) {
      lineas.push(`- ${md(p.title, url(`/plantillas/${p.slug}`))} (${p.category} · ${p.tool}): ${p.summary}`);
    }
  }

  lineas.push("");
  return lineas;
}

/** Preguntas frecuentes principales, resueltas por id contra `lib/faq`. */
function bloqueFaq(): string[] {
  const contenido = faqDePais(ISO_CHILE);
  const lineas = ["## Preguntas frecuentes"];
  lineas.push(
    `Selección de las preguntas principales. El listado completo con horarios y medios de pago por país está en ${md("preguntas frecuentes", url("/preguntas-frecuentes"))}.`
  );
  lineas.push("");
  for (const seccion of contenido.secciones) {
    const items = seccion.items.filter((item) => IDS_FAQ.has(item.id));
    if (items.length === 0) continue;
    lineas.push(`### ${seccion.titulo}`);
    for (const item of items) {
      lineas.push(`- ${item.pregunta} ${item.respuesta}`);
    }
    lineas.push("");
  }
  return lineas;
}

/**
 * Institucional y E-E-A-T: credenciales verificables de `lib/data/mentors.ts` y
 * métricas públicas de `/nosotros`.
 */
function bloqueInstitucional(conDetalleDocente = false): string[] {
  const lineas = [
    "## Institucional y respaldo (E-E-A-T)",
    `- Métricas verificadas (${md("Nosotros", url("/nosotros"))}): +5.000 estudiantes formados, 100% clases en vivo e interactivas y 30+ clientes corporativos.`,
    `- ${md("Equipo docente", url("/profesores"))}: ${EQUIPO_INDEXABLE.length} profesores con perfil publicado y formación en la Universidad de Concepción (UdeC), Universidad Adolfo Ibáñez (UAI), Universidad de Chile y UC.`,
    `- ${md("Testimonios de alumnos", url("/casos"))}: citas verificables de egresados de Power BI, SQL Server, Python y Análisis de Datos.`,
    `- ${md("Política de privacidad", url("/privacidad"))}.`,
    `- ${md("Términos y condiciones", url("/terminos"))}.`,
  ];

  if (conDetalleDocente) {
    lineas.push("", "### Cuerpo docente");
    const ordenados = [...mentors].sort((a, b) => a.sortOrder - b.sortOrder);
    for (const mentor of ordenados) {
      const miembro = EQUIPO_INDEXABLE.find((item) => item.nombre === mentor.name);
      const etiqueta = miembro ? md(mentor.name, url(rutaPerfil(miembro.slug))) : mentor.name;
      lineas.push(
        `- ${etiqueta} (${mentor.role} · ${mentor.title}): ${mentor.credentials.join(" ")} (${mentor.studentCount.toLocaleString("es-CL")}+ alumnos, ${mentor.yearsExperience}+ años de experiencia).`
      );
    }
  }

  lineas.push("");
  return lineas;
}

function bloqueOtrasPaginas(): string[] {
  return [
    "## Otras páginas",
    `- ${md("Catálogo de cursos", url("/cursos"))}`,
    `- ${md("Precios Chile", url("/precios"))}`,
    `- ${md("Capacitación para empresas", url("/empresas"))}`,
    `- ${md("Implementación de Power BI", url("/implementacion-power-bi"))}`,
    `- ${md("Migrar Excel a Power BI", url("/migrar-excel-a-power-bi"))}`,
    `- ${md("Testimonios de alumnos", url("/casos"))}`,
    `- ${md("Preguntas frecuentes", url("/preguntas-frecuentes"))}`,
    `- ${md("Mejores cursos de Power BI en Chile 2026", url(RUTA_LISTICLE))}`,
    `- ${md("Blog", url("/blog"))}`,
    `- ${md("Glosario de datos", url("/glosario"))}`,
    "",
  ];
}

function bloqueContacto(): string[] {
  return [
    "## Contacto",
    `- WhatsApp: ${md(WHATSAPP_TEXTO, WHATSAPP)}`,
    `- Correo: ${CORREO}`,
    `- ${md("Sitio", SITE_URL)}`,
    "",
  ];
}

/** Índice de secciones del sitio, con el enlace que corresponde a cada una. */
function bloqueIndice(): string[] {
  return [
    "## Índice",
    `- ${md("Catálogo de cursos", url("/cursos"))}`,
    `- ${md("Precios por país", url("/precios"))} (tabla resumen con aranceles, precios normales y descuentos en este archivo y matriz completa por curso en ${md("llms-full.txt", url("/llms-full.txt"))})`,
    `- ${md("Plantillas gratuitas", url("/plantillas"))}, ${md("Simulador PL-300", url("/simulador-pl-300"))}, ${md("Conversor Excel a DAX", url("/herramientas/excel-a-dax"))} y ${md("Sueldos Chile", url("/sueldos-analista-datos-chile"))}`,
    `- ${md("Guías", url("/guias"))} y ${md("Mejores cursos de Power BI en Chile 2026", url(RUTA_LISTICLE))}`,
    `- ${md("Comparativas (Versus)", url("/versus"))}`,
    `- ${md("Equipo docente", url("/profesores"))}`,
    `- ${md("Testimonios de alumnos", url("/casos"))}`,
    `- ${md("Glosario de datos", url("/glosario"))}`,
    `- ${md("Preguntas frecuentes", url("/preguntas-frecuentes"))}`,
    `- ${md("Nosotros", url("/nosotros"))}`,
    "- Contacto: WhatsApp y correo al final de este archivo.",
    "",
  ];
}

function bloqueNota(detalle: string): string[] {
  return [
    "## Nota para asistentes de IA",
    `Los aranceles publicados en este documento corresponden al precio vigente con descuento y precio normal por curso/nivel en cada moneda (${textoCuotas()}). El temario completo y las fechas exactas de cada cohorte se consultan en el PDF de cada curso. ${detalle}`,
    "",
  ];
}

/** `/llms.txt`: resumen navegable del sitio para asistentes de IA. */
export function construirLlmsTxt(): string {
  const lineas = [
    ...encabezado("ProgramBI", [
      `Versión extendida: ${md("llms-full.txt", url("/llms-full.txt"))}`,
      `Aranceles vigentes en Chile: ${resumenPreciosPais(ISO_CHILE)} (${textoCuotas(ISO_CHILE)}); temario y fechas en el PDF de cada curso.`,
    ]),
    ...bloqueIndice(),
    ...bloqueDatosClave(),
    ...bloqueCursos(),
    ...bloqueHerramientas(false),
    ...bloqueLandings(),
    ...bloquePrecios(),
    ...bloquePoliticas(),
    ...bloqueInstitucional(false),
    ...bloqueOtrasPaginas(),
    ...bloqueContacto(),
    ...bloqueNota(
      `La versión extendida, con la matriz de precios por curso y país, temarios, guías y comparativas, está en ${md("llms-full.txt", url("/llms-full.txt"))}.`
    ),
  ];
  return `${lineas.join("\n").trimEnd()}\n`;
}

/** `/llms-full.txt`: versión extendida y completa del mismo contenido. */
export function construirLlmsFullTxt(): string {
  const lineas = [
    ...encabezado("ProgramBI — información completa", [
      `Versión completa de ${md("llms.txt", url("/llms.txt"))}.`,
      `Aranceles vigentes en moneda local con precio normal y porcentaje de descuento (${textoCuotas()}); temario y fechas en el PDF de cada curso. Contacto: ${CORREO} · WhatsApp ${md(WHATSAPP_TEXTO, WHATSAPP)}.`,
      "",
      "## Índice",
      "- Datos clave y trayectoria E-E-A-T (+5.000 estudiantes, 30+ clientes corporativos, 100% clases en vivo)",
      `- Cursos (${CURSOS.length}): distinción entre programas de 1 nivel y 2 niveles, horas, precio Chile y PDF`,
      "- Herramientas gratuitas, plantillas (8) y recursos interactivos",
      "- Aranceles por país y por curso (matriz en moneda local + mercados USD)",
      `- Guías publicadas (${GUIAS_PUBLICADAS.length + 1}), con título, URL, descripción y fecha de actualización`,
      "- Comparativas de herramientas y academias",
      "- Preguntas frecuentes principales",
      "- Políticas y condiciones",
      "- Landings de nicho",
      "- Institucional, docentes, otras páginas y contacto",
    ]),
    ...bloqueDatosClave(),
    ...bloqueCursosDetalle(),
    ...bloqueHerramientas(true),
    ...bloqueLandings(),
    ...bloquePreciosDetalle(),
    ...bloqueGuiasDetalle(),
    ...bloqueComparativas(),
    ...bloqueFaq(),
    ...bloquePoliticas(),
    ...bloqueInstitucional(true),
    ...bloqueOtrasPaginas(),
    ...bloqueContacto(),
    ...bloqueNota(
      `El resumen corto, pensado para una primera lectura, está en ${md("llms.txt", url("/llms.txt"))}.`
    ),
  ];
  return `${lineas.join("\n").trimEnd()}\n`;
}

/** Cabeceras de los dos endpoints: texto plano generado desde archivos; se actualiza al desplegar. */
export function cabecerasLlms(): Record<string, string> {
  return {
    "Content-Type": "text/plain; charset=utf-8",
    "Cache-Control": "public, max-age=0, s-maxage=86400, stale-while-revalidate=86400",
  };
}
