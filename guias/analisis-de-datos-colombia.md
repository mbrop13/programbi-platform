---
slug: curso-analisis-de-datos-colombia
ruta_sugerida: /co/guias/curso-analisis-de-datos-colombia
pais: co
hreflang: es-CO
curso: analisis-de-datos
url_curso: https://www.programbi.com/co/cursos/analisis-de-datos
title: "Curso de Análisis de Datos Colombia: guía 2026 | ProgramBI"
meta: "Curso de análisis de datos en Colombia en vivo: SQL Server, Power BI y Python en 60 h, lunes y miércoles 17:30. Cómo ser analista de datos y sueldos."
h1: "Curso de Análisis de Datos en Colombia: cómo volverse analista de datos"
updated: 2026-11-04
sources:
  - https://www.programbi.com/co/cursos/analisis-de-datos
  - https://www.programbi.com/co/cursos/power-bi
  - https://www.programbi.com/co/cursos/sql-server
  - https://www.programbi.com/co/cursos/python
  - https://www.programbi.com/co/cursos/excel
  - https://co.computrabajo.com/salarios/analista-de-datos
nota_hermes: |
  ELEMENTO VISUAL: tabla comparativa «Curso de Power BI vs. curso de Análisis de datos» (horas, herramientas, para quién) + bloque «En 30 segundos».
  Intención: "curso análisis de datos colombia" y "cómo ser analista de datos" → click_registro en /co/cursos/analisis-de-datos. country=co, course=analisis-de-datos.
  - PRECIO: {precio_local} = placeholder leído de config/pricing.ts (WS1), clave analisis-de-datos × co. Manu aún no define el monto: NO escribas cifras en duro. Sin valor en config → "Consulta el valor por WhatsApp".
  - Primeros dos párrafos = respuesta citable (GEO).
  - Dato Computrabajo verificado por Radar el 4 nov 2026; el sitio bloquea bots (403): revalida a mano antes de publicar.
  - Schema Article + FAQPage + BreadcrumbList, sin Course/Offer. CTAs §2.5. WhatsApp: "Hola, vengo de la guía de Análisis de datos para Colombia en programbi.com y quiero info del curso en vivo".
  - Texto propio; no reutilizar bloques de otras guías (shingles < 30 %).
---

# Curso de Análisis de Datos en Colombia: cómo volverse analista de datos

**Respuesta corta:** el [curso de análisis de datos de ProgramBI en Colombia](https://www.programbi.com/co/cursos/analisis-de-datos) se dicta en vivo por Zoom y, en su nivel básico-intermedio, reúne **SQL Server, Power BI y Python en 60 horas** (20 por herramienta). Las clases son **lunes y miércoles de 17:30 a 19:30, hora de Colombia**, arranca el **lunes 23 de noviembre de 2026** y su valor es **{precio_local}**. Trae grabaciones de por vida y certificado.

**¿Qué se necesita para ser analista de datos en Colombia?** Saber pedirle datos a una base con SQL, transformarlos en un tablero confiable con Power BI, apoyarte en Python cuando el volumen o el desorden superan a Excel y, sobre todo, poder explicarle el resultado a alguien del negocio. Eso, más un proyecto que puedas mostrar, es lo que filtran los reclutadores.

**[CTA-TOP]** — Próxima clase en vivo: lunes 23 de noviembre de 2026 · 17:30 hora de Colombia · «Ver el curso».

## El contexto colombiano: muchos datos, poco tiempo

Bancos y aseguradoras en Bogotá y Medellín, EPS e IPS que gestionan autorizaciones y glosas, operadores logísticos en Barranquilla y Cartagena, y una industria grande de BPO y centros de servicios compartidos que vive de cumplir SLA. Todos comparten un síntoma: el informe semanal depende de alguien que junta archivos y los cuadra a mano. Cuando esa persona sale a vacaciones, el informe no sale.

Un analista de datos convierte ese trabajo manual en un proceso: la consulta se ejecuta sola, el modelo calcula las métricas y el tablero queda listo para el comité.

## Las cuatro habilidades que de verdad te contratan

1. **SQL**: es la diferencia entre «le pido el archivo a sistemas» y «lo saco yo». Practica `JOIN` entre clientes y facturas. Para profundizar, el [curso de SQL Server](https://www.programbi.com/co/cursos/sql-server).
2. **Power BI**: Power Query, modelo estrella y DAX. Detalle en el [curso de Power BI](https://www.programbi.com/co/cursos/power-bi) y en la [guía de Power BI para Colombia](/co/guias/como-aprender-power-bi-en-colombia).
3. **Python**: Pandas para depurar bases grandes y cruzar fuentes; ideal para planos de facturación de salud o históricos de call center. Más en el [curso de Python](https://www.programbi.com/co/cursos/python).
4. **Comunicación con negocio**: una conclusión, tres cifras y una recomendación. Sin esto, lo anterior pierde valor.

Si todavía te enredas con tablas dinámicas, refuerza primero con el [curso de Excel](https://www.programbi.com/co/cursos/excel).

## Cuánto gana un analista de datos en Colombia (referencia)

- **Computrabajo Colombia**: sueldo medio de **$2.416.855 COP al mes** para «analista de datos», calculado con 7.156 salarios de los últimos 12 meses (consultado el 4 de noviembre de 2026). [co.computrabajo.com/salarios/analista-de-datos](https://co.computrabajo.com/salarios/analista-de-datos)

Esa media mezcla cargos de reportería básica con análisis avanzado. Las vacantes que piden SQL y Power BI juntos tienden a ubicarse arriba del promedio. Es una referencia que cambia mes a mes, no una promesa.

## Plan de 10 semanas, a tu ritmo

- **Semanas 1–3 · SQL.** `SELECT`, `WHERE`, `GROUP BY`, `JOIN`. Reto: facturación por ciudad y mes.
- **Semanas 4–6 · Power BI.** Limpieza en Power Query, tabla calendario, medidas con `CALCULATE`. Reto: tablero de cartera por oficina.
- **Semanas 7–8 · Python.** Pandas para unir y depurar. Reto: consolidar 12 archivos mensuales en uno.
- **Semanas 9–10 · Proyecto.** Una pregunta real, datos anonimizados, tablero final y una explicación de cinco minutos.

**[CTA-MID]** — Descarga gratis la plantilla de dashboard de ventas en pesos colombianos.

## Ejemplo: cartera de una cooperativa en Medellín

- **SQL** trae los saldos vencidos por oficina:
  `SELECT oficina, SUM(saldo_cop) AS vencido FROM cartera WHERE dias_mora > 30 GROUP BY oficina;`
- **Power BI** calcula el índice de mora sin romperse en oficinas nuevas:
  `Índice mora = DIVIDE([Cartera vencida], [Cartera total])`
- **Python** normaliza las cédulas que llegan con puntos y espacios:
  `df["cedula"] = df["cedula"].str.replace(r"\D", "", regex=True)`

El resultado: el comité de crédito ve qué oficina se está deteriorando antes del cierre, no después.

## Dónde buscar empleo de analista de datos en Colombia

- **Computrabajo** y **elempleo.com**: los portales con más volumen local.
- **Magneto Empleos**: muy usado por empresas grandes y cajas de compensación.
- **LinkedIn Empleos**: multinacionales y trabajo remoto para el exterior.
- **Servicio Público de Empleo** (serviciodeempleo.gov.co): vacantes registradas oficialmente.

Consejo: en tu hoja de vida escribe las herramientas con su detalle («SQL Server: consultas y JOIN; Power BI: modelado y DAX; Python: Pandas»). Los filtros de los portales buscan esas palabras exactas.

## Errores frecuentes

- **Aprender herramientas sin un caso.** Sin pregunta de negocio, el aprendizaje no se fija.
- **Saltarse la limpieza.** En Colombia es común recibir bases con nombres de ciudad escritos de cinco maneras; eso se arregla antes de analizar.
- **Tableros sobrecargados.** Si el gerente tiene que preguntar qué mira, el tablero falló.
- **No practicar la explicación.** En la entrevista te van a pedir que cuentes un hallazgo, no que enseñes fórmulas.

## Sectores donde más se contrata

- **Banca y seguros**: colocación, cartera, mora y metas por oficina.
- **Salud**: autorizaciones, glosas y tiempos de atención en EPS e IPS.
- **BPO y servicios compartidos**: SLA, productividad por agente y ausentismo.
- **Logística y puertos**: tiempos de despacho y ocupación de bodegas.
- **Retail y consumo masivo**: rotación de inventario y ventas por canal.

## Cómo elegir bien tu curso

Hay muchas opciones en Colombia, desde programas universitarios largos hasta videos sueltos. Para decidir, compara:

- **¿Cubre SQL, Power BI y Python?** Si falta uno, vas a tener que buscar otro curso después.
- **¿Es en vivo y en tu horario?** Un horario de 17:30 a 19:30 hora de Colombia te deja salir del trabajo y conectarte; revisa que el curso no esté pensado para otra zona horaria.
- **¿Hay proyecto final?** Lo que vas a mostrar en la entrevista es un caso resuelto, no un diploma.
- **¿Puedes repetir las clases?** Entre el trancón y los cierres, vas a faltar a alguna; las grabaciones lo resuelven.
- **¿Quién enseña?** Busca a alguien que haya aplicado estas herramientas en empresas, no solo en ejemplos de libro.

## Cómo armar un portafolio que convenza en Colombia

Los reclutadores de banca, salud y BPO revisan muchos perfiles. Destaca con un proyecto corto y claro:

1. **Un sector que conozcas**: si vienes de salud, usa autorizaciones o glosas; si vienes de un call center, tiempos de atención y SLA.
2. **Datos anonimizados**: nunca subas cédulas ni nombres reales.
3. **Un tablero de una página** con la métrica principal, la tendencia y el detalle por ciudad.
4. **Tres conclusiones** escritas en lenguaje de negocio.

Publícalo en LinkedIn con una explicación breve. Es la mejor manera de que un reclutador vea cómo piensas antes de la entrevista.

## El curso en vivo de ProgramBI (versión Colombia)

Según la [ficha del curso para Colombia](https://www.programbi.com/co/cursos/analisis-de-datos), revisada el 4 de noviembre de 2026:

- **En vivo por Zoom**, lunes y miércoles de **17:30 a 19:30**, hora de Colombia.
- **60 horas** en el nivel básico-intermedio, en tres módulos de 20 horas: Power BI, SQL Server y Python.
- Contenido: consultas SQL desde cero, modelado y DAX, análisis exploratorio con Pandas, dashboards y reportes automáticos, ETL con Power Query y conexión a bases de datos, proyecto final con datos reales, con IA como apoyo en cada módulo.
- **Nivel avanzado** de 60 horas más (automatización, inteligencia de tiempo y modelos).
- **Grabaciones de por vida** y **certificado** al completar.
- Inicio: **lunes 23 de noviembre de 2026**. Valor: **{precio_local}**.
- Instructor: **Manuel Oliva**, Magíster en Data Science (UAI).

**Formas de pago:** los cursos de ProgramBI se pueden pagar en 3 cuotas sin interés, en todos los países.

**[CTA-END]** — {precio_local} · lunes y miércoles 17:30–19:30 hora de Colombia · «Inscribirme» · «Hablar por WhatsApp».

## Preguntas frecuentes

**¿Cuánto vale el curso de análisis de datos en Colombia?**
El nivel básico-intermedio de 60 horas tiene un valor de {precio_local}, con grabaciones de por vida y certificado.

**¿En qué horario son las clases?**
Lunes y miércoles de 17:30 a 19:30, hora de Colombia, en vivo por Zoom.

**¿Sirve si vengo de un área no técnica?**
Sí. Está pensado para perfiles administrativos, financieros y comerciales; SQL y Python se enseñan desde cero.

**¿En qué se diferencia del curso de Power BI?**
El de Power BI cubre solo tableros y DAX. El de análisis de datos agrega SQL Server y Python para hacer el ciclo completo del dato.

**¿Puedo ver las clases después?**
Sí. Todas quedan grabadas en el campus con acceso de por vida.

**¿Dan certificado?**
Sí, un certificado digital de ProgramBI al finalizar.

**¿Me sirve si trabajo en salud o en un BPO?**
Sí. Los ejemplos del curso son genéricos de negocio, y lo que aprendes —extraer, modelar y presentar— aplica igual a autorizaciones, glosas o SLA de un call center.
