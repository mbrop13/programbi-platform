import type { GuiaPasoAPaso } from "@/lib/guias/paso-a-paso-tipos";

export const guia: GuiaPasoAPaso = {
  slug: "carta-gantt-en-excel",
  title: "Cómo hacer una carta Gantt en Excel automática (paso a paso)",
  meta: "Crea una carta Gantt en Excel que se dibuja sola con formato condicional: tareas, fechas, avance y hoy marcado. Guía paso a paso con fórmulas.",
  h1: "Cómo hacer una carta Gantt automática en Excel",
  subtitle:
    "Construye un cronograma de proyecto que pinta las barras automáticamente según fechas de inicio y término, muestra el porcentaje de avance completado, marca el día de hoy con HOY() y compáralo con el método de barras apiladas.",
  keywordPrincipal: "como hacer una carta Gantt en Excel",
  keywords: [
    "como hacer una carta Gantt en Excel",
    "carta Gantt automatica Excel",
    "diagrama de Gantt Excel paso a paso",
  ],
  curso: "excel",
  herramienta: "Excel",
  nivel: "Básico",
  updated: "2026-11-21",
  published: "2026-11-21",
  totalTimeIso: "PT20M",
  en30Segundos: {
    queLogras:
      "Una carta Gantt dinámica en Excel donde basta cambiar la fecha de inicio, la duración o el porcentaje de avance de una tarea para que la barra de calendario se redibuje al instante.",
    herramienta: "Microsoft Excel (365, 2021, 2019 o Web)",
    tiempo: "20 minutos",
    bullets: [
      "Tabla de tareas con responsable, fecha de inicio, fecha de término, duración en días y % de avance.",
      "Cabecera de calendario dinámica que genera semanas o días consecutivos desde la fecha de inicio del proyecto.",
      "Barras de proyecto y barras de progreso completado creadas con tres reglas de formato condicional.",
      "Línea vertical automática del día actual usando la función HOY() y comparativa frente al gráfico de barras apiladas.",
    ],
  },
  rutaVisual: [
    {
      numero: 1,
      titulo: "Tabla de tareas",
      resumen: "Define columnas clave de actividad, responsable, inicio, fin y avance.",
      anchorId: "estructura-de-tareas",
      icono: "table",
    },
    {
      numero: 2,
      titulo: "Línea de tiempo",
      resumen: "Genera el calendario horizontal con fechas reales y formato compacto.",
      anchorId: "linea-de-tiempo-fechas",
      icono: "calendar",
    },
    {
      numero: 3,
      titulo: "Barras automáticas",
      resumen: "Pinta la duración de cada tarea con formato condicional y la función Y.",
      anchorId: "barras-formato-condicional",
      icono: "code",
    },
    {
      numero: 4,
      titulo: "Progreso visual",
      resumen: "Distingue la parte ejecutada de la pendiente usando el % de avance.",
      anchorId: "porcentaje-de-avance",
      icono: "check",
    },
    {
      numero: 5,
      titulo: "Marcar el día hoy",
      resumen: "Destaca la columna del día actual con HOY() y ordena la prioridad de reglas.",
      anchorId: "marcar-dia-hoy",
      icono: "settings",
    },
    {
      numero: 6,
      titulo: "Barras apiladas",
      resumen: "Conoce la alternativa con gráfico clásico y cuándo conviene cada método.",
      anchorId: "alternativa-barras-apiladas",
      icono: "chart",
    },
  ],
  requisitos: {
    version: "Cualquier versión de Excel (2013, 2016, 2019, 2021, 365 o Excel para la Web)",
    lista: [
      "Microsoft Excel en Windows, macOS o navegador web.",
      "Listado de actividades o hitos de tu proyecto con su fecha de inicio estimada y duración en días.",
    ],
    compatibilidadMacWeb:
      "Tanto el formato condicional con fórmulas (Y, HOY) como el gráfico de barras apiladas funcionan de forma idéntica en Windows, macOS y Excel para la Web.",
  },
  herramientasHowTo: ["Microsoft Excel (cualquier versión)"],
  insumosHowTo: ["Lista de tareas del proyecto con fechas de inicio y término"],
  secciones: [
    {
      id: "estructura-de-tareas",
      titulo: "1. Diseñar la estructura de tareas del proyecto",
      esPasoHowTo: true,
      resumenHowTo:
        "Crea las columnas de control en A4:F20: ID/Fase, Tarea, Inicio (C), Término (D), Duración en días (E) y % Avance (F).",
      parrafos: [
        "Muchas personas dibujan cartas Gantt en Excel pintando celdas de colores a mano con el tarro de pintura. El problema aparece en cuanto una tarea se atrasa tres días: tienes que despintar veinte celdas, volver a pintarlas y mover todo el resto del proyecto manualmente.",
        "Para lograr una carta Gantt verdaderamente automática, reserva las filas 1 a 3 para el título del proyecto y una celda de Fecha_Inicio_Proyecto (por ejemplo, en C2). En la fila 4 coloca los encabezados de la tabla de tareas desde la columna A hasta la F: A4 Responsable (o Fase), B4 Tarea, C4 Inicio, D4 Fin, E4 Días y F4 Avance (%).",
        "A partir de la fila 5 ingresa tus tareas reales. En lugar de escribir a mano la fecha de término o la duración, decide cuál mandará: lo más práctico es ingresar Inicio (C5) y Duración en días (E5), y calcular el Fin (D5) automáticamente como =C5+E5-1 (o =DIA.LAB(C5;E5-1) si solo trabajas días hábiles de lunes a viernes). Si prefieres ingresar Inicio y Fin a mano, calcula Días en E5 como =D5-C5+1.",
      ],
      listaOrdenada: [
        "Escribe el nombre del proyecto en B1 y la fecha de inicio general del calendario en C2.",
        "Crea los encabezados en A4:F4: Fase, Tarea, Inicio, Fin, Días y % Avance.",
        "Ingresa las tareas en las filas 5 en adelante (por ejemplo, filas 5 a 18).",
        "Formatea las columnas C y D como Fecha corta (dd-mm-aaaa) y la columna F como Porcentaje sin decimales (0 %).",
      ],
      captura: {
        id: "carta-gantt-en-excel-paso-1",
        alt: "Tabla de tareas en Excel desde A4 hasta F18 con columnas Fase, Tarea, Inicio, Fin, Días y Porcentaje de Avance",
        caption: "Estructura base de tareas con fechas reales en C y D antes de construir la grilla.",
        ratio: "16/9",
      },
    },
    {
      id: "linea-de-tiempo-fechas",
      titulo: "2. Construir la línea de tiempo horizontal con fechas reales",
      esPasoHowTo: true,
      resumenHowTo:
        "Genera fechas consecutivas en la fila 4 desde la columna G hacia la derecha vinculadas a la celda de inicio del proyecto y formatea las celdas en vertical o solo número de día.",
      parrafos: [
        "Justo al lado de % Avance, en la columna G4, comienza el calendario horizontal de tu Gantt. Para que toda la línea de tiempo se mueva sola si cambia el arranque del proyecto, escribe en G4 la fórmula =C2 (o =MIN(C5:C18) si quieres que empiece automáticamente en la fecha de la primera tarea). Luego, en H4 escribe =G4+1 y arrastra esa fórmula hacia la derecha por 30, 60 o 90 columnas según la duración total de tu proyecto.",
        "Si las columnas muestran '########' o ocupan demasiado ancho de pantalla, no achiques la fuente hasta dejarla ilegible: selecciona desde G4 hasta la última columna de fecha, abre Formato de celdas (Ctrl+1) > Número > Personalizada y escribe el código d (para ver solo el número del día: 1, 2, 3...) o dd/mm con alineación vertical de 90 grados en la pestaña Alineación.",
        "Encima de la fila 4, en la fila 3, puedes agrupar visualmente los meses o semanas usando la fórmula =TEXTO(G4;\"mmm-aa\") o simplemente mostrando el nombre del mes cada vez que cambia el día 1. Finalmente, reduce el ancho de las columnas G en adelante a unos 3 o 4 puntos para obtener una cuadrícula compacta donde quepan seis o más semanas en una sola pantalla.",
      ],
      captura: {
        id: "carta-gantt-en-excel-paso-2",
        alt: "Cabecera de calendario en la fila 4 de Excel desde la columna G en adelante con columnas angostas mostrando los días del mes",
        caption: "Línea de tiempo horizontal generada con fechas reales y columnas compactas.",
        ratio: "16/9",
      },
    },
    {
      id: "barras-formato-condicional",
      titulo: "3. Dibujar las barras automáticamente con formato condicional",
      esPasoHowTo: true,
      resumenHowTo:
        "Selecciona toda la matriz de calendario (G5:BZ18) y aplica una regla de formato condicional basada en fórmula usando =Y(G$4>=$C5;G$4<=$D5).",
      parrafos: [
        "Aquí ocurre la magia del Gantt sin macros. Queremos que Excel pinte una celda del calendario solo si la fecha de su columna (fila 4) está comprendida entre la fecha de Inicio (columna C) y la fecha de Fin (columna D) de esa tarea.",
        "Selecciona todo el bloque interior de la grilla de fechas (por ejemplo, desde G5 hasta la última columna y fila de tus tareas, digamos BZ18), asegurándote de que la celda activa de la selección sea G5. Ve a Inicio > Formato condicional > Nueva regla > Utilice una fórmula que determine las celdas para aplicar formato.",
        "Presta máxima atención a los signos peso ($) de referencia mixta: en G$4 fijamos la fila 4 (para que todas las tareas miren siempre la fila de fechas), mientras la columna G queda libre para avanzar hacia la derecha. En $C5 y $D5 fijamos las columnas C y D (para que toda la fila mire siempre su propio Inicio y Fin), mientras la fila 5 queda libre para bajar por cada tarea. Elige un relleno azul suave o celeste para representar el plan total de cada tarea.",
      ],
      codigos: [
        {
          titulo: "Regla de formato condicional para pintar la barra planificada",
          lenguaje: "excel",
          codigo: `=Y(G$4>=$C5;G$4<=$D5)`,
          codigoEn: `=AND(G$4>=$C5,G$4<=$D5)`,
          nota: "Aplica esta fórmula sobre el rango G5:BZ18 teniendo G5 como celda activa. El signo $ en G$4 fija la fila de fechas; el $ en $C5 y $D5 fija las columnas de Inicio y Fin.",
        },
      ],
      captura: {
        id: "carta-gantt-en-excel-paso-3",
        alt: "Ventana Nueva regla de formato en Excel con la fórmula =Y(G$4>=$C5;G$4<=$D5) y vista previa de las barras azules dibujadas",
        caption: "Regla de formato condicional con referencias mixtas que dibuja las barras de cada tarea.",
        ratio: "16/9",
      },
    },
    {
      id: "porcentaje-de-avance",
      titulo: "4. Pintar el porcentaje de avance completado dentro de cada barra",
      esPasoHowTo: true,
      resumenHowTo:
        "Añade una segunda regla de formato condicional en azul oscuro que pinte únicamente los días proporcionales al % de avance ingresado en la columna F.",
      parrafos: [
        "Una carta Gantt que solo muestra cuándo empieza y termina cada tarea sirve para planificar, pero durante la ejecución necesitas ver de un vistazo qué tareas van al día y cuáles están atrasadas. Podemos superponer una barra más oscura que represente exactamente la fracción completada según el porcentaje de la columna F.",
        "Con el mismo rango G5:BZ18 seleccionado, crea una segunda regla de formato condicional con fórmula. La lógica calcula cuántos días equivalen al avance multiplicando la duración ($D5-$C5+1) por el porcentaje ($F5), y compara si la fecha de la columna G$4 es menor a Inicio + días completados. Adicionalmente exige que $F5>0 para que una tarea en 0 % no pinte ningún bloque.",
        "Elige un relleno azul oscuro (más intenso que la barra base) y, muy importante, abre Inicio > Formato condicional > Administrar reglas para verificar que esta regla de Avance quede POR ENCIMA de la regla de Barra Base. En Excel, las reglas superiores tienen prioridad visual sobre las inferiores.",
      ],
      codigos: [
        {
          titulo: "Regla de formato condicional para mostrar el avance completado",
          lenguaje: "excel",
          codigo: `=Y($F5>0;G$4>=$C5;G$4<$C5+REDONDEAR(($D5-$C5+1)*$F5;0))`,
          codigoEn: `=AND($F5>0,G$4>=$C5,G$4<$C5+ROUND(($D5-$C5+1)*$F5,0))`,
          nota: "Coloca esta regla arriba de la regla base en Administrar reglas. Cuando F5 llegue a 100 %, toda la barra quedará pintada en azul oscuro.",
        },
      ],
      captura: {
        id: "carta-gantt-en-excel-paso-4",
        alt: "Carta Gantt en Excel mostrando barras con tramo ejecutado en azul oscuro y tramo pendiente en azul claro según la columna % Avance",
        caption: "Visualización simultánea de duración planificada (celeste) y progreso real (azul oscuro).",
        ratio: "16/9",
      },
    },
    {
      id: "marcar-dia-hoy",
      titulo: "5. Marcar automáticamente la columna del día de hoy con HOY()",
      esPasoHowTo: true,
      resumenHowTo:
        "Agrega una regla de formato condicional con =G$4=HOY() para resaltar con borde o fondo vertical la fecha actual cada vez que abras el archivo.",
      parrafos: [
        "Cuando revisas un cronograma en reunión, la primera pregunta siempre es '¿dónde estamos parados hoy?'. En lugar de mover una línea dibujada a mano cada mañana, deja que Excel ilumine automáticamente la columna del día en curso mediante la función volátil HOY() (TODAY() en inglés).",
        "Selecciona desde el encabezado de fecha hasta la última fila de tareas (G4:BZ18) y crea una regla de formato condicional con la fórmula =G$4=HOY(). En el formato, puedes elegir un borde izquierdo o derecho rojo grueso (si quieres mantener intactos los colores azules de las barras debajo) o un relleno amarillo/naranja muy suave si la aplicas solo sobre la cabecera o por debajo de las barras.",
        "Si decides usar un borde vertical rojo sin relleno de color en esta regla, puedes colocarla en el primer lugar de Administrar reglas y NO marcar 'Detener si es verdad': así Excel dibujará la línea roja vertical del día de hoy encima de las barras de tareas sin tapar su color azul.",
      ],
      codigos: [
        {
          titulo: "Regla para destacar la columna del día actual",
          lenguaje: "excel",
          codigo: `=G$4=HOY()`,
          codigoEn: `=G$4=TODAY()`,
          nota: "Configura solo un borde izquierdo rojo punteado o continuo sin color de relleno para no ocultar las barras de avance.",
        },
      ],
      captura: {
        id: "carta-gantt-en-excel-paso-5",
        alt: "Administrador de reglas de formato condicional mostrando las tres reglas ordenadas y línea vertical roja marcando la fecha de hoy en la Gantt",
        caption: "Línea vertical automática del día actual generada con =G$4=HOY().",
        ratio: "16/9",
      },
    },
    {
      id: "alternativa-barras-apiladas",
      titulo: "6. Alternativa con gráfico de barras apiladas y comparativa",
      esPasoHowTo: true,
      resumenHowTo:
        "Construye una carta Gantt clásica usando un gráfico de barras horizontales apiladas con la serie de Inicio sin relleno, y compara ambos métodos.",
      parrafos: [
        "Existe una segunda forma muy conocida de hacer una carta Gantt en Excel: insertar un gráfico de Barras 2D apiladas usando dos series numéricas: Fecha_Inicio (en formato número) y Duración_Días. Luego ocultas visualmente la primera serie ('Sin relleno' y 'Sin línea') para que las barras de duración queden flotando a la altura de su fecha, inviertes el orden de las categorías en el eje vertical y ajustas el límite mínimo del eje horizontal al número de serie de la fecha inicial del proyecto.",
        "Aunque ese método produce un objeto gráfico que puedes copiar fácilmente a PowerPoint, resulta menos práctico para el seguimiento diario en proyectos largos porque cuesta alinear columnas adicionales de responsable o % de avance junto a cada barra, y requiere reajustar manualmente el eje mínimo si el proyecto se adelanta. La siguiente tabla resume cuándo conviene cada enfoque.",
      ],
      tabla: {
        caption: "Comparativa entre Gantt con formato condicional y Gantt con gráfico de barras apiladas",
        encabezados: [
          "Criterio",
          "Formato condicional en celdas (recomendado)",
          "Gráfico de barras apiladas",
        ],
        filas: [
          [
            "Integración con columnas (Responsable, Avance %)",
            "Directa; cada barra vive en la misma fila que sus datos",
            "Limitada; los datos quedan separados del dibujo del gráfico",
          ],
          [
            "Mostrar % de avance dentro de la barra",
            "Muy simple con una segunda regla de color",
            "Complejo; exige dividir la duración en serie ejecutada y pendiente",
          ],
          [
            "Línea automática del día de hoy",
            "Inmediata con =G$4=HOY()",
            "Requiere añadir una serie de dispersión XY auxiliar",
          ],
          [
            "Portabilidad a PowerPoint / presentaciones",
            "Se copia como imagen o PDF de área de impresión",
            "Se copia como gráfico vectorial nativo",
          ],
        ],
      },
      captura: {
        id: "carta-gantt-en-excel-paso-6",
        alt: "Gráfico alternativo de barras apiladas en Excel con la serie inicial transparente simulando una carta Gantt",
        caption: "Método alternativo mediante gráfico de barras apiladas con primera serie sin relleno.",
        ratio: "16/9",
      },
    },
  ],
  erroresComunes: [
    {
      error: "Toda la columna o toda la fila se pinta del mismo color en vez de formar barras por tarea",
      causa: "Se escribieron referencias absolutas ($G$4 o $C$5) o referencias totalmente relativas (G4, C5) dentro de la regla de formato condicional.",
      solucion: "Usa exactamente referencias mixtas: G$4 (fija la fila 4) y $C5 / $D5 (fijan las columnas C y D).",
    },
    {
      error: "El progreso en azul oscuro queda tapado por el color celeste de la barra base",
      causa: "La regla de barra base quedó arriba de la regla de avance en Administrar reglas.",
      solucion: "Abre Formato condicional > Administrar reglas, selecciona la regla de avance y súbela con la flecha hacia arriba para darle prioridad.",
    },
    {
      error: "Las barras no aparecen aunque las fechas coinciden visualmente",
      causa: "Las fechas en C/D o en la fila 4 están guardadas como texto ('15-03-2026') en vez de fechas reales de Excel.",
      solucion: "Comprueba alineación (los números/fechas reales se alinean a la derecha por defecto) o aplica Datos > Texto en columnas para convertirlas a formato Fecha.",
    },
    {
      error: "La barra de una tarea de 1 día aparece vacía",
      causa: "La fórmula usó > y < estrictos en vez de >= y <= en la comparación de extremos.",
      solucion: "Verifica que la regla base sea =Y(G$4>=$C5;G$4<=$D5) incluyendo el signo igual en ambos extremos.",
    },
  ],
  plantilla: {
    titulo: "Plantilla de Carta Gantt Automática en Excel",
    descripcion:
      "Cronograma listo para usar con calendario dinámico, reglas de formato condicional para duración y % de avance, marcador automático de HOY() y vista de impresión configurada.",
  },
  faqs: [
    {
      q: "¿Cómo hago si mi proyecto dura 6 meses y no quiero ver día por día?",
      a: "Cambia el paso de la línea de tiempo a semanas: en H4 escribe =G4+7 en vez de =G4+1. Luego ajusta la regla de la barra base para verificar si la tarea se cruza con esa semana usando =Y(G$4+6>=$C5;G$4<=$D5).",
    },
    {
      q: "¿Puedo excluir sábados y domingos para que la duración cuente solo días hábiles?",
      a: "Sí. Calcula la fecha de Fin en D5 con =DIA.LAB(C5;E5-1) (y agrega un rango de feriados chilenos como tercer argumento si lo deseas). En la grilla puedes agregar una regla sutil en gris claro para fines de semana usando =DIASEM(G$4;2)>5.",
    },
    {
      q: "¿Cómo imprimo o exporto la carta Gantt a PDF sin que se corte en diez hojas?",
      a: "Selecciona desde A1 hasta la última columna y fila del Gantt, ve a Disposición de página > Área de impresión > Establecer área de impresión, cambia la Orientación a Horizontal y en Ajustar área de impresión pon Ancho: 1 página.",
    },
    {
      q: "¿Por qué la función HOY() no cambia si dejo el archivo abierto toda la semana?",
      a: "La función HOY() se recalcula cada vez que abres el libro o cuando Excel recalcula alguna celda (puedes forzarlo en cualquier momento presionando F9).",
    },
  ],
  relacionadas: [
    "como-hacer-presupuesto-en-excel",
    "control-de-horas-en-excel",
    "como-hacer-dashboard-en-excel",
  ],
  enlacesExternos: [
    {
      label: "Referencia de formato condicional y gráficos en Excel",
      url: "https://learn.microsoft.com/es-es/office/vba/api/excel.formatconditions",
      fuente: "Microsoft Learn",
    },
    {
      label: "Documentación oficial de gráficos en Excel (ChartObject)",
      url: "https://learn.microsoft.com/es-es/office/vba/api/excel.chartobject",
      fuente: "Microsoft Learn",
    },
  ],
};

export default guia;
