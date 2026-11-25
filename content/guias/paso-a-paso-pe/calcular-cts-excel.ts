import type { GuiaPasoAPaso } from "@/lib/guias/paso-a-paso-tipos";

export const guia: GuiaPasoAPaso = {
  slug: "calcular-cts-excel",
  pais: "pe",
  title: "Cómo calcular CTS en Excel (Perú 2026) paso a paso",
  meta: "Calcula la CTS en Excel según el D.S. 001-97-TR: remuneración computable, 1/6 de gratificación, depósitos mayo y noviembre y CTS trunca descargable.",
  h1: "Cómo calcular la CTS en Excel (Perú 2026)",
  subtitle:
    "Construye una planilla en Excel bajo el D.S. 001-97-TR para calcular la Remuneración Computable con 1/6 de gratificación, prorratear meses y días del semestre (noviembre-abril y mayo-octubre) y obtener la CTS trunca.",
  keywordPrincipal: "como calcular cts en excel peru",
  keywords: [
    "como calcular cts en excel peru",
    "formula cts 1/6 gratificacion excel",
    "deposito cts mayo noviembre excel",
    "cts trunca excel peru",
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
      "Un libro de Excel estructurado para determinar la Remuneración Computable de CTS (sueldo + asignación familiar + 1/6 de la última gratificación + promedio de variables), calcular meses y días exactos del semestre y validar depósitos semestrales o CTS trunca.",
    herramienta: "Microsoft Excel (365, 2021 o Web)",
    tiempo: "25 minutos",
    bullets: [
      "Hoja Parametros con divisor anual (12 meses), divisor diario (360 días), fechas de corte semestral y RMV vigente.",
      "Cálculo automático de un sexto (1/6) de la última gratificación percibida para sumarlo a la Remuneración Computable.",
      "Diferenciación clara entre meses completos (RC / 12 × meses) y días calendario adicionales (RC / 360 × días).",
      "Soporte para depósito semestral (15 de mayo y 15 de noviembre) y CTS trunca por cese laboral.",
    ],
  },
  rutaVisual: [
    {
      numero: 1,
      titulo: "Parámetros CTS",
      resumen: "Define divisores legales (12 y 360), periodos semestrales y RMV.",
      anchorId: "parametros-legales-cts",
      icono: "database",
    },
    {
      numero: 2,
      titulo: "1/6 de gratificación",
      resumen: "Incorpora la sexta parte de la última gratificación y variables regulares.",
      anchorId: "remuneracion-computable-cts",
      icono: "table",
    },
    {
      numero: 3,
      titulo: "Meses y días",
      resumen: "Separa los meses completos de los días sueltos dentro del semestre.",
      anchorId: "calculo-meses-y-dias",
      icono: "calendar",
    },
    {
      numero: 4,
      titulo: "Depósito semestral",
      resumen: "Aplica la fórmula legal de depósito y verifica el régimen de la empresa.",
      anchorId: "formula-deposito-cts",
      icono: "code",
    },
    {
      numero: 5,
      titulo: "CTS trunca y plazos",
      resumen: "Calcula la CTS al cese y controla las fechas límite (15 mayo / 15 nov).",
      anchorId: "cts-trunca-y-plazos",
      icono: "check",
    },
  ],
  requisitos: {
    version: "Excel 365, Excel 2021 o Excel para la Web (compatible también con Excel 2016/2019)",
    lista: [
      "Microsoft Excel en Windows, macOS o versión Web.",
      "Última gratificación ordinaria percibida por el trabajador (julio o diciembre, según el semestre a liquidar).",
      "Registro de fechas de ingreso, días laborados, inasistencias injustificadas y monto de comisiones o bonos variables.",
    ],
    compatibilidadMacWeb:
      "Todas las fórmulas empleadas (ENTERO, REDONDEAR, SI, MIN, MAX, SIFECHA) operan igual en Windows, macOS y Excel Web. Utiliza punto y coma (;) si tu Excel está en español o coma (,) si está en inglés.",
    avisoEducativo:
      "Guía educativa referencial basada en el T.U.O. de la Ley de CTS (D.S. 001-97-TR). Confirma el régimen laboral aplicable y la normativa vigente en gob.pe antes de efectuar depósitos bancarios reales.",
  },
  herramientasHowTo: ["Microsoft Excel 365 / 2021 / Web"],
  insumosHowTo: [
    "Boletas del semestre para verificar remuneración fija y variables",
    "Constancia de última gratificación percibida en el semestre previo",
  ],
  secciones: [
    {
      id: "parametros-legales-cts",
      titulo: "1. Configurar la hoja Parametros con reglas del D.S. 001-97-TR",
      esPasoHowTo: true,
      resumenHowTo:
        "Crea una hoja Parametros con los divisores legales de CTS (12 meses y 360 días), el factor 1/6 de gratificación, la RMV vigente y los topes de días no computables.",
      parrafos: [
        "La Compensación por Tiempo de Servicios (CTS) tiene una mecánica distinta a la gratificación. Mientras la gratificación solo reconoce meses calendario completos, la CTS sí computa tanto meses completos como días adicionales laborados dentro del semestre.",
        "Para evitar errores al replicar la planilla cada mayo y noviembre, comienza creando una hoja llamada Parametros donde almacenes los divisores legales del D.S. 001-97-TR: 12 para los meses del año, 360 para el año comercial en días, 6 para el sexto de gratificación y la Remuneración Mínima Vital (RMV) vigente publicada por el Ministerio de Trabajo (gob.pe/mtpe).",
        "También conviene incluir una celda con el factor del régimen laboral (1 para Régimen General y 0,5 para Pequeña Empresa inscrita en REMYPE), de modo que el libro sirva para distintos tipos de empleadores sin modificar la lógica de las fórmulas.",
      ],
      tabla: {
        caption: "Parámetros de referencia para el cálculo de CTS en Excel (D.S. 001-97-TR)",
        encabezados: [
          "Celda",
          "Parámetro",
          "Valor / Fórmula",
          "Base legal / Fuente",
        ],
        filas: [
          [
            "Parametros!B2",
            "Fecha de vigencia",
            "2026-11-25",
            "Control de cierre semestral",
          ],
          [
            "Parametros!B3",
            "RMV vigente (S/)",
            "[Ingresar RMV vigente según MTPE]",
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
            "Divisor meses año",
            "12",
            "D.S. 001-97-TR",
          ],
          [
            "Parametros!B6",
            "Divisor días año comercial",
            "360",
            "D.S. 001-97-TR",
          ],
          [
            "Parametros!B7",
            "Divisor sexto de gratificación",
            "6",
            "D.S. 001-97-TR",
          ],
        ],
      },
    },
    {
      id: "remuneracion-computable-cts",
      titulo: "2. Calcular la Remuneración Computable con 1/6 de gratificación",
      esPasoHowTo: true,
      resumenHowTo:
        "Suma el sueldo básico vigente al 30 de abril o 31 de octubre, la asignación familiar, el promedio de variables regulares y un sexto de la última gratificación.",
      parrafos: [
        "De acuerdo con el D.S. 001-97-TR, la Remuneración Computable (RC) para el depósito de mayo se determina con la remuneración vigente al 30 de abril, y para el depósito de noviembre con la remuneración vigente al 31 de octubre. Se incluyen todos los montos percibidos regularmente en dinero o en especie que sean de libre disposición.",
        "Un componente clave es el sexto (1/6) de la última gratificación ordinaria percibida. Para el depósito de mayo (semestre noviembre-abril), se toma 1/6 de la gratificación de diciembre del año anterior; para el depósito de noviembre (semestre mayo-octubre), se toma 1/6 de la gratificación de julio del mismo año. Ten en cuenta que la bonificación extraordinaria del 9 % o 6,75 % no forma parte del cálculo de 1/6.",
        "Si el trabajador recibió comisiones, horas extras o bonos variables durante al menos tres meses dentro del semestre evaluado, se suma el total percibido en el semestre y se divide entre 6 (o entre los meses laborados si ingresó luego de iniciado el semestre).",
      ],
      codigos: [
        {
          titulo: "Fórmula de Remuneración Computable (RC) para CTS",
          lenguaje: "excel",
          codigo: `=B2 + SI(C2="Sí";Parametros!$B$4;0) + REDONDEAR(D2/Parametros!$B$7;2) + SI(E2>=3;REDONDEAR(F2/G2;2);0)`,
          codigoEn: `=B2 + IF(C2="Sí",Parametros!$B$4,0) + ROUND(D2/Parametros!$B$7,2) + IF(E2>=3,ROUND(F2/G2,2),0)`,
          nota: "B2 = Sueldo básico; C2 = Asignación familiar ('Sí'/'No'); D2 = Última gratificación ordinaria (sin bonificación extraordinaria); E2 = Meses con variable en el semestre; F2 = Suma de variables del semestre; G2 = Meses del periodo (6 si laboró el semestre completo).",
        },
      ],
    },
    {
      id: "calculo-meses-y-dias",
      titulo: "3. Contabilizar meses completos y días sueltos en el semestre",
      esPasoHowTo: true,
      resumenHowTo:
        "Determina la fecha de inicio efectiva en el semestre (1 de noviembre o 1 de mayo, o la fecha de ingreso si es posterior) y descompón el tiempo en meses enteros y días restantes.",
      parrafos: [
        "Para calcular correctamente los depósitos de CTS, los periodos semestrales son fijos: del 1 de noviembre al 30 de abril (depósito hasta el 15 de mayo) y del 1 de mayo al 31 de octubre (depósito hasta el 15 de noviembre). Si el trabajador laboró todo el semestre sin faltas injustificadas, simplemente tiene 6 meses completos y 0 días sueltos.",
        "Cuando el colaborador ingresó a mitad del semestre (por ejemplo, el 12 de febrero dentro del semestre noviembre-abril), el periodo computable empieza el 12 de febrero y termina el 30 de abril. En ese caso, febrero aporta 19 días (considerando mes comercial de 30 días o los días efectivos según práctica de cálculo sobre fracción de mes: del 12 al 30 hay 19 días), mientras que marzo y abril aportan 2 meses completos.",
        "En Excel, la función SIFECHA con los argumentos \"m\" y \"md\" permite separar los meses completos y los días sobrantes entre dos fechas. Además, debes restar las faltas injustificadas y los días de descanso médico que excedan los 60 días al año.",
      ],
      codigos: [
        {
          titulo: "Separación de meses completos y días adicionales con SIFECHA",
          lenguaje: "excel",
          codigo: `=SIFECHA(MAX(H2;I2); J2+1; "m")`,
          codigoEn: `=DATEDIF(MAX(H2,I2), J2+1, "m")`,
          nota: "H2 = Fecha de ingreso; I2 = Inicio del semestre (ej. 01/05/2026); J2 = Fin del semestre o fecha de cese (ej. 31/10/2026). Se suma 1 día a J2 para incluir el último día trabajado en el conteo de meses completos.",
        },
        {
          titulo: "Días adicionales después de los meses completos",
          lenguaje: "excel",
          codigo: `=MAX(0; SIFECHA(MAX(H2;I2); J2+1; "md") - K2)`,
          codigoEn: `=MAX(0, DATEDIF(MAX(H2,I2), J2+1, "md") - K2)`,
          nota: "K2 = Días de falta injustificada o exceso de descanso médico no computable (>60 días en el año). Si el resultado fuera negativo frente a meses completos, ajusta primero restando días.",
        },
      ],
      alerta: {
        tipo: "tip",
        titulo: "Sobre SIFECHA en Excel",
        texto:
          "Aunque SIFECHA (DATEDIF en inglés) no aparece en el autocompletado de Excel, sigue funcionando en todas las versiones de escritorio y Excel Web. Si prefieres evitarla, puedes calcular meses y días con AÑO(), MES() y DIA() en base comercial de 30 días.",
      },
    },
    {
      id: "formula-deposito-cts",
      titulo: "4. Aplicar la fórmula del depósito semestral de CTS",
      esPasoHowTo: true,
      resumenHowTo:
        "Suma el tramo por meses completos (RC / 12 × meses) y el tramo por días (RC / 360 × días), aplicando el factor del régimen laboral.",
      parrafos: [
        "Con la Remuneración Computable (RC), los meses completos (M) y los días adicionales (D) ya calculados, la fórmula legal de CTS suma dos componentes: (RC / 12) * M + (RC / 360) * D.",
        "Este cálculo garantiza que cada mes completo equivalga exactamente a un doceavo de la remuneración computable y cada día suelto a un trescientos sesentavo. Si la empresa pertenece al régimen de Pequeña Empresa (REMYPE), multiplica el resultado por 0,5 (equivale a 15 remuneraciones diarias por año en lugar de 30).",
        "La CTS no está afecta a descuentos de AFP, ONP, EsSalud ni renta de quinta categoría, ya que su finalidad es servir de contingencia ante el desempleo. Recuerda que debes entregar al trabajador la hoja de liquidación de CTS dentro de los cinco días hábiles siguientes al depósito.",
      ],
      codigos: [
        {
          titulo: "Fórmula final del depósito de CTS en Excel",
          lenguaje: "excel",
          codigo: `=REDONDEAR(((L2/Parametros!$B$5)*M2 + (L2/Parametros!$B$6)*N2) * SI(O2="Pequeña Empresa";0,5;1); 2)`,
          codigoEn: `=ROUND(((L2/Parametros!$B$5)*M2 + (L2/Parametros!$B$6)*N2) * IF(O2="Pequeña Empresa",0.5,1), 2)`,
          nota: "L2 = Remuneración Computable (RC); M2 = Meses completos; N2 = Días adicionales; O2 = Régimen laboral ('General' o 'Pequeña Empresa').",
        },
      ],
    },
    {
      id: "cts-trunca-y-plazos",
      titulo: "5. Calcular la CTS trunca al cese y controlar plazos",
      esPasoHowTo: true,
      resumenHowTo:
        "Aplica la misma fórmula proporcional para los meses y días pendientes desde el último depósito hasta la fecha de cese, pagadera dentro de las 48 horas.",
      parrafos: [
        "Cuando un trabajador termina su vínculo laboral antes del próximo depósito semestral (por ejemplo, cesa el 18 de agosto luego del depósito de mayo), el empleador no deposita ese saldo en el banco, sino que lo paga directamente al trabajador como CTS trunca dentro de su [liquidación de beneficios sociales](/pe/guias/liquidacion-beneficios-sociales-excel) en un plazo máximo de 48 horas.",
        "Ten presente un requisito importante del D.S. 001-97-TR: para tener derecho a la CTS (incluida la trunca), el trabajador debe haber superado al menos un mes completo de servicios desde su fecha de ingreso. Si cesó con 25 días de antigüedad, no se genera CTS trunca.",
        "En tu hoja de Excel, añade una columna de verificación con SI(dias_totales_contrato < 30; 0; calculo_cts) para que la planilla bloquee automáticamente cualquier cálculo en contratos menores a un mes.",
      ],
      tabla: {
        caption: "Calendario semestral de CTS y reglas de cálculo (D.S. 001-97-TR)",
        encabezados: [
          "Concepto",
          "Depósito de Mayo",
          "Depósito de Noviembre",
          "CTS Trunca (Cese)",
        ],
        filas: [
          [
            "Periodo comprendido",
            "1 de noviembre al 30 de abril",
            "1 de mayo al 31 de octubre",
            "Desde el 1 de mayo o 1 de nov hasta el cese",
          ],
          [
            "Fecha límite de pago / depósito",
            "15 de mayo",
            "15 de noviembre",
            "48 horas siguientes al cese",
          ],
          [
            "Gratificación para el 1/6",
            "Gratificación de diciembre anterior",
            "Gratificación de julio del mismo año",
            "Última gratificación ordinaria percibida",
          ],
          [
            "Forma de entrega",
            "Depósito en cuenta CTS bancaria",
            "Depósito en cuenta CTS bancaria",
            "Pago directo en liquidación",
          ],
        ],
      },
    },
  ],
  erroresComunes: [
    {
      error: "Incluir la bonificación extraordinaria del 9 % en el cálculo de 1/6",
      causa:
        "Tomar el monto total abonado en julio o diciembre (gratificación + 9 % EsSalud) en lugar de solo la gratificación ordinaria.",
      solucion:
        "La Ley 30334 precisa que la bonificación extraordinaria no es computable para ningún beneficio social. Divide entre 6 únicamente el monto de la gratificación ordinaria.",
    },
    {
      error: "No calcular CTS cuando el trabajador tiene meses + días sueltos",
      causa:
        "Aplicar la regla de meses completos de la gratificación y descartar los días adicionales del mes de ingreso o cese.",
      solucion:
        "Para CTS siempre se suman los días adicionales usando la tasa diaria (RC / 360 × días), siempre que el trabajador tenga al menos un mes de servicios.",
    },
    {
      error: "Olvidar el límite de 60 días de descanso médico computable",
      causa:
        "Contabilizar todo el año de subsidios por incapacidad temporal sin descontar el exceso sobre los 60 días.",
      solucion:
        "El D.S. 001-97-TR computa hasta 60 días al año por enfermedad o accidente debidamente comprobados; cualquier exceso debe restarse en la columna de días no computables.",
    },
    {
      error: "Pagar CTS trunca a trabajadores con menos de un mes de vínculo",
      causa:
        "Ejecutar la fórmula proporcional sin validar la antigüedad mínima exigida por la ley.",
      solucion:
        "Envuelve la fórmula final en un condicional SI((fecha_cese - fecha_ingreso + 1) < 30; 0; ...) para respetar el mínimo legal de un mes.",
    },
  ],
  plantilla: {
    titulo: "Plantilla de Cálculo de CTS en Excel (Perú 2026)",
    descripcion:
      "Descarga el archivo .xlsx con hoja Parametros, cálculo automático de 1/6 de gratificación, separación de meses y días del semestre, y hoja resumen lista para presentar liquidaciones de CTS.",
  },
  plantillaArchivo: {
    recurso: "cts-peru-2026",
    archivoUrl: "/pe/plantillas/cts-peru-2026.xlsx",
    nombreArchivo: "cts-peru-2026.xlsx",
  },
  faqs: [
    {
      q: "¿Cómo se calcula el 1/6 de gratificación si el trabajador ingresó recientemente y no recibió gratificación en el periodo anterior?",
      a: "Si el trabajador no percibió gratificación ordinaria en julio o diciembre porque ingresó después, el 1/6 de gratificación para ese depósito semestral es S/ 0. Una vez que perciba su primera gratificación ordinaria, se incorpora 1/6 en los depósitos siguientes.",
    },
    {
      q: "¿La CTS se deposita hasta el 15 de mayo y 15 de noviembre aunque caiga fin de semana?",
      a: "El plazo legal vence el 15 de mayo y el 15 de noviembre. Si dicha fecha cae día inhábil, el D.S. 001-97-TR permite efectuar el depósito el primer día hábil siguiente, aunque en la práctica de nómina se recomienda programar la transferencia antes para evitar observaciones.",
    },
    {
      q: "¿Qué ocurre con las horas extras en el cálculo de la CTS?",
      a: "Las horas extras se consideran remuneración variable. Si el trabajador realizó horas extras durante al menos 3 meses dentro del semestre (criterio de regularidad), se suman los montos percibidos en el semestre y se dividen entre 6 para añadir el promedio a la Remuneración Computable.",
    },
    {
      q: "¿Los trabajadores a tiempo parcial (part-time) reciben CTS?",
      a: "No. El D.S. 001-97-TR exige cumplir cuando menos una jornada mínima diaria de cuatro horas en promedio semanal para tener derecho a la Compensación por Tiempo de Servicios.",
    },
    {
      q: "¿La CTS paga Impuesto a la Renta de quinta categoría?",
      a: "No. Tanto los depósitos semestrales de CTS como la CTS trunca pagada al cese están inafectos al Impuesto a la Renta de quinta categoría y a aportes previsionales.",
    },
  ],
  relacionadas: [
    "calcular-gratificacion-excel",
    "liquidacion-beneficios-sociales-excel",
    "boleta-de-pago-excel",
  ],
  enlacesExternos: [
    {
      label: "Información oficial sobre CTS y plazos de depósito",
      url: "https://www.gob.pe/mtpe",
      fuente: "Ministerio de Trabajo y Promoción del Empleo (MTPE)",
    },
    {
      label: "Consultas laborales y fiscalización SUNAFIL",
      url: "https://www.gob.pe/sunafil",
      fuente: "SUNAFIL",
    },
  ],
  enlacesInternosExtra: [
    {
      label: "Curso de Excel en vivo (Perú)",
      href: "/pe/cursos/excel",
      descripcion: "Domina fórmulas de nómina, fechas y tablas dinámicas con casos reales.",
    },
    {
      label: "Datos económicos de Perú",
      href: "/pe/datos",
      descripcion: "Indicadores actualizados para contextualizar presupuestos y planillas.",
    },
    {
      label: "Carreras y sueldos en Perú",
      href: "/pe/datos/carreras",
      descripcion: "Compara remuneraciones y demanda laboral por especialidad.",
    },
  ],
};

export default guia;
