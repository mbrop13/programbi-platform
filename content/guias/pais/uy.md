---
title: Cómo aprender Power BI en Uruguay: guía 2026 | ProgramBI
description: Qué pide el mercado uruguayo, un sueldo público de analista de datos, ruta de 8 semanas y DAX con ejemplos en pesos y UI. Para Montevideo y el interior.
h1: Cómo aprender Power BI en Uruguay: ruta práctica para analistas
country: uy
lang: es-UY
slug: como-aprender-power-bi-en-uruguay
path: /uy/guias/como-aprender-power-bi-en-uruguay
updated: 2026-11-04
course: power-bi
url_curso: https://www.programbi.com/uy/cursos/power-bi
sources:
  - https://www.elpais.com.uy/informacion/servicios/mef-llama-a-concurso-para-analista-de-datos-con-salario-de-64-986-y-plazo-en-agosto-2026
  - https://learn.microsoft.com/es-es/credentials/certifications/data-analyst-associate/
  - https://www.programbi.com/uy/cursos/power-bi
nota_hermes: |
  ELEMENTO VISUAL: ruta de aprendizaje de 8 semanas en Power BI para analistas en Uruguay.
---
Uruguay es un país chico con una industria de software y servicios que exporta al mundo, y eso se nota en el mercado de trabajo: las empresas valoran a quien sabe ordenar datos y presentarlos con claridad, sea para un cliente en Estados Unidos o para la gerencia de una empresa en Montevideo. Si hoy armás reportes en Excel y querés dar el siguiente paso, Power BI es la herramienta más directa. Esta guía te muestra cómo aprenderla con orden, con ejemplos pensados para la realidad uruguaya.

<!-- CTA-TOP -->

##### Por qué Power BI en Uruguay

Tres rasgos del mercado uruguayo lo explican. Primero, el peso de la industria de software y servicios globales, con zonas francas y empresas que trabajan para el exterior, donde los tableros son parte del día a día. Segundo, sectores tradicionales muy medidos: agro y frigoríficos, forestal y celulosa, logística portuaria, banca y seguros. Tercero, un Estado que publica muchos datos abiertos y contrata analistas. En todos, Power BI conecta lo que ya existe (Excel, bases de datos, sistemas de gestión) y lo convierte en un tablero que se actualiza solo.

##### Cuánto se paga (referencia pública)

En Uruguay hay pocas fuentes de sueldos privadas con muestra suficiente, así que preferimos un dato público y verificable: en 2026, el **Ministerio de Economía y Finanzas (MEF)** abrió un llamado (postulaciones hasta el 8 de setiembre) para **Analista de datos e información** en la Dirección General de Secretaría, con una remuneración nominal de **$64.986 por 40 horas semanales** (valores a enero de 2026), sede en Montevideo. Pedía título en estadística o posgrado en ciencia de datos y un año de experiencia. [El País Uruguay — llamado MEF analista de datos](https://www.elpais.com.uy/informacion/servicios/mef-llama-a-concurso-para-analista-de-datos-con-salario-de-64-986-y-plazo-en-agosto-2026)

Es un punto de referencia del sector público; en el privado, y sobre todo en empresas que trabajan para el exterior, los rangos varían mucho según experiencia e inglés.

##### Dónde buscar laburo con Power BI en Uruguay

- **BuscoJobs** y **Gallito Trabajo**: los portales locales con más avisos.
- **LinkedIn Empleos**: empresas de software, consultoras y posiciones remotas.
- **Uruguay Concursa** (uruguayconcursa.gub.uy): llamados del Estado, incluidos los de analista de datos.
- **Bolsa de ProgramBI** (`/uy/empleos`).

Tip: en los llamados públicos se publican las bases con el temario evaluado. Son una muy buena guía de qué estudiar.

##### Industrias donde más se usa

- **Software y servicios globales**: horas, proyectos y rentabilidad por cliente.
- **Agro, frigoríficos y forestal**: faena, exportaciones por destino, rendimiento.
- **Logística y puerto**: movimientos, tiempos de operación, ocupación.
- **Banca y seguros**: cartera, siniestralidad, metas comerciales.
- **Sector público**: indicadores de gestión y datos abiertos.

##### Ruta de aprendizaje en 8 semanas

1. **Semanas 1–2 · Power Query.** Combiná archivos mensuales, limpiá montos con punto de miles y coma decimal.
2. **Semana 3 · Modelo estrella** con calendario y una tabla de **cotización de la UI** (unidad indexada) y del dólar.
3. **Semanas 4–5 · DAX.** CALCULATE, FILTER, DIVIDE, SUMX, RELATED.
4. **Semana 6 · Tiempo.** Interanual en pesos, en UI y en dólares.
5. **Semana 7 · Diseño.** Selector de moneda para que el usuario elija cómo ver las cifras.
6. **Semana 8 · Proyecto.** Un tablero con datos abiertos uruguayos (catalogodatos.gub.uy).

<!-- CTA-MID --> — Descargá la plantilla de dashboard de ventas en pesos uruguayos.

##### Funciones clave, con ejemplos uruguayos

Una empresa con locales en Montevideo, Maldonado y Salto, que vende en UYU:

- `Ventas = SUM(Ventas[Importe_UYU])`
- `Ventas Maldonado = CALCULATE([Ventas], Local[Departamento] = "Maldonado")`
- **Ventas en UI** (para comparar sin el efecto de la inflación), con una tabla diaria de cotización de la UI relacionada al calendario:
  `Ventas UI = SUMX(Ventas, Ventas[Importe_UYU] / RELATED(Cotizacion[UI]))`
- **Ventas en USD**: `Ventas USD = SUMX(Ventas, Ventas[Importe_UYU] / RELATED(Cotizacion[USD]))`
- **Selector de moneda** (tabla desconectada `Moneda` con valores UYU, UI, USD):
  `Ventas mostradas = SWITCH(SELECTEDVALUE(Moneda[Moneda], "UYU"), "UYU", [Ventas], "UI", [Ventas UI], "USD", [Ventas USD])`
- `Temporada alta Maldonado % = DIVIDE(CALCULATE([Ventas Maldonado], Calendario[Mes] IN {1, 2}), [Ventas Maldonado])`

La cotización de la UI la publica el INE y el dólar, el Banco Central del Uruguay; cargalas en Power Query para que se actualicen solas.

##### Errores comunes

- **Comparar pesos de años distintos sin ajustar.** Usá UI o dólares según lo que defina finanzas.
- **Usar la cotización mensual cuando el negocio factura con la diaria.**
- **Olvidar la estacionalidad** (verano en la costa, zafra en el agro) al comparar meses.
- **Columnas calculadas en vez de medidas.**
- **Publicar sin seguridad por filas** cuando cada sucursal solo debería ver lo suyo.

##### Tres casos reales de uso en empresas uruguayas

**1. Empresa de software en Montevideo: rentabilidad por cliente.** Las horas se cargan en una herramienta de seguimiento y la facturación sale en dólares. El tablero cruza ambas cosas.

`Horas facturables % = DIVIDE(CALCULATE(SUM(Horas[Horas]), Horas[Facturable] = TRUE()), SUM(Horas[Horas]))`
`Tarifa efectiva USD = DIVIDE(SUM(Facturacion[Monto_USD]), CALCULATE(SUM(Horas[Horas]), Horas[Facturable] = TRUE()))`

Ordenado por cliente, muestra qué cuentas se llevan horas que nadie cobra.

**2. Frigorífico o agro en el interior: faena y exportación por destino.** Se sigue el volumen por mercado (China, Estados Unidos, Unión Europea…) y el precio promedio por tonelada.
`Precio prom. USD/t = DIVIDE(SUM(Exportaciones[Monto_USD]), SUM(Exportaciones[Toneladas]))`
`Participación destino = DIVIDE(SUM(Exportaciones[Toneladas]), CALCULATE(SUM(Exportaciones[Toneladas]), ALL(Destino)))`

**3. Comercio en la costa: temporada.** En Maldonado y Rocha la venta de enero y febrero define el año. El tablero compara cada temporada con la anterior, en UI para quitar el efecto de los precios, con la medida `Ventas UI` de arriba y `SAMEPERIODLASTYEAR`.

##### Certificación PL-300 desde Uruguay

La certificación oficial es **Power BI Data Analyst Associate** (examen **PL-300**). Microsoft fija el precio según el país; lo ves al registrarte en la [página oficial](https://learn.microsoft.com/es-es/credentials/certifications/data-analyst-associate/). En empresas que trabajan para el exterior suele sumar, sobre todo combinada con inglés.

##### Comunidad para seguir aprendiendo

Revisá el foro oficial de Microsoft Fabric y Power BI (community.fabric.microsoft.com), con sección en español, y buscá en Meetup y LinkedIn grupos de datos o de Power BI en Montevideo con actividad reciente.

##### Un portafolio con datos uruguayos

El Catálogo de Datos Abiertos (catalogodatos.gub.uy) publica datos de movilidad, salud, educación y turismo. Un tablero de **turismo receptivo por temporada** o de **movilidad en Montevideo** es fácil de explicar en una entrevista y muestra todo el ciclo: datos, modelo, medidas y presentación.

Un detalle que suma en entrevistas en Uruguay: explicá por qué elegiste UI, pesos o dólares para cada indicador. Demuestra criterio de negocio, que es justo lo que separa a un analista de alguien que solo arma gráficos.

##### ¿Aprender solo o en un curso en vivo?

Si tenés tiempo y disciplina, podés avanzar solo con la documentación de Microsoft. Donde casi todos se traban es en DAX: con un instructor en vivo resolvés dudas al momento, avanzás con un calendario y terminás un proyecto. Y como el horario coincide con el de Montevideo, se hace sin trasnochar.

##### El curso Power BI en vivo de ProgramBI (versión Uruguay)

- **En vivo por Zoom**, lunes y miércoles de **19:30 a 21:30, hora de Uruguay**.
- **20 horas, 8 módulos**, básico-intermedio. Próximo inicio: **lunes 23 de noviembre de 2026**.
- Consultá el arancel vigente en UYU al abrir el temario PDF en el [curso de Power BI para Uruguay](/uy/cursos/power-bi).
- Temario: Power Query y M, modelo estrella, CALCULATE y FILTER, Time Intelligence, RANKX e iteradores, tabla de métricas con SWITCH (justo lo del selector de moneda) e IA en Power BI.
- **Grabaciones de por vida** y **certificado**.
- Instructor: **Manuel Oliva**, Magíster en Data Science (UAI).
- Podés reforzar medidas en el [manual de funciones DAX](/guias/funciones-dax-mas-importantes) o revisar el programa de [Análisis de datos completo](/uy/cursos/analisis-de-datos).

<!-- CTA-END -->

##### Preguntas frecuentes

**¿A qué hora son las clases en Uruguay?**
Lunes y miércoles de 19:30 a 21:30, hora de Uruguay. Quedan grabadas en el campus.

**¿Cómo pago desde Uruguay?**
Con tarjeta internacional. El precio se muestra en pesos uruguayos y el cargo final lo define tu banco.

**¿Cómo muestro cifras en UI en Power BI?**
Cargá la serie diaria de la UI del INE, relacionala con el calendario y dividí cada importe por la cotización del día con SUMX. Con un selector (SWITCH) el usuario elige pesos, UI o dólares.

**¿Sirve Power BI para trabajar en empresas que exportan servicios?**
Sí. Es una de las herramientas más pedidas en análisis de datos. Sumado a SQL e inglés, te abre esas posiciones.

**¿Sirve el certificado para un llamado público?**
El certificado de ProgramBI acredita horas y temario. Cada llamado define qué méritos valora; revisá las bases en Uruguay Concursa.

**¿Necesito Excel avanzado para empezar?**
No. Con un manejo intermedio (tablas, filtros, tablas dinámicas) alcanza. Power Query reemplaza buena parte del trabajo manual.
