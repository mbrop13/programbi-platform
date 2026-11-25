import type { GuiaPasoAPaso } from "@/lib/guias/paso-a-paso-tipos";

export const guia: GuiaPasoAPaso = {
  slug: "liquidacion-beneficios-sociales-excel",
  pais: "pe",
  title: "Liquidación de beneficios sociales en Excel (Perú)",
  meta: "Calcula la liquidación de beneficios sociales en Excel (Perú): CTS trunca, vacaciones truncas, gratificación trunca e indemnización D.S. 003-97-TR.",
  h1: "Cómo calcular la liquidación de beneficios sociales en Excel (Perú 2026)",
  subtitle:
    "Diseña una hoja de liquidación al cese en Excel que integre CTS trunca, vacaciones truncas (D.Leg. 713), gratificación trunca con bonificación extraordinaria e indemnización por despido arbitrario (D.S. 003-97-TR).",
  keywordPrincipal: "liquidacion de beneficios sociales en excel peru",
  keywords: [
    "liquidacion de beneficios sociales en excel peru",
    "calculo vacaciones truncas excel",
    "indemnizacion despido arbitrario ds 003 97 tr",
    "formato liquidacion beneficios sociales peru",
  ],
  curso: "excel",
  cursoSecundario: "power-bi",
  herramienta: "Excel",
  nivel: "Intermedio",
  updated: "2026-11-25",
  published: "2026-11-25",
  totalTimeIso: "PT35M",
  en30Segundos: {
    queLogras:
      "Una plantilla integral de liquidación de beneficios sociales en Excel que calcula los cuatro bloques legales al cese (CTS trunca, vacaciones truncas/vencidas, gratificación trunca + bono 9 %/6,75 % e indemnización por despido arbitrario cuando corresponda), aplicando descuentos de AFP/ONP solo sobre vacaciones.",
    herramienta: "Microsoft Excel (365, 2021 o Web)",
    tiempo: "35 minutos",
    bullets: [
      "Hoja Parametros con tasas legales de CTS, vacaciones, gratificación trunca, tope de 12 remuneraciones en indemnización y tabla AFP/ONP.",
      "Cálculo automático de vacaciones truncas y vencidas (D.Leg. 713), diferenciando los conceptos afectos a pensión.",
      "Integración de CTS trunca (D.S. 001-97-TR) y gratificación trunca por meses completos con bonificación extraordinaria.",
      "Fórmula condicional de indemnización por despido arbitrario según tipo de contrato (plazo indeterminado vs. sujeto a modalidad bajo D.S. 003-97-TR).",
    ],
  },
  rutaVisual: [
    {
      numero: 1,
      titulo: "Parámetros y motivo",
      resumen: "Configura fechas de ingreso/cese, motivo de salida y tasas vigentes.",
      anchorId: "parametros-liquidacion-cese",
      icono: "database",
    },
    {
      numero: 2,
      titulo: "CTS trunca",
      resumen: "Calcula meses y días desde el último depósito semestral hasta el cese.",
      anchorId: "bloque-cts-trunca",
      icono: "table",
    },
    {
      numero: 3,
      titulo: "Vacaciones truncas",
      resumen: "Determina vacaciones no gozadas y truncas bajo el D.Leg. 713.",
      anchorId: "bloque-vacaciones-truncas",
      icono: "calendar",
    },
    {
      numero: 4,
      titulo: "Gratificación trunca",
      resumen: "Calcula sextos completos del semestre y bonificación 9 % o 6,75 %.",
      anchorId: "bloque-gratificacion-trunca",
      icono: "code",
    },
    {
      numero: 5,
      titulo: "Indemnización y neto",
      resumen: "Evalúa despido arbitrario (D.S. 003-97-TR), descuentos AFP/ONP y neto.",
      anchorId: "indemnizacion-y-resumen-neto",
      icono: "check",
    },
  ],
  requisitos: {
    version: "Excel 365, Excel 2021 o Excel para la Web (compatible también con Excel 2016/2019)",
    lista: [
      "Microsoft Excel en Windows, macOS o versión Web.",
      "Fechas exactas de ingreso y cese, motivo de término (renuncia, vencimiento de contrato o despido arbitrario) y récord vacacional pendiente.",
      "Tasas vigentes de AFP (consultadas en sbs.gob.pe) o ONP (13 %) para aplicar descuentos únicamente sobre las vacaciones.",
    ],
    compatibilidadMacWeb:
      "Todas las fórmulas (SI, MIN, MAX, REDONDEAR, SIFECHA) operan igual en Windows, macOS y Excel Web. Recuerda usar punto y coma (;) en Excel en español o coma (,) en Excel en inglés.",
    avisoEducativo:
      "Guía educativa referencial basada en el D.S. 001-97-TR, D.Leg. 713, Ley 27735 y D.S. 003-97-TR. Verifica cada caso particular y las tasas vigentes antes de emitir liquidaciones oficiales.",
  },
  herramientasHowTo: ["Microsoft Excel 365 / 2021 / Web"],
  insumosHowTo: [
    "Última boleta de pago y constancia de última gratificación",
    "Control de vacaciones gozadas y motivo legal del cese",
  ],
  secciones: [
    {
      id: "parametros-liquidacion-cese",
      titulo: "1. Configurar la hoja Parametros y los datos del cese",
      esPasoHowTo: true,
      resumenHowTo:
        "Centraliza las tasas legales, el tope de 12 remuneraciones de la indemnización y los datos de identificación del cese (motivo, contrato y régimen).",
      parrafos: [
        "La liquidación de beneficios sociales en Perú reúne en un solo documento los derechos devengados y pendientes de pago al término de la relación laboral. Como cada concepto sigue reglas distintas en materia de cómputo de días, inclusión de 1/6 de gratificación y afectación a AFP/ONP, el diseño de la planilla debe mantener cada bloque separado antes de sumar el total neto.",
        "Crea una hoja Parametros donde registres la fecha de vigencia, la RMV vigente (gob.pe/mtpe), los divisores comerciales (12 meses y 360 días), las tasas de bonificación extraordinaria (9 % EsSalud y 6,75 % EPS), la tasa ONP (13 %) y los parámetros de indemnización por despido arbitrario del D.S. 003-97-TR (1,5 remuneraciones por año con tope de 12 remuneraciones).",
        "En la hoja principal Liquidacion, coloca una cabecera con la fecha de ingreso, fecha de cese, tipo de contrato («Indeterminado» o «Plazo fijo»), fecha de término pactada del contrato (si es a plazo fijo) y motivo de salida («Renuncia», «Vencimiento», «Despido arbitrario»).",
      ],
      tabla: {
        caption: "Parámetros de la liquidación de beneficios sociales en Excel (Perú)",
        encabezados: [
          "Celda",
          "Parámetro",
          "Valor / Regla",
          "Norma oficial",
        ],
        filas: [
          [
            "Parametros!B2",
            "Fecha de vigencia",
            "2026-11-25",
            "Control de nómina",
          ],
          [
            "Parametros!B3",
            "RMV vigente (S/)",
            "[Completar según MTPE]",
            "gob.pe/mtpe",
          ],
          [
            "Parametros!B4",
            "Factor indemnización por año",
            "1,5 remuneraciones",
            "D.S. 003-97-TR (Art. 38)",
          ],
          [
            "Parametros!B5",
            "Tope máximo indemnización",
            "12 remuneraciones",
            "D.S. 003-97-TR (Art. 38)",
          ],
          [
            "Parametros!B6",
            "Bonif. extraordinaria EsSalud / EPS",
            "9 % / 6,75 %",
            "Ley 30334 / sunat.gob.pe",
          ],
          [
            "Parametros!B7",
            "Descuento ONP (referencia)",
            "13 % (0,13); AFP según SBS",
            "sbs.gob.pe / onp.gob.pe",
          ],
        ],
      },
    },
    {
      id: "bloque-cts-trunca",
      titulo: "2. Calcular el bloque de CTS trunca al cese",
      esPasoHowTo: true,
      resumenHowTo:
        "Calcula los meses y días pendientes desde el último depósito semestral hasta la fecha de cese aplicando la Remuneración Computable con 1/6 de gratificación.",
      parrafos: [
        "El primer bloque de la liquidación corresponde a la CTS trunca (D.S. 001-97-TR), que cubre el tiempo laborado desde el último periodo depositado (1 de mayo o 1 de noviembre) hasta la fecha de cese, siempre que el trabajador cuente con al menos un mes completo de servicios en la empresa.",
        "La Remuneración Computable de CTS incluye el sueldo básico, la asignación familiar, el promedio de variables regulares y 1/6 de la última gratificación ordinaria percibida. Si quieres revisar en detalle cómo descomponer las fechas y validar el 1/6, consulta nuestra guía dedicada sobre [cómo calcular la CTS en Excel](/pe/guias/calcular-cts-excel).",
        "En la plantilla, este monto pasa íntegro al subtotal de beneficios sociales sin sufrir descuentos de AFP, ONP ni renta de quinta categoría.",
      ],
      codigos: [
        {
          titulo: "Fórmula de CTS trunca en la hoja de liquidación",
          lenguaje: "excel",
          codigo: `=SI((B5-B4+1)<30; 0; REDONDEAR((C10/12)*D10 + (C10/360)*E10; 2))`,
          codigoEn: `=IF((B5-B4+1)<30, 0, ROUND((C10/12)*D10 + (C10/360)*E10, 2))`,
          nota: "B4 = Fecha de ingreso; B5 = Fecha de cese; C10 = Remuneración Computable CTS (con 1/6 de gratificación); D10 = Meses completos pendientes; E10 = Días adicionales pendientes.",
        },
      ],
    },
    {
      id: "bloque-vacaciones-truncas",
      titulo: "3. Calcular vacaciones truncas, vencidas e indemnización vacacional",
      esPasoHowTo: true,
      resumenHowTo:
        "Determina los días de vacaciones pendientes y los meses y días truncos desde el último aniversario laboral bajo el D.Leg. 713, recordando que sí están afectos a pensión.",
      parrafos: [
        "Las vacaciones en el régimen general se regulan por el Decreto Legislativo 713. Al cesar, pueden existir hasta tres conceptos vacacionales: vacaciones truncas (por el año en curso incompleto desde la última fecha de aniversario), vacaciones devengadas no gozadas (si cumplió el año de servicios y no las tomó) e indemnización vacacional (si transcurrió más de un año adicional sin gozarlas).",
        "A diferencia de la CTS, la base de cálculo de las vacaciones truncas NO incluye 1/6 de gratificación; se calcula con la remuneración computable ordinaria (sueldo básico + asignación familiar + promedio de variables regulares). La fórmula prorratea meses completos (RC / 12 × meses) y días adicionales (RC / 30 × días / 12, equivalente a RC / 360 × días), siempre que el trabajador haya superado un mes de servicios.",
        "Un detalle fundamental que diferencia a las vacaciones del resto de la liquidación es que las vacaciones truncas y vencidas sí tienen carácter remunerativo, por lo que están afectas al descuento de AFP u ONP y a la retención de renta de quinta categoría si corresponde.",
      ],
      codigos: [
        {
          titulo: "Cálculo de vacaciones truncas en Excel (D.Leg. 713)",
          lenguaje: "excel",
          codigo: `=SI((B5-B4+1)<30; 0; REDONDEAR((C15/12)*D15 + (C15/360)*E15; 2))`,
          codigoEn: `=IF((B5-B4+1)<30, 0, ROUND((C15/12)*D15 + (C15/360)*E15, 2))`,
          nota: "C15 = Remuneración Computable vacacional (sin 1/6 de gratificación); D15 = Meses completos desde el último aniversario; E15 = Días adicionales.",
        },
      ],
      alerta: {
        tipo: "warning",
        titulo: "Afectación previsional de las vacaciones",
        texto:
          "En la hoja de liquidación, aplica el porcentaje de AFP u ONP únicamente sobre la celda de vacaciones truncas y vencidas. Nunca apliques descuentos previsionales sobre CTS trunca, gratificación trunca ni indemnización por despido.",
      },
    },
    {
      id: "bloque-gratificacion-trunca",
      titulo: "4. Calcular la gratificación trunca y su bonificación extraordinaria",
      esPasoHowTo: true,
      resumenHowTo:
        "Computa únicamente meses calendario completos dentro del semestre de cese y suma el 9 % (EsSalud) o 6,75 % (EPS) de bonificación extraordinaria.",
      parrafos: [
        "El tercer bloque es la gratificación trunca (Ley 27735 y D.S. 005-2002-TR). Aquí solo cuentan los meses calendario completos laborados dentro del semestre en que ocurre el cese (enero-junio o julio-diciembre). Si el trabajador cesa el 22 de septiembre, los meses completos del semestre julio-diciembre son julio y agosto (2 meses); los 22 días de septiembre no generan gratificación trunca.",
        "Sobre el monto de gratificación trunca obtenido debes añadir la bonificación extraordinaria de la Ley 30334: 9 % si el trabajador está en EsSalud o 6,75 % si está afiliado a una EPS. Puedes profundizar en las reglas de regularidad de comisiones y días faltados en nuestra guía sobre [cómo calcular la gratificación en Excel](/pe/guias/calcular-gratificacion-excel).",
      ],
      codigos: [
        {
          titulo: "Gratificación trunca y bonificación extraordinaria",
          lenguaje: "excel",
          codigo: `=REDONDEAR((C20/6)*D20; 2) + REDONDEAR(((C20/6)*D20)*SI(B8="EPS";Parametros!$B$6;0,09); 2)`,
          codigoEn: `=ROUND((C20/6)*D20, 2) + ROUND(((C20/6)*D20)*IF(B8="EPS",Parametros!$B$6,0.09), 2)`,
          nota: "C20 = Remuneración computable; D20 = Meses calendario completos del semestre; B8 = Régimen de salud ('EsSalud' o 'EPS'). Conviene mostrar la gratificación trunca y la bonificación en filas separadas para mayor claridad.",
        },
      ],
    },
    {
      id: "indemnizacion-y-resumen-neto",
      titulo: "5. Evaluar indemnización por despido arbitrario y total neto a pagar",
      esPasoHowTo: true,
      resumenHowTo:
        "Aplica la fórmula del D.S. 003-97-TR según tipo de contrato cuando el motivo sea despido arbitrario, descuenta AFP/ONP de las vacaciones y obtén el neto.",
      parrafos: [
        "Si el término del vínculo obedece a renuncia voluntaria, mutuo disenso o vencimiento natural de contrato, la indemnización es S/ 0. En cambio, si el motivo es despido arbitrario (y el trabajador superó el periodo de prueba de 3 meses), el artículo 38 del D.S. 003-97-TR fija dos reglas según la modalidad contractual:",
        "Para contratos a plazo indeterminado, corresponde 1,5 remuneraciones ordinarias por cada año completo de servicios, más dozavos y treintavos por las fracciones de meses y días, con un tope máximo de 12 remuneraciones. Para contratos sujetos a modalidad (plazo fijo), corresponde 1,5 remuneraciones por cada mes dejado de laborar hasta el vencimiento pactado del contrato, también con tope de 12 remuneraciones.",
        "Finalmente, suma los cuatro bloques brutos, resta el descuento de AFP/ONP calculado exclusivamente sobre las vacaciones y verifica cualquier retención de renta de quinta categoría. El pago total de la liquidación debe efectuarse dentro de las 48 horas siguientes al cese.",
      ],
      codigos: [
        {
          titulo: "Indemnización por despido arbitrario (plazo indeterminado, tope 12 remuneraciones)",
          lenguaje: "excel",
          codigo: `=SI(B6<>"Despido arbitrario"; 0; MIN(12*C25; REDONDEAR(C25*Parametros!$B$4*(D25 + E25/12 + F25/360); 2)))`,
          codigoEn: `=IF(B6<>"Despido arbitrario", 0, MIN(12*C25, ROUND(C25*Parametros!$B$4*(D25 + E25/12 + F25/360), 2)))`,
          nota: "B6 = Motivo de cese; C25 = Remuneración ordinaria mensual; D25 = Años completos; E25 = Meses adicionales; F25 = Días adicionales. El tope legal es 12 remuneraciones.",
        },
      ],
      tabla: {
        caption: "Resumen comparativo de afectación y base de cálculo en la liquidación (Perú)",
        encabezados: [
          "Beneficio / Concepto",
          "Incluye 1/6 gratif.",
          "Computa días sueltos",
          "Afecto a AFP / ONP",
        ],
        filas: [
          [
            "CTS trunca",
            "Sí",
            "Sí (RC / 360 × días)",
            "No",
          ],
          [
            "Vacaciones truncas y vencidas",
            "No",
            "Sí (RC / 360 × días)",
            "Sí",
          ],
          [
            "Gratificación trunca + bonif.",
            "No",
            "No (solo meses completos)",
            "No",
          ],
          [
            "Indemnización despido arbitrario",
            "No",
            "Sí (en indeterminado)",
            "No",
          ],
        ],
      },
    },
  ],
  erroresComunes: [
    {
      error: "Descontar AFP u ONP sobre toda la liquidación",
      causa:
        "Aplicar la tasa previsional al subtotal completo en vez de aislar únicamente el bloque de vacaciones.",
      solucion:
        "Calcula la retención de AFP/ONP exclusivamente sobre la suma de vacaciones truncas y vacaciones vencidas.",
    },
    {
      error: "Incluir 1/6 de gratificación en las vacaciones truncas",
      causa:
        "Reutilizar la misma Remuneración Computable de la CTS para calcular vacaciones y gratificación trunca.",
      solucion:
        "Mantén dos celdas separadas: RC_CTS (con 1/6 de gratificación) y RC_Ordinaria (sin 1/6) para vacaciones y gratificación.",
    },
    {
      error: "Omitir el tope de 12 remuneraciones en la indemnización por despido",
      causa:
        "Multiplicar 1,5 remuneraciones por años de servicio en trabajadores con más de 8 años de antigüedad sin limitar el resultado.",
      solucion:
        "Envuelve la fórmula de indemnización con la función MIN(12 * Remuneracion; Calculo_Bruto) para respetar el tope del D.S. 003-97-TR.",
    },
    {
      error: "Pagar beneficios truncos sin verificar el mínimo de 1 mes",
      causa:
        "No validar la duración total del vínculo laboral en ceses tempranos durante el primer mes.",
      solucion:
        "Agrega la condición SI((Fecha_Cese - Fecha_Ingreso + 1) < 30; 0; ...) en CTS trunca y vacaciones truncas.",
    },
  ],
  plantilla: {
    titulo: "Plantilla de Liquidación de Beneficios Sociales en Excel (Perú 2026)",
    descripcion:
      "Descarga el archivo .xlsx con hoja Parametros, cálculo automático de CTS trunca, vacaciones truncas, gratificación trunca, indemnización D.S. 003-97-TR y hoja de liquidación imprimible.",
  },
  plantillaArchivo: {
    recurso: "liquidacion-beneficios-sociales-peru-2026",
    archivoUrl: "/pe/plantillas/liquidacion-beneficios-sociales-peru-2026.xlsx",
    nombreArchivo: "liquidacion-beneficios-sociales-peru-2026.xlsx",
  },
  faqs: [
    {
      q: "¿Cuál es el plazo legal para pagar la liquidación de beneficios sociales en Perú?",
      a: "El empleador debe abonar la liquidación de beneficios sociales dentro de las 48 horas siguientes de producido el cese laboral, junto con el certificado de trabajo y la carta de liberación de CTS.",
    },
    {
      q: "¿Qué ocurre si el trabajador renuncia antes de cumplir un mes de labores?",
      a: "Si el vínculo duró menos de un mes calendario (30 días), no se generan vacaciones truncas, CTS trunca ni gratificación trunca; únicamente corresponde pagar los días efectivamente trabajados en la boleta de cierre.",
    },
    {
      q: "¿Cuándo aplica la indemnización vacacional triple?",
      a: "Si el trabajador adquiere el derecho a sus vacaciones anuales y no las goza dentro del año siguiente al que adquirió el derecho, corresponde una remuneración por el trabajo realizado (ya pagada en su momento), una por el descanso adquirido y no gozado, y una indemnización equivalente a una remuneración (no afecta a AFP/ONP).",
    },
    {
      q: "¿Cómo se calcula la indemnización si el contrato era a plazo fijo?",
      a: "Según el artículo 76 del D.S. 003-97-TR, si un trabajador con contrato sujeto a modalidad es despedido arbitrariamente antes del vencimiento, le corresponde 1,5 remuneraciones por cada mes que falte para culminar el contrato, con un tope máximo de 12 remuneraciones.",
    },
    {
      q: "¿Las vacaciones truncas están afectas a EsSalud?",
      a: "Sí. Al ser un concepto remunerativo, las vacaciones truncas y vencidas forman parte de la base para el aporte del empleador a EsSalud (9 %) y para el descuento previsional del trabajador (AFP u ONP).",
    },
  ],
  relacionadas: [
    "calcular-cts-excel",
    "calcular-gratificacion-excel",
    "boleta-de-pago-excel",
  ],
  enlacesExternos: [
    {
      label: "Derechos laborales y liquidación al cese",
      url: "https://www.gob.pe/mtpe",
      fuente: "Ministerio de Trabajo y Promoción del Empleo (MTPE)",
    },
    {
      label: "Comisiones y primas vigentes de AFP",
      url: "https://www.sbs.gob.pe/",
      fuente: "Superintendencia de Banca, Seguros y AFP (SBS)",
    },
  ],
  enlacesInternosExtra: [
    {
      label: "Curso de Excel en vivo (Perú)",
      href: "/pe/cursos/excel",
      descripcion: "Aprende a diseñar modelos laborales y financieros sin errores en Excel.",
    },
    {
      label: "Datos económicos de Perú",
      href: "/pe/datos",
      descripcion: "Consulta indicadores económicos de referencia para tus planillas.",
    },
    {
      label: "Carreras y sueldos en Perú",
      href: "/pe/datos/carreras",
      descripcion: "Revisa ingresos promedio y empleos por carrera en el mercado peruano.",
    },
  ],
};

export default guia;
