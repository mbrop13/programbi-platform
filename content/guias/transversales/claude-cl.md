---
title: Cómo usar Claude para análisis de datos: guía práctica
description: Prompts probados para limpiar planillas, resumir ventas y detectar anomalías con Claude, más reglas de privacidad. Ejemplos prácticos en CLP.
h1: Cómo usar Claude para analizar datos en tu trabajo (sin programar)
country: cl
lang: es-CL
slug: como-usar-claude-para-analisis-de-datos
path: /guias/como-usar-claude-para-analisis-de-datos
updated: 2026-11-04
course: claude
url_curso: https://www.programbi.com/cursos/claude
sources:
  - https://www.anthropic.com/claude
  - https://support.claude.com/
  - https://www.programbi.com/cursos/claude
  - https://www.programbi.com/cursos/power-bi
  - https://www.programbi.com/cursos/analisis-de-datos
nota_hermes: |
  ELEMENTO VISUAL: arquitectura de un prompt de 5 partes para análisis de datos (rol, contexto, tarea, formato y restricciones).
---
Claude, el asistente de IA de Anthropic, puede leer una planilla, explicarte qué hay en ella, proponer fórmulas y detectar cosas raras en minutos. No reemplaza a un analista ni a Power BI, pero sí elimina buena parte del trabajo repetitivo que hay antes de llegar al análisis. Esta guía te muestra cómo usarlo bien: qué pedirle, cómo pedirlo y qué no delegarle nunca.

<!-- CTA-TOP -->

##### Qué puede hacer Claude con tus datos

- **Entender una planilla desconocida**: «¿Qué columnas tiene, qué significan y qué problemas ves?».
- **Limpiar**: detectar duplicados, fechas en formatos mezclados, montos escritos como texto.
- **Escribir fórmulas de Excel**: BUSCARX, SUMAR.SI.CONJUNTO o tablas dinámicas explicadas paso a paso.
- **Resumir y redactar**: convertir una tabla de resultados en un párrafo para gerencia.
- **Detectar anomalías**: «¿Qué sucursales se comportan distinto este mes?».
- **Preparar el terreno para Power BI**: proponer un modelo estrella o explicar una medida DAX.

##### Cómo pedirlo: estructura de un buen prompt

Un buen prompt tiene cinco partes: **contexto, tarea, formato, tono y restricciones**.

> *Contexto:* Soy analista de control de gestión en una cadena de farmacias con locales en Santiago, Valparaíso y Concepción. Te adjunto las ventas de octubre en CLP.
> *Tarea:* Identifica los 3 locales con mayor caída frente a septiembre y propone 2 hipótesis por local.
> *Formato:* Tabla con local, venta sep., venta oct., variación %, y luego las hipótesis en viñetas.
> *Tono:* Directo, para gerencia.
> *Restricciones:* No inventes datos que no estén en el archivo. Si algo no se puede calcular, dilo.

##### Cinco prompts que funcionan

1. **Diagnóstico**: «Revisa este archivo y lista problemas de calidad de datos: vacíos, duplicados, formatos inconsistentes. Para cada uno, dime cuántas filas afecta.»
2. **Fórmula**: «En la columna D tengo RUT y en la hoja Clientes, RUT y región. Dame la fórmula BUSCARX para traer la región y explícala.»
3. **Resumen ejecutivo**: «Resume esta tabla de ventas en 5 líneas para el gerente, destacando la mayor alza y la mayor caída.»
4. **Anomalías**: «Marca los días con ventas fuera de lo normal para cada local y explica el criterio que usaste.»
5. **Puente a Power BI**: «Propón un modelo estrella para estos datos: qué tabla es de hechos, qué dimensiones y qué relaciones.»

```prompt
Rol: Analista de control de gestión en retail Chile.
Archivo adjunto: ventas_locales.xlsx (montos en CLP).
Tarea: Audita fechas mezcladas, montos guardados como texto y duplicados por número de boleta; entrega un resumen por fila afectada antes de calcular variaciones.
Restricciones: No inventes cifras ni supongas reglas de negocio; si falta una columna clave, indícamelo primero.
```

<!-- CTA-MID -->

##### Un caso completo, paso a paso: el informe mensual de ventas

Supongamos que cada mes recibes un Excel con las ventas de 40 locales en Santiago, Valparaíso y Concepción y tienes que entregar un informe a gerencia. Así se ve el flujo con Claude:

1. **Exploración (5 minutos).** Adjunta el archivo y pide: «Describe la estructura: columnas, tipo de dato de cada una, rango de fechas y totales por región. Señala cualquier cosa rara.» Claude suele detectar fechas en dos formatos, montos como texto («$1.234.567») o locales escritos de dos maneras.
2. **Limpieza guiada.** «Propón los pasos para limpiar estos problemas en Excel con Power Query, en orden. No modifiques los datos: solo dame los pasos.» Así el proceso queda repetible el próximo mes.
3. **Cálculo.** «Calcula la venta de octubre y septiembre por local y la variación porcentual. Muestra la tabla y explica cómo calculaste.» Luego verifica dos o tres locales a mano.
4. **Hallazgos.** «¿Qué 3 locales explican la mayor parte de la caída? Separa lo que se ve en los datos de lo que es hipótesis.»
5. **Redacción.** «Redacta un correo de 150 palabras para el gerente comercial con los hallazgos, en tono directo, sin adjetivos innecesarios.»
6. **Presentación.** Con Artifacts o Slides, pide una presentación de 4 láminas a partir del correo.

Lo que antes tomaba una tarde puede quedar en una hora, con la verificación incluida. La clave es que **tú defines las preguntas y revisas los números**.

##### Projects: que Claude conozca tu área

Si haces este informe todos los meses, crea un **Project** con los documentos de referencia: el glosario de tu área (qué es «venta neta», cómo se cuenta un local nuevo), el formato del informe y un ejemplo de mes anterior. Así no explicas el contexto cada vez y las respuestas son más consistentes. En el curso, el módulo 3 está dedicado a Projects, Artifacts, Docs y Slides.

##### Errores típicos al usar IA con datos

- **Pedir «analiza esto» sin una pregunta.** Recibes generalidades. Pregunta algo concreto.
- **No dar contexto de negocio.** Sin saber que diciembre es temporada alta, cualquier comparación con noviembre parece un milagro.
- **Aceptar un cálculo sin revisar.** Cuadra siempre al menos un total con tu fuente.
- **Subir más datos de los necesarios.** Si no necesitas el RUT o el nombre del cliente, quítalos antes.

##### Lo que no debes delegar

- **La verificación.** Claude puede equivocarse en cálculos o interpretar mal una columna. Cuadra siempre los totales con tu fuente.
- **Datos sensibles sin autorización.** Antes de subir datos de clientes o remuneraciones, revisa la política de tu empresa y el plan que usan (los planes empresariales tienen condiciones de privacidad distintas a las cuentas personales).
- **La decisión.** La IA propone hipótesis; la decisión es tuya y de tu equipo.

##### Claude y Power BI: cómo se complementan

Claude es excelente para la exploración inicial, la limpieza guiada y la redacción. Power BI es el lugar donde el reporte vive, se actualiza y se comparte. Un flujo práctico: explora y limpia con ayuda de Claude, modela y publica en [nuestro curso de Power BI en vivo](/cursos/power-bi) (o integra SQL, Power BI y Python en el programa de [Análisis de datos](/cursos/analisis-de-datos)), y vuelve a Claude para redactar el resumen del mes.

##### El curso Claude en vivo de ProgramBI

- **En vivo por Zoom**, lunes y miércoles de **19:30 a 21:30**, hora de Chile. Próximo inicio: **lunes 23 de noviembre de 2026**.
- **20 horas, 5 módulos** de 4 horas: primeros pasos y privacidad; prompting práctico; Projects, Artifacts, Docs y Slides; **Claude para Excel y tareas administrativas** (limpieza, fórmulas, tendencias y anomalías, conectores, Claude Cowork); y automatización ligera con proyecto final sobre un proceso real de tu trabajo.
- **Grabaciones de por vida** y **certificado**. Instructor: **Manuel Oliva**, Magíster en Data Science (UAI). Revisa todos los detalles en la [guía del curso de Claude en Chile](/guias/curso-claude-chile) o entra directo a la ficha del [curso de Claude](/cursos/claude).

<!-- CTA-END -->

##### Preguntas frecuentes

**¿Claude puede leer archivos de Excel?** Sí, puedes adjuntar planillas y pedirle análisis, resúmenes o fórmulas. Verifica siempre los resultados.
**¿Necesito saber programar?** No. El curso está pensado para trabajo administrativo y de análisis sin programar.
**¿Claude reemplaza a Power BI?** No. Claude ayuda a explorar y redactar; Power BI publica reportes que se actualizan y se comparten.
**¿Es seguro subir datos de la empresa?** Depende del plan y de la política de tu empresa. En el curso vemos planes y privacidad en el primer módulo.
**¿Qué diferencia a Claude de otras IA?** En el curso lo comparamos en el módulo 1; para análisis, lo importante es aprender a pedir bien y verificar, sea cual sea la herramienta.
**¿A qué hora son las clases?** Lunes y miércoles de 19:30 a 21:30, hora de Chile, con grabaciones.
