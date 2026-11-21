import type { GuiaPasoAPaso } from "@/lib/guias/paso-a-paso-tipos";

export const guia: GuiaPasoAPaso = {
  slug: "google-sheets-vs-excel",
  title: "Google Sheets vs Excel: diferencias y cuál usar (2026)",
  meta: "Comparamos Google Sheets y Excel: funciones, colaboración, límites de datos, Power Query, IA (Gemini vs Copilot) y precio. Cuál conviene según tu caso.",
  h1: "Google Sheets vs Excel: cuál conviene y cuándo",
  subtitle:
    "Comparación técnica y práctica sin fanatismos entre Google Sheets y Microsoft Excel: colaboración en tiempo real, límites oficiales de celdas, potencia de Power Query frente a Apps Script, asistentes de IA (Gemini vs Copilot) y un mismo problema resuelto en ambas plataformas.",
  keywordPrincipal: "google sheets vs excel",
  keywords: [
    "google sheets vs excel",
    "diferencias Google Sheets y Excel",
    "Excel online vs Google Sheets",
    "Sheets para análisis de datos",
  ],
  curso: "excel",
  herramienta: "Google Sheets",
  nivel: "Básico",
  updated: "2026-11-21",
  published: "2026-11-21",
  totalTimeIso: "PT25M",
  omitirHowTo: true,
  en30Segundos: {
    queLogras:
      "Elegir con criterio técnico entre Google Sheets y Microsoft Excel según el volumen de datos, la necesidad de trabajo simultáneo en equipo, las integraciones y el presupuesto de tu organización.",
    herramienta: "Google Sheets · Microsoft Excel",
    tiempo: "25 minutos",
    bullets: [
      "Comparar punto por punto: capacidad, funciones exclusivas, automatización, IA y costos.",
      "Conocer los límites oficiales de celdas y filas (10 millones de celdas en Sheets vs 1.048.576 filas por hoja en Excel).",
      "Entender cuándo Google Apps Script y QUERY ganan en agilidad web y cuándo Power Query y Power Pivot en Excel son irremplazables.",
      "Ver la misma lógica comercial resuelta con FILTER/QUERY en Sheets y FILTRAR/BUSCARX en Excel (ES y EN).",
    ],
  },
  rutaVisual: [
    {
      numero: 1,
      titulo: "Tabla comparativa",
      resumen: "Resumen directo de capacidades y diferencias.",
      anchorId: "tabla-comparativa-completa",
      icono: "table",
    },
    {
      numero: 2,
      titulo: "Colaboración",
      resumen: "Edición simultánea en navegador vs escritorio.",
      anchorId: "colaboracion-tiempo-real",
      icono: "layers",
    },
    {
      numero: 3,
      titulo: "Límites y motor",
      resumen: "10M de celdas vs más de 1 millón de filas por hoja.",
      anchorId: "limites-celdas-rendimiento",
      icono: "database",
    },
    {
      numero: 4,
      titulo: "Automatización",
      resumen: "Apps Script frente a VBA y Power Query.",
      anchorId: "automatizacion-scripts-power-query",
      icono: "settings",
    },
    {
      numero: 5,
      titulo: "IA y fórmulas",
      resumen: "Gemini vs Copilot y ejemplo práctico lado a lado.",
      anchorId: "ia-y-ejemplo-practico",
      icono: "sparkles",
    },
    {
      numero: 6,
      titulo: "Cuándo elegir cada uno",
      resumen: "Regla rápida por tipo de equipo y proyecto.",
      anchorId: "cuando-usar-cada-uno",
      icono: "check",
    },
  ],
  requisitos: {
    version: "Google Sheets (web/Workspace 2026) y Microsoft Excel 365 / 2021+ (escritorio y web)",
    lista: [
      "Cuenta gratuita de Google o Google Workspace para probar las fórmulas de Google Sheets.",
      "Microsoft Excel (escritorio o Excel para la Web) para probar la contraparte con FILTRAR y BUSCARX.",
    ],
    compatibilidadMacWeb:
      "Google Sheets funciona igual en cualquier navegador (Windows, Mac, Linux y móvil). Excel para la Web es multiplataforma, aunque funciones avanzadas como Power Query completo y Power Pivot siguen teniendo su mejor soporte en Excel de escritorio para Windows.",
  },
  secciones: [
    {
      id: "tabla-comparativa-completa",
      titulo: "Tabla comparativa completa: Google Sheets vs Microsoft Excel",
      esPasoHowTo: true,
      resumenHowTo:
        "Revisa de un vistazo cómo se comparan ambas hojas de cálculo en capacidad, colaboración, ETL, automatización, IA y modelo de precios.",
      parrafos: [
        "Durante años se repitió que Google Sheets era solo una versión liviana de Excel para listas simples. Esa idea quedó obsoleta: Sheets incorporó funciones matriciales dinámicas, tablas estructuradas nativas, conectores hacia BigQuery y un lenguaje de consulta único (QUERY) que Excel no tiene de forma directa.",
        "Al mismo tiempo, Microsoft Excel mantuvo su liderazgo indiscutido en análisis financiero pesado, modelado con millones de registros mediante Power Query y Power Pivot (DAX) y compatibilidad estándar en auditorías, banca y grandes corporativos. La elección correcta ya no pasa por 'cuál es mejor en abstracto', sino por qué cuello de botella quieres evitar en tu equipo.",
      ],
      tabla: {
        caption: "Comparativa técnica: Google Sheets vs Microsoft Excel (2026)",
        encabezados: ["Criterio", "Google Sheets", "Microsoft Excel (365 / Desktop)"],
        filas: [
          [
            "Precio base",
            "Gratis con cuenta personal; planes pagos dentro de Google Workspace",
            "Versión web gratuita limitada; escritorio incluido en Microsoft 365",
          ],
          [
            "Colaboración en tiempo real",
            "Nativa y fluida en navegador desde el primer día",
            "Muy buena en OneDrive/SharePoint, con fricción ocasional en archivos complejos o macros",
          ],
          [
            "Límite oficial de tamaño",
            "Hasta 10 millones de celdas en todo el libro",
            "1.048.576 filas x 16.384 columnas por hoja (y millones en Modelo de Datos)",
          ],
          [
            "ETL y limpieza de datos",
            "Fórmulas QUERY/FILTER o Apps Script; conector BigQuery en Workspace",
            "Power Query nativo (interfaz visual + lenguaje M) muy superior",
          ],
          [
            "Automatización",
            "Google Apps Script (JavaScript en la nube, triggers por hora/evento)",
            "Macros VBA en escritorio + Office Scripts (TypeScript) en la web",
          ],
          [
            "Funciones exclusivas destacadas",
            "QUERY (tipo SQL), IMPORTRANGE, GOOGLEFINANCE, SPARKLINE flexible",
            "Power Pivot (DAX), cubos OLAP, LET/LAMBDA con mejor rendimiento en escala",
          ],
          [
            "Asistente de IA integrado",
            "Gemini en Google Sheets (Workspace / Google One AI)",
            "Microsoft 365 Copilot en Excel (requiere licencia Copilot)",
          ],
        ],
      },
      captura: {
        id: "google-sheets-vs-excel-paso-1",
        alt: "Comparativa lado a lado entre la interfaz web de Google Sheets y Microsoft Excel 365 mostrando paneles y funciones clave.",
        caption: "Dos filosofías distintas: agilidad colaborativa en la nube (Sheets) frente a potencia analítica local y corporativa (Excel).",
        ratio: "16/9",
      },
    },
    {
      id: "colaboracion-tiempo-real",
      titulo: "Colaboración en tiempo real y control de versiones",
      esPasoHowTo: true,
      resumenHowTo:
        "Evalúa la fluidez de edición simultánea, permisos por rango y trazabilidad de cambios en equipos distribuidos.",
      parrafos: [
        "En colaboración simultánea, Google Sheets sigue teniendo una ventaja cultural y técnica muy clara. Como nació pensado 100% para el navegador, diez personas pueden editar celdas distintas al mismo tiempo, comentar con menciones, revisar el historial granular de ediciones y restaurar cualquier versión anterior con un clic sin preocuparse por dónde está guardado el archivo.",
        "Microsoft Excel ha mejorado muchísimo gracias a la coautoría en OneDrive y SharePoint junto con Excel para la Web. Sin embargo, en equipos mixtos donde alguien abre el archivo en Excel de escritorio, otro usa una versión antigua de Office y otro intenta ejecutar una macro VBA, siguen apareciendo conflictos de guardado, bloqueos temporales o diferencias de formato.",
        "Otro punto fuerte de Google Sheets es la función IMPORTRANGE, que permite traer rangos en vivo desde otro libro en Drive con permisos explícitos, facilitando tableros alimentados por múltiples áreas sin enviar adjuntos por correo.",
      ],
      captura: {
        id: "google-sheets-vs-excel-paso-2",
        alt: "Edición simultánea en Google Sheets mostrando cursores de varios usuarios, comentarios con menciones y el historial de versiones.",
        caption: "Colaboración nativa en tiempo real e historial detallado de cambios en Google Sheets.",
        ratio: "16/9",
      },
    },
    {
      id: "limites-celdas-rendimiento",
      titulo: "Límites oficiales de celdas/filas y rendimiento con datos grandes",
      esPasoHowTo: true,
      resumenHowTo:
        "Conoce los topes documentados por Google y Microsoft y en qué punto la hoja empieza a volverse lenta.",
      parrafos: [
        "Cuando el volumen de datos crece, las diferencias de arquitectura se notan de inmediato. Según la documentación oficial de Google (consultada el 21 de noviembre de 2026), una hoja de cálculo de Google Sheets admite un máximo de 10 millones de celdas en total sumando todas sus pestañas. Eso significa que si tienes una tabla de 20 columnas, el tope teórico ronda las 500.000 filas; pero en la práctica, mucho antes —alrededor de las 80.000 a 150.000 filas con fórmulas volátiles o QUERY complejos— el navegador comienza a sentirse pesado.",
        "Microsoft Excel, por su parte, soporta oficialmente 1.048.576 filas por 16.384 columnas en cada hoja individual (más de 17 mil millones de celdas por pestaña según Microsoft Learn, consultado el 21 de noviembre de 2026). Y si necesitas analizar aún más registros, Power Query y el Modelo de Datos (Power Pivot) comprimen millones de filas en memoria usando el motor columnar VertiPaq, el mismo corazón de Power BI.",
        "Por eso la regla de rendimiento es clara: para catálogos medianos, presupuestos ágiles, CRM de pymes y formularios operativos, Google Sheets vuela; cuando superas los cientos de miles de transacciones o cruzas múltiples CSV pesados cada semana, Excel de escritorio con Power Query juega en otra liga.",
      ],
      captura: {
        id: "google-sheets-vs-excel-paso-3",
        alt: "Comparación visual de capacidad: tope de 10 millones de celdas totales en Google Sheets frente a 1.048.576 filas por hoja y Power Pivot en Excel.",
        caption: "Diferencia de escala entre el límite total en nube de Sheets y la capacidad local + Power Pivot de Excel.",
        ratio: "16/9",
      },
    },
    {
      id: "automatizacion-scripts-power-query",
      titulo: "Automatización: Apps Script vs VBA y Power Query",
      esPasoHowTo: true,
      resumenHowTo:
        "Compara cómo se automatizan cargas, limpiezas y envíos de correo en cada plataforma.",
      parrafos: [
        "En automatización ambos mundos ofrecen herramientas poderosas pero con enfoques opuestos. Google Sheets brilla al conectarse con servicios web: con Google Apps Script (basado en JavaScript) puedes leer APIs REST, generar PDFs en Drive, enviar correos automáticos por Gmail o actualizar datos cada madrugada usando activadores (triggers) en la nube sin dejar tu computador encendido.",
        "Excel responde con dos pilares: Power Query y macros VBA (además de Office Scripts para automatización web en Microsoft 365). Power Query permite limpiar, unir y transformar archivos CSV, carpetas completas, PDFs o bases SQL mediante pasos grabados visualmente sin escribir código manual; es probablemente la herramienta más productiva que existe para un analista que trabaja con archivos locales o de red.",
        "VBA sigue presente en miles de empresas chilenas para automatizar tareas de escritorio y formularios legados, aunque para integraciones modernas con Microsoft 365 suelen preferirse Office Scripts combinados con Power Automate.",
      ],
      captura: {
        id: "google-sheets-vs-excel-paso-4",
        alt: "Pantalla dividida mostrando el editor de Google Apps Script en el navegador junto al Editor de Power Query en Microsoft Excel.",
        caption: "Apps Script orientado a APIs y automatización web vs Power Query para ETL visual sin código.",
        ratio: "16/9",
      },
    },
    {
      id: "ia-y-ejemplo-practico",
      titulo: "IA (Gemini vs Copilot) y un mismo problema resuelto en ambos",
      esPasoHowTo: true,
      resumenHowTo:
        "Compara los asistentes de IA integrados y observa cómo se escribe la misma consulta filtrada en Google Sheets y en Excel.",
      parrafos: [
        "Tanto Google como Microsoft han integrado inteligencia artificial generativa directamente en sus planillas bajo suscripciones pagadas. Gemini en Google Sheets ayuda a generar tablas organizadas desde instrucciones en lenguaje natural, resumir contenidos y asistir con fórmulas dentro del ecosistema Google Workspace. Copilot en Excel permite solicitar columnas calculadas con Python en Excel, tablas dinámicas y resúmenes de tendencias sobre tablas formateadas.",
        "Para ver cómo se comportan en el día a día sin IA, resolvamos exactamente el mismo requerimiento comercial en ambas herramientas: tienes una tabla de ventas en A2:D100 (Fecha, Sucursal, Categoría, Monto) y quieres extraer dinámicamente todas las filas de la sucursal 'Santiago' con Monto mayor o igual a $100.000, ordenadas de mayor a menor monto.",
        "En Google Sheets puedes resolverlo con FILTER + SORT o en una sola línea usando la potente función QUERY (que acepta sintaxis parecida a SQL). En Excel moderno (365 / 2021+) lo resuelves con FILTRAR y ORDENAR, y si además necesitas cruzar el código de producto contra otra tabla, BUSCARX funciona de forma idéntica en ambas plataformas.",
      ],
      codigos: [
        {
          titulo: "Google Sheets: extraer y ordenar con QUERY (o FILTER + SORT)",
          lenguaje: "sheets",
          codigo: '=QUERY(A2:D100; "SELECT A, B, C, D WHERE B = \'Santiago\' AND D >= 100000 ORDER BY D DESC"; 0)',
          codigoEn: '=QUERY(A2:D100, "SELECT A, B, C, D WHERE B = \'Santiago\' AND D >= 100000 ORDER BY D DESC", 0)',
          nota: "QUERY es exclusiva de Google Sheets y permite filtrar, agrupar y ordenar usando cláusulas tipo SQL en una sola fórmula.",
        },
        {
          titulo: "Microsoft Excel (365 / 2021+): equivalente dinámico con ORDENAR y FILTRAR",
          lenguaje: "excel",
          codigo: '=ORDENAR(FILTRAR(A2:D100; (B2:B100="Santiago")*(D2:D100>=100000); "Sin resultados"); 4; -1)',
          codigoEn: '=SORT(FILTER(A2:D100, (B2:B100="Santiago")*(D2:D100>=100000), "Sin resultados"), 4, -1)',
          nota: "En FILTRAR se multiplican las condiciones con (*) para exigir que ambas se cumplan simultáneamente.",
        },
      ],
      captura: {
        id: "google-sheets-vs-excel-paso-5",
        alt: "Comparación de fórmulas dinámicas mostrando QUERY en Google Sheets y ORDENAR(FILTRAR(...)) en Microsoft Excel devolviendo la misma tabla.",
        caption: "Misma regla comercial resuelta dinámicamente con QUERY en Sheets y ORDENAR+FILTRAR en Excel.",
        ratio: "16/9",
      },
    },
    {
      id: "cuando-usar-cada-uno",
      titulo: "Cuándo usar Google Sheets y cuándo usar Microsoft Excel",
      esPasoHowTo: true,
      resumenHowTo:
        "Aplica esta guía práctica de decisión según el tamaño de tu equipo, tus fuentes de datos y tu flujo de entrega.",
      parrafos: [
        "La mayoría de los equipos de datos modernos en Chile no eligen uno para siempre: conviven con ambos. Entender en qué momento pasar de una planilla a la otra evita perder horas luchando contra las limitaciones del entorno equivocado.",
      ],
      lista: [
        "Elige Google Sheets cuando: necesites que varias personas actualicen la misma planilla al mismo tiempo desde cualquier sistema operativo, recopiles respuestas desde Google Forms, conectes APIs ligeras con Apps Script o trabajes en una startup/pyme que ya opera en Google Workspace.",
        "Elige Microsoft Excel cuando: manejes más de 100.000 filas o múltiples archivos pesados, necesites limpiar y consolidar carpetas completas con Power Query, construyas modelos financieros complejos o tableros conectados a Power BI y SQL Server, o trabajes en empresas estandarizadas en Microsoft 365.",
      ],
      captura: {
        id: "google-sheets-vs-excel-paso-6",
        alt: "Matriz de decisión final indicando escenarios ideales para Google Sheets frente a Microsoft Excel.",
        caption: "Criterios claros para decidir entre Google Sheets y Excel según caso de uso.",
        ratio: "16/9",
      },
      alerta: {
        tipo: "tip",
        titulo: "Si superas ambos límites, da el siguiente paso",
        texto:
          "Cuando notas que tanto Google Sheets como Excel tardan minutos en recalcular o se cierran por memoria, es la señal exacta para mover la limpieza a Python/SQL y la visualización a Power BI.",
      },
    },
  ],
  erroresComunes: [
    {
      error: "Fórmulas con QUERY o IMPORTRANGE se rompen al exportar un Google Sheet a .xlsx",
      causa:
        "QUERY, IMPORTRANGE y GOOGLEFINANCE son funciones exclusivas de Google Sheets que no existen en Microsoft Excel.",
      solucion:
        "Antes de descargar como .xlsx para un cliente que usa Excel, pega como valores las hojas que dependan de funciones exclusivas de Google o reemplázalas por equivalentes compatibles como FILTRAR y BUSCARX.",
    },
    {
      error: "Confundir separador de argumentos (coma vs punto y coma) al copiar fórmulas entre ambos",
      causa:
        "La configuración regional de la cuenta de Google Sheets o del sistema operativo en Excel determina si se usa (;) o (,).",
      solucion:
        "En Chile (configuración regional español-Chile), ambos usan punto y coma (;) para separar argumentos y coma (,) como separador decimal. Si la hoja está en inglés (Estados Unidos), usa coma (,).",
    },
    {
      error: "Llenar miles de filas con IMPORTRANGE y formato condicional en Google Sheets hasta congelar la pestaña",
      causa:
        "Cada llamada de red y regla condicional compleja se recalcula en el navegador del usuario.",
      solucion:
        "Consolida un solo IMPORTRANGE en una pestaña oculta de datos crudos y referencia esa pestaña localmente, o migra el cruce pesado a BigQuery / Power Query.",
    },
  ],
  plantilla: {
    titulo: "Comparador práctico: mismo caso comercial en .xlsx y Google Sheets",
    descripcion:
      "Próximamente podrás descargar aquí el archivo de ejemplo con las tablas, fórmulas QUERY, FILTRAR y BUSCARX listas para probar en ambas plataformas.",
  },
  faqs: [
    {
      q: "¿Puedo abrir y editar archivos de Excel (.xlsx) directamente en Google Sheets?",
      a: "Sí. Google Sheets permite subir y editar archivos .xlsx sin convertirlos, manteniendo la mayoría de fórmulas estándar (SI, SUMAR.SI, BUSCARV, BUSCARX). Sin embargo, las macros VBA, conexiones Power Query y tablas dinámicas muy complejas de Excel no se ejecutan dentro de Sheets.",
    },
    {
      q: "¿Google Sheets tiene tablas dinámicas y BUSCARX como Excel?",
      a: "Sí. Google Sheets incluye tablas dinámicas desde el menú Insertar y soporta XLOOKUP (BUSCARX en español cuando la interfaz está en español) desde 2022.",
    },
    {
      q: "¿Cuál es mejor para aprender análisis de datos desde cero?",
      a: "Ambos sirven perfectamente para aprender lógica de fórmulas, filtros y tablas dinámicas. Si apuntas a trabajar en empresas medianas o grandes en Chile y Latinoamérica, conviene practicar también en Microsoft Excel porque sigue siendo el estándar corporativo junto con Power BI.",
    },
    {
      q: "¿Excel para la Web (gratis) reemplaza a Google Sheets?",
      a: "Excel para la Web ha mejorado bastante para edición básica compartida, pero todavía tiene menos fluidez colaborativa que Google Sheets y no incluye la potencia completa de Power Query ni VBA de la versión de escritorio.",
    },
  ],
  relacionadas: [
    "gemini-en-google-sheets",
    "power-bi-vs-excel",
    "formulas-de-excel-mas-usadas",
  ],
  enlacesExternos: [
    {
      label: "Límites de archivos y celdas en Google Sheets (Ayuda oficial de Google)",
      url: "https://support.google.com/drive/answer/37603?hl=es",
      fuente: "Google",
    },
    {
      label: "Lista de funciones de Google Sheets (QUERY, FILTER, XLOOKUP)",
      url: "https://support.google.com/docs/table/25273?hl=es",
      fuente: "Google",
    },
    {
      label: "Documentación oficial de desarrollo y límites en Excel",
      url: "https://learn.microsoft.com/es-es/office/dev/scripts/overview/excel",
      fuente: "Microsoft Learn",
    },
  ],
};

export default guia;
