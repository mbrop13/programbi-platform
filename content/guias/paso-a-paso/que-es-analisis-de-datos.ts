import type { GuiaPasoAPaso } from "@/lib/guias/paso-a-paso-tipos";

export const guia: GuiaPasoAPaso = {
  slug: "que-es-analisis-de-datos",
  title: "Qué es el análisis de datos: tipos, proceso y herramientas",
  meta: "Qué es el análisis de datos, los 4 tipos (descriptivo, diagnóstico, predictivo, prescriptivo), el proceso paso a paso y las herramientas para empezar.",
  h1: "Qué es el análisis de datos y cómo empezar",
  subtitle:
    "Guía clara y aplicada para entender qué hace realmente un analista de datos en una empresa, cómo funcionan los 4 tipos de análisis, las 5 etapas del proceso profesional, qué herramientas aprender primero (Excel, SQL, Power BI, Python e IA) y un ejemplo mínimo resuelto en Excel y SQL.",
  keywordPrincipal: "análisis de datos",
  keywords: [
    "análisis de datos",
    "qué es el análisis de datos",
    "tipos de análisis de datos",
    "proceso análisis de datos",
    "herramientas análisis de datos",
  ],
  curso: "analisis-de-datos",
  herramienta: "Carrera",
  nivel: "Básico",
  updated: "2026-11-21",
  published: "2026-11-21",
  totalTimeIso: "PT20M",
  omitirHowTo: true,
  en30Segundos: {
    queLogras:
      "Comprender con claridad qué es el análisis de datos, distinguir sus 4 niveles de madurez en la empresa, recorrer el flujo completo de 5 etapas y elegir tu primera herramienta técnica sin perderte en la jerga.",
    herramienta: "Excel, SQL, Power BI, Python e IA",
    tiempo: "20 minutos de lectura",
    bullets: [
      "Diferenciar análisis descriptivo, diagnóstico, predictivo y prescriptivo con casos reales de negocio.",
      "Aplicar el proceso en 5 etapas: pregunta de negocio, recolección, limpieza, análisis y comunicación.",
      "Comparar Excel, SQL, Power BI y Python para saber cuál aprender según tu objetivo laboral.",
      "Ver el mismo problema de ventas resuelto en una fórmula Excel (ES/EN) y en una consulta SQL.",
    ],
  },
  rutaVisual: [
    {
      numero: 1,
      titulo: "Definición simple",
      resumen: "Transformar registros crudos en decisiones medibles.",
      anchorId: "definicion-simple",
      icono: "sparkles",
    },
    {
      numero: 2,
      titulo: "Los 4 tipos",
      resumen: "Descriptivo, diagnóstico, predictivo y prescriptivo.",
      anchorId: "cuatro-tipos-analisis",
      icono: "layers",
    },
    {
      numero: 3,
      titulo: "Proceso en 5 etapas",
      resumen: "Desde la pregunta de negocio hasta el reporte final.",
      anchorId: "proceso-cinco-etapas",
      icono: "settings",
    },
    {
      numero: 4,
      titulo: "Herramientas clave",
      resumen: "Compara Excel, SQL, Power BI, Python e IA.",
      anchorId: "herramientas-analisis",
      icono: "database",
    },
    {
      numero: 5,
      titulo: "Ejemplo Excel y SQL",
      resumen: "Calcula ventas por sucursal en dos lenguajes.",
      anchorId: "ejemplo-excel-sql",
      icono: "code",
    },
    {
      numero: 6,
      titulo: "Ruta para empezar",
      resumen: "Orden recomendado para aprender y conseguir rol.",
      anchorId: "como-aprender-ruta",
      icono: "check",
    },
  ],
  requisitos: {
    version: "No requiere conocimientos previos de programación",
    lista: [
      "Curiosidad por entender cómo funcionan los indicadores de un negocio (ventas, márgenes, tiempos de entrega o retención).",
      "Acceso básico a Excel o Google Sheets para probar el primer ejemplo práctico.",
      "Ganas de aprender a formular preguntas claras antes de tocar cualquier herramienta.",
    ],
    compatibilidadMacWeb:
      "Los conceptos de análisis de datos aplican por igual en Windows, Mac y entornos web. Para practicar SQL y Python puedes usar editores gratuitos en navegador o instalados localmente en cualquier sistema operativo.",
  },
  secciones: [
    {
      id: "definicion-simple",
      titulo: "1. Definición simple de análisis de datos",
      parrafos: [
        "El análisis de datos es el proceso disciplinado de recopilar, limpiar, transformar y explorar registros históricos o actuales para responder preguntas concretas y tomar mejores decisiones. No se trata de hacer gráficos bonitos ni de acumular hojas de cálculo gigantes, sino de reducir la incertidumbre frente a un problema real.",
        "En el día a día de una empresa en Chile o Latinoamérica, los datos nacen dispersos: facturas electrónicas en el ERP, movimientos bancarios en planillas, tickets de soporte en un CRM, campañas en plataformas de anuncios y asistencia en relojes control. Por sí solos, esos millones de filas no dicen nada. El trabajo del analista consiste en convertir esos registros en evidencia clara: qué pasó, por qué ocurrió, qué podría pasar el próximo mes y qué acción conviene tomar hoy.",
        "También es importante no confundir el análisis de datos (Data Analytics) con la ciencia de datos (Data Science) ni con la ingeniería de datos. Mientras la ingeniería construye las tuberías para mover y almacenar grandes volúmenes de información y la ciencia de datos entrena modelos estadísticos y de aprendizaje automático, el análisis de datos vive más cerca de la operación y la gerencia, traduciendo números en prioridades comerciales, financieras u operativas.",
      ],
    },
    {
      id: "cuatro-tipos-analisis",
      titulo: "2. Los 4 tipos de análisis de datos con ejemplos de empresa",
      parrafos: [
        "En la industria suele dividirse la madurez analítica en cuatro niveles progresivos. Cada nivel responde a una pregunta distinta y aporta mayor valor estratégico, aunque ningún equipo puede saltar al cuarto nivel sin haber resuelto bien el primero.",
      ],
      lista: [
        "Análisis descriptivo («¿Qué pasó?»): resume el desempeño histórico mediante promedios, totales, tasas y comparaciones contra períodos anteriores. Ejemplo real: un reporte mensual de retail que muestra que las ventas de la Región Metropolitana cayeron un 8 % en octubre respecto a septiembre.",
        "Análisis diagnóstico («¿Por qué pasó?»): profundiza en los datos desagregados para aislar la causa raíz de una variación. Ejemplo real: al cruzar ventas por categoría, canal y quiebre de stock, el analista descubre que la caída del 8 % se concentró en dos bodegas que pasaron nueve días sin reposición de productos estrella.",
        "Análisis predictivo («¿Qué es probable que pase?»): utiliza patrones históricos, estacionalidad y modelos estadísticos para estimar escenarios futuros. Ejemplo real: una empresa de telecomunicaciones calcula qué clientes tienen mayor probabilidad de cancelar su plan el próximo trimestre según reclamos recientes y caída de uso.",
        "Análisis prescriptivo («¿Qué deberíamos hacer?»): evalúa alternativas y restricciones para recomendar la mejor acción concreta. Ejemplo real: un modelo de inventario sugiere cuánto stock reponer en cada sucursal antes del CyberDay considerando costo de bodega, tiempo de envío y margen esperado.",
      ],
      captura: {
        id: "que-es-analisis-de-datos-paso-1",
        alt: "Diagrama comparativo de los cuatro tipos de análisis de datos desde descriptivo hasta prescriptivo",
        caption:
          "La mayoría de las empresas concentra su esfuerzo diario en análisis descriptivo y diagnóstico antes de avanzar hacia modelos predictivos.",
        ratio: "16/9",
      },
    },
    {
      id: "proceso-cinco-etapas",
      titulo: "3. El proceso de análisis de datos en 5 etapas",
      parrafos: [
        "Un error clásico al comenzar es abrir Excel o Power BI inmediatamente y ponerse a probar gráficos sin rumbo. Los analistas experimentados siguen una secuencia de cinco etapas que ahorra horas de retrabajo y evita conclusiones engañosas.",
      ],
      listaOrdenada: [
        "1. Definir la pregunta de negocio y el criterio de éxito: antes de pedir bases de datos, aclara qué decisión depende del análisis. No es lo mismo «revisar las ventas» que «identificar qué 5 productos explican el 70 % de las devoluciones del último trimestre».",
        "2. Recolectar y entender las fuentes de datos: identifica en qué sistema viven los registros (ERP, base SQL, Excel de área o API), cuál es su granularidad (una fila por boleta vs una fila por cliente) y qué período cubren.",
        "3. Limpiar y transformar (la etapa más subestimada): corrige fechas guardadas como texto, unifica nombres de comunas o sucursales escritos distinto, detecta filas duplicadas y documenta cómo se trataron los valores nulos.",
        "4. Analizar, cruzar y validar: aplica agregaciones, segmentaciones por cohorte o comparaciones interanuales. Contrasta siempre tus totales contra una fuente contable oficial para confirmar que no se perdieron ni duplicaron registros en el camino.",
        "5. Comunicar hallazgos y recomendar acción: sintetiza el resultado en un dashboard o resumen ejecutivo breve, destacando primero la conclusión principal, luego la evidencia visual y finalmente el siguiente paso sugerido.",
      ],
    },
    {
      id: "herramientas-analisis",
      titulo: "4. Herramientas principales: Excel, SQL, Power BI y Python",
      parrafos: [
        "No necesitas dominar diez tecnologías el primer mes. Cada herramienta cumple un rol específico dentro del flujo de trabajo de un analista, y entender para qué sirve cada una te ayuda a invertir tu tiempo de estudio con criterio.",
      ],
      tabla: {
        caption: "Comparativa de herramientas esenciales para análisis de datos",
        encabezados: [
          "Herramienta",
          "Rol principal en el equipo",
          "Volumen cómodo",
          "Curva inicial",
        ],
        filas: [
          [
            "Excel (+ Power Query)",
            "Exploración rápida, modelos financieros, reportes ad hoc y limpieza tabular",
            "Hasta cientos de miles de filas",
            "Baja (es el punto de partida estándar en oficinas)",
          ],
          [
            "SQL (SQL Server, PostgreSQL)",
            "Consultar, filtrar y cruzar tablas directamente en bases de datos corporativas",
            "Millones de filas sin lentitud",
            "Media-baja (sintaxis declarativa muy lógica)",
          ],
          [
            "Power BI (DAX + Modelado)",
            "Dashboards interactivos automatizados y modelos estrella compartidos",
            "Millones de filas comprimidas",
            "Media (requiere entender modelo estrella y DAX)",
          ],
          [
            "Python (pandas + matplotlib)",
            "Automatización avanzada, limpieza compleja, APIs y análisis estadístico",
            "Millones de filas y múltiples formatos",
            "Media-alta (programación estructurada)",
          ],
        ],
      },
      captura: {
        id: "que-es-analisis-de-datos-paso-2",
        alt: "Flujo integrado mostrando cómo SQL alimenta Power BI y Python o Excel para consumo ejecutivo",
        caption:
          "En equipos reales estas herramientas no compiten entre sí: SQL extrae y filtra, Power BI distribuye tableros y Excel o Python resuelven análisis puntuales.",
        ratio: "16/9",
      },
    },
    {
      id: "analisis-datos-con-ia",
      titulo: "5. Análisis de datos con inteligencia artificial",
      parrafos: [
        "La llegada de asistentes como ChatGPT, Claude, Gemini y Microsoft Copilot cambió la velocidad de trabajo del analista, pero no eliminó la necesidad de criterio técnico. Hoy la IA actúa como un acelerador: te ayuda a escribir consultas SQL, corregir una fórmula BUSCARX, proponer scripts de Python con pandas o resumir hallazgos de una tabla agregada.",
        "Al mismo tiempo, trabajar con IA exige dos precauciones obligatorias: primero, nunca subas planillas con RUT, nombres de clientes o sueldos reales a chats públicos sin anonimizar; segundo, valida siempre el código o las cifras que entrega el modelo, porque un error sutil en un cruce de tablas puede pasar desapercibido si no sabes auditar el resultado.",
      ],
      lista: [
        "Úsala para acelerar sintaxis (fórmulas Excel en español, medidas DAX, scripts M y pandas).",
        "Úsala para depurar mensajes de error explicándole el esquema de tus columnas sin compartir datos reales.",
        "No delegues en la IA la definición de reglas de negocio ni la verificación final de cuadratura contable.",
      ],
    },
    {
      id: "ejemplo-excel-sql",
      titulo: "6. Ejemplo mínimo resuelto en Excel y en SQL",
      parrafos: [
        "Para aterrizar cómo se ve el análisis en la práctica, observa la misma pregunta resuelta en dos herramientas: «¿Cuánto vendió en total cada sucursal considerando únicamente boletas pagadas?».",
        "En Excel, cuando tienes la tabla Ventas con Sucursal en A2:A500, Estado en B2:B500 y MontoNeto en C2:C500, y el nombre de la sucursal que quieres consultar en E2, usas SUMAR.SI.CONJUNTO. En SQL, sobre una tabla llamada ventas en base de datos, escribes una consulta agrupada con WHERE y GROUP BY que entrega el ranking completo de una sola vez.",
      ],
      codigos: [
        {
          titulo: "Ejemplo mínimo en Excel (español ; e inglés ,)",
          lenguaje: "excel",
          codigo: `=SUMAR.SI.CONJUNTO(C2:C500;A2:A500;E2;B2:B500;"Pagada")`,
          codigoEn: `=SUMIFS(C2:C500,A2:A500,E2,B2:B500,"Pagada")`,
          nota: "Calcula la suma de MontoNeto solo para la sucursal indicada en E2 cuando el estado es 'Pagada'.",
        },
        {
          titulo: "El mismo análisis en SQL estándar",
          lenguaje: "sql",
          codigo: `SELECT
    sucursal,
    COUNT(*) AS total_boletas,
    SUM(monto_neto) AS venta_total_clp
FROM ventas
WHERE estado = 'Pagada'
GROUP BY sucursal
ORDER BY venta_total_clp DESC;`,
          nota: "Filtra primero las boletas válidas con WHERE y agrupa los totales de todas las sucursales en segundos.",
        },
      ],
    },
    {
      id: "como-aprender-ruta",
      titulo: "7. Cómo aprender y ruta recomendada",
      parrafos: [
        "Si partes desde cero, el error más común es intentar aprender estadística avanzada o machine learning antes de saber limpiar una tabla o escribir un SELECT. La ruta con mayor retorno laboral en empresas de Chile y Latinoamérica sigue un orden progresivo muy claro.",
      ],
      listaOrdenada: [
        "Paso 1 — Excel sólido: domina tablas oficiales, BUSCARX/INDICE-COINCIDIR, SUMAR.SI.CONJUNTO, tablas dinámicas y Power Query básico.",
        "Paso 2 — SQL de consulta: aprende SELECT, WHERE, GROUP BY, HAVING, JOIN y funciones de ventana básicas sobre bases relacionales.",
        "Paso 3 — Power BI y modelado estrella: aprende a conectar fuentes, armar una tabla calendario, escribir medidas DAX esenciales y diseñar dashboards legibles.",
        "Paso 4 — Python y automatización con IA: suma pandas para automatizar archivos grandes y usa IA como copiloto manteniendo siempre tus pruebas de validación.",
      ],
    },
  ],
  erroresComunes: [
    {
      error: "Empezar por algoritmos complejos o IA sin dominar lógica tabular básica",
      causa:
        "Muchos principiantes saltan directo a modelos predictivos sin saber hacer un cruce limpio ni detectar duplicados en una tabla.",
      solucion:
        "Consolida primero Excel, SQL y modelado estrella; el 80 % de los problemas reales de empresa se resuelven con datos limpios y buena agregación.",
    },
    {
      error: "Confiar en gráficos atractivos sin verificar si los datos estaban duplicados",
      causa:
        "Un cruce mal hecho en Excel, Power BI o SQL puede duplicar filas y mostrar ventas infladas al doble.",
      solucion:
        "Contrasta siempre tus totales contra una cifra de control conocida (como el total de facturación del ERP) antes de presentar.",
    },
    {
      error: "Confundir correlación con causalidad al redactar conclusiones",
      causa:
        "Ver dos curvas subir al mismo tiempo (por ejemplo, ventas de helados y visitas web en verano) y asumir que una causa la otra.",
      solucion:
        "Plantea hipótesis verificables y considera variables externas como estacionalidad, promociones o cambios de precio.",
    },
  ],
  plantilla: {
    titulo: "Checklist del proceso de análisis de datos en 5 etapas",
    descripcion:
      "Próximamente podrás descargar aquí una guía imprimible de verificación para auditar cada proyecto de datos desde la pregunta inicial hasta la entrega.",
  },
  faqs: [
    {
      q: "¿Necesito título en ingeniería o matemáticas para trabajar en análisis de datos?",
      a: "No es un requisito excluyente. Muchos analistas provienen de administración, finanzas, ingeniería comercial, operaciones, marketing o carreras técnicas. Lo determinante es demostrar criterio de negocio, dominio de Excel, SQL y Power BI, y un portafolio con casos reales bien resueltos.",
    },
    {
      q: "¿Qué aprendo primero: Excel, SQL o Python?",
      a: "Empieza por Excel (tablas dinámicas, búsquedas y Power Query) porque es el idioma común de casi cualquier oficina; luego suma SQL para consultar bases de datos reales y Power BI para visualizar. Python es un excelente cuarto paso cuando necesites automatizar procesos complejos.",
    },
    {
      q: "¿Cuánto tiempo toma aprender lo necesario para un rol junior?",
      a: "Con práctica constante de 6 a 8 horas semanales sobre ejercicios reales, en 3 a 5 meses puedes alcanzar un nivel sólido en Excel, SQL y Power BI suficiente para postular a cargos de analista de datos o control de gestión junior.",
    },
    {
      q: "¿La inteligencia artificial va a reemplazar a los analistas de datos?",
      a: "No reemplaza la responsabilidad ni el contexto de negocio. La IA acelera la escritura de fórmulas, consultas SQL y código Python, pero las empresas siguen necesitando personas capaces de formular las preguntas correctas, limpiar datos desordenados, auditar errores silenciosos y explicar decisiones a gerencia.",
    },
  ],
  relacionadas: [
    "como-ser-analista-de-datos",
    "ciencia-de-datos-vs-analisis-de-datos",
    "chatgpt-para-analisis-de-datos",
  ],
  enlacesExternos: [
    {
      label: "Introducción al análisis de datos en Microsoft Learn",
      url: "https://learn.microsoft.com/es-es/training/paths/data-analytics-microsoft/",
      fuente: "Microsoft Learn",
    },
    {
      label: "Documentación oficial de SQL (PostgreSQL Tutorial)",
      url: "https://www.postgresql.org/docs/current/tutorial-sql.html",
      fuente: "PostgreSQL",
    },
  ],
  enlacesInternosExtra: [
    {
      label: "Sueldo de analista de datos en Latinoamérica",
      href: "/guias/sueldo-analista-de-datos-latinoamerica",
      descripcion: "Revisa rangos salariales y factores que influyen en la renta según experiencia y país.",
    },
    {
      label: "Ruta de formación en Análisis de Datos",
      href: "/cursos/analisis-de-datos",
      descripcion: "Explora el programa estructurado con Excel, SQL, Power BI y Python aplicado.",
    },
  ],
};

export default guia;
