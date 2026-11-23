/** Contrato tipado para las guías técnicas paso a paso (`/guias/<slug>`). */

export type NivelGuia = "Básico" | "Intermedio" | "Avanzado";

export type HerramientaGuia =
  | "Excel"
  | "Power BI"
  | "Power Automate"
  | "SQL"
  | "Python"
  | "IA"
  | "Google Sheets"
  | "Carrera";

export type CursoGuiaSlug =
  | "excel"
  | "power-bi"
  | "power-automate"
  | "sql-server"
  | "python"
  | "ia-productividad"
  | "analisis-de-datos"
  | "copilot"
  | "claude"
  | "chatgpt"
  | "gemini"
  | "machine-learning";

export type IconoPaso =
  | "database"
  | "code"
  | "table"
  | "chart"
  | "settings"
  | "check"
  | "sparkles"
  | "mail"
  | "calendar"
  | "shield"
  | "file"
  | "refresh"
  | "layers"
  | "terminal";

export interface BloqueCodigo {
  titulo: string;
  lenguaje:
    | "m"
    | "dax"
    | "excel"
    | "vba"
    | "python"
    | "sql"
    | "json"
    | "power-automate"
    | "prompt"
    | "sheets"
    | "bash";
  /** Código principal (para Excel siempre en español con `;`). */
  codigo: string;
  /** Versión alternativa en inglés (para fórmulas de Excel con `,`). */
  codigoEn?: string;
  nota?: string;
  mostrarLineas?: boolean;
}

export interface CapturaGuia {
  /** ID estable `<slug>-paso-<n>` o `<slug>-<clave>`, coincide con `CAPTURAS.md`. */
  id: string;
  alt: string;
  caption: string;
  ratio?: "16/9";
}

export interface TablaGuia {
  caption?: string;
  encabezados: string[];
  filas: string[][];
}

export interface SubseccionGuia {
  id: string;
  titulo: string;
  parrafos: string[];
  lista?: string[];
  codigo?: BloqueCodigo;
  captura?: CapturaGuia;
  tabla?: TablaGuia;
}

export interface SeccionGuia {
  id: string;
  titulo: string;
  /** Si es `true`, entra en `HowTo.step[]` del JSON-LD con `url#id`. */
  esPasoHowTo?: boolean;
  /** Resumen limpio en texto plano para el paso del JSON-LD `HowToStep`. */
  resumenHowTo?: string;
  parrafos: string[];
  lista?: string[];
  listaOrdenada?: string[];
  subsecciones?: SubseccionGuia[];
  codigos?: BloqueCodigo[];
  captura?: CapturaGuia;
  tabla?: TablaGuia;
  alerta?: {
    tipo: "info" | "warning" | "tip";
    titulo: string;
    texto: string;
  };
  /** Caja «Verifica el resultado» al final de pasos que usan IA. */
  verificaResultado?: string;
}

export interface ErrorComunGuia {
  error: string;
  causa: string;
  solucion: string;
}

export interface PasoRutaVisual {
  numero: number;
  titulo: string;
  resumen: string;
  anchorId: string;
  icono: IconoPaso;
}

export interface GuiaPasoAPaso {
  slug: string;
  /** ≤ 60 caracteres exactos. */
  title: string;
  /** 140 a 155 caracteres exactos. */
  meta: string;
  h1: string;
  subtitle: string;
  keywordPrincipal: string;
  keywords: string[];
  curso: CursoGuiaSlug;
  cursoSecundario?: CursoGuiaSlug;
  cursosSecundarios?: CursoGuiaSlug[];
  herramienta: HerramientaGuia;
  nivel: NivelGuia;
  /** Fecha ISO `YYYY-MM-DD`, p. ej. `2026-11-21`. */
  updated: string;
  published: string;
  /** Duración ISO 8601 para `HowTo.totalTime`, p. ej. `PT20M`. */
  totalTimeIso: string;
  /** `true` en guías insignia, exige ≥ 2.000 palabras útiles. */
  esInsignia?: boolean;
  /** Marca guías que usan IA (activa aviso de privacidad de datos sensibles si aplica). */
  esGuiaIA?: boolean;
  /** Aviso específico de privacidad y anonimización para guías de IA. */
  avisoPrivacidad?: string;
  /** `true` en guías conceptuales o comparativas donde no aplica schema `HowTo`. */
  omitirHowTo?: boolean;
  en30Segundos: {
    queLogras: string;
    herramienta: string;
    tiempo: string;
    bullets: string[];
  };
  /** 4 a 7 pasos que enlazan a `SeccionGuia.id`. */
  rutaVisual: PasoRutaVisual[];
  requisitos: {
    version: string;
    lista: string[];
    compatibilidadMacWeb: string;
    avisoEducativo?: string;
  };
  /** Incluye al menos 1 tabla comparativa relevante. */
  secciones: SeccionGuia[];
  /** 3 a 6 errores reales y soluciones concretas. */
  erroresComunes: ErrorComunGuia[];
  /** Bloque placeholder desactivado «Próximamente». */
  plantilla: {
    titulo: string;
    descripcion: string;
  };
  /** 4 a 6 preguntas reales; mismas en acordeón UI y `FAQPage`. */
  faqs: { q: string; a: string }[];
  /** Exactamente 3 slugs válidos de guías relacionadas. */
  relacionadas: [string, string, string];
  enlacesExternos: {
    label: string;
    url: string;
    fuente: string;
  }[];
  enlacesInternosExtra?: {
    label: string;
    href: string;
    descripcion?: string;
  }[];
  /** Solo herramientas visibles en `requisitos` (para `HowTo.tool`). */
  herramientasHowTo?: string[];
  /** Solo insumos visibles en `requisitos` (para `HowTo.supply`). */
  insumosHowTo?: string[];
}
