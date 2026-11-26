import type { GuiaPasoAPaso } from "@/lib/guias/paso-a-paso-tipos";
import { PLANTILLAS_COLOMBIA_2026 } from "@/lib/leads-magnet";

export const guia: GuiaPasoAPaso = {
  slug: "prima-de-servicios-excel",
  pais: "co",
  title: "Cómo calcular prima de servicios en Excel (Colombia 2026)",
  meta: "Calcula la prima de servicios 2026 en Excel para Colombia: SMMLV $1.750.905, auxilio $249.095, DIAS360, proporcional y pago al 20 de diciembre.",
  h1: "Cómo calcular la prima de servicios en Excel en Colombia (2026)",
  subtitle:
    "Arma una plantilla en Excel con hoja Parametros, tope de 2 SMMLV ($3.501.810) para el auxilio de transporte, cálculo de días con DIAS360 y MIN, y liquidación exacta del semestre completo (180 días) o proporcional antes del 20 de diciembre.",
  keywordPrincipal: "como calcular la prima de servicios en excel",
  keywords: [
    "como calcular la prima de servicios en excel",
    "prima de servicios colombia 2026 excel",
    "formula prima de servicios excel colombia",
    "plantilla prima de servicios 2026",
  ],
  curso: "excel",
  cursoSecundario: "power-bi",
  herramienta: "Excel",
  nivel: "Básico",
  updated: "2026-11-25",
  published: "2026-11-25",
  totalTimeIso: "PT20M",
  en30Segundos: {
    queLogras:
      "Una plantilla en Excel con hoja Parametros y hoja LiquidacionPrima que evalúa si el trabajador recibe auxilio de transporte ($249.095), calcula los días trabajados en el semestre con DIAS360 y entrega la prima exacta de junio o diciembre.",
    herramienta: "Microsoft Excel (365, 2021, 2019 o Excel Web)",
    tiempo: "20 minutos",
    bullets: [
      "Hoja Parametros con SMMLV 2026 ($1.750.905), auxilio de transporte ($249.095) y tope de 2 SMMLV ($3.501.810).",
      "Fórmula condicional SI para sumar el auxilio de transporte solo a salarios iguales o inferiores a 2 SMMLV.",
      "Cálculo automático de días del semestre (máximo 180 días) usando DIAS360 y MIN.",
      "Fórmulas listas en español (;) e inglés (,) más plantilla descargable en .xlsx.",
    ],
  },
  rutaVisual: [
    {
      numero: 1,
      titulo: "Reglas y plazos 2026",
      resumen: "Valida base salarial, auxilio de transporte y fechas límite (30 de junio y 20 de diciembre).",
      anchorId: "reglas-prima-2026",
      icono: "shield",
    },
    {
      numero: 2,
      titulo: "Hoja Parametros",
      resumen: "Centraliza SMMLV 2026, auxilio de transporte y tope de 2 SMMLV con fuentes MinTrabajo.",
      anchorId: "hoja-parametros-prima",
      icono: "database",
    },
    {
      numero: 3,
      titulo: "Días del semestre",
      resumen: "Calcula días laborados entre 1 y 180 con DIAS360 y MIN.",
      anchorId: "dias-semestre-dias360",
      icono: "calendar",
    },
    {
      numero: 4,
      titulo: "Fórmula de prima",
      resumen: "Aplica (Salario + SI(Salario<=2*SMMLV; Auxilio; 0)) * Dias / 360.",
      anchorId: "formula-prima-excel",
      icono: "code",
    },
    {
      numero: 5,
      titulo: "Validación y errores",
      resumen: "Verifica semestre completo vs. proporcional y evita desfases de fechas.",
      anchorId: "validacion-casos-prima",
      icono: "check",
    },
  ],
  requisitos: {
    version: "Excel 365, Excel 2021, Excel 2019 o Excel para la Web",
    lista: [
      "Microsoft Excel en Windows, macOS o navegador Web.",
      "Salario base mensual, fecha de ingreso y fecha de corte del semestre (30 de junio o 30 de diciembre).",
      "Parámetros oficiales 2026: SMMLV $1.750.905 y auxilio de transporte $249.095.",
    ],
    compatibilidadMacWeb:
      "Las funciones SI, DIAS360, MIN, MAX y REDONDEAR funcionan igual en Windows, macOS y Excel Web. En Excel en inglés corresponden a IF, DAYS360, MIN, MAX y ROUND.",
    avisoEducativo:
      "Guía práctica de modelado en Excel con fines educativos. Verifica siempre novedades de salario variable, licencias no remuneradas o incapacidades según el Código Sustantivo del Trabajo y los lineamientos de MinTrabajo.",
  },
  herramientasHowTo: [
    "Microsoft Excel",
    "Parámetros laborales MinTrabajo 2026",
  ],
  insumosHowTo: [
    "Salario mensual del trabajador",
    "Fecha de inicio y fecha de corte del semestre",
  ],
  secciones: [
    {
      id: "reglas-prima-2026",
      titulo: "Reglas legales y fechas límite de la prima de servicios en 2026",
      esPasoHowTo: true,
      resumenHowTo:
        "Confirma la base de liquidación (salario más auxilio de transporte hasta 2 SMMLV) y las fechas de pago: 30 de junio y 20 de diciembre.",
      parrafos: [
        "En Colombia, la prima de servicios equivale a 30 días de salario por año laborado, pagaderos en dos contados semestrales de 15 días cada uno: el primero a más tardar el 30 de junio y el segundo a más tardar el 20 de diciembre (artículo 306 del Código Sustantivo del Trabajo).",
        "Para 2026, el Salario Mínimo Mensual Legal Vigente (SMMLV) es de $1.750.905 COP y el auxilio de transporte es de $249.095 COP. El auxilio de transporte se incluye en la base de la prima únicamente cuando el trabajador devenga hasta 2 SMMLV ($3.501.810 COP) y recibe dicho auxilio.",
      ],
      tabla: {
        caption: "Parámetros y fechas clave de la prima de servicios en Colombia (2026)",
        encabezados: ["Concepto", "Valor / Regla 2026", "Referencia"],
        filas: [
          ["SMMLV 2026", "$1.750.905 COP", "Decreto 1469 de 2025 / Decreto 0159 de 2026 (MinTrabajo)"],
          ["Auxilio de transporte 2026", "$249.095 COP", "Decreto 1470 de 2025 (MinTrabajo)"],
          ["Tope para auxilio (2 SMMLV)", "$3.501.810 COP", "Aplica si salario <= 2 SMMLV"],
          ["Primer semestre", "1 de enero al 30 de junio", "Pago máximo: 30 de junio"],
          ["Segundo semestre", "1 de julio al 30 de diciembre", "Pago máximo: 20 de diciembre"],
        ],
      },
    },
    {
      id: "hoja-parametros-prima",
      titulo: "Crea la hoja Parametros con fuentes oficiales",
      esPasoHowTo: true,
      resumenHowTo:
        "Guarda el SMMLV, el auxilio de transporte, el tope de 2 SMMLV y la base comercial de 360 días en una hoja separada.",
      parrafos: [
        "Nunca escribas cifras fijas dentro de las fórmulas. Crea una hoja llamada Parametros y ubica los valores de 2026 en las celdas B2:B6 para poder actualizarlos cada año sin rehacer la planilla.",
        "Puedes consultar las cifras oficiales actualizadas en nuestra página de [salario mínimo en Colombia 2026](/co/datos/salario-minimo) y en el [portal de datos de Colombia](/co/datos).",
      ],
      tabla: {
        caption: "Estructura recomendada de la hoja Parametros",
        encabezados: ["Celda", "Parámetro", "Valor", "Fuente oficial"],
        filas: [
          ["B2", "SMMLV_2026", "1750905", "MinTrabajo (Decreto 1469/2025 y Decreto 0159/2026)"],
          ["B3", "Auxilio_Transporte_2026", "249095", "MinTrabajo (Decreto 1470/2025)"],
          ["B4", "Tope_2_SMMLV", "=2*B2", "Cálculo automático ($3.501.810)"],
          ["B5", "Dias_Anio_Comercial", "360", "Convención laboral colombiana (mes de 30 días)"],
          ["B6", "Dias_Semestre_Max", "180", "Máximo de días por semestre"],
        ],
      },
    },
    {
      id: "dias-semestre-dias360",
      titulo: "Calcula los días trabajados del semestre con DIAS360 y MIN",
      esPasoHowTo: true,
      resumenHowTo:
        "Determina la fecha efectiva de inicio dentro del semestre y calcula los días laborados con DIAS360 limitado a 180 días.",
      parrafos: [
        "En la hoja LiquidacionPrima, supón que la columna A tiene el nombre del trabajador, B la fecha de ingreso, C el salario mensual, D la fecha inicio del semestre (por ejemplo 2026-07-01) y E la fecha de corte o retiro (por ejemplo 2026-12-30).",
        "Para calcular los días proporcionales sin pasarte de 180 días cuando el empleado ingresó antes del inicio del semestre, toma el máximo entre la fecha de ingreso y el inicio del semestre, y usa DIAS360 más 1 día inclusivo.",
      ],
      codigos: [
        {
          titulo: "Fórmula de días del semestre en la celda F2 (tope 180 días)",
          lenguaje: "excel",
          codigo: "=MIN(Parametros!$B$6; DIAS360(MAX(B2; D2); E2; FALSO) + 1)",
          codigoEn: "=MIN(Parametros!$B$6, DAYS360(MAX(B2, D2), E2, FALSE) + 1)",
          nota: "El tercer argumento FALSO (FALSE) aplica el método comercial estadounidense/colombiano de 30 días por mes. Si el trabajador laboró todo el semestre (1 jul a 30 dic), el resultado es exactamente 180.",
        },
      ],
    },
    {
      id: "formula-prima-excel",
      titulo: "Fórmula de prima de servicios en Excel (con auxilio condicional)",
      esPasoHowTo: true,
      resumenHowTo:
        "Calcula la base salarial sumando el auxilio de transporte si el salario no supera 2 SMMLV y multiplica por los días divididos entre 360.",
      parrafos: [
        "En la celda G2 calcula primero la base de liquidación o intégrala directamente en la fórmula de la prima. Con la función SI evalúas si el salario mensual (C2) es menor o igual a 2 SMMLV (Parametros!$B$4).",
        "Si cumple la condición, sumas el auxilio de transporte (Parametros!$B$3); si gana más de 2 SMMLV, sumas 0. Luego multiplicas esa base por los días trabajados en el semestre (F2) y divides entre 360.",
      ],
      codigos: [
        {
          titulo: "Fórmula completa de prima de servicios en la celda G2",
          lenguaje: "excel",
          codigo: "=REDONDEAR((C2 + SI(C2<=Parametros!$B$4; Parametros!$B$3; 0)) * F2 / Parametros!$B$5; 0)",
          codigoEn: "=ROUND((C2 + IF(C2<=Parametros!$B$4, Parametros!$B$3, 0)) * F2 / Parametros!$B$5, 0)",
          nota: "REDONDEAR a 0 decimales deja el valor en pesos colombianos enteros listos para dispersión bancaria.",
        },
      ],
    },
    {
      id: "validacion-casos-prima",
      titulo: "Ejemplos verificados: semestre completo y proporcional",
      parrafos: [
        "Comprueba tu hoja con dos casos de prueba reales de 2026: un trabajador con 1 SMMLV ($1.750.905) que laboró los 180 días del segundo semestre y otro que gana $4.000.000 (sin auxilio) e ingresó el 1 de octubre de 2026 (90 días).",
        "Si quieres agilizar tus cierres semestrales con fórmulas dinámicas, tablas y validación automática de parámetros, conoce nuestro [curso de excel](/co/cursos/excel) en vivo.",
      ],
      tabla: {
        caption: "Casos de verificación para la prima de servicios 2026",
        encabezados: ["Caso", "Salario", "Auxilio incluido", "Días", "Prima calculada"],
        filas: [
          ["1 SMMLV semestre completo", "$1.750.905", "$249.095", "180", "$1.000.000"],
          ["2 SMMLV semestre completo", "$3.501.810", "$249.095", "180", "$1.875.453"],
          ["Salario > 2 SMMLV (90 días)", "$4.000.000", "$0", "90", "$1.000.000"],
        ],
      },
      verificaResultado:
        "En el caso de 1 SMMLV ($1.750.905 + $249.095 = $2.000.000) por 180 / 360 días, tu celda G2 debe mostrar exactamente $1.000.000 COP.",
    },
  ],
  erroresComunes: [
    {
      error: "Sumar auxilio de transporte a salarios mayores a 2 SMMLV",
      causa: "Escribir + 249095 fijo en la fórmula para toda la nómina.",
      solucion:
        "Usa SI(C2<=Parametros!$B$4; Parametros!$B$3; 0) para que Excel valide automáticamente el tope de $3.501.810.",
    },
    {
      error: "Usar resta simple de fechas (E2 - D2) en lugar de DIAS360",
      causa: "La resta calendario da 183 o 184 días en el segundo semestre en vez de 180.",
      solucion:
        "Usa DIAS360(MAX(B2; D2); E2; FALSO) + 1 envuelto en MIN(180; ...) para respetar el año comercial de 360 días.",
    },
    {
      error: "Error #¿NOMBRE? al pegar la fórmula en Excel en inglés",
      causa: "Usar nombres de funciones en español (SI, DIAS360, REDONDEAR) o separador punto y coma en configuración regional inglesa.",
      solucion:
        "Cambia la pestaña del bloque de código a Inglés (,) para copiar IF, DAYS360 y ROUND.",
    },
  ],
  plantilla: {
    titulo: "Plantilla Excel: Prima de servicios Colombia 2026 (.xlsx)",
    descripcion:
      "Descarga el archivo listo con la hoja Parametros (SMMLV $1.750.905 y auxilio $249.095), cálculo automático con DIAS360 y validación de semestre completo o proporcional.",
  },
  plantillaArchivo: PLANTILLAS_COLOMBIA_2026.primaServicios,
  faqs: [
    {
      q: "¿Hasta qué fecha se paga la prima de servicios de diciembre en Colombia?",
      a: "El segundo contado de la prima de servicios debe pagarse a más tardar el 20 de diciembre de cada año, liquidando el semestre comprendido entre el 1 de julio y el 30 de diciembre.",
    },
    {
      q: "¿El auxilio de transporte se incluye en la prima de servicios 2026?",
      a: "Sí, siempre que el trabajador devengue hasta 2 SMMLV ($3.501.810 COP en 2026) y tenga derecho al auxilio de transporte ($249.095 COP).",
    },
    {
      q: "¿Cómo se calcula la prima si el trabajador no completó los 180 días del semestre?",
      a: "Se calcula de forma proporcional a los días laborados en el semestre con la fórmula (Salario + Auxilio si aplica) * DíasTrabajados / 360.",
    },
    {
      q: "¿Qué pasa si el trabajador tiene salario variable o comisiones?",
      a: "Se toma el promedio de lo devengado durante el respectivo semestre (o el tiempo laborado si es inferior) incluyendo horas extra, recargos y comisiones constitutivas de salario.",
    },
  ],
  relacionadas: [
    "intereses-de-cesantias-excel",
    "cesantias-2026",
    "liquidacion-de-contrato-excel",
  ],
  enlacesExternos: [
    {
      label: "Ministerio del Trabajo de Colombia",
      url: "https://www.mintrabajo.gov.co",
      fuente: "MinTrabajo",
    },
    {
      label: "Código Sustantivo del Trabajo (Art. 306 — Prima de servicios)",
      url: "https://www.suin-juriscol.gov.co",
      fuente: "SUIN-Juriscol",
    },
  ],
  enlacesInternosExtra: [
    {
      label: "Curso de Excel en vivo en Colombia",
      href: "/co/cursos/excel",
      descripcion: "Aprende fórmulas laborales, tablas dinámicas y Power Query en clases en vivo.",
    },
    {
      label: "Salario mínimo Colombia 2026",
      href: "/co/datos/salario-minimo",
      descripcion: "Consulta el SMMLV 2026 ($1.750.905) y el auxilio de transporte ($249.095).",
    },
    {
      label: "Indicadores y datos de Colombia",
      href: "/co/datos",
      descripcion: "Parámetros laborales, IPC, TRM y cifras oficiales actualizadas.",
    },
  ],
};
