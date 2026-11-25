import type { GuiaPasoAPaso } from "@/lib/guias/paso-a-paso-tipos";
import { PLANTILLAS_MX } from "@/lib/leads-magnet";

export const guia: GuiaPasoAPaso = {
  slug: "tabla-isr-2026-excel",
  pais: "mx",
  title: "Tabla ISR 2026 mensual y cálculo en Excel (sueldos)",
  meta: "Tabla ISR 2026 mensual del Anexo 8 RMF en Excel: 11 tramos de $0.01 a $425,642.00+, paso a paso con BUSCARV y BUSCARX para calcular el ISR de tu sueldo.",
  h1: "Tabla ISR 2026 y cómo calcular el ISR de tu sueldo en Excel",
  subtitle:
    "Construye la calculadora de ISR mensual 2026 en Excel usando la estructura de 11 tramos del Anexo 8 de la Resolución Miscelánea Fiscal (RMF) 2026 (desde $0.01–$844.59 al 1.92% hasta $425,642.00+ al 35.00%) con BUSCARV aproximado y BUSCARX.",
  keywordPrincipal: "tabla isr 2026 excel",
  keywords: [
    "tabla isr 2026 mensual excel",
    "calcular isr sueldo excel buscarv",
    "anexo 8 rmf 2026 isr",
    "isr 2026 mexico formula excel",
  ],
  curso: "excel",
  herramienta: "Excel",
  nivel: "Intermedio",
  updated: "2026-11-25",
  published: "2026-11-25",
  totalTimeIso: "PT25M",
  en30Segundos: {
    queLogras:
      "Una hoja Parametros con los 11 tramos de la tarifa mensual ISR 2026 (Anexo 8 RMF) y la fórmula exacta de límite inferior, porcentaje sobre excedente y cuota fija con BUSCARV / BUSCARX.",
    herramienta: "Microsoft Excel (365, 2021, 2019 o Excel Web)",
    tiempo: "25 minutos",
    bullets: [
      "Estructura oficial de 11 tramos del Anexo 8 RMF 2026 (1.92% hasta 35.00%).",
      "Búsqueda por rango con BUSCARV(..., VERDADERO) y alternativa moderna BUSCARX.",
      "Cálculo paso a paso: Excedente × Tasa + Cuota Fija.",
      "Plantilla .xlsx descargable y advertencia sobre verificación del subsidio al empleo en DOF.",
    ],
  },
  rutaVisual: [
    {
      numero: 1,
      titulo: "Estructura Anexo 8",
      resumen: "Organiza los 11 tramos ordenados por límite inferior.",
      anchorId: "estructura-anexo-8",
      icono: "table",
    },
    {
      numero: 2,
      titulo: "BUSCARV por rango",
      resumen: "Encuentra límite inferior, cuota fija y tasa con coincidencia aproximada.",
      anchorId: "buscarv-aproximado",
      icono: "code",
    },
    {
      numero: 3,
      titulo: "Fórmula ISR y BUSCARX",
      resumen: "Calcula el impuesto determinado y su equivalente en Excel 365.",
      anchorId: "formula-isr-buscarx",
      icono: "settings",
    },
    {
      numero: 4,
      titulo: "Verificación DOF",
      resumen: "Revisa criterios de subsidio al empleo y actualización oficial en SAT/DOF.",
      anchorId: "verificacion-dof",
      icono: "shield",
    },
  ],
  requisitos: {
    version: "Excel 365 (BUSCARX), Excel 2021/2019 o Excel Web (BUSCARV)",
    lista: [
      "Microsoft Excel en Windows, macOS o versión Web.",
      "Base gravable mensual del sueldo (ingreso menos prestaciones exentas).",
      "Tarifa mensual vigente publicada en el Anexo 8 de la RMF 2026 (DOF / SAT).",
    ],
    compatibilidadMacWeb:
      "BUSCARV (VLOOKUP) funciona en todas las versiones de Excel. BUSCARX (XLOOKUP) requiere Excel 365, Excel 2021 o Excel para la Web.",
    avisoEducativo:
      "Guía educativa de cálculo en Excel. Antes de timbrar nómina, valida los 11 tramos completos y el decreto vigente de subsidio al empleo directamente en el Diario Oficial de la Federación (dof.gob.mx) y sat.gob.mx.",
  },
  herramientasHowTo: ["Microsoft Excel", "Anexo 8 RMF 2026 (SAT / DOF)"],
  insumosHowTo: ["Base gravable mensual en MXN", "Tabla de 11 tramos ordenada ascendentemente"],
  secciones: [
    {
      id: "estructura-anexo-8",
      titulo: "Estructura de los 11 tramos del Anexo 8 RMF 2026",
      esPasoHowTo: true,
      resumenHowTo:
        "Arma la tabla de 11 tramos en la hoja Parametros ordenada por Límite Inferior de menor a mayor.",
      parrafos: [
        "La tarifa mensual del artículo 96 de la LISR publicada en el Anexo 8 de la RMF 2026 consta de 11 tramos progresivos que van desde $0.01–$844.59 (tasa 1.92%) hasta ingresos superiores a $425,642.00 (tasa 35.00%).",
        "Para que Excel pueda buscar cualquier sueldo dentro de un rango sin usar once funciones SI anidadas, la tabla debe estar ordenada de forma estrictamente ascendente por la columna Límite Inferior.",
      ],
      tabla: {
        caption: "Esquema de los 11 tramos en hoja Parametros (completar tramos intermedios con Anexo 8 RMF 2026 publicado en DOF)",
        encabezados: ["Tramo", "Límite inferior (A)", "Límite superior (B)", "Cuota fija (C)", "% sobre excedente (D)"],
        filas: [
          ["Tramo 1", "$0.01", "$844.59", "$0.00", "1.92%"],
          ["Tramos 2 a 10", "Valores progresivos del Anexo 8 RMF 2026", "Valores progresivos del Anexo 8 RMF 2026", "Según publicación oficial DOF", "6.40% a 34.00%"],
          ["Tramo 11", "$425,642.00", "En adelante", "Según publicación oficial DOF", "35.00%"],
        ],
      },
    },
    {
      id: "buscarv-aproximado",
      titulo: "Encuentra el tramo con BUSCARV aproximado",
      esPasoHowTo: true,
      resumenHowTo:
        "Usa BUSCARV con cuarto argumento VERDADERO para ubicar el límite inferior inmediato menor o igual al sueldo gravable.",
      parrafos: [
        "Suponiendo que tu sueldo gravable mensual está en B2 de la hoja Calculo, y los 11 tramos ocupan el rango Parametros!$A$2:$D$12 (A = Límite Inferior, B = Límite Superior, C = Cuota Fija, D = % sobre excedente), el parámetro VERDADERO (o 1) en BUSCARV le indica a Excel que devuelva la fila del límite inferior mayor o igual más cercano por debajo.",
      ],
      codigos: [
        {
          titulo: "Fórmulas con BUSCARV (compatibles con todas las versiones de Excel)",
          lenguaje: "excel",
          codigo: `// B3: Límite inferior del tramo
=BUSCARV(B2; Parametros!$A$2:$D$12; 1; VERDADERO)

// B4: Excedente sobre el límite inferior
=MAX(0; B2 - B3)

// B5: Porcentaje aplicable sobre excedente
=BUSCARV(B2; Parametros!$A$2:$D$12; 4; VERDADERO)

// B6: Cuota fija del tramo
=BUSCARV(B2; Parametros!$A$2:$D$12; 3; VERDADERO)

// B7: ISR determinado (antes de subsidio si aplica)
=REDONDEAR(B4 * B5 + B6; 2)`,
          codigoEn: `// B3: Lower bracket limit
=VLOOKUP(B2, Parametros!$A$2:$D$12, 1, TRUE)

// B4: Excess over lower limit
=MAX(0, B2 - B3)

// B5: Marginal tax rate
=VLOOKUP(B2, Parametros!$A$2:$D$12, 4, TRUE)

// B6: Fixed fee
=VLOOKUP(B2, Parametros!$A$2:$D$12, 3, TRUE)

// B7: Determined ISR
=ROUND(B4 * B5 + B6, 2)`,
        },
      ],
    },
    {
      id: "formula-isr-buscarx",
      titulo: "Alternativa en una sola celda con BUSCARX (Excel 365 / 2021)",
      esPasoHowTo: true,
      resumenHowTo:
        "Sustituye BUSCARV por BUSCARX con modo de coincidencia -1 (exacta o siguiente menor).",
      parrafos: [
        "Si trabajas en Excel 365, Excel 2021 o Excel Web, BUSCARX (XLOOKUP) ofrece una ventaja clave: no exige que la columna buscada sea la primera de la tabla y usa el modo -1 para coincidencia exacta o el elemento inmediatamente menor.",
      ],
      codigos: [
        {
          titulo: "Cálculo directo de ISR en una sola fórmula con BUSCARX",
          lenguaje: "excel",
          codigo: `=REDONDEAR(
  (B2 - BUSCARX(B2; Parametros!$A$2:$A$12; Parametros!$A$2:$A$12; 0; -1))
  * BUSCARX(B2; Parametros!$A$2:$A$12; Parametros!$D$2:$D$12; 0; -1)
  + BUSCARX(B2; Parametros!$A$2:$A$12; Parametros!$C$2:$C$12; 0; -1);
2)`,
          codigoEn: `=ROUND(
  (B2 - XLOOKUP(B2, Parametros!$A$2:$A$12, Parametros!$A$2:$A$12, 0, -1))
  * XLOOKUP(B2, Parametros!$A$2:$A$12, Parametros!$D$2:$D$12, 0, -1)
  + XLOOKUP(B2, Parametros!$A$2:$A$12, Parametros!$C$2:$C$12, 0, -1),
2)`,
        },
      ],
    },
    {
      id: "verificacion-dof",
      titulo: "Nota sobre el subsidio al empleo y verificación en el DOF",
      esPasoHowTo: false,
      parrafos: [
        "El cálculo anterior obtiene el ISR causado conforme a la tarifa del artículo 96 de la LISR (Anexo 8 RMF 2026). El subsidio para el empleo depende del decreto vigente publicado en el Diario Oficial de la Federación (porcentaje mensual de la UMA vigente).",
        "No incluyas un monto fijo de subsidio sin verificar el decreto aplicable al periodo que estás calculando en dof.gob.mx o en el portal del SAT.",
      ],
    },
  ],
  erroresComunes: [
    {
      error: "Usar FALSO (0) en lugar de VERDADERO (1) dentro de BUSCARV",
      causa: "El modo de coincidencia exacta solo encuentra el sueldo si coincide al centavo con el límite inferior.",
      solucion:
        "Cambia el cuarto argumento de BUSCARV a VERDADERO (o 1) para habilitar la búsqueda por rango.",
    },
    {
      error: "Multiplicar el sueldo total por la tasa del tramo en lugar del excedente",
      causa: "Aplicar el porcentaje marginal directamente sobre toda la base gravable.",
      solucion:
        "Resta siempre el Límite Inferior al sueldo gravable, multiplica ese excedente por la tasa y suma la Cuota Fija.",
    },
    {
      error: "Desordenar los límites inferiores en la hoja Parametros",
      causa: "BUSCARV aproximado asume orden ascendente; si no está ordenado, devuelve #N/D o un tramo erróneo.",
      solucion:
        "Ordena la tabla de Parametros de menor a mayor por la columna de Límite Inferior.",
    },
  ],
  plantilla: {
    titulo: "Descarga la plantilla de Tabla ISR 2026 en Excel (.xlsx)",
    descripcion:
      "Incluye hoja Parametros lista para los 11 tramos del Anexo 8 RMF 2026 y calculadora automática con BUSCARV y BUSCARX.",
  },
  plantillaArchivo: PLANTILLAS_MX.tablaIsr2026,
  faqs: [
    {
      q: "¿Cuántos tramos tiene la tabla mensual de ISR 2026 en México?",
      a: "La tarifa del artículo 96 (Anexo 8 RMF 2026) tiene 11 tramos progresivos, desde $0.01–$844.59 (1.92%) hasta $425,642.00 en adelante (35.00%).",
    },
    {
      q: "¿Qué función de Excel conviene usar para calcular el ISR?",
      a: "BUSCARV con cuarto argumento VERDADERO funciona en todas las versiones de Excel; en Excel 365 o 2021 también puedes usar BUSCARX con modo de coincidencia -1.",
    },
    {
      q: "¿El ISR se calcula sobre el sueldo bruto o sobre la base gravable?",
      a: "Sobre la base gravable: primero debes restar las percepciones exentas (como hasta 30 UMA de aguinaldo o 15 UMA de PTU) antes de aplicar la tarifa.",
    },
    {
      q: "¿Dónde verifico la tarifa oficial y el subsidio al empleo vigente?",
      a: "Directamente en el Anexo 8 de la Resolución Miscelánea Fiscal 2026 publicado en el Diario Oficial de la Federación (dof.gob.mx) y en sat.gob.mx.",
    },
  ],
  relacionadas: [
    "plantilla-aguinaldo-excel",
    "finiquito-liquidacion-excel",
    "calcular-ptu-excel",
  ],
  enlacesExternos: [
    {
      label: "Portal del SAT — Normatividad y RMF 2026",
      url: "https://www.sat.gob.mx/",
      fuente: "SAT",
    },
    {
      label: "Diario Oficial de la Federación (DOF)",
      url: "https://www.dof.gob.mx/",
      fuente: "DOF",
    },
  ],
  enlacesInternosExtra: [
    {
      label: "Curso de Excel en vivo para México",
      href: "/mx/cursos/excel",
      descripcion: "Domina BUSCARV, BUSCARX y automatización de nómina en clases en vivo.",
    },
    {
      label: "Datos salariales por carrera en México",
      href: "/mx/datos",
      descripcion: "Compara sueldos y demanda laboral en México con fuentes oficiales.",
    },
  ],
};
