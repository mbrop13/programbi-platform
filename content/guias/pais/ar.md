---
title: Cómo aprender Power BI en Argentina: guía 2026 | ProgramBI
description: Sueldos de analista BI según Sysarmy, ruta de 8 semanas, DAX ajustado por inflación y dónde buscar laburo en Argentina. Guía práctica.
h1: Cómo aprender Power BI en Argentina (y analizar datos con inflación)
country: ar
lang: es-AR
slug: como-aprender-power-bi-en-argentina
path: /ar/guias/como-aprender-power-bi-en-argentina
updated: 2026-11-14
course: power-bi
url_curso: https://www.programbi.com/ar/cursos/power-bi
sources:
  - https://sysarmy.com/
  - https://institutoiea.edu.ar/publicaciones/que-hace-un-analista-de-datos-y-cuanto-gana
  - https://learn.microsoft.com/es-es/credentials/certifications/data-analyst-associate/
  - https://www.programbi.com/ar/cursos/power-bi
nota_hermes: |
  ELEMENTO VISUAL: ruta de aprendizaje de 8 semanas en Power BI para analistas en Argentina.
---
En Argentina, analizar datos tiene una dificultad que en otros países casi no existe: si comparás las ventas en pesos de este año con las del año pasado sin ajustar, cualquier negocio parece crecer muchísimo. Por eso un buen analista argentino no solo arma tableros: sabe expresar las cifras en moneda constante, comparar contra el dólar cuando corresponde y explicar qué pasó «en serio». Power BI es la herramienta ideal para eso. Esta guía te muestra cómo aprenderlo paso a paso, qué se paga en el mercado y cómo diferenciarte.

<!-- CTA-TOP -->

##### Por qué Power BI en Argentina

Argentina tiene un ecosistema tecnológico fuerte —empresas de software, fintech, servicios exportados— y una economía donde los precios cambian rápido. Las áreas de finanzas, comercial y operaciones necesitan ver números actualizados y comparables, y no pueden esperar al cierre de mes en Excel. A eso se suma la demanda de servicios para el exterior: muchos analistas trabajan para empresas de otros países, donde Power BI aparece como requisito habitual.

##### Cuánto gana un analista de datos o BI en Argentina (referencia)

La fuente más sólida para tecnología en Argentina es la **Encuesta de Sueldos de Sysarmy** (comunidad de sistemas), que publica sus datos abiertos cada semestre. En la edición **2026.1** (marzo 2026), la mediana del sueldo **bruto mensual** de quienes trabajan como analistas de datos o de BI fue:

- **Junior: $1.785.000**
- **Semi-senior: $2.557.772**
- **Senior: $3.382.000**

Cálculo del Instituto IEA sobre los datos abiertos de Sysarmy: [institutoiea.edu.ar — qué hace un analista de datos y cuánto gana](https://institutoiea.edu.ar/publicaciones/que-hace-un-analista-de-datos-y-cuanto-gana). Datos originales: [sysarmy.com](https://sysarmy.com/).

Ojo con dos cosas: son sueldos de quienes respondieron la encuesta (mayoría del sector tecnológico) y, con la inflación, una cifra de marzo pierde vigencia rápido. Usala como orden de magnitud, no como número exacto.

##### Dónde buscar laburo con Power BI en Argentina

- **Bumeran** y **ZonaJobs**: los portales con más avisos locales.
- **LinkedIn Empleos**: empresas grandes y posiciones remotas para el exterior.
- **Computrabajo Argentina**: avisos de pymes y del interior.
- **GetOnBoard**: avisos tech con rango salarial visible.
- **Bolsa de ProgramBI** (`/ar/empleos`).

Tip: en los avisos remotos para el exterior, además de Power BI te van a pedir inglés y SQL. Si apuntás ahí, el proyecto de portafolio conviene hacerlo con nombres de columnas y textos en inglés.

##### Industrias donde más se usa

- **Fintech y banca**: originación, mora, uso de billeteras.
- **Retail y consumo masivo**: precios, márgenes y rotación en un contexto inflacionario.
- **Agro y agroindustria**: rindes por lote y campaña, logística de cosecha, precios de granos.
- **Software y servicios**: horas facturadas, rentabilidad por cliente.
- **Energía**: producción y costos (por ejemplo, Vaca Muerta y su cadena de proveedores).

##### Ruta de aprendizaje en 8 semanas

1. **Semanas 1–2 · Power Query.** Importá extractos y reportes, combiná archivos de varios meses y limpiá montos con separadores de miles.
2. **Semana 3 · Modelo estrella** con una **tabla de índices**: calendario mensual con IPC y, si lo necesitás, tipo de cambio.
3. **Semanas 4–5 · DAX.** CALCULATE, FILTER, DIVIDE, SUMX y RELATED.
4. **Semana 6 · Tiempo y moneda constante.** Interanual nominal versus real.
5. **Semana 7 · Diseño.** Un tablero que muestre nominal y real lado a lado, sin confundir.
6. **Semana 8 · Proyecto.** Un caso con datos públicos (por ejemplo, IPC del INDEC y datos abiertos de datos.gob.ar).

<!-- CTA-MID --> — Descargá la plantilla de dashboard de ventas en pesos argentinos.

##### Funciones clave, con ejemplos argentinos

Una cadena con locales en CABA, Córdoba, Rosario y Mendoza, que vende en ARS:

- `Ventas = SUM(Ventas[Importe_ARS])`
- `Ventas Córdoba = CALCULATE([Ventas], Local[Ciudad] = "Córdoba")`
- **Ventas en moneda constante** (a precios del último mes), con una tabla `IPC` relacionada al calendario mensual:
  `Ventas reales = SUMX(VALUES(Calendario[Mes]), [Ventas] * DIVIDE(MAX(IPC[Indice_ultimo]), MAX(IPC[Indice])))`
- `Var. interanual nominal % = DIVIDE([Ventas] - CALCULATE([Ventas], SAMEPERIODLASTYEAR(Calendario[Fecha])), CALCULATE([Ventas], SAMEPERIODLASTYEAR(Calendario[Fecha])))`
- Lo mismo con `[Ventas reales]` te da la **variación real**: es la que importa para decidir.
- `Ranking locales = RANKX(ALL(Local[Ciudad]), [Ventas reales])`

Cargá el IPC desde la serie oficial del INDEC (indec.gob.ar) en Power Query, para que se actualice solo cada mes.

##### Errores comunes

- **Comparar pesos de distintos meses sin ajustar.** Es el error número uno en Argentina.
- **Mezclar tipos de cambio** (oficial, MEP, etc.) sin aclarar cuál usás. Definilo con finanzas y escribilo en el tablero.
- **Montos como texto** por el punto de miles y la coma decimal.
- **Columnas calculadas en vez de medidas**, que agrandan el modelo.
- **No documentar las medidas.** Con tantas versiones (nominal, real, en USD), poné descripciones claras.

##### Tres casos reales de uso en empresas argentinas

**1. Retail en CABA: precios y margen con inflación.** Cuando los precios de lista cambian varias veces en el año, el margen se erosiona sin que nadie lo note. El tablero compara el costo de reposición con el precio vigente por producto.

`Margen reposición % = DIVIDE(SUMX(Ventas, Ventas[Cantidad] * (Ventas[Precio_unit] - RELATED(Producto[Costo_reposicion]))), SUMX(Ventas, Ventas[Cantidad] * Ventas[Precio_unit]))`

Un filtro de «últimos 30 días» y otro de «producto con aumento de costo» muestran dónde hay que actualizar el precio.

**2. Agro en Córdoba o Santa Fe: rindes por lote y campaña.** El productor o el acopio quiere ver quintales por hectárea por lote, comparados con la campaña anterior.
`Rinde qq/ha = DIVIDE(SUM(Cosecha[Kg]) / 100, SUM(Lote[Hectareas]))`
`Rinde campaña anterior = CALCULATE([Rinde qq/ha], Campaña[Nombre] = "2024/25")` (o, mejor, con una columna de índice de campaña y `Campaña[Indice] = MAX(Campaña[Indice]) - 1`).

**3. Fintech en Buenos Aires: cohortes de clientes.** ¿Qué porcentaje de los clientes que abrieron cuenta en marzo sigue activo tres meses después?
`Activos en mes N = CALCULATE(DISTINCTCOUNT(Movimientos[ID_Cliente]), FILTER(Movimientos, Movimientos[Meses_desde_alta] = SELECTEDVALUE(MesN[N])))`
dividido por el tamaño de la cohorte. Es un análisis que en Excel lleva horas y en Power BI se actualiza solo.

##### Certificación PL-300 desde Argentina

La certificación oficial es **Power BI Data Analyst Associate** (examen **PL-300**). Microsoft cobra en dólares con precio según país; el valor exacto aparece al registrarte en la [página oficial](https://learn.microsoft.com/es-es/credentials/certifications/data-analyst-associate/). Tené en cuenta que, al ser un pago en el exterior, tu banco puede sumar percepciones e impuestos. Si apuntás a posiciones remotas para el exterior, la certificación ayuda a pasar los primeros filtros.

##### Comunidad para seguir aprendiendo

Argentina tiene una comunidad de datos muy activa. Buscá en Meetup y LinkedIn grupos de «Power BI Argentina» o de datos en Buenos Aires, Córdoba y Rosario, y revisá el foro oficial de Microsoft Fabric y Power BI (community.fabric.microsoft.com), que tiene sección en español.

##### ¿Aprender solo o en un curso en vivo?

Solo se puede, y en Argentina hay una comunidad tech muy activa. El tema es que la parte que más vale —modelo y DAX— es la que más cuesta sin alguien que te corrija. En un curso en vivo preguntás en el momento, avanzás con fechas fijas y terminás un proyecto que podés mostrar.

##### El curso Power BI en vivo de ProgramBI (versión Argentina)

- **En vivo por Zoom**, lunes y miércoles de **19:30 a 21:30, hora de Argentina**.
- **20 horas, 8 módulos**, básico-intermedio. Nuevas cohortes todos los meses; consultá la próxima fecha en la ficha del curso.
- Aranceles actualizados en ARS disponibles en el PDF del [curso de Power BI en Argentina](/ar/cursos/power-bi).
- Temario: Power Query y M, modelo estrella, CALCULATE y FILTER, Time Intelligence, RANKX e iteradores (como SUMX), tabla de métricas con SWITCH e IA en Power BI.
- **Grabaciones de por vida** y **certificado**.
- Instructor: **Manuel Oliva**, Magíster en Data Science (UAI).
- Sumá base técnica con las [funciones DAX esenciales](/guias/funciones-dax-mas-importantes) o el programa de [Análisis de datos completo](/ar/cursos/analisis-de-datos).

<!-- CTA-END -->

##### Preguntas frecuentes

**¿A qué hora son las clases en Argentina?**
Lunes y miércoles de 19:30 a 21:30, hora de Argentina. Si no llegás, la clase queda grabada en el campus.

**¿Cómo pago desde Argentina?**
Con tarjeta internacional. Ves el precio en pesos argentinos y el cargo final lo define tu banco, incluidos los impuestos que aplique a compras en el exterior.

**¿Cómo ajusto por inflación en Power BI?**
Cargá el IPC mensual del INDEC como tabla, relacionalo con el calendario y multiplicá cada mes por el cociente entre el índice actual y el del mes. En el curso trabajamos los iteradores (SUMX) que lo hacen posible.

**¿Sirve Power BI para trabajar remoto para el exterior?**
Sí, es de las herramientas más pedidas en avisos de análisis de datos. Combinado con SQL e inglés, abre esas posiciones.

**¿Necesito saber programar?**
No. Power Query y DAX se aprenden sin experiencia previa en programación. SQL suma, pero no es requisito para empezar.

**¿Qué es mejor, aprender Power BI o Python?**
Para trabajar en reportería y BI, Power BI primero: el impacto es más rápido. Python es un buen segundo paso si querés ir hacia ciencia de datos.
