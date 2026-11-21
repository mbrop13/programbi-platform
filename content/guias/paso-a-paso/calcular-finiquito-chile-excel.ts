import type { GuiaPasoAPaso } from "@/lib/guias/paso-a-paso-tipos";

export const guia: GuiaPasoAPaso = {
  slug: "calcular-finiquito-chile-excel",
  title: "Cómo calcular un finiquito en Chile con Excel (paso a paso)",
  meta: "Calcula un finiquito en Chile con Excel: indemnización por años de servicio, vacaciones proporcionales y aviso previo según causal, con fuentes oficiales.",
  h1: "Cómo calcular un finiquito en Chile usando Excel",
  subtitle:
    "Construye una planilla ordenada en Excel con hoja Parametros, tope en UF mediante MIN, años de servicio con SIFECHA, vacaciones proporcionales parametrizadas y aviso previo según la causal de término, siempre alineado con criterios de la Dirección del Trabajo.",
  keywordPrincipal: "calcular finiquito chile",
  keywords: [
    "calcular finiquito chile",
    "calcular finiquito en Excel",
    "indemnización por años de servicio Excel",
    "vacaciones proporcionales Excel Chile",
  ],
  curso: "excel",
  herramienta: "Excel",
  nivel: "Intermedio",
  updated: "2026-11-21",
  published: "2026-11-21",
  totalTimeIso: "PT35M",
  en30Segundos: {
    queLogras:
      "Un modelo de Excel con dos hojas (Parametros y Finiquito) que determina automáticamente si corresponde indemnización por años de servicio y aviso previo según la causal, aplica el tope legal en UF, calcula feriado proporcional y consolida el total a pagar.",
    herramienta: "Microsoft Excel (365, 2021, 2019 o Excel Web)",
    tiempo: "35 minutos",
    bullets: [
      "Tabla comparativa de qué conceptos aplican según causal de término (Art. 159, 160 y 161 del Código del Trabajo).",
      "Hoja Parametros con fecha de vigencia, valor UF referencial y topes editables sin fijar números dentro de fórmulas.",
      "Cálculo de años indemnizables con SIFECHA/DATEDIF y regla de fracción superior a 6 meses.",
      "Fórmulas parametrizadas en español (;) e inglés (,) para vacaciones proporcionales, aviso previo y planilla resumen.",
    ],
  },
  rutaVisual: [
    {
      numero: 1,
      titulo: "Causales y conceptos",
      resumen: "Distingue cuándo aplican años de servicio, aviso previo y feriado.",
      anchorId: "conceptos-segun-causal",
      icono: "shield",
    },
    {
      numero: 2,
      titulo: "Hoja Parametros",
      resumen: "Centraliza valor UF referencial, topes y factor mensual de feriado.",
      anchorId: "hoja-parametros-uf",
      icono: "database",
    },
    {
      numero: 3,
      titulo: "Base y tope UF",
      resumen: "Calcula la última remuneración con tope de 90 UF usando MIN.",
      anchorId: "base-calculo-tope-uf",
      icono: "settings",
    },
    {
      numero: 4,
      titulo: "Años de servicio",
      resumen: "Modela antigüedad con SIFECHA, fracción >6 meses y tope de 11 años.",
      anchorId: "indemnizacion-anos-servicio",
      icono: "code",
    },
    {
      numero: 5,
      titulo: "Vacaciones y aviso",
      resumen: "Calcula feriado proporcional y sustitutiva de aviso previo.",
      anchorId: "vacaciones-proporcionales",
      icono: "calendar",
    },
    {
      numero: 6,
      titulo: "Resumen y respaldo",
      resumen: "Consolida haberes, descuentos y revisa el aviso legal obligatorio.",
      anchorId: "planilla-resumen",
      icono: "check",
    },
  ],
  requisitos: {
    version: "Excel 365, Excel 2021, Excel 2019 o Excel para la Web (SIFECHA funciona en todas las versiones)",
    lista: [
      "Microsoft Excel en Windows, macOS o versión Web.",
      "Fechas de inicio y término del contrato, causal invocada y liquidaciones recientes del trabajador (datos ficticios si estás practicando).",
      "Valor de la UF vigente para el cálculo y revisión de criterios vigentes en la Dirección del Trabajo (dt.gob.cl) y Código del Trabajo (bcn.cl).",
    ],
    compatibilidadMacWeb:
      "Las funciones SI, MIN, Y, O, REDONDEAR y SIFECHA (DATEDIF en inglés) funcionan igual en Windows, macOS y Excel para la Web. Recuerda que SIFECHA no aparece en el autocompletado de Excel, pero sigue operando normalmente al escribirla completa.",
    avisoEducativo:
      "Guía educativa de modelado en Excel; no constituye asesoría legal. Verifica siempre las causales, topes en UF y criterios vigentes en la Dirección del Trabajo (dt.gob.cl) antes de emitir o firmar un finiquito real.",
  },
  herramientasHowTo: [
    "Microsoft Excel",
    "Portal Dirección del Trabajo (dt.gob.cl)",
    "Biblioteca del Congreso Nacional (bcn.cl)",
  ],
  insumosHowTo: [
    "Fecha de ingreso, fecha de término y causal de término de contrato",
    "Valor UF referencial y últimas remuneraciones mensuales",
  ],
  secciones: [
    {
      id: "conceptos-segun-causal",
      titulo: "Conceptos según la causal de término en Chile",
      parrafos: [
        "Antes de escribir una sola fórmula en Excel, es indispensable comprender que en Chile el monto de un finiquito depende directamente de la causal legal de término de contrato establecida en el Código del Trabajo (consultable en la Biblioteca del Congreso Nacional, https://www.bcn.cl) y de los criterios de la Dirección del Trabajo (https://www.dt.gob.cl).",
        "No todas las causales dan derecho a indemnización por años de servicio ni a indemnización sustitutiva del aviso previo. Sin embargo, las vacaciones (feriado) proporcionales devengadas y no utilizadas, así como los días trabajados del último mes que no hayan sido pagados, corresponden en prácticamente todo término de contrato. La siguiente tabla resume los casos más frecuentes para que tu planilla de Excel no pague de más ni omita conceptos obligatorios:",
      ],
      tabla: {
        caption: "Conceptos habituales del finiquito según causal (verificar siempre caso particular en dt.gob.cl y bcn.cl)",
        encabezados: [
          "Causal frecuente",
          "Artículo ref.",
          "Vacaciones proporcionales",
          "Indemnización años de servicio",
          "Aviso previo (si no se dio con 30 días)",
        ],
        filas: [
          [
            "Renuncia voluntaria",
            "Art. 159 N° 2",
            "Sí, siempre que existan días pendientes",
            "No corresponde por ley",
            "No corresponde",
          ],
          [
            "Mutuo acuerdo de las partes",
            "Art. 159 N° 1",
            "Sí",
            "Solo si se pacta expresamente",
            "No corresponde salvo pacto",
          ],
          [
            "Vencimiento del plazo convenido",
            "Art. 159 N° 4",
            "Sí",
            "No corresponde por ley",
            "No corresponde",
          ],
          [
            "Necesidades de la empresa",
            "Art. 161 inc. 1",
            "Sí",
            "Sí (si lleva ≥ 1 año, máx. 11 años salvo pacto)",
            "Sí, si no se avisó con al menos 30 días de anticipación",
          ],
          [
            "Causales imputables al trabajador",
            "Art. 160",
            "Sí",
            "No corresponde",
            "No corresponde",
          ],
        ],
      },
      alerta: {
        tipo: "warning",
        titulo: "Verifica particularidades del contrato antes de calcular",
        texto: "Existen excepciones y reglas específicas (por ejemplo, contratos anteriores al 14 de agosto de 1981 sin tope de 11 años, indemnizaciones a todo evento pactadas, feriado progresivo o descuento de aporte del empleador al Seguro de Cesantía en Art. 161). Confirma siempre en dt.gob.cl y bcn.cl.",
      },
    },
    {
      id: "hoja-parametros-uf",
      titulo: "Hoja Parametros: centraliza UF, topes y factores verificables",
      esPasoHowTo: true,
      resumenHowTo:
        "Crea una hoja llamada Parametros donde registres la fecha de cálculo, el valor UF referencial, los topes legales parametrizados y los factores de feriado.",
      parrafos: [
        "La regla de oro de una buena planilla laboral en Excel es no escribir jamás valores legales ni tasas fijas dentro de las fórmulas. Si mañana cambia la UF o necesitas ajustar un parámetro según contrato colectivo, editarás una celda en `Parametros` y toda la planilla se recalculará limpiamente.",
        "Crea una hoja llamada `Parametros` con una tabla ordenada de clave, valor y nota de verificación en DT/BCN:",
      ],
      lista: [
        "`B2` — `Fecha_Vigencia_Parametros`: fecha de consulta del cálculo (ej. `21-11-2026`).",
        "`B3` — `Valor_UF_Referencial`: valor de la UF del último día del mes anterior o de la fecha que corresponda según criterio vigente (consulta el valor oficial diario del SII / Banco Central antes de emitir un finiquito real).",
        "`B4` — `Tope_Base_UF`: `90` (tope de última remuneración mensual para indemnizaciones según Art. 172 del Código del Trabajo; verifica en bcn.cl si aplica al caso).",
        "`B5` — `Tope_Anos_Servicio`: `11` (máximo legal de años indemnizables según Art. 163 para contratos vigentes posteriores al 14 de agosto de 1981, salvo pacto superior).",
        "`B6` — `Dias_Feriado_Anual`: `15` (días hábiles de feriado básico anual; ajusta si el trabajador tiene feriado progresivo o régimen especial en su contrato).",
        "`B7` — `Dias_Mes_Referencia`: `30` (divisor mensual estándar para valor día en remuneración mensual).",
      ],
      captura: {
        id: "calcular-finiquito-chile-excel-paso-1",
        alt: "Hoja Parametros en Excel con fecha de vigencia, valor UF referencial, tope 90 UF, tope 11 años y días de feriado anual",
        caption: "Hoja Parametros centralizando indicadores y topes legales editables con notas de fuente oficial.",
        ratio: "16/9",
      },
    },
    {
      id: "base-calculo-tope-uf",
      titulo: "Base de cálculo y tope en UF con la función MIN",
      esPasoHowTo: true,
      resumenHowTo:
        "Calcula la última remuneración mensual para indemnizaciones y aplica el tope de 90 UF en pesos chilenos usando la función MIN.",
      parrafos: [
        "En la segunda hoja, llamada `Finiquito`, organiza primero el bloque de antecedentes del trabajador: nombre o código (`C3`), fecha de ingreso (`C4`), fecha de término (`C5`), causal de término (`C6`, idealmente con validación de datos tipo lista desplegable usando exactamente los nombres de tu tabla de causales), si hubo aviso con 30 días (`C7`: `\"Sí\"` o `\"No\"`) y la remuneración base para indemnización (`C8`).",
        "Recuerda que conforme al artículo 172 del Código del Trabajo y la jurisprudencia de la Dirección del Trabajo, la base de cálculo de la indemnización por años de servicio y aviso previo no es necesariamente idéntica a la base de vacaciones proporcionales: por ejemplo, en remuneraciones variables se promedian los últimos tres meses, y se excluyen horas extraordinarias o asignaciones esporádicas. Por eso conviene mantener celdas separadas para `Base_Indemnizacion_Bruta` (`C8`) y `Base_Vacaciones_Diaria` (`C9`).",
        "Para aplicar el tope de 90 UF en pesos chilenos sobre `Base_Indemnizacion_Bruta`, usa la función `MIN` multiplicando el tope UF por el valor de la UF en `Parametros`:",
      ],
      codigos: [
        {
          titulo: "Fórmula Excel — Tope de base indemnizable en UF (en celda C10)",
          lenguaje: "excel",
          codigo: `=REDONDEAR(MIN(C8; Parametros!$B$4 * Parametros!$B$3); 0)`,
          codigoEn: `=ROUND(MIN(C8, Parametros!$B$4 * Parametros!$B$3), 0)`,
          nota: "Limita la base mensual al equivalente en pesos de 90 UF (Parametros!B4 * Parametros!B3) y redondea a entero.",
        },
      ],
    },
    {
      id: "indemnizacion-anos-servicio",
      titulo: "Indemnización por años de servicio (SIFECHA y fracción > 6 meses)",
      esPasoHowTo: true,
      resumenHowTo:
        "Calcula años completos y meses adicionales con SIFECHA, aplica la regla de fracción superior a 6 meses y respeta el tope de 11 años solo cuando la causal corresponde.",
      parrafos: [
        "Para que la indemnización por años de servicio sea transparente y fácil de auditar ante una revisión, divide el cálculo en tres celdas visibles en tu hoja `Finiquito`:",
        "Primero, calcula los años completos transcurridos entre `Fecha_Ingreso` (`C4`) y `Fecha_Termino` (`C5`) con `SIFECHA(C4; C5; \"Y\")`, y los meses sobrantes después del último año completo con `SIFECHA(C4; C5; \"YM\")` (más los días sobrantes con `\"MD\"` si quieres verificar exactamente cuándo se supera el umbral de 6 meses y 1 día). Según la regla general del Art. 163, si el trabajador tiene al menos 1 año de servicio y una fracción superior a 6 meses (por ejemplo, 2 años, 6 meses y 1 día), la fracción se aproxima al año siguiente.",
        "Segundo, aplica el tope de 11 años (`Parametros!$B$5`) con `MIN`. Tercero, multiplica los años indemnizables por la base topada (`C10`) únicamente si la causal en `C6` es `" + `"Necesidades de la empresa"` + "` (Art. 161).",
      ],
      codigos: [
        {
          titulo: "Fórmulas Excel — Antigüedad, años indemnizables (fracción > 6 meses) y monto",
          lenguaje: "excel",
          codigo: `// Celda C12: Años completos
=SIFECHA(C4; C5; "Y")

// Celda C13: Meses adicionales y días (para verificar si supera 6 meses exactos)
=SIFECHA(C4; C5; "YM")

// Celda C14: Días adicionales tras el último mes completo
=SIFECHA(C4; C5; "MD")

// Celda C15: Años indemnizables (exige >= 1 año completo; suma 1 si fracción > 6 meses; tope 11 años)
=SI(C12 < 1; 0; MIN(C12 + SI(O(C13 > 6; Y(C13 = 6; C14 > 0)); 1; 0); Parametros!$B$5))

// Celda C16: Monto Indemnización por Años de Servicio según causal
=SI(C6 = "Necesidades de la empresa (Art. 161)"; C15 * C10; 0)`,
          codigoEn: `// Cell C12: Full years
=DATEDIF(C4, C5, "Y")

// Cell C13: Remaining months
=DATEDIF(C4, C5, "YM")

// Cell C14: Remaining days
=DATEDIF(C4, C5, "MD")

// Cell C15: Indemnifiable years (requires >= 1 full year; +1 if fraction > 6 months; capped at 11)
=IF(C12 < 1, 0, MIN(C12 + IF(OR(C13 > 6, AND(C13 = 6, C14 > 0)), 1, 0), Parametros!$B$5))

// Cell C16: Severance amount by termination cause
=IF(C6 = "Necesidades de la empresa (Art. 161)", C15 * C10, 0)`,
          nota: "Verifica siempre en dt.gob.cl si el trabajador tiene pacto individual o colectivo que supere el tope de 11 años o contrato previo a agosto de 1981.",
        },
      ],
      captura: {
        id: "calcular-finiquito-chile-excel-paso-2",
        alt: "Bloque de cálculo de antigüedad con SIFECHA, meses, días y años indemnizables con tope de 11 años en Excel",
        caption: "Desglose auditado de años completos, fracción superior a 6 meses y monto por años de servicio.",
        ratio: "16/9",
      },
    },
    {
      id: "vacaciones-proporcionales",
      titulo: "Vacaciones proporcionales (feriado proporcional parametrizado)",
      esPasoHowTo: true,
      resumenHowTo:
        "Calcula los días hábiles devengados desde la fecha de ingreso o última anualidad, descuenta los días tomados y proyecta los días corridos en el calendario.",
      parrafos: [
        "El cálculo de las vacaciones proporcionales tiene un detalle clave en la normativa chilena (criterio oficial de la Dirección del Trabajo en dt.gob.cl): primero se determinan los días hábiles de feriado devengados a razón de `1,25` días hábiles por mes trabajado (`15 días hábiles / 12 meses`, parametrizados desde `Parametros!$B$6 / 12`) más la proporción de días del mes incompleto, restando los días hábiles ya tomados por el trabajador.",
        "Luego —y este es el paso que muchos olvidan en planillas caseras— esos días hábiles pendientes se cuentan en el calendario a partir del día hábil siguiente al término del contrato, sumando los sábados, domingos y festivos comprendidos en ese período para obtener el total de días corridos a pagar según remuneración diaria. Para mantener la planilla parametrizada y transparente sin depender de tablas externas de feriados locales, deja una celda de entrada explícita para `Dias_Inhabiles_Periodo_Proyectado` (`C20`, verificables en el calendario oficial desde el día siguiente al término) o usa `DIA.LAB` si cargas tu lista de feriados en `Parametros`.",
      ],
      codigos: [
        {
          titulo: "Fórmulas Excel — Feriado proporcional parametrizado (días hábiles y monto)",
          lenguaje: "excel",
          codigo: `// Celda C18: Días hábiles devengados (meses totales * factor + proporción de días restantes sobre 30)
=REDONDEAR(((SIFECHA(C4; C5; "M") + SIFECHA(C4; C5; "MD") / Parametros!$B$7) * (Parametros!$B$6 / 12)) - C17; 2)

// Donde C17 = Días hábiles de vacaciones ya utilizados durante el contrato
// Celda C21: Total días corridos a pagar (días hábiles pendientes C18 + días inhábiles/festivos proyectados C20)
=MAX(0; C18) + C20

// Celda C22: Monto Vacaciones Proporcionales (Valor día = Base_Vacaciones / 30)
=REDONDEAR(C21 * (C9 / Parametros!$B$7); 0)`,
          codigoEn: `// Cell C18: Accrued business days
=ROUND(((DATEDIF(C4, C5, "M") + DATEDIF(C4, C5, "MD") / Parametros!$B$7) * (Parametros!$B$6 / 12)) - C17, 2)

// Where C17 = Business days of vacation already taken
// Cell C21: Total calendar days to pay (pending business days C18 + projected weekend/holiday days C20)
=MAX(0, C18) + C20

// Cell C22: Proportional vacation payout
=ROUND(C21 * (C9 / Parametros!$B$7), 0)`,
          nota: "Confirma siempre en dt.gob.cl la base de remuneración íntegra aplicable a feriado proporcional y el conteo exacto de sábados, domingos y feriados desde el día siguiente al término.",
        },
      ],
    },
    {
      id: "aviso-previo",
      titulo: "Indemnización sustitutiva del aviso previo",
      parrafos: [
        "Cuando el empleador invoca la causal de necesidades de la empresa (Art. 161) y no entrega la carta de aviso con al menos 30 días de anticipación, debe pagar una indemnización sustitutiva equivalente a la última remuneración mensual devengada, sujeta igualmente al tope de 90 UF (`C10`).",
        "En Excel se resuelve con una condición `SI` combinando la causal (`C6`) y el indicador de si se otorgó aviso previo con 30 días (`C7`):",
      ],
      codigos: [
        {
          titulo: "Fórmula Excel — Indemnización sustitutiva del aviso previo (en celda C24)",
          lenguaje: "excel",
          codigo: `=SI(Y(C6 = "Necesidades de la empresa (Art. 161)"; C7 = "No"); C10; 0)`,
          codigoEn: `=IF(AND(C6 = "Necesidades de la empresa (Art. 161)", C7 = "No"), C10, 0)`,
          nota: "Solo paga 1 mes de base topada si la causal es Art. 161 y no hubo aviso con 30 días de anticipación.",
        },
      ],
    },
    {
      id: "planilla-resumen",
      titulo: "Armar la planilla resumen del finiquito",
      esPasoHowTo: true,
      resumenHowTo:
        "Consolida en un cuadro resumen los haberes (días trabajados pendientes, vacaciones proporcionales, años de servicio y aviso previo) menos eventuales descuentos autorizados.",
      parrafos: [
        "En la parte inferior o derecha de la hoja `Finiquito`, crea un cuadro resumen limpio con formato de moneda chilena (`$ #,##0`) que sume todos los haberes devengados y reste únicamente los descuentos legales o autorizados que correspondan (por ejemplo, días trabajados del último mes ya pagados en liquidación o saldo de préstamos autorizados, o el eventual descuento de aporte del empleador al Seguro de Cesantía cuando aplique según el Art. 13 de la Ley N° 19.728, validado caso a caso).",
        "Verifica que cada fila del resumen enlace directamente a las celdas calculadas arriba (`=C16`, `=C22`, `=C24`) sin digitar montos manuales encima de fórmulas.",
      ],
      codigos: [
        {
          titulo: "Fórmula Excel — Total líquido estimado del finiquito",
          lenguaje: "excel",
          codigo: `=REDONDEAR(SUMA(C27:C30) - SUMA(C32:C33); 0)`,
          codigoEn: `=ROUND(SUM(C27:C30) - SUM(C32:C33), 0)`,
          nota: "Donde C27:C30 agrupa remuneraciones pendientes, vacaciones proporcionales, años de servicio y aviso previo, y C32:C33 agrupa descuentos procedentes.",
        },
      ],
      captura: {
        id: "calcular-finiquito-chile-excel-paso-3",
        alt: "Planilla resumen de finiquito en Excel con desglose de haberes, descuentos y total a pagar en pesos chilenos",
        caption: "Cuadro resumen final de finiquito enlazado a la hoja Parametros y al bloque de cálculo.",
        ratio: "16/9",
      },
    },
    {
      id: "aviso-legal",
      titulo: "Aviso legal y verificación en fuentes oficiales",
      parrafos: [
        "Esta guía tiene un propósito estrictamente educativo orientado al modelado de fórmulas en Excel. No constituye asesoría jurídica, laboral ni tributaria. La legislación laboral chilena contempla matices por tipo de jornada, remuneraciones variables, fuero, feriado progresivo, semanas corridas y criterios administrativos que deben revisarse caso a caso.",
        "Antes de emitir, aprobar o firmar un finiquito real (incluyendo su ratificación electrónica en el portal Mi DT), contrasta siempre tus cifras con el texto vigente del Código del Trabajo en la Biblioteca del Congreso Nacional (`https://www.bcn.cl`) y las orientaciones o simuladores oficiales de la Dirección del Trabajo (`https://www.dt.gob.cl`).",
      ],
    },
  ],
  erroresComunes: [
    {
      error: "Pagar vacaciones proporcionales multiplicando solo los días hábiles sin proyectar los inhábiles",
      causa: "Se multiplica `1,25 × meses` directamente por el valor diario, olvidando sumar sábados, domingos y festivos que caerían durante el descanso proyectado.",
      solucion: "Proyecta los días hábiles pendientes en el calendario desde el día hábil siguiente al término y suma los días inhábiles del intervalo antes de multiplicar por el valor día.",
    },
    {
      error: "Aplicar el redondeo de fracción > 6 meses cuando el trabajador lleva menos de 1 año",
      causa: "Se usa `REDONDEAR` sobre años decimales sin validar primero que `SIFECHA(...; \"Y\") >= 1`, otorgando 1 año de indemnización a quien trabajó 7 meses.",
      solucion: "Incluye siempre la condición `SI(C12 < 1; 0; ...)` para exigir al menos un año completo de servicio continuo antes de activar la regla de fracción superior a 6 meses.",
    },
    {
      error: "Olvidar el tope de 90 UF o usar el valor UF de un mes incorrecto",
      causa: "Se multiplica la última remuneración bruta sin `MIN(..., 90 * UF)` en sueldos altos.",
      solucion: "Aplica `MIN(Base; Parametros!$B$4 * Parametros!$B$3)` y documenta la fecha de la UF consultada en `Parametros`.",
    },
    {
      error: "Error #¡VALOR! al usar SIFECHA porque la fecha de término es menor que la de ingreso",
      causa: "Error de digitación en las fechas o formato de fecha interpretado como texto por configuración regional.",
      solucion: "Aplica validación de datos en `Fecha_Termino` (`>= Fecha_Ingreso`) y envuelve el cálculo en `SI(C5 < C4; \"Revisar fechas\"; ...)`.",
    },
  ],
  plantilla: {
    titulo: "Próximamente: plantilla de finiquito parametrizada en Excel",
    descripcion:
      "Incluirá las hojas Parametros y Finiquito listas para completar con validación de causales, control de topes en UF y formato imprimible.",
  },
  faqs: [
    {
      q: "¿Siempre se pagan las vacaciones proporcionales en un finiquito en Chile?",
      a: "Sí. Si el trabajador generó días de feriado que no alcanzó a usar, el feriado proporcional debe pagarse sin importar si el término fue por renuncia voluntaria, vencimiento de plazo, despido por Art. 160 o necesidades de la empresa.",
    },
    {
      q: "¿Cómo se calcula la fracción superior a 6 meses en Excel?",
      a: "Primero verificas que los años completos (`SIFECHA(inicio; fin; \"Y\")`) sean al menos 1. Luego revisas los meses restantes (`\"YM\"`) y días restantes (`\"MD\"`): si `meses > 6` o (`meses = 6` y `días > 0`), sumas 1 año adicional, respetando el tope máximo de 11 años salvo pacto superior.",
    },
    {
      q: "¿Por qué la fórmula SIFECHA no aparece sugerida al escribirla en Excel?",
      a: "Microsoft mantiene `SIFECHA` (`DATEDIF` en inglés) por compatibilidad con planillas antiguas sin mostrarla en el menú desplegable de autocompletado, pero funciona correctamente en Excel 365, 2021, 2019 y Excel Web al escribirla completa.",
    },
    {
      q: "¿Dónde verifico el valor de la UF y las reglas oficiales vigentes antes de firmar un finiquito?",
      a: "Consulta siempre los criterios laborales y el trámite de Finiquito Electrónico en la Dirección del Trabajo (dt.gob.cl) y los artículos 159 a 177 del Código del Trabajo en la Biblioteca del Congreso Nacional (bcn.cl).",
    },
  ],
  relacionadas: [
    "liquidacion-de-sueldo-en-excel-chile",
    "uf-utm-ipc-en-excel-automatico",
    "funcion-si-excel-varias-condiciones",
  ],
  enlacesExternos: [
    {
      label: "Portal oficial de la Dirección del Trabajo (Finiquito y consultas)",
      url: "https://www.dt.gob.cl",
      fuente: "Dirección del Trabajo",
    },
    {
      label: "Código del Trabajo — Biblioteca del Congreso Nacional (BCN)",
      url: "https://www.bcn.cl/leychile/navegar?idNorma=207436",
      fuente: "BCN Chile",
    },
  ],
};

export default guia;
