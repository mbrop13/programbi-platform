import type { GuiaPasoAPaso } from "@/lib/guias/paso-a-paso-tipos";

export const guia: GuiaPasoAPaso = {
  slug: "como-hacer-presupuesto-en-excel",
  title: "Cómo hacer un presupuesto en Excel (personal o pyme)",
  meta: "Plantea un presupuesto en Excel, compáralo con lo real y mide desviaciones con semáforos. Guía paso a paso con fórmulas para personas y pymes.",
  h1: "Cómo hacer un presupuesto en Excel y controlar las desviaciones",
  subtitle:
    "Diseña un presupuesto mensual ordenado por partidas, cruza los montos ejecutados con BUSCARX, calcula desviaciones porcentuales sin errores de división por cero y activa alertas visuales con formato condicional.",
  keywordPrincipal: "como hacer un presupuesto en Excel",
  keywords: [
    "como hacer un presupuesto en Excel",
    "presupuesto personal Excel",
    "presupuesto de un proyecto Excel",
    "presupuesto empresa pyme",
    "presupuesto vs real Excel",
  ],
  curso: "excel",
  herramienta: "Excel",
  nivel: "Básico",
  updated: "2026-11-21",
  published: "2026-11-21",
  totalTimeIso: "PT25M",
  en30Segundos: {
    queLogras:
      "Un libro de Excel con tres hojas conectadas (Partidas, Presupuesto Mensual y Real vs Presupuesto) que calcula variaciones en pesos y porcentaje, agrupa gastos por categoría y resalta sobrecostos automáticamente.",
    herramienta: "Microsoft Excel (365, 2021 o Web)",
    tiempo: "25 minutos",
    bullets: [
      "Catálogo único de partidas con código, tipo (Ingreso / Costo / Gasto) y centro de costo.",
      "Grilla mensual de 12 meses con subtotales dinámicos y validación de datos.",
      "Cruce automático entre lo presupuestado y lo ejecutado usando BUSCARX y SUMAR.SI.CONJUNTO.",
      "Semáforo de desviaciones porcentuales con conjuntos de iconos y reglas de formato condicional.",
    ],
  },
  rutaVisual: [
    {
      numero: 1,
      titulo: "Elegir el enfoque",
      resumen: "Define si usarás presupuesto base cero, incremental, personal o de proyecto.",
      anchorId: "tipos-de-presupuesto",
      icono: "layers",
    },
    {
      numero: 2,
      titulo: "Catálogo de partidas",
      resumen: "Crea una tabla maestra con códigos únicos y clasificación de ingresos y egresos.",
      anchorId: "estructura-de-partidas",
      icono: "database",
    },
    {
      numero: 3,
      titulo: "Planilla mensual",
      resumen: "Construye la matriz de 12 meses con montos proyectados y totales por grupo.",
      anchorId: "presupuesto-mensual",
      icono: "table",
    },
    {
      numero: 4,
      titulo: "Real vs Presupuesto",
      resumen: "Cruza los gastos reales y calcula la desviación % con SI.ERROR y BUSCARX.",
      anchorId: "real-vs-presupuesto",
      icono: "code",
    },
    {
      numero: 5,
      titulo: "Semáforos y alertas",
      resumen: "Configura formato condicional para detectar sobrecostos apenas ocurran.",
      anchorId: "semaforo-y-alertas",
      icono: "check",
    },
    {
      numero: 6,
      titulo: "Presupuesto de proyecto",
      resumen: "Adapta las partidas por etapa y conéctalas con tu carta Gantt.",
      anchorId: "presupuesto-de-proyecto",
      icono: "calendar",
    },
  ],
  requisitos: {
    version: "Excel 365 o Excel 2021 (recomendado para BUSCARX); compatible con Excel 2016/2019 usando INDICE y COINCIDIR",
    lista: [
      "Microsoft Excel instalado o cuenta gratuita en Excel para la Web.",
      "Listado preliminar de ingresos esperados y gastos fijos o variables de tu hogar, pyme o proyecto.",
      "Cartolas bancarias o registro de boletas/facturas del último mes para cargar la ejecución real.",
    ],
    compatibilidadMacWeb:
      "Todas las fórmulas mostradas (SI.ERROR, SUMAR.SI.CONJUNTO, BUSCARX y formato condicional) funcionan de forma idéntica en Windows, macOS y Excel para la Web. En Mac, el atajo para convertir un rango en Tabla es Cmd+T en lugar de Ctrl+T.",
  },
  herramientasHowTo: ["Microsoft Excel 365 / 2021 / Web"],
  insumosHowTo: [
    "Listado de partidas de ingreso y gasto",
    "Registro de movimientos reales del período",
  ],
  secciones: [
    {
      id: "tipos-de-presupuesto",
      titulo: "1. Tipos de presupuesto: cuál elegir antes de abrir Excel",
      parrafos: [
        "Antes de escribir la primera celda conviene decidir la metodología con la que vas a estimar tus números. Muchos libros en Excel fracasan porque mezclan horizontes distintos: proyectan gastos anuales como si fueran un proyecto cerrado o copian cifras del año anterior sin cuestionar si siguen vigentes. Definir el enfoque en cinco minutos te ahorra reestructurar toda la planilla a mitad de año.",
        "En la práctica cotidiana de personas, equipos de proyecto y pymes chilenas aparecen cinco formatos recurrentes. El presupuesto incremental parte de la historia real del período previo y ajusta por inflación, variación de la UF o crecimiento esperado; es rápido, pero arrastra ineficiencias antiguas. El presupuesto base cero obliga a justificar cada peso desde cero en cada ciclo, ideal cuando necesitas recortar gastos prescindibles.",
        "Por su parte, el presupuesto personal o del hogar prioriza la liquidez mensual y el porcentaje de ahorro; el presupuesto de proyecto se ordena por entregables o hitos con fecha de inicio y término; y el presupuesto anual pyme separa costos directos de operación de los gastos de administración y ventas para proteger el margen.",
      ],
      tabla: {
        caption: "Comparativa de los cinco tipos de presupuesto más usados en Excel",
        encabezados: [
          "Tipo de presupuesto",
          "Horizonte típico",
          "Cómo se calculan las metas",
          "Ideal para",
          "Principal ventaja",
        ],
        filas: [
          [
            "Base cero",
            "Anual o trimestral",
            "Cada partida inicia en $0 y debe justificarse con cotizaciones o necesidad actual",
            "Empresas en reestructuración o áreas con gasto discrecional alto",
            "Elimina gastos heredados que ya no aportan valor",
          ],
          [
            "Incremental",
            "Anual con revisión mensual",
            "Monto real del año anterior ajustado por IPC, UF o meta de crecimiento",
            "Pymes estables con historial contable ordenado",
            "Rápido de armar y fácil de explicar a gerencia",
          ],
          [
            "Personal / Hogar",
            "Mensual recurrente",
            "Ingreso líquido menos ahorro objetivo, distribuido en fijos y variables",
            "Personas y familias que ordenan finanzas cotidianas",
            "Visibilidad inmediata de capacidad de ahorro y deudas",
          ],
          [
            "De proyecto",
            "Duración de la obra o campaña",
            "Estimación por etapa, horas-hombre, materiales y contingencia (5 %-15 %)",
            "Consultorías, construcción, eventos o desarrollo TI",
            "Controla el margen por contrato sin esperar el cierre anual",
          ],
          [
            "Pyme anual",
            "12 meses (enero a diciembre)",
            "Proyección de ventas menos costos variables, gastos fijos y flujo tributario",
            "Comercios, servicios y empresas en crecimiento",
            "Conecta metas comerciales con necesidades de caja",
          ],
        ],
      },
      alerta: {
        tipo: "tip",
        titulo: "No confundas presupuesto económico con flujo de caja",
        texto: "El presupuesto mide ingresos y gastos devengados (por ejemplo, una venta facturada en marzo aunque se pague a 30 días). El flujo de caja registra cuándo entra y sale efectivamente el dinero del banco. Usa ambos de forma complementaria.",
      },
    },
    {
      id: "estructura-de-partidas",
      titulo: "2. Diseñar la estructura de partidas (hoja Catálogo)",
      esPasoHowTo: true,
      resumenHowTo:
        "Crea una hoja llamada Partidas convertida en Tabla de Excel con código único, categoría, nombre de partida, tipo (Ingreso o Egreso) y clasificación fijo/variable.",
      parrafos: [
        "El error más común al armar un presupuesto en Excel es escribir los nombres de los gastos directamente en la hoja mensual y repetirlos a mano en la hoja de gastos reales. Basta un espacio extra o una tilde omitida ('Arriendo ' vs 'Arriendo') para que las fórmulas devuelvan cero y el control quede cojo.",
        "Para evitarlo, dedica la primera hoja del libro —llámala Partidas— a definir un catálogo maestro único. Crea cinco columnas: Codigo (ej. ING-01, GAS-01, GAS-02), Tipo (Ingreso, Costo Directo, Gasto Fijo, Gasto Variable), Categoria (Ventas, Remuneraciones, Arriendo y Servicios, Marketing, Alimentación, etc.), Nombre_Partida y Activa (Sí/No).",
        "Selecciona todo el rango de encabezados y filas iniciales y presiona Ctrl+T (Cmd+T en Mac) para convertirlo en una Tabla oficial de Excel. En la pestaña Diseño de tabla, cámbiale el nombre a tblPartidas. Usar Tablas estructuradas permite que cualquier partida nueva que agregues en el futuro entre automáticamente en las listas desplegables y fórmulas del resto del libro.",
      ],
      listaOrdenada: [
        "Abre un libro nuevo y renombra la primera hoja como Partidas.",
        "Escribe los encabezados en A1:E1: Codigo, Tipo, Categoria, Nombre_Partida y Responsable.",
        "Ingresa códigos cortos y consistentes: ING-01 para ingresos principales, CF-01 para costos fijos, GV-01 para gastos variables.",
        "Convierte el rango en Tabla con Ctrl+T, marca 'La tabla tiene encabezados' y nómbrala tblPartidas.",
        "Aplica Validación de datos (Datos > Validación de datos > Lista) en la columna Tipo con las opciones: Ingreso, Costo Directo, Gasto Fijo, Gasto Variable.",
      ],
      captura: {
        id: "como-hacer-presupuesto-en-excel-paso-1",
        alt: "Hoja Partidas en Excel convertida en tabla tblPartidas con códigos únicos, tipo, categoría y nombre de partida",
        caption: "Catálogo maestro tblPartidas que centraliza los códigos y categorías de todo el presupuesto.",
        ratio: "16/9",
      },
    },
    {
      id: "presupuesto-mensual",
      titulo: "3. Construir el presupuesto mensual de 12 meses",
      esPasoHowTo: true,
      resumenHowTo:
        "Arma la hoja Ppto_Mensual vinculada a tblPartidas con columnas de enero a diciembre, total anual y porcentaje de participación sobre los ingresos.",
      parrafos: [
        "Con el catálogo listo, crea una segunda hoja llamada Ppto_Mensual. En las columnas A, B y C coloca Codigo, Tipo y Nombre_Partida. A partir de la columna D hasta la O ubica los doce meses del año en formato de fecha real (01-01-2026, 01-02-2026, etc.) formateados como 'mmm-aa' (ene-26, feb-26) desde Formato de celdas > Personalizada. Usar fechas reales en lugar de texto plano facilita ordenar y cruzar datos después.",
        "En la columna A (Codigo) usa Validación de datos tipo Lista apuntando a =tblPartidas[Codigo] (o al rango A2:A50 de la hoja Partidas) para elegir cada partida sin errores de tipeo. Luego, en las columnas B y C, trae automáticamente el Tipo y el Nombre_Partida usando BUSCARX para no escribirlos dos veces.",
        "En la columna P agrega Total_Anual con =SUMA(D2:O2) y en la columna Q calcula el %_Sobre_Ingresos dividiendo cada fila por el total de ingresos presupuestados. Al pie de la tabla, agrega tres filas de resumen con SUMAR.SI: Total Ingresos Presupuestados, Total Egresos Presupuestados y Resultado Neto (Ingresos menos Egresos). Así sabrás de inmediato si el año proyecta superávit o déficit antes de gastar el primer peso.",
      ],
      codigos: [
        {
          titulo: "Traer Tipo y Nombre_Partida desde el catálogo con BUSCARX",
          lenguaje: "excel",
          codigo: `=BUSCARX(A2;tblPartidas[Codigo];tblPartidas[Tipo];"No encontrado")`,
          codigoEn: `=XLOOKUP(A2,tblPartidas[Codigo],tblPartidas[Tipo],"Not found")`,
          nota: "Si usas Excel 2016 o 2019 sin BUSCARX, reemplaza por =SI.ERROR(INDICE(tblPartidas[Tipo];COINCIDIR(A2;tblPartidas[Codigo];0));\"No encontrado\").",
        },
        {
          titulo: "Subtotal de ingresos y egresos por mes al pie de la grilla",
          lenguaje: "excel",
          codigo: `=SUMAR.SI($B$2:$B$30;"Ingreso";D$2:D$30)`,
          codigoEn: `=SUMIF($B$2:$B$30,"Ingreso",D$2:D$30)`,
          nota: "Arrastra esta fórmula hacia la derecha desde enero (columna D) hasta el total anual (columna P). Para egresos, suma Costo Directo, Gasto Fijo y Gasto Variable o usa <>Ingreso.",
        },
      ],
      captura: {
        id: "como-hacer-presupuesto-en-excel-paso-2",
        alt: "Grilla de presupuesto mensual en Excel de enero a diciembre con códigos vinculados por BUSCARX y fila de resultado neto",
        caption: "Matriz mensual de presupuesto con subtotales automáticos de ingresos, egresos y resultado proyectado.",
        ratio: "16/9",
      },
    },
    {
      id: "real-vs-presupuesto",
      titulo: "4. Comparar Real vs Presupuesto y calcular desviación %",
      esPasoHowTo: true,
      resumenHowTo:
        "Registra los movimientos reales en una tabla cronológica, consolida el gasto real por partida y calcula la desviación en pesos y porcentaje con SI.ERROR y BUSCARX.",
      parrafos: [
        "Un presupuesto que no se compara con la realidad es solo una lista de deseos. Crea una tercera hoja llamada Registro_Real con una tabla (tblReal) de cinco columnas: Fecha, Mes (calculado con =FIN.MES(A2;-1)+1 para normalizar al primer día del mes), Codigo, Descripcion y Monto_Real. Cada vez que pagues una factura, recibas un abono o hagas una compra con tarjeta, anótala aquí eligiendo el Codigo desde la lista desplegable.",
        "Ahora crea la hoja de control principal llamada Real_vs_Ppto. En ella listarás cada Codigo de partida, seleccionarás el mes a analizar en una celda de filtro (por ejemplo, celda C2 con fecha 01-03-2026) y traerás dos cifras lado a lado: Presupuestado y Real. El monto presupuestado del mes seleccionado se extrae combinando BUSCARX sobre el código y la columna del mes correspondiente en Ppto_Mensual; el monto real se consolida sumando tblReal con SUMAR.SI.CONJUNTO por Codigo y Mes.",
        "Con ambas columnas frente a ti, calcula la Desviación en pesos (=Real - Presupuestado para gastos, o =Real - Presupuestado cuidando la interpretación según sea ingreso o egreso) y la Desviación porcentual. Aquí es indispensable envolver la división en SI.ERROR: si una partida tenía $0 presupuestados (un imprevisto), dividir por cero arrojaría #¡DIV/0! y arruinaría los promedios del tablero. Con =SI.ERROR((Real-Ppto)/Ppto;0) mantienes la columna limpia y operable.",
      ],
      codigos: [
        {
          titulo: "Traer el presupuesto del mes elegido con BUSCARX anidado",
          lenguaje: "excel",
          codigo: `=BUSCARX(A5;Ppto_Mensual!$A$2:$A$30;BUSCARX($C$2;Ppto_Mensual!$D$1:$O$1;Ppto_Mensual!$D$2:$O$30);0)`,
          codigoEn: `=XLOOKUP(A5,Ppto_Mensual!$A$2:$A$30,XLOOKUP($C$2,Ppto_Mensual!$D$1:$O$1,Ppto_Mensual!$D$2:$O$30),0)`,
          nota: "El BUSCARX interior localiza la columna del mes indicado en C2 y entrega ese vector vertical al BUSCARX exterior, que busca la partida A5.",
        },
        {
          titulo: "Sumar lo ejecutado real del mes desde tblReal",
          lenguaje: "excel",
          codigo: `=SUMAR.SI.CONJUNTO(tblReal[Monto_Real];tblReal[Codigo];A5;tblReal[Mes];$C$2)`,
          codigoEn: `=SUMIFS(tblReal[Monto_Real],tblReal[Codigo],A5,tblReal[Mes],$C$2)`,
          nota: "Asegúrate de que tanto C2 como tblReal[Mes] contengan fechas del primer día del mes para que coincidan exactamente.",
        },
        {
          titulo: "Calcular desviación porcentual segura con SI.ERROR",
          lenguaje: "excel",
          codigo: `=SI.ERROR((E5-D5)/D5;0)`,
          codigoEn: `=IFERROR((E5-D5)/D5,0)`,
          nota: "D5 corresponde a Presupuestado y E5 a Real. Formatea la celda como Porcentaje con 1 decimal (0,0%).",
        },
      ],
      captura: {
        id: "como-hacer-presupuesto-en-excel-paso-3",
        alt: "Hoja Real_vs_Ppto mostrando presupuesto del mes, gasto real consolidado, variación en pesos y desviación porcentual con SI.ERROR",
        caption: "Comparativo Real vs Presupuesto por partida con selector de mes en la celda C2.",
        ratio: "16/9",
      },
    },
    {
      id: "semaforo-y-alertas",
      titulo: "5. Configurar semáforo de desviaciones y alertas visuales",
      esPasoHowTo: true,
      resumenHowTo:
        "Aplica conjuntos de iconos de 3 semáforos y reglas de formato condicional diferenciadas para ingresos y egresos.",
      parrafos: [
        "Leer una columna con veinte porcentajes exige esfuerzo mental para distinguir qué partida requiere acción urgente. Un semáforo visual reduce ese diagnóstico a dos segundos. Sin embargo, hay un matiz financiero crítico que muchos tutoriales pasan por alto: una desviación de +15 % es excelente si hablamos de Ventas (ingresó más dinero del esperado), pero es una alerta roja si hablamos de Gastos de Logística o Telefonía.",
        "Para resolverlo sin complicar las fórmulas, agrega una columna llamada Indicador_Estado que invierta el signo cuando el Tipo sea Ingreso, o crea una columna auxiliar Desviacion_Favorable que muestre siempre valores positivos cuando vas mejor que el plan y negativos cuando vas peor. Sobre esa columna aplica Inicio > Formato condicional > Conjuntos de iconos > 3 semáforos (sin marco).",
        "Luego entra en Administrar reglas > Editar regla sobre el conjunto de iconos. Cambia el tipo de valor de 'Porcentual' a 'Número' (esto es clave en Excel, porque 'Porcentual' evalúa percentiles relativos del rango y no porcentajes reales). Configura verde cuando el valor es >= -0,02 (tolerancia de hasta 2 % de sobrecosto), amarillo cuando es < -0,02 y >= -0,10 (alerta temprana entre 2 % y 10 % de exceso), y rojo cuando es < -0,10 (desviación crítica mayor al 10 %).",
      ],
      listaOrdenada: [
        "Crea la columna Desviacion_Control en Real_vs_Ppto usando =SI(B5=\"Ingreso\";F5;-F5), donde F5 es la desviación porcentual.",
        "Selecciona el rango de Desviacion_Control y ve a Inicio > Formato condicional > Conjuntos de iconos.",
        "Abre Administrar reglas > Editar regla y cambia ambos desplegables 'Tipo' de Porcentual a Número.",
        "Define Verde para >= -0,02, Amarillo para >= -0,10 y Rojo para valores menores a -0,10.",
        "Opcionalmente, agrega una regla de relleno rojo claro sobre el nombre de la partida cuando el gasto real supere el presupuesto anual acumulado.",
      ],
      captura: {
        id: "como-hacer-presupuesto-en-excel-paso-4",
        alt: "Cuadro de edición de regla de formato condicional en Excel configurado con tipo Número y umbrales -0,02 y -0,10 para semáforos",
        caption: "Configuración exacta del semáforo usando Tipo Número para evitar distorsiones por percentiles.",
        ratio: "16/9",
      },
    },
    {
      id: "presupuesto-de-proyecto",
      titulo: "6. Adaptar la plantilla para el presupuesto de un proyecto",
      esPasoHowTo: true,
      resumenHowTo:
        "Reemplaza los meses fijos por etapas o entregables, añade un fondo de contingencia y vincula los hitos con una carta Gantt.",
      parrafos: [
        "Si necesitas presupuestar una remodelación, una campaña de lanzamiento o un contrato de consultoría, el calendario de enero a diciembre suele quedar corto o incómodo porque el proyecto se mide por fases (Inicio, Diseño, Ejecución, Cierre) más que por meses calendario.",
        "En ese caso, duplica la estructura del libro y reemplaza la columna Mes por Etapa_Proyecto (Etapa 1, Etapa 2, etc.) en el catálogo y en el registro real. Añade una columna extra de Cantidad y Precio_Unitario para calcular el monto presupuestado como Cantidad × Precio_Unitario (por ejemplo, 40 horas de desarrollo o 120 m² de material) y suma una partida específica de Contingencia equivalente al 10 % del costo directo total.",
        "Para controlar plazos y costos de forma integrada, conviene cruzar las fechas de inicio y término de cada etapa con una planificación visual de tareas. Puedes construir esa línea de tiempo siguiendo nuestra guía de cómo hacer una carta Gantt en Excel (/guias/carta-gantt-en-excel) y referenciar las fechas de término directamente en tu hoja de presupuesto para proyectar cuándo se ejecutará cada desembolso.",
      ],
      captura: {
        id: "como-hacer-presupuesto-en-excel-paso-5",
        alt: "Presupuesto de proyecto en Excel desglosado por etapas, cantidad, precio unitario, línea de contingencia del 10 % y variación",
        caption: "Adaptación de la estructura a presupuesto por etapas con cálculo unitario y fondo de contingencia.",
        ratio: "16/9",
      },
    },
  ],
  erroresComunes: [
    {
      error: "Aparece #¡DIV/0! en la columna de desviación porcentual",
      causa: "Se ejecutó un gasto real en una partida que tenía $0 presupuestados para ese mes, o la celda del presupuesto está vacía.",
      solucion: "Envuelve la fórmula en =SI.ERROR((Real-Ppto)/Ppto;0) para devolver 0 % o un texto como \"Sin ppto\" en imprevistos.",
    },
    {
      error: "El semáforo de iconos muestra todos los valores en amarillo o verde sin respetar tus umbrales",
      causa: "Excel deja por defecto el criterio de iconos en 'Porcentual' (percentiles del rango) en lugar de 'Número'.",
      solucion: "Entra a Formato condicional > Administrar reglas > Editar regla y cambia Tipo a 'Número', ingresando decimales como -0,02 y -0,10.",
    },
    {
      error: "SUMAR.SI.CONJUNTO devuelve 0 aunque hay gastos ingresados en Registro_Real",
      causa: "Las fechas en la columna Mes del registro real tienen días distintos (ej. 14-03-2026) mientras que el selector tiene el día 1 (01-03-2026), o el código tiene un espacio al final.",
      solucion: "Normaliza la columna Mes con =FIN.MES(Fecha;-1)+1 y utiliza Validación de datos en Codigo para impedir espacios adicionales.",
    },
    {
      error: "Interpretar como negativo un aumento en las ventas reales respecto al presupuesto",
      causa: "Aplicar la misma regla de color a ingresos y egresos sin considerar el signo financiero.",
      solucion: "Usa una columna auxiliar de control que invierta el signo solo cuando Tipo = \"Ingreso\", o separa los ingresos en una tabla superior con su propio semáforo.",
    },
  ],
  plantilla: {
    titulo: "Plantilla de Presupuesto Mensual y Control de Desviaciones en Excel",
    descripcion:
      "Libro descargable preconfigurado con catálogo de partidas, matriz de 12 meses, registro de gastos reales, fórmulas BUSCARX/SUMAR.SI.CONJUNTO y semáforos listos para usar.",
  },
  faqs: [
    {
      q: "¿Qué hago si uso Excel 2016 o 2019 y no tengo la función BUSCARX?",
      a: "Puedes reemplazar BUSCARX por la combinación clásica de INDICE y COINCIDIR: =SI.ERROR(INDICE(rango_resultado;COINCIDIR(valor_buscado;rango_busqueda;0));\"No encontrado\"). Funciona en todas las versiones de Excel.",
    },
    {
      q: "¿Conviene hacer el presupuesto con IVA incluido o neto?",
      a: "En un presupuesto personal o de hogar siempre se trabaja con montos brutos (con IVA incluido), porque es el dinero efectivo que sale de tu bolsillo. En una pyme afecta a IVA conviene presupuestar ingresos y costos en valores netos y llevar el pago mensual de IVA en el flujo de caja.",
    },
    {
      q: "¿Cómo presupuesto gastos en UF o dólares sin recalcular todo cada mes?",
      a: "Crea una pequeña tabla de parámetros en la hoja Partidas con el valor estimado de la UF y el dólar para cada mes. Ingresa el monto original en UF en una columna auxiliar y multiplica por el tipo de cambio del mes correspondiente en la grilla mensual.",
    },
    {
      q: "¿Cada cuánto tiempo debería actualizar la hoja Registro_Real?",
      a: "Para finanzas personales funciona muy bien una actualización semanal de 10 minutos descargando la cartola del banco. En pymes, lo recomendable es cargar los movimientos dos veces por semana o al cierre de cada viernes para detectar desviaciones antes de fin de mes.",
    },
    {
      q: "¿Puedo usar este mismo archivo para el año siguiente?",
      a: "Sí. Guarda una copia del libro al cerrar diciembre, actualiza las fechas de los encabezados en Ppto_Mensual al nuevo año, limpia las filas de tblReal y ajusta los montos proyectados según el cierre real del período anterior.",
    },
  ],
  relacionadas: [
    "como-hacer-flujo-de-caja-en-excel",
    "control-de-gastos-en-excel",
    "carta-gantt-en-excel",
  ],
  enlacesExternos: [
    {
      label: "Documentación oficial de SI.ERROR (IfError) en Excel",
      url: "https://learn.microsoft.com/es-es/office/vba/api/excel.worksheetfunction.iferror",
      fuente: "Microsoft Learn",
    },
    {
      label: "Referencia oficial de funciones de búsqueda en Excel",
      url: "https://learn.microsoft.com/es-es/office/vba/api/excel.worksheetfunction",
      fuente: "Microsoft Learn",
    },
  ],
  enlacesInternosExtra: [
    {
      label: "Cómo hacer una carta Gantt automática en Excel",
      href: "/guias/carta-gantt-en-excel",
      descripcion: "Complementa tu presupuesto de proyecto con un cronograma visual de tareas y avance.",
    },
  ],
};

export default guia;
