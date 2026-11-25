import type { GuiaPasoAPaso } from "@/lib/guias/paso-a-paso-tipos";

export const guia: GuiaPasoAPaso = {
  slug: "boleta-de-pago-excel",
  pais: "pe",
  title: "Cómo hacer una boleta de pago en Excel (Perú 2026)",
  meta: "Arma una boleta de pago en Excel (Perú): ingresos, asignación familiar, ONP 13 % o AFP según SBS, renta de quinta categoría y aporte EsSalud 9 %.",
  h1: "Cómo hacer una boleta de pago en Excel (Perú 2026)",
  subtitle:
    "Diseña una boleta de pago mensual en Excel conectada a una hoja Parametros con asignación familiar (10 % RMV), ONP (13 %) o AFP (10 % + comisión y prima variables desde sbs.gob.pe), retención de 5ta categoría y aporte del empleador a EsSalud (9 %).",
  keywordPrincipal: "boleta de pago en excel peru",
  keywords: [
    "boleta de pago en excel peru",
    "formato boleta de pago excel peru",
    "calculo afp onp essalud excel",
    "planilla mensual excel peru 2026",
  ],
  curso: "excel",
  cursoSecundario: "power-bi",
  herramienta: "Excel",
  nivel: "Básico",
  updated: "2026-11-25",
  published: "2026-11-25",
  totalTimeIso: "PT30M",
  en30Segundos: {
    queLogras:
      "Un libro de Excel con tres hojas (Parametros, Planilla y Boleta) que calcula los ingresos brutos del mes, aplica automáticamente ONP (13 %) o la AFP correspondiente (10 % + comisión y prima de seguro de sbs.gob.pe), resta la renta de 5ta categoría y calcula el aporte patronal de EsSalud (9 %).",
    herramienta: "Microsoft Excel (365, 2021 o Web)",
    tiempo: "30 minutos",
    bullets: [
      "Hoja Parametros con fecha de vigencia, RMV vigente, tasa ONP (13 %), tabla de AFP para completar desde sbs.gob.pe y tasa EsSalud (9 %).",
      "Bloque de ingresos con sueldo básico, asignación familiar (10 % de la RMV), horas extras y bonos afectos o no afectos.",
      "Cálculo dinámico de descuentos previsionales usando BUSCARX / BUSCARV según el régimen pensionario del colaborador.",
      "Generación de boleta individual imprimible vinculada por DNI o código de trabajador mediante búsqueda exacta.",
    ],
  },
  rutaVisual: [
    {
      numero: 1,
      titulo: "Parámetros y SBS",
      resumen: "Centraliza RMV, ONP 13 %, EsSalud 9 % y tabla AFP desde sbs.gob.pe.",
      anchorId: "parametros-boleta-peru",
      icono: "database",
    },
    {
      numero: 2,
      titulo: "Ingresos y horas extra",
      resumen: "Calcula sueldo básico, asignación familiar y recargo de horas extras.",
      anchorId: "ingresos-afectos-boleta",
      icono: "table",
    },
    {
      numero: 3,
      titulo: "ONP y AFP",
      resumen: "Aplica 13 % para ONP o el 10 % + comisión + prima de seguro para AFP.",
      anchorId: "descuentos-onp-afp",
      icono: "shield",
    },
    {
      numero: 4,
      titulo: "5ta categoría y EsSalud",
      resumen: "Integra la retención de quinta y calcula el aporte patronal del 9 %.",
      anchorId: "quinta-categoria-y-essalud",
      icono: "code",
    },
    {
      numero: 5,
      titulo: "Formato de boleta",
      resumen: "Vincula la planilla a una boleta individual lista para imprimir o exportar.",
      anchorId: "formato-boleta-individual",
      icono: "check",
    },
  ],
  requisitos: {
    version: "Excel 365, Excel 2021 o Excel para la Web (BUSCARV funciona en todas; BUSCARX en 365/2021/Web)",
    lista: [
      "Microsoft Excel en Windows, macOS o versión Web.",
      "Tabla mensual vigente de comisiones y primas de seguro de las AFP (Habitat, Integra, Prima, Profuturo) consultada en sbs.gob.pe.",
      "RMV vigente publicada en gob.pe/mtpe y cálculo previo de retención de renta de quinta categoría si el trabajador supera las 7 UIT.",
    ],
    compatibilidadMacWeb:
      "Las fórmulas propuestas (SI, REDONDEAR, BUSCARV/BUSCARX, MIN) operan de forma idéntica en Windows, macOS y Excel Web. Usa punto y coma (;) en Excel en español o coma (,) en Excel en inglés.",
    avisoEducativo:
      "Guía educativa referencial conforme al D.S. 001-98-TR (boletas de pago). Verifica mensualmente las tasas de AFP en sbs.gob.pe y la normativa laboral en gob.pe antes de emitir boletas oficiales.",
  },
  herramientasHowTo: ["Microsoft Excel 365 / 2021 / Web"],
  insumosHowTo: [
    "Comisiones y prima de seguro vigentes de AFP (sbs.gob.pe)",
    "Control de asistencia, horas extras y retención de 5ta categoría del mes",
  ],
  secciones: [
    {
      id: "parametros-boleta-peru",
      titulo: "1. Armar la hoja Parametros con tasas legales y tabla AFP de SBS",
      esPasoHowTo: true,
      resumenHowTo:
        "Crea la hoja Parametros con fecha de vigencia, RMV, tasa ONP (13 %), tasa EsSalud (9 %) y una tabla de AFP con columnas separadas para aporte (10 %), prima de seguro y comisión.",
      parrafos: [
        "En Perú, las comisiones sobre flujo o mixta y la prima de seguro del Sistema Privado de Pensiones (SPP) cambian periódicamente según las licitaciones y publicaciones de la Superintendencia de Banca, Seguros y AFP (sbs.gob.pe). Por eso, nunca escribas porcentajes de AFP directamente dentro de tus fórmulas de planilla.",
        "Crea una hoja Parametros con una celda de Fecha_Vigencia, la RMV vigente (gob.pe/mtpe), la tasa fija de ONP (13 %), el aporte obligatorio al fondo AFP (10 %) y el aporte del empleador a EsSalud (9 %, considerando el mínimo sobre la RMV cuando aplique). Debajo, arma una tabla tblAFP con las filas de cada AFP y esquema (Flujo / Mixta) donde completes las tasas variables vigentes desde sbs.gob.pe.",
        "Esta estructura te permite actualizar una sola tabla al inicio de cada mes y mantener intactas todas las fórmulas de tu planilla y boleta individual.",
      ],
      tabla: {
        caption: "Estructura de Parametros para Boleta de Pago en Perú (completar tasas variables desde sbs.gob.pe)",
        encabezados: [
          "Parámetro / Concepto",
          "Valor / Regla",
          "Quién asume",
          "Fuente oficial",
        ],
        filas: [
          [
            "Fecha de vigencia",
            "2026-11-25 (actualizar cada mes)",
            "Control de nómina",
            "Gestión interna",
          ],
          [
            "RMV y Asignación familiar",
            "Asignación familiar = 10 % RMV vigente",
            "Empleador (ingreso)",
            "gob.pe/mtpe",
          ],
          [
            "ONP (Sistema Nacional)",
            "13 % (0,13)",
            "Descuento al trabajador",
            "onp.gob.pe / sunat.gob.pe",
          ],
          [
            "AFP — Aporte obligatorio",
            "10 % (0,10)",
            "Descuento al trabajador",
            "sbs.gob.pe",
          ],
          [
            "AFP — Prima de seguro y Comisión",
            "[Completar tasas vigentes del mes desde sbs.gob.pe]",
            "Descuento al trabajador",
            "sbs.gob.pe",
          ],
          [
            "EsSalud",
            "9 % (0,09) sobre remuneración asegurable",
            "Aporte del empleador",
            "essalud.gob.pe / sunat.gob.pe",
          ],
        ],
      },
    },
    {
      id: "ingresos-afectos-boleta",
      titulo: "2. Registrar ingresos mensuales, asignación familiar y horas extras",
      esPasoHowTo: true,
      resumenHowTo:
        "Calcula el sueldo proporcional a días trabajados, suma la asignación familiar (10 % de la RMV) y aplica los recargos legales de 25 % y 35 % para horas extras.",
      parrafos: [
        "En la hoja Planilla, cada fila representa a un trabajador. El primer bloque agrupa los ingresos afectos: sueldo básico (prorrateado entre 30 si hubo faltas o ingreso a mitad de mes), asignación familiar (10 % de la RMV vigente si tiene carga familiar acreditada) y horas extras.",
        "De acuerdo con el T.U.O. de la Ley de Jornada de Trabajo (D.S. 007-2002-TR), las dos primeras horas extras diarias tienen un recargo mínimo del 25 % sobre el valor hora ordinario, y a partir de la tercera hora el recargo mínimo es del 35 %. Para hallar el valor hora en un mes estándar de 30 días y jornada de 8 horas, divides la remuneración ordinaria mensual entre 240.",
        "Si además otorgas conceptos no remunerativos según el artículo 19 del D.S. 001-97-TR (como movilidad supeditada a asistencia o refrigerio que no sea alimentación principal), colócalos en una columna aparte de «Ingresos no afectos» para no inflar erróneamente la base de AFP, ONP ni EsSalud.",
      ],
      codigos: [
        {
          titulo: "Fórmula de valor de horas extras (25 % y 35 %) en Excel",
          lenguaje: "excel",
          codigo: `=REDONDEAR(((B2+C2)/240)*1,25*D2 + ((B2+C2)/240)*1,35*E2; 2)`,
          codigoEn: `=ROUND(((B2+C2)/240)*1.25*D2 + ((B2+C2)/240)*1.35*E2, 2)`,
          nota: "B2 = Sueldo básico; C2 = Asignación familiar; D2 = Horas extras al 25 %; E2 = Horas extras al 35 %. Base 240 = 30 días × 8 horas.",
        },
      ],
    },
    {
      id: "descuentos-onp-afp",
      titulo: "3. Calcular descuentos de ONP (13 %) o AFP (según tabla SBS)",
      esPasoHowTo: true,
      resumenHowTo:
        "Usa SI y BUSCARV sobre tblAFP para aplicar el 13 % a trabajadores en ONP o sumar el 10 % obligatorio, la prima de seguro (con tope SBS) y la comisión de la AFP.",
      parrafos: [
        "Todo trabajador dependiente en planilla elige entre el Sistema Nacional de Pensiones (ONP), cuya tasa única es 13 % sobre la remuneración asegurable, o una Administradora de Fondos de Pensiones (AFP). En el caso de AFP, el descuento se compone de tres partes: 10 % de aporte obligatorio al fondo, un porcentaje de comisión (sobre flujo o saldo) y la prima de seguro de invalidez, sobrevivencia y sepelio.",
        "Ten en cuenta un detalle técnico importante: en las AFP, la prima de seguro tiene una remuneración máxima asegurable trimestral publicada por la SBS (sbs.gob.pe). En Excel puedes incorporar esa celda de tope en Parametros y aplicar MIN(Base_Afecta; Tope_Seguro_SBS) al calcular la prima de seguro, mientras que el 10 % obligatorio y la comisión sobre flujo sí se aplican sobre el total de la remuneración afecta.",
      ],
      codigos: [
        {
          titulo: "Fórmula integrada de descuento previsional (ONP 13 % o AFP completa)",
          lenguaje: "excel",
          codigo: `=SI(G2="ONP"; REDONDEAR(F2*Parametros!$B$5; 2); REDONDEAR(F2*0,10 + MIN(F2;Parametros!$B$8)*BUSCARV(G2;Parametros!$D$3:$F$10;2;FALSO) + F2*BUSCARV(G2;Parametros!$D$3:$F$10;3;FALSO); 2))`,
          codigoEn: `=IF(G2="ONP", ROUND(F2*Parametros!$B$5, 2), ROUND(F2*0.10 + MIN(F2,Parametros!$B$8)*VLOOKUP(G2,Parametros!$D$3:$F$10,2,FALSE) + F2*VLOOKUP(G2,Parametros!$D$3:$F$10,3,FALSE), 2))`,
          nota: "F2 = Total ingresos afectos; G2 = Régimen ('ONP' o nombre exacto de AFP + esquema); Parametros!$B$5 = 0,13 (ONP); Parametros!$B$8 = Tope seguro SBS; col. 2 = Prima seguro; col. 3 = Comisión sobre flujo (0 % si es mixta sobre saldo).",
        },
      ],
    },
    {
      id: "quinta-categoria-y-essalud",
      titulo: "4. Sumar retención de 5ta categoría, neto a pagar y EsSalud (9 %)",
      esPasoHowTo: true,
      resumenHowTo:
        "Resta la retención de renta de quinta categoría para obtener el neto a pagar y calcula en columna informativa el aporte del empleador a EsSalud (9 %).",
      parrafos: [
        "Luego de los descuentos previsionales, descuenta la retención mensual de renta de quinta categoría si el trabajador supera las 7 UIT proyectadas en el año (S/ 38.500 en 2026). Puedes traer ese valor directamente desde la plantilla de nuestra guía de [renta de quinta categoría en Excel](/pe/guias/renta-quinta-categoria-excel).",
        "El Neto a Pagar resulta de restar el descuento de pensión (ONP o AFP), la retención de quinta categoría y otros descuentos autorizados o judiciales al Total de Ingresos.",
        "Por último, agrega una columna para el aporte obligatorio del empleador a EsSalud equivalente al 9 % de la remuneración asegurable. Recuerda que, por regla general, la base imponible mínima mensual de EsSalud equivale a una RMV vigente aunque el trabajador haya percibido un monto menor en el mes (salvo excepciones normativas específicas).",
      ],
      codigos: [
        {
          titulo: "Fórmula del aporte patronal a EsSalud (9 % con base mínima de 1 RMV)",
          lenguaje: "excel",
          codigo: `=REDONDEAR(MAX(F2; Parametros!$B$3) * Parametros!$B$6; 2)`,
          codigoEn: `=ROUND(MAX(F2, Parametros!$B$3) * Parametros!$B$6, 2)`,
          nota: "F2 = Total ingresos afectos del trabajador; Parametros!$B$3 = RMV vigente; Parametros!$B$6 = 0,09 (9 % EsSalud). Este monto no se descuenta del sueldo del trabajador.",
        },
      ],
    },
    {
      id: "formato-boleta-individual",
      titulo: "5. Vincular la planilla a una boleta de pago individual imprimible",
      esPasoHowTo: true,
      resumenHowTo:
        "Crea una tercera hoja Boleta con lista desplegable por DNI o código que jale automáticamente ingresos, descuentos, neto y aportes del empleador.",
      parrafos: [
        "Para no editar boletas una por una, diseña una tercera hoja llamada Boleta con la estructura formal exigida por el D.S. 001-98-TR: datos del empleador (RUC y razón social), datos del trabajador (DNI, cargo, fecha de ingreso, régimen pensionario, CUSPP si está en AFP), columna de Ingresos, columna de Descuentos del trabajador y bloque de Aportes del empleador (EsSalud).",
        "En la celda del DNI o código de trabajador en la hoja Boleta, aplica Validación de Datos (Lista) apuntando a la columna de DNI de la hoja Planilla. Luego usa BUSCARV o BUSCARX en cada concepto de la boleta para que, con solo elegir un DNI, se actualicen todos los importes listos para exportar a PDF y entregar al colaborador dentro de los tres días hábiles siguientes al pago.",
      ],
      alerta: {
        tipo: "tip",
        titulo: "De la boleta mensual al control gerencial",
        texto:
          "Cuando necesites analizar el costo total de nómina por centro de costos o comparar meses, puedes conectar esta hoja Planilla directamente a Power BI y cruzarla con presupuestos.",
      },
    },
  ],
  erroresComunes: [
    {
      error: "Restar el 9 % de EsSalud del sueldo del trabajador",
      causa:
        "Colocar EsSalud dentro de la columna de descuentos en la boleta en lugar de la sección de aportes del empleador.",
      solucion:
        "El aporte del 9 % a EsSalud lo asume íntegramente el empleador; solo debe mostrarse como dato informativo en la boleta, nunca restarse del neto a pagar.",
    },
    {
      error: "Aplicar comisiones de AFP desactualizadas",
      causa:
        "Copiar porcentajes de años anteriores sin revisar el portal oficial de la SBS.",
      solucion:
        "Consulta sbs.gob.pe al inicio de cada mes y actualiza la tabla tblAFP en la hoja Parametros, registrando la nueva fecha de vigencia.",
    },
    {
      error: "Descontar ONP o AFP sobre conceptos no remunerativos",
      causa:
        "Incluir movilidad de asistencia o viáticos dentro de la celda de Total Afecto.",
      solucion:
        "Separa en columnas distintas los «Ingresos afectos» y los «Ingresos no afectos» antes de multiplicar por las tasas previsionales y de EsSalud.",
    },
    {
      error: "Calcular EsSalud por debajo de la RMV en jornadas completas",
      causa:
        "Multiplicar directamente el 9 % sobre un ingreso menor a la RMV por faltas o licencias sin goce.",
      solucion:
        "Usa MAX(Base_Afecta; RMV_Vigente) * 0,09 para respetar la base imponible mínima legal de EsSalud.",
    },
  ],
  plantilla: {
    titulo: "Plantilla de Boleta de Pago en Excel (Perú 2026)",
    descripcion:
      "Descarga el archivo .xlsx con hoja Parametros (ONP 13 %, EsSalud 9 % y tabla AFP para completar desde sbs.gob.pe), planilla mensual y boleta individual automática lista para PDF.",
  },
  plantillaArchivo: {
    recurso: "boleta-de-pago-peru-2026",
    archivoUrl: "/pe/plantillas/boleta-de-pago-peru-2026.xlsx",
    nombreArchivo: "boleta-de-pago-peru-2026.xlsx",
  },
  faqs: [
    {
      q: "¿Dónde consulto las tasas vigentes de comisión y prima de seguro de cada AFP?",
      a: "Las tasas oficiales actualizadas de Habitat, Integra, Prima y Profuturo (tanto comisión sobre flujo como comisión mixta, prima de seguro y tope máximo asegurable) se publican mensualmente en el portal de la Superintendencia de Banca, Seguros y AFP (sbs.gob.pe).",
    },
    {
      q: "¿Cuál es la diferencia entre comisión sobre flujo y comisión mixta en la boleta?",
      a: "En la comisión sobre flujo, la AFP cobra un porcentaje mensual sobre la remuneración bruta afecta del trabajador. En la comisión mixta, el componente sobre flujo es 0 % (desde febrero de 2023) y solo se cobra una comisión anual sobre el saldo acumulado, por lo que en la boleta mensual únicamente se descuenta el 10 % obligatorio y la prima de seguro.",
    },
    {
      q: "¿En qué plazo debe entregarse la boleta de pago al trabajador?",
      a: "Según el D.S. 001-98-TR, la boleta de pago debe entregarse al trabajador a más tardar el tercer día hábil siguiente a la fecha de pago de la remuneración, pudiendo ser física o digital con firma electrónica.",
    },
    {
      q: "¿La asignación familiar se prorratea si el trabajador tuvo faltas en el mes?",
      a: "Según criterio laboral vigente, la asignación familiar (10 % de la RMV) tiene naturaleza remunerativa vinculada a la carga familiar y se abona de forma íntegra mensual, salvo excepciones específicas de suspensión perfecta o ausencia total en el mes.",
    },
    {
      q: "¿Cómo se refleja la gratificación en la boleta de pago de julio o diciembre?",
      a: "La gratificación ordinaria y la bonificación extraordinaria del 9 % o 6,75 % aparecen en el bloque de ingresos, pero no deben sumarse a la base de descuentos de ONP/AFP ni al aporte de EsSalud.",
    },
  ],
  relacionadas: [
    "renta-quinta-categoria-excel",
    "calcular-gratificacion-excel",
    "calcular-cts-excel",
  ],
  enlacesExternos: [
    {
      label: "Comisiones y primas de seguro AFP vigentes",
      url: "https://www.sbs.gob.pe/",
      fuente: "Superintendencia de Banca, Seguros y AFP (SBS)",
    },
    {
      label: "Normativa sobre boletas de pago y RMV (MTPE)",
      url: "https://www.gob.pe/mtpe",
      fuente: "Ministerio de Trabajo y Promoción del Empleo (MTPE)",
    },
  ],
  enlacesInternosExtra: [
    {
      label: "Curso de Excel en vivo (Perú)",
      href: "/pe/cursos/excel",
      descripcion: "Aprende a crear planillas automáticas, validaciones y reportes en Excel.",
    },
    {
      label: "Datos económicos de Perú",
      href: "/pe/datos",
      descripcion: "Indicadores económicos actualizados para gestión financiera y laboral.",
    },
    {
      label: "Carreras y sueldos en Perú",
      href: "/pe/datos/carreras",
      descripcion: "Consulta remuneraciones promedio por carrera profesional en Perú.",
    },
  ],
};

export default guia;
