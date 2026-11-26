import type { GuiaPasoAPaso } from "@/lib/guias/paso-a-paso-tipos";

export const guia: GuiaPasoAPaso = {
  slug: "planilla-de-sueldos-excel-peru",
  pais: "pe",
  title: "Planilla de sueldos en Excel (Perú 2026): guía completa",
  meta: "Arma una planilla de sueldos en Excel para Perú 2026: hoja Parametros (RMV S/ 1.230), boleta, AFP/ONP, EsSalud, quinta categoría, gratificación, CTS y liquidación.",
  h1: "Planilla de sueldos en Excel para Perú (2026): arquitectura completa",
  subtitle:
    "Diseña un libro maestro de planilla en Excel para empresas peruanas integrando la hoja Parametros (RMV vigente S/ 1.230 desde octubre 2026), ingresos y descuentos de ley, boleta mensual, retención de quinta categoría, beneficios semestrales (gratificación y CTS) y liquidación de beneficios sociales.",
  keywordPrincipal: "planilla de sueldos en excel peru",
  keywords: [
    "planilla de sueldos en excel peru",
    "modelo de planilla de remuneraciones excel peru 2026",
    "como hacer una planilla en excel peru",
    "calculo de planilla peru afp onp essalud excel",
  ],
  curso: "excel",
  cursoSecundario: "power-bi",
  herramienta: "Excel",
  nivel: "Intermedio",
  updated: "2026-11-26",
  published: "2026-11-26",
  totalTimeIso: "PT35M",
  en30Segundos: {
    queLogras:
      "Una arquitectura modular en Excel con cinco hojas conectadas (Parametros, Trabajadores, Planilla_Mensual, Beneficios_Semestrales y Boleta) para calcular sueldos, aportes, descuentos de ley y provisiones laborales en Perú.",
    herramienta: "Microsoft Excel (365, 2021 o Web)",
    tiempo: "35 minutos",
    bullets: [
      "Hoja Parametros centralizada con RMV vigente de S/ 1.230 (D.S. N.° 015-2026-TR), asignación familiar de S/ 123,00, tasas de EsSalud (9 %), ONP (13 %) y comisiones de AFP.",
      "Cálculo mensual de ingresos afectos e inafectos, descuentos previsionales y retención de renta de quinta categoría.",
      "Integración directa con las hojas especializadas de gratificación ordinaria, gratificación trunca, CTS y liquidación de beneficios sociales.",
      "Generación automatizada de boletas de pago mensuales con BUSCARX / INDICE y COINCIDIR.",
    ],
  },
  rutaVisual: [
    {
      numero: 1,
      titulo: "Parámetros legales",
      resumen: "Centraliza RMV, UIT, EsSalud, ONP y tabla de AFP en una sola hoja.",
      anchorId: "arquitectura-parametros-planilla",
      icono: "database",
    },
    {
      numero: 2,
      titulo: "Maestro y mensual",
      resumen: "Calcula sueldo básico, asignación familiar, horas extras y descuentos.",
      anchorId: "calculo-mensual-ingresos-descuentos",
      icono: "table",
    },
    {
      numero: 3,
      titulo: "Quinta y boleta",
      resumen: "Integra la retención mensual de quinta categoría y emite la boleta.",
      anchorId: "quinta-categoria-y-boleta",
      icono: "file",
    },
    {
      numero: 4,
      titulo: "Beneficios semestrales",
      resumen: "Conecta gratificaciones de julio/diciembre y depósitos de CTS mayo/noviembre.",
      anchorId: "gratificacion-y-cts-semestral",
      icono: "calendar",
    },
    {
      numero: 5,
      titulo: "Ceses y liquidación",
      resumen: "Calcula gratificación trunca, CTS trunca y vacaciones truncas en 48 horas.",
      anchorId: "ceses-y-liquidacion-beneficios",
      icono: "check",
    },
  ],
  requisitos: {
    version: "Excel 365, Excel 2021 o Excel para la Web (compatible también con Excel 2016/2019 usando INDICE/COINCIDIR)",
    lista: [
      "Microsoft Excel en Windows, macOS o versión Web.",
      "Maestro de trabajadores con DNI, fecha de ingreso, régimen laboral, sistema previsional (ONP o AFP específica) y cobertura de salud (EsSalud o EPS).",
      "Registro de asistencias, faltas, horas extras, comisiones y licencias del mes.",
      "Valores oficiales vigentes (RMV, UIT y tasas de AFP actualizadas en sbs.gob.pe).",
    ],
    compatibilidadMacWeb:
      "Las fórmulas estructuradas (SI, REDONDEAR, SUMAR.SI, INDICE, COINCIDIR, BUSCARX) funcionan de forma idéntica en Windows, macOS y Excel Web. Usa punto y coma (;) en Excel en español o coma (,) en Excel en inglés.",
    avisoEducativo:
      "Guía educativa referencial sobre la estructura de planilla de remuneraciones del régimen laboral privado en Perú. Verifica siempre las tasas de AFP vigentes en sbs.gob.pe, el valor de la UIT en sunat.gob.pe y la normativa laboral en gob.pe/mtpe.",
  },
  herramientasHowTo: ["Microsoft Excel 365 / 2021 / Web"],
  insumosHowTo: [
    "Maestro de personal con régimen previsional (ONP / AFP) y asignación familiar",
    "Tabla de parámetros legales vigentes (RMV, UIT, EsSalud 9 % y tasas AFP)",
  ],
  secciones: [
    {
      id: "arquitectura-parametros-planilla",
      titulo: "1. Diseñar la arquitectura del libro y la hoja Parametros",
      esPasoHowTo: true,
      resumenHowTo:
        "Separa datos maestros, parámetros legales y cálculo mensual en hojas independientes para auditar y actualizar tasas sin romper fórmulas.",
      parrafos: [
        "El error más costoso al llevar una planilla de sueldos en Excel es mezclar los porcentajes legales dentro de cada fila del trabajador. Cuando cambia la Remuneración Mínima Vital (RMV), la UIT anual o la prima de seguro de una AFP, quien escribió números fijos en las fórmulas termina con cálculos desactualizados y difíciles de auditar.",
        "La práctica recomendada es organizar el libro en cinco hojas: Parametros (tasas oficiales y topes), Trabajadores (datos fijos del colaborador), Planilla_Mensual (cálculo del periodo), Beneficios_Semestrales (provisiones y pagos de gratificación y CTS) y Boleta (formato imprimible por trabajador). Para la RMV vigente en Perú, desde el 1 de octubre de 2026 rige S/ 1.230 según el D.S. N.° 015-2026-TR (gob.pe/mtpe), lo que fija la asignación familiar (10 %) en S/ 123,00.",
      ],
      tabla: {
        caption: "Estructura recomendada de la hoja Parametros en la planilla peruana",
        encabezados: [
          "Parámetro",
          "Regla / Valor de referencia",
          "Fuente oficial",
        ],
        filas: [
          [
            "RMV vigente",
            "S/ 1.230 (vigente desde el 01/10/2026)",
            "D.S. N.° 015-2026-TR / gob.pe/mtpe",
          ],
          [
            "Asignación familiar",
            "10 % de la RMV (=REDONDEAR(RMV*0,10;2) = S/ 123,00)",
            "Ley 25129",
          ],
          [
            "EsSalud (aporte empleador)",
            "9 % sobre remuneración asegurable (mínimo sobre RMV)",
            "Ley 26790 / sunat.gob.pe",
          ],
          [
            "ONP (descuento trabajador)",
            "13 % sobre remuneración asegurable",
            "D.L. 19990 / sunat.gob.pe",
          ],
          [
            "AFP (aporte + seguro + comisión)",
            "Tabla por AFP (10 % fondo + prima seguro + comisión)",
            "sbs.gob.pe",
          ],
        ],
      },
    },
    {
      id: "calculo-mensual-ingresos-descuentos",
      titulo: "2. Calcular ingresos, descuentos de AFP/ONP y aporte a EsSalud",
      esPasoHowTo: true,
      resumenHowTo:
        "Calcula el total de ingresos afectos, aplica el descuento de ONP (13 %) o AFP según afiliación y determina el aporte patronal a EsSalud (9 %).",
      parrafos: [
        "En la hoja Planilla_Mensual, cada fila representa a un trabajador en el mes. Primero determinas los ingresos remunerativos (sueldo básico proporcional a los días trabajados, asignación familiar, horas extras, comisiones o bonos regulares) y los separas en una columna de Total Remuneración Afecta.",
        "Sobre esa base afectable aplicas el descuento previsional: si el trabajador pertenece al Sistema Nacional de Pensiones (ONP), se retiene el 13 %; si está en una AFP, buscas en tu tabla de Parametros el porcentaje total correspondiente (aporte obligatorio del 10 %, prima de seguro con tope y comisión sobre flujo o mixta según corresponda). El aporte de EsSalud (9 %) no se descuenta al trabajador: lo asume el empleador.",
      ],
      codigos: [
        {
          titulo: "Cálculo condicional de descuento previsional (ONP 13 % o tabla AFP)",
          lenguaje: "excel",
          codigo: `=SI(D2="ONP"; REDONDEAR(G2*Parametros!$B$6; 2); REDONDEAR(G2*0,10 + MIN(G2;Parametros!$B$8)*INDICE(Parametros!$C$12:$C$15;COINCIDIR(D2;Parametros!$A$12:$A$15;0)) + G2*INDICE(Parametros!$D$12:$D$15;COINCIDIR(D2;Parametros!$A$12:$A$15;0)); 2))`,
          codigoEn: `=IF(D2="ONP", ROUND(G2*Parametros!$B$6, 2), ROUND(G2*0.10 + MIN(G2,Parametros!$B$8)*INDEX(Parametros!$C$12:$C$15,MATCH(D2,Parametros!$A$12:$A$15,0)) + G2*INDEX(Parametros!$D$12:$D$15,MATCH(D2,Parametros!$A$12:$A$15,0)), 2))`,
          nota: "D2 = Sistema previsional ('ONP' o nombre de la AFP); G2 = Remuneración afecta; Parametros!$B$6 = 13 %; Parametros!$B$8 = Remuneración máxima asegurable de prima de seguro; columnas C y D = prima y comisión por AFP.",
        },
      ],
    },
    {
      id: "quinta-categoria-y-boleta",
      titulo: "3. Integrar la renta de quinta categoría y generar la boleta de pago",
      esPasoHowTo: true,
      resumenHowTo:
        "Conecta la proyección anual de quinta categoría por tramos UIT y extrae los montos de cada trabajador hacia una boleta imprimible.",
      parrafos: [
        "Si la remuneración anual proyectada del trabajador (incluyendo sueldos, gratificaciones y otros ingresos gravados) supera las 7 UIT, corresponde calcular y retener mensualmente el Impuesto a la Renta de Quinta Categoría por tramos progresivos (8 %, 14 %, 17 %, 20 % y 30 %). Para implementar el cálculo paso a paso con el valor de la UIT vigente, sigue la guía de [renta de quinta categoría en Excel](/pe/guias/renta-quinta-categoria-excel).",
        "Con todos los ingresos, descuentos previsionales, retención de quinta categoría y aportes del empleador cerrados en Planilla_Mensual, solo necesitas una hoja de presentación que lea la fila del trabajador seleccionado por DNI o código. Revisa el paso a paso completo en la guía de [boleta de pago en Excel](/pe/guias/boleta-de-pago-excel), cuya plantilla reutilizable puedes descargar al final de esta página.",
      ],
    },
    {
      id: "gratificacion-y-cts-semestral",
      titulo: "4. Conectar los beneficios semestrales: gratificaciones y CTS",
      esPasoHowTo: true,
      resumenHowTo:
        "Provisiona mensualmente la gratificación y la CTS y ejecuta el cálculo exacto en los meses de depósito obligatorio.",
      parrafos: [
        "Una planilla peruana ordenada no espera a julio, diciembre, mayo o noviembre para calcular beneficios: provisiona mes a mes y liquida en la fecha legal correspondiente. Cada beneficio tiene reglas propias de cómputo y plazos máximos en la Ley 27735 y el D.S. 001-97-TR.",
        "Para las gratificaciones legales de Fiestas Patrias (plazo 15 de julio) y Navidad (plazo 15 de diciembre), sigue la guía de [cómo calcular gratificación en Excel](/pe/guias/calcular-gratificacion-excel), donde se detalla el cómputo por meses calendario completos y la bonificación extraordinaria del 9 % (EsSalud) o 6,75 % (EPS). Para los depósitos semestrales de Compensación por Tiempo de Servicios (15 de mayo y 15 de noviembre), revisa la guía de [cómo calcular CTS en Excel](/pe/guias/calcular-cts-excel), que incluye el sexto de la última gratificación.",
      ],
    },
    {
      id: "ceses-y-liquidacion-beneficios",
      titulo: "5. Gestionar ceses: gratificación trunca y liquidación en 48 horas",
      esPasoHowTo: true,
      resumenHowTo:
        "Cuando un trabajador cesa, consolida gratificación trunca, CTS trunca y vacaciones truncas en la hoja de liquidación.",
      parrafos: [
        "Cuando termina el vínculo laboral antes de la oportunidad de pago ordinaria, la empresa dispone de 48 horas para pagar la liquidación completa de beneficios sociales. Esto implica cerrar el sueldo proporcional de los días trabajados del último mes y calcular tres bloques truncos con reglas distintas.",
        "Primero, calcula la [gratificación trunca en Excel](/pe/guias/gratificacion-trunca-excel), que se mide únicamente por meses calendario completos laborados (1/6 por mes más bonificación del 9 % o 6,75 %). Luego consolida la CTS trunca y las vacaciones truncas (que sí prorratean meses y días calendario) siguiendo la guía de [liquidación de beneficios sociales en Excel](/pe/guias/liquidacion-beneficios-sociales-excel).",
      ],
      tabla: {
        caption: "Mapa completo de guías satélites de planilla peruana en Excel",
        encabezados: [
          "Proceso en planilla",
          "Cuándo se usa",
          "Guía paso a paso en ProgramBI",
        ],
        filas: [
          [
            "Boleta de pago mensual",
            "Todos los meses al cierre de nómina",
            "[Boleta de pago en Excel](/pe/guias/boleta-de-pago-excel)",
          ],
          [
            "Renta de quinta categoría",
            "Retención mensual por tramos UIT",
            "[Renta de quinta categoría en Excel](/pe/guias/renta-quinta-categoria-excel)",
          ],
          [
            "Gratificación ordinaria",
            "Julio (15 jul) y diciembre (15 dic)",
            "[Cómo calcular gratificación en Excel](/pe/guias/calcular-gratificacion-excel)",
          ],
          [
            "Gratificación trunca",
            "Cese antes del 15 jul o 15 dic",
            "[Gratificación trunca en Excel](/pe/guias/gratificacion-trunca-excel)",
          ],
          [
            "CTS semestral",
            "Mayo (15 may) y noviembre (15 nov)",
            "[Cómo calcular CTS en Excel](/pe/guias/calcular-cts-excel)",
          ],
          [
            "Liquidación de beneficios",
            "Dentro de las 48 h posteriores al cese",
            "[Liquidación de beneficios sociales en Excel](/pe/guias/liquidacion-beneficios-sociales-excel)",
          ],
        ],
      },
    },
  ],
  erroresComunes: [
    {
      error: "Escribir tasas de AFP, RMV o UIT fijas dentro de las fórmulas",
      causa:
        "Copiar fórmulas de un mes a otro con porcentajes escritos manualmente en cada celda.",
      solucion:
        "Centraliza todas las tasas y topes en la hoja Parametros y enlázalas con referencias absolutas ($).",
    },
    {
      error: "Aplicar descuentos de AFP u ONP sobre conceptos no remunerativos o gratificaciones",
      causa:
        "Sumar todos los ingresos en una sola columna sin distinguir base afecta de conceptos inafectos.",
      solucion:
        "Separa ingresos afectos, ingresos inafectos (como movilidad supeditada o gratificación bajo Ley 30334) y base de quinta categoría en columnas distintas.",
    },
    {
      error: "Calcular la gratificación trunca por días en lugar de meses completos",
      causa:
        "Usar la misma fórmula de prorrateo de días de la CTS y vacaciones truncas para la gratificación.",
      solucion:
        "Aplica la regla de meses calendario completos (sextos) exclusivamente para la gratificación trunca y el prorrateo por meses y días para CTS y vacaciones.",
    },
  ],
  plantilla: {
    titulo: "Plantilla base de Boleta y Planilla en Excel (Perú 2026)",
    descripcion:
      "Descarga el archivo .xlsx con la estructura de boleta de pago mensual, hoja Parametros, cálculo de aportes/descuentos y base conectable con tus hojas de gratificación, CTS y liquidación.",
  },
  plantillaArchivo: {
    recurso: "boleta-de-pago-peru-2026",
    archivoUrl: "/pe/plantillas/boleta-de-pago-peru-2026.xlsx",
    nombreArchivo: "boleta-de-pago-peru-2026.xlsx",
  },
  faqs: [
    {
      q: "¿Qué hojas debe tener una planilla de sueldos bien estructurada en Excel?",
      a: "Como mínimo cinco hojas: Parametros (RMV, UIT, EsSalud, ONP y tasas AFP), Trabajadores (maestro de personal), Planilla_Mensual (ingresos, descuentos y neto), Beneficios_Semestrales (gratificación y CTS) y Boleta (formato individual).",
    },
    {
      q: "¿Cuál es la Remuneración Mínima Vital vigente en Perú para calcular la asignación familiar?",
      a: "Desde el 1 de octubre de 2026 rige la RMV de S/ 1.230 según el D.S. N.° 015-2026-TR (gob.pe/mtpe), por lo que la asignación familiar equivalente al 10 % es de S/ 123,00.",
    },
    {
      q: "¿La gratificación y la CTS tienen los mismos descuentos que el sueldo mensual?",
      a: "No. La gratificación y su bonificación extraordinaria (9 % o 6,75 %) están inafectas a AFP, ONP y EsSalud, aunque sí integran la proyección de quinta categoría. La CTS tampoco está afecta a descuentos previsionales ni a quinta categoría.",
    },
    {
      q: "¿Dónde puedo aprender a automatizar planillas y reportes en Excel en vivo?",
      a: "En el curso de Excel de ProgramBI para Perú trabajamos fórmulas lógicas, búsqueda avanzada, tablas dinámicas y estructuración de libros empresariales en clases en vivo.",
    },
  ],
  relacionadas: [
    "calcular-gratificacion-excel",
    "gratificacion-trunca-excel",
    "boleta-de-pago-excel",
  ],
  enlacesExternos: [
    {
      label: "Normativa laboral y RMV vigente en Perú",
      url: "https://www.gob.pe/mtpe",
      fuente: "Ministerio de Trabajo y Promoción del Empleo (MTPE)",
    },
    {
      label: "Comisiones y primas de seguro del Sistema Privado de Pensiones",
      url: "https://www.sbs.gob.pe/",
      fuente: "Superintendencia de Banca, Seguros y AFP (SBS)",
    },
    {
      label: "Tabla de UIT, quinta categoría y tributos laborales (PLAME)",
      url: "https://www.sunat.gob.pe/",
      fuente: "SUNAT",
    },
  ],
  enlacesInternosExtra: [
    {
      label: "Cómo calcular la gratificación de diciembre 2026 en Excel",
      href: "/pe/guias/calcular-gratificacion-excel",
      descripcion: "Cálculo semestral ordinario, bonificación 9 % / 6,75 % y plazo 15 de diciembre.",
    },
    {
      label: "Cómo calcular la gratificación trunca en Excel",
      href: "/pe/guias/gratificacion-trunca-excel",
      descripcion: "Sextos por mes calendario completo en ceses laborales y pago en 48 horas.",
    },
    {
      label: "Cómo calcular la CTS en Excel",
      href: "/pe/guias/calcular-cts-excel",
      descripcion: "Cómputo de mayo y noviembre con inclusión de 1/6 de gratificación.",
    },
    {
      label: "Boleta de pago en Excel (Perú)",
      href: "/pe/guias/boleta-de-pago-excel",
      descripcion: "Genera boletas mensuales individuales conectadas a tu planilla.",
    },
    {
      label: "Renta de quinta categoría en Excel",
      href: "/pe/guias/renta-quinta-categoria-excel",
      descripcion: "Proyección anual por tramos de UIT y retención mensual.",
    },
    {
      label: "Liquidación de beneficios sociales en Excel",
      href: "/pe/guias/liquidacion-beneficios-sociales-excel",
      descripcion: "Cálculo integral de cese dentro de las 48 horas legales.",
    },
    {
      label: "Curso de Excel en vivo (Perú)",
      href: "/pe/cursos/excel",
      descripcion: "Aprende fórmulas laborales, tablas dinámicas y automatización de planillas.",
    },
  ],
};

export default guia;
