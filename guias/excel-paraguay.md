---
slug: curso-excel-paraguay
ruta_sugerida: /py/guias/curso-excel-paraguay
pais: py
hreflang: es-PY
curso: excel
url_curso: https://www.programbi.com/py/cursos/excel
title: "Curso de Excel en Paraguay en vivo: guía 2026 | ProgramBI"
meta: "Curso de Excel online en vivo en Paraguay: 20 h, 12 módulos, de fórmulas a tablas dinámicas y Power Query, 19:30. Temario y ejemplos con datos paraguayos."
h1: "Curso de Excel en Paraguay: planillas online, en vivo y sin vueltas"
updated: 2026-11-04
sources:
  - https://www.programbi.com/py/cursos/excel
  - https://www.programbi.com/py/cursos/power-bi
  - https://www.programbi.com/py/cursos/sql-server
  - https://www.programbi.com/py/cursos/analisis-de-datos
  - https://www.dnit.gov.py/web/portal-institucional/iva
nota_hermes: |
  ELEMENTO VISUAL: diagrama «planillas por WhatsApp/correo → carpeta → Power Query → tabla dinámica» + bloque «En 30 segundos».
  Intención: "curso Excel online en vivo Paraguay", "curso Excel Paraguay", "aprender Excel desde cero" → click_registro en /py/cursos/excel. country=py, course=excel.
  - PRECIO: {precio_local} = placeholder de config/pricing.ts (WS1), clave excel × py. Manu aún no define el monto: NO escribas cifras (la ficha muestra hoy montos y una nota de cobro en CLP; no copiarlos). Sin valor → "Consulta el valor por WhatsApp".
  - La ficha /py/ ya publica un Offer en USD no aprobado: WS1 debe quitarlo o alinearlo.
  - FECHA: la ficha de Excel muestra «Cupos abiertos — consulta fecha» y días «Por confirmar» en el nivel básico-intermedio (el horario 19:30 a 21:30, hora de Paraguay sale de sus preguntas frecuentes). La guía NO da fecha de inicio; cuando la ficha la confirme, agrégala en la respuesta corta y en CTA-TOP.
  - Tasas de IVA/IGV: cada una enlaza una página oficial que la dice explícitamente (verificado 4 nov 2026). México: sin cifra (no se pudo abrir una página oficial); el ejemplo usa una celda TasaIVA.
  - Primeros dos párrafos = respuesta citable (GEO). Schema Article + FAQPage + BreadcrumbList, sin Course/Offer. CTAs §2.5 con course=excel.
  - WhatsApp: "Hola, vengo de la guía de Excel para Paraguay en programbi.com y quiero info del curso en vivo".
  - Sin cifras de sueldo: no hay fuente específica para perfiles de Excel.
---

# Curso de Excel en Paraguay: planillas online, en vivo y sin vueltas

**Respuesta corta:** el [curso de Excel de ProgramBI para Paraguay](https://www.programbi.com/py/cursos/excel) es **online y en vivo por Zoom**: **20 horas en 12 módulos**, nivel básico-intermedio, en horario de **19:30 a 21:30, hora de Paraguay**. El valor es **{precio_local}** e incluye grabaciones de por vida y certificado. La próxima cohorte tiene cupos abiertos; la fecha de inicio se confirma en la ficha del curso.

**¿Qué aprendés?** De las bases a lo que piden cooperativas, financieras y distribuidoras en Paraguay: BUSCARX para cruzar socios o clientes, tablas dinámicas de cartera y ventas, funciones de fecha y texto, y Power Query para juntar las planillas que llegan de cada sucursal. En el trabajo: el informe del lunes sale con un clic.

**[CTA-TOP]** — Cupos abiertos · 19:30 a 21:30, hora de Paraguay · «Ver el curso».

## Por qué vale la pena dominar Excel en Paraguay

En Paraguay, muchas empresas funcionan sobre planillas: la sucursal manda su cierre por correo o por WhatsApp, el silo reporta el acopio en su propio archivo, la cooperativa sigue la cartera en una hoja que alguien actualiza cada lunes. La información está, pero juntarla y cuadrarla consume horas de trabajo que nadie ve.

Dominar Excel —tablas bien armadas, BUSCARX, tablas dinámicas y Power Query— transforma ese trabajo. Y como todavía son pocos los perfiles administrativos que manejan Power Query, aprenderlo te diferencia rápido.

## Lo que más se usa en oficinas paraguayas

En cooperativas, financieras, distribuidoras y agroindustria, el trabajo de reportes se resuelve con tres herramientas: Tablas bien armadas, BUSCARX y tablas dinámicas. Si a eso le sumás Power Query para juntar las planillas que llegan de cada sucursal o silo, el informe del lunes deja de depender de copiar y pegar. Como todavía son pocos los perfiles administrativos que manejan Power Query, es una ventaja concreta en cualquier proceso de selección.

## Fórmulas clave, con ejemplos de Paraguay

- **Ventas de una zona**: `=SUMAR.SI.CONJUNTO(Ventas[Monto];Ventas[Zona];"Alto Paraná")`
- **Traer el nombre del socio por cédula**: `=BUSCARX([@CI];Socios[CI];Socios[Nombre];"No registrado")`
- **Clasificar créditos por tramo de atraso**: `=SI([@Atraso]<=30;"0-30";SI([@Atraso]<=60;"31-60";"+60"))`
- **Calcular el IVA de un precio con IVA incluido** (tasa del 10 %; la [DNIT](https://www.dnit.gov.py/web/portal-institucional/iva) informa tasas de 5 % y 10 %): `=[@Total]/11`
- **Toneladas acopiadas por silo**: `=SUMAR.SI.CONJUNTO(Acopio[Toneladas];Acopio[Silo];[@Silo])`

**Un detalle local: cédulas y montos en guaraníes.** La cédula llega con puntos («1.234.567») en un sistema y sin ellos en otro; limpiala con `=SUSTITUIR(A2;".";"")` y guardala como texto. Los montos en guaraníes son cifras grandes sin decimales: si llegan como texto («Gs. 1.500.000»), conviértelos a número en Power Query antes de sumarlos.

## Plantillas que las sucursales no pueden romper

Si cada sucursal o silo te manda su planilla, el primer paso para automatizar es que todas tengan el mismo formato. Algunas prácticas que ayudan mucho:

- **Una plantilla única**, con las mismas columnas en el mismo orden, que distribuís a todas las sucursales.
- **Validación de datos** con listas desplegables para sucursal, producto o tipo de grano.
- **Celdas protegidas**: solo se editan las de carga; las fórmulas y títulos quedan bloqueados.
- **Un nombre de archivo estándar**, como «sucursal_fecha.xlsx», para que Power Query los ordene sin confusión.
- **Una hoja de instrucciones** breve que explique qué cargar en cada columna.

Con plantillas así, la consulta de Power Query funciona siempre a la primera y el informe del lunes deja de depender de corregir errores ajenos. Además, las sucursales cargan más rápido porque saben exactamente qué completar.

**[CTA-MID]** — Descargá gratis la plantilla de dashboard de ventas en guaraníes.

## Caso: el reporte que se arma solo con Power Query

Un analista de una cooperativa de Encarnación recibe cada lunes las planillas de cartera de seis sucursales. Antes las copiaba a una hoja maestra y armaba la tabla dinámica de mora a mano, revisando cédulas mal cargadas. Con Power Query, guarda las planillas en una carpeta; la consulta las combina, limpia cédulas y montos, y carga una tabla única. La tabla dinámica de mora por sucursal y tramo se actualiza con un clic. Ahora dedica la mañana a revisar los casos críticos en lugar de pegar datos.

## Tablas dinámicas para cartera, ventas y acopio

En una cooperativa, la tabla dinámica muestra la mora por sucursal y tramo; en una distribuidora, las ventas por zona y vendedor; en agroindustria, las toneladas por silo y grano. La clave es la base: una fila por registro, cédulas como texto y montos en guaraníes como número. Agrupá fechas por semana o zafra, agregá segmentaciones por sucursal y guardá la tabla en una hoja aparte. Con eso, el informe del lunes sale con un clic.

## Errores comunes en planillas paraguayas

- **Cédulas con puntos** que no cruzan con otras tablas.
- **Montos en guaraníes como texto** («Gs. 1.500.000») que no suman.
- **Planillas recibidas por WhatsApp** guardadas con nombres distintos cada semana.
- **Celdas combinadas** en tablas de datos.
- **Copiar y pegar cada lunes** lo que Power Query puede combinar solo.

## De Excel a Power BI: el paso siguiente

Cuando las planillas de tus sucursales ya se combinan con Power Query, Power BI te permite mostrar mora, ventas o acopio en un tablero que la gerencia consulta sin esperar el correo del lunes. Mirá el [curso de Power BI](https://www.programbi.com/py/cursos/power-bi) y la [guía de Power BI en Paraguay](/py/guias/como-aprender-power-bi-en-paraguay). Para sacar datos del sistema, el [curso de SQL Server](https://www.programbi.com/py/cursos/sql-server); y para todo junto, el [curso de Análisis de datos](https://www.programbi.com/py/cursos/analisis-de-datos).

## Un ejercicio para esta semana

Tomá las planillas de venta de dos o tres sucursales, guardalas en una carpeta y combinarlas con Power Query. Convertí los montos en guaraníes a número, limpiá las cédulas y armá una tabla dinámica por sucursal y semana. Si el total cuadra con lo que reportan las sucursales, tenés un informe que se actualiza con un clic y un ejemplo concreto para tu próxima entrevista.

## Dónde se pide Excel en Paraguay

En Computrabajo Paraguay, LinkedIn y Paraguay Concursa, Excel aparece en avisos de auxiliar contable, analista de créditos, asistente administrativo, analista comercial y encargado de stock. Muchos avisos dicen «manejo de planillas» o «Excel avanzado»: en la entrevista, mostrá un ejemplo concreto de lo que automatizaste.

## Plan de práctica de cuatro semanas

- **Semana 1:** guardá las planillas de tus sucursales en una carpeta con nombres ordenados.
- **Semana 2:** limpiá cédulas y montos y traé datos con BUSCARX.
- **Semana 3:** armá la tabla dinámica de mora o ventas con segmentaciones.
- **Semana 4:** automatizá con Power Query la unión de todas las planillas.

## Cómo elegir un curso de Excel online en Paraguay

Fijate que sea en vivo y en hora paraguaya, que incluya Power Query, que use casos reales como cartera, ventas o stock, que tenga grabaciones y que termine con un proyecto práctico.

## El curso de Excel en vivo de ProgramBI (Paraguay)

Datos de la [ficha del curso para Paraguay](https://www.programbi.com/py/cursos/excel), revisada el 4 de noviembre de 2026:

- **En vivo por Zoom**, de **19:30 a 21:30, hora de Paraguay**. Próxima cohorte: cupos abiertos; fecha y días se confirman en la ficha.
- **20 horas, 12 módulos**, nivel básico-intermedio, pensado para administrativos principiantes o con conocimientos mínimos de Excel.
- Temario: del entorno y las fórmulas básicas a BUSCARX, INDICE-COINCIDIR, tablas dinámicas avanzadas, funciones de fecha y texto, datos grandes y Power Query con parámetros y funciones M; cada nivel cierra con un proyecto.
- **Nivel avanzado** disponible en la misma ficha.
- **Grabaciones de por vida**, **certificado** y proyectos con datos reales.
- Valor: **{precio_local}**.
- Instructor: **Manuel Oliva**, Magíster en Data Science (UAI), con capacitaciones en Anglo American, CAP, Deloitte y SQM.

**[CTA-END]** — {precio_local} · 19:30 a 21:30, hora de Paraguay · «Inscribirme» · «Hablar por WhatsApp».

## Preguntas frecuentes

**¿Cuánto cuesta el curso de Excel en Paraguay?**
El nivel básico-intermedio de 20 horas cuesta {precio_local}, con grabaciones de por vida y certificado.

**¿El curso de Excel es online?**
Sí, online y en vivo por Zoom, de 19:30 a 21:30, hora de Paraguay. Las clases quedan grabadas.

**¿Cuándo empieza la próxima cohorte?**
La ficha indica cupos abiertos; la fecha y los días se confirman ahí o por WhatsApp.

**¿Sirve si parto desde cero?**
Sí. El nivel básico está pensado para personas con conocimientos mínimos de Excel.

**¿Me sirve para cooperativas, financieras o distribuidoras?**
Sí. Tablas dinámicas, BUSCARX y Power Query son las herramientas que más se usan para cartera, ventas y stock.

**¿Qué versión de Excel necesito?**
BUSCARX está en Microsoft 365 y versiones recientes; si tenés una anterior, el temario incluye INDICE-COINCIDIR.

**¿Puedo seguir después con Power BI?**
Sí. Power Query funciona igual en Excel y en Power BI.
