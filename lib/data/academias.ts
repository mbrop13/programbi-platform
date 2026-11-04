import { getPais, ISO_CHILE } from "@/config/paises";
import { etiquetaHoraLocal, horarioLocal } from "@/lib/paises/horarios";
import { formatMoneda, precioListaVenta, precioVenta } from "@/lib/paises/precios";
import { rutaLocal } from "@/lib/paises/rutas";
import { SITE_URL } from "@/lib/seo";

/**
 * Comparativas «academia vs academia» y listicle de cursos.
 *
 * Reglas de este módulo:
 * - Los precios de ProgramBI salen SIEMPRE de config/pricing.ts a través de
 *   lib/paises/precios.ts. Nunca se escriben en duro aquí.
 * - Los datos del rival salen SOLO de guias/COMPARATIVAS_BRIEF.md, con su URL
 *   y la fecha de revisión. Si el brief no trae un dato verificado, la página
 *   dice «no verificado» y el pendiente queda en el informe (TODO_MANU).
 * - No se declaran `Offer` de rivales en el JSON-LD.
 *
 * Decisión de rutas: las comparativas de academia viven como segmentos
 * estáticos hermanos de `versus/[slug]` (por ejemplo
 * `versus/programbi-vs-coderhouse-power-bi`). Así las URLs coinciden con el
 * brief y las tres comparativas herramienta-vs-herramienta que ya existían no
 * se tocan. Las variantes de país cuelgan de `(pais)/[pais]/versus/...`.
 */

/** Fecha de revisión de precios y datos de rivales. */
export const ACTUALIZADO = "2026-11-04";
export const ACTUALIZADO_TEXTO = "04-11-2026";

/** Cada cuántos días se re-revisan precios y URLs. */
export const REVISION_DIAS = 30;

function aTexto(fecha: string): string {
  const [anio, mes, dia] = fecha.split("-");
  return `${dia}-${mes}-${anio}`;
}

function sumarDias(fecha: string, dias: number): string {
  const [anio, mes, dia] = fecha.split("-").map((parte) => Number(parte));
  const date = new Date(Date.UTC(anio, mes - 1, dia + dias));
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export const PROXIMA_REVISION = sumarDias(ACTUALIZADO, REVISION_DIAS);
export const PROXIMA_REVISION_TEXTO = aTexto(PROXIMA_REVISION);

/** Horas en vivo del curso de Power BI (confirmadas por Manu el 04-11-2026). */
export const HORAS_POWER_BI = 20;

export type PaisComparativa = "cl" | "mx" | "co" | "ar";

export type FilaComparativaAcademia = {
  criterio: string;
  programbi: string;
  rival: string;
  /** Texto visible de la fuente. */
  fuente: string;
  /** URL de la fuente, si existe. */
  fuenteUrl?: string;
};

export type FuenteComparativa = {
  etiqueta: string;
  url: string;
};

export type Resumen10s = {
  horasProgrambi: string;
  horasRival: string;
  precioProgrambi: string;
  precioRival: string;
  precioHoraProgrambi: string;
  precioHoraRival: string;
};

export type ComparativaAcademia = {
  slug: string;
  rival: string;
  rivalUrl: string;
  /** Ruta canónica de esta versión. */
  ruta: string;
  pais: PaisComparativa;
  /** Países con versión propia de esta comparativa. */
  paises: PaisComparativa[];
  idioma: string;
  /** Mapa hreflang recíproco (solo cuando hay más de una versión). */
  hreflang: Record<string, string>;
  h1: string;
  /** Título SEO, máximo 60 caracteres. */
  metaTitle: string;
  metaDescription: string;
  subtitulo: string;
  intro: string;
  ctaPrimario: string;
  horasProgrambi: number;
  horasRival: number | null;
  precioProgrambi: number | null;
  precioListaProgrambi: number | null;
  moneda: string;
  precioRival: number | null;
  precioRivalTexto: string;
  precioRivalNota?: string;
  /** Tres filas del hero: horas en vivo, precio y precio/hora. */
  resumen10s: Resumen10s;
  filas: FilaComparativaAcademia[];
  ganaRival: string[];
  ganaProgrambi: string[];
  faqs: { q: string; a: string }[];
  fuentes: FuenteComparativa[];
  cursoSlug: string;
  cursoNombre: string;
  rutaCurso: string;
  rutaPrecios: string;
  rutaGuiaPais: string;
  fechaRevision: string;
  fechaRevisionTexto: string;
  proximaRevisionTexto: string;
  notaPrecios: string;
  notaCalculadora?: string;
};

export const RUTA_CODERHOUSE = "/versus/programbi-vs-coderhouse-power-bi";
export const RUTA_PLATZI = "/versus/alternativa-a-platzi-en-vivo";
export const RUTA_IPS = "/versus/ips-datax-vs-programbi";
export const RUTA_DESAFIO = "/versus/desafio-latam-vs-programbi";
export const RUTA_LISTICLE = "/guias/mejores-cursos-power-bi-chile-2026";

export const PAISES_CODERHOUSE: PaisComparativa[] = ["cl", "mx", "co", "ar"];

const NOMBRE_PAIS: Record<PaisComparativa, string> = {
  cl: "Chile",
  mx: "México",
  co: "Colombia",
  ar: "Argentina",
};

const GUIA_PAIS: Record<PaisComparativa, string> = {
  cl: "/guias/como-aprender-power-bi-en-chile",
  mx: "/mx/guias/como-aprender-power-bi-en-mexico",
  co: "/co/guias/como-aprender-power-bi-en-colombia",
  ar: "/ar/guias/como-aprender-power-bi-en-argentina",
};

/**
 * Coderhouse: solo el precio de Chile quedó verificado en el brief
 * (coderhouse.com/cl/cursos/power-bi, revisado el 04-11-2026).
 * Para México, Colombia y Argentina no hay monto verificado: no se publica.
 */
const CODERHOUSE: Record<
  PaisComparativa,
  { promo: number | null; lista: number | null; url: string }
> = {
  cl: {
    promo: 198000,
    lista: 495000,
    url: "https://www.coderhouse.com/cl/cursos/power-bi",
  },
  mx: {
    promo: null,
    lista: null,
    url: "https://www.coderhouse.com/mx/cursos/power-bi",
  },
  co: {
    promo: null,
    lista: null,
    url: "https://www.coderhouse.com/co/cursos/power-bi",
  },
  ar: {
    promo: null,
    lista: null,
    url: "https://www.coderhouse.com/ar/cursos/power-bi",
  },
};

function esPaisCoderhouse(iso: string | null | undefined): iso is PaisComparativa {
  return !!iso && (PAISES_CODERHOUSE as string[]).includes(iso);
}

function rutaCoderhouse(iso: PaisComparativa): string {
  return iso === ISO_CHILE ? RUTA_CODERHOUSE : `/${iso}${RUTA_CODERHOUSE}`;
}

export function hreflangCoderhouse(): Record<string, string> {
  const languages: Record<string, string> = {
    "x-default": `${SITE_URL}${RUTA_CODERHOUSE}`,
  };
  for (const iso of PAISES_CODERHOUSE) {
    languages[getPais(iso).idioma] = `${SITE_URL}${rutaCoderhouse(iso)}`;
  }
  return languages;
}

function precioHora(iso: PaisComparativa, precio: number | null, horas: number | null): string {
  if (precio == null || horas == null || horas <= 0) return "—";
  return formatMoneda(iso, Math.round(precio / horas));
}

function textoPrecio(
  iso: PaisComparativa,
  precio: number | null,
  lista: number | null,
): string {
  if (precio == null) return "Consultar por WhatsApp";
  const base = formatMoneda(iso, precio);
  return lista != null ? `${base} (lista ${formatMoneda(iso, lista)})` : base;
}

function horarioProgrambi(iso: PaisComparativa): string {
  const horario = horarioLocal(iso);
  return `Lunes y miércoles o martes y jueves, ${horario.inicio}–${horario.fin}, ${etiquetaHoraLocal(iso)}`;
}

function rutaCurso(iso: PaisComparativa): string {
  return rutaLocal(iso, "/cursos/power-bi");
}

function rutaPrecios(iso: PaisComparativa): string {
  return rutaLocal(iso, "/precios");
}

function fechaComun(pais: PaisComparativa) {
  return {
    pais,
    fechaRevision: ACTUALIZADO,
    fechaRevisionTexto: ACTUALIZADO_TEXTO,
    proximaRevisionTexto: PROXIMA_REVISION_TEXTO,
    idioma: getPais(pais).idioma,
  };
}

function resumenCoderhouse(
  iso: PaisComparativa,
  progPrecio: number | null,
  progLista: number | null,
  rivalPrecio: number | null,
  rivalLista: number | null,
): Resumen10s {
  return {
    horasProgrambi: `${HORAS_POWER_BI} h`,
    horasRival: "≈10 h",
    precioProgrambi: textoPrecio(iso, progPrecio, progLista),
    precioRival:
      rivalPrecio != null ? formatMoneda(iso, rivalPrecio) : "No verificado en este país",
    precioHoraProgrambi: precioHora(iso, progPrecio, HORAS_POWER_BI),
    precioHoraRival: precioHora(iso, rivalPrecio, 10),
  };
}

function filasCoderhouseChile(
  iso: PaisComparativa,
  progTexto: string,
  progHora: string,
  rivalPrecio: number,
  rivalLista: number,
  url: string,
): FilaComparativaAcademia[] {
  return [
    {
      criterio: "Horas en vivo",
      programbi: "20 h (10 clases de 2 h)",
      rival: "≈10 h (5 semanas × 1 clase de 2 h)",
      fuente: `programbi.com/cursos/power-bi · coderhouse.com/${iso}/cursos/power-bi`,
      fuenteUrl: url,
    },
    {
      criterio: "Precio",
      programbi: progTexto,
      rival: `${formatMoneda(iso, rivalPrecio)} con promo vigente (lista ${formatMoneda(iso, rivalLista)})`,
      fuente: `programbi.com/precios · coderhouse.com/${iso}/cursos/power-bi`,
      fuenteUrl: url,
    },
    {
      criterio: "Precio por hora en vivo",
      programbi: progHora,
      rival: precioHora(iso, rivalPrecio, 10),
      fuente: "Cálculo propio: precio ÷ horas en vivo publicadas",
    },
    {
      criterio: "Cuotas",
      programbi: "3 cuotas sin interés (Mercado Pago o Webpay)",
      rival: "Hasta 12 cuotas sin interés",
      fuente: "programbi.com/precios · coderhouse.com/cl/cursos/power-bi",
      fuenteUrl: url,
    },
    {
      criterio: "Clases en vivo",
      programbi: "✓",
      rival: "✓",
      fuente: "coderhouse.com/cl/cursos/power-bi",
      fuenteUrl: url,
    },
    {
      criterio: "Prueba",
      programbi: "Clase de prueba: consultar por WhatsApp",
      rival: "2 clases gratis",
      fuente: "coderhouse.com/cl/cursos/power-bi",
      fuenteUrl: url,
    },
    {
      criterio: "Horario",
      programbi: horarioProgrambi(iso),
      rival: "1 clase por semana; su ficha de Chile muestra lunes 19:30 (según cohorte)",
      fuente: "coderhouse.com/cl/cursos/power-bi",
      fuenteUrl: url,
    },
    {
      criterio: "Certificado",
      programbi: "✓",
      rival: "✓",
      fuente: "coderhouse.com/cl/cursos/power-bi",
      fuenteUrl: url,
    },
  ];
}

function filasCoderhousePais(
  iso: PaisComparativa,
  progTexto: string,
  progHora: string,
  url: string,
): FilaComparativaAcademia[] {
  return [
    {
      criterio: "Horas en vivo",
      programbi: "20 h (10 clases de 2 h)",
      rival: "≈10 h (5 semanas × 1 clase de 2 h, según su ficha de Chile)",
      fuente: "coderhouse.com/cl/cursos/power-bi",
      fuenteUrl: "https://www.coderhouse.com/cl/cursos/power-bi",
    },
    {
      criterio: "Precio",
      programbi: progTexto,
      rival: `No verificado para ${NOMBRE_PAIS[iso]}: consulta su ficha local`,
      fuente: `coderhouse.com/${iso}/cursos/power-bi`,
      fuenteUrl: url,
    },
    {
      criterio: "Precio por hora en vivo",
      programbi: progHora,
      rival: "— (sin precio verificado en este país)",
      fuente: "Cálculo propio con las horas publicadas",
    },
    {
      criterio: "Cuotas",
      programbi: "3 cuotas sin interés (Mercado Pago o Webpay local)",
      rival: "Consultar en su ficha local",
      fuente: `coderhouse.com/${iso}/cursos/power-bi`,
      fuenteUrl: url,
    },
    {
      criterio: "Clases en vivo",
      programbi: "✓",
      rival: "✓ (mismo formato en vivo que su ficha de Chile)",
      fuente: "coderhouse.com/cl/cursos/power-bi",
      fuenteUrl: "https://www.coderhouse.com/cl/cursos/power-bi",
    },
    {
      criterio: "Prueba",
      programbi: "Clase de prueba: consultar por WhatsApp",
      rival: "Consultar en su ficha local",
      fuente: `coderhouse.com/${iso}/cursos/power-bi`,
      fuenteUrl: url,
    },
    {
      criterio: "Horario",
      programbi: horarioProgrambi(iso),
      rival: "Según cohorte local",
      fuente: `coderhouse.com/${iso}/cursos/power-bi`,
      fuenteUrl: url,
    },
    {
      criterio: "Certificado",
      programbi: "✓",
      rival: "Consultar en su ficha local",
      fuente: `coderhouse.com/${iso}/cursos/power-bi`,
      fuenteUrl: url,
    },
  ];
}

/**
 * Comparativa ProgramBI vs Coderhouse.
 * Solo Chile tiene precio de Coderhouse verificado en el brief.
 */
export function comparativaCoderhouse(iso: PaisComparativa): ComparativaAcademia {
  const precio = precioVenta(iso, "power-bi");
  const lista = precioListaVenta(iso, "power-bi");
  const rival = CODERHOUSE[iso];
  const progTexto = textoPrecio(iso, precio, lista);
  const progHora = precioHora(iso, precio, HORAS_POWER_BI);
  const nombre = NOMBRE_PAIS[iso];
  const esChile = iso === ISO_CHILE;

  const rivalTexto =
    rival.promo != null && rival.lista != null
      ? `${formatMoneda(iso, rival.promo)} con promo vigente (lista ${formatMoneda(iso, rival.lista)})`
      : `No verificado para ${nombre}: consulta su ficha local`;

  const masBaratoTotal =
    precio != null && rival.promo != null ? precio < rival.promo : false;

  const respuestaPrecio = esChile
    ? masBaratoTotal
      ? `Hoy no: Coderhouse está en ${rivalTexto} por unas 10 h, mientras ProgramBI está en ${progTexto} por 20 h. Por hora en vivo, ProgramBI sale ${progHora} y Coderhouse ${precioHora(iso, rival.promo, 10)} (revisado el ${ACTUALIZADO_TEXTO}).`
      : `En precio total, Coderhouse está más barato con la promo vigente: ${rivalTexto} frente a ${progTexto} de ProgramBI. Pero por hora en vivo ProgramBI sale ${progHora} y Coderhouse ${precioHora(iso, rival.promo, 10)}, porque incluye 20 h y Coderhouse unas 10 h (revisado el ${ACTUALIZADO_TEXTO}).`
    : `No publicamos un monto de Coderhouse para ${nombre} porque no lo verificamos en una URL viva. El precio de ProgramBI es ${progTexto} por 20 h en vivo. Revisa la ficha local de Coderhouse antes de inscribirte: las promociones cambian por país.`;

  const filas = esChile
    ? filasCoderhouseChile(
        iso,
        progTexto,
        progHora,
        rival.promo as number,
        rival.lista as number,
        rival.url,
      )
    : filasCoderhousePais(iso, progTexto, progHora, rival.url);

  return {
    ...fechaComun(iso),
    slug: "programbi-vs-coderhouse-power-bi",
    rival: "Coderhouse",
    rivalUrl: rival.url,
    ruta: rutaCoderhouse(iso),
    paises: PAISES_CODERHOUSE,
    hreflang: hreflangCoderhouse(),
    h1: "¿Coderhouse o ProgramBI para aprender Power BI? Te lo contamos claro.",
    metaTitle: `Coderhouse vs ProgramBI: Power BI en ${nombre} y precio`,
    metaDescription: `Comparamos Coderhouse y ProgramBI para aprender Power BI en ${nombre}: horas en vivo, precio, precio por hora, cuotas y certificado. Con fuentes y fecha de revisión.`,
    subtitulo:
      "Las dos son en vivo. La diferencia está en las horas de clase y en cuánto pagas por cada una.",
    intro: esChile
      ? "Coderhouse y ProgramBI comparten formato: clases en vivo, profesor y certificado. La decisión práctica está en dos números que casi nadie pone juntos: cuántas horas en vivo recibes y cuánto pagas por cada una. Aquí los mostramos con las páginas oficiales de cada academia y la fecha en que las revisamos."
      : `Coderhouse y ProgramBI comparten formato: clases en vivo, profesor y certificado. En esta versión mostramos el precio local de ProgramBI y los datos de Coderhouse que sí pudimos verificar. El monto de Coderhouse para ${nombre} no lo publicamos porque no lo verificamos en una URL viva: preferimos decirlo a inventar una cifra.`,
    ctaPrimario: "Ver fechas y precio de ProgramBI",
    horasProgrambi: HORAS_POWER_BI,
    horasRival: 10,
    precioProgrambi: precio,
    precioListaProgrambi: lista,
    moneda: getPais(iso).moneda,
    precioRival: rival.promo,
    precioRivalTexto: rivalTexto,
    precioRivalNota: esChile
      ? "La promo de Coderhouse es variable y puede cambiar sin aviso. Mostramos también su precio de lista."
      : `Solo publicamos el precio de Coderhouse que pudimos verificar. Para ${nombre} no hay monto confirmado en esta revisión.`,
    resumen10s: resumenCoderhouse(iso, precio, lista, rival.promo, rival.lista),
    filas,
    ganaRival: esChile
      ? [
          "Cuotas sin interés: hasta 12, según su página de Chile.",
          "Dos clases gratis para probar antes de pagar.",
          "Marca regional grande y comunidad con chat de estudiantes.",
        ]
      : [
          "Cuotas locales: revisa las condiciones vigentes en tu país.",
          "Dos clases gratis: confirma que apliquen en tu cohorte.",
          "Marca regional grande y comunidad de estudiantes.",
        ],
    ganaProgrambi: esChile
      ? [
          "20 horas en vivo: el doble de clases que las ~10 h de Coderhouse.",
          masBaratoTotal
            ? "Precio total menor que la promo vigente de Coderhouse."
            : "Mejor precio por hora en vivo, aunque el total sea mayor con la promo de Coderhouse.",
          "Grupo con profe en vivo y proyecto guiado para salir con un tablero propio.",
        ]
      : [
          "20 horas en vivo: el doble de clases que las ~10 h de Coderhouse.",
          `Precio publicado en ${getPais(iso).moneda} y medios de pago locales.`,
          "Grupo con profe en vivo y proyecto guiado para salir con un tablero propio.",
        ],
    faqs: esChile
      ? [
          { q: "¿Coderhouse es más barato?", a: respuestaPrecio },
          {
            q: "¿Ambos dan certificado?",
            a: "Sí. Los dos entregan certificado al terminar el curso, según sus páginas oficiales.",
          },
          {
            q: "¿Puedo probar antes de pagar?",
            a: "Coderhouse ofrece 2 clases gratis, según su ficha de Chile. En ProgramBI puedes consultar por WhatsApp si hay una clase de prueba disponible para la próxima cohorte.",
          },
          {
            q: "¿Cuántas horas en vivo tiene cada uno?",
            a: "ProgramBI: 20 horas en 10 clases de 2 horas. Coderhouse: 5 semanas con 1 clase semanal de 2 horas, aproximadamente 10 horas en vivo.",
          },
          {
            q: "¿La promo de Coderhouse es permanente?",
            a: `No. Al revisar su página el ${ACTUALIZADO_TEXTO} había una promoción vigente, pero el precio y el descuento cambian. Por eso mostramos también el precio de lista.`,
          },
        ]
      : [
          {
            q: `¿Cuánto cuesta Coderhouse en ${nombre}?`,
            a: `No publicamos ese monto porque no lo verificamos en una URL viva para ${nombre}. Revisa su ficha local (enlazada en Fuentes) antes de inscribirte: los precios y las promociones cambian por país.`,
          },
          {
            q: "¿Ambos dan certificado?",
            a: `ProgramBI entrega certificado al completar el curso. Para Coderhouse en ${nombre}, confirma la condición en su ficha local; en la ficha de Chile indican certificado al terminar.`,
          },
          {
            q: "¿Puedo probar antes de pagar?",
            a: "En ProgramBI puedes consultar por WhatsApp si hay una clase de prueba disponible. Coderhouse anuncia 2 clases gratis en su ficha de Chile; confirma si aplica en tu país.",
          },
          {
            q: "¿Cuántas horas en vivo tiene cada uno?",
            a: "ProgramBI: 20 horas en 10 clases de 2 horas. Coderhouse: unas 10 horas en 5 semanas, con 1 clase semanal de 2 horas según su ficha de Chile.",
          },
          {
            q: `¿Por qué no muestran el precio de Coderhouse en ${nombre}?`,
            a: "Porque no lo pudimos verificar en una URL viva. Preferimos dejar el dato pendiente y enlazar su ficha local antes que publicar una cifra que podría estar equivocada.",
          },
        ],
    fuentes: [
      { etiqueta: "ProgramBI · curso de Power BI", url: "https://www.programbi.com/cursos/power-bi" },
      { etiqueta: "ProgramBI · precios", url: "https://www.programbi.com/precios" },
      { etiqueta: `Coderhouse · curso de Power BI (${nombre})`, url: rival.url },
      ...(esChile
        ? []
        : [
            {
              etiqueta: "Coderhouse · curso de Power BI (Chile, referencia de horas)",
              url: "https://www.coderhouse.com/cl/cursos/power-bi",
            },
          ]),
    ],
    cursoSlug: "power-bi",
    cursoNombre: "Power BI en vivo",
    rutaCurso: rutaCurso(iso),
    rutaPrecios: rutaPrecios(iso),
    rutaGuiaPais: GUIA_PAIS[iso],
    notaPrecios: esChile
      ? "ProgramBI: precio de venta publicado en programbi.com/precios. Coderhouse: precio promocional leído en su ficha de Chile el 04-11-2026."
      : `ProgramBI: precio de venta publicado en programbi.com/precios. Coderhouse: sin monto verificado para ${nombre} al 04-11-2026.`,
    notaCalculadora: esChile
      ? `Usamos el precio promocional vigente de Coderhouse y sus ~10 h de clase en vivo. ProgramBI son 20 h. Revisado el ${ACTUALIZADO_TEXTO}.`
      : `Coderhouse no tiene precio verificado para ${nombre}, así que la calculadora solo muestra el curso de ProgramBI. Revisado el ${ACTUALIZADO_TEXTO}.`,
  };
}

export function variantesCoderhouse(): { iso: PaisComparativa; nombre: string; ruta: string }[] {
  return PAISES_CODERHOUSE.map((iso) => ({
    iso,
    nombre: NOMBRE_PAIS[iso],
    ruta: rutaCoderhouse(iso),
  }));
}

/** Comparativa Platzi (Chile, sin variantes de país). */
export function comparativaPlatzi(): ComparativaAcademia {
  const iso: PaisComparativa = "cl";
  const precio = precioVenta(iso, "power-bi");
  const lista = precioListaVenta(iso, "power-bi");
  const progTexto = textoPrecio(iso, precio, lista);
  const rivalTexto = "Basic US$49/mes · Expert US$249/año (promo US$189)";

  return {
    ...fechaComun(iso),
    slug: "alternativa-a-platzi-en-vivo",
    rival: "Platzi",
    rivalUrl: "https://platzi.com/cursos/powerbi/",
    ruta: RUTA_PLATZI,
    paises: ["cl"],
    hreflang: {},
    h1: "¿Platzi o clases en vivo? Depende de cómo aprendes.",
    metaTitle: "Platzi o curso en vivo: cuál elegir para Power BI",
    metaDescription:
      "Platzi es una suscripción con cursos grabados; ProgramBI es un curso de Power BI en vivo. Comparamos formato, precio, catálogo y feedback con fuentes y fecha.",
    subtitulo:
      "Platzi es una suscripción con miles de cursos grabados. ProgramBI es un curso en vivo, con profe y compañeros, para salir con un tablero propio.",
    intro:
      "No son el mismo producto. Platzi te da acceso amplio y a tu ritmo; ProgramBI te da un calendario, un profe en vivo y un grupo con el que avanzar. La pregunta útil no es cuál es «mejor», sino cuál se ajusta a tu forma de aprender y al plazo que tienes.",
    ctaPrimario: "Probar una clase en vivo",
    horasProgrambi: HORAS_POWER_BI,
    horasRival: null,
    precioProgrambi: precio,
    precioListaProgrambi: lista,
    moneda: getPais(iso).moneda,
    precioRival: null,
    precioRivalTexto: rivalTexto,
    precioRivalNota: "Platzi cobra una suscripción en dólares, no un precio por curso.",
    resumen10s: {
      horasProgrambi: `${HORAS_POWER_BI} h`,
      horasRival: "Sin horas en vivo",
      precioProgrambi: textoPrecio(iso, precio, lista),
      precioRival: "Suscripción en US$",
      precioHoraProgrambi: precioHora(iso, precio, HORAS_POWER_BI),
      precioHoraRival: "—",
    },
    filas: [
      {
        criterio: "Formato",
        programbi: "En vivo por Zoom + grabaciones",
        rival: "Videos grabados dentro de una suscripción",
        fuente: "platzi.com/cursos/powerbi/",
        fuenteUrl: "https://platzi.com/cursos/powerbi/",
      },
      {
        criterio: "Precio",
        programbi: progTexto,
        rival: rivalTexto,
        fuente: "programbi.com/precios · platzi.com/precios/",
        fuenteUrl: "https://platzi.com/precios/",
      },
      {
        criterio: "Catálogo",
        programbi: "Stack BI enfocado: Power BI, SQL, Excel y Python",
        rival: "7 rutas de la Escuela de Data Science",
        fuente: "platzi.com/escuela/datos/",
        fuenteUrl: "https://platzi.com/escuela/datos/",
      },
      {
        criterio: "Feedback de un profe en vivo",
        programbi: "✓",
        rival: "— (el curso que comparamos es grabado)",
        fuente: "platzi.com/cursos/powerbi/",
        fuenteUrl: "https://platzi.com/cursos/powerbi/",
      },
      {
        criterio: "Ritmo",
        programbi: "Calendario fijo, dos clases por semana",
        rival: "A tu ritmo, 24/7",
        fuente: "platzi.com/precios/",
        fuenteUrl: "https://platzi.com/precios/",
      },
      {
        criterio: "Certificado",
        programbi: "✓",
        rival: "Consultar en su sitio",
        fuente: "platzi.com/precios/",
        fuenteUrl: "https://platzi.com/precios/",
      },
    ],
    ganaRival: [
      "Amplitud: una sola suscripción abre cursos de datos, programación, diseño, negocios e IA.",
      "Ritmo propio: puedes empezar hoy y ver las clases cuando te acomode.",
      "Precio de entrada mensual bajo si quieres explorar varias áreas antes de comprometerte.",
    ],
    ganaProgrambi: [
      "Clases en vivo con un profe que responde tus dudas en el momento.",
      "Calendario y grupo: terminas el curso en semanas, no cuando la disciplina lo permita.",
      "Un proyecto guiado para mostrar en tu trabajo o portafolio.",
    ],
    faqs: [
      {
        q: "¿Platzi vale la pena para aprender Power BI?",
        a: "Sí, si te funciona aprender con video y a tu ritmo. Es una suscripción con cursos grabados; el curso de Power BI que revisamos no incluye un profe en vivo corrigiendo tus dudas en el momento.",
      },
      {
        q: "¿Cuál es más barato?",
        a: `Depende de cuánto uses la suscripción. Platzi se cobra en dólares: ${rivalTexto}. ProgramBI es ${progTexto} por un curso en vivo de 20 h. No convertimos los dólares a pesos porque el tipo de cambio y los impuestos cambian el monto final. Si vas a estudiar varios temas durante un año, la suscripción puede rendir más; si necesitas Power BI aplicado y con fecha de término, el curso en vivo suele ser más directo.`,
      },
      {
        q: "¿Puedo aprender Power BI solo con Platzi?",
        a: "Sí: su curso cubre Power Query, DAX, modelado y visualización, según su ficha. La diferencia es el acompañamiento: en un curso en vivo puedes preguntar cuando una medida no cuadra y avanzar con un calendario.",
      },
      {
        q: "¿Ambos dan certificado?",
        a: "ProgramBI entrega su certificado al completar el curso en vivo. Para Platzi, revisa las condiciones de certificación en su página: no las verificamos en esta comparación.",
      },
      {
        q: "¿Platzi tiene clases en vivo?",
        a: "El curso de Power BI que comparamos es de video grabado dentro de la suscripción. ProgramBI dicta todas sus clases en vivo por Zoom.",
      },
    ],
    fuentes: [
      { etiqueta: "ProgramBI · curso de Power BI", url: "https://www.programbi.com/cursos/power-bi" },
      { etiqueta: "ProgramBI · precios", url: "https://www.programbi.com/precios" },
      { etiqueta: "Platzi · curso de Power BI", url: "https://platzi.com/cursos/powerbi/" },
      { etiqueta: "Platzi · precios", url: "https://platzi.com/precios/" },
      { etiqueta: "Platzi · Escuela de Data Science", url: "https://platzi.com/escuela/datos/" },
    ],
    cursoSlug: "power-bi",
    cursoNombre: "Power BI en vivo",
    rutaCurso: rutaCurso(iso),
    rutaPrecios: rutaPrecios(iso),
    rutaGuiaPais: GUIA_PAIS.cl,
    notaPrecios:
      "ProgramBI: precio de venta publicado en programbi.com/precios. Platzi: precios en dólares leídos en su página el 04-11-2026.",
    notaCalculadora:
      "Platzi es una suscripción: no tiene un precio por curso ni horas de clase en vivo comparables. La calculadora muestra solo el curso de ProgramBI.",
  };
}

/** Comparativa IPS DATAX (Chile, sin variantes de país). */
export function comparativaIpsDatax(): ComparativaAcademia {
  const iso: PaisComparativa = "cl";
  const precio = precioVenta(iso, "power-bi");
  const lista = precioListaVenta(iso, "power-bi");
  const progTexto = textoPrecio(iso, precio, lista);

  return {
    ...fechaComun(iso),
    slug: "ips-datax-vs-programbi",
    rival: "IPS DATAX",
    rivalUrl: "https://ipsdatax.com/cursos/",
    ruta: RUTA_IPS,
    paises: ["cl"],
    hreflang: {},
    h1: "IPS DATAX o ProgramBI: grabado a tu ritmo o en vivo con horario.",
    metaTitle: "IPS DATAX vs ProgramBI: Power BI grabado o en vivo",
    metaDescription:
      "Dos academias chilenas de datos: IPS DATAX vende cursos grabados y ProgramBI dicta clases en vivo. Comparamos formato, precio, acceso y acompañamiento.",
    subtitulo:
      "Dos academias chilenas de datos con enfoques distintos. Elige según cómo te comprometes mejor.",
    intro:
      "IPS DATAX tiene un catálogo amplio y acceso de por vida a cursos individuales; ProgramBI apuesta por cohortes en vivo con horario y profe. Ninguno es mejor en abstracto: uno premia la autonomía y el otro, la constancia con acompañamiento.",
    ctaPrimario: "Ver la próxima cohorte",
    horasProgrambi: HORAS_POWER_BI,
    horasRival: null,
    precioProgrambi: precio,
    precioListaProgrambi: lista,
    moneda: getPais(iso).moneda,
    precioRival: null,
    precioRivalTexto: "US$197 pago único (curso grabado)",
    precioRivalNota: "IPS DATAX cobra en dólares y el acceso es de por vida.",
    resumen10s: {
      horasProgrambi: `${HORAS_POWER_BI} h`,
      horasRival: "Sin horas en vivo",
      precioProgrambi: textoPrecio(iso, precio, lista),
      precioRival: "US$197",
      precioHoraProgrambi: precioHora(iso, precio, HORAS_POWER_BI),
      precioHoraRival: "—",
    },
    filas: [
      {
        criterio: "Formato",
        programbi: "Clases en vivo, cohorte",
        rival: "Cursos grabados (Hotmart) + sesiones grupales mensuales en Premium",
        fuente: "ipsdatax.com/cursos/ · ipsdatax.com/lab/",
        fuenteUrl: "https://ipsdatax.com/cursos/",
      },
      {
        criterio: "Power BI",
        programbi: `${progTexto} por 20 h en vivo`,
        rival: "US$197 de por vida (grabado)",
        fuente: "ipsdatax.com/cursos/",
        fuenteUrl: "https://ipsdatax.com/cursos/",
      },
      {
        criterio: "Entrada",
        programbi: "Clase de prueba: consultar por WhatsApp; plantilla gratis",
        rival: "Curso ADD por US$27",
        fuente: "ipsdatax.com/cursos/analisis-de-datos/",
        fuenteUrl: "https://ipsdatax.com/cursos/analisis-de-datos/",
      },
      {
        criterio: "Membresía",
        programbi: "—",
        rival: "US$59/mes (IPS DATAX Premium)",
        fuente: "ipsdatax.com/lab/",
        fuenteUrl: "https://ipsdatax.com/lab/",
      },
      {
        criterio: "Acceso",
        programbi: "Grabaciones del curso + certificado",
        rival: "De por vida en el curso que compras",
        fuente: "ipsdatax.com/cursos/",
        fuenteUrl: "https://ipsdatax.com/cursos/",
      },
      {
        criterio: "Catálogo",
        programbi: "Stack BI enfocado: Power BI, SQL, Excel y Python",
        rival: "Catálogo amplio de cursos de datos",
        fuente: "ipsdatax.com/lab/",
        fuenteUrl: "https://ipsdatax.com/lab/",
      },
      {
        criterio: "Clases en vivo",
        programbi: "✓",
        rival: "— (salvo las sesiones grupales mensuales de Premium)",
        fuente: "ipsdatax.com/lab/",
        fuenteUrl: "https://ipsdatax.com/lab/",
      },
      {
        criterio: "Certificado",
        programbi: "✓",
        rival: "Consultar en su sitio",
        fuente: "ipsdatax.com/cursos/",
        fuenteUrl: "https://ipsdatax.com/cursos/",
      },
    ],
    ganaRival: [
      "Catálogo amplio de cursos de datos, no solo Power BI.",
      "Acceso de por vida en los cursos individuales y un precio de entrada bajo (US$27).",
      "Sesiones grupales mensuales y comunidad si eliges la membresía Premium (US$59/mes).",
    ],
    ganaProgrambi: [
      "Clases en vivo con horario y profe: resuelves dudas mientras avanzas.",
      "Grupo con acompañamiento y proyecto guiado para salir con un tablero aplicado a tu trabajo.",
      "Precio en pesos chilenos y medios de pago locales.",
    ],
    faqs: [
      {
        q: "¿IPS DATAX es en vivo?",
        a: "Sus cursos individuales son grabados y se alojan en Hotmart. La membresía Premium suma sesiones grupales mensuales en vivo, según su página.",
      },
      {
        q: "¿Cuál es más barato?",
        a: `El curso de Power BI de IPS DATAX cuesta US$197 con acceso de por vida. ProgramBI cuesta ${progTexto} por 20 h en vivo. No son comparables uno a uno: uno es grabado y el otro tiene horario y profe.`,
      },
      {
        q: "¿Puedo probar antes?",
        a: "IPS DATAX tiene un curso de entrada de US$27 (ADD). En ProgramBI puedes consultar por WhatsApp si hay una clase de prueba o descargar la plantilla gratis.",
      },
      {
        q: "¿Ambos dan certificado?",
        a: "ProgramBI entrega certificado al completar el curso en vivo. En la página de IPS DATAX que revisamos no se detalla el certificado; confírmalo con ellos antes de comprar.",
      },
      {
        q: "¿Cuál me conviene si trabajo todo el día?",
        a: "Si tu horario cambia cada semana, un curso grabado como los de IPS DATAX te da flexibilidad. Si puedes reservar dos noches fijas, el curso en vivo de ProgramBI te ayuda a terminar en semanas.",
      },
    ],
    fuentes: [
      { etiqueta: "ProgramBI · curso de Power BI", url: "https://www.programbi.com/cursos/power-bi" },
      { etiqueta: "ProgramBI · precios", url: "https://www.programbi.com/precios" },
      { etiqueta: "IPS DATAX · cursos individuales", url: "https://ipsdatax.com/cursos/" },
      { etiqueta: "IPS DATAX · membresía Premium", url: "https://ipsdatax.com/lab/" },
      { etiqueta: "IPS DATAX · curso ADD", url: "https://ipsdatax.com/cursos/analisis-de-datos/" },
    ],
    cursoSlug: "power-bi",
    cursoNombre: "Power BI en vivo",
    rutaCurso: rutaCurso(iso),
    rutaPrecios: rutaPrecios(iso),
    rutaGuiaPais: GUIA_PAIS.cl,
    notaPrecios:
      "ProgramBI: precio de venta publicado en programbi.com/precios. IPS DATAX: precios en dólares leídos en sus páginas el 04-11-2026.",
    notaCalculadora:
      "IPS DATAX vende cursos grabados en dólares y no publica horas de clase en vivo comparables. La calculadora muestra solo el curso de ProgramBI.",
  };
}

/** Comparativa Desafío Latam (Chile, sin variantes de país). */
export function comparativaDesafioLatam(): ComparativaAcademia {
  const iso: PaisComparativa = "cl";
  const precio = precioVenta(iso, "power-bi");
  const lista = precioListaVenta(iso, "power-bi");
  const progTexto = textoPrecio(iso, precio, lista);

  return {
    ...fechaComun(iso),
    slug: "desafio-latam-vs-programbi",
    rival: "Desafío Latam",
    rivalUrl: "https://desafiolatam.com/data-science-2026/",
    ruta: RUTA_DESAFIO,
    paises: ["cl"],
    hreflang: {},
    h1: "¿Bootcamp de 8 meses o un curso de 20 horas?",
    metaTitle: "Desafío Latam vs ProgramBI: bootcamp o curso corto",
    metaDescription:
      "Comparamos un bootcamp de Data Analytics de 32 semanas con un curso de Power BI de 20 horas. Duración, precio publicado, empleabilidad y para quién es cada uno.",
    subtitulo:
      "Si quieres cambiar de carrera, un bootcamp tiene sentido. Si necesitas Power BI para tu pega este mes, no.",
    intro:
      "Desafío Latam vende una carrera larga de Data Analytics; ProgramBI vende un curso corto y aplicado de Power BI. La comparación solo tiene sentido si miras tu objetivo: cambiar de rubro o resolver un problema concreto en tu trabajo actual.",
    ctaPrimario: "Ver el curso de 20 h",
    horasProgrambi: HORAS_POWER_BI,
    horasRival: null,
    precioProgrambi: precio,
    precioListaProgrambi: lista,
    moneda: getPais(iso).moneda,
    precioRival: null,
    precioRivalTexto: "No publicado: se cotiza con un asesor",
    precioRivalNota:
      "No publicamos una cifra de Desafío Latam porque su página de carrera no estaba disponible al revisar (04-11-2026).",
    resumen10s: {
      horasProgrambi: `${HORAS_POWER_BI} h`,
      horasRival: "32 semanas",
      precioProgrambi: textoPrecio(iso, precio, lista),
      precioRival: "Vía asesor",
      precioHoraProgrambi: precioHora(iso, precio, HORAS_POWER_BI),
      precioHoraRival: "—",
    },
    filas: [
      {
        criterio: "Duración",
        programbi: "20 h / ~5 semanas",
        rival: "Data Analytics: 32 semanas (~8 meses), 12 h/semana. Data Science: 1 año",
        fuente: "desafiolatam.com/data-science-2026/",
        fuenteUrl: "https://desafiolatam.com/data-science-2026/",
      },
      {
        criterio: "Precio",
        programbi: progTexto,
        rival: "No publicado en la página revisada: se cotiza con un asesor",
        fuente: "desafiolatam.com/data-science-2026/ · carrera-data-analytics (no disponible el 04-11-2026)",
        fuenteUrl: "https://desafiolatam.com/data-science-2026/",
      },
      {
        criterio: "Enfoque",
        programbi: "Power BI aplicado a tu pega; sales con un tablero propio",
        rival: "Programa de Data Analytics de 32 semanas",
        fuente: "desafiolatam.com/data-science-2026/",
        fuenteUrl: "https://desafiolatam.com/data-science-2026/",
      },
      {
        criterio: "Empleabilidad",
        programbi: "Bolsa de empleos de ProgramBI (/empleos)",
        rival: "91% de empleabilidad a 6 meses (cifra autodeclarada en su sitio)",
        fuente: "desafiolatam.com/data-science-2026/",
        fuenteUrl: "https://desafiolatam.com/data-science-2026/",
      },
      {
        criterio: "Ritmo",
        programbi: "Dos clases por semana, 19:30–21:30 (hora de Chile)",
        rival: "12 h por semana durante 32 semanas",
        fuente: "desafiolatam.com/data-science-2026/",
        fuenteUrl: "https://desafiolatam.com/data-science-2026/",
      },
      {
        criterio: "Clases en vivo",
        programbi: "✓",
        rival: "Consultar en su sitio",
        fuente: "desafiolatam.com/data-science-2026/",
        fuenteUrl: "https://desafiolatam.com/data-science-2026/",
      },
      {
        criterio: "Certificado",
        programbi: "✓",
        rival: "Consultar en su sitio",
        fuente: "desafiolatam.com/data-science-2026/",
        fuenteUrl: "https://desafiolatam.com/data-science-2026/",
      },
    ],
    ganaRival: [
      "Recorrido largo: 32 semanas con 12 h semanales para quien quiere formarse en Data Analytics, no solo en una herramienta.",
      "Acompañamiento de empleabilidad y una cifra de inserción que ellos mismos declaran (91% a 6 meses).",
      "Tiene sentido si tu objetivo es cambiar de carrera, no solo aprender Power BI.",
    ],
    ganaProgrambi: [
      "Empiezas y terminas en semanas, no en ocho meses.",
      "Foco en Power BI y en un tablero aplicado a tu trabajo actual.",
      "Precio publicado y en pesos chilenos, sin cotización con asesor.",
    ],
    faqs: [
      {
        q: "¿Desafío Latam es mejor que un curso corto?",
        a: "Depende de tu objetivo. Si quieres cambiar de carrera y puedes dedicar meses, un bootcamp tiene más recorrido. Si necesitas Power BI para tu pega este mes, un curso de 20 horas es más directo.",
      },
      {
        q: "¿Cuánto cuesta Desafío Latam?",
        a: "No publicamos esa cifra porque la página de la carrera no estaba disponible al revisarla y no encontramos un precio vivo que pudiéramos citar. En su sitio se cotiza con un asesor. No inventamos el monto.",
      },
      {
        q: "¿Cuánto dura Data Analytics de Desafío Latam?",
        a: "32 semanas, aproximadamente 8 meses, con una carga de 12 horas semanales, según la información publicada en su sitio. Su programa de Data Science se extiende por 1 año.",
      },
      {
        q: "¿ProgramBI sirve para cambiar de carrera?",
        a: "Es un curso de 20 horas enfocado en Power BI. Sirve para sumar una herramienta clave a tu perfil actual; si tu plan es una reconversión completa, probablemente necesites además SQL, Python y un portafolio más amplio.",
      },
      {
        q: "¿Ambos tienen clases en vivo?",
        a: "ProgramBI dicta clases en vivo por Zoom, lunes y miércoles o martes y jueves. Para Desafío Latam, confirma la modalidad de la cohorte en su sitio.",
      },
    ],
    fuentes: [
      { etiqueta: "ProgramBI · curso de Power BI", url: "https://www.programbi.com/cursos/power-bi" },
      { etiqueta: "ProgramBI · precios", url: "https://www.programbi.com/precios" },
      { etiqueta: "Desafío Latam · Data Science 2026", url: "https://desafiolatam.com/data-science-2026/" },
      { etiqueta: "Desafío Latam · Data Analytics (sin precio vivo al 04-11-2026)", url: "https://desafiolatam.com/carrera-data-analytics/" },
    ],
    cursoSlug: "power-bi",
    cursoNombre: "Power BI en vivo",
    rutaCurso: rutaCurso(iso),
    rutaPrecios: rutaPrecios(iso),
    rutaGuiaPais: GUIA_PAIS.cl,
    notaPrecios:
      "ProgramBI: precio de venta publicado en programbi.com/precios. Desafío Latam: sin monto verificado al 04-11-2026; su programa se cotiza con asesor.",
    notaCalculadora:
      "Desafío Latam no publica el precio en la página revisada y su programa no se mide en horas de clase equivalentes. La calculadora muestra solo ProgramBI.",
  };
}

/* ------------------------------------------------------------------ */
/* Listicle «Mejores cursos de Power BI en Chile 2026»                 */
/* ------------------------------------------------------------------ */

export type OpcionListicle = {
  nombre: string;
  precio: string;
  precioNota?: string;
  horas: string;
  formato: string;
  certificado: string;
  fuente: string;
  fuenteUrl: string;
  destacada?: boolean;
};

/**
 * Opciones del listicle. Solo incluimos las que tienen precio y URL
 * verificables en el brief (04-11-2026). UC/U. de Chile queda fuera porque no
 * se verificó un curso de Power BI vigente con precio público.
 */
export function opcionesListiclePowerBiChile(): OpcionListicle[] {
  const programbi = precioVenta("cl", "power-bi");
  const lista = precioListaVenta("cl", "power-bi");

  return [
    {
      nombre: "ProgramBI",
      precio: programbi != null ? formatMoneda("cl", programbi) : "Consultar por WhatsApp",
      precioNota: lista != null ? `Lista ${formatMoneda("cl", lista)}` : undefined,
      horas: "20 h en vivo",
      formato: "En vivo por Zoom, lunes y miércoles o martes y jueves; grabaciones",
      certificado: "Sí",
      fuente: "programbi.com/cursos/power-bi",
      fuenteUrl: "https://www.programbi.com/cursos/power-bi",
      destacada: true,
    },
    {
      nombre: "Coderhouse",
      precio: formatMoneda("cl", 198000),
      precioNota: `Lista ${formatMoneda("cl", 495000)}; promo variable`,
      horas: "≈10 h (5 semanas, 1 clase semanal de 2 h)",
      formato: "En vivo, 1 clase por semana",
      certificado: "Sí",
      fuente: "coderhouse.com/cl/cursos/power-bi",
      fuenteUrl: "https://www.coderhouse.com/cl/cursos/power-bi",
    },
    {
      nombre: "Crenn",
      precio: formatMoneda("cl", 60000),
      horas: "16 h en vivo",
      formato: "En vivo por Zoom, máximo 8 personas",
      certificado: "Consultar en su sitio",
      fuente: "crenn.cl/curso-power-bi-intermedio/",
      fuenteUrl: "https://crenn.cl/curso-power-bi-intermedio/",
    },
    {
      nombre: "Qualitymas",
      precio: formatMoneda("cl", 240000),
      horas: "24 h",
      formato: "Código SENCE 1238068222; modalidad a confirmar en su sitio",
      certificado: "Consultar en su sitio",
      fuente: "qualitymas.cl",
      fuenteUrl: "https://www.qualitymas.cl",
    },
    {
      nombre: "Platzi",
      precio: "US$49/mes",
      precioNota: "Expert US$249/año (promo US$189)",
      horas: "Curso grabado (sin horas en vivo)",
      formato: "Videos grabados dentro de una suscripción",
      certificado: "Consultar en su sitio",
      fuente: "platzi.com/precios/",
      fuenteUrl: "https://platzi.com/precios/",
    },
    {
      nombre: "IPS DATAX",
      precio: "US$197",
      precioNota: "Pago único, acceso de por vida",
      horas: "Curso grabado (sin horas en vivo)",
      formato: "Grabado en Hotmart; Premium suma sesiones grupales mensuales",
      certificado: "Consultar en su sitio",
      fuente: "ipsdatax.com/cursos/",
      fuenteUrl: "https://ipsdatax.com/cursos/",
    },
  ];
}

export function faqsListiclePowerBiChile(): { q: string; a: string }[] {
  return [
    {
      q: "¿Cuál es el mejor curso de Power BI en Chile?",
      a: "No hay uno solo. Si buscas el precio más bajo entre los cursos en vivo verificados, Crenn ofrece 16 h por $60.000 con máximo 8 personas. Si buscas un curso en vivo de 20 h con proyecto y precio publicado, ProgramBI está en $169.000. Coderhouse tiene 5 semanas por $198.000 con promo vigente. La mejor opción depende de tu presupuesto, tu horario y el formato que te funcione.",
    },
    {
      q: "¿Cuál es el más barato?",
      a: "Entre los cursos en vivo de la tabla, Crenn es el más barato: $60.000 por 16 h. Le sigue ProgramBI con $169.000 por 20 h. Platzi (US$49/mes) e IPS DATAX (US$197) se cobran en dólares y no son comparables en pesos sin considerar tipo de cambio e impuestos. Los precios promocionales cambian: revisa la fuente antes de inscribirte.",
    },
    {
      q: "¿Cuál tiene más horas?",
      a: "Qualitymas declara 24 horas y ProgramBI 20 horas en vivo. Crenn declara 16 horas en vivo y Coderhouse unas 10 horas en 5 semanas. Más horas no significa mejor curso: importa el temario, el tamaño del grupo y si las clases quedan grabadas.",
    },
    {
      q: "¿Los cursos incluyen certificado?",
      a: "ProgramBI entrega certificado al completar el curso y Coderhouse indica certificado en su ficha. Para Crenn, Qualitymas, Platzi e IPS DATAX no verificamos la condición de certificación en esta revisión: consúltala antes de inscribirte. Revisa siempre las condiciones de aprobación de cada programa.",
    },
    {
      q: "¿Por qué esta guía incluye a la competencia?",
      a: "Porque una comparación sin alternativas no sirve. Esta guía la hace ProgramBI y lo decimos arriba: incluimos a competidores directos y señalamos dónde pueden convenir más, para que decidas con datos y no con publicidad.",
    },
    {
      q: "¿Cada cuánto se actualiza?",
      a: `Revisamos precios y URLs el ${ACTUALIZADO_TEXTO} y repetimos la revisión cada ${REVISION_DIAS} días. Los precios de cursos y promociones cambian rápido, así que la fecha de revisión está visible y cada fila enlaza a su fuente.`,
    },
  ];
}

/* ------------------------------------------------------------------ */
/* Rutas y navegación                                                  */
/* ------------------------------------------------------------------ */

/** Comparativas de academia en Chile (sin variantes de país). */
export const RUTAS_COMPARATIVAS_ACADEMIA = [
  RUTA_CODERHOUSE,
  RUTA_PLATZI,
  RUTA_IPS,
  RUTA_DESAFIO,
];

/** Versiones por país de la comparativa de Coderhouse que sí existen. */
export const RUTAS_CODERHOUSE_PAIS = ["mx", "co", "ar"].map(
  (iso) => `/${iso}${RUTA_CODERHOUSE}`,
);

/**
 * Todas las rutas nuevas de este workstream, listas para el sitemap:
 * 4 comparativas + listicle + 3 variantes de país.
 */
export const RUTAS_COMPARATIVAS = [
  ...RUTAS_COMPARATIVAS_ACADEMIA,
  RUTA_LISTICLE,
  ...RUTAS_CODERHOUSE_PAIS,
];

export type TarjetaAcademia = {
  href: string;
  rival: string;
  etiqueta: string;
  title: string;
  description: string;
};

/** Tarjetas de la sección «Academias» del hub /versus. */
export function comparativasAcademiaHub(): TarjetaAcademia[] {
  return [
    {
      href: RUTA_CODERHOUSE,
      rival: "Coderhouse",
      etiqueta: "Academia",
      title: "ProgramBI vs Coderhouse: Power BI en vivo",
      description:
        "Las dos son en vivo. Comparamos horas, precio, precio por hora y cuotas, con fuentes y fecha de revisión.",
    },
    {
      href: RUTA_PLATZI,
      rival: "Platzi",
      etiqueta: "Academia",
      title: "Alternativa a Platzi: curso de Power BI en vivo",
      description:
        "Suscripción con cursos grabados frente a un curso en vivo con profe, horario y proyecto guiado.",
    },
    {
      href: RUTA_IPS,
      rival: "IPS DATAX",
      etiqueta: "Academia",
      title: "IPS DATAX vs ProgramBI: grabado o en vivo",
      description:
        "Dos academias chilenas de datos: catálogo amplio y acceso de por vida frente a cohortes en vivo.",
    },
    {
      href: RUTA_DESAFIO,
      rival: "Desafío Latam",
      etiqueta: "Academia",
      title: "Desafío Latam vs ProgramBI: bootcamp o curso corto",
      description:
        "Un bootcamp de 32 semanas y un curso de 20 horas no compiten por lo mismo. Te ayudamos a elegir.",
    },
    {
      href: RUTA_LISTICLE,
      rival: "6 opciones",
      etiqueta: "Guía",
      title: "Mejores cursos de Power BI en Chile (2026)",
      description:
        "Precio, horas en vivo, formato y certificado de 6 opciones verificadas. Incluye a la competencia y declara quién hace la guía.",
    },
  ];
}
