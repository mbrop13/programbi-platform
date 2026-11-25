import type { GuiaPasoAPaso } from "@/lib/guias/paso-a-paso-tipos";

export const guia: GuiaPasoAPaso = {
  slug: "calcular-gratificacion-excel",
  pais: "pe",
  title: "Cómo calcular gratificación en Excel (Perú 2026)",
  meta: "Calcula la gratificación de julio y diciembre en Excel (Ley 27735), bonificación 9 % o 6,75 % y gratificación trunca con plantilla descargable.",
  h1: "Cómo calcular la gratificación en Excel (Perú 2026)",
  subtitle:
    "Arma una planilla parametrizada en Excel para calcular la gratificación legal de Fiestas Patrias y Navidad bajo la Ley 27735, sumar la bonificación extraordinaria (9 % EsSalud o 6,75 % EPS) y obtener la gratificación trunca por meses completos.",
  keywordPrincipal: "como calcular gratificacion en excel peru",
  keywords: [
    "como calcular gratificacion en excel peru",
    "calculo gratificacion ley 27735 excel",
    "bonificacion extraordinaria 9 porciento essalud",
    "gratificacion trunca excel peru",
  ],
  curso: "excel",
  cursoSecundario: "power-bi",
  herramienta: "Excel",
  nivel: "Básico",
  updated: "2026-11-25",
  published: "2026-11-25",
  totalTimeIso: "PT25M",
  en30Segundos: {
    queLogras:
      "Un libro de Excel con hoja Parametros y hoja Calculo_Gratificacion que determina la remuneración computable, los meses completos del semestre, la gratificación ordinaria o trunca y la bonificación extraordinaria de EsSalud o EPS.",
    herramienta: "Microsoft Excel (365, 2021 o Web)",
    tiempo: "25 minutos",
    bullets: [
      "Hoja Parametros con fecha de vigencia, tasas de bonificación extraordinaria (9 % EsSalud y 6,75 % EPS) y asignación familiar vigente.",
      "Cálculo automático de meses calendario completos laborados en el semestre enero-junio (julio) o julio-diciembre (diciembre).",
      "Determinación de la remuneración computable sumando sueldo básico, asignación familiar y promedio de remuneraciones variables.",
      "Cálculo de gratificación bruta, bonificación extraordinaria inafecta y total a depositar dentro del plazo legal (15 de julio y 15 de diciembre).",
    ],
  },
  rutaVisual: [
    {
      numero: 1,
      titulo: "Hoja de parámetros",
      resumen: "Centraliza tasas de EsSalud/EPS, asignación familiar y fecha de vigencia.",
      anchorId: "hoja-parametros-gratificacion",
      icono: "database",
    },
    {
      numero: 2,
      titulo: "Remuneración computable",
      resumen: "Suma sueldo básico, asignación familiar y promedio de variables.",
      anchorId: "remuneracion-computable",
      icono: "table",
    },
    {
      numero: 3,
      titulo: "Meses del semestre",
      resumen: "Cuenta meses calendario completos y verifica si aplica gratificación trunca.",
      anchorId: "meses-computables-semestre",
      icono: "calendar",
    },
    {
      numero: 4,
      titulo: "Gratificación y bono",
      resumen: "Calcula el monto proporcional, la bonificación del 9 % o 6,75 % y el total.",
      anchorId: "calculo-gratificacion-bonificacion",
      icono: "code",
    },
    {
      numero: 5,
      titulo: "Control de plazos",
      resumen: "Valida fechas límite de pago (15 de julio y 15 de diciembre) y descuentos.",
      anchorId: "validacion-plazos-y-regimen",
      icono: "check",
    },
  ],
  requisitos: {
    version: "Excel 365, Excel 2021 o Excel para la Web (compatible también con Excel 2016/2019)",
    lista: [
      "Microsoft Excel en Windows, macOS o versión Web.",
      "Fecha de ingreso del trabajador, fecha de cese (si aplica) y datos de remuneración fija y variable del semestre.",
      "Confirmación del régimen de salud del trabajador (EsSalud 9 % o EPS 6,75 %) y régimen laboral (general, pequeña empresa o microempresa).",
    ],
    compatibilidadMacWeb:
      "Todas las fórmulas propuestas (SI, REDONDEAR, FECHA, FIN.MES, PROMEDIO.SI, MIN) funcionan de manera idéntica en Windows, macOS y Excel Web. Recuerda usar punto y coma (;) en Excel en español o coma (,) en Excel en inglés.",
    avisoEducativo:
      "Guía educativa referencial basada en la Ley 27735 y su reglamento (D.S. 005-2002-TR). Verifica siempre el régimen laboral de la empresa y las normas vigentes en gob.pe antes de aprobar planillas reales.",
  },
  herramientasHowTo: ["Microsoft Excel 365 / 2021 / Web"],
  insumosHowTo: [
    "Registro de ingresos y comisiones del semestre (enero-junio o julio-diciembre)",
    "Datos de afiliación a EsSalud o EPS de cada trabajador",
  ],
  secciones: [
    {
      id: "hoja-parametros-gratificacion",
      titulo: "1. Crear la hoja Parametros con tasas oficiales y vigencia",
      esPasoHowTo: true,
      resumenHowTo:
        "Crea una hoja Parametros que guarde la fecha de vigencia, el porcentaje de bonificación extraordinaria de EsSalud (9 %) y EPS (6,75 %), y el valor de la asignación familiar.",
      parrafos: [
        "Cuando calculas gratificaciones en Excel para una planilla mensual o semestral, nunca escribas porcentajes fijos dentro de las fórmulas. Aunque las tasas de bonificación extraordinaria de la Ley 29351 (incorporada de forma permanente por la Ley 30334) se mantienen en 9 % para EsSalud y 6,75 % para trabajadores afiliados a una EPS, otros valores como la Remuneración Mínima Vital (RMV) —que define la asignación familiar equivalente al 10 %— sí pueden actualizarse por decreto supremo.",
        "Abre un libro nuevo de Excel y crea una primera hoja llamada Parametros. En las primeras filas registra la fecha de vigencia del cálculo, el periodo semestral seleccionado (Julio o Diciembre), la RMV vigente publicada en el portal oficial del Ministerio de Trabajo y Promoción del Empleo (gob.pe/mtpe), y las dos tasas de bonificación extraordinaria.",
        "Separar estos supuestos en celdas de entrada te permite auditar cualquier cálculo pasado con solo revisar la columna de vigencia y reutilizar la misma plantilla en los semestres siguientes sin reescribir fórmulas. Si trabajas en áreas de finanzas o compensaciones, también puedes complementar tu análisis revisando la sección de [datos económicos de Perú](/pe/datos) en ProgramBI.",
      ],
      tabla: {
        caption: "Estructura de la hoja Parametros (verificar valores vigentes en gob.pe antes de liquidar)",
        encabezados: [
          "Celda",
          "Parámetro",
          "Valor de referencia / Regla",
          "Fuente oficial",
        ],
        filas: [
          [
            "Parametros!B2",
            "Fecha de vigencia",
            "2026-11-25 (actualizar al cierre del semestre)",
            "Control interno de nómina",
          ],
          [
            "Parametros!B3",
            "RMV vigente (S/)",
            "[Completar con RMV vigente publicada por MTPE]",
            "gob.pe/mtpe",
          ],
          [
            "Parametros!B4",
            "Asignación familiar (10 % RMV)",
            "=REDONDEAR(B3*0,10;2)",
            "Ley 25129 / gob.pe",
          ],
          [
            "Parametros!B5",
            "Bonif. extraordinaria EsSalud",
            "9 % (0,09)",
            "Ley 30334 / sunat.gob.pe",
          ],
          [
            "Parametros!B6",
            "Bonif. extraordinaria EPS",
            "6,75 % (0,0675)",
            "Ley 30334 / sunat.gob.pe",
          ],
          [
            "Parametros!B7",
            "Meses del semestre completo",
            "6",
            "Ley 27735 / gob.pe",
          ],
        ],
      },
      alerta: {
        tipo: "info",
        titulo: "Régimen general vs. MYPE",
        texto:
          "La gratificación equivalente a una remuneración completa en julio y otra en diciembre aplica al régimen laboral general de la actividad privada. Las pequeñas empresas registradas en el REMYPE otorgan media gratificación en cada oportunidad, y las microempresas no están obligadas al pago de gratificaciones legales.",
      },
    },
    {
      id: "remuneracion-computable",
      titulo: "2. Determinar la remuneración computable en Excel",
      esPasoHowTo: true,
      resumenHowTo:
        "Suma el sueldo básico vigente, la asignación familiar (si corresponde) y el promedio de remuneraciones variables percibidas al menos tres meses en el semestre.",
      parrafos: [
        "Según la Ley 27735 y su reglamento (D.S. 005-2002-TR), la base de cálculo para la gratificación es la remuneración computable vigente al 30 de junio (para la gratificación de julio) o al 30 de noviembre (para la gratificación de diciembre). Esta base incluye el sueldo básico y cualquier concepto fijo de libre disposición que perciba el trabajador de forma regular.",
        "Si el trabajador tiene hijos menores de edad o mayores cursando estudios superiores hasta los 24 años, corresponde sumar la asignación familiar equivalente al 10 % de la RMV vigente. En Excel, coloca una columna de indicador («Sí» / «No») para asignar el monto automáticamente desde la hoja Parametros.",
        "Respecto a las remuneraciones variables o imprecisas —como comisiones, bonos de productividad u horas extras—, solo ingresan al promedio computable si el trabajador las percibió durante al menos tres meses dentro del semestre evaluado (criterio de regularidad). Cuando se cumple esa condición, sumas lo percibido en el semestre y lo divides entre 6 (o entre los meses efectivamente laborados si ingresó iniciado el semestre).",
      ],
      codigos: [
        {
          titulo: "Fórmula de remuneración computable con verificación de regularidad de variables",
          lenguaje: "excel",
          codigo: `=B2 + SI(C2="Sí";Parametros!$B$4;0) + SI(D2>=3;REDONDEAR(E2/F2;2);0)`,
          codigoEn: `=B2 + IF(C2="Sí",Parametros!$B$4,0) + IF(D2>=3,ROUND(E2/F2,2),0)`,
          nota: "B2 = Sueldo básico; C2 = Tiene asignación familiar ('Sí'/'No'); D2 = Cantidad de meses del semestre con variable; E2 = Total variable del semestre; F2 = Meses laborados en el semestre (6 si laboró todo el periodo).",
        },
      ],
    },
    {
      id: "meses-computables-semestre",
      titulo: "3. Calcular los meses calendario completos del semestre",
      esPasoHowTo: true,
      resumenHowTo:
        "Calcula cuántos meses calendario completos laboró el trabajador dentro del semestre (enero-junio o julio-diciembre) y descuenta faltas injustificadas.",
      parrafos: [
        "Uno de los puntos más sensibles de la Ley 27735 es el cómputo del tiempo de servicios. La gratificación se paga por mes calendario completo laborado dentro del semestre respectivo: del 1 de enero al 30 de junio para Fiestas Patrias, y del 1 de julio al 31 de diciembre para Navidad.",
        "Si un trabajador ingresó el 15 de marzo, marzo no cuenta como mes completo para la gratificación de julio; solo se computan abril, mayo y junio (3 meses completos, es decir, 3/6 de la remuneración computable). Además, de cada mes completo se descuentan los días de inasistencia injustificada a razón de 1/30 por día.",
        "En Excel puedes automatizar el conteo de meses completos comparando la fecha de inicio del semestre (por ejemplo, 01/07/2026) con la fecha de ingreso del trabajador. Si ingresó el día 1 de un mes o antes del inicio del semestre, ese mes sí cuenta; si ingresó después del día 1, el cómputo arranca desde el primer día del mes siguiente.",
      ],
      codigos: [
        {
          titulo: "Conteo automático de meses completos en el semestre en Excel",
          lenguaje: "excel",
          codigo: `=MAX(0; (AÑO(G2)-AÑO(MAX(F2;H2)))*12 + MES(G2) - MES(MAX(F2;H2)) + SI(DIA(MAX(F2;H2))=1;1;0))`,
          codigoEn: `=MAX(0, (YEAR(G2)-YEAR(MAX(F2,H2)))*12 + MONTH(G2) - MONTH(MAX(F2,H2)) + IF(DAY(MAX(F2,H2))=1,1,0))`,
          nota: "F2 = Fecha de ingreso del trabajador; H2 = Primer día del semestre (ej. 01/07/2026); G2 = Último día del semestre o fecha de cese al fin de mes (ej. 31/12/2026). Para ceses a mitad de mes en gratificación trunca, reemplaza G2 por el último día del mes completo anterior al cese.",
        },
      ],
    },
    {
      id: "calculo-gratificacion-bonificacion",
      titulo: "4. Calcular la gratificación bruta, bonificación 9 % / 6,75 % y total",
      esPasoHowTo: true,
      resumenHowTo:
        "Multiplica la remuneración computable por los meses completos divididos entre 6, calcula la bonificación extraordinaria según EsSalud o EPS y suma ambos importes.",
      parrafos: [
        "Con la remuneración computable (RC) y los meses completos (M) listos, la fórmula de la gratificación ordinaria o trunca es directa: (RC / 6) * M, descontando 1/30 de un sexto por cada día de falta injustificada si existieran ausencias no justificadas en el periodo.",
        "A ese monto se le suma la bonificación extraordinaria temporal de la Ley 30334, que equivale al aporte que el empleador deja de pagar a EsSalud (9 %) o al crédito correspondiente cuando el trabajador está afiliado a una EPS (6,75 %). Esta bonificación no está sujeta a aportes previsionales (ONP ni AFP), aunque sí forma parte de la base proyectada para el cálculo de la renta de quinta categoría.",
        "Asimismo, la propia gratificación tampoco sufre descuentos de AFP, ONP ni seguro social de salud, salvo retención de quinta categoría (si supera las 7 UIT anuales) o descuentos ordenados por mandato judicial (como pensión de alimentos).",
      ],
      codigos: [
        {
          titulo: "Gratificación proporcional, bonificación extraordinaria y total a pagar",
          lenguaje: "excel",
          codigo: `=REDONDEAR((I2/Parametros!$B$7)*J2 - (I2/Parametros!$B$7/30)*K2; 2)`,
          codigoEn: `=ROUND((I2/Parametros!$B$7)*J2 - (I2/Parametros!$B$7/30)*K2, 2)`,
          nota: "I2 = Remuneración computable; J2 = Meses completos del semestre (0 a 6); K2 = Días de falta injustificada en el semestre.",
        },
        {
          titulo: "Bonificación extraordinaria según afiliación (EsSalud 9 % o EPS 6,75 %)",
          lenguaje: "excel",
          codigo: `=REDONDEAR(L2 * SI(M2="EPS"; Parametros!$B$6; Parametros!$B$5); 2)`,
          codigoEn: `=ROUND(L2 * IF(M2="EPS", Parametros!$B$6, Parametros!$B$5), 2)`,
          nota: "L2 = Gratificación calculada en el paso anterior; M2 = Sistema de salud ('EsSalud' o 'EPS'). El total bruto antes de 5ta categoría es =L2+N2.",
        },
      ],
    },
    {
      id: "validacion-plazos-y-regimen",
      titulo: "5. Validar plazos legales de pago y reglas de gratificación trunca",
      esPasoHowTo: true,
      resumenHowTo:
        "Verifica las fechas límite de depósito (15 de julio y 15 de diciembre) y la regla de pago dentro de las 48 horas cuando ocurre un cese laboral.",
      parrafos: [
        "El empleador tiene plazo hasta la primera quincena de julio (15 de julio) para pagar la gratificación de Fiestas Patrias y hasta la primera quincena de diciembre (15 de diciembre) para la gratificación de Navidad. Si el día 15 cae sábado, domingo o feriado, conviene programar el abono el día hábil anterior para evitar intereses moratorios y eventuales multas de SUNAFIL.",
        "Cuando el trabajador cesa antes de alcanzar la oportunidad de pago (por ejemplo, renuncia el 20 de octubre), corresponde pagar la gratificación trunca dentro de las 48 horas siguientes al cese junto con su [liquidación de beneficios sociales](/pe/guias/liquidacion-beneficios-sociales-excel). Al igual que la gratificación ordinaria, la trunca se calcula solo por meses calendario completos laborados en el semestre y también lleva la bonificación extraordinaria del 9 % o 6,75 %.",
        "En tu hoja de Excel, agrega una columna de alerta visual con formato condicional o fórmula SI para verificar que ningún trabajador con menos de un mes completo reciba pago erróneo y que el tipo de régimen (General o Pequeña Empresa) aplique el factor 1 o 0,5 respectivamente.",
      ],
      tabla: {
        caption: "Resumen operativo de plazos y reglas de la gratificación en Perú",
        encabezados: [
          "Concepto",
          "Gratificación de Julio",
          "Gratificación de Diciembre",
          "Gratificación Trunca",
        ],
        filas: [
          [
            "Periodo computable",
            "1 de enero al 30 de junio",
            "1 de julio al 31 de diciembre",
            "Meses completos del semestre hasta el cese",
          ],
          [
            "Plazo máximo de pago",
            "15 de julio",
            "15 de diciembre",
            "Dentro de las 48 horas del cese",
          ],
          [
            "Bonificación extraordinaria",
            "9 % (EsSalud) / 6,75 % (EPS)",
            "9 % (EsSalud) / 6,75 % (EPS)",
            "9 % (EsSalud) / 6,75 % (EPS)",
          ],
          [
            "Descuentos previsionales (AFP/ONP)",
            "Inafecta (solo aplica 5ta categoría o judicial)",
            "Inafecta (solo aplica 5ta categoría o judicial)",
            "Inafecta (solo aplica 5ta categoría o judicial)",
          ],
        ],
      },
    },
  ],
  erroresComunes: [
    {
      error: "Prorratear días sueltos en la gratificación",
      causa:
        "Dividir la remuneración entre 180 días y multiplicar por los días calendario trabajados cuando el colaborador ingresó a mitad de mes.",
      solucion:
        "La Ley 27735 exige meses calendario completos dentro del semestre (sextos). Los días sueltos del mes de ingreso o del mes de cese no se pagan en la gratificación.",
    },
    {
      error: "Aplicar descuento de AFP u ONP sobre la gratificación",
      causa:
        "Copiar la misma fórmula de descuentos previsionales de la boleta mensual ordinaria hacia la columna de gratificación.",
      solucion:
        "Por disposición de la Ley 30334, la gratificación y la bonificación extraordinaria están inafectas a aportes previsionales y de salud; solo se retiene renta de quinta categoría si corresponde.",
    },
    {
      error: "Usar 9 % de bonificación para trabajadores con EPS",
      causa:
        "Dejar el 9 % fijo para toda la planilla sin distinguir quiénes tienen cobertura complementaria con una Entidad Prestadora de Salud.",
      solucion:
        "Agrega una columna de tipo de cobertura ('EsSalud' o 'EPS') y vincula la fórmula con SI() a las celdas de tasas en Parametros (9 % vs. 6,75 %).",
    },
    {
      error: "Incluir comisiones esporádicas de 1 o 2 meses en el promedio",
      causa:
        "Promediar todas las columnas de bonos o comisiones sin verificar el requisito de regularidad de tres meses en el semestre.",
      solucion:
        "Usa CONTAR.SI(>0) o una columna auxiliar de conteo de meses con variable y condiciona el promedio con SI(meses>=3; ... ; 0).",
    },
  ],
  plantilla: {
    titulo: "Plantilla de Gratificación en Excel (Perú 2026)",
    descripcion:
      "Descarga el archivo .xlsx listo para usar con la hoja Parametros, cálculo automático de meses completos, remuneración computable, bonificación extraordinaria (9 % / 6,75 %) y resumen por trabajador.",
  },
  plantillaArchivo: {
    recurso: "gratificacion-peru-2026",
    archivoUrl: "/pe/plantillas/gratificacion-peru-2026.xlsx",
    nombreArchivo: "gratificacion-peru-2026.xlsx",
  },
  faqs: [
    {
      q: "¿Cómo se calcula la gratificación si el trabajador ingresó a mitad de mes?",
      a: "Solo se contabilizan los meses calendario completos laborados dentro del semestre (del 1 al 30 o 31 de cada mes). Si ingresó el 10 de febrero, febrero no cuenta para la gratificación de julio y se computan 4 meses completos (marzo a junio), equivalentes a 4/6 de la remuneración computable.",
    },
    {
      q: "¿La bonificación extraordinaria del 9 % o 6,75 % también aplica a la gratificación trunca?",
      a: "Sí. La Ley 30334 establece que el monto que el empleador deja de aportar a EsSalud (9 %) o el crédito correspondiente en caso de EPS (6,75 %) se abona al trabajador como bonificación extraordinaria tanto en gratificaciones ordinarias como en gratificaciones truncas.",
    },
    {
      q: "¿La gratificación está afecta a renta de quinta categoría?",
      a: "Sí. Aunque la gratificación y su bonificación extraordinaria no tienen descuentos de AFP ni ONP, ambas integran la renta bruta anual proyectada del trabajador para determinar si supera las 7 UIT y calcular la retención mensual de quinta categoría.",
    },
    {
      q: "¿Qué pasa si el trabajador tuvo descanso médico o vacaciones en el semestre?",
      a: "Los días de vacaciones gozadas y los días de descanso médico subsidiado por EsSalud (o los primeros 20 días a cargo del empleador) se consideran días efectivamente laborados para el cómputo de la gratificación según el D.S. 005-2002-TR.",
    },
    {
      q: "¿Hasta qué fecha se puede pagar la gratificación sin generar infracción?",
      a: "El plazo legal vence el 15 de julio para la gratificación de Fiestas Patrias y el 15 de diciembre para la gratificación de Navidad. No es prorrogable, por lo que si el día 15 es inhábil se recomienda pagar el día hábil previo.",
    },
  ],
  relacionadas: [
    "calcular-cts-excel",
    "liquidacion-beneficios-sociales-excel",
    "boleta-de-pago-excel",
  ],
  enlacesExternos: [
    {
      label: "Ley 27735 y orientación sobre gratificaciones",
      url: "https://www.gob.pe/mtpe",
      fuente: "Ministerio de Trabajo y Promoción del Empleo (MTPE)",
    },
    {
      label: "Orientación tributaria sobre inafectación de gratificaciones",
      url: "https://www.sunat.gob.pe/",
      fuente: "SUNAT",
    },
  ],
  enlacesInternosExtra: [
    {
      label: "Curso de Excel en vivo (Perú)",
      href: "/pe/cursos/excel",
      descripcion: "Aprende fórmulas laborales, tablas dinámicas y automatización de planillas.",
    },
    {
      label: "Datos económicos e indicadores de Perú",
      href: "/pe/datos",
      descripcion: "Consulta indicadores de referencia y contexto económico para tus reportes.",
    },
    {
      label: "Carreras y sueldos en Perú",
      href: "/pe/datos/carreras",
      descripcion: "Explora bandas salariales y demanda laboral por carrera profesional.",
    },
  ],
};

export default guia;
