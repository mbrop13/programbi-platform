import type { GuiaPasoAPaso } from "@/lib/guias/paso-a-paso-tipos";

export const guia: GuiaPasoAPaso = {
  slug: "control-de-horas-en-excel",
  title: "Control de horas en Excel: asistencia y horas extra",
  meta: "Registra entradas y salidas en Excel, calcula horas trabajadas, horas extra y atrasos, y resume por trabajador y mes. Paso a paso con fórmulas.",
  h1: "Cómo llevar el control de horas y horas extra en Excel",
  subtitle:
    "Diseña una planilla ordenada para registrar marcas diarias, resolver turnos que cruzan la medianoche sin errores negativos y consolidar totales mensuales por trabajador.",
  keywordPrincipal: "control de horas en Excel",
  keywords: [
    "control de horas en Excel",
    "control de asistencia Excel",
    "horas extra Excel",
    "horas trabajadas turnos medianoche Excel",
  ],
  curso: "excel",
  herramienta: "Excel",
  nivel: "Básico",
  updated: "2026-11-21",
  published: "2026-11-21",
  totalTimeIso: "PT25M",
  en30Segundos: {
    queLogras:
      "Una planilla de asistencia mensual que calcula horas trabajadas (incluso en turnos nocturnos), separa jornada ordinaria de horas extra y resume totales por persona sin perder horas al superar las 24.",
    herramienta: "Microsoft Excel (escritorio o web)",
    tiempo: "25 minutos",
    bullets: [
      "Configurar el formato personalizado [h]:mm para sumar más de 24 horas.",
      "Calcular duración de turnos que pasan la medianoche con RESIDUO.",
      "Separar horas normales, horas extra y atrasos frente a la jornada pactada.",
      "Resumir horas mensuales por trabajador con SUMAR.SI.CONJUNTO.",
    ],
  },
  rutaVisual: [
    {
      numero: 1,
      titulo: "Formato [h]:mm",
      resumen: "Evita que Excel reinicie los totales al pasar de 24 horas.",
      anchorId: "formato-horas-excel",
      icono: "settings",
    },
    {
      numero: 2,
      titulo: "Registro diario",
      resumen: "Arma una tabla estructurada con fechas, turnos y colación.",
      anchorId: "registro-diario-asistencia",
      icono: "table",
    },
    {
      numero: 3,
      titulo: "Turnos nocturnos",
      resumen: "Usa RESIDUO para calcular salidas después de las 00:00.",
      anchorId: "turnos-cruzan-medianoche",
      icono: "code",
    },
    {
      numero: 4,
      titulo: "Horas extra",
      resumen: "Compara lo trabajado contra la jornada diaria pactada.",
      anchorId: "horas-extra-atrasos",
      icono: "sparkles",
    },
    {
      numero: 5,
      titulo: "Resumen mensual",
      resumen: "Consolida por trabajador y mes con SUMAR.SI.CONJUNTO.",
      anchorId: "resumen-trabajador-mes",
      icono: "chart",
    },
    {
      numero: 6,
      titulo: "Marco normativo",
      resumen: "Buenas prácticas de respaldo y consulta en la Dirección del Trabajo.",
      anchorId: "marco-legal-basico",
      icono: "shield",
    },
  ],
  requisitos: {
    version: "Excel 2016 o superior, Microsoft 365 o Excel para la Web",
    lista: [
      "Microsoft Excel instalado en Windows/Mac o acceso a Excel en la Web.",
      "Listado de trabajadores con su jornada diaria pactada (por ejemplo, 08:00 o 09:00).",
      "Registro de marcas de entrada, salida y tiempo de colación en formato de hora (HH:MM).",
    ],
    compatibilidadMacWeb:
      "Todas las fórmulas usadas (RESIDUO, MAX, MIN, SUMAR.SI.CONJUNTO) y el formato personalizado [h]:mm funcionan de forma idéntica en Excel para Windows, macOS y Excel para la Web.",
    avisoEducativo:
      "Esta guía aborda exclusivamente el cálculo técnico en Excel; no constituye asesoría laboral ni reemplaza los sistemas electrónicos exigidos por normativa específica.",
  },
  herramientasHowTo: [
    "Microsoft Excel (2016, Microsoft 365 o Web)",
  ],
  insumosHowTo: [
    "Registro diario de entradas, salidas y colación por trabajador",
    "Jornada diaria pactada de referencia",
  ],
  secciones: [
    {
      id: "formato-horas-excel",
      titulo: "1. Entender el formato de horas en Excel ([h]:mm vs hh:mm)",
      esPasoHowTo: true,
      resumenHowTo:
        "Configura las celdas de totales con el formato personalizado [h]:mm para que Excel acumule horas por encima de las 24 horas sin reiniciar el contador.",
      parrafos: [
        "Antes de escribir una sola fórmula, conviene entender cómo guarda Excel el tiempo. Para Excel, un día completo equivale al número 1, doce horas equivalen a 0,5 y una hora equivale a 1/24 (aproximadamente 0,041667). Cuando escribes 08:30 en una celda, Excel en realidad almacena una fracción decimal y la muestra con aspecto de reloj.",
        "El problema clásico aparece al sumar la semana o el mes de un trabajador. Si sumas cinco jornadas de 08:00, el valor interno es 40/24 = 1,6667 días. Si la celda tiene el formato estándar hh:mm, Excel interpreta el entero (1) como un día calendario completo y muestra únicamente la fracción restante: 16:00. A simple vista parece que la persona trabajó 16 horas en toda la semana, cuando en realidad trabajó 40.",
        "Para corregir esto sin cambiar el valor numérico subyacente, debes aplicar el formato personalizado [h]:mm. Los corchetes alrededor de la letra h le indican a Excel que muestre las horas acumuladas totales, sin reiniciar el reloj cada 24 horas. Este detalle es crítico en cualquier planilla de control de horas en Excel, especialmente en las filas de totales y en los resúmenes mensuales.",
      ],
      lista: [
        "Selecciona las celdas donde calcularás totales semanales o mensuales.",
        "Presiona Ctrl + 1 (en Mac, Cmd + 1) para abrir Formato de celdas.",
        "En la pestaña Número, elige la categoría Personalizada.",
        "En el cuadro Tipo, escribe exactamente [h]:mm (o [h]:mm:ss si registras segundos) y acepta.",
      ],
      tabla: {
        caption: "Comparación de formatos de hora en Excel para registro y totales",
        encabezados: [
          "Formato",
          "Cómo muestra 40 horas",
          "Cómo muestra 08:30",
          "Cuándo usarlo",
        ],
        filas: [
          [
            "hh:mm",
            "16:00 (se reinicia cada 24h)",
            "08:30",
            "Solo para marcas puntuales de reloj (entrada o salida).",
          ],
          [
            "[h]:mm",
            "40:00",
            "08:30",
            "Obligatorio en duración de turnos, horas extra y totales acumulados.",
          ],
          [
            "Decimal (multiplicado por 24)",
            "40,00",
            "8,50",
            "Útil si necesitas multiplicar horas por un valor monetario por hora.",
          ],
          [
            "Texto ('08:30)",
            "No suma (da 0 o #¡VALOR!)",
            "08:30",
            "Evitar siempre; impide calcular diferencias y totales.",
          ],
        ],
      },
      captura: {
        id: "control-de-horas-en-excel-paso-1",
        alt: "Cuadro de diálogo Formato de celdas en Excel con el formato personalizado [h]:mm seleccionado",
        caption:
          "Configuración del formato personalizado [h]:mm para evitar que el total de horas se reinicie al superar las 24 horas.",
        ratio: "16/9",
      },
      alerta: {
        tipo: "tip",
        titulo: "Conversión rápida a horas decimales",
        texto:
          "Si luego necesitas multiplicar las horas trabajadas por un valor hora en pesos, no multipliques directamente la celda [h]:mm por la tarifa. Multiplica por 24 primero: =(TotalHoras*24)*ValorHora, y deja la celda de resultado en formato Moneda o Número.",
      },
    },
    {
      id: "registro-diario-asistencia",
      titulo: "2. Armar la tabla de registro diario sin celdas combinadas",
      esPasoHowTo: true,
      resumenHowTo:
        "Crea una Tabla de Excel (Ctrl + T) con una fila por trabajador y día, evitando celdas combinadas y separando fecha, entrada, salida y colación.",
      parrafos: [
        "Muchas planillas de asistencia fallan porque intentan imitar un calendario impreso con los nombres en filas y los días repartidos en treinta columnas hacia la derecha. Ese diseño dificulta filtrar por trabajador, complica los turnos nocturnos y vuelve frágiles los resúmenes mensuales.",
        "La estructura recomendada es una tabla tabular o «larga»: cada fila representa una jornada de un trabajador en una fecha específica. Convierte el rango en una Tabla oficial de Excel con Ctrl + T (le puedes poner el nombre tblAsistencia en la pestaña Diseño de tabla). Al trabajar con una Tabla, las fórmulas se copian solas hacia abajo cada vez que agregas un nuevo día.",
        "Incluye columnas claras y atómicas: Fecha, Mes (calculado automáticamente para facilitar el resumen), RUT o ID de trabajador, Nombre, Turno o Jornada Pactada, Hora Entrada, Hora Salida y Minutos o Tiempo de Colación. Evita combinar celdas y asegúrate de que las horas se ingresen usando dos puntos (por ejemplo, 08:30 y no 8.30).",
      ],
      listaOrdenada: [
        "Crea los encabezados en la fila 1 de la hoja Registro: Fecha, ID, Trabajador, JornadaPactada, Entrada, Salida, Colacion.",
        "Aplica formato Fecha corta a la columna Fecha y formato hh:mm a JornadaPactada, Entrada, Salida y Colacion.",
        "Agrega una validación de datos en Entrada y Salida (Datos > Validación de datos > Hora, entre 00:00 y 23:59) para bloquear textos mal escritos.",
        "Convierte el rango en Tabla con Ctrl + T y nómbrala tblAsistencia.",
      ],
      captura: {
        id: "control-de-horas-en-excel-paso-2",
        alt: "Tabla estructurada de Excel tblAsistencia con columnas Fecha, ID, Trabajador, JornadaPactada, Entrada, Salida y Colacion",
        caption:
          "Diseño tabular recomendado: una fila por cada marca diaria, lista para crecer hacia abajo sin romper fórmulas.",
        ratio: "16/9",
      },
    },
    {
      id: "turnos-cruzan-medianoche",
      titulo: "3. Calcular horas trabajadas incluyendo turnos que cruzan la medianoche",
      esPasoHowTo: true,
      resumenHowTo:
        "Aplica la función RESIDUO(Salida-Entrada;1) restando la colación para obtener la duración exacta incluso cuando el turno empieza de noche y termina al día siguiente.",
      parrafos: [
        "Si un trabajador entra a las 08:30 y sale a las 18:00, restar Salida menos Entrada da 09:30 sin mayor problema. Sin embargo, cuando alguien entra a las 22:00 y sale a las 06:00 del día siguiente, una resta simple (06:00 - 22:00) entrega -0,6667. Excel no puede mostrar tiempos negativos en formato de hora estándar y llena la celda de símbolos #######.",
        "Para resolver turnos diurnos y nocturnos con una única fórmula limpia, la función RESIDUO (MOD en inglés) es la herramienta ideal. Como un día completo vale 1, al calcular RESIDUO(Salida - Entrada; 1) Excel envuelve cualquier diferencia negativa sumándole 1 automáticamente, mientras que deja intactas las diferencias positivas del mismo día.",
        "Si además descuentas el tiempo de colación (ingresado como 00:45 o 01:00 en la columna Colacion), conviene envolver el resultado con MAX(0; ...) para evitar resultados negativos si alguien registró por error una entrada y salida idénticas o una colación mayor al turno. Recuerda dar formato [h]:mm a esta columna calculada.",
      ],
      codigos: [
        {
          titulo: "Horas trabajadas netas (soporta turnos nocturnos y colación)",
          lenguaje: "excel",
          codigo: "=MAX(0; RESIDUO([@Salida]-[@Entrada]; 1) - [@Colacion])",
          codigoEn: "=MAX(0, MOD([@Salida]-[@Entrada], 1) - [@Colacion])",
          nota: "Usa referencias estructuradas de Tabla. Si no usas Tabla de Excel, reemplaza [@Salida], [@Entrada] y [@Colacion] por las celdas de la fila (ej. F2, E2, G2). Aplica formato [h]:mm.",
        },
        {
          titulo: "Validación opcional cuando Entrada o Salida están vacías",
          lenguaje: "excel",
          codigo: "=SI(O([@Entrada]=\"\"; [@Salida]=\"\"); 0; MAX(0; RESIDUO([@Salida]-[@Entrada]; 1) - [@Colacion]))",
          codigoEn: "=IF(OR([@Entrada]=\"\", [@Salida]=\"\"), 0, MAX(0, MOD([@Salida]-[@Entrada], 1) - [@Colacion]))",
          nota: "Evita que aparezcan horas ficticias mientras la fila aún no tiene marcada la salida del trabajador.",
        },
      ],
      captura: {
        id: "control-de-horas-en-excel-paso-3",
        alt: "Fórmula con RESIDUO en Excel calculando correctamente un turno de 22:00 a 06:00 sin mostrar signos de error",
        caption:
          "La función RESIDUO resuelve en una sola fórmula tanto turnos diurnos como jornadas que cruzan las 00:00.",
        ratio: "16/9",
      },
    },
    {
      id: "horas-extra-atrasos",
      titulo: "4. Separar horas ordinarias, horas extra y déficit diario",
      esPasoHowTo: true,
      resumenHowTo:
        "Compara las horas trabajadas contra la jornada diaria pactada usando MAX para aislar horas extra y déficit sin mezclar signos positivos y negativos.",
      parrafos: [
        "Con las horas netas trabajadas ya calculadas en una columna (llamémosla HorasTrabajadas), el siguiente paso es comparar ese tiempo contra la jornada pactada de ese día (columna JornadaPactada, por ejemplo 08:00 o 09:00). Hacerlo en columnas separadas para horas extra y horas faltantes (o atrasos) te permite sumar cada concepto por separado a fin de mes.",
        "Si un trabajador tiene pactadas 08:00 horas diarias y trabajó 09:30, su excedente es 01:30 y su déficit es 00:00. Si trabajó 07:45, su excedente es 00:00 y su déficit es 00:15. Usar la función MAX(0; ...) garantiza que nunca aparezcan valores negativos que rompan el formato [h]:mm ni se compensen automáticamente horas extra con atrasos si tu política interna exige llevarlos separados.",
        "También es frecuente medir el atraso específico respecto a la hora de ingreso pactada (por ejemplo, entrada esperada a las 08:30). Si agregas una columna HoraEntradaPactada, puedes calcular los minutos de atraso en la entrada de forma independiente al total trabajado al final del día.",
      ],
      codigos: [
        {
          titulo: "Horas extra diarias (solo si supera la jornada pactada)",
          lenguaje: "excel",
          codigo: "=MAX(0; [@HorasTrabajadas] - [@JornadaPactada])",
          codigoEn: "=MAX(0, [@HorasTrabajadas] - [@JornadaPactada])",
          nota: "Aplica formato [h]:mm. Si la persona trabajó menos de su jornada, devuelve 00:00.",
        },
        {
          titulo: "Déficit de jornada diaria (horas no completadas)",
          lenguaje: "excel",
          codigo: "=MAX(0; [@JornadaPactada] - [@HorasTrabajadas])",
          codigoEn: "=MAX(0, [@JornadaPactada] - [@HorasTrabajadas])",
          nota: "Útil para detectar jornadas incompletas antes de cerrar el período.",
        },
        {
          titulo: "Atraso en la hora de llegada (opcional)",
          lenguaje: "excel",
          codigo: "=SI([@Entrada]=\"\"; 0; MAX(0; [@Entrada] - [@EntradaPactada]))",
          codigoEn: "=IF([@Entrada]=\"\", 0, MAX(0, [@Entrada] - [@EntradaPactada]))",
          nota: "Válido para turnos diurnos donde EntradaPactada y Entrada ocurren en el mismo día calendario.",
        },
      ],
      captura: {
        id: "control-de-horas-en-excel-paso-4",
        alt: "Columnas calculadas en Excel mostrando HorasTrabajadas, HorasExtra y Deficit en formato [h]:mm",
        caption:
          "Separación clara entre horas trabajadas, horas extra y déficit diario mediante MAX(0; ...).",
        ratio: "16/9",
      },
      alerta: {
        tipo: "warning",
        titulo: "Precisión con tolerancias o redondeos",
        texto:
          "Si en tu empresa existe una regla de tolerancia (por ejemplo, considerar hora extra solo desde 15 minutos adicionales), evalúa si conviene aplicarla en la fórmula con SI([@HorasTrabajadas]-[@JornadaPactada]>=HORANUMERO(\"00:15\"); ...) o revisar el detalle real antes de aprobar pagos.",
      },
    },
    {
      id: "resumen-trabajador-mes",
      titulo: "5. Crear el resumen mensual por trabajador con SUMAR.SI.CONJUNTO",
      esPasoHowTo: true,
      resumenHowTo:
        "Agrega una columna Mes en la tabla de registro y arma una hoja Resumen usando SUMAR.SI.CONJUNTO para consolidar horas trabajadas y horas extra por trabajador.",
      parrafos: [
        "Para obtener el reporte mensual sin filtrar manualmente cada persona, crea una segunda hoja llamada Resumen. Primero, vuelve a tblAsistencia y agrega una columna auxiliar llamada Mes con la fórmula =FECHA(AÑO([@Fecha]); MES([@Fecha]); 1). Esta fórmula transforma cualquier fecha del mes (como 14-11-2026) en el primer día de ese mes (01-11-2026). Dale formato personalizado mmm-aaaa para leerla como nov-2026.",
        "En la hoja Resumen, coloca una lista única de trabajadores (puedes generarla automáticamente en Microsoft 365 con UNICOS, o copiar los IDs y nombres) y en la parte superior define una celda para seleccionar el mes a consultar (por ejemplo, C2 con el valor 01-11-2026 y formato mmm-aaaa).",
        "Luego utiliza SUMAR.SI.CONJUNTO para sumar las horas trabajadas, las horas extra y el déficit filtrando simultáneamente por el ID del trabajador y por el mes seleccionado. No olvides aplicar el formato [h]:mm a todas las columnas de totales del resumen para ver cifras reales como 176:30 o 12:45.",
      ],
      codigos: [
        {
          titulo: "Columna Mes en la tabla de registro (primer día del mes)",
          lenguaje: "excel",
          codigo: "=FECHA(AÑO([@Fecha]); MES([@Fecha]); 1)",
          codigoEn: "=DATE(YEAR([@Fecha]), MONTH([@Fecha]), 1)",
          nota: "Normaliza todas las fechas de un mismo mes a un único valor comparable.",
        },
        {
          titulo: "Total de horas trabajadas del mes por trabajador",
          lenguaje: "excel",
          codigo: "=SUMAR.SI.CONJUNTO(tblAsistencia[HorasTrabajadas]; tblAsistencia[ID]; A5; tblAsistencia[Mes]; $C$2)",
          codigoEn: "=SUMIFS(tblAsistencia[HorasTrabajadas], tblAsistencia[ID], A5, tblAsistencia[Mes], $C$2)",
          nota: "A5 contiene el ID del trabajador en la hoja Resumen y $C$2 el mes consultado. Aplica formato [h]:mm a la celda.",
        },
        {
          titulo: "Total de horas extra del mes por trabajador",
          lenguaje: "excel",
          codigo: "=SUMAR.SI.CONJUNTO(tblAsistencia[HorasExtra]; tblAsistencia[ID]; A5; tblAsistencia[Mes]; $C$2)",
          codigoEn: "=SUMIFS(tblAsistencia[HorasExtra], tblAsistencia[ID], A5, tblAsistencia[Mes], $C$2)",
          nota: "Misma estructura apuntando a la columna HorasExtra. Aplica formato [h]:mm.",
        },
      ],
      captura: {
        id: "control-de-horas-en-excel-paso-5",
        alt: "Hoja Resumen en Excel con selector de mes y totales mensuales por trabajador calculados con SUMAR.SI.CONJUNTO",
        caption:
          "Resumen mensual dinámico por trabajador con totales acumulados correctamente en formato [h]:mm.",
        ratio: "16/9",
      },
    },
    {
      id: "marco-legal-basico",
      titulo: "6. Consideraciones prácticas y consulta de normativa vigente",
      esPasoHowTo: false,
      parrafos: [
        "Una planilla de Excel es una excelente herramienta de análisis, control interno y validación previa al cierre de remuneraciones, pero conviene tener presentes dos aspectos clave antes de usarla en producción. Primero, protege con bloqueo de celdas las columnas que contienen fórmulas para evitar que alguien sobreescriba un cálculo por accidente al ingresar una marca.",
        "Segundo, recuerda que en Chile las condiciones sobre jornada ordinaria, límites de horas extraordinarias, sistemas de registro de asistencia autorizados y recargos legales están reguladas por el Código del Trabajo y dictámenes administrativos. Antes de definir parámetros de jornada o implementar un registro oficial de asistencia, consulta siempre la normativa vigente y las orientaciones oficiales en el sitio de la Dirección del Trabajo.",
      ],
      lista: [
        "Bloquea las columnas calculadas (HorasTrabajadas, HorasExtra, Deficit, Mes) y deja editables solo las columnas de entrada manual.",
        "Mantén copias de respaldo mensuales antes de cerrar el período de remuneraciones.",
        "Verifica directamente en la Dirección del Trabajo (dt.gob.cl) los requisitos aplicables a tu tipo de empresa y jornada.",
      ],
    },
  ],
  erroresComunes: [
    {
      error: "El total mensual muestra 08:00 o 16:00 en lugar de 176:00",
      causa:
        "La celda de total tiene formato hh:mm, que oculta los múltiplos de 24 horas y muestra solo el resto del último día.",
      solucion:
        "Cambia el formato de la celda a Personalizado > [h]:mm para visualizar las horas acumuladas reales.",
    },
    {
      error: "Aparecen símbolos ####### en turnos nocturnos",
      causa:
        "Se restó Salida - Entrada de forma directa (ej. 06:00 - 22:00), generando un número negativo que Excel no puede representar como hora.",
      solucion:
        "Reemplaza la resta simple por =RESIDUO(Salida-Entrada; 1) para manejar automáticamente el cruce de medianoche.",
    },
    {
      error: "Error #¡VALOR! al restar entrada y salida",
      causa:
        "Al menos una hora se ingresó como texto (por ejemplo, usando punto '08.30' o espacio adicional en vez de dos puntos '08:30').",
      solucion:
        "Corrige el dato a formato HH:MM con dos puntos y agrega Validación de datos de tipo Hora para impedir ingresos inválidos.",
    },
    {
      error: "SUMAR.SI.CONJUNTO devuelve 00:00 aunque hay registros en la tabla",
      causa:
        "La celda del mes en el resumen tiene una fecha distinta al primer día del mes o está escrita como texto ('Noviembre') en lugar de una fecha real.",
      solucion:
        "Asegúrate de que tanto la columna Mes de la tabla como la celda filtro del resumen guarden el día 1 del mes (ej. 01-11-2026) con formato mmm-aaaa.",
    },
  ],
  plantilla: {
    titulo: "Plantilla de control de horas y horas extra en Excel",
    descripcion:
      "Libro con hoja de registro diario estructurada, cálculo automático de turnos nocturnos con RESIDUO, separación de horas extra y hoja de resumen mensual por trabajador lista para usar.",
  },
  faqs: [
    {
      q: "¿Cómo paso las horas extra de formato [h]:mm a pesos para calcular el pago?",
      a: "Multiplica el total de horas en formato [h]:mm por 24 para convertirlo a horas decimales (por ejemplo, 01:30 pasa a 1,5) y luego multiplica por el valor de la hora correspondiente. Si la celda queda en formato hora, cámbiala a Moneda o Número.",
    },
    {
      q: "¿Qué hago si un trabajador hace dos turnos en el mismo día?",
      a: "Como cada fila de la tabla representa una marca de entrada y salida, simplemente agrega una segunda fila con la misma fecha y trabajador para el segundo bloque. SUMAR.SI.CONJUNTO sumará ambas filas sin problema en el resumen mensual.",
    },
    {
      q: "¿Sirve esta planilla si en mi empresa la colación no se descuenta de la jornada?",
      a: "Sí. Si la colación forma parte de la jornada o se controla aparte, deja la columna Colacion en 00:00 o elimínala de la fórmula dejando únicamente =RESIDUO([@Salida]-[@Entrada]; 1).",
    },
    {
      q: "¿Puedo registrar fecha y hora juntas en la misma celda?",
      a: "Sí, si trabajas con turnos que duran más de 24 horas continuas (por ejemplo, guardias o faenas de 36 horas), es obligatorio incluir fecha y hora juntas (dd-mm-aaaa hh:mm) y usar una resta directa Salida - Entrada, ya que RESIDUO(..., 1) asume turnos menores a 24 horas.",
    },
    {
      q: "¿Esta planilla reemplaza el reloj control exigido por la Dirección del Trabajo?",
      a: "No. Excel sirve para gestión interna, análisis y revisión de cálculos, pero si tu empresa requiere un sistema de registro y control de asistencia formal, debes revisar las exigencias y resoluciones vigentes en dt.gob.cl.",
    },
  ],
  relacionadas: [
    "liquidacion-de-sueldo-en-excel-chile",
    "carta-gantt-en-excel",
    "control-de-ventas-en-excel",
  ],
  enlacesExternos: [
    {
      label: "Dirección del Trabajo de Chile — Normativa y consultas laborales",
      url: "https://www.dt.gob.cl",
      fuente: "Dirección del Trabajo",
    },
    {
      label: "Referencia de funciones de hoja de cálculo en Excel",
      url: "https://learn.microsoft.com/es-es/office/vba/api/excel.worksheetfunction",
      fuente: "Microsoft Learn",
    },
  ],
};

export default guia;
