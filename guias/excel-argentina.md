---
slug: curso-excel-argentina
ruta_sugerida: /ar/guias/curso-excel-argentina
pais: ar
hreflang: es-AR
curso: excel
url_curso: https://www.programbi.com/ar/cursos/excel
title: "Curso de Excel en Argentina en vivo: guía 2026 | ProgramBI"
meta: "Curso de Excel online en vivo en Argentina: 20 h, 12 módulos, de fórmulas a tablas dinámicas y Power Query, 19:30. Temario y ejemplos con datos argentinos."
h1: "Curso de Excel en Argentina: Excel online y en vivo para tu laburo"
updated: 2026-11-04
sources:
  - https://www.programbi.com/ar/cursos/excel
  - https://www.programbi.com/ar/cursos/power-bi
  - https://www.programbi.com/ar/cursos/sql-server
  - https://www.programbi.com/ar/cursos/analisis-de-datos
  - https://arca.gob.ar/iva/documentos/Libro-IVA-Digital-Tablas-del-Sistema.pdf
nota_hermes: |
  ELEMENTO VISUAL: bloque «En 30 segundos» + mini tabla de ejemplo «variación mensual nominal vs. %» para ilustrar el uso con inflación.
  Intención: "curso Excel online en vivo Argentina", "curso Excel Argentina", "aprender Excel desde cero" → click_registro en /ar/cursos/excel. country=ar, course=excel.
  - PRECIO: {precio_local} = placeholder de config/pricing.ts (WS1), clave excel × ar. Manu aún no define el monto: NO escribas cifras (la ficha muestra hoy montos y una nota de cobro en CLP; no copiarlos). Sin valor → "Consulta el valor por WhatsApp".
  - FECHA: la ficha de Excel muestra «Cupos abiertos — consulta fecha» y días «Por confirmar» en el nivel básico-intermedio (el horario 19:30 a 21:30, hora de Argentina sale de sus preguntas frecuentes). La guía NO da fecha de inicio; cuando la ficha la confirme, agrégala en la respuesta corta y en CTA-TOP.
  - Tasas de IVA/IGV: cada una enlaza una página oficial que la dice explícitamente (verificado 4 nov 2026). México: sin cifra (no se pudo abrir una página oficial); el ejemplo usa una celda TasaIVA.
  - Primeros dos párrafos = respuesta citable (GEO). Schema Article + FAQPage + BreadcrumbList, sin Course/Offer. CTAs §2.5 con course=excel.
  - WhatsApp: "Hola, vengo de la guía de Excel para Argentina en programbi.com y quiero info del curso en vivo".
  - Sin cifras de sueldo: no hay fuente específica para perfiles de Excel.
---

# Curso de Excel en Argentina: Excel online y en vivo para tu laburo

**Respuesta corta:** el [curso de Excel de ProgramBI para Argentina](https://www.programbi.com/ar/cursos/excel) es **online y en vivo por Zoom**: **20 horas en 12 módulos**, nivel básico-intermedio, en horario de **19:30 a 21:30, hora de Argentina**. El valor es **{precio_local}** e incluye grabaciones de por vida y certificado. La próxima cohorte tiene cupos abiertos; la fecha de inicio se confirma en la ficha del curso.

**¿Qué aprendés?** De lo básico a lo que te piden en compras, pricing y administración: BUSCARX para traer precios vigentes, tablas dinámicas con variaciones mensuales, funciones de fecha y texto, y Power Query para combinar las listas de todos tus proveedores. En el laburo: cada cambio de precios deja de ser una semana de planillas.

**[CTA-TOP]** — Cupos abiertos · 19:30 a 21:30, hora de Argentina · «Ver el curso».

## Por qué vale la pena dominar Excel en Argentina

En Argentina, Excel es la herramienta con la que se pelea la inflación todos los días: compras actualiza listas de precios de proveedores, comercial recalcula márgenes, administración concilia cobranzas y finanzas arma el flujo de fondos. Cada vez que cambia un precio, alguien tiene que rehacer cálculos en varias planillas. Si esas planillas están mal armadas, el error se multiplica.

Dominar Excel de verdad —tablas bien estructuradas, BUSCARX, tablas dinámicas y Power Query— es lo que separa a quien rehace todo cada semana de quien actualiza con un clic.

## Lo que más se usa en el laburo en Argentina

En compras, pricing, administración y finanzas, el combo ganador es: listas como Tablas, BUSCARX para traer el precio vigente, tablas dinámicas con variación mensual y Power Query para combinar archivos de proveedores. Con eso, cada cambio de precios deja de ser una semana de trabajo y pasa a ser una actualización. En un contexto donde los números se mueven rápido, esa diferencia vale mucho.

## Fórmulas clave, con ejemplos de Argentina

- **Facturación de una provincia**: `=SUMAR.SI.CONJUNTO(Ventas[Importe];Ventas[Provincia];"Córdoba")`
- **Traer el precio vigente de la lista del proveedor**: `=BUSCARX([@Código];Lista[Código];Lista[Precio];"Sin precio")`
- **Variación mensual de un costo**: `=[@Costo]/[@[Costo mes anterior]]-1`
- **Marcar productos vendidos por debajo del costo**: `=SI([@Precio]<[@Costo];"Revisar";"OK")`
- **Calcular el IVA de un neto** (alícuota del 21 %, que figura en las [tablas del Libro IVA Digital de ARCA](https://arca.gob.ar/iva/documentos/Libro-IVA-Digital-Tablas-del-Sistema.pdf)): `=[@Neto]*21%`

**Un detalle local: el CUIT y los formatos de número.** El CUIT llega con guiones en un sistema («30-12345678-9») y sin ellos en otro; normalizalo con `=SUSTITUIR(A2;"-";"")` antes de cruzar. Y si importás archivos con punto como separador decimal, revisá la configuración regional: «1.234,56» y «1,234.56» no son lo mismo para Excel.

## Formato condicional para detectar problemas a simple vista

Cuando manejás listas con cientos de productos, el formato condicional te muestra lo importante sin leer fila por fila:

- **Escalas de color** sobre la columna de variación mensual: lo que más subió queda en rojo intenso.
- **Reglas por fórmula**, como `=[@Precio]<[@Costo]`, para pintar productos vendidos por debajo del costo.
- **Barras de datos** para comparar ventas por vendedor dentro de la misma celda.
- **Duplicados resaltados** para detectar códigos de producto repetidos en una lista de proveedor.

Combinalo con validación de datos (listas desplegables para rubros o proveedores) y vas a tener planillas que no solo calculan, sino que te avisan cuando algo anda mal. En un contexto de precios que cambian todo el tiempo, que la planilla te avise es la diferencia entre corregir a tiempo y enterarte tarde, cuando el margen ya se perdió en las ventas de la quincena.

**[CTA-MID]** — Descargá gratis la plantilla de dashboard de ventas en pesos argentinos.

## Caso: el reporte que se arma solo con Power Query

Un analista de compras de una distribuidora de Rosario recibe cada quincena listas nuevas de quince proveedores. Antes abría cada una, copiaba precios a la planilla maestra y revisaba fórmulas rotas. Con Power Query arma una consulta que lee la carpeta de listas, estandariza columnas y combina todo en una tabla. Con un BUSCARX, la planilla de márgenes toma el precio vigente y marca los productos que quedaron en rojo. Cuando llega una lista nueva, la guarda en la carpeta y actualiza. Lo que le llevaba dos días ahora le lleva una hora.

## Tablas dinámicas en un contexto de precios que cambian

Con inflación, la tabla dinámica sirve para ver lo que la planilla esconde: cuánto subió el costo por rubro, qué proveedor aumentó más, cómo varió el margen mes a mes. Armala sobre una Tabla con una columna de fecha y otra de precio; agrupá por mes; mostrá los valores como «% de diferencia respecto del mes anterior» y sumá segmentaciones por proveedor. Así comparás variaciones y no solo montos nominales, que es donde se esconden los errores de decisión.

## Errores que se repiten en planillas argentinas

- **Comparar montos nominales** entre meses sin calcular la variación.
- **Separador decimal mal configurado** al importar listas de proveedores.
- **CUIT con y sin guiones** en tablas que se quieren cruzar.
- **Listas de precios pegadas a mano** cada quincena.
- **Fórmulas que apuntan a la lista vieja** porque nadie actualizó el rango.

## De Excel a Power BI: el paso siguiente

Cuando tus listas y márgenes ya se actualizan con Power Query, Power BI te deja mostrarlos en un tablero con variaciones por rubro y proveedor que la gerencia consulta sin pedirte nada. Mirá el [curso de Power BI](https://www.programbi.com/ar/cursos/power-bi) y la [guía de Power BI en Argentina](/ar/guias/como-aprender-power-bi-en-argentina). Para sacar datos directo del sistema, el [curso de SQL Server](https://www.programbi.com/ar/cursos/sql-server); y para todo junto, el [curso de Análisis de datos](https://www.programbi.com/ar/cursos/analisis-de-datos).

## Un ejercicio para esta semana

Tomá la lista de precios de un proveedor y tu planilla de ventas del mes, convertí ambas en Tablas y traé con BUSCARX el costo vigente de cada producto. Calculá el margen y armá una tabla dinámica por rubro con un formato condicional que pinte en rojo los márgenes negativos. Si lo hacés con datos reales (anonimizados), tenés un caso concreto para contar en tu próxima entrevista.

## Dónde se pide Excel en Argentina

En Bumeran, ZonaJobs, Computrabajo y LinkedIn, Excel aparece en búsquedas de analista de compras, analista de pricing, administrativo contable, asistente de finanzas y analista de cuentas a cobrar. En las entrevistas suelen tomar una prueba práctica: tabla dinámica, BUSCARV o BUSCARX y un gráfico. Practicala con tiempo.

## Plan de práctica de cuatro semanas

- **Semana 1:** ordená una lista de precios como Tabla y limpiá formatos numéricos.
- **Semana 2:** traé costos vigentes con BUSCARX y calculá márgenes.
- **Semana 3:** armá una tabla dinámica con variación mensual por rubro.
- **Semana 4:** combiná con Power Query todas las listas de proveedores de una carpeta.

## Cómo elegir un curso de Excel online en Argentina

Fijate que sea en vivo y en tu horario, que llegue a Power Query, que use casos de laburo reales como listas de precios o cobranzas, que tenga grabaciones y que termine con un proyecto práctico.

## El curso de Excel en vivo de ProgramBI (Argentina)

Datos de la [ficha del curso para Argentina](https://www.programbi.com/ar/cursos/excel), revisada el 4 de noviembre de 2026:

- **En vivo por Zoom**, de **19:30 a 21:30, hora de Argentina**. Próxima cohorte: cupos abiertos; fecha y días se confirman en la ficha.
- **20 horas, 12 módulos**, nivel básico-intermedio, pensado para administrativos principiantes o con conocimientos mínimos de Excel.
- Temario: del entorno y las fórmulas básicas a BUSCARX, INDICE-COINCIDIR, tablas dinámicas avanzadas, funciones de fecha y texto, datos grandes y Power Query con parámetros y funciones M; cada nivel cierra con un proyecto.
- **Nivel avanzado** disponible en la misma ficha.
- **Grabaciones de por vida**, **certificado** y proyectos con datos reales.
- Valor: **{precio_local}**.
- Instructor: **Manuel Oliva**, Magíster en Data Science (UAI), con capacitaciones en Anglo American, CAP, Deloitte y SQM.

**Formas de pago:** los cursos de ProgramBI se pueden pagar en 3 cuotas sin interés, en todos los países.

**[CTA-END]** — {precio_local} · 19:30 a 21:30, hora de Argentina · «Inscribirme» · «Hablar por WhatsApp».

## Preguntas frecuentes

**¿Cuánto cuesta el curso de Excel en Argentina?**
El nivel básico-intermedio de 20 horas cuesta {precio_local}, con grabaciones de por vida y certificado.

**¿El curso de Excel es online?**
Sí, online y en vivo por Zoom, de 19:30 a 21:30, hora de Argentina. Las clases quedan grabadas.

**¿Cuándo empieza la próxima cohorte?**
La ficha indica cupos abiertos; la fecha y los días se confirman ahí o por WhatsApp.

**¿Sirve si parto desde cero?**
Sí. El nivel básico está pensado para personas con conocimientos mínimos de Excel.

**¿Me sirve para compras, pricing o cobranzas?**
Sí. BUSCARX, tablas dinámicas y Power Query son las herramientas que más se usan para actualizar listas, calcular márgenes y seguir cobranzas.

**¿Qué versión de Excel necesito?**
BUSCARX está en Microsoft 365 y versiones recientes; si tenés una anterior, el temario incluye INDICE-COINCIDIR.

**¿Después puedo seguir con Power BI?**
Sí. Power Query es el mismo en Excel y en Power BI.
