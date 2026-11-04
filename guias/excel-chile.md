---
slug: curso-excel-chile
ruta_sugerida: /guias/curso-excel-chile
pais: cl
hreflang: es-CL
curso: excel
url_curso: https://www.programbi.com/cursos/excel
title: "Curso de Excel en Chile en vivo: guía 2026 | ProgramBI"
meta: "Curso de Excel online en vivo en Chile: 20 h, 12 módulos, de fórmulas a tablas dinámicas y Power Query, por $169.000 CLP. Temario, ejemplos y cómo seguir a Power BI."
h1: "Curso de Excel en Chile: Excel online, en vivo y aplicado a la pega"
updated: 2026-11-04
sources:
  - https://www.programbi.com/cursos/excel
  - https://www.programbi.com/cursos/power-bi
  - https://www.programbi.com/cursos/sql-server
  - https://www.programbi.com/cursos/analisis-de-datos
  - https://www.sii.cl/preguntas_frecuentes/impuestos_mensuales/001_130_0572.htm
nota_hermes: |
  ELEMENTO VISUAL: tabla comparativa «Excel básico vs. intermedio: qué sabes hacer al terminar cada nivel» + bloque «En 30 segundos».
  Intención: "curso Excel online en vivo Chile", "curso Excel Chile", "aprender Excel desde cero" → click_registro en /cursos/excel. country=cl, course=excel.
  - PRECIO: 169.000 CLP confirmado por Manu (4 nov 2026) para cursos básico-intermedio; léelo igual como {precio_local} desde config/pricing.ts. El JSON-LD actual dice 249.000: debe corregirlo WS1.
  - FECHA: la ficha de Excel muestra «Cupos abiertos — consulta fecha» y días «Por confirmar» en el nivel básico-intermedio (el horario 19:30 a 21:30, hora de Chile sale de sus preguntas frecuentes). La guía NO da fecha de inicio; cuando la ficha la confirme, agrégala en la respuesta corta y en CTA-TOP.
  - Tasas de IVA/IGV: cada una enlaza una página oficial que la dice explícitamente (verificado 4 nov 2026). México: sin cifra (no se pudo abrir una página oficial); el ejemplo usa una celda TasaIVA.
  - Primeros dos párrafos = respuesta citable (GEO). Schema Article + FAQPage + BreadcrumbList, sin Course/Offer. CTAs §2.5 con course=excel.
  - WhatsApp: "Hola, vengo de la guía de Excel para Chile en programbi.com y quiero info del curso en vivo".
  - Sin cifras de sueldo: no hay fuente específica para perfiles de Excel.
---

# Curso de Excel en Chile: Excel online, en vivo y aplicado a la pega

**Respuesta corta:** el [curso de Excel de ProgramBI para Chile](https://www.programbi.com/cursos/excel) es **online y en vivo por Zoom**: **20 horas en 12 módulos**, nivel básico-intermedio, en horario de **19:30 a 21:30, hora de Chile**. El valor es **$169.000 CLP** e incluye grabaciones de por vida y certificado. La próxima cohorte tiene cupos abiertos; la fecha de inicio se confirma en la ficha del curso.

**¿Qué aprendes?** De fórmulas básicas a lo que piden los avisos de control de gestión y finanzas: BUSCARX, tablas dinámicas avanzadas, funciones de fecha y texto, y Power Query para combinar y limpiar archivos sin copiar y pegar. En la pega se nota así: el informe del cierre deja de tomarte un día y pasa a actualizarse con un clic.

**[CTA-TOP]** — Cupos abiertos · 19:30 a 21:30, hora de Chile · «Ver el curso».

## Por qué vale la pena dominar Excel en Chile

En Chile, Excel sigue siendo la herramienta de trabajo de casi cualquier área administrativa: control de gestión arma el informe mensual, finanzas cuadra la cartola contra el libro de compras, remuneraciones revisa la planilla de sueldos y operaciones controla el inventario. El problema no es usar Excel; es usarlo a medias. Muchas personas pasan horas copiando y pegando, arreglando fórmulas que se rompen o rehaciendo la misma tabla dinámica cada lunes.

Un buen curso de Excel no te enseña «dónde está el botón». Te enseña a armar planillas que no se rompen, a cruzar información con BUSCARX y a dejar que Power Query haga el trabajo repetitivo. Eso se nota en la pega desde la primera semana.

## Excel en la pega: lo que más se usa en Chile

En la mayoría de las oficinas chilenas, tres cosas resuelven casi todo: una Tabla bien armada, BUSCARX para traer datos de otra hoja y una tabla dinámica para resumir. Si a eso le sumas Power Query para dejar de copiar y pegar, cubres el 90 % de lo que te van a pedir en control de gestión, finanzas, remuneraciones o ventas. El resto —macros, VBA, fórmulas matriciales complejas— suma, pero no es lo que te hace más productivo en el corto plazo.

## Fórmulas clave, con ejemplos de Chile

- **Ventas de una región**: `=SUMAR.SI.CONJUNTO(Ventas[Monto];Ventas[Región];"Biobío")`
- **Traer la razón social desde el maestro de clientes**: `=BUSCARX([@RUT];Clientes[RUT];Clientes[Razón social];"No encontrado")`
- **Clasificar facturas por antigüedad**: `=SI([@Días]<=30;"0-30";SI([@Días]<=60;"31-60";"+60"))`
- **Calcular el IVA de una venta neta** (tasa del 19 %, según las [preguntas frecuentes del SII](https://www.sii.cl/preguntas_frecuentes/impuestos_mensuales/001_130_0572.htm)): `=[@Neto]*19%`
- **Días hábiles entre dos fechas**, excluyendo una lista de feriados: `=DIAS.LAB([@Emisión];[@Vencimiento];Feriados)`

**Un detalle muy chileno: el RUT.** Llega con puntos y guion desde un sistema («12.345.678-9») y sin ellos desde otro («123456789»). Antes de un BUSCARX, normalízalo con `=SUSTITUIR(SUSTITUIR(A2;".";"");"-";"")`, o el cruce te va a devolver errores en clientes que sí existen. Y ojo con el dígito verificador «K»: guárdalo siempre como texto.



**[CTA-MID]** — Descarga gratis la plantilla de dashboard de ventas en pesos chilenos.

## Caso: el reporte que se arma solo con Power Query

Una analista de control de gestión en Santiago recibe cada mes doce archivos, uno por sucursal, de Arica a Punta Arenas. Antes los abría uno por uno, copiaba, pegaba y revisaba que no faltara nada: casi un día completo. Con Power Query los deja en una carpeta, la consulta los combina, limpia los montos que vienen como texto, quita filas de totales y carga una sola tabla. El mes siguiente solo pega los archivos nuevos y presiona «Actualizar». El día de trabajo se convierte en cinco minutos, y el resto del tiempo se usa para explicar por qué cayó el margen en Antofagasta.

## Tablas dinámicas para control de gestión

En control de gestión, la tabla dinámica es la herramienta del cierre: ventas netas por región, gastos por centro de costo, presupuesto contra real. Tres hábitos hacen la diferencia. Primero, parte siempre de una Tabla (Ctrl + T), así el informe incluye solo las filas nuevas del mes. Segundo, agrupa las fechas por mes y trimestre en vez de crear columnas a mano. Tercero, agrega segmentaciones por sucursal: el gerente filtra solo y deja de pedirte una versión por región. Si el informe mensual se vuelve una tabla dinámica bien armada, el cierre deja de ser una carrera contra el reloj.

## Errores típicos en planillas chilenas

- **Celdas combinadas en el libro de ventas.** Rompen filtros y tablas dinámicas.
- **RUT como número.** Se pierde la «K» y el cruce falla.
- **Montos pegados como texto** desde el ERP («$1.234.567»). Conviértelos antes de sumar.
- **BUSCARV con número de columna fijo.** Si alguien inserta una columna, el informe trae datos equivocados sin avisar.
- **Rehacer el informe cada mes** en vez de actualizar una consulta de Power Query.

## De Excel a Power BI: el paso siguiente

Cuando el informe mensual ya vive en tablas dinámicas y Power Query, el paso lógico es Power BI: el mismo Power Query, pero con modelos de varias tablas y tableros que gerencia abre desde el celular. Revisa el [curso de Power BI](https://www.programbi.com/cursos/power-bi) y la [guía para aprender Power BI en Chile](/guias/como-aprender-power-bi-en-chile). Para sacar los datos directo del ERP está el [curso de SQL Server](https://www.programbi.com/cursos/sql-server), y el [curso de Análisis de datos](https://www.programbi.com/cursos/analisis-de-datos) junta SQL, Power BI y Python.

## Un ejercicio para esta semana

Toma el libro de ventas de un mes, conviértelo en Tabla y arma una tabla dinámica de ventas netas por región y semana. Después agrega una columna con BUSCARX que traiga el ejecutivo de cada cliente desde el maestro, normalizando el RUT. Si los totales cuadran con el informe oficial, ya tienes la base de un reporte que puedes actualizar cada mes en minutos, y una historia concreta para tu próxima entrevista.

## Dónde se pide Excel en Chile

En LinkedIn, Chiletrabajos, Laborum y Empleos Públicos, «Excel intermedio» o «Excel avanzado» aparece como requisito en avisos de asistente de finanzas, analista de control de gestión, analista de remuneraciones, ejecutivo comercial y administrativo contable. En la entrevista suelen pedir una prueba práctica: una tabla dinámica, un BUSCARV o BUSCARX y un gráfico. Si dominas esas tres cosas con soltura, pasas el filtro.

## Un plan de cuatro semanas, al ritmo de la pega

- **Semana 1:** ordena tu libro de ventas como Tabla y practica SUMAR.SI.CONJUNTO por región.
- **Semana 2:** cambia tus BUSCARV por BUSCARX y arma la tabla dinámica del cierre.
- **Semana 3:** combina con Power Query los archivos de todas las sucursales.
- **Semana 4:** deja el informe mensual listo para actualizarse con un clic.

## Qué mirar antes de inscribirte en un curso de Excel en Chile

Que sea en vivo y en hora chilena, que llegue a Power Query (no solo fórmulas), que use casos de oficina reales, que tenga grabaciones para cuando el cierre de mes te quite una clase y que termine con un proyecto que puedas mostrar.

## El curso de Excel en vivo de ProgramBI (Chile)

Datos de la [ficha del curso para Chile](https://www.programbi.com/cursos/excel), revisada el 4 de noviembre de 2026:

- **En vivo por Zoom**, de **19:30 a 21:30, hora de Chile**. Próxima cohorte: cupos abiertos; fecha y días se confirman en la ficha.
- **20 horas, 12 módulos**, nivel básico-intermedio, pensado para administrativos principiantes o con conocimientos mínimos de Excel.
- Temario: del entorno y las fórmulas básicas a BUSCARX, INDICE-COINCIDIR, tablas dinámicas avanzadas, funciones de fecha y texto, datos grandes y Power Query con parámetros y funciones M; cada nivel cierra con un proyecto.
- **Nivel avanzado** disponible en la misma ficha.
- **Grabaciones de por vida**, **certificado** y proyectos con datos reales.
- Valor: **$169.000 CLP**.
- Instructor: **Manuel Oliva**, Magíster en Data Science (UAI), con capacitaciones en Anglo American, CAP, Deloitte y SQM.

**Formas de pago:** los cursos de ProgramBI se pueden pagar en 3 cuotas sin interés, en todos los países.

**[CTA-END]** — {precio_local} · 19:30 a 21:30, hora de Chile · «Inscribirme» · «Hablar por WhatsApp».

## Preguntas frecuentes

**¿Cuánto cuesta el curso de Excel en Chile?**
El nivel básico-intermedio de 20 horas cuesta $169.000 CLP, con grabaciones de por vida y certificado.

**¿El curso de Excel es online?**
Sí, online y en vivo por Zoom, de 19:30 a 21:30, hora de Chile. Las clases quedan grabadas.

**¿Cuándo empieza la próxima cohorte?**
La ficha indica cupos abiertos; la fecha y los días se confirman ahí o por WhatsApp.

**¿Sirve si parto desde cero?**
Sí. El nivel básico está pensado para personas con conocimientos mínimos de Excel.

**¿Me sirve para control de gestión o remuneraciones?**
Sí. Tablas dinámicas, BUSCARX y Power Query son justamente lo que se usa para cierres mensuales, planillas de sueldos y presupuestos.

**¿Qué versión de Excel necesito?**
BUSCARX está en Microsoft 365 y versiones recientes. Si tu empresa usa una versión antigua, se trabaja con INDICE-COINCIDIR, que también está en el temario.

**¿Puedo seguir después con Power BI?**
Sí. Power Query es el mismo en Excel y Power BI, así que el paso es natural.
