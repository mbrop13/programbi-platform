---
slug: curso-analitica-mineria-colombia
ruta_sugerida: /co/guias/curso-analitica-mineria-colombia
pais: co
hreflang: es-CO
curso: analisis-de-datos
url_curso: https://www.programbi.com/co/cursos/analisis-de-datos
title: "Curso de Análisis de Datos Minería en Colombia | ProgramBI"
meta: "Curso de análisis de datos para minería en Colombia: Power BI, SQL Server y Python para producción, flota, mantenimiento y sensores. 60 h por nivel en vivo."
h1: "Curso de Análisis de Datos para la Minería en Colombia: Power BI, SQL y Python en vivo"
updated: 2026-11-04
sources:
  - https://www.programbi.com/co/cursos/analisis-de-datos
nota_hermes: |
  ELEMENTO VISUAL: matriz «Mapa del programa» (Power BI / SQL Server / Python × Básico / Intermedio).
  Intención: "curso análisis de datos minería colombia", "curso power bi minería" (transaccional) → click_registro en /co/cursos/analisis-de-datos. country=co, course=analisis-de-datos.
  - PRECIO: {precio_local} = placeholder de config/pricing.ts (WS1), clave analisis-de-datos × co. Manu aún no define el monto: NO escribas cifras. Sin valor → "Consulta el valor por WhatsApp".
  - CURSO: Manu confirmó (4 nov 2026) que «Análisis de datos para la Minería» es el MISMO curso que Análisis de datos; esta guía es su versión con enfoque minero y enlaza a /co/cursos/analisis-de-datos. IGNORA el price 498000 (y durationHours 16) del JSON de la ficha analitica-mineria: no usar en guía, Offer ni checkout.
  - Primeros dos párrafos = respuesta citable (GEO). Schema Article + FAQPage + BreadcrumbList, sin Course/Offer.
  - WhatsApp: "Hola, vengo de la guía de Análisis de Datos para la Minería para Colombia en programbi.com y quiero info del curso en vivo".
---

# Curso de Análisis de Datos para la Minería en Colombia: Power BI, SQL y Python en vivo

**En resumen:** el [curso de Análisis de Datos de ProgramBI, con enfoque en minería, para Colombia](https://www.programbi.com/co/cursos/analisis-de-datos) es un programa de **60 horas por nivel** (20 h de SQL Server, 20 h de Power BI y 20 h de Python), en vivo por Zoom, que combina Power BI, SQL Server y Python para trabajar con información de operación minera e industrial: reportes de turno, flota, mantenimiento, combustible, inventarios y sensores, con apoyo de inteligencia artificial generativa para redactar consultas y scripts. El nivel básico-intermedio tiene un valor de **{precio_local}**; la ficha reporta **cupos abiertos con fecha por confirmar**.

Incluye grabaciones de por vida en el campus, certificado al completar y proyectos con datos reales. En las preguntas frecuentes de la ficha, la clase se ubica a las 17:30, hora de Colombia. Se paga en pesos colombianos con Mercado Pago Colombia, PSE, Nequi o transferencia. Información consultada el 4 de noviembre de 2026.

**[CTA-TOP]** — Cupos abiertos · {precio_local} · «Consultar próxima fecha».

## Para qué sirve

Una operación minera —sea de carbón, oro, materiales de construcción o cualquier otro mineral— produce información a cada hora: producción por frente, horas de equipo, paradas, consumos, resultados de laboratorio, lecturas de instrumentos. Esa información suele quedar dispersa entre hojas de Excel, sistemas de mantenimiento y archivos que exportan los equipos. Este curso enseña a unirla y convertirla en indicadores confiables.

La ficha lo describe como un programa para **optimizar procesos y decisiones en minería** y como **especialización técnica para profesionales mineros e industriales**. El nivel básico-intermedio se centra en tres cosas: **automatizar la captura de datos de turnos**, **consolidar datos de diferentes áreas** con relaciones sólidas y **visualizar leyes de mineral y eficiencia**.

## Mapa del programa

| Bloque | Básico | Intermedio |
|---|---|---|
| **Power BI** | Tableros de operación: flujo de datos de mina e instalaciones, importación de reportes de turno (Excel, CSV, API), depuración de datos de maquinaria, cálculo de disponibilidad, gráficos de tonelaje, seguridad y horas hombre, consultas en lenguaje natural con IA | DAX y relaciones entre áreas: mapas georreferenciados y matrices operativas, medidas de ley promedio, costo por tonelada y eficiencia, CALCULATE, SWITCH y LOOKUPVALUE, seguridad por roles (RLS) por jefatura de turno, IA para medidas de eficiencia de equipos |
| **SQL Server** | Consultas a las bases de la operación: SELECT, TOP para lecturas de sensores, funciones por turno, WHERE para aislar equipos o incidentes, INNER JOIN entre personal y equipos, depuración de nulos, consultas asistidas por IA para reportes de mantenimiento | Consolidados: conciliación de inventario frente a extracción con FULL JOIN, resúmenes por mes, área y material con GROUP BY, cruces de combustible, flota, personal y tonelaje, vistas de control, datasets para machine learning |
| **Python** | Automatización y análisis de tablas: condicionales para alertas de presión y temperatura, diccionarios para clasificar flota, Pandas para históricos de perforación o transporte, depuración de columnas, scripts con IA para formatear logs | Exploración y gráficos: llantas y consumo eléctrico, series de tiempo de vibración, tendencias en molinos y maquinaria pesada, correlación entre clima y eficiencia, validación automática de datos de sensores con IA |

## Situaciones donde se aplica

**El informe diario de producción.** Cada supervisor envía su reporte de turno en Excel. Power BI los toma de una carpeta compartida, aplica las mismas reglas de limpieza y actualiza el tablero de producción y disponibilidad que revisa la dirección de mina.

**La conciliación de inventarios.** Lo extraído según los reportes de mina no siempre coincide con lo registrado en patios o en el inventario. Una consulta con FULL JOIN deja a la vista las diferencias por período y por material para que el área de control las analice.

**Los equipos que más se detienen.** Cruzando eventos de parada, equipos y operadores con INNER JOIN, se identifica qué máquinas concentran las detenciones y en qué turnos, insumo directo para el plan de mantenimiento.

**Las alertas de instrumentación.** Un script de Python revisa el archivo diario de presión y temperatura, marca las lecturas fuera de los rangos que defina mantenimiento y deja un resumen para el ingeniero de turno.

## Medida DAX de ejemplo

```dax
Ley Promedio Ponderada =
DIVIDE (
    SUMX ( Produccion, Produccion[Toneladas] * Produccion[Ley] ),
    SUM ( Produccion[Toneladas] )
)
```

En el módulo intermedio de Power BI se construyen medidas como esta, que luego se filtran por frente, turno o período sin reescribirlas.

## Proyecto de ejemplo

Un ingeniero de planeación en una operación de Antioquia podría integrar en un solo flujo los reportes de turno, las órdenes de mantenimiento y los consumos de combustible: Python para limpiar los archivos que llegan cada día, SQL Server para guardarlos en tablas relacionadas y consolidarlos en una vista, y Power BI para mostrar producción, disponibilidad, costo por tonelada y causas de parada, con acceso segmentado por jefatura. Es un sistema que puede seguir funcionando después del curso con datos nuevos cada día.

## Preguntas que podrá responder con sus datos al terminar

- ¿Cuántas toneladas se movieron por turno, por frente y por equipo la semana pasada?
- ¿Qué equipos tuvieron menor disponibilidad este mes y cuáles fueron las causas principales de parada?
- ¿Cuánto combustible se consumió por tonelada transportada, y qué camiones se salen del promedio?
- ¿Cómo evolucionó la ley promedio ponderada del material procesado en el trimestre?
- ¿Qué diferencias hay entre lo extraído y lo registrado en inventario, y en qué períodos se concentran?
- ¿Qué lecturas de sensores estuvieron fuera de rango ayer y en qué equipos?
- ¿Hay alguna relación entre las condiciones de clima y la eficiencia de la operación?

Cada una de estas preguntas corresponde a uno o más temas del programa, y la mayoría se puede dejar resuelta en un tablero o en una vista que se actualiza sola.

## Cómo prepararse

Reúna una muestra de los archivos con los que trabaja —un reporte de turno, un listado de órdenes de mantenimiento, un registro de consumos— y retire la información confidencial. Escriba además las preguntas que su jefatura le hace con más frecuencia. Con ese material practicará desde el primer módulo con casos de su propia operación.

## Perfil del participante

Según la ficha, **profesionales mineros e industriales**. Esto incluye ingenieros de minas, de procesos y de mantenimiento; analistas de planeación y control de gestión; supervisores de operación; y profesionales de empresas contratistas que reportan indicadores a la operación. El nivel básico-intermedio es **ideal para quienes inician**, así que no se exige experiencia previa en programación.

## Nivel avanzado

La ficha incluye también un nivel avanzado, orientado a **dominar el ciclo completo del dato, desde la automatización de flotas hasta el mantenimiento predictivo**. Consulte por WhatsApp su fecha y su contenido detallado.

## Rutas complementarias

- [Curso de Power BI](https://www.programbi.com/co/cursos/power-bi) y la [guía para aprender Power BI en Colombia](/co/guias/como-aprender-power-bi-en-colombia), si su prioridad es la visualización.
- [Curso de SQL Server](https://www.programbi.com/co/cursos/sql-server), para profundizar en bases de datos.
- [Curso de Machine Learning](https://www.programbi.com/co/cursos/machine-learning), si quiere avanzar hacia modelos predictivos.

## Errores frecuentes

- Consolidar a mano los reportes de turno todos los días.
- Calcular indicadores sin acordar antes las definiciones: disponibilidad, utilización y rendimiento no significan lo mismo.
- Construir gráficos sobre datos sin depurar.
- Publicar un tablero con información de todas las áreas para todos los usuarios, en lugar de usar seguridad por roles.
- Usar consultas o scripts generados por IA sin revisarlos.

## Información general

- **Niveles:** dos niveles de 60 horas cada uno (20 h SQL Server, 20 h Power BI, 20 h Python).
- **Modalidad:** en vivo por Zoom; grabaciones de por vida.
- **Fecha:** cupos abiertos, por confirmar.
- **Horario:** según la FAQ de la ficha, 17:30 a 19:30, hora de Colombia.
- **Certificado:** al completar.
- **Docente:** Manuel Oliva, Magíster en Data Science (UAI); según la ficha, ha liderado capacitaciones en AngloAmerican, CAP, Deloitte y SQM.
- **Valor:** {precio_local}. Puedes pagar en 3 cuotas sin interés.

**[CTA-MID]** — Descargue el temario detallado.

**[CTA-END]** — {precio_local} · Cupos abiertos · «Inscribirme» · «Escribir por WhatsApp».

## Preguntas frecuentes

**¿Cuánto vale el curso de analítica de datos para minería en Colombia?**
{precio_local}, en pesos colombianos por Mercado Pago Colombia, PSE, Nequi o transferencia.

**¿Cuándo empieza?**
Hay cupos abiertos y la fecha está por confirmar; escriba por WhatsApp para conocer la siguiente cohorte.

**¿Necesito saber programar?**
No. El nivel básico-intermedio parte desde los fundamentos de Power BI, SQL y Python, con apoyo de IA para los primeros scripts.

**¿Aplica a minería de carbón, oro o materiales?**
Sí. Los temas —turnos, flota, mantenimiento, consumos, sensores— son comunes a distintos tipos de operación.

**¿Y si estoy en campo y no puedo conectarme?**
Las sesiones quedan grabadas con acceso de por vida, de modo que puede verlas al volver de campo.

**¿En qué se diferencia del curso de Power BI?**
El curso de Power BI profundiza en una herramienta con ejemplos generales de negocio; este integra Power BI, SQL Server y Python con casos de producción, flota, mantenimiento y sensores.

**¿Qué recibo al terminar?**
Certificado digital de ProgramBI y acceso de por vida a las grabaciones.
