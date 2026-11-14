---
slug: curso-analisis-de-datos-chile
ruta_sugerida: /guias/curso-analisis-de-datos-chile
pais: cl
hreflang: es-CL
curso: analisis-de-datos
url_curso: https://www.programbi.com/cursos/analisis-de-datos
title: "Curso de Análisis de datos en Chile: guía 2026 | ProgramBI"
meta: "Curso de análisis de datos en Chile en vivo: SQL Server, Power BI y Python en 60 h. Cómo ser analista de datos, sueldos y ruta paso a paso."
h1: "Curso de Análisis de datos en Chile: cómo ser analista de datos en 2026"
updated: 2026-11-04
sources:
  - https://www.programbi.com/cursos/analisis-de-datos
  - https://www.programbi.com/cursos/power-bi
  - https://www.programbi.com/cursos/sql-server
  - https://www.programbi.com/cursos/python
  - https://www.programbi.com/cursos/excel
  - https://www.chiletrabajos.cl/sueldos/analista/datos
  - https://www.chiletrabajos.cl/sueldos/analista/bi
nota_hermes: |
  ELEMENTO VISUAL: diagrama de la ruta de aprendizaje (Excel → SQL → Power BI → Python → proyecto) + bloque «En 30 segundos» con la respuesta corta.
  Intención: captar "curso análisis de datos chile" (transaccional) y "cómo ser analista de datos" (informacional) y llevar a click_registro en /cursos/analisis-de-datos; secundario click_whatsapp y generate_lead.
  - Los dos primeros párrafos son la respuesta citable para GEO (qué es, duración, horario, precio). No los muevas bajo un CTA.
  - PRECIO: 338.000 CLP confirmado por Manu (4 nov 2026) para Análisis de datos en Chile; los cursos sueltos básico-intermedio valen 169.000 CLP. Igual lee {precio_local} desde config/pricing.ts para que guía, ficha, Offer y checkout no se desalineen. Ignora el 498.000 del JSON-LD actual (debe corregirlo WS1).
  - Sin Course/Offer en la guía; schema Article + FAQPage (las 6 FAQ, texto idéntico) + BreadcrumbList. CTAs según §2.5 de GUIAS_POWER_BI_PAISES.md, con course=analisis-de-datos.
  - Enlaces internos: ficha análisis de datos, /cursos/power-bi, /cursos/sql-server, /cursos/python, /cursos/excel, /guias/como-aprender-power-bi-en-chile, /guias.
  - WhatsApp: "Hola, vengo de la guía de Análisis de datos para Chile en programbi.com y quiero info del curso en vivo".
  - No uses clúster hreflang con las guías Power BI; si se escriben guías de análisis de datos en otros países, se escriben desde cero (regla anti-duplicado).
---

# Curso de Análisis de datos en Chile: cómo ser analista de datos en 2026

**Respuesta corta:** el [curso de análisis de datos de ProgramBI](https://www.programbi.com/cursos/analisis-de-datos) es un programa en vivo por Zoom, pensado para Chile, que en su nivel básico-intermedio enseña **SQL Server, Power BI y Python en 60 horas** (20 horas por herramienta). Las clases son los **lunes y miércoles de 19:30 a 21:30, hora de Chile**, el próximo inicio es el **lunes 23 de noviembre de 2026** y el valor es de **$338.000 CLP**. Incluye grabaciones de por vida en el campus y certificado al completar.

**¿Cómo ser analista de datos en Chile?** Necesitas tres cosas: sacar datos de una base (SQL), convertirlos en un modelo y un tablero que la gerencia entienda (Power BI) y limpiar o analizar lo que Excel no aguanta (Python). Con eso más un proyecto propio que puedas mostrar, ya tienes lo que piden la mayoría de los avisos de analista. El resto de esta guía te explica el camino, cuánto se gana y cómo elegir curso.

**[CTA-TOP]** — Próxima clase en vivo: lunes 23 de noviembre de 2026 · 19:30 hora de Chile · «Ver el curso».

## Qué hace un analista de datos (y qué no)

En muchas empresas chilenas el análisis todavía es «el Excel del lunes»: alguien baja un reporte del ERP, lo pega, arregla las fórmulas rotas y manda el informe a mitad de semana. Un analista de datos hace que eso deje de depender de una persona. Concretamente:

- **Extrae** los datos directo de la base, sin pedirle cada archivo a TI.
- **Modela**: separa ventas, productos, sucursales y fechas para que los números cuadren.
- **Comunica**: arma un dashboard que responde una pregunta de negocio, no un collage de gráficos.
- **Automatiza**: deja la actualización programada para que el informe esté listo el lunes a primera hora.

Lo que no es: un científico de datos que entrena modelos de machine learning desde el primer día. Ese es un paso posterior; partir por ahí sin dominar SQL y el modelamiento suele terminar en frustración.

## Cuánto gana un analista de datos en Chile (referencia)

Tómalo como referencia y no como promesa: las cifras cambian mes a mes y según empresa, región y experiencia.

- **Chiletrabajos** informa un sueldo **pretendido** promedio de **$979.205 al mes** para «analista datos» (consultado en noviembre de 2026). Ojo: es lo que piden los postulantes, no lo que pagan las empresas. [chiletrabajos.cl/sueldos/analista/datos](https://www.chiletrabajos.cl/sueldos/analista/datos)
- Para el cargo más cercano de **analista BI**, la misma fuente marca un promedio pretendido de **$1.147.226 al mes**. [chiletrabajos.cl/sueldos/analista/bi](https://www.chiletrabajos.cl/sueldos/analista/bi)

La diferencia entre ambos cargos suele estar en el dominio de herramientas como Power BI y SQL, que es justamente lo que conviene sumar al perfil.

## La ruta para ser analista de datos, paso a paso

1. **Excel bien usado (punto de partida).** Tablas, tablas dinámicas y BUSCARX. Si aún no te sientes cómodo, el [curso de Excel](https://www.programbi.com/cursos/excel) es la base.
2. **SQL.** `SELECT`, `WHERE`, `GROUP BY` y `JOIN`. Es la habilidad que más te independiza: dejas de esperar el archivo y lo sacas tú. Profundiza con el [curso de SQL Server](https://www.programbi.com/cursos/sql-server).
3. **Power BI.** Power Query para limpiar, modelo estrella, medidas DAX como `CALCULATE` y un tablero publicable. Si quieres ir solo por esta parte, está el [curso de Power BI](https://www.programbi.com/cursos/power-bi) y nuestra [guía para aprender Power BI en Chile](/guias/como-aprender-power-bi-en-chile).
4. **Python con Pandas.** Para limpiar archivos grandes o desordenados, cruzar fuentes y hacer análisis exploratorio. Detalle en el [curso de Python para datos](https://www.programbi.com/cursos/python).
5. **Un proyecto propio.** Datos reales (anonimizados), una pregunta de negocio clara y un dashboard final. Es lo que vas a mostrar en la entrevista.

Hacer los pasos 2 a 4 por separado funciona, pero cuesta mantener el hilo. Por eso el programa de análisis de datos los junta en un solo nivel de 60 horas.

**[CTA-MID]** — Descarga gratis la plantilla de dashboard de ventas en pesos chilenos.

## Un ejemplo bien chileno del flujo completo

Piensa en una cadena con sucursales en Santiago, Concepción y Antofagasta que vende en CLP.

- **SQL**: sacas las ventas del mes por sucursal:
  `SELECT sucursal, SUM(monto_clp) AS ventas FROM ventas WHERE fecha >= '2026-10-01' GROUP BY sucursal;`
- **Power BI**: con esas tablas armas el modelo y una medida de margen segura frente a sucursales sin ventas:
  `Margen % = DIVIDE([Ventas] - [Costo], [Ventas])`
- **Python**: si el reporte del proveedor llega con montos como texto («$1.234.567»), lo limpias antes de cargarlo:
  `df["monto"] = df["monto"].str.replace(r"[$.]", "", regex=True).astype(int)`

Ese ciclo —extraer, modelar, comunicar— es el trabajo diario del cargo, y es el que se practica en el curso con datos reales.

## Dónde buscar pega como analista de datos en Chile

- **LinkedIn Empleos**: busca «analista de datos» junto a «SQL» o «Power BI» y filtra por Región Metropolitana o remoto.
- **Chiletrabajos** y **Laborum**: avisos de pymes y medianas empresas, muchas veces con sueldo visible.
- **GetOnBoard**: avisos del mundo tech con rangos salariales.
- **Empleos Públicos** (empleospublicos.cl): servicios y municipios también contratan analistas de gestión y datos.

Un truco: lee diez avisos y anota qué herramientas se repiten. Casi siempre aparecen SQL, Power BI y Excel; Python va ganando espacio. Esa lista es tu temario.

## Errores comunes al empezar

- **Saltarse SQL.** Sin SQL vas a depender siempre de que alguien te exporte el archivo.
- **Coleccionar certificados sin proyecto.** En la entrevista pesa más un tablero que puedas explicar que cinco diplomas.
- **Aprender Python antes de saber qué preguntar.** Primero la pregunta de negocio, después la herramienta.
- **Dashboards con veinte gráficos.** Una página por pregunta: KPI arriba, detalle abajo.
- **Montos como texto.** Corrígelo en la limpieza (Power Query o Pandas), no en la fórmula final.

## El curso de Análisis de datos en vivo de ProgramBI

Datos tomados de la [ficha del curso](https://www.programbi.com/cursos/analisis-de-datos) (revisada el 4 de noviembre de 2026):

- **Modalidad:** en vivo por Zoom, lunes y miércoles de **19:30 a 21:30**, hora de Chile, después de la pega.
- **Duración:** nivel básico-intermedio de **60 horas**, en **3 módulos de 20 horas**: Power BI (tableros y DAX inicial), SQL Server (consultas y agregaciones) y Python (Pandas y visualización).
- **Qué aprendes:** consultas SQL desde cero, modelado de datos y DAX, análisis exploratorio con Python y Pandas, dashboards y reportes automáticos, ETL con Power Query y conexiones a bases de datos, y un proyecto final con datos reales. Se usa IA en cada módulo como apoyo para generar código.
- **Nivel avanzado:** otras 60 horas con automatización, inteligencia de tiempo y modelos. El programa completo suma 120 horas.
- **Para quién:** perfiles administrativos, financieros, comerciales, ingenieros y analistas, sobre todo de finanzas, control de gestión y operaciones que hoy viven en Excel.
- **Incluye:** grabaciones de por vida en el campus y certificado digital al completar.
- **Próximo inicio:** lunes 23 de noviembre de 2026.
- **Valor:** $338.000 CLP. Puedes pagar en 3 cuotas sin interés.
- **Instructor:** Manuel Oliva, Magíster en Data Science (UAI), con capacitaciones en Anglo American, CAP, Deloitte y SQM y más de 5.000 profesionales formados en SQL, Power BI, Python e IA.
- **Empresas:** hay cotización para equipos en `/cursos/analisis-de-datos/empresas`.

¿Solo necesitas tableros? El [curso de Power BI](https://www.programbi.com/cursos/power-bi) (20 horas por nivel) es más corto. ¿Quieres el oficio completo de analista? Este es el programa.

**[CTA-END]** — Precio: {precio_local} · lunes y miércoles 19:30–21:30 (hora de Chile) · «Inscribirme» · «Hablar por WhatsApp».

## Preguntas frecuentes

**¿Cuánto cuesta el curso de análisis de datos en Chile?**
El nivel básico-intermedio de ProgramBI cuesta $338.000 CLP e incluye 60 horas en vivo (SQL Server, Power BI y Python), grabaciones de por vida y certificado.

**¿Cuánto dura y cuál es el horario?**
60 horas por nivel, en clases en vivo por Zoom los lunes y miércoles de 19:30 a 21:30, hora de Chile. El próximo inicio es el lunes 23 de noviembre de 2026.

**¿Necesito experiencia previa para ser analista de datos?**
No en programación. El nivel básico-intermedio parte desde cero en SQL y Python. Ayuda manejar Excel a nivel de tablas y tablas dinámicas.

**¿Qué diferencia hay entre este curso y el de Power BI?**
El curso de Power BI se enfoca solo en tableros y DAX (20 horas por nivel). El de análisis de datos suma SQL Server y Python para cubrir el ciclo completo: extraer, modelar y analizar.

**¿Qué pasa si no puedo asistir a una clase?**
Todas las clases quedan grabadas y tienes acceso de por vida en el campus, así que puedes ponerte al día cuando quieras.

**¿Entregan certificado?**
Sí. Al completar el curso recibes un certificado digital de ProgramBI.
