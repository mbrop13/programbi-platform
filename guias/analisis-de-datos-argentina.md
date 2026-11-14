---
slug: curso-analisis-de-datos-argentina
ruta_sugerida: /ar/guias/curso-analisis-de-datos-argentina
pais: ar
hreflang: es-AR
curso: analisis-de-datos
url_curso: https://www.programbi.com/ar/cursos/analisis-de-datos
title: "Curso de Análisis de Datos Argentina: guía 2026 | ProgramBI"
meta: "Curso de análisis de datos en Argentina en vivo: SQL Server, Power BI y Python en 60 h (lunes y miércoles 19:30). Sueldos Sysarmy y ruta."
h1: "Curso de Análisis de Datos en Argentina: cómo ser analista de datos"
updated: 2026-11-14
sources:
  - https://www.programbi.com/ar/cursos/analisis-de-datos
  - https://www.programbi.com/ar/cursos/power-bi
  - https://www.programbi.com/ar/cursos/sql-server
  - https://www.programbi.com/ar/cursos/python
  - https://www.programbi.com/ar/cursos/excel
  - https://institutoiea.edu.ar/publicaciones/que-hace-un-analista-de-datos-y-cuanto-gana
  - https://sysarmy.com/
nota_hermes: |
  ELEMENTO VISUAL: diagrama de la ruta en cinco pasos + bloque «En 30 segundos».
  Intención: "curso análisis de datos argentina" y "cómo ser analista de datos" → click_registro en /ar/cursos/analisis-de-datos. country=ar, course=analisis-de-datos.
  - PRECIO: {precio_local} = placeholder de config/pricing.ts (WS1), clave analisis-de-datos × ar. Monto aún sin definir por Manu: NO escribas cifras. Sin valor → "Consultá el valor por WhatsApp".
  - Voseo en todo el texto (es-AR). Primeros dos párrafos = respuesta citable.
  - Sueldos Sysarmy 2026.1 vía Instituto IEA (URL respondió 200 el 4 nov 2026). Por inflación, revisar vigencia al publicar.
  - Schema Article + FAQPage + BreadcrumbList, sin Course/Offer. WhatsApp: "Hola, vengo de la guía de Análisis de datos para Argentina en programbi.com y quiero info del curso en vivo".
---

# Curso de Análisis de Datos en Argentina: cómo ser analista de datos

**Respuesta corta:** el [curso de análisis de datos de ProgramBI para Argentina](https://www.programbi.com/ar/cursos/analisis-de-datos) es en vivo por Zoom y en su nivel básico-intermedio cubre **SQL Server, Power BI y Python en 60 horas** (20 por herramienta). Se cursa **lunes y miércoles de 19:30 a 21:30, hora de Argentina**, abre nuevas cohortes todos los meses (próxima fecha en la ficha) y cuesta **{precio_local}**. Tenés grabaciones de por vida y certificado.

**¿Cómo ser analista de datos en Argentina?** Aprendé a consultar bases con SQL, a modelar y mostrar resultados en Power BI y a usar Python para limpiar y explorar lo que Excel no banca. Sumale un proyecto propio y, si apuntás a laburos remotos para afuera, inglés. Con eso cubrís lo que se repite en la mayoría de los avisos.

**[CTA-TOP]** — Inicios mensuales en vivo · lunes y miércoles 19:30 (Argentina) · «Ver el curso».

## Por qué el análisis de datos rinde tanto en Argentina

Con precios que se mueven rápido, un reporte de márgenes armado a fin de mes ya llega viejo. Finanzas necesita ver costos actualizados; comercial, si la lista de precios quedó atrás; el agro, cómo viene la campaña lote por lote. Al mismo tiempo, el ecosistema de software, fintech y servicios exportados contrata analistas que trabajan para equipos de otros países. En los dos mundos se valora lo mismo: alguien que saca los datos solo, los ordena y te dice qué está pasando.

## Cuánto gana un analista de datos en Argentina (referencia)

La referencia más sólida para tecnología es la **Encuesta de Sueldos de Sysarmy**, que publica datos abiertos cada semestre. En la edición **2026.1** (marzo de 2026), la mediana del sueldo **bruto mensual** de analistas de datos o BI fue:

- **Junior: $1.785.000**
- **Semi-senior: $2.557.772**
- **Senior: $3.382.000**

Cálculo del Instituto IEA sobre esos datos: [institutoiea.edu.ar](https://institutoiea.edu.ar/publicaciones/que-hace-un-analista-de-datos-y-cuanto-gana). Datos originales: [sysarmy.com](https://sysarmy.com/).

Dos advertencias: la encuesta la responde sobre todo gente del sector tecnológico, y con inflación una cifra de marzo envejece rápido. Tomala como orden de magnitud.

## La ruta: de planilla a analista en cinco pasos

1. **Elegí un problema que conozcas.** Si laburás en compras, arrancá por «¿qué proveedor me sube más los precios?».
2. **SQL.** Consultas, agrupaciones y `JOIN`. Es lo que te saca de depender del archivo que te mandan. Para profundizar: [curso de SQL Server](https://www.programbi.com/ar/cursos/sql-server).
3. **Power BI.** Power Query, modelo estrella y DAX; las medidas de variación mensual son clave en un contexto inflacionario. Mirá el [curso de Power BI](https://www.programbi.com/ar/cursos/power-bi) y la [guía de Power BI en Argentina](/ar/guias/como-aprender-power-bi-en-argentina).
4. **Python.** Pandas para unir listas de precios de distintos proveedores o limpiar exportaciones de sistemas viejos. Más en el [curso de Python](https://www.programbi.com/ar/cursos/python).
5. **Portafolio.** Un proyecto documentado (mejor en inglés si apuntás afuera) con la pregunta, los datos y la conclusión.

¿Todavía te cuesta Excel? El [curso de Excel](https://www.programbi.com/ar/cursos/excel) es el escalón previo.

**[CTA-MID]** — Descargá gratis la plantilla de dashboard de ventas en pesos argentinos.

## Ejemplo: precios y márgenes en una distribuidora de Rosario

- **SQL** trae el costo promedio por producto en el último mes:
  `SELECT producto, AVG(costo_ars) AS costo FROM compras WHERE fecha >= '2026-10-01' GROUP BY producto;`
- **Power BI** mide cuánto subió el costo contra el mes anterior:
  `Var. costo % = DIVIDE([Costo] - [Costo mes ant.], [Costo mes ant.])`
- **Python** junta las listas de precios que llegan en Excel con formatos distintos:
  `lista = pd.concat([pd.read_excel(f) for f in archivos], ignore_index=True)`

Con eso, comercial ve qué productos quedaron con margen negativo antes de seguir vendiéndolos.

## Dónde buscar laburo de analista de datos

- **Bumeran** y **ZonaJobs**: los portales con más avisos locales.
- **LinkedIn Empleos**: empresas grandes y posiciones remotas para el exterior.
- **Computrabajo Argentina**: pymes y avisos del interior.
- **GetOnBoard**: avisos tech con rango salarial visible.

Tip: buscá también «analista de pricing», «analista de planeamiento» o «analista de costos»; muchos piden SQL y Power BI sin que figure en el título.

## Errores típicos al arrancar

- **Comparar montos nominales entre meses.** Con inflación, sin una medida de variación o un índice, la conclusión engaña.
- **Saltar directo a Python.** Sin SQL y sin modelo, terminás con scripts que nadie mantiene.
- **Juntar cursos sin terminar ninguno.** Un proyecto cerrado vale más que diez a medias.
- **Tableros sin pregunta.** Si no sabés qué decisión habilita, sobra.

## Dónde se usa más el análisis de datos en Argentina

- **Fintech y banca**: originación, mora, uso de billeteras y retención de clientes.
- **Retail y consumo masivo**: precios, márgenes y rotación cuando los costos cambian mes a mes.
- **Agro y agroindustria**: rindes por lote y campaña, logística de cosecha y precios de granos.
- **Software y servicios**: horas facturadas, rentabilidad por cliente y proyecto.
- **Energía**: producción y costos en la cadena de proveedores de Vaca Muerta.

En cada uno, la pregunta de fondo es parecida: ¿dónde estoy perdiendo plata y por qué? Un analista que sabe cruzar ventas, costos y precios con SQL y mostrarlo en un tablero claro responde eso antes que nadie. Si venís de alguno de estos sectores, ya tenés ventaja: conocés el negocio, solo te falta la herramienta.

## Cómo elegir un curso de análisis de datos en Argentina

La oferta es enorme: universidades, bootcamps, plataformas grabadas. Antes de decidir, fijate:

- **Que tenga las tres herramientas.** SQL, Power BI y Python juntos te evitan tener que hacer tres cursos distintos.
- **Que sea en vivo y en tu horario.** De 19:30 a 21:30 hora de Argentina podés cursar a la salida del laburo. Desconfiá de horarios pensados para otra zona.
- **Que termine en un proyecto.** Es lo único que vas a poder mostrar en una entrevista.
- **Que puedas volver a ver las clases.** Entre el laburo y la facultad, alguna clase te la vas a perder.
- **Que el docente haya trabajado con datos de empresas.** Los ejemplos reales enseñan más que los de manual.

## Qué mostrar si apuntás a laburos para el exterior

Muchos analistas argentinos trabajan para empresas de otros países. En esos procesos suelen pedir:

1. **Un portafolio en inglés**: títulos, columnas y conclusiones.
2. **SQL demostrable**: una consulta con `JOIN` y agregaciones explicada paso a paso.
3. **Un tablero publicado** que se entienda sin que vos estés al lado.
4. **Una historia**: qué problema resolviste y qué cambió gracias a eso.

Si apuntás al mercado local, sumá un caso con ajuste por inflación: muestra que entendés el contexto en el que se toman las decisiones acá.

## El curso en vivo de ProgramBI (Argentina)

Datos de la [ficha del curso para Argentina](https://www.programbi.com/ar/cursos/analisis-de-datos), revisada el 4 de noviembre de 2026:

- **En vivo por Zoom**, lunes y miércoles de **19:30 a 21:30**, hora de Argentina, a la salida del laburo.
- **60 horas** en el básico-intermedio: Power BI (tableros y DAX inicial), SQL Server (consultas y agregaciones) y Python (Pandas y visualización).
- Temas: SQL desde cero, modelado y DAX, análisis exploratorio, dashboards y reportes automáticos, ETL con Power Query, proyecto final con datos reales, IA de apoyo en cada módulo.
- **Nivel avanzado** con 60 horas más: automatización, inteligencia de tiempo y modelos.
- **Grabaciones de por vida** y **certificado** al completar.
- Inicio: **inicios todos los meses** (consultá la próxima fecha en la ficha). Valor: **{precio_local}**.
- Instructor: **Manuel Oliva**, Magíster en Data Science (UAI).

**Formas de pago:** los cursos de ProgramBI se pueden pagar en 3 cuotas sin interés, en todos los países.

**[CTA-END]** — {precio_local} · lunes y miércoles 19:30–21:30 hora de Argentina · «Inscribirme» · «Hablar por WhatsApp».

## Preguntas frecuentes

**¿Cuánto sale el curso de análisis de datos en Argentina?**
El nivel básico-intermedio de 60 horas cuesta {precio_local} e incluye grabaciones de por vida y certificado.

**¿Qué días y a qué hora se cursa?**
Lunes y miércoles de 19:30 a 21:30, hora de Argentina, en vivo por Zoom.

**¿Necesito saber programar?**
No. SQL y Python arrancan desde cero; alcanza con manejar Excel básico.

**¿Me conviene el de Power BI o el de análisis de datos?**
Si solo querés tableros, Power BI. Si buscás el puesto de analista completo, el de análisis de datos suma SQL Server y Python.

**¿Qué pasa si me pierdo una clase?**
Queda grabada en el campus y la podés ver cuando quieras, de por vida.

**¿Hay certificado?**
Sí, certificado digital de ProgramBI al completar el curso.

**¿Me sirve para trabajar remoto para afuera?**
Las herramientas son las mismas que piden esas búsquedas. Además vas a necesitar inglés y un portafolio que puedas presentar solo.

**¿Recibo un certificado al terminar?**
Sí. Al terminar el curso recibes un certificado de ProgramBI. Puedes sumarlo a tu CV junto con el proyecto final del curso.

**¿Puedo pagar en cuotas?**
Sí. El curso se puede pagar en 3 cuotas sin interés. Escribe por WhatsApp para confirmar el valor vigente, las fechas de inicio y los medios de pago disponibles en tu país.
