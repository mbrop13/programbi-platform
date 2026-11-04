import { getPais, ISO_CHILE } from "@/config/paises";
import { PRECIOS_VALID_FROM } from "@/config/pricing";
import { horarioLocal } from "@/lib/paises/horarios";
import { formatMoneda, precioListaVenta, precioVenta } from "@/lib/paises/precios";
import { rutaLocal } from "@/lib/paises/rutas";

/**
 * Contenido de las comparativas «academia vs academia».
 *
 * Regla de oro: los precios de ProgramBI salen de config/pricing.ts y los del
 * rival solo se publican si quedaron verificados en una URL viva. Cada fila
 * lleva su fuente para que el lector pueda revisarla.
 */
export const ACTUALIZADO = "2026-11-04";
export const ACTUALIZADO_TEXTO = "04-11-2026";

export type PaisComparativa = "cl" | "mx" | "co" | "ar";

export type FilaComparativaAcademia = {
  criterio: string;
  programbi: string;
  rival: string;
  fuente: string;
  fuenteUrl?: string;
};

export type FuenteComparativa = {
  etiqueta: string;
  url: string;
};

export type ComparativaAcademia = {
  slug: string;
  rival: string;
  rivalUrl: string;
  ruta: string;
  pais: PaisComparativa;
  idioma: string;
  h1: string;
  seoTitle: string;
  seoDescription: string;
  intro: string;
  subtitulo: string;
  ctaPrimario: string;
  horasProgrambi: number;
  horasRival: number | null;
  precioProgrambi: number | null;
  precioListaProgrambi: number | null;
  moneda: string;
  precioRival: number | null;
  precioRivalTexto: string;
  precioRivalNota?: string;
  filas: FilaComparativaAcademia[];
  ganaRival: string[];
  ganaProgrambi: string[];
  faqs: { q: string; a: string }[];
  fuentes: FuenteComparativa[];
  rutaCurso: string;
  rutaPrecios: string;
  rutaGuiaPais: string;
  notaCalculadora?: string;
};

export const RUTA_CODERHOUSE = "/versus/programbi-vs-coderhouse-power-bi";
export const RUTA_PLATZI = "/versus/alternativa-a-platzi-en-vivo";
export const RUTA_IPS = "/versus/ips-datax-vs-programbi";
export const RUTA_DESAFIO = "/versus/desafio-latam-vs-programbi";
export const RUTA_LISTICLE = "/guias/mejores-cursos-power-bi-chile-2026";

export const PAISES_CODERHOUSE: PaisComparativa[] = ["cl", "mx", "co", "ar"];

export function esPaisCoderhouse(iso: string | null | undefined): iso is PaisComparativa {
  return !!iso && (PAISES_CODERHOUSE as string[]).includes(iso);
}

const GUIA_PAIS: Record<PaisComparativa, string> = {
  cl: "/guias/como-aprender-power-bi-en-chile",
  mx: "/mx/guias/como-aprender-power-bi-en-mexico",
  co: "/co/guias/como-aprender-power-bi-en-colombia",
  ar: "/ar/guias/como-aprender-power-bi-en-argentina",
};

const NOMBRE_PAIS: Record<PaisComparativa, string> = {
  cl: "Chile",
  mx: "México",
  co: "Colombia",
  ar: "Argentina",
};

/** Precios verificados de Coderhouse el 04-11-2026 en coderhouse.com/<país>/cursos/power-bi. */
const CODERHOUSE: Record<
  PaisComparativa,
  { promo: number; lista: number; cuotas: string; url: string }
> = {
  cl: {
    promo: 198000,
    lista: 495000,
    cuotas: "Hasta 12 cuotas sin interés",
    url: "https://www.coderhouse.com/cl/cursos/power-bi",
  },
  mx: {
    promo: 2288,
    lista: 5720,
    cuotas: "Hasta 12 meses sin interés",
    url: "https://www.coderhouse.com/mx/cursos/power-bi",
  },
  co: {
    promo: 469920,
    lista: 1174800,
    cuotas: "Hasta 12 cuotas",
    url: "https://www.coderhouse.com/co/cursos/power-bi",
  },
  ar: {
    promo: 110370,
    lista: 169800,
    cuotas: "Hasta 6 cuotas sin interés",
    url: "https://www.coderhouse.com/ar/cursos/power-bi",
  },
};

function precioHora(iso: PaisComparativa, precio: number | null, horas: number | null): string {
  if (precio == null || horas == null || horas <= 0) return "—";
  return formatMoneda(iso, Math.round(precio / horas));
}

function precioProgrambiTexto(iso: PaisComparativa, precio: number | null, lista: number | null): string {
  if (precio == null) return "Consulta el valor por WhatsApp";
  const base = formatMoneda(iso, precio);
  return lista != null ? `${base} (lista ${formatMoneda(iso, lista)})` : base;
}

function rutaCurso(iso: PaisComparativa): string {
  return rutaLocal(iso, "/cursos/power-bi");
}

function rutaPrecios(iso: PaisComparativa): string {
  return rutaLocal(iso, "/precios");
}

function rutaComparativa(iso: PaisComparativa): string {
  return iso === ISO_CHILE ? RUTA_CODERHOUSE : `/${iso}${RUTA_CODERHOUSE}`;
}

function horarioProgrambi(iso: PaisComparativa): string {
  const horario = horarioLocal(iso);
  return `Lunes y miércoles, ${horario.inicio}–${horario.fin}, hora de ${NOMBRE_PAIS[iso]}`;
}

export function comparativaCoderhouse(iso: PaisComparativa): ComparativaAcademia {
  const precio = precioVenta(iso, "power-bi");
  const lista = precioListaVenta(iso, "power-bi");
  const rival = CODERHOUSE[iso];
  const rivalTexto = `${formatMoneda(iso, rival.promo)} con promo vigente (lista ${formatMoneda(iso, rival.lista)})`;
  const progTexto = precioProgrambiTexto(iso, precio, lista);
  const progHora = precioHora(iso, precio, 20);
  const rivalHora = precioHora(iso, rival.promo, 10);

  const masBaratoTotal = precio != null && precio < rival.promo;
  const respuestaPrecio = masBaratoTotal
    ? `Hoy no: Coderhouse está en ${rivalTexto} por unas 10 h, mientras ProgramBI está en ${progTexto} por 20 h. Por hora en vivo, ProgramBI sale ${progHora} y Coderhouse ${rivalHora} (revisado el ${ACTUALIZADO_TEXTO}).`
    : `En precio total, Coderhouse está más barato con la promo vigente: ${rivalTexto} frente a ${progTexto} de ProgramBI. Pero por hora en vivo ProgramBI sale ${progHora} y Coderhouse ${rivalHora}, porque incluye 20 h y Coderhouse unas 10 h (revisado el ${ACTUALIZADO_TEXTO}).`;

  return {
    slug: "programbi-vs-coderhouse-power-bi",
    rival: "Coderhouse",
    rivalUrl: rival.url,
    ruta: rutaComparativa(iso),
    pais: iso,
    idioma: getPais(iso).idioma,
    h1: "¿Coderhouse o ProgramBI para aprender Power BI? Te lo contamos claro.",
    seoTitle: `ProgramBI vs Coderhouse Power BI en ${NOMBRE_PAIS[iso]}: horas y precio`,
    seoDescription: `Comparamos el curso de Power BI de Coderhouse y ProgramBI en ${NOMBRE_PAIS[iso]}: horas en vivo, precio, precio por hora, cuotas y certificado, con fuentes y fecha de revisión.`,
    subtitulo:
      "Las dos son en vivo. La diferencia está en las horas de clase y en cuánto pagas por cada una.",
    intro:
      "Coderhouse y ProgramBI comparten formato: clases en vivo, profesor y certificado. La decisión práctica está en dos números que casi nadie pone juntos: cuántas horas en vivo recibes y cuánto pagas por cada una. Acá los mostramos con las páginas oficiales de cada academia y la fecha en que las revisamos.",
    ctaPrimario: "Ver fechas y precio de ProgramBI",
    horasProgrambi: 20,
    horasRival: 10,
    precioProgrambi: precio,
    precioListaProgrambi: lista,
    moneda: getPais(iso).moneda,
    precioRival: rival.promo,
    precioRivalTexto: rivalTexto,
    precioRivalNota: "La promo de Coderhouse es variable y puede cambiar sin aviso.",
    filas: [
      {
        criterio: "Horas en vivo",
        programbi: "20 h (lunes y miércoles, 2 h por clase)",
        rival: "5 semanas × 1 clase de 2 h ≈ 10 h",
        fuente: `programbi.com/cursos/power-bi · coderhouse.com/${iso}/cursos/power-bi`,
        fuenteUrl: rival.url,
      },
      {
        criterio: "Precio",
        programbi: progTexto,
        rival: rivalTexto,
        fuente: `programbi.com/precios · coderhouse.com/${iso}/cursos/power-bi`,
        fuenteUrl: rival.url,
      },
      {
        criterio: "Precio por hora en vivo",
        programbi: progHora,
        rival: rivalHora,
        fuente: "Cálculo propio con los precios publicados",
      },
      {
        criterio: "Pago y cuotas",
        programbi: getPais(iso).mediosPago.join(" · "),
        rival: rival.cuotas,
        fuente: "programbi.com/precios · coderhouse.com",
        fuenteUrl: rival.url,
      },
      {
        criterio: "Clases en vivo",
        programbi: "✓",
        rival: "✓",
        fuente: "coderhouse.com",
        fuenteUrl: rival.url,
      },
      {
        criterio: "Prueba",
        programbi: "Clase gratis: pídela por WhatsApp",
        rival: "2 clases gratis",
        fuente: "coderhouse.com",
        fuenteUrl: rival.url,
      },
      {
        criterio: "Horario",
        programbi: horarioProgrambi(iso),
        rival: "1 clase por semana; horario según cohorte",
        fuente: "coderhouse.com",
        fuenteUrl: rival.url,
      },
      {
        criterio: "Certificado",
        programbi: "✓",
        rival: "✓",
        fuente: "coderhouse.com",
        fuenteUrl: rival.url,
      },
    ],
    ganaRival: [
      `Pago en cuotas: ${rival.cuotas.toLowerCase()}.`,
      "Dos clases gratis para probar antes de pagar.",
      "Marca regional grande y comunidad con chat de estudiantes.",
    ],
    ganaProgrambi: [
      "20 horas en vivo: el doble de clases que las ~10 h de Coderhouse.",
      masBaratoTotal
        ? "Precio total menor que la promo vigente de Coderhouse."
        : "Mejor precio por hora en vivo, aunque el total sea mayor con la promo de Coderhouse.",
      "Grupo con profe en vivo y proyecto guiado para salir con un tablero propio.",
    ],
    faqs: [
      {
        q: "¿Coderhouse es más barato?",
        a: respuestaPrecio,
      },
      {
        q: "¿Ambos dan certificado?",
        a: "Sí. Los dos entregan certificado al terminar el curso, según sus páginas oficiales.",
      },
      {
        q: "¿Puedo probar antes de pagar?",
        a: "Sí. Coderhouse ofrece 2 clases gratis. En ProgramBI puedes pedir una clase de prueba por WhatsApp antes de inscribirte.",
      },
      {
        q: "¿Cuántas horas en vivo tiene cada uno?",
        a: "ProgramBI: 20 horas en 10 clases de 2 horas, lunes y miércoles. Coderhouse: 5 semanas con 1 clase semanal de 2 horas, aproximadamente 10 horas en vivo.",
      },
      {
        q: "¿La promo de Coderhouse es permanente?",
        a: `No. Al revisar su página el ${ACTUALIZADO_TEXTO} había una promoción vigente, pero el precio y el descuento cambian. Por eso mostramos también el precio de lista.`,
      },
    ],
    fuentes: [
      { etiqueta: "ProgramBI · curso de Power BI", url: "https://www.programbi.com/cursos/power-bi" },
      { etiqueta: "ProgramBI · precios", url: "https://www.programbi.com/precios" },
      { etiqueta: `Coderhouse · curso de Power BI (${NOMBRE_PAIS[iso]})`, url: rival.url },
    ],
    rutaCurso: rutaCurso(iso),
    rutaPrecios: rutaPrecios(iso),
    rutaGuiaPais: GUIA_PAIS[iso],
    notaCalculadora: `Usamos el precio promocional vigente de Coderhouse y sus ~10 h de clase en vivo. ProgramBI son 20 h. Revisado el ${ACTUALIZADO_TEXTO}.`,
  };
}

export function variantesCoderhouse(): { iso: PaisComparativa; nombre: string; ruta: string }[] {
  return PAISES_CODERHOUSE.map((iso) => ({
    iso,
    nombre: NOMBRE_PAIS[iso],
    ruta: rutaComparativa(iso),
  }));
}

export function hreflangCoderhouse(): Record<string, string> {
  const languages: Record<string, string> = {
    "x-default": `https://www.programbi.com${RUTA_CODERHOUSE}`,
  };
  for (const iso of PAISES_CODERHOUSE) {
    languages[getPais(iso).idioma] = `https://www.programbi.com${rutaComparativa(iso)}`;
  }
  return languages;
}

/** Comparativa Platzi (Chile, sin variantes de país). */
export function comparativaPlatzi(): ComparativaAcademia {
  const iso: PaisComparativa = "cl";
  const precio = precioVenta(iso, "power-bi");
  const lista = precioListaVenta(iso, "power-bi");
  const progTexto = precioProgrambiTexto(iso, precio, lista);
  const basic = formatMoneda(iso, 39000);
  const expert = formatMoneda(iso, 219900);
  const rivalTexto = `Basic ${basic}/mes · Expert ${expert}/año`;

  return {
    slug: "alternativa-a-platzi-en-vivo",
    rival: "Platzi",
    rivalUrl: "https://platzi.com/cursos/powerbi/",
    ruta: RUTA_PLATZI,
    pais: iso,
    idioma: getPais(iso).idioma,
    h1: "¿Platzi o clases en vivo? Depende de cómo aprendes.",
    seoTitle: "Alternativa a Platzi: curso de Power BI en vivo",
    seoDescription:
      "Platzi es una suscripción con cursos grabados; ProgramBI es un curso de Power BI en vivo. Comparamos formato, precio, catálogo y feedback con fuentes revisadas.",
    subtitulo:
      "Platzi es una suscripción con miles de cursos grabados. ProgramBI es un curso en vivo, con profe y compañeros, para salir con un tablero propio.",
    intro:
      "No son el mismo producto. Platzi te da acceso amplio y a tu ritmo; ProgramBI te da un calendario, un profe en vivo y un grupo con el que avanzar. La pregunta útil no es cuál es «mejor», sino cuál se ajusta a tu forma de aprender y al plazo que tienes.",
    ctaPrimario: "Probar una clase en vivo",
    horasProgrambi: 20,
    horasRival: null,
    precioProgrambi: precio,
    precioListaProgrambi: lista,
    moneda: getPais(iso).moneda,
    precioRival: null,
    precioRivalTexto: rivalTexto,
    precioRivalNota: "Platzi cobra una suscripción, no un precio por curso.",
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
        criterio: "Contenido del curso de Power BI",
        programbi: "20 h en vivo, 8 módulos y proyecto guiado",
        rival: "25 clases, 3 h de video y 14 h de práctica",
        fuente: "platzi.com/cursos/powerbi/",
        fuenteUrl: "https://platzi.com/cursos/powerbi/",
      },
      {
        criterio: "Catálogo",
        programbi: "Stack BI enfocado: Power BI, SQL, Excel y Python",
        rival: "7 rutas de la Escuela de Data Science y otras escuelas",
        fuente: "platzi.com/escuela/datos/",
        fuenteUrl: "https://platzi.com/escuela/datos/",
      },
      {
        criterio: "Feedback de un profe en vivo",
        programbi: "✓",
        rival: "—",
        fuente: "El curso de Power BI de Platzi es grabado",
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
        rival: "✓",
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
        a: "Sí, si te funciona aprender con video y a tu ritmo. Su curso de Power BI tiene 25 clases, 3 horas de video y 14 horas de práctica. Lo que no tiene es un profe en vivo corrigiendo tus dudas en el momento.",
      },
      {
        q: "¿Cuál es más barato?",
        a: `Depende de cuánto uses la suscripción. Platzi parte en ${basic}/mes (Basic) o ${expert}/año (Expert). ProgramBI es ${progTexto} por un curso en vivo de 20 h. Si vas a estudiar varios temas durante un año, la suscripción puede rendir más; si necesitas Power BI aplicado y con fecha de término, el curso en vivo suele ser más directo.`,
      },
      {
        q: "¿Puedo aprender Power BI solo con Platzi?",
        a: "Sí. Su curso cubre Power Query, DAX, modelado y visualización. La diferencia es el acompañamiento: en un curso en vivo puedes preguntar cuando una medida no cuadra y avanzar con un calendario.",
      },
      {
        q: "¿Ambos dan certificado?",
        a: "Sí. Platzi entrega un certificado digital al aprobar cada curso y ProgramBI entrega su certificado al completar el curso en vivo.",
      },
      {
        q: "¿Platzi tiene clases en vivo?",
        a: "Platzi ofrece sesiones en vivo y comunidad en su plataforma, pero el curso de Power BI que comparamos es de video grabado. ProgramBI dicta todas sus clases en vivo por Zoom.",
      },
    ],
    fuentes: [
      { etiqueta: "ProgramBI · curso de Power BI", url: "https://www.programbi.com/cursos/power-bi" },
      { etiqueta: "ProgramBI · precios", url: "https://www.programbi.com/precios" },
      { etiqueta: "Platzi · curso de Power BI", url: "https://platzi.com/cursos/powerbi/" },
      { etiqueta: "Platzi · precios", url: "https://platzi.com/precios/" },
      { etiqueta: "Platzi · Escuela de Data Science", url: "https://platzi.com/escuela/datos/" },
    ],
    rutaCurso: rutaCurso(iso),
    rutaPrecios: rutaPrecios(iso),
    rutaGuiaPais: GUIA_PAIS.cl,
    notaCalculadora:
      "Platzi es una suscripción: no tiene un precio por curso ni horas de clase en vivo comparables. La calculadora muestra solo el curso de ProgramBI.",
  };
}

/** Comparativa IPS DATAX (Chile, sin variantes de país). */
export function comparativaIpsDatax(): ComparativaAcademia {
  const iso: PaisComparativa = "cl";
  const precio = precioVenta(iso, "power-bi");
  const lista = precioListaVenta(iso, "power-bi");
  const progTexto = precioProgrambiTexto(iso, precio, lista);

  return {
    slug: "ips-datax-vs-programbi",
    rival: "IPS DATAX",
    rivalUrl: "https://ipsdatax.com/cursos/",
    ruta: RUTA_IPS,
    pais: iso,
    idioma: getPais(iso).idioma,
    h1: "IPS DATAX o ProgramBI: grabado a tu ritmo o en vivo con horario.",
    seoTitle: "IPS DATAX vs ProgramBI: Power BI grabado o en vivo",
    seoDescription:
      "Dos academias chilenas de datos con enfoques distintos: IPS DATAX vende cursos grabados y ProgramBI dicta clases en vivo. Comparamos precio, formato y acompañamiento.",
    subtitulo:
      "Dos academias chilenas de datos con enfoques distintos. Elige según cómo te comprometes mejor.",
    intro:
      "IPS DATAX tiene un catálogo amplio y acceso de por vida a cursos individuales; ProgramBI apuesta por cohortes en vivo con horario y profe. Ninguno es mejor en abstracto: uno premia la autonomía y el otro, la constancia con acompañamiento.",
    ctaPrimario: "Ver la próxima cohorte",
    horasProgrambi: 20,
    horasRival: null,
    precioProgrambi: precio,
    precioListaProgrambi: lista,
    moneda: getPais(iso).moneda,
    precioRival: null,
    precioRivalTexto: "US$197 pago único (Power BI Completo, grabado)",
    precioRivalNota: "IPS DATAX cobra en dólares y el acceso es de por vida.",
    filas: [
      {
        criterio: "Formato",
        programbi: "Clases en vivo, cohorte",
        rival: "Cursos grabados en Hotmart + sesiones grupales mensuales en Premium",
        fuente: "ipsdatax.com/cursos/ · ipsdatax.com/lab/",
        fuenteUrl: "https://ipsdatax.com/cursos/",
      },
      {
        criterio: "Power BI",
        programbi: `${progTexto} por 20 h en vivo`,
        rival: "US$197 pago único (Power BI Completo, grabado)",
        fuente: "ipsdatax.com/cursos/",
        fuenteUrl: "https://ipsdatax.com/cursos/",
      },
      {
        criterio: "Entrada",
        programbi: "Clase gratis por WhatsApp o plantilla gratis",
        rival: "Curso ADD (Análisis de Datos) por US$27",
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
        programbi: "Grabaciones de por vida + certificado",
        rival: "Acceso de por vida en cursos individuales",
        fuente: "ipsdatax.com/cursos/",
        fuenteUrl: "https://ipsdatax.com/cursos/",
      },
      {
        criterio: "Catálogo",
        programbi: "Stack BI enfocado: Power BI, SQL, Excel y Python",
        rival: "Más de 200 h: Excel, SQL, Power BI, Python, Data Science e IA",
        fuente: "ipsdatax.com/lab/",
        fuenteUrl: "https://ipsdatax.com/lab/",
      },
      {
        criterio: "Clases en vivo",
        programbi: "✓",
        rival: "—",
        fuente: "Los cursos individuales son grabados; Premium suma sesiones grupales",
        fuenteUrl: "https://ipsdatax.com/lab/",
      },
      {
        criterio: "Certificado",
        programbi: "✓",
        rival: "✓",
        fuente: "ipsdatax.com/cursos/",
        fuenteUrl: "https://ipsdatax.com/cursos/",
      },
    ],
    ganaRival: [
      "Catálogo amplio: más de 200 horas en Excel, SQL, Power BI, Python, Data Science e IA.",
      "Acceso de por vida en cursos individuales y un precio de entrada bajo (US$27).",
      "Sesiones grupales mensuales y comunidad si eliges la membresía Premium.",
    ],
    ganaProgrambi: [
      "Clases en vivo con horario y profe: resuelves dudas mientras avanzas.",
      "Grupo con profe y compañeros, y proyecto guiado para salir con un tablero aplicado a tu trabajo.",
      "Precio en pesos chilenos y medios de pago locales.",
    ],
    faqs: [
      {
        q: "¿IPS DATAX es en vivo?",
        a: "Sus cursos individuales son grabados y se alojan en Hotmart. La membresía Premium suma sesiones grupales mensuales en vivo, según su página.",
      },
      {
        q: "¿Cuál es más barato?",
        a: "El curso de Power BI de IPS DATAX cuesta US$197 con acceso de por vida. ProgramBI cuesta " +
          `${progTexto} por 20 h en vivo. No son comparables uno a uno: uno es grabado y el otro tiene horario y profe.`,
      },
      {
        q: "¿Puedo probar antes?",
        a: "IPS DATAX tiene un curso de entrada de US$27 (Análisis de Datos). En ProgramBI puedes pedir una clase de prueba por WhatsApp o descargar una plantilla gratis.",
      },
      {
        q: "¿Ambos dan certificado?",
        a: "Sí. IPS DATAX entrega certificado de aprobación en sus cursos y ProgramBI entrega certificado al completar el curso en vivo.",
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
      { etiqueta: "IPS DATAX · curso Análisis de Datos", url: "https://ipsdatax.com/cursos/analisis-de-datos/" },
    ],
    rutaCurso: rutaCurso(iso),
    rutaPrecios: rutaPrecios(iso),
    rutaGuiaPais: GUIA_PAIS.cl,
    notaCalculadora:
      "IPS DATAX vende cursos grabados en dólares y no publica horas de clase en vivo comparables. La calculadora muestra solo el curso de ProgramBI.",
  };
}

/** Comparativa Desafío Latam (Chile, sin variantes de país). */
export function comparativaDesafioLatam(): ComparativaAcademia {
  const iso: PaisComparativa = "cl";
  const precio = precioVenta(iso, "power-bi");
  const lista = precioListaVenta(iso, "power-bi");
  const progTexto = precioProgrambiTexto(iso, precio, lista);

  return {
    slug: "desafio-latam-vs-programbi",
    rival: "Desafío Latam",
    rivalUrl: "https://desafiolatam.com/data-analytics",
    ruta: RUTA_DESAFIO,
    pais: iso,
    idioma: getPais(iso).idioma,
    h1: "¿Bootcamp de 8 meses o un curso de 20 horas?",
    seoTitle: "Desafío Latam vs ProgramBI: bootcamp o curso de Power BI",
    seoDescription:
      "Comparamos un bootcamp de Data Analytics de 32 semanas con un curso de Power BI de 20 horas. Duración, precio publicado, empleabilidad y para quién es cada uno.",
    subtitulo:
      "Si quieres cambiar de carrera, un bootcamp tiene sentido. Si necesitas Power BI para tu pega este mes, no.",
    intro:
      "Desafío Latam vende una carrera larga de Data Analytics; ProgramBI vende un curso corto y aplicado de Power BI. La comparación solo tiene sentido si miras tu objetivo: cambiar de rubro o resolver un problema concreto en tu trabajo actual.",
    ctaPrimario: "Ver el curso de 20 h",
    horasProgrambi: 20,
    horasRival: null,
    precioProgrambi: precio,
    precioListaProgrambi: lista,
    moneda: getPais(iso).moneda,
    precioRival: null,
    precioRivalTexto: "No publicado en la página revisada: se cotiza con un asesor",
    precioRivalNota:
      "No publicamos una cifra de Desafío Latam porque su página de carrera devolvió 404 al revisarla.",
    filas: [
      {
        criterio: "Duración",
        programbi: "20 h / ~5 semanas",
        rival: "Data Analytics: 32 semanas (~8 meses), live online, ~7 h por semana. Data Science: 50 semanas (~12 meses)",
        fuente: "desafiolatam.com/data-analytics · desafiolatam.com/data-science",
        fuenteUrl: "https://desafiolatam.com/data-analytics",
      },
      {
        criterio: "Precio",
        programbi: progTexto,
        rival: "No publicado en la página revisada: se cotiza con un asesor",
        fuente: "desafiolatam.com/data-analytics",
        fuenteUrl: "https://desafiolatam.com/data-analytics",
      },
      {
        criterio: "Enfoque",
        programbi: "Power BI aplicado a tu pega; sales con un tablero propio",
        rival: "Formación integral: SQL, Python, estadística y visualización",
        fuente: "desafiolatam.com/data-analytics",
        fuenteUrl: "https://desafiolatam.com/data-analytics",
      },
      {
        criterio: "Empleabilidad",
        programbi: "Bolsa de empleos de ProgramBI (/empleos)",
        rival: "91% de empleabilidad a 6 meses (cifra autodeclarada en su sitio)",
        fuente: "desafiolatam.com/data-analytics",
        fuenteUrl: "https://desafiolatam.com/data-analytics",
      },
      {
        criterio: "Modalidad",
        programbi: "En vivo por Zoom, dos clases por semana",
        rival: "Live online, ~7 h semanales",
        fuente: "desafiolatam.com/data-analytics",
        fuenteUrl: "https://desafiolatam.com/data-analytics",
      },
      {
        criterio: "Clases en vivo",
        programbi: "✓",
        rival: "✓",
        fuente: "desafiolatam.com/data-analytics",
        fuenteUrl: "https://desafiolatam.com/data-analytics",
      },
      {
        criterio: "Certificado",
        programbi: "✓",
        rival: "Consultar el detalle en su sitio",
        fuente: "desafiolatam.com/data-analytics",
        fuenteUrl: "https://desafiolatam.com/data-analytics",
      },
    ],
    ganaRival: [
      "Recorrido completo: SQL, Python, estadística y visualización en un solo programa largo.",
      "Acompañamiento de empleabilidad y una cifra de inserción que ellos mismos declaran (91% a 6 meses).",
      "Tiene sentido si tu objetivo es cambiar de carrera, no solo aprender una herramienta.",
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
        a: "No publicamos esa cifra porque la página de la carrera devolvió 404 al revisarla y no encontramos un precio vivo que pudiéramos citar. En su sitio se cotiza con un asesor. No inventamos el monto.",
      },
      {
        q: "¿Cuánto dura Data Analytics de Desafío Latam?",
        a: "32 semanas, aproximadamente 8 meses, en modalidad live online y con una carga de unas 7 horas semanales, según su página de Data Analytics.",
      },
      {
        q: "¿ProgramBI sirve para cambiar de carrera?",
        a: "Es un curso de 20 horas enfocado en Power BI. Sirve para sumar una herramienta clave a tu perfil actual; si tu plan es una reconversión completa, probablemente necesites además SQL, Python y un portafolio más amplio.",
      },
      {
        q: "¿Ambos tienen clases en vivo?",
        a: "Sí. Desafío Latam se presenta como live online y ProgramBI dicta clases en vivo por Zoom, lunes y miércoles.",
      },
    ],
    fuentes: [
      { etiqueta: "ProgramBI · curso de Power BI", url: "https://www.programbi.com/cursos/power-bi" },
      { etiqueta: "ProgramBI · precios", url: "https://www.programbi.com/precios" },
      { etiqueta: "Desafío Latam · Data Analytics", url: "https://desafiolatam.com/data-analytics" },
      { etiqueta: "Desafío Latam · Data Science", url: "https://desafiolatam.com/data-science" },
    ],
    rutaCurso: rutaCurso(iso),
    rutaPrecios: rutaPrecios(iso),
    rutaGuiaPais: GUIA_PAIS.cl,
    notaCalculadora:
      "Desafío Latam no publica el precio en la página revisada y su programa no se mide en horas de clase equivalentes. La calculadora muestra solo ProgramBI.",
  };
}

/** Opciones del listicle de Power BI en Chile, con precios verificados el 04-11-2026. */
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

export function opcionesListiclePowerBiChile(): OpcionListicle[] {
  const programbi = precioVenta("cl", "power-bi");
  const lista = precioListaVenta("cl", "power-bi");

  return [
    {
      nombre: "ProgramBI",
      precio: programbi != null ? formatMoneda("cl", programbi) : "Consultar por WhatsApp",
      precioNota: lista != null ? `Lista ${formatMoneda("cl", lista)}` : undefined,
      horas: "20 h en vivo",
      formato: "En vivo por Zoom, lunes y miércoles; grabaciones y certificado",
      certificado: "Sí",
      fuente: "programbi.com/cursos/power-bi",
      fuenteUrl: "https://www.programbi.com/cursos/power-bi",
      destacada: true,
    },
    {
      nombre: "Coderhouse",
      precio: formatMoneda("cl", 198000),
      precioNota: `Lista ${formatMoneda("cl", 495000)}; promo variable`,
      horas: "5 semanas, 1 clase semanal de 2 h (~10 h)",
      formato: "En vivo, 6 módulos y proyecto final",
      certificado: "Sí",
      fuente: "coderhouse.com/cl/cursos/power-bi",
      fuenteUrl: "https://www.coderhouse.com/cl/cursos/power-bi",
    },
    {
      nombre: "Crenn",
      precio: formatMoneda("cl", 60000),
      horas: "16 h en vivo + 24 h complementarias",
      formato: "En vivo por Zoom, máximo 8 personas, 8 clases de 2 h",
      certificado: "Sí",
      fuente: "crenn.cl/curso-power-bi-intermedio/",
      fuenteUrl: "https://crenn.cl/curso-power-bi-intermedio/",
    },
    {
      nombre: "UC · Teleduc",
      precio: formatMoneda("cl", 109200),
      precioNota: `35% off hasta el 30-11; lista ${formatMoneda("cl", 168000)}`,
      horas: "30 h cronológicas",
      formato: "Online, con tutor; código SENCE 1238071925",
      certificado: "Certificación UC",
      fuente: "teleduc.uc.cl",
      fuenteUrl:
        "https://teleduc.uc.cl/products/power-bi-intermedio-para-el-analisis-de-datos",
    },
    {
      nombre: "Qualitymas",
      precio: formatMoneda("cl", 240000),
      horas: "24 h",
      formato: "E-learning sincrónico (clases en vivo); código SENCE 1238068222",
      certificado: "Consultar en su sitio",
      fuente: "qualitymas.cl",
      fuenteUrl:
        "https://www.qualitymas.cl/curso-detalle/business-intelligence/2/power-bi-corporativo",
    },
    {
      nombre: "Platzi",
      precio: `${formatMoneda("cl", 39000)}/mes`,
      precioNota: `Expert ${formatMoneda("cl", 219900)}/año`,
      horas: "Curso de 25 clases: 3 h de video y 14 h de práctica",
      formato: "Videos grabados dentro de una suscripción",
      certificado: "Sí",
      fuente: "platzi.com/precios/",
      fuenteUrl: "https://platzi.com/precios/",
    },
    {
      nombre: "IPS DATAX",
      precio: "US$197",
      precioNota: "Pago único, acceso de por vida",
      horas: "Curso grabado (sin horas en vivo)",
      formato: "Grabado en Hotmart; Premium suma sesiones grupales mensuales",
      certificado: "Sí",
      fuente: "ipsdatax.com/cursos/",
      fuenteUrl: "https://ipsdatax.com/cursos/",
    },
  ];
}

export function faqsListiclePowerBiChile(): { q: string; a: string }[] {
  const programbi = precioVenta("cl", "power-bi");
  const programbiTexto = programbi != null ? formatMoneda("cl", programbi) : "consultar por WhatsApp";

  return [
    {
      q: "¿Cuál es el mejor curso de Power BI en Chile?",
      a: `No hay uno solo. Si buscas precio bajo y grupo pequeño, Crenn ofrece 16 h en vivo por $60.000. Si quieres certificación universitaria, UC Teleduc tiene 30 h por $109.200 con descuento vigente. Si buscas un curso en vivo de 20 h con proyecto y precio publicado, ProgramBI está en ${programbiTexto}. La mejor opción depende de tu presupuesto, tu horario y si necesitas certificado universitario o de academia.`,
    },
    {
      q: "¿Cuál es el más barato?",
      a: `Entre los cursos en vivo de la tabla, Crenn es el más barato: $60.000 por 16 h. Le sigue UC Teleduc con $109.200 por 30 h (precio con 35% de descuento vigente hasta el 30-11-2026). ProgramBI cuesta ${programbiTexto} por 20 h. Los precios promocionales cambian, así que revisa la fuente antes de inscribirte.`,
    },
    {
      q: "¿Cuál tiene más horas en vivo?",
      a: "UC Teleduc declara 30 horas cronológicas y Qualitymas 24 horas. ProgramBI tiene 20 h en vivo y Crenn 16 h en vivo más 24 h complementarias. Más horas no significa mejor curso: importa el temario, el tamaño del grupo y si las clases quedan grabadas.",
    },
    {
      q: "¿Los cursos incluyen certificado?",
      a: "ProgramBI, Coderhouse, Crenn, Platzi e IPS DATAX indican certificado en sus páginas. UC Teleduc entrega certificación de la Pontificia Universidad Católica de Chile. En la página de Qualitymas que revisamos no se detalla el certificado, así que conviene consultarlo antes de inscribirse. Revisa siempre las condiciones de aprobación de cada programa.",
    },
    {
      q: "¿Por qué esta guía incluye a la competencia?",
      a: "Porque una comparación sin alternativas no sirve. Esta guía la hace ProgramBI y lo decimos arriba: incluimos a competidores directos y señalamos dónde pueden convenir más, para que decidas con datos y no con publicidad.",
    },
    {
      q: "¿Cada cuánto se actualiza?",
      a: `Revisamos precios y URLs el ${ACTUALIZADO_TEXTO}. Los precios de cursos y promociones cambian rápido, así que la fecha de revisión está visible y cada fila enlaza a su fuente.`,
    },
  ];
}

export const PRECIOS_VALIDOS_DESDE = PRECIOS_VALID_FROM;

/** Rutas de las comparativas nuevas (Chile) para el sitemap y el hub. */
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
      rival: "7 opciones",
      etiqueta: "Guía",
      title: "Mejores cursos de Power BI en Chile (2026)",
      description:
        "Precio, horas en vivo, formato y certificado de 7 opciones. Incluye a la competencia y declara quién hace la guía.",
    },
  ];
}
