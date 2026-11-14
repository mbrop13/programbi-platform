---
slug: curso-excel-peru
ruta_sugerida: /pe/guias/curso-excel-peru
pais: pe
hreflang: es-PE
curso: excel
url_curso: https://www.programbi.com/pe/cursos/excel
title: "Curso de Excel en Perú en vivo: guía 2026 | ProgramBI"
meta: "Curso de Excel online en vivo en Perú: 20 h en 12 módulos, de fórmulas a tablas dinámicas y Power Query a las 17:30 h con casos locales."
h1: "Curso de Excel en Perú: Excel online, en vivo y para tu chamba"
updated: 2026-11-04
sources:
  - https://www.programbi.com/pe/cursos/excel
  - https://www.programbi.com/pe/cursos/power-bi
  - https://www.programbi.com/pe/cursos/sql-server
  - https://www.programbi.com/pe/cursos/analisis-de-datos
  - https://www.gob.pe/institucion/sunat/pages/7910-impuesto-general-a-las-ventas-igv
nota_hermes: |
  ELEMENTO VISUAL: diagrama de la ruta Excel básico → intermedio → Power BI + bloque «En 30 segundos».
  Intención: "curso Excel online en vivo Perú", "curso Excel Perú", "aprender Excel desde cero" → click_registro en /pe/cursos/excel. country=pe, course=excel.
  - PRECIO: {precio_local} = placeholder de config/pricing.ts (WS1), clave excel × pe. Manu aún no define el monto: NO escribas cifras (la ficha muestra hoy montos y una nota de cobro en CLP; no copiarlos). Sin valor → "Consulta el valor por WhatsApp".
  - FECHA: la ficha de Excel muestra «Cupos abiertos — consulta fecha» y días «Por confirmar» en el nivel básico-intermedio (el horario 17:30 a 19:30, hora de Perú sale de sus preguntas frecuentes). La guía NO da fecha de inicio; cuando la ficha la confirme, agrégala en la respuesta corta y en CTA-TOP.
  - Tasas de IVA/IGV: cada una enlaza una página oficial que la dice explícitamente (verificado 4 nov 2026). México: sin cifra (no se pudo abrir una página oficial); el ejemplo usa una celda TasaIVA.
  - Primeros dos párrafos = respuesta citable (GEO). Schema Article + FAQPage + BreadcrumbList, sin Course/Offer. CTAs §2.5 con course=excel.
  - WhatsApp: "Hola, vengo de la guía de Excel para Perú en programbi.com y quiero info del curso en vivo".
  - Sin cifras de sueldo: no hay fuente específica para perfiles de Excel.
---

# Curso de Excel en Perú: Excel online, en vivo y para tu chamba

**Respuesta corta:** el [curso de Excel de ProgramBI para Perú](https://www.programbi.com/pe/cursos/excel) es **online y en vivo por Zoom**: **20 horas en 12 módulos**, nivel básico-intermedio, en horario de **17:30 a 19:30, hora de Perú**. El valor es **{precio_local}** e incluye grabaciones de por vida y certificado. La próxima cohorte tiene cupos abiertos; la fecha de inicio se confirma en la ficha del curso.

**¿Qué aprendes?** Desde las bases hasta lo que evalúan empresas y convocatorias en Perú: BUSCARX, tablas dinámicas por agencia o producto, funciones de fecha y texto, y Power Query para consolidar los archivos de todas tus sedes. En tu chamba, el consolidado del lunes deja de tomarte la mañana.

**[CTA-TOP]** — Cupos abiertos · 17:30 a 19:30, hora de Perú · «Ver el curso».

## Por qué vale la pena dominar Excel en Perú

En Perú, Excel es la herramienta diaria de las áreas que mueven la operación: créditos y cobranzas en cajas y financieras, logística en retail y consumo masivo, costos en minería, planeamiento en agroexportación y presupuesto en el sector público. En casi todas, el informe semanal depende de alguien que junta archivos, cruza datos y arma la tabla dinámica a mano.

Por eso «Excel intermedio» o «avanzado» es requisito en buena parte de los avisos administrativos y en muchas convocatorias públicas. Dominarlo te hace más rápido y, sobre todo, reduce errores que en finanzas cuestan caro.

## Lo que más se pide en Perú

En financieras, cajas, retail y sector público, la prueba de Excel suele pedir una tabla dinámica, un cruce con BUSCARV o BUSCARX y una fórmula condicional. Si además consolidas archivos de varias agencias con Power Query y validas que no falte ninguno, te diferencias de inmediato: es justo la tarea que más tiempo consume en muchas oficinas.

## Fórmulas clave, con ejemplos de Perú

- **Colocaciones de una agencia**: `=SUMAR.SI.CONJUNTO(Créditos[Monto];Créditos[Agencia];"Arequipa")`
- **Traer el nombre del cliente por DNI**: `=BUSCARX([@DNI];Clientes[DNI];Clientes[Nombre];"No registrado")`
- **Clasificar créditos por días de atraso**: `=SI([@Atraso]<=8;"Normal";SI([@Atraso]<=30;"CPP";"Deficiente o peor"))`
- **Calcular el IGV de un valor de venta** (tasa total del 18 % en 2026, IGV más Impuesto de Promoción Municipal, según la [página de la SUNAT en gob.pe](https://www.gob.pe/institucion/sunat/pages/7910-impuesto-general-a-las-ventas-igv)): `=[@Valor]*18%`
- **Kilos exportados por destino**: `=SUMAR.SI.CONJUNTO(Despachos[Kilos];Despachos[Destino];[@Destino])`

**Un detalle local: el DNI y el RUC.** Si guardas el DNI como número, Excel le quita el cero inicial y deja de cruzar con otras tablas. Guárdalo como texto o recupéralo con `=TEXTO(A2;"00000000")`. Con el RUC (11 dígitos) pasa algo parecido: mantenlo como texto para evitar redondeos o notación científica.

## Validación de datos para que nadie rompa tu planilla

Cuando varias agencias o personas llenan la misma plantilla, los errores de digitación arruinan el consolidado. La validación de datos los evita desde el origen:

- **Listas desplegables** para agencia, producto o tipo de crédito, así nadie escribe «Arequipa» de tres formas distintas.
- **Restricción de longitud** en el DNI (8 caracteres) y en el RUC (11 caracteres).
- **Rangos de fecha válidos**, para que no aparezcan operaciones con fechas imposibles.
- **Mensajes de entrada** que explican qué escribir en cada columna.

Combinada con una plantilla protegida (solo se editan las celdas de datos), la validación hace que el consolidado con Power Query funcione a la primera. Es una inversión de una hora que te ahorra correcciones todas las semanas, y una buena práctica que cualquier jefe agradece cuando el cierre llega sin sorpresas.

**[CTA-MID]** — Descarga gratis la plantilla de dashboard de ventas en soles.

## Caso: el reporte que se arma solo con Power Query

Un analista de una financiera en Lima consolida cada lunes los reportes de cobranza de veinte agencias. Antes abría cada archivo, copiaba, pegaba y corregía DNI sin ceros: toda la mañana. Con Power Query, la consulta combina la carpeta de reportes, convierte el DNI a texto de ocho dígitos, quita filas de totales y carga una tabla única. La tabla dinámica de cobranza por agencia se actualiza con un clic. Además, una lista de agencias esperadas le muestra cuál no envió su archivo antes de presentar el informe.

## Tablas dinámicas para créditos, cobranzas y campañas

En una financiera, la tabla dinámica arma el reporte de colocaciones por agencia y producto; en una agroexportadora, los kilos por destino y semana; en retail, el sell-out por tienda. Para que sea confiable, la base debe tener una fila por operación y el DNI como texto. Agrupa fechas por semana o campaña, agrega segmentaciones por agencia o fundo y usa «mostrar valores como % del total» para ver participaciones. Es la forma más rápida de responder al jefe sin rehacer el reporte.

## Errores comunes en planillas peruanas

- **DNI sin el cero inicial** que dejan de cruzar con la base de clientes.
- **RUC en notación científica** por guardarlo como número.
- **Consolidados incompletos** porque una agencia no envió su archivo.
- **Montos con S/ como texto** que no suman.
- **Tablas dinámicas sobre rangos fijos** que no incluyen las filas nuevas.

## De Excel a Power BI: el paso siguiente

Cuando el consolidado de agencias ya se arma con Power Query, Power BI lo convierte en un tablero que el jefe zonal revisa desde el celular, con filtros por agencia y producto. Revisa el [curso de Power BI](https://www.programbi.com/pe/cursos/power-bi) y la [guía de Power BI en Perú](/pe/guias/como-aprender-power-bi-en-peru). Para extraer datos de la base, el [curso de SQL Server](https://www.programbi.com/pe/cursos/sql-server); y para el perfil completo, el [curso de Análisis de datos](https://www.programbi.com/pe/cursos/analisis-de-datos).

## Un ejercicio para esta semana

Toma el reporte de colocaciones de un mes, conviértelo en Tabla y arma una tabla dinámica por agencia y producto. Agrega con BUSCARX el nombre del asesor, con el DNI como texto de ocho dígitos. Si el total cuadra con el reporte oficial, tienes un informe que se actualiza en minutos y un ejemplo concreto para tu próxima entrevista o convocatoria.

## Dónde se pide Excel en Perú

En Computrabajo, Bumeran, LinkedIn y Talento Perú, Excel aparece en avisos de asistente administrativo, analista de créditos, analista de costos, asistente contable y analista de logística. Muchas convocatorias públicas detallan el nivel de Excel que evalúan: úsalas como checklist de estudio.

## Plan de práctica de cuatro semanas

- **Semana 1:** convierte un reporte de colocaciones en Tabla y recupera los DNI con TEXTO.
- **Semana 2:** cruza con BUSCARX contra la base de clientes o asesores.
- **Semana 3:** arma la tabla dinámica por agencia y producto con segmentaciones.
- **Semana 4:** consolida con Power Query los archivos de todas las agencias.

## Cómo elegir un curso de Excel online en Perú

Busca que sea en vivo y en hora peruana, que incluya Power Query, que use casos reales de créditos, logística o ventas, que deje grabaciones (útil si vives fuera de Lima) y que cierre con un proyecto práctico.

## El curso de Excel en vivo de ProgramBI (Perú)

Datos de la [ficha del curso para Perú](https://www.programbi.com/pe/cursos/excel), revisada el 4 de noviembre de 2026:

- **En vivo por Zoom**, de **17:30 a 19:30, hora de Perú**. Próxima cohorte: cupos abiertos; fecha y días se confirman en la ficha.
- **20 horas, 12 módulos**, nivel básico-intermedio, pensado para administrativos principiantes o con conocimientos mínimos de Excel.
- Temario: del entorno y las fórmulas básicas a BUSCARX, INDICE-COINCIDIR, tablas dinámicas avanzadas, funciones de fecha y texto, datos grandes y Power Query con parámetros y funciones M; cada nivel cierra con un proyecto.
- **Nivel avanzado** disponible en la misma ficha.
- **Grabaciones de por vida**, **certificado** y proyectos con datos reales.
- Valor: **{precio_local}**.
- Instructor: **Manuel Oliva**, Magíster en Data Science (UAI), con capacitaciones en Anglo American, CAP, Deloitte y SQM.

**Formas de pago:** los cursos de ProgramBI se pueden pagar en 3 cuotas sin interés, en todos los países.

**[CTA-END]** — {precio_local} · 17:30 a 19:30, hora de Perú · «Inscribirme» · «Hablar por WhatsApp».

## Preguntas frecuentes

**¿Cuánto cuesta el curso de Excel en Perú?**
El nivel básico-intermedio de 20 horas cuesta {precio_local}, con grabaciones de por vida y certificado.

**¿El curso de Excel es online?**
Sí, online y en vivo por Zoom, de 17:30 a 19:30, hora de Perú. Las clases quedan grabadas.

**¿Cuándo empieza la próxima cohorte?**
La ficha indica cupos abiertos; la fecha y los días se confirman ahí o por WhatsApp.

**¿Sirve si parto desde cero?**
Sí. El nivel básico está pensado para personas con conocimientos mínimos de Excel.

**¿Me sirve para créditos, cobranzas o logística?**
Sí. Tablas dinámicas, BUSCARX y Power Query son las herramientas que más se usan en esas áreas.

**¿Qué versión de Excel necesito?**
BUSCARX está en Microsoft 365 y versiones recientes; si tu empresa usa una anterior, el temario incluye INDICE-COINCIDIR.

**¿Sirve para prepararme para una convocatoria pública?**
Muchas convocatorias piden Excel intermedio o avanzado; revisa siempre el temario específico que evalúan.
