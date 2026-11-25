import type { GuiaPasoAPaso } from "@/lib/guias/paso-a-paso-tipos";

export const guia: GuiaPasoAPaso = {
  slug: "renta-quinta-categoria-excel",
  pais: "pe",
  title: "Renta de quinta categoría en Excel (Perú 2026)",
  meta: "Calcula la renta de quinta categoría en Excel (UIT 2026 = S/ 5.500): proyección anual, deducción de 7 UIT, tramos SUNAT y retención mensual exacta.",
  h1: "Cómo calcular la renta de quinta categoría en Excel (Perú 2026)",
  subtitle:
    "Construye una planilla tributaria en Excel con la UIT 2026 de S/ 5.500 (D.S. 301-2025-EF), proyección anual de ingresos, deducción fija de 7 UIT (S/ 38.500), tramos progresivos SUNAT (8/14/17/20/30 %) y factor de retención mensual.",
  keywordPrincipal: "renta de quinta categoria en excel peru",
  keywords: [
    "renta de quinta categoria en excel peru",
    "calculo quinta categoria uit 2026 5500",
    "tramos sunat quinta categoria excel",
    "retencion mensual quinta categoria excel",
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
      "Un libro de Excel con hoja Parametros (UIT 2026 = S/ 5.500, deducción de 7 UIT = S/ 38.500 y tabla de tramos SUNAT) que proyecta la renta bruta anual del trabajador, calcula el impuesto anual por tramos y determina la retención exacta del mes según el divisor reglamentario.",
    herramienta: "Microsoft Excel (365, 2021 o Web)",
    tiempo: "35 minutos",
    bullets: [
      "Hoja Parametros con UIT 2026 de S/ 5.500 (D.S. 301-2025-EF), deducción de 7 UIT (S/ 38.500) y escala progresiva SUNAT.",
      "Proyección automática de remuneraciones por percibir en el año, gratificaciones de julio y diciembre y remuneraciones ya cobradas.",
      "Cálculo exacto del impuesto anual por tramos acumulativos (8 %, 14 %, 17 %, 20 % y 30 %) sin fórmulas anidadas difíciles de mantener.",
      "Aplicación automática del divisor mensual del Reglamento de la Ley del Impuesto a la Renta (12, 9, 8, 5, 4 o regularización en diciembre).",
    ],
  },
  rutaVisual: [
    {
      numero: 1,
      titulo: "Parámetros UIT 2026",
      resumen: "Registra UIT S/ 5.500, deducción de 7 UIT y tramos de SUNAT.",
      anchorId: "parametros-uit-2026",
      icono: "database",
    },
    {
      numero: 2,
      titulo: "Proyección anual",
      resumen: "Suma ingresos previos, meses por percibir y gratificaciones del año.",
      anchorId: "proyeccion-renta-bruta-anual",
      icono: "table",
    },
    {
      numero: 3,
      titulo: "Deducción de 7 UIT",
      resumen: "Resta S/ 38.500 para obtener la Renta Neta Imponible del ejercicio.",
      anchorId: "deduccion-siete-uit",
      icono: "shield",
    },
    {
      numero: 4,
      titulo: "Tramos SUNAT",
      resumen: "Calcula el impuesto anual aplicando las tasas 8, 14, 17, 20 y 30 %.",
      anchorId: "calculo-tramos-progresivos",
      icono: "code",
    },
    {
      numero: 5,
      titulo: "Retención mensual",
      resumen: "Descuenta retenciones previas y divide según el mes del calendario.",
      anchorId: "retencion-mensual-divisor",
      icono: "check",
    },
  ],
  requisitos: {
    version: "Excel 365, Excel 2021 o Excel para la Web (compatible también con Excel 2016/2019)",
    lista: [
      "Microsoft Excel en Windows, macOS o versión Web.",
      "Valor de la UIT 2026 (S/ 5.500 según D.S. 301-2025-EF) y tabla de tramos publicada por SUNAT.",
      "Historial de remuneraciones percibidas, retenciones acumuladas de meses anteriores y detalle de ingresos adicionales (bonos, utilidades o comisiones).",
    ],
    compatibilidadMacWeb:
      "Todas las fórmulas usadas (SUMAPRODUCTO, MAX, MIN, REDONDEAR, BUSCARV/BUSCARX) funcionan igual en Windows, macOS y Excel Web. Recuerda usar punto y coma (;) en español o coma (,) en inglés.",
    avisoEducativo:
      "Guía educativa referencial basada en el T.U.O. de la Ley del Impuesto a la Renta y su Reglamento (D.S. 122-94-EF). Verifica las normas tributarias vigentes en sunat.gob.pe antes de declarar el PLAME.",
  },
  herramientasHowTo: ["Microsoft Excel 365 / 2021 / Web"],
  insumosHowTo: [
    "Valor oficial de la UIT 2026 (D.S. 301-2025-EF) en sunat.gob.pe",
    "Registro de remuneraciones y retenciones acumuladas por trabajador",
  ],
  secciones: [
    {
      id: "parametros-uit-2026",
      titulo: "1. Configurar la hoja Parametros con la UIT 2026 (S/ 5.500) y tramos SUNAT",
      esPasoHowTo: true,
      resumenHowTo:
        "Almacena el valor de la UIT 2026 (S/ 5.500), el tope exonerado de 7 UIT (S/ 38.500), la tabla de 5 tramos progresivos de SUNAT y la tabla de divisores mensuales.",
      parrafos: [
        "El cálculo de la renta de quinta categoría en Perú depende directamente del valor de la Unidad Impositiva Tributaria (UIT) del ejercicio fiscal. Para el año 2026, el Decreto Supremo N.° 301-2025-EF fijó la UIT en S/ 5.500, lo que eleva la deducción anual fija de 7 UIT a S/ 38.500.",
        "En una hoja llamada Parametros, coloca en la parte superior la fecha de vigencia (2026), el valor de la UIT (5.500) y el cálculo automático de 7 UIT (=B3*7). Debajo, crea dos tablas pequeñas: tblTramos5ta con los cinco tramos acumulativos de SUNAT (8 %, 14 %, 17 %, 20 % y 30 %) y tblDivisores5ta con el divisor reglamentario correspondiente a cada mes del año.",
        "Centralizar la UIT y los tramos en Parametros asegura que, cuando cambie la UIT en años futuros, solo debas actualizar una celda para recalcular toda la planilla de la empresa.",
      ],
      tabla: {
        caption: "Parámetros tributarios de Renta de Quinta Categoría (Perú 2026)",
        encabezados: [
          "Parámetro / Tramo",
          "Límite en UIT",
          "Equivalente 2026 (S/)",
          "Tasa / Fuente oficial",
        ],
        filas: [
          [
            "UIT 2026",
            "1 UIT",
            "S/ 5.500",
            "D.S. 301-2025-EF / sunat.gob.pe",
          ],
          [
            "Deducción fija anual",
            "7 UIT",
            "S/ 38.500",
            "Art. 46 LIR / sunat.gob.pe",
          ],
          [
            "Tramo 1",
            "Hasta 5 UIT",
            "Hasta S/ 27.500",
            "8 % (sunat.gob.pe)",
          ],
          [
            "Tramo 2",
            "Más de 5 hasta 20 UIT",
            "S/ 27.500,01 a S/ 110.000",
            "14 % (sunat.gob.pe)",
          ],
          [
            "Tramo 3",
            "Más de 20 hasta 35 UIT",
            "S/ 110.000,01 a S/ 192.500",
            "17 % (sunat.gob.pe)",
          ],
          [
            "Tramo 4",
            "Más de 35 hasta 45 UIT",
            "S/ 192.500,01 a S/ 247.500",
            "20 % (sunat.gob.pe)",
          ],
          [
            "Tramo 5",
            "Más de 45 UIT",
            "Más de S/ 247.500",
            "30 % (sunat.gob.pe)",
          ],
        ],
      },
    },
    {
      id: "proyeccion-renta-bruta-anual",
      titulo: "2. Proyectar la Renta Bruta Anual del trabajador",
      esPasoHowTo: true,
      resumenHowTo:
        "Multiplica la remuneración mensual actual por los meses que faltan para cerrar el año (incluido el mes de cálculo), suma las gratificaciones por percibir y añade lo ya cobrado.",
      parrafos: [
        "El procedimiento legal del artículo 40 del Reglamento de la Ley del Impuesto a la Renta obliga a proyectar los ingresos anuales del trabajador en cada mes del ejercicio. Esto significa que en marzo, por ejemplo, proyectas 10 meses por delante (marzo a diciembre), sumas las gratificaciones ordinarias de julio y diciembre (junto con sus bonificaciones extraordinarias del 9 % o 6,75 % porque también están gravadas con renta de quinta) y añades las remuneraciones reales percibidas en enero y febrero.",
        "Si en un mes determinado el trabajador recibe un ingreso extraordinario —como participación en utilidades, bono de desempeño o gratificación extraordinaria—, ese monto se suma a la proyección anual en el mes en que se pone a disposición, pero siguiendo las reglas de fraccionamiento o retención íntegra del mes según corresponda.",
        "En Excel, evita hardcodear «12 meses» en la fórmula: usa la celda del número de mes (1 a 12) para calcular automáticamente los meses por proyectar (=12 - Mes + 1) y cuántas gratificaciones ordinarias quedan pendientes en el año.",
      ],
      codigos: [
        {
          titulo: "Fórmula de Renta Bruta Anual Proyectada",
          lenguaje: "excel",
          codigo: `=B2*(12-C2+1) + D2 + E2 + F2`,
          codigoEn: `=B2*(12-C2+1) + D2 + E2 + F2`,
          nota: "B2 = Remuneración mensual afecta; C2 = Mes de cálculo (1 a 12); D2 = Gratificaciones ordinarias y bonificaciones extraordinarias por percibir en el año; E2 = Remuneraciones y gratificaciones ya percibidas en meses previos del año; F2 = Otros ingresos afectos del mes (bonos, utilidades, horas extras).",
        },
      ],
    },
    {
      id: "deduccion-siete-uit",
      titulo: "3. Aplicar la deducción fija de 7 UIT (S/ 38.500 en 2026)",
      esPasoHowTo: true,
      resumenHowTo:
        "Resta 7 UIT a la Renta Bruta Anual Proyectada usando MAX(0; ...) para obtener la Renta Neta de Quinta Categoría sujeta a tramos.",
      parrafos: [
        "Una vez obtenida la Renta Bruta Anual Proyectada, la ley permite deducir un monto fijo equivalente a 7 UIT sin necesidad de presentar comprobantes. Con la UIT 2026 de S/ 5.500, todo trabajador cuya proyección anual no supere S/ 38.500 (aproximadamente S/ 2.750 mensuales considerando 14 sueldos al año con gratificaciones) tendrá una Renta Neta de S/ 0 y no sufrirá retenciones.",
        "Usa la función MAX(0; Renta_Bruta - Parametros!$B$4) para asegurar que la Renta Neta Imponible nunca muestre valores negativos cuando el ingreso proyectado sea inferior a las 7 UIT.",
      ],
      codigos: [
        {
          titulo: "Cálculo de Renta Neta Anual Imponible",
          lenguaje: "excel",
          codigo: `=MAX(0; G2 - Parametros!$B$4)`,
          codigoEn: `=MAX(0, G2 - Parametros!$B$4)`,
          nota: "G2 = Renta Bruta Anual Proyectada; Parametros!$B$4 = 7 UIT (S/ 38.500 en 2026).",
        },
      ],
    },
    {
      id: "calculo-tramos-progresivos",
      titulo: "4. Calcular el impuesto anual con los tramos progresivos SUNAT",
      esPasoHowTo: true,
      resumenHowTo:
        "Aplica los 5 tramos escalonados (8 %, 14 %, 17 %, 20 % y 30 %) mediante una fórmula limpia de capas marginales o SUMAPRODUCTO.",
      parrafos: [
        "Un error muy frecuente en planillas caseras es aplicar el porcentaje del tramo más alto a toda la Renta Neta Anual. En Perú, el Impuesto a la Renta de quinta categoría es progresivo acumulativo: los primeros S/ 27.500 (5 UIT) pagan 8 %; el excedente entre 5 y 20 UIT paga 14 %; el tramo entre 20 y 35 UIT paga 17 %; entre 35 y 45 UIT paga 20 %, y solo lo que supere 45 UIT paga 30 %.",
        "En Excel existe una forma elegante y compacta de calcular impuestos escalonados sin anidar cinco funciones SI(): utilizar SUMAPRODUCTO sobre las tasas diferenciales o sumar cada tramo acotado con MIN y MAX. La segunda opción es sumamente transparente para auditorías porque muestra cada tramo en columnas o en una sola fórmula legible.",
      ],
      codigos: [
        {
          titulo: "Fórmula exacta del Impuesto Anual Proyectado por tramos SUNAT",
          lenguaje: "excel",
          codigo: `=REDONDEAR(MIN(H2;5*Parametros!$B$3)*0,08 + MAX(0;MIN(H2;20*Parametros!$B$3)-5*Parametros!$B$3)*0,14 + MAX(0;MIN(H2;35*Parametros!$B$3)-20*Parametros!$B$3)*0,17 + MAX(0;MIN(H2;45*Parametros!$B$3)-35*Parametros!$B$3)*0,20 + MAX(0;H2-45*Parametros!$B$3)*0,30; 2)`,
          codigoEn: `=ROUND(MIN(H2,5*Parametros!$B$3)*0.08 + MAX(0,MIN(H2,20*Parametros!$B$3)-5*Parametros!$B$3)*0.14 + MAX(0,MIN(H2,35*Parametros!$B$3)-20*Parametros!$B$3)*0.17 + MAX(0,MIN(H2,45*Parametros!$B$3)-35*Parametros!$B$3)*0.20 + MAX(0,H2-45*Parametros!$B$3)*0.30, 2)`,
          nota: "H2 = Renta Neta Anual Imponible; Parametros!$B$3 = UIT vigente (5.500 en 2026). Cada término aísla el monto exacto que cae dentro de cada tramo.",
        },
      ],
    },
    {
      id: "retencion-mensual-divisor",
      titulo: "5. Determinar la retención del mes según el divisor reglamentario",
      esPasoHowTo: true,
      resumenHowTo:
        "Resta las retenciones acumuladas según el calendario del Reglamento de la LIR y divide el saldo entre 12, 9, 8, 5, 4 o 1 (diciembre).",
      parrafos: [
        "El impuesto anual proyectado no se divide simplemente entre 12 en todos los meses. El artículo 40 del Reglamento de la LIR fija divisores específicos por bloques de meses para absorber variaciones de sueldo o ingresos extraordinarios durante el año:",
        "De enero a marzo se divide el impuesto anual entre 12. En abril se resta lo retenido de enero a marzo y se divide entre 9. De mayo a julio se resta lo retenido de enero a abril y se divide entre 8. En agosto se resta lo retenido de enero a julio y se divide entre 5. De septiembre a noviembre se resta lo retenido de enero a agosto y se divide entre 4. Finalmente, en diciembre se realiza la regularización anual restando todas las retenciones de enero a noviembre.",
        "Al automatizar este divisor con BUSCARV o SI en Excel, tu hoja de cálculo queda lista para conectarse con la [boleta de pago mensual en Excel](/pe/guias/boleta-de-pago-excel) y generar el monto exacto a declarar en el PDT PLAME.",
      ],
      codigos: [
        {
          titulo: "Cálculo de la retención mensual de quinta categoría",
          lenguaje: "excel",
          codigo: `=MAX(0; REDONDEAR((I2 - J2) / BUSCARV(C2; Parametros!$D$2:$E$13; 2; FALSO); 2))`,
          codigoEn: `=MAX(0, ROUND((I2 - J2) / VLOOKUP(C2, Parametros!$D$2:$E$13, 2, FALSE), 2))`,
          nota: "I2 = Impuesto Anual Proyectado; J2 = Retenciones acumuladas válidas según el tramo de mes; C2 = Mes (1 a 12); Parametros!$D$2:$E$13 = Tabla de mes vs. divisor (1-3: 12; 4: 9; 5-7: 8; 8: 5; 9-11: 4; 12: 1).",
        },
      ],
    },
  ],
  erroresComunes: [
    {
      error: "Aplicar una sola tasa de tramo a toda la renta neta",
      causa:
        "Multiplicar la Renta Neta Anual por 14 % o 17 % cuando supera 5 UIT en vez de calcular por escalones.",
      solucion:
        "Usa la fórmula por capas marginales (8 % hasta 5 UIT, 14 % sobre el exceso hasta 20 UIT, etc.) para evitar retenciones excesivas.",
    },
    {
      error: "Olvidar incluir la bonificación extraordinaria del 9 % o 6,75 % en la proyección",
      causa:
        "Proyectar solo las gratificaciones ordinarias de julio y diciembre y omitir la bonificación extraordinaria de la Ley 30334.",
      solucion:
        "Aunque la bonificación extraordinaria está inafecta a AFP/ONP, sí está gravada con renta de quinta categoría; inclúyela en la proyección anual.",
    },
    {
      error: "Dividir entre los meses restantes en todos los meses del año",
      causa:
        "Dividir entre 11 en febrero o entre 10 en marzo en lugar de usar los divisores oficiales del Reglamento de la LIR.",
      solucion:
        "Utiliza la tabla oficial de divisores SUNAT (ene-mar: 12; abr: 9; may-jul: 8; ago: 5; sep-nov: 4; dic: 1).",
    },
    {
      error: "Seguir usando la UIT de años anteriores",
      causa:
        "Mantener el valor antiguo de UIT escrito dentro de las fórmulas en lugar de parametrizarlo.",
      solucion:
        "Actualiza la celda UIT en Parametros a S/ 5.500 para el ejercicio 2026 (D.S. 301-2025-EF), lo que actualiza automáticamente las 7 UIT (S/ 38.500) y los 5 tramos.",
    },
  ],
  plantilla: {
    titulo: "Plantilla de Renta de Quinta Categoría en Excel (Perú 2026)",
    descripcion:
      "Descarga el archivo .xlsx con la UIT 2026 (S/ 5.500), tabla de tramos SUNAT, proyección automática por mes, divisores reglamentarios y resumen de retención mensual por trabajador.",
  },
  plantillaArchivo: {
    recurso: "renta-quinta-categoria-peru-2026",
    archivoUrl: "/pe/plantillas/renta-quinta-categoria-peru-2026.xlsx",
    nombreArchivo: "renta-quinta-categoria-peru-2026.xlsx",
  },
  faqs: [
    {
      q: "¿A partir de qué sueldo mensual se descuenta renta de quinta categoría en Perú en 2026?",
      a: "Con la UIT 2026 de S/ 5.500, las 7 UIT exoneradas equivalen a S/ 38.500 anuales. Considerando 12 remuneraciones más 2 gratificaciones ordinarias (14 ingresos al año), un trabajador que gane más de S/ 2.750 mensuales aproximadamente comienza a estar afecto a retención.",
    },
    {
      q: "¿Cómo se calculan las retenciones cuando el trabajador ingresa a mitad de año?",
      a: "Si el trabajador ingresó en un mes posterior a enero y no tuvo empleador previo en el año, se proyectan únicamente los meses desde su ingreso hasta diciembre más las gratificaciones que le correspondan, aplicando igualmente la deducción completa de 7 UIT (S/ 38.500).",
    },
    {
      q: "¿Qué ocurre si el trabajador tuvo otro empleador antes en el mismo año?",
      a: "El trabajador debe entregar su Certificado de Rentas y Retenciones de quinta categoría emitido por el empleador anterior. Esos ingresos percibidos y retenciones efectuadas se suman en las columnas de acumulados previos de tu hoja de Excel.",
    },
    {
      q: "¿La CTS y la indemnización por despido arbitrario pagan renta de quinta categoría?",
      a: "No. Tanto la CTS (depósitos semestrales o trunca) como la indemnización por despido arbitrario hasta el límite legal están inafectas al Impuesto a la Renta de quinta categoría según el artículo 18 de la Ley del Impuesto a la Renta.",
    },
    {
      q: "¿Qué pasa si al cierre de diciembre se retuvo en exceso al trabajador?",
      a: "Si en la regularización de diciembre resulta un saldo a favor del trabajador por retenciones en exceso, el empleador debe devolver el monto retenido de más o compensarlo según el procedimiento vigente de SUNAT.",
    },
  ],
  relacionadas: [
    "boleta-de-pago-excel",
    "calcular-gratificacion-excel",
    "liquidacion-beneficios-sociales-excel",
  ],
  enlacesExternos: [
    {
      label: "Valor de la UIT 2026 (D.S. 301-2025-EF) y tramos de 5ta categoría",
      url: "https://www.sunat.gob.pe/",
      fuente: "SUNAT",
    },
    {
      label: "Orientación laboral y tributaria en plataforma del Estado",
      url: "https://www.gob.pe/sunat",
      fuente: "gob.pe / SUNAT",
    },
  ],
  enlacesInternosExtra: [
    {
      label: "Curso de Excel en vivo (Perú)",
      href: "/pe/cursos/excel",
      descripcion: "Aprende a automatizar cálculos tributarios y planillas con fórmulas avanzadas.",
    },
    {
      label: "Datos económicos de Perú",
      href: "/pe/datos",
      descripcion: "Consulta indicadores de referencia para presupuestos y nóminas.",
    },
    {
      label: "Carreras y sueldos en Perú",
      href: "/pe/datos/carreras",
      descripcion: "Explora bandas salariales reales por carrera en el mercado peruano.",
    },
  ],
};

export default guia;
