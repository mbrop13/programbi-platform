/**
 * Contenido de `/llms.txt` y `/llms-full.txt`.
 *
 * Regla de la casa: acá no se escribe a mano ningún monto, hora, cuota ni
 * cantidad de cursos. Todo sale de las mismas fuentes que usan las fichas, el
 * sitemap y el checkout (`config/` y `lib/data/`); si mañana cambia un precio
 * o un horario, los dos archivos cambian con él.
 *
 * `construirLlmsTxt()` es el resumen (el archivo corto que leen los asistentes
 * primero) y `construirLlmsFullTxt()` la versión extendida: todos los cursos,
 * la tabla de precios por país y por curso, todas las guías publicadas, las
 * comparativas, las preguntas frecuentes principales y las políticas.
 *
 * TODO_MANU: `/profesores` existe en la rama de equipo (`feat/f5-equipo`)
 * detrás de `EQUIPO_PUBLICADO`, pero `lib/data/equipo.ts` todavía no está en
 * esta rama. Al integrar, importar el flag y agregar la línea marcada en
 * `bloqueInstitucional()` solo cuando sea `true`.
 */

import { MEDIOS_CUOTAS, NOTA_CUOTAS, textoCuotas } from "@/config/cuotas";
import { esIndexable, getPais, ISO_CHILE, PAISES } from "@/config/paises";
import { PRECIOS_VALID_FROM, precioPublico, tienePrecioPublico } from "@/config/pricing";
import { comparativasAcademiaHub } from "@/lib/data/academias";
import { comparisons } from "@/lib/data/comparisons";
import { courses, getGroupedCourses, type Course } from "@/lib/data/courses";
import { catalogHours, levelsForView } from "@/lib/data/course-views";
import { EQUIPO_PUBLICADO } from "@/lib/data/equipo";
import { faqDePais } from "@/lib/faq/contenido";
import { GUIAS } from "@/lib/guias/generado";
import { HORA_CLASE_CHILE } from "@/lib/paises/horarios";
import { formatMoneda } from "@/lib/paises/precios";
import { rutaLocal } from "@/lib/paises/rutas";
import { SITE_URL } from "@/lib/seo";

/** Resumen que encabeza los dos archivos. Debe ser el mismo en ambos. */
const RESUMEN =
  "ProgramBI es una academia de datos en español: cursos en vivo de Power BI, SQL Server, Python, análisis de datos e IA, con grabaciones de por vida y certificado. Se dicta desde Chile para toda Latinoamérica, con precios y horarios por país.";

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

/** Fecha de vigencia de la lista de precios, en ISO corto. */
const VIGENTE_DESDE = PRECIOS_VALID_FROM.slice(0, 10);

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
    path: "/analisis-de-datos-mineria",
    nombre: "Análisis de datos para minería",
    resumen: "Análisis de datos aplicado a profesionales mineros e industriales.",
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
 *
 * Quedan fuera las respuestas que enumeran países o cursos con una lista fija
 * («Chile, Argentina, México…»): esa lista se desactualiza frente a
 * `config/paises.ts` y al catálogo, y contradiría las tablas de este archivo.
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

/** Monto en la moneda del país, o `null` si ese curso no tiene precio público ahí. */
function precioTexto(iso: string, slug: string): string | null {
  const monto = precioPublico(iso, slug);
  return monto == null ? null : formatMoneda(iso, monto);
}

function precioLinea(iso: string, slug: string): string {
  return precioTexto(iso, slug) ?? "consulta por WhatsApp";
}

/** Países que se publican: los indexables más los que todavía no tienen precio (hoy Paraguay). */
const PAISES_PUBLICADOS = PAISES.filter((pais) => pais.indexable || !tienePrecioPublico(pais.iso));

/** Nivel del curso tal como está cargado en el catálogo, con la inicial en mayúscula. */
function nivelTexto(curso: Course): string {
  const nivel = curso.level.trim();
  return nivel ? nivel.charAt(0).toUpperCase() + nivel.slice(1) : "No declarado";
}

/** «20 horas por nivel · 2 niveles: Básico-Intermedio, Avanzado». */
function duracionTexto(curso: Course): string {
  const niveles = levelsForView(curso, "publico");
  const horas = catalogHours(curso);
  const unidad = niveles.length > 1 ? `${horas} horas por nivel` : `${horas} horas`;
  if (niveles.length === 0) return unidad;
  const etiqueta = niveles.length === 1 ? "1 nivel" : `${niveles.length} niveles`;
  return `${unidad} · ${etiqueta}: ${niveles.map((nivel) => nivel.name).join(", ")}`;
}

/** Encabezado común: título, resumen y las líneas propias de cada archivo. */
function encabezado(titulo: string, propias: string[]): string[] {
  return [`# ${titulo}`, "", `> ${RESUMEN}`, "", ...propias, ""];
}

/** Cursos en una línea cada uno: nombre, URL, horas y resumen. */
function bloqueCursos(): string[] {
  const lineas = [`## Cursos (${CURSOS.length})`];
  for (const curso of CURSOS) {
    lineas.push(
      `- ${md(curso.title, url(`/cursos/${curso.slug}`))}: ${catalogHours(curso)} horas · ${curso.shortDescription}`
    );
  }
  lineas.push("");
  return lineas;
}

/** Ficha completa de cada curso, para `llms-full.txt`. */
function bloqueCursosDetalle(): string[] {
  const lineas = [`## Cursos (${CURSOS.length})`];
  lineas.push(
    "Cada ficha declara horas, nivel, precios por país y inscripción. El precio de la línea es el de Chile; la tabla completa está en la sección de precios.",
  );
  lineas.push("");
  for (const curso of CURSOS) {
    lineas.push(`### ${curso.title}`);
    lineas.push(`- URL: ${md(curso.title, url(`/cursos/${curso.slug}`))}`);
    lineas.push(`- Resumen: ${curso.shortDescription}`);
    lineas.push(`- Nivel: ${nivelTexto(curso)}`);
    lineas.push(`- Duración: ${duracionTexto(curso)}`);
    lineas.push(`- Precio en Chile: ${precioLinea(ISO_CHILE, curso.slug)}`);
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

/** Precios agrupados por monto: evita repetir el mismo valor trece veces. */
function gruposDePrecio(iso: string): { precio: string; slugs: string[] }[] {
  const grupos = new Map<string, string[]>();
  for (const curso of CURSOS) {
    const precio = precioTexto(iso, curso.slug);
    if (!precio) continue;
    const slugs = grupos.get(precio);
    if (slugs) slugs.push(curso.slug);
    else grupos.set(precio, [curso.slug]);
  }
  return [...grupos].map(([precio, slugs]) => ({ precio, slugs }));
}

/** Una línea por país con los montos agrupados por curso. */
function bloquePrecios(): string[] {
  const lineas = ["## Precios por país"];
  lineas.push(
    `Lista vigente desde ${VIGENTE_DESDE}. Cada país muestra el monto en su moneda; el cargo final lo define el banco al pagar con tarjeta internacional.`
  );
  lineas.push("Los cursos se agrupan por monto y se nombran por su slug (ver sección de cursos).");
  for (const pais of PAISES_PUBLICADOS) {
    const href = url(rutaLocal(pais.iso, "/precios"));
    const grupos = gruposDePrecio(pais.iso);
    if (grupos.length === 0) {
      lineas.push(
        `- ${md(pais.nombre, href)}: precio pendiente de publicación; se consulta por WhatsApp.`
      );
      continue;
    }
    const detalle = grupos.map((grupo) => `${grupo.precio}: ${grupo.slugs.join(", ")}`).join(" · ");
    lineas.push(`- ${md(pais.nombre, href)}: ${detalle}`);
  }
  lineas.push("");
  return lineas;
}

/** Tabla de texto país por país, con todos los cursos y su precio. */
function bloquePreciosDetalle(): string[] {
  const lineas = ["## Precios por país y por curso"];
  lineas.push(
    `Lista vigente desde ${VIGENTE_DESDE}. Los montos salen de \`config/pricing.ts\` y se publican en la moneda de cada país.`
  );
  lineas.push("");
  for (const pais of PAISES_PUBLICADOS) {
    lineas.push(`### ${pais.nombre} — ${pais.moneda}`);
    lineas.push(
      md(`Precios de ${pais.nombre}`, url(rutaLocal(pais.iso, "/precios"))),
    );
    if (!tienePrecioPublico(pais.iso)) {
      lineas.push("Sin precio público aprobado: el valor de cada curso se consulta por WhatsApp.");
      lineas.push("");
      continue;
    }
    lineas.push("");
    lineas.push("| Curso | Precio |");
    lineas.push("| --- | --- |");
    for (const curso of CURSOS) {
      lineas.push(`| ${curso.title} | ${precioLinea(pais.iso, curso.slug)} |`);
    }
    lineas.push("");
  }
  return lineas;
}

/** Cuotas, certificado, horario y compatibilidad: lo que no se negocia. */
function bloquePoliticas(): string[] {
  return [
    "## Políticas y condiciones",
    `- Cuotas: ${NOTA_CUOTAS} Aplica en todos los países, con ${MEDIOS_CUOTAS.join(" o ")}; la disponibilidad final la confirma la pasarela en el checkout.`,
    `- Horario: clases en vivo por Zoom de ${HORA_CLASE_CHILE.inicio} a ${HORA_CLASE_CHILE.fin} hora de Chile, dos veces por semana; cada país ve el equivalente en su hora local.`,
    "- Grabaciones: cada sesión queda grabada y disponible de por vida en el campus del curso.",
    `- Certificado: al completar el curso se entrega un certificado de ProgramBI, incluido en el valor, con un código público con formato PBI-XXX-XXXXXX que se verifica en ${md("verificar-certificado", url("/verificar-certificado"))}. La ficha pública de cada certificado se abre desde su código en \`/certificado/<codigo>\`.`,
    "- Certificación PL-300: es un examen de Microsoft, distinto del certificado de ProgramBI; se rinde y se paga aparte.",
    "- Mac: Power BI Desktop funciona solo en Windows. En macOS se trabaja con Power BI web desde el navegador.",
    "",
  ];
}

/** Lista corta y consistente con las fichas, para el resumen. */
function bloqueDatosClave(): string[] {
  const horas = CURSOS.map((curso) => catalogHours(curso));
  const preciosChile = gruposDePrecio(ISO_CHILE)
    .map((grupo) => `${grupo.precio}: ${grupo.slugs.join(", ")}`)
    .join(" · ");
  return [
    "## Datos clave",
    `- Cursos: ${CURSOS.length} en el catálogo, cada uno con ficha, nivel y horas propias.`,
    `- Duración: de ${Math.min(...horas)} a ${Math.max(...horas)} horas por curso, según el programa; cada ficha declara las horas de su nivel.`,
    `- Modalidad: clases en vivo por Zoom, dos veces por semana, de ${HORA_CLASE_CHILE.inicio} a ${HORA_CLASE_CHILE.fin} hora de Chile; la ficha de cada país muestra su hora local.`,
    "- Certificado: incluido al completar el curso, con código público que se verifica en línea.",
    `- Cuotas: ${textoCuotas()}.`,
    "- Grabaciones: cada clase queda grabada y disponible de por vida en el campus.",
    `- Precio en Chile por curso: ${preciosChile}.`,
    `- Precios por país: la tabla completa, curso por curso, está en ${md("llms-full.txt", url("/llms-full.txt"))} y en la página de precios de cada país (${md("precios", url("/precios"))}).`,
    "",
  ];
}

/** Todas las guías publicadas, agrupadas por país. */
function bloqueGuiasDetalle(): string[] {
  const lineas = [`## Guías publicadas (${GUIAS_PUBLICADAS.length})`];
  lineas.push(
    "Las transversales aplican a todos los países; el resto tiene la versión de su mercado. Cada línea indica la fecha de actualización.",
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
    if (guias.length === 0) continue;
    lineas.push(`### ${pais.nombre}`);
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
    `- ${md("Índice de comparativas", url("/versus"))}: todas las comparativas, su veredicto y la fecha de revisión.`
  );
  for (const comp of comparisons) {
    lineas.push(`- ${md(comp.title, url(`/versus/${comp.slug}`))}: ${comp.seoDescription}`);
  }
  // El listicle de academias vive en /guias, no en /versus: se filtra para no duplicarlo.
  for (const tarjeta of comparativasAcademiaHub()) {
    if (!tarjeta.href.startsWith("/versus/")) continue;
    lineas.push(`- ${md(tarjeta.title, url(tarjeta.href))}: ${tarjeta.description}`);
  }
  lineas.push("");
  return lineas;
}

/** Preguntas frecuentes principales, resueltas por id contra `lib/faq`. */
function bloqueFaq(): string[] {
  const contenido = faqDePais(ISO_CHILE);
  const lineas = ["## Preguntas frecuentes"];
  lineas.push(
    `Selección de las preguntas principales. El listado completo, con tablas de precio y horario por país, está en ${md("preguntas frecuentes", url("/preguntas-frecuentes"))}.`
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
 * Institucional.
 *
 * `/profesores` solo se anuncia cuando `EQUIPO_PUBLICADO` está encendido: con
 * el flag apagado la ruta responde 200 pero noindex y no está en el sitemap.
 */
function bloqueInstitucional(): string[] {
  return [
    "## Institucional",
    `- ${md("Nosotros", url("/nosotros"))}: origen de la academia, metodología de clases en vivo y quién dicta los cursos.`,
    ...(EQUIPO_PUBLICADO ? [`- ${md("Profesores", url("/profesores"))}: equipo docente y perfiles.`] : []),
    `- ${md("Política de privacidad", url("/privacidad"))}.`,
    `- ${md("Términos y condiciones", url("/terminos"))}.`,
    "",
  ];
}

function bloqueOtrasPaginas(): string[] {
  return [
    "## Otras páginas",
    `- ${md("Catálogo de cursos", url("/cursos"))}`,
    `- ${md("Precios Chile", url("/precios"))}`,
    `- ${md("Capacitación para empresas", url("/empresas"))}`,
    `- ${md("Implementación de Power BI", url("/implementacion-power-bi"))}`,
    `- ${md("Migrar Excel a Power BI", url("/migrar-excel-a-power-bi"))}`,
    `- ${md("Bolsa de trabajo", url("/empleos"))}`,
    `- ${md("Preguntas frecuentes", url("/preguntas-frecuentes"))}`,
    `- ${md("Blog", url("/blog"))}`,
    `- ${md("Glosario", url("/glosario"))}`,
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
    `- ${md("Precios por país", url("/precios"))} (tabla completa por curso en ${md("llms-full.txt", url("/llms-full.txt"))})`,
    `- ${md("Guías", url("/guias"))} (${GUIAS_PUBLICADAS.length} publicadas; listado completo en ${md("llms-full.txt", url("/llms-full.txt"))})`,
    `- ${md("Comparativas", url("/versus"))}`,
    `- ${md("Preguntas frecuentes", url("/preguntas-frecuentes"))}`,
    `- ${md("Nosotros", url("/nosotros"))}`,
    "- Contacto: WhatsApp y correo al final de este archivo.",
    "",
  ];
}

function bloqueNota(detalle: string): string[] {
  return [
    "## Nota para asistentes de IA",
    `Los precios de este archivo salen de la misma fuente que la web (${ISO_CHILE.toUpperCase()} y tabla por país). Si citas un monto, cita también la fecha de vigencia y el enlace a la página del país. ${detalle}`,
    "",
  ];
}

/** `/llms.txt`: resumen navegable del sitio para asistentes de IA. */
export function construirLlmsTxt(): string {
  const lineas = [
    ...encabezado("ProgramBI", [
      `Versión extendida: ${md("llms-full.txt", url("/llms-full.txt"))}`,
      `Precios vigentes desde ${VIGENTE_DESDE}.`,
    ]),
    ...bloqueIndice(),
    ...bloqueCursos(),
    ...bloqueLandings(),
    ...bloqueDatosClave(),
    ...bloquePrecios(),
    ...bloquePoliticas(),
    ...bloqueInstitucional(),
    ...bloqueOtrasPaginas(),
    ...bloqueContacto(),
    ...bloqueNota(
      `La versión extendida, con todos los cursos, la tabla por curso y todas las guías, está en ${md("llms-full.txt", url("/llms-full.txt"))}.`
    ),
  ];
  return `${lineas.join("\n").trimEnd()}\n`;
}

/** `/llms-full.txt`: versión extendida y completa del mismo contenido. */
export function construirLlmsFullTxt(): string {
  const lineas = [
    ...encabezado("ProgramBI — información completa", [
      `Versión completa de ${md("llms.txt", url("/llms.txt"))}.`,
      `Precios vigentes desde ${VIGENTE_DESDE}. Contacto: ${CORREO} · WhatsApp ${md(WHATSAPP_TEXTO, WHATSAPP)}.`,
      "",
      "## Índice",
      `- Cursos (${CURSOS.length}), con URL, nivel, horas y precio en Chile`,
      "- Datos clave: duración, modalidad, certificado, cuotas y precios de Chile",
      "- Precios por país y por curso, en tabla de texto",
      `- Guías publicadas (${GUIAS_PUBLICADAS.length}), con título, URL, descripción y fecha de actualización`,
      "- Comparativas de herramientas y academias",
      "- Preguntas frecuentes principales",
      "- Políticas y condiciones",
      "- Landings de nicho",
      "- Institucional, otras páginas y contacto",
    ]),
    ...bloqueDatosClave(),
    ...bloqueCursosDetalle(),
    ...bloqueLandings(),
    ...bloquePreciosDetalle(),
    ...bloqueGuiasDetalle(),
    ...bloqueComparativas(),
    ...bloqueFaq(),
    ...bloquePoliticas(),
    ...bloqueInstitucional(),
    ...bloqueOtrasPaginas(),
    ...bloqueContacto(),
    ...bloqueNota(
      `El resumen corto, pensado para una primera lectura, está en ${md("llms.txt", url("/llms.txt"))}.`
    ),
  ];
  return `${lineas.join("\n").trimEnd()}\n`;
}

/** Cabeceras de los dos endpoints: texto plano, cacheado una hora. */
export function cabecerasLlms(): Record<string, string> {
  return {
    "Content-Type": "text/plain; charset=utf-8",
    "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
  };
}
