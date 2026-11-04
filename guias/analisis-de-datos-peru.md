---
slug: curso-analisis-de-datos-peru
ruta_sugerida: /pe/guias/curso-analisis-de-datos-peru
pais: pe
hreflang: es-PE
curso: analisis-de-datos
url_curso: https://www.programbi.com/pe/cursos/analisis-de-datos
title: "Curso de Análisis de Datos en Perú: guía 2026 | ProgramBI"
meta: "Curso de análisis de datos en Perú en vivo: SQL Server, Power BI y Python en 60 h, lunes y miércoles 17:30 hora de Lima. Cómo ser analista de datos y sueldos."
h1: "Curso de Análisis de Datos en Perú: el camino para ser analista de datos"
updated: 2026-11-04
sources:
  - https://www.programbi.com/pe/cursos/analisis-de-datos
  - https://www.programbi.com/pe/cursos/power-bi
  - https://www.programbi.com/pe/cursos/sql-server
  - https://www.programbi.com/pe/cursos/python
  - https://www.programbi.com/pe/cursos/excel
  - https://pe.computrabajo.com/salarios/analista-de-datos
nota_hermes: |
  ELEMENTO VISUAL: bloque «En 30 segundos» + tabla comparativa de sectores e indicadores (banca, minería, agroexportación, retail, sector público).
  Intención: "curso análisis de datos perú" y "cómo ser analista de datos" → click_registro en /pe/cursos/analisis-de-datos. country=pe, course=analisis-de-datos.
  - PRECIO: {precio_local} = placeholder de config/pricing.ts (WS1), clave analisis-de-datos × pe. Manu aún no define el monto: NO escribas cifras. Sin valor → "Consulta el valor por WhatsApp".
  - Primeros dos párrafos = respuesta citable. Modismo local: "chamba" (con moderación).
  - Computrabajo verificado por Radar el 4 nov 2026; el sitio devuelve 403 a bots: revalida a mano antes de publicar.
  - Schema Article + FAQPage + BreadcrumbList, sin Course/Offer. WhatsApp: "Hola, vengo de la guía de Análisis de datos para Perú en programbi.com y quiero info del curso en vivo".
---

# Curso de Análisis de Datos en Perú: el camino para ser analista de datos

**Respuesta corta:** el [curso de análisis de datos de ProgramBI en Perú](https://www.programbi.com/pe/cursos/analisis-de-datos) es en vivo por Zoom y su nivel básico-intermedio enseña **SQL Server, Power BI y Python en 60 horas** (20 horas por herramienta). Las clases son **lunes y miércoles de 17:30 a 19:30, hora de Perú**, el próximo grupo empieza el **lunes 23 de noviembre de 2026** y el precio es **{precio_local}**. Incluye grabaciones de por vida y certificado.

**¿Cómo ser analista de datos en Perú?** Aprende SQL para extraer información, Power BI para modelarla y presentarla, y Python para limpiar y explorar bases grandes. Luego demuéstralo con un proyecto sobre un problema real —colocaciones de una caja, envíos de una agroexportadora— y ya tienes la base que piden las convocatorias de analista.

**[CTA-TOP]** — Próxima clase en vivo: lunes 23 de noviembre de 2026 · 17:30 hora de Perú · «Ver el curso».

## Dónde está la demanda en Perú

Banca y microfinanzas siguen colocaciones y mora por agencia todos los días. La minería mide producción y costo por tonelada. La agroexportación de arándano, palta y uva vive de los kilos por campaña y destino. Retail y consumo masivo cuidan el sell-out. Y el Estado publica convocatorias para analistas de gestión y de datos. La mayor parte del empleo calificado está en Lima, pero el trabajo híbrido y remoto abre puertas desde Arequipa, Trujillo o Piura.

En todos esos sectores pasa lo mismo: los datos existen, pero alguien los junta a mano. El analista de datos automatiza ese paso y dedica su tiempo a explicar qué está pasando.

## Cuánto gana un analista de datos en Perú (referencia)

- **Computrabajo Perú**: sueldo medio de **S/ 2.224 al mes** para «analista de datos», con 467 salarios de los últimos 12 meses; el rango declarado va de S/ 500 a S/ 5.000 (consultado el 4 de noviembre de 2026). [pe.computrabajo.com/salarios/analista-de-datos](https://pe.computrabajo.com/salarios/analista-de-datos)

La media mezcla puestos de reportería con cargos más técnicos. Los avisos que piden SQL, DAX y modelado suelen estar en la parte alta. Es una referencia que cambia, no una promesa.

## Paso a paso para conseguir tu primera chamba de analista

1. **Ordena tu base en Excel.** Tablas, tablas dinámicas y BUSCARX. Si te falta, empieza con el [curso de Excel](https://www.programbi.com/pe/cursos/excel).
2. **SQL.** Aprende a filtrar, agrupar y unir tablas. Es la habilidad que más se repite en las convocatorias. Profundiza en el [curso de SQL Server](https://www.programbi.com/pe/cursos/sql-server).
3. **Power BI.** Limpieza con Power Query, modelo estrella y medidas DAX. Más en el [curso de Power BI](https://www.programbi.com/pe/cursos/power-bi) y la [guía de Power BI en Perú](/pe/guias/como-aprender-power-bi-en-peru).
4. **Python.** Pandas para consolidar archivos de varias agencias o fundos. Detalle en el [curso de Python](https://www.programbi.com/pe/cursos/python).
5. **Proyecto y presentación.** Un tablero con datos anonimizados y tres conclusiones claras.

Un truco peruano: las convocatorias públicas de Talento Perú suelen detallar qué conocimientos evalúan. Úsalas como checklist de estudio.

**[CTA-MID]** — Descarga gratis la plantilla de dashboard de ventas en soles.

## Ejemplo: una agroexportadora en Ica

- **SQL** suma kilos exportados por destino en la campaña:
  `SELECT destino, SUM(kilos) AS kilos FROM despachos WHERE campania = '2026' GROUP BY destino;`
- **Power BI** calcula la participación de cada mercado:
  `% Destino = DIVIDE([Kilos], CALCULATE([Kilos], ALL(Despachos[destino])))`
- **Python** une los reportes de cada fundo, que llegan en archivos separados:
  `df = pd.concat([pd.read_excel(f) for f in fundos])`

Con eso, gerencia comercial ve en un tablero hacia dónde se movió la campaña y qué calibre se vende mejor en cada mercado.

## Portales para buscar empleo

- **Computrabajo Perú** y **Bumeran Perú**: el mayor volumen de avisos.
- **LinkedIn Empleos**: banca, consultoras y multinacionales.
- **Talento Perú** (talentoperu.servir.gob.pe): convocatorias del Estado para analistas.

Tip: además de «analista de datos», busca «analista de inteligencia comercial», «analista de riesgos» y «analista de control de gestión».

## ¿Cuánto tiempo toma?

Con unas cinco horas semanales, la mayoría puede manejar SQL básico en un mes y armar un primer tablero útil en Power BI al segundo. Python suma algunas semanas más. Lo que más acelera el proceso no es estudiar más horas, sino practicar con datos de tu propio trabajo desde el primer día: cada consulta que resuelves sobre tu agencia, tu fundo o tu tienda se queda contigo mucho más que un ejercicio genérico.

## Errores comunes

- **Quedarse solo en Excel.** Sin SQL vas a depender siempre de otra área.
- **Copiar tableros de internet.** El reclutador quiere ver tu criterio sobre un problema real.
- **Ignorar la calidad de datos.** Códigos de agencia mal escritos o fechas mezcladas arruinan cualquier conclusión.
- **No practicar la explicación.** Contar el hallazgo en dos minutos es parte del trabajo.

## Sectores que más demandan analistas en Perú

- **Banca y microfinanzas**: colocaciones, mora por agencia y metas de asesores de negocio.
- **Minería**: producción, leyes de mineral y costo por tonelada.
- **Agroexportación**: kilos por campaña, destino y calibre.
- **Retail y consumo masivo**: sell-out, cobertura y trade marketing.
- **Sector público**: ejecución presupuestal e indicadores de gestión.

Si ya trabajas en alguno, tienes una ventaja: conoces el negocio y sus indicadores. Lo que falta es la herramienta para dejar de armar el reporte a mano y pasar a explicarlo. En microfinanzas, por ejemplo, el salto típico es pasar de «el Excel de mora del viernes» a un tablero diario por agencia que el jefe zonal revisa desde el celular.

## Cómo elegir un buen curso de análisis de datos en Perú

Antes de matricularte en cualquier programa, compara estos puntos:

- **Las tres herramientas en un solo programa.** Si el curso no incluye SQL, tendrás que llevar otro después.
- **Clases en vivo, en hora peruana.** De 17:30 a 19:30 hora de Perú puedes conectarte saliendo de la oficina. Si vives fuera de Lima, el formato por Zoom te evita el traslado.
- **Proyecto final con datos reales.** Es lo que vas a presentar en una entrevista o en una evaluación técnica.
- **Grabaciones disponibles.** Entre el tráfico y los cierres, vas a perder alguna clase.
- **Docente con experiencia en empresas.** Los casos aplicados enseñan más que los ejemplos de libro.

## Cómo preparar una evaluación técnica

Muchas empresas peruanas y convocatorias públicas incluyen una prueba práctica. Suele parecerse a esto:

1. **Una base en Excel o CSV** con errores intencionales: fechas mezcladas, códigos duplicados, montos como texto.
2. **Preguntas concretas**: «¿qué agencia tuvo más mora en el trimestre?», «¿cuál es el producto con mayor margen?».
3. **Un entregable**: un tablero o un resumen con las respuestas.

Practica con un caso así antes de postular: limpia, modela, responde y explica en dos minutos. Si lo haces bien, la entrevista se vuelve una conversación sobre tu proyecto.

## El curso en vivo de ProgramBI (Perú)

Según la [ficha del curso para Perú](https://www.programbi.com/pe/cursos/analisis-de-datos), revisada el 4 de noviembre de 2026:

- **En vivo por Zoom**, lunes y miércoles de **17:30 a 19:30**, hora de Perú.
- **60 horas** en el básico-intermedio: Power BI, SQL Server y Python, 20 horas cada uno.
- Contenido: SQL desde cero, modelado y DAX, análisis exploratorio con Pandas, dashboards y reportes automáticos, ETL con Power Query y conexión a bases de datos, proyecto final con datos reales, con IA de apoyo en cada módulo.
- **Nivel avanzado** de 60 horas adicionales: automatización, inteligencia de tiempo y modelos.
- **Grabaciones de por vida** y **certificado** al terminar.
- Inicio: **lunes 23 de noviembre de 2026**. Precio: **{precio_local}**.
- Instructor: **Manuel Oliva**, Magíster en Data Science (UAI).

**Formas de pago:** los cursos de ProgramBI se pueden pagar en 3 cuotas sin interés, en todos los países.

**[CTA-END]** — {precio_local} · lunes y miércoles 17:30–19:30 hora de Perú · «Inscribirme» · «Hablar por WhatsApp».

## Preguntas frecuentes

**¿Cuánto cuesta el curso de análisis de datos en Perú?**
El nivel básico-intermedio de 60 horas cuesta {precio_local}, con grabaciones de por vida y certificado.

**¿Cuál es el horario en Perú?**
Lunes y miércoles de 17:30 a 19:30, hora de Perú, en vivo por Zoom.

**¿Puedo llevarlo sin saber programar?**
Sí. SQL y Python se enseñan desde cero; basta con Excel a nivel usuario.

**¿Qué diferencia hay con el curso de Power BI?**
Power BI se centra en tableros y DAX. Análisis de datos agrega SQL Server y Python para cubrir todo el ciclo: extraer, modelar y analizar.

**¿Quedan grabadas las clases?**
Sí, todas, con acceso de por vida en el campus.

**¿Entregan certificado?**
Sí, un certificado digital de ProgramBI al completar el curso.

**¿Puedo llevarlo si vivo fuera de Lima?**
Sí. Las clases son en vivo por Zoom y quedan grabadas, así que puedes seguirlas desde cualquier ciudad del país.
