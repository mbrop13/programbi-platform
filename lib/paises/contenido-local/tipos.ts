/**
 * Contrato de datos del bloque local de país (WS8).
 *
 * WS7 define `DatosBloqueLocal` y el componente `components/paises/BloqueLocalPais.tsx`
 * en su rama. Como este worktree parte de `3ffabe5` (sin WS7), WS8 implementa
 * aquí una interfaz equivalente y separada para no bloquear Argentina y
 * Colombia. El orquestador concilia ambos contratos al integrar:
 *
 *   - `iso`, `nombre`, `moneda`, `zonaHoraria`: espejo de `config/paises.ts`.
 *   - `datos`: textos fijos de la franja de datos del mercado.
 *   - `paginas`: contenido propio por ruta; la clave es la misma que usa el
 *     componente (`hub`, `cursos`, `curso:<slug>`, `empresas`, `precios`).
 *   - `faqs`: 4 a 6 preguntas por página. El componente genera el FAQPage
 *     JSON-LD desde este mismo arreglo (una sola fuente).
 *
 * Regla editorial: no se inventan precios, clientes, testimonios ni cifras.
 * El precio se publica en la moneda del país desde `config/paises.ts`; el
 * monto visible sigue detrás del gate de brochure (`lib/pricing-gate.ts`).
 */

export type RutaBloqueLocal =
  | "hub"
  | "cursos"
  | "curso:power-bi"
  | "curso:analisis-de-datos"
  | "curso:python"
  | "empresas"
  | "precios";

export type FaqBloqueLocal = {
  q: string;
  a: string;
};

export type PaginaBloqueLocal = {
  /** Etiqueta superior del bloque. */
  kicker: string;
  /** Título del bloque (H2). */
  titulo: string;
  /** Párrafo de entrada, debajo del título. */
  intro: string;
  /** Párrafos propios del mercado y de la ruta. */
  parrafos: string[];
  /** Preguntas visibles y, a la vez, fuente del FAQPage JSON-LD. */
  faqs: FaqBloqueLocal[];
};

export type DatosFranjaLocal = {
  /** Título de la tarjeta de precio. */
  precioTitulo: string;
  /** Cómo se consulta el valor en ese mercado. */
  precioDetalle: string;
  /** Nota del horario local (además de la conversión calculada). */
  horarioDetalle: string;
  /** Nota de medios de pago. */
  pagoDetalle: string;
  /** Nota de cuotas sin interés. */
  cuotasDetalle: string;
  /** Clase gratis, sin anunciar fechas que no existan. */
  claseGratis: string;
  /** Certificado incluido. */
  certificado: string;
};

export type DatosBloqueLocal = {
  iso: string;
  nombre: string;
  moneda: string;
  /** Zona IANA. El componente convierte 19:30–21:30 de Chile a esta zona. */
  zonaHoraria: string;
  datos: DatosFranjaLocal;
  paginas: Partial<Record<RutaBloqueLocal, PaginaBloqueLocal>>;
};

/** Las páginas que WS8 cubre en cada país. */
export const RUTAS_BLOQUE_LOCAL: RutaBloqueLocal[] = [
  "hub",
  "cursos",
  "curso:power-bi",
  "curso:analisis-de-datos",
  "curso:python",
  "empresas",
  "precios",
];
