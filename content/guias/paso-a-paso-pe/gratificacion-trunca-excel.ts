import type { GuiaPasoAPaso } from "@/lib/guias/paso-a-paso-tipos";

export const guia: GuiaPasoAPaso = {
  slug: "gratificacion-trunca-excel",
  pais: "pe",
  title: "Cómo calcular la gratificación trunca en Excel (Perú 2026)",
  meta: "Aprende a calcular la gratificación trunca en Excel (Art. 7 Ley 27735 y Art. 5 D.S. 005-2002-TR): sextos por mes completo, bono 9 % o 6,75 % y pago en 48 horas.",
  h1: "Cómo calcular la gratificación trunca en Excel (Perú 2026)",
  subtitle:
    "Construye una hoja de cálculo en Excel para determinar la gratificación trunca cuando el trabajador cesa antes del 15 de julio o del 15 de diciembre, aplicando 1/6 por mes calendario completo laborado (Art. 7 de la Ley 27735 y Art. 5 del D.S. 005-2002-TR) y la bonificación extraordinaria del 9 % (EsSalud) o 6,75 % (EPS).",
  keywordPrincipal: "como calcular gratificacion trunca en excel peru",
  keywords: [
    "como calcular gratificacion trunca en excel peru",
    "gratificacion trunca ley 27735 excel",
    "calculo gratificacion trunca meses completos",
    "bonificacion extraordinaria gratificacion trunca",
  ],
  curso: "excel",
  cursoSecundario: "power-bi",
  herramienta: "Excel",
  nivel: "Básico",
  updated: "2026-11-26",
  published: "2026-11-26",
  totalTimeIso: "PT20M",
  en30Segundos: {
    queLogras:
      "Una plantilla en Excel que identifica el semestre vigente al cese, cuenta únicamente los meses calendario completos laborados (excluyendo fracciones de mes), calcula 1/6 de la remuneración computable por cada mes completo y suma la bonificación extraordinaria de EsSalud (9 %) o EPS (6,75 %).",
    herramienta: "Microsoft Excel (365, 2021 o Web)",
    tiempo: "20 minutos",
    bullets: [
      "Aplica cuando el vínculo laboral termina antes del 15 de julio o del 15 de diciembre (Art. 7 Ley 27735 y Art. 5 D.S. 005-2002-TR).",
      "Cálculo proporcional de 1/6 por cada mes calendario completo laborado en el semestre correspondiente.",
      "Incluye bonificación extraordinaria inafecta del 9 % (EsSalud) o 6,75 % (EPS) según la Ley 30334.",
      "Control de pago obligatorio dentro de las 48 horas siguientes al cese junto con la liquidación de beneficios sociales.",
    ],
  },
  rutaVisual: [
    {
      numero: 1,
      titulo: "Semestre y fechas clave",
      resumen: "Define fecha de ingreso, fecha de cese y el inicio del semestre computable.",
      anchorId: "semestre-y-fechas-cese",
      icono: "calendar",
    },
    {
      numero: 2,
      titulo: "Meses completos",
      resumen: "Cuenta solo meses calendario íntegros (del día 1 al último día del mes).",
      anchorId: "conteo-meses-completos-trunca",
      icono: "table",
    },
    {
      numero: 3,
      titulo: "Remuneración computable",
      resumen: "Toma la remuneración vigente al momento del cese más asignación familiar y variables.",
      anchorId: "base-computable-trunca",
      icono: "database",
    },
    {
      numero: 4,
      titulo: "Sextos y bonificación",
      resumen: "Calcula el proporcional (1/6 por mes) y suma el 9 % de EsSalud o 6,75 % de EPS.",
      anchorId: "formula-gratificacion-trunca-excel",
      icono: "code",
    },
    {
      numero: 5,
      titulo: "Plazo de 48 horas",
      resumen: "Integra el resultado en la liquidación y valida el vencimiento del pago.",
      anchorId: "integracion-liquidacion-48h",
      icono: "check",
    },
  ],
  requisitos: {
    version: "Excel 365, Excel 2021 o Excel para la Web (compatible con Excel 2016/2019)",
    lista: [
      "Microsoft Excel en Windows, macOS o versión Web.",
      "Fecha de ingreso, fecha de cese del trabajador y registro de faltas injustificadas del semestre.",
      "Remuneración fija vigente al cese, indicador de asignación familiar (10 % de la RMV de S/ 1.230 según D.S. N.° 015-2026-TR) y promedio de variables si hubo regularidad.",
      "Tipo de cobertura de salud (EsSalud 9 % o EPS 6,75 %) y régimen laboral de la empresa.",
    ],
    compatibilidadMacWeb:
      "Todas las fórmulas propuestas (SI, FECHA, FIN.MES, AÑO, MES, DIA, MAX, MIN, REDONDEAR) operan sin cambios en Windows, macOS y Excel Web. Usa punto y coma (;) en Excel en español o coma (,) en Excel en inglés.",
    avisoEducativo:
      "Guía educativa referencial basada en el artículo 7 de la Ley 27735, el artículo 5 del D.S. 005-2002-TR y la Ley 30334. Verifica siempre el régimen laboral aplicable y la normativa vigente en gob.pe/mtpe antes de emitir liquidaciones.",
  },
  herramientasHowTo: ["Microsoft Excel 365 / 2021 / Web"],
  insumosHowTo: [
    "Fecha de ingreso y fecha de cese del trabajador",
    "Remuneración computable vigente al momento del cese y afiliación EsSalud o EPS",
  ],
  secciones: [
    {
      id: "semestre-y-fechas-cese",
      titulo: "1. Identificar el semestre computable y la regla del cese",
      esPasoHowTo: true,
      resumenHowTo:
        "Determina si el cese ocurre en el semestre enero-junio o julio-diciembre y delimita el periodo real de cálculo.",
      parrafos: [
        "De acuerdo con el artículo 7 de la Ley 27735 y el artículo 5 de su reglamento (D.S. 005-2002-TR), la gratificación trunca se origina cuando el trabajador no tiene vínculo vigente en la oportunidad de pago (15 de julio o 15 de diciembre), pero sí laboró por lo menos un mes calendario completo dentro del semestre correspondiente.",
        "En Excel, lo primero es automatizar el primer día del semestre en el que ocurre el cese: si el cese es entre enero y junio, el semestre arranca el 1 de enero; si el cese es entre julio y diciembre, el semestre arranca el 1 de julio. Esto evita errores manuales cuando liquidas ceses de distintos meses en una misma hoja.",
        "Si necesitas primero repasar el cálculo ordinario de Navidad o Fiestas Patrias, revisa la guía de [cálculo de gratificación en Excel](/pe/guias/calcular-gratificacion-excel). Para ver cómo encaja este concepto dentro de toda la nómina, consulta la guía pilar de [planilla de sueldos en Excel para Perú](/pe/guias/planilla-de-sueldos-excel-peru).",
      ],
      codigos: [
        {
          titulo: "Fórmula en Excel para obtener el inicio del semestre según la fecha de cese",
          lenguaje: "excel",
          codigo: `=FECHA(AÑO(C2); SI(MES(C2)<=6; 1; 7); 1)`,
          codigoEn: `=DATE(YEAR(C2), IF(MONTH(C2)<=6, 1, 7), 1)`,
          nota: "C2 = Fecha de cese del trabajador. Devuelve 01/01/AAAA si cesó en el primer semestre o 01/07/AAAA si cesó en el segundo semestre.",
        },
      ],
    },
    {
      id: "conteo-meses-completos-trunca",
      titulo: "2. Contar solo meses calendario completos laborados (excluir días sueltos)",
      esPasoHowTo: true,
      resumenHowTo:
        "Calcula los meses calendario completos entre la fecha de inicio efectivo en el semestre y el último mes cerrado antes del cese.",
      parrafos: [
        "A diferencia de la CTS o las vacaciones truncas, que sí prorratean días calendario, la gratificación trunca se calcula exclusivamente por meses calendario completos laborados dentro del semestre (a razón de 1/6 por cada mes completo). Si un trabajador cesa el 20 de noviembre, noviembre no se computa para la gratificación trunca; solo cuentan los meses completos cerrados hasta octubre.",
        "El único caso en que el mes del cese sí cuenta completo es cuando el cese ocurre exactamente el último día calendario del mes (por ejemplo, el 30 de noviembre o el 31 de octubre). Lo mismo ocurre con el ingreso: el mes de ingreso solo cuenta si el trabajador ingresó el día 1 de ese mes.",
        "En Excel puedes resolver ambos extremos en una sola fórmula usando FIN.MES para validar si la fecha de cese coincide con el último día del mes, y DIA para verificar si el inicio en el semestre fue el día 1.",
      ],
      codigos: [
        {
          titulo: "Conteo exacto de meses calendario completos para gratificación trunca",
          lenguaje: "excel",
          codigo: `=MAX(0; (AÑO(SI(C2=FIN.MES(C2;0);C2;FIN.MES(C2;-1)))-AÑO(MAX(B2;D2)))*12 + MES(SI(C2=FIN.MES(C2;0);C2;FIN.MES(C2;-1))) - MES(MAX(B2;D2)) + SI(DIA(MAX(B2;D2))=1;1;0))`,
          codigoEn: `=MAX(0, (YEAR(IF(C2=EOMONTH(C2,0),C2,EOMONTH(C2,-1)))-YEAR(MAX(B2,D2)))*12 + MONTH(IF(C2=EOMONTH(C2,0),C2,EOMONTH(C2,-1))) - MONTH(MAX(B2,D2)) + IF(DAY(MAX(B2,D2))=1,1,0))`,
          nota: "B2 = Fecha de ingreso; C2 = Fecha de cese; D2 = Inicio del semestre (fórmula del paso 1). Si cesa antes de completar un mes calendario íntegro, la fórmula devuelve 0.",
        },
      ],
      alerta: {
        tipo: "warning",
        titulo: "Cuidado con ceses antes de cumplir un mes completo",
        texto:
          "Si un trabajador ingresó el 15 de octubre y cesó el 25 de noviembre, no completó ningún mes calendario íntegro (octubre incompleto y noviembre incompleto). En ese caso no corresponde gratificación trunca (0 sextos).",
      },
    },
    {
      id: "base-computable-trunca",
      titulo: "3. Determinar la remuneración computable al momento del cese",
      esPasoHowTo: true,
      resumenHowTo:
        "Suma sueldo básico vigente al cese, asignación familiar (10 % de la RMV) y promedio de remuneraciones variables con regularidad.",
      parrafos: [
        "Según el artículo 5 del D.S. 005-2002-TR, la remuneración computable para la gratificación trunca es la vigente al momento del cese del trabajador. Incluye el sueldo básico y cualquier concepto fijo y regular de libre disposición.",
        "Si el trabajador percibía asignación familiar, suma el 10 % de la RMV vigente. Desde el 1 de octubre de 2026 la RMV es de S/ 1.230 (D.S. N.° 015-2026-TR), por lo que la asignación familiar vigente asciende a S/ 123,00. Las remuneraciones variables (como comisiones u horas extras) ingresan al promedio únicamente si se percibieron al menos tres meses dentro del semestre evaluado.",
      ],
      codigos: [
        {
          titulo: "Remuneración computable al cese en Excel",
          lenguaje: "excel",
          codigo: `=E2 + SI(F2="Sí"; Parametros!$B$4; 0) + SI(G2>=3; REDONDEAR(H2/MAX(1;I2);2); 0)`,
          codigoEn: `=E2 + IF(F2="Sí", Parametros!$B$4, 0) + IF(G2>=3, ROUND(H2/MAX(1,I2),2), 0)`,
          nota: "E2 = Sueldo básico al cese; F2 = Asignación familiar ('Sí'/'No'); Parametros!$B$4 = 10 % de la RMV; G2 = Meses del semestre con variable; H2 = Total variable en el semestre; I2 = Meses laborados en el semestre.",
        },
      ],
    },
    {
      id: "formula-gratificacion-trunca-excel",
      titulo: "4. Calcular 1/6 por mes completo y la bonificación extraordinaria",
      esPasoHowTo: true,
      resumenHowTo:
        "Multiplica la remuneración computable por los meses completos entre 6, descuenta faltas injustificadas y agrega 9 % (EsSalud) o 6,75 % (EPS).",
      parrafos: [
        "Con la remuneración computable (RC) y los meses completos (M), la gratificación trunca equivale a (RC / 6) * M. Si hubo días de inasistencia injustificada durante los meses computados, se descuenta 1/30 de un sexto por cada día de falta.",
        "Al igual que la gratificación ordinaria, la gratificación trunca goza de la bonificación extraordinaria establecida por la Ley 29351 y la Ley 30334: se añade un 9 % adicional si el trabajador está afiliado únicamente a EsSalud, o un 6,75 % si cuenta con cobertura de una EPS. Ambos importes están inafectos a descuentos de AFP y ONP, aunque sí se consideran en la proyección de renta de quinta categoría.",
      ],
      codigos: [
        {
          titulo: "Gratificación trunca bruta y bonificación extraordinaria en Excel",
          lenguaje: "excel",
          codigo: `=REDONDEAR((J2/6)*I2 - (J2/6/30)*K2; 2)`,
          codigoEn: `=ROUND((J2/6)*I2 - (J2/6/30)*K2, 2)`,
          nota: "J2 = Remuneración computable; I2 = Meses completos del paso 2; K2 = Días de falta injustificada. Luego calcula el bono extraordinario en L2 con =REDONDEAR(Resultado * SI(M2=\"EPS\";0,0675;0,09); 2).",
        },
      ],
    },
    {
      id: "integracion-liquidacion-48h",
      titulo: "5. Integrar en la liquidación y controlar el plazo de 48 horas",
      esPasoHowTo: true,
      resumenHowTo:
        "Vincula el total de gratificación trunca más bonificación extraordinaria a la liquidación de beneficios sociales y controla el vencimiento.",
      parrafos: [
        "El pago de la gratificación trunca debe efectuarse conjuntamente con todos los beneficios sociales pendientes dentro de las 48 horas siguientes de producido el cese del trabajador. En tu libro de Excel, agrega una columna con la fórmula =C2+2 (fecha de cese más dos días) para alertar al equipo de tesorería sobre el plazo máximo de abono.",
        "Puedes vincular directamente el resultado de esta hoja hacia tu hoja de [liquidación de beneficios sociales en Excel](/pe/guias/liquidacion-beneficios-sociales-excel) y verificar la retención final de quinta categoría en el mes del cese.",
      ],
      tabla: {
        caption: "Comparación operativa: gratificación ordinaria vs. gratificación trunca",
        encabezados: [
          "Criterio",
          "Gratificación ordinaria",
          "Gratificación trunca",
        ],
        filas: [
          [
            "Cuándo aplica",
            "Vínculo vigente al 15 de julio o 15 de diciembre",
            "Cese antes del 15 de julio o 15 de diciembre",
          ],
          [
            "Unidad de cómputo",
            "Mes calendario completo (1/6 por mes)",
            "Mes calendario completo (1/6 por mes)",
          ],
          [
            "Días sueltos",
            "No se prorratean",
            "No se prorratean",
          ],
          [
            "Bonificación extraordinaria",
            "9 % (EsSalud) / 6,75 % (EPS)",
            "9 % (EsSalud) / 6,75 % (EPS)",
          ],
          [
            "Plazo legal de pago",
            "15 de julio / 15 de diciembre",
            "Dentro de las 48 horas posteriores al cese",
          ],
        ],
      },
    },
  ],
  erroresComunes: [
    {
      error: "Prorratear los días trabajados del mes de cese",
      causa:
        "Aplicar la misma lógica de la CTS o vacaciones truncas dividiendo entre 30 los días trabajados hasta la fecha de cese.",
      solucion:
        "Según el Art. 5 del D.S. 005-2002-TR, la gratificación trunca solo se computa por meses calendario completos. Si el cese no ocurre el último día del mes, ese mes queda fuera del cálculo.",
    },
    {
      error: "Omitir la bonificación extraordinaria del 9 % o 6,75 %",
      causa:
        "Pensar que la bonificación extraordinaria de la Ley 30334 solo se paga en julio y diciembre y no en ceses intermedios.",
      solucion:
        "La bonificación extraordinaria aplica también a la gratificación trunca en la misma proporción (9 % EsSalud o 6,75 % EPS).",
    },
    {
      error: "Aplicar descuentos de AFP u ONP en la liquidación",
      causa:
        "Sumar la gratificación trunca al sueldo del último mes y aplicar el porcentaje de aporte previsional sobre todo el bloque.",
      solucion:
        "Mantén la gratificación trunca en una fila separada e inafecta a AFP/ONP dentro de la hoja de liquidación; solo inclúyela en el cálculo de quinta categoría.",
    },
  ],
  plantilla: {
    titulo: "Plantilla de Gratificación y Gratificación Trunca en Excel (Perú 2026)",
    descripcion:
      "Descarga el archivo .xlsx con hoja Parametros (RMV vigente S/ 1.230, tasas 9 % y 6,75 %), cálculo de gratificación ordinaria y cálculo automático de gratificación trunca por cese.",
  },
  plantillaArchivo: {
    recurso: "gratificacion-peru-2026",
    archivoUrl: "/pe/plantillas/gratificacion-peru-2026.xlsx",
    nombreArchivo: "gratificacion-peru-2026.xlsx",
  },
  faqs: [
    {
      q: "¿Cuántos meses debo trabajar para recibir gratificación trunca?",
      a: "Según el artículo 5 del D.S. 005-2002-TR, debes haber laborado por lo menos un mes calendario completo (del día 1 al último día del mes) dentro del semestre en que ocurre el cese.",
    },
    {
      q: "Si renuncio el 20 de noviembre, ¿noviembre cuenta en la gratificación trunca?",
      a: "No. Al no haber completado el mes calendario hasta el 30 de noviembre, solo se computan los meses calendario completos cerrados dentro del semestre julio-diciembre (julio, agosto, septiembre y octubre, es decir, 4/6 si laboraste desde el 1 de julio).",
    },
    {
      q: "¿Cuándo se debe pagar la gratificación trunca?",
      a: "Debe abonarse junto con la liquidación de beneficios sociales dentro de las 48 horas siguientes al cese del trabajador.",
    },
    {
      q: "¿La gratificación trunca lleva bonificación extraordinaria del 9 % o 6,75 %?",
      a: "Sí. Al igual que la gratificación ordinaria, lleva la bonificación extraordinaria inafecta de la Ley 30334 (9 % si el trabajador está en EsSalud o 6,75 % si está afiliado a una EPS).",
    },
  ],
  relacionadas: [
    "calcular-gratificacion-excel",
    "liquidacion-beneficios-sociales-excel",
    "planilla-de-sueldos-excel-peru",
  ],
  enlacesExternos: [
    {
      label: "Ley 27735 y normativa laboral sobre gratificaciones",
      url: "https://www.gob.pe/mtpe",
      fuente: "Ministerio de Trabajo y Promoción del Empleo (MTPE)",
    },
    {
      label: "Orientación tributaria sobre bonificación extraordinaria",
      url: "https://www.sunat.gob.pe/",
      fuente: "SUNAT",
    },
  ],
  enlacesInternosExtra: [
    {
      label: "Cómo calcular la gratificación de diciembre 2026 en Excel",
      href: "/pe/guias/calcular-gratificacion-excel",
      descripcion: "Cálculo semestral ordinario de julio y diciembre con plantilla descargable.",
    },
    {
      label: "Liquidación de beneficios sociales en Excel",
      href: "/pe/guias/liquidacion-beneficios-sociales-excel",
      descripcion: "Integra CTS trunca, vacaciones truncas y gratificación trunca en un solo libro.",
    },
    {
      label: "Planilla de sueldos en Excel (Perú 2026)",
      href: "/pe/guias/planilla-de-sueldos-excel-peru",
      descripcion: "Guía pilar con el flujo completo de nómina y enlaces a las 6 guías laborales.",
    },
    {
      label: "Curso de Excel en vivo (Perú)",
      href: "/pe/cursos/excel",
      descripcion: "Domina fórmulas laborales, tablas dinámicas y automatización de planillas.",
    },
  ],
};

export default guia;
