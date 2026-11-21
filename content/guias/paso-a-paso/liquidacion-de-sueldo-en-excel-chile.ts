import type { GuiaPasoAPaso } from "@/lib/guias/paso-a-paso-tipos";

export const guia: GuiaPasoAPaso = {
  slug: "liquidacion-de-sueldo-en-excel-chile",
  title: "Liquidación de sueldo en Excel (Chile): cálculo paso a paso",
  meta: "Calcula una liquidación de sueldo en Excel: imponible, AFP, salud, seguro de cesantía e impuesto único, con parámetros vigentes y fuentes oficiales.",
  h1: "Cómo calcular una liquidación de sueldo en Excel (Chile)",
  subtitle:
    "Construye una planilla parametrizada para calcular haberes imponibles y no imponibles, aplicar el tope imponible en UF con MIN, descontar AFP, salud (7 %) y seguro de cesantía, y obtener el Impuesto Único de Segunda Categoría con BUSCARX.",
  keywordPrincipal: "como calcular la liquidacion de sueldo en Chile",
  keywords: [
    "como calcular la liquidacion de sueldo en Chile",
    "liquidacion de sueldo Excel",
    "sueldo liquido Excel",
    "calculo AFP salud impuesto unico Excel",
  ],
  curso: "excel",
  herramienta: "Excel",
  nivel: "Intermedio",
  updated: "2026-11-21",
  published: "2026-11-21",
  totalTimeIso: "PT35M",
  en30Segundos: {
    queLogras:
      "Un libro de Excel con dos hojas (Parametros y Liquidacion) que separa haberes imponibles de no imponibles, aplica topes en UF, calcula descuentos legales y determina el sueldo líquido sin tasas fijas escritas dentro de las fórmulas.",
    herramienta: "Microsoft Excel (365, 2021 o Web)",
    tiempo: "35 minutos",
    bullets: [
      "Hoja Parametros con fecha de vigencia, valor UF/UTM, topes imponibles, tasas AFP y tabla de tramos del SII.",
      "Clasificación clara entre haberes imponibles (sueldo base, gratificación, horas extra) y no imponibles (colación, movilización).",
      "Aplicación de topes imponibles en pesos chilenos usando la función MIN.",
      "Cálculo exacto del Impuesto Único de Segunda Categoría mediante BUSCARX en modo aproximado (-1).",
    ],
  },
  rutaVisual: [
    {
      numero: 1,
      titulo: "Hoja de parámetros",
      resumen: "Centraliza UF, UTM, topes, tasas AFP y tramos SII con fecha de vigencia.",
      anchorId: "hoja-parametros-vigencia",
      icono: "database",
    },
    {
      numero: 2,
      titulo: "Haberes imponibles",
      resumen: "Distingue los montos afectos a cotización de los haberes no imponibles.",
      anchorId: "haberes-imponibles-no-imponibles",
      icono: "table",
    },
    {
      numero: 3,
      titulo: "Tope imponible en UF",
      resumen: "Limita la base de cálculo previsional usando MIN y el valor UF del mes.",
      anchorId: "tope-imponible-uf-min",
      icono: "shield",
    },
    {
      numero: 4,
      titulo: "Descuentos legales",
      resumen: "Calcula AFP, salud (mínimo 7 %) y seguro de cesantía según contrato.",
      anchorId: "descuentos-previsionales",
      icono: "code",
    },
    {
      numero: 5,
      titulo: "Impuesto único",
      resumen: "Determina la base tributable y aplica el tramo UTM con BUSCARX (-1).",
      anchorId: "impuesto-unico-buscarx",
      icono: "settings",
    },
    {
      numero: 6,
      titulo: "Sueldo líquido",
      resumen: "Resta descuentos legales y otros descuentos al total de haberes.",
      anchorId: "calculo-sueldo-liquido",
      icono: "check",
    },
  ],
  requisitos: {
    version: "Excel 365 o Excel 2021 (para BUSCARX con coincidencia exacta o inferior -1); en versiones previas se usa BUSCARV aproximado",
    lista: [
      "Microsoft Excel (Windows, macOS o Excel para la Web).",
      "Indicadores previsionales vigentes del mes consultados en Previred (UF, UTM, topes imponibles, tasas AFP y seguro de cesantía).",
      "Tabla mensual vigente del Impuesto Único de Segunda Categoría consultada en el sitio del Servicio de Impuestos Internos (SII).",
    ],
    compatibilidadMacWeb:
      "Todas las fórmulas usadas (MIN, REDONDEAR, SI, BUSCARX) operan igual en Windows, macOS y Excel Web. En versiones sin BUSCARX (Excel 2016/2019), el tramo de impuesto se resuelve con BUSCARV(...,VERDADERO) o INDICE/COINCIDIR(...,1).",
    avisoEducativo:
      "Guía educativa; verifica los parámetros vigentes antes de emitir o calcular liquidaciones reales.",
  },
  herramientasHowTo: ["Microsoft Excel 365 / 2021 / Web"],
  insumosHowTo: [
    "Indicadores Previsionales mensuales (Previred)",
    "Tabla de Impuesto Único de Segunda Categoría (SII)",
  ],
  secciones: [
    {
      id: "hoja-parametros-vigencia",
      titulo: "1. Crear la hoja Parametros con fecha de vigencia y fuentes oficiales",
      esPasoHowTo: true,
      resumenHowTo:
        "Crea una hoja Parametros que almacene el mes de vigencia, UF, UTM, topes imponibles, tasas AFP y la tabla de tramos del SII en celdas dedicadas.",
      parrafos: [
        "La regla de oro al diseñar una planilla de remuneraciones en Excel es no escribir jamás una tasa porcentual, un tope en UF ni un tramo tributario dentro de una fórmula. En Chile, la UF y la UTM cambian todos los meses, los topes imponibles se reajustan anualmente y las comisiones de las AFP pueden variar. Si dejas los números fijos en las fórmulas, la planilla queda obsoleta al mes siguiente.",
        "Crea una primera hoja llamada Parametros y agrega en la parte superior un bloque de control con la Fecha_Vigencia (ej. 01-11-2026) y las celdas de entrada para: Valor_UF, Valor_UTM, Tope_Imponible_AFP_Salud_UF, Tope_Imponible_AFC_UF, Tasa_Salud_Minima_Legal (0,07 como mínimo legal general del 7 %), Tasa_AFC_Indefinido_Trabajador y Tasa_AFC_Plazo_Fijo_Trabajador.",
        "Debajo de ese bloque, arma dos pequeñas tablas estructuradas: tblAFP (con columnas Nombre_AFP y Tasa_Total_Trabajador, donde ingresas la cotización obligatoria más la comisión vigente de cada AFP según Previred) y tblTramosIUSC (con columnas Desde_UTM, Hasta_UTM, Factor y Rebaja_UTM tomadas de la tabla mensual del SII). Si necesitas consultar UF y UTM actualizadas dentro de tu libro, puedes revisar la sección de indicadores económicos (/datos) de ProgramBI.",
      ],
      tabla: {
        caption: "Estructura de celdas de la hoja Parametros (completar siempre desde fuentes oficiales vigentes)",
        encabezados: [
          "Celda / Bloque",
          "Parámetro",
          "Valor a ingresar en la planilla",
          "Fuente oficial de consulta",
        ],
        filas: [
          [
            "Parametros!B2",
            "Mes / Fecha de vigencia",
            "[Ingresar primer día del mes de cálculo]",
            "Control interno de nómina",
          ],
          [
            "Parametros!B3",
            "Valor UF del cierre de mes",
            "[Ingresar valor vigente según Previred/SII]",
            "SII / Banco Central / Previred",
          ],
          [
            "Parametros!B4",
            "Valor UTM del mes",
            "[Ingresar valor vigente según SII]",
            "Servicio de Impuestos Internos (SII)",
          ],
          [
            "Parametros!B5",
            "Tope imponible AFP y Salud (en UF)",
            "[Ingresar valor vigente según Previred]",
            "Superintendencia de Pensiones / Previred",
          ],
          [
            "Parametros!B6",
            "Tope imponible Seguro de Cesantía (en UF)",
            "[Ingresar valor vigente según Previred]",
            "Superintendencia de Pensiones / Previred",
          ],
          [
            "Parametros!B7",
            "Cotización mínima legal de Salud",
            "7 % (0,07) o plan Isapre pactado si es mayor",
            "Normativa legal / Contrato de salud",
          ],
          [
            "tblAFP",
            "Tasa total por AFP (10 % + comisión)",
            "[Ingresar valor vigente según Previred]",
            "Previred — Indicadores Previsionales",
          ],
          [
            "tblTramosIUSC",
            "Tramos Impuesto Único (Desde_UTM, Factor, Rebaja_UTM)",
            "[Ingresar tabla vigente según SII]",
            "SII — Impuesto Único de Segunda Categoría",
          ],
        ],
      },
      captura: {
        id: "liquidacion-de-sueldo-en-excel-chile-paso-1",
        alt: "Hoja Parametros en Excel con fecha de vigencia, celdas para UF, UTM, topes en UF, tabla tblAFP y tabla tblTramosIUSC del SII",
        caption: "Hoja Parametros centralizada con fecha de vigencia y tablas de referencia.",
        ratio: "16/9",
      },
    },
    {
      id: "haberes-imponibles-no-imponibles",
      titulo: "2. Separar haberes imponibles y no imponibles",
      esPasoHowTo: true,
      resumenHowTo:
        "Organiza la hoja Liquidacion en dos bloques superiores: Total Haberes Imponibles (afectos a descuentos) y Total Haberes No Imponibles (exentos).",
      parrafos: [
        "En una segunda hoja llamada Liquidacion, diseña la ficha del trabajador arriba (Nombre, RUT, Tipo_Contrato con lista 'Indefinido' o 'Plazo Fijo', AFP con lista apuntando a tblAFP[Nombre_AFP], Sistema_Salud 'FONASA' o 'ISAPRE' y Pactado_Isapre_UF). Esta cabecera alimenta todas las condiciones de cálculo posteriores.",
        "Luego divide los ingresos del mes en dos bloques separados. El primero agrupa los Haberes Imponibles: Sueldo Base, Gratificación Legal, Horas Extra, Bonos de Producción o Comisiones. Todos ellos forman la base sobre la cual se calculan AFP, Salud, Seguro de Cesantía e Impuesto Único. La suma de este bloque se guarda en una celda clave llamada Total_Imponible.",
        "El segundo bloque reúne los Haberes No Imponibles: Asignación de Colación, Asignación de Movilización, Viáticos o Asignación Familiar (si aplica). Estos montos no pagan cotizaciones previsionales ni impuesto único (siempre que respondan a montos razonables y naturaleza compensatoria según criterio laboral y tributario), y se suman en Total_No_Imponible. Finalmente, Total_Haberes = Total_Imponible + Total_No_Imponible.",
      ],
      tabla: {
        caption: "Clasificación estructural entre haberes imponibles y no imponibles",
        encabezados: [
          "Concepto",
          "Tipo de haber",
          "¿Afecto a AFP, Salud y AFC?",
          "¿Afecto a Impuesto Único?",
        ],
        filas: [
          [
            "Sueldo Base",
            "Imponible",
            "Sí (hasta el tope imponible)",
            "Sí",
          ],
          [
            "Gratificación Legal",
            "Imponible",
            "Sí (hasta el tope imponible)",
            "Sí",
          ],
          [
            "Horas Extraordinarias y Bonos",
            "Imponible",
            "Sí (hasta el tope imponible)",
            "Sí",
          ],
          [
            "Asignación de Colación",
            "No imponible",
            "No",
            "No",
          ],
          [
            "Asignación de Movilización",
            "No imponible",
            "No",
            "No",
          ],
          [
            "Asignación Familiar / Viáticos",
            "No imponible",
            "No",
            "No",
          ],
        ],
      },
      captura: {
        id: "liquidacion-de-sueldo-en-excel-chile-paso-2",
        alt: "Hoja Liquidacion en Excel mostrando datos del trabajador, bloque de haberes imponibles y bloque de haberes no imponibles",
        caption: "Separación de la ficha del trabajador, Total_Imponible y Total_No_Imponible.",
        ratio: "16/9",
      },
    },
    {
      id: "tope-imponible-uf-min",
      titulo: "3. Aplicar el tope imponible en UF con la función MIN",
      esPasoHowTo: true,
      resumenHowTo:
        "Calcula la base imponible real en pesos chilenos para AFP/Salud y para Seguro de Cesantía usando MIN entre el Total_Imponible y el tope en UF multiplicado por la UF del mes.",
      parrafos: [
        "En Chile, las cotizaciones previsionales obligatorias no se cobran sobre rentas infinitas: existe un tope imponible expresado en UF para AFP y Salud, y un tope imponible distinto (también en UF) para el Seguro de Cesantía (AFC). Si un trabajador gana menos del tope, cotiza por el 100 % de su Total_Imponible; si gana por sobre el tope, cotiza exactamente hasta el tope en pesos.",
        "En lugar de escribir un SI largo y propenso a errores, Excel resuelve esto de forma elegante con la función MIN: toma el menor valor entre Total_Imponible y (Tope_UF * Valor_UF). De ese modo, si la renta es inferior al límite, gana el Total_Imponible; si lo supera, gana el tope convertido a pesos.",
        "Crea dos celdas auxiliares de cálculo en tu hoja Liquidacion: Base_Imponible_AFP_Salud y Base_Imponible_AFC, cada una referenciando su respectivo tope en la hoja Parametros. Redondea el resultado en pesos con REDONDEAR(...;0) para evitar diferencias de centavos.",
      ],
      codigos: [
        {
          titulo: "Base imponible con tope para AFP y Salud",
          lenguaje: "excel",
          codigo: `=REDONDEAR(MIN(C15;Parametros!$B$5*Parametros!$B$3);0)`,
          codigoEn: `=ROUND(MIN(C15,Parametros!$B$5*Parametros!$B$3),0)`,
          nota: "Ejemplo estructural: C15 representa Total_Imponible, Parametros!$B$5 el Tope_Imponible_AFP_Salud_UF vigente y Parametros!$B$3 el Valor_UF.",
        },
        {
          titulo: "Base imponible con tope para Seguro de Cesantía (AFC)",
          lenguaje: "excel",
          codigo: `=REDONDEAR(MIN(C15;Parametros!$B$6*Parametros!$B$3);0)`,
          codigoEn: `=ROUND(MIN(C15,Parametros!$B$6*Parametros!$B$3),0)`,
          nota: "Parametros!$B$6 contiene el Tope_Imponible_AFC_UF vigente consultado en Previred.",
        },
      ],
      captura: {
        id: "liquidacion-de-sueldo-en-excel-chile-paso-3",
        alt: "Celdas de Base_Imponible_AFP_Salud y Base_Imponible_AFC en Excel utilizando la función MIN con los topes de la hoja Parametros",
        caption: "Cálculo automático del tope imponible en pesos mediante MIN.",
        ratio: "16/9",
      },
    },
    {
      id: "descuentos-previsionales",
      titulo: "4. Calcular descuentos previsionales: AFP, Salud (7 %) y AFC",
      esPasoHowTo: true,
      resumenHowTo:
        "Calcula el descuento de AFP con BUSCARX sobre tblAFP, el descuento de Salud (mínimo legal 7 % o plan Isapre en UF con MAX) y el Seguro de Cesantía según contrato.",
      parrafos: [
        "Con las bases topeadas listas, pasamos al bloque de Descuentos Legales. Para la AFP, busca la tasa total correspondiente a la AFP seleccionada en la cabecera del trabajador dentro de tblAFP y multiplícala por Base_Imponible_AFP_Salud.",
        "Para Salud, la regla general parte del mínimo legal del 7 % sobre Base_Imponible_AFP_Salud. Si el trabajador está en FONASA, el descuento es exactamente ese 7 %. Si está en ISAPRE y pactó un plan en UF, se descuenta el mayor valor entre el 7 % legal y el valor en pesos del plan pactado (Pactado_Isapre_UF * Valor_UF), lo cual se modela con la función MAX. Ojo: si el plan en UF supera el 7 % del tope imponible, la diferencia adicional tributaria tiene un tratamiento específico que conviene validar con un contador.",
        "Para el Seguro de Cesantía (AFC) de cargo del trabajador, usa una fórmula SI que evalúe el Tipo_Contrato: si es \"Indefinido\", multiplica Base_Imponible_AFC por la tasa de aporte del trabajador vigente en Parametros; si es \"Plazo Fijo\", el aporte del trabajador es 0 % (lo asume íntegramente el empleador según la normativa general vigente, verificable en la Dirección del Trabajo y Previred).",
      ],
      codigos: [
        {
          titulo: "Descuento de AFP trayendo la tasa desde Parametros",
          lenguaje: "excel",
          codigo: `=REDONDEAR(D18*BUSCARX(C6;tblAFP[Nombre_AFP];tblAFP[Tasa_Total_Trabajador];0);0)`,
          codigoEn: `=ROUND(D18*XLOOKUP(C6,tblAFP[Nombre_AFP],tblAFP[Tasa_Total_Trabajador],0),0)`,
          nota: "Ejemplo estructural: D18 es Base_Imponible_AFP_Salud y C6 es la AFP elegida en la ficha.",
        },
        {
          titulo: "Descuento de Salud (7 % mínimo legal o plan Isapre en UF)",
          lenguaje: "excel",
          codigo: `=REDONDEAR(SI(C7="FONASA";D18*Parametros!$B$7;MAX(D18*Parametros!$B$7;C8*Parametros!$B$3));0)`,
          codigoEn: `=ROUND(IF(C7="FONASA",D18*Parametros!$B$7,MAX(D18*Parametros!$B$7,C8*Parametros!$B$3)),0)`,
          nota: "C7 es Sistema_Salud, Parametros!$B$7 es 7 % (0,07) y C8 es el valor pactado en UF si pertenece a Isapre.",
        },
        {
          titulo: "Descuento de Seguro de Cesantía (AFC) según tipo de contrato",
          lenguaje: "excel",
          codigo: `=REDONDEAR(SI(C5="Indefinido";D19*Parametros!$B$8;D19*Parametros!$B$9);0)`,
          codigoEn: `=ROUND(IF(C5="Indefinido",D19*Parametros!$B$8,D19*Parametros!$B$9),0)`,
          nota: "D19 es Base_Imponible_AFC; Parametros!$B$8 y $B$9 contienen las tasas vigentes del trabajador para contrato indefinido y plazo fijo según Previred.",
        },
      ],
      captura: {
        id: "liquidacion-de-sueldo-en-excel-chile-paso-4",
        alt: "Bloque de descuentos previsionales en Excel mostrando AFP, Salud y Seguro de Cesantía calculados desde la hoja Parametros",
        caption: "Descuentos previsionales parametrizados y redondeados a pesos chilenos.",
        ratio: "16/9",
      },
    },
    {
      id: "impuesto-unico-buscarx",
      titulo: "5. Impuesto Único de Segunda Categoría por tramos en UTM con BUSCARX (-1)",
      esPasoHowTo: true,
      resumenHowTo:
        "Calcula la Renta Líquida Imponible (Tributable), exprésala en UTM y busca el Factor y la Rebaja en UTM usando BUSCARX con modo de coincidencia -1.",
      parrafos: [
        "El Impuesto Único de Segunda Categoría no se calcula sobre el sueldo bruto, sino sobre la Base Tributable (también llamada Renta Líquida Imponible): tomas el Total_Imponible y le restas los descuentos previsionales obligatorios (AFP + Salud + Seguro de Cesantía, considerando los límites legales aplicables a la rebaja de salud). Para no complicar la tabla con montos en pesos que cambian todos los meses, expresa los límites y rebajas de tblTramosIUSC en UTM (tal como publica el SII en su tabla estándar o convirtiendo desde pesos).",
        "Divide la Base_Tributable en pesos por el Valor_UTM del mes para obtener la Base_Tributable_UTM. Luego utiliza BUSCARX con su quinto argumento (modo_coincidencia) igual a -1 ('coincidencia exacta o el siguiente elemento menor'). Eso le indica a Excel: busca Base_Tributable_UTM dentro de la columna Desde_UTM de tblTramosIUSC y, si no calza exacto, quédate con el límite inferior del tramo en el que cayó el trabajador.",
        "Con ese tramo identificado, extraes dos valores: el Factor (tasa marginal del tramo) y la Rebaja_UTM (cantidad a rebajar en UTM). Finalmente calculas el impuesto en pesos con la fórmula estándar del SII: (Base_Tributable * Factor) - (Rebaja_UTM * Valor_UTM), envuelto en MAX(0;...) para que el primer tramo exento siempre arroje $0.",
      ],
      codigos: [
        {
          titulo: "Cálculo del Impuesto Único de Segunda Categoría con BUSCARX (-1)",
          lenguaje: "excel",
          codigo: `=REDONDEAR(MAX(0;(D22*BUSCARX(D22/Parametros!$B$4;tblTramosIUSC[Desde_UTM];tblTramosIUSC[Factor];0;-1))-(BUSCARX(D22/Parametros!$B$4;tblTramosIUSC[Desde_UTM];tblTramosIUSC[Rebaja_UTM];0;-1)*Parametros!$B$4));0)`,
          codigoEn: `=ROUND(MAX(0,(D22*XLOOKUP(D22/Parametros!$B$4,tblTramosIUSC[Desde_UTM],tblTramosIUSC[Factor],0,-1))-(XLOOKUP(D22/Parametros!$B$4,tblTramosIUSC[Desde_UTM],tblTramosIUSC[Rebaja_UTM],0,-1)*Parametros!$B$4)),0)`,
          nota: "Ejemplo estructural: D22 es la Base_Tributable en pesos y Parametros!$B$4 es el Valor_UTM. En Excel 2016/2019 sin BUSCARX, reemplaza por BUSCARV(D22/Parametros!$B$4;tblTramosIUSC;3;VERDADERO).",
        },
      ],
      captura: {
        id: "liquidacion-de-sueldo-en-excel-chile-paso-5",
        alt: "Fórmula BUSCARX con argumento -1 en Excel calculando el tramo de Impuesto Único en UTM sobre la tabla tblTramosIUSC",
        caption: "Determinación del Impuesto Único mediante búsqueda aproximada (-1) en tabla de tramos UTM.",
        ratio: "16/9",
      },
    },
    {
      id: "calculo-sueldo-liquido",
      titulo: "6. Obtener el sueldo líquido a pagar y validar el cierre",
      esPasoHowTo: true,
      resumenHowTo:
        "Suma el Total Descuentos Legales y Otros Descuentos (anticipos o préstamos) y réstalos del Total Haberes para obtener el Sueldo Líquido.",
      parrafos: [
        "En la parte inferior de la hoja Liquidacion crea dos subtotales claros: Total_Descuentos_Legales (AFP + Salud + AFC + Impuesto Único) y Otros_Descuentos (donde se anotan anticipos de quincena, cuotas de préstamos internos o descuentos pactados autorizados).",
        "El Sueldo_Liquido (Alcance Líquido a pagar) se obtiene restando a Total_Haberes (Imponibles + No Imponibles) la suma de Total_Descuentos_Legales y Otros_Descuentos. Añade una fila de verificación al pie que compruebe que el Sueldo_Liquido sea positivo y muestre la fecha de vigencia de los parámetros utilizados en la cabecera del comprobante.",
        "Si quieres profundizar en el diseño de hojas parametrizadas y buenas prácticas de validación en Excel, revisa los cursos de Excel (/cursos/excel) disponibles en ProgramBI.",
      ],
      codigos: [
        {
          titulo: "Fórmula final de Sueldo Líquido a pagar",
          lenguaje: "excel",
          codigo: `=D16-(D24+D25)`,
          codigoEn: `=D16-(D24+D25)`,
          nota: "Ejemplo estructural: D16 es Total_Haberes (Total_Imponible + Total_No_Imponible), D24 es Total_Descuentos_Legales y D25 es Otros_Descuentos.",
        },
      ],
      captura: {
        id: "liquidacion-de-sueldo-en-excel-chile-paso-6",
        alt: "Resumen inferior de la liquidación de sueldo en Excel mostrando Total Haberes, Descuentos Legales, Otros Descuentos y Sueldo Líquido a pagar",
        caption: "Cierre completo de la liquidación con resumen de haberes, descuentos y alcance líquido.",
        ratio: "16/9",
      },
    },
  ],
  erroresComunes: [
    {
      error: "El Impuesto Único se calcula sobre el Total Imponible en vez de la Base Tributable",
      causa: "Omitir la resta de las cotizaciones previsionales obligatorias (AFP, Salud, AFC) antes de buscar el tramo en la tabla del SII.",
      solucion: "Calcula primero Base_Tributable = Total_Imponible - Descuentos_Previsionales_Deducibles y divide ese monto por la UTM del mes.",
    },
    {
      error: "BUSCARX devuelve #N/A al buscar el tramo de Impuesto Único",
      causa: "Olvidar el quinto argumento (-1) en BUSCARX, lo que hace que Excel busque una coincidencia exacta en UTM.",
      solucion: "Asegúrate de escribir ;0;-1 al final de BUSCARX(...;tblTramosIUSC[Desde_UTM];...;0;-1) y mantén la columna Desde_UTM ordenada de menor a mayor.",
    },
    {
      error: "Se cobra tope imponible sobre haberes no imponibles como colación o movilización",
      causa: "Sumar todos los haberes juntos antes de aplicar la función MIN.",
      solucion: "Aplica MIN exclusivamente sobre Total_Imponible. Los haberes no imponibles se suman recién al final para calcular Total_Haberes.",
    },
    {
      error: "Usar tasas de AFP o valores de UF de meses anteriores por descuido",
      causa: "No actualizar la hoja Parametros al cambiar de mes.",
      solucion: "Incluye una celda Fecha_Vigencia visible tanto en Parametros como en el encabezado de la Liquidacion, y actualiza UF, UTM, topes y tabla SII antes de cada cierre.",
    },
  ],
  plantilla: {
    titulo: "Plantilla Parametrizada de Liquidación de Sueldo en Excel (Chile)",
    descripcion:
      "Estructura educativa de dos hojas (Parametros y Liquidacion) con fórmulas MIN, BUSCARX (-1), separación de haberes y celdas listas para cargar los valores vigentes de Previred y SII.",
  },
  faqs: [
    {
      q: "¿Dónde consulto los valores vigentes de UF, UTM, topes imponibles y tasas de AFP?",
      a: "Los indicadores previsionales mensuales (topes imponibles en UF, tasas de cotización por AFP y seguro de cesantía) se publican cada mes en Previred (previred.com/indicadores-previsionales/) y en la Superintendencia de Pensiones (spensiones.cl). La UTM y la tabla mensual del Impuesto Único se consultan en el SII (sii.cl).",
    },
    {
      q: "¿Qué cambia si uso Excel 2016 o 2019 sin BUSCARX?",
      a: "Puedes reemplazar BUSCARX(...,0) para la AFP por BUSCARV(C6;tblAFP;2;FALSO), y BUSCARX(...,0;-1) para el Impuesto Único por BUSCARV(Base_UTM;tblTramosIUSC;3;VERDADERO) manteniendo la tabla de tramos ordenada ascendentemente por Desde_UTM.",
    },
    {
      q: "¿Esta planilla reemplaza un software de remuneraciones o la asesoría de un contador?",
      a: "No. Es una herramienta educativa y de cálculo estructural. En liquidaciones reales pueden intervenir factores específicos como APV, cargas familiares, licencias médicas, cotización adicional Isapre sobre tope o leyes especiales que requieren validación profesional y registro en el Libro de Remuneraciones Electrónico.",
    },
    {
      q: "¿Cómo adapto la planilla para calcular 20 trabajadores a la vez en lugar de uno por hoja?",
      a: "Convierte la estructura en una tabla horizontal (una fila por trabajador y una columna por concepto: Sueldo Base, Gratificación, Total Imponible, Base AFP, Descuentos, Líquido) manteniendo todas las fórmulas apuntando con referencia absoluta ($) a la misma hoja Parametros.",
    },
  ],
  relacionadas: [
    "uf-utm-ipc-en-excel-automatico",
    "control-de-horas-en-excel",
    "como-hacer-presupuesto-en-excel",
  ],
  enlacesExternos: [
    {
      label: "Servicio de Impuestos Internos (SII) — Valores y tabla de Impuesto Único",
      url: "https://www.sii.cl",
      fuente: "SII Chile",
    },
    {
      label: "Indicadores Previsionales mensuales",
      url: "https://www.previred.com/indicadores-previsionales/",
      fuente: "Previred",
    },
    {
      label: "Superintendencia de Pensiones",
      url: "https://www.spensiones.cl",
      fuente: "Superintendencia de Pensiones",
    },
    {
      label: "Dirección del Trabajo — Normativa laboral",
      url: "https://www.dt.gob.cl",
      fuente: "Dirección del Trabajo",
    },
  ],
  enlacesInternosExtra: [
    {
      label: "Indicadores económicos en ProgramBI",
      href: "/datos",
      descripcion: "Consulta referencias de UF, UTM e IPC para alimentar tus planillas en Excel.",
    },
    {
      label: "Cursos de Excel en ProgramBI",
      href: "/cursos/excel",
      descripcion: "Domina fórmulas condicionales, búsqueda avanzada y modelamiento financiero en Excel.",
    },
  ],
};

export default guia;
