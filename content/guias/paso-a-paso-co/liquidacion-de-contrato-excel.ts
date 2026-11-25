import type { GuiaPasoAPaso } from "@/lib/guias/paso-a-paso-tipos";
import { PLANTILLAS_COLOMBIA_2026 } from "@/lib/leads-magnet";

export const guia: GuiaPasoAPaso = {
  slug: "liquidacion-de-contrato-excel",
  pais: "co",
  title: "Liquidación de contrato en Excel (Colombia 2026): guía",
  meta: "Haz una liquidación de contrato laboral en Excel (Colombia 2026): salario, prima, cesantías, intereses, vacaciones (Salario*Dias/720) y neto.",
  h1: "Cómo hacer una liquidación de contrato laboral en Excel (Colombia 2026)",
  subtitle:
    "Estructura una planilla completa en Excel con hoja Parametros 2026, salario pendiente, prima proporcional, cesantías, intereses, vacaciones con fórmula Salario * Dias / 720 y criterios de indemnización según modalidad de contrato.",
  keywordPrincipal: "liquidacion de contrato laboral en excel",
  keywords: [
    "liquidacion de contrato laboral en excel",
    "liquidacion laboral colombia 2026 excel",
    "formula vacaciones liquidacion excel 720",
    "plantilla liquidacion contrato colombia 2026",
  ],
  curso: "excel",
  cursoSecundario: "power-bi",
  herramienta: "Excel",
  nivel: "Intermedio",
  updated: "2026-11-25",
  published: "2026-11-25",
  totalTimeIso: "PT30M",
  en30Segundos: {
    queLogras:
      "Un modelo integral en Excel que liquida salario pendiente, prima proporcional, cesantías, intereses de cesantías y vacaciones (Salario * Dias / 720), con nota de control para indemnización según tipo de contrato.",
    herramienta: "Microsoft Excel (365, 2021, 2019 o Excel Web)",
    tiempo: "30 minutos",
    bullets: [
      "Hoja Parametros 2026 con SMMLV ($1.750.905), auxilio de transporte ($249.095) y divisores 360 / 720.",
      "Cálculo separado de prestaciones con auxilio (prima y cesantías) vs. vacaciones sin auxilio (Salario * Dias / 720).",
      "Resumen consolidado de devengados, descuentos de nómina del último mes y neto a pagar.",
      "Nota honesta y clara sobre cuándo aplica indemnización según modalidad y causal de terminación.",
    ],
  },
  rutaVisual: [
    {
      numero: 1,
      titulo: "Conceptos y bases",
      resumen: "Distingue qué lleva auxilio de transporte y qué se liquida sin auxilio.",
      anchorId: "conceptos-liquidacion-contrato",
      icono: "shield",
    },
    {
      numero: 2,
      titulo: "Hoja Parametros",
      resumen: "Centraliza SMMLV 2026, auxilio, tasa 12 % y divisores 360 y 720.",
      anchorId: "hoja-parametros-contrato",
      icono: "database",
    },
    {
      numero: 3,
      titulo: "Prestaciones y salario",
      resumen: "Calcula salario pendiente, prima, cesantías e intereses en Excel.",
      anchorId: "prestaciones-salario-excel",
      icono: "code",
    },
    {
      numero: 4,
      titulo: "Vacaciones (/720)",
      resumen: "Aplica Salario * DiasPendientes / 720 sin auxilio de transporte.",
      anchorId: "vacaciones-formula-720",
      icono: "calendar",
    },
    {
      numero: 5,
      titulo: "Indemnización y neto",
      resumen: "Revisa criterios de indemnización por modalidad y consolida el total.",
      anchorId: "indemnizacion-criterios-neto",
      icono: "check",
    },
  ],
  requisitos: {
    version: "Excel 365, Excel 2021, Excel 2019 o Excel para la Web",
    lista: [
      "Microsoft Excel en Windows, macOS o Excel Web.",
      "Fecha de ingreso, fecha de retiro, salario base, días de vacaciones ya disfrutados y última fecha de corte de prima/cesantías.",
      "Parámetros oficiales 2026: SMMLV $1.750.905 y auxilio de transporte $249.095.",
    ],
    compatibilidadMacWeb:
      "Todas las fórmulas (SI, DIAS360, MIN, MAX, REDONDEAR) son 100 % compatibles con Windows, macOS y Excel Web.",
    avisoEducativo:
      "Guía técnica de modelado en Excel. La procedencia y cuantía de una indemnización dependen de la modalidad contractual y las pruebas de la causal; consulta asesoría laboral especializada en terminaciones sin justa causa.",
  },
  herramientasHowTo: [
    "Microsoft Excel",
    "Parámetros laborales MinTrabajo 2026",
  ],
  insumosHowTo: [
    "Fechas de ingreso y retiro del trabajador",
    "Salario mensual y días pendientes de vacaciones",
  ],
  secciones: [
    {
      id: "conceptos-liquidacion-contrato",
      titulo: "Qué incluye una liquidación de contrato en Colombia",
      esPasoHowTo: true,
      resumenHowTo:
        "Separa los conceptos que incluyen auxilio de transporte (prima y cesantías) de las vacaciones (solo salario base sobre 720).",
      parrafos: [
        "Al terminar un contrato laboral en Colombia, el empleador debe liquidar los salarios pendientes del último período, la prima de servicios proporcional del semestre, las cesantías no consignadas, los intereses de cesantías al 12 % proporcional y las vacaciones compensadas en dinero por los días causados y no disfrutados.",
        "Puedes profundizar en cada prestación individual en nuestras guías de [prima de servicios en Excel](/co/guias/prima-de-servicios-excel), [cesantías 2026 en Excel](/co/guias/cesantias-2026) e [intereses de cesantías en Excel](/co/guias/intereses-de-cesantias-excel).",
      ],
      tabla: {
        caption: "Resumen de bases y divisores legales en Colombia",
        encabezados: ["Concepto", "¿Incluye auxilio (≤2 SMMLV)?", "Fórmula base"],
        filas: [
          ["Salario pendiente", "Proporcional a días del mes", "(Salario + Auxilio si aplica) * DíasMes / 30"],
          ["Prima de servicios", "Sí", "(Salario + Auxilio si aplica) * DíasSemestre / 360"],
          ["Cesantías", "Sí", "(Salario + Auxilio si aplica) * DíasAño / 360"],
          ["Intereses de cesantías", "Sobre cesantías", "(Cesantías * DíasAño * 0,12) / 360"],
          ["Vacaciones compensadas", "No (solo salario)", "Salario * DíasVacaciones / 720"],
        ],
      },
    },
    {
      id: "hoja-parametros-contrato",
      titulo: "Prepara la hoja Parametros 2026",
      esPasoHowTo: true,
      resumenHowTo:
        "Registra SMMLV, auxilio de transporte, tasa de intereses y divisores 360 y 720 en una hoja dedicada.",
      parrafos: [
        "En la hoja Parametros centraliza las constantes oficiales de 2026 (verificadas en [salario mínimo Colombia 2026](/co/datos/salario-minimo)) para que cualquier celda de la liquidación haga referencia a ellas.",
      ],
      tabla: {
        caption: "Parámetros de liquidación de contrato 2026",
        encabezados: ["Celda", "Parámetro", "Valor", "Fuente oficial"],
        filas: [
          ["B2", "SMMLV_2026", "1750905", "MinTrabajo (Decreto 1469/2025 y Decreto 0159/2026)"],
          ["B3", "Auxilio_Transporte_2026", "249095", "MinTrabajo (Decreto 1470/2025)"],
          ["B4", "Tope_2_SMMLV", "=2*B2", "$3.501.810 COP"],
          ["B5", "Base_360", "360", "Código Sustantivo del Trabajo"],
          ["B6", "Base_Vacaciones_720", "720", "Art. 186 CST (15 días hábiles por año)"],
          ["B7", "Tasa_Intereses", "0,12", "Ley 52 de 1975"],
        ],
      },
    },
    {
      id: "prestaciones-salario-excel",
      titulo: "Fórmulas de salario pendiente, prima, cesantías e intereses",
      esPasoHowTo: true,
      resumenHowTo:
        "Calcula los días pendientes de cada prestación y liquida salario, prima, cesantías e intereses en bloques ordenados.",
      parrafos: [
        "Supón en la hoja Liquidacion que C2 es el salario mensual, C3 es el auxilio calculado con =SI(C2<=Parametros!$B$4; Parametros!$B$3; 0), C4 son los días pendientes de salario del último mes, C5 los días de prima del semestre, C6 los días de cesantías del año y C7 los días totales pendientes para vacaciones.",
      ],
      codigos: [
        {
          titulo: "Bloque de fórmulas para salario, prima, cesantías e intereses",
          lenguaje: "excel",
          codigo: "Salario pendiente:    =REDONDEAR((C2 + C3) * C4 / 30; 0)\nPrima proporcional:   =REDONDEAR((C2 + C3) * C5 / Parametros!$B$5; 0)\nCesantías:            =REDONDEAR((C2 + C3) * C6 / Parametros!$B$5; 0)\nIntereses cesantías:  =REDONDEAR((E4 * C6 * Parametros!$B$7) / Parametros!$B$5; 0)",
          codigoEn: "Salario pendiente:    =ROUND((C2 + C3) * C4 / 30, 0)\nPrima proporcional:   =ROUND((C2 + C3) * C5 / Parametros!$B$5, 0)\nCesantías:            =ROUND((C2 + C3) * C6 / Parametros!$B$5, 0)\nIntereses cesantías:  =ROUND((E4 * C6 * Parametros!$B$7) / Parametros!$B$5, 0)",
          nota: "Reemplaza E4 por la celda donde calculaste las cesantías.",
        },
      ],
    },
    {
      id: "vacaciones-formula-720",
      titulo: "Calcula vacaciones compensadas con Salario * Dias / 720",
      esPasoHowTo: true,
      resumenHowTo:
        "Aplica el divisor 720 sobre el salario básico sin sumar el auxilio de transporte.",
      parrafos: [
        "Las vacaciones corresponden a 15 días hábiles de descanso remunerado por cada año de servicio (artículo 186 del Código Sustantivo del Trabajo). Al compensarse en dinero en la liquidación, no incluyen auxilio de transporte y se calculan dividiendo entre 720.",
        "Si el trabajador ya disfrutó algunos días de vacaciones durante el contrato, descuéntalos primero calculando los días pendientes equivalentes o restando los días disfrutados sobre la causación total.",
      ],
      codigos: [
        {
          titulo: "Fórmula de vacaciones compensadas en Excel",
          lenguaje: "excel",
          codigo: "=REDONDEAR((C2 * C7) / Parametros!$B$6; 0)",
          codigoEn: "=ROUND((C2 * C7) / Parametros!$B$6, 0)",
          nota: "C2 es el salario mensual sin auxilio de transporte y C7 los días trabajados pendientes de vacaciones.",
        },
      ],
    },
    {
      id: "indemnizacion-criterios-neto",
      titulo: "Nota sobre indemnización según modalidad y consolidación del neto",
      parrafos: [
        "La indemnización por despido sin justa causa (artículo 64 del Código Sustantivo del Trabajo) no es automática en toda liquidación: solo procede cuando el empleador termina el contrato sin justa causa comprobada, y su fórmula cambia según la modalidad:",
      ],
      lista: [
        "Contrato a término fijo: equivale al valor de los salarios correspondientes al tiempo que faltare para cumplir el plazo estipulado del contrato.",
        "Contrato por obra o labor: equivale al tiempo que faltare para finalizar la obra o labor contratada, sin que sea inferior a 15 días.",
        "Contrato a término indefinido: depende del nivel salarial (menor a 10 SMMLV vs. igual o mayor a 10 SMMLV) y de los años de servicio (30 días por el primer año y 20 días adicionales por cada año siguiente o proporcional si gana menos de 10 SMMLV; 20 y 15 días si gana 10 SMMLV o más).",
        "Renuncia voluntaria o terminación por justa causa: no hay lugar a indemnización.",
      ],
      alerta: {
        tipo: "warning",
        titulo: "Revisión obligatoria antes de liquidar indemnización",
        texto: "En tu plantilla de Excel deja una celda manual o selector de modalidad para indemnización, y valida siempre si hubo justa causa o mutuo acuerdo antes de incluirla.",
      },
    },
  ],
  erroresComunes: [
    {
      error: "Incluir el auxilio de transporte en el cálculo de vacaciones",
      causa: "Aplicar la misma base salarial de prima y cesantías a las vacaciones.",
      solucion:
        "Para vacaciones usa únicamente el salario (C2 * C7 / 720), nunca sumes el auxilio de transporte.",
    },
    {
      error: "Dividir las vacaciones entre 360 en lugar de 720",
      causa: "Usar el divisor anual de prima/cesantías para vacaciones.",
      solucion:
        "Las vacaciones son 15 días por año (la mitad de 30), por eso la fórmula correcta divide entre 720.",
    },
    {
      error: "Olvidar descontar aportes de seguridad social sobre el salario pendiente",
      causa: "Sumar todos los devengados sin restar 4 % de salud y 4 % de pensión del último salario.",
      solucion:
        "Aplica los descuentos de ley únicamente sobre el salario pendiente (no sobre prima, cesantías, intereses ni vacaciones compensadas).",
    },
  ],
  plantilla: {
    titulo: "Plantilla Excel: Liquidación de contrato Colombia 2026 (.xlsx)",
    descripcion:
      "Descarga el simulador en Excel con hoja Parametros 2026, salario pendiente, prima, cesantías, intereses, vacaciones (/720) y resumen neto.",
  },
  plantillaArchivo: PLANTILLAS_COLOMBIA_2026.liquidacionContrato,
  faqs: [
    {
      q: "¿Por qué la fórmula de vacaciones divide entre 720?",
      a: "Porque equivalen a medio mes (15 días) por cada año de 360 días: (Salario / 2) * Días / 360 = Salario * Días / 720.",
    },
    {
      q: "¿Qué prestaciones incluyen el auxilio de transporte en la liquidación?",
      a: "La prima de servicios y las cesantías incluyen el auxilio de transporte ($249.095 en 2026) cuando el salario es menor o igual a 2 SMMLV ($3.501.810). Las vacaciones no lo incluyen.",
    },
    {
      q: "¿Cuánto tiempo tiene el empleador para pagar la liquidación?",
      a: "Debe pagarse al momento de la terminación del contrato o dentro de un plazo razonable inmediato; la mora injustificada puede generar indemnización moratoria (Art. 65 CST).",
    },
    {
      q: "¿La liquidación incluye indemnización cuando el trabajador renuncia?",
      a: "No. En renuncia voluntaria o terminación por mutuo acuerdo o justa causa no aplica indemnización por despido.",
    },
  ],
  relacionadas: [
    "prima-de-servicios-excel",
    "cesantias-2026",
    "liquidacion-de-nomina-excel",
  ],
  enlacesExternos: [
    {
      label: "Ministerio del Trabajo de Colombia",
      url: "https://www.mintrabajo.gov.co",
      fuente: "MinTrabajo",
    },
    {
      label: "Código Sustantivo del Trabajo (Arts. 64, 186, 249, 306)",
      url: "https://www.suin-juriscol.gov.co",
      fuente: "SUIN-Juriscol",
    },
  ],
  enlacesInternosExtra: [
    {
      label: "Curso de Excel en vivo en Colombia",
      href: "/co/cursos/excel",
      descripcion: "Aprende a diseñar modelos laborales y financieros en Excel en vivo.",
    },
    {
      label: "Salario mínimo Colombia 2026",
      href: "/co/datos/salario-minimo",
      descripcion: "Consulta SMMLV ($1.750.905) y auxilio de transporte ($249.095).",
    },
    {
      label: "Indicadores y datos de Colombia",
      href: "/co/datos",
      descripcion: "Parámetros económicos y laborales actualizados.",
    },
  ],
};
