---
slug: curso-analisis-de-datos-uruguay
ruta_sugerida: /uy/guias/curso-analisis-de-datos-uruguay
pais: uy
hreflang: es-UY
curso: analisis-de-datos
url_curso: https://www.programbi.com/uy/cursos/analisis-de-datos
title: "Curso de Análisis de Datos Uruguay: guía 2026 | ProgramBI"
meta: "Curso de análisis de datos en Uruguay en vivo: SQL Server, Power BI y Python en 60 h, lunes y miércoles 19:30. Cómo ser analista de datos y referencia salarial."
h1: "Curso de Análisis de Datos en Uruguay: cómo llegar a analista de datos"
updated: 2026-11-04
sources:
  - https://www.programbi.com/uy/cursos/analisis-de-datos
  - https://www.programbi.com/uy/cursos/power-bi
  - https://www.programbi.com/uy/cursos/sql-server
  - https://www.programbi.com/uy/cursos/python
  - https://www.programbi.com/uy/cursos/excel
  - https://www.elpais.com.uy/informacion/servicios/mef-llama-a-concurso-para-analista-de-datos-con-salario-de-64-986-y-plazo-en-agosto-2026
nota_hermes: |
  ELEMENTO VISUAL: diagrama de la ruta (planilla → SQL → Power BI → Python → proyecto) + bloque «En 30 segundos».
  Intención: "curso análisis de datos uruguay" y "cómo ser analista de datos" → click_registro en /uy/cursos/analisis-de-datos. country=uy, course=analisis-de-datos.
  - PRECIO: {precio_local} = placeholder de config/pricing.ts (WS1), clave analisis-de-datos × uy. Monto sin definir por Manu: NO escribas cifras. Sin valor → "Consultá el valor por WhatsApp".
  - Voseo (es-UY). Primeros dos párrafos = respuesta citable.
  - Dato MEF/El País: verificado por Radar el 4 nov 2026; El País devuelve challenge de Cloudflare a bots, revalidá a mano antes de publicar.
  - Schema Article + FAQPage + BreadcrumbList, sin Course/Offer. WhatsApp: "Hola, vengo de la guía de Análisis de datos para Uruguay en programbi.com y quiero info del curso en vivo".
---

# Curso de Análisis de Datos en Uruguay: cómo llegar a analista de datos

**Respuesta corta:** el [curso de análisis de datos de ProgramBI para Uruguay](https://www.programbi.com/uy/cursos/analisis-de-datos) es en vivo por Zoom y su nivel básico-intermedio combina **SQL Server, Power BI y Python en 60 horas** (20 horas por herramienta). Las clases son **lunes y miércoles de 19:30 a 21:30, hora de Uruguay**, el próximo inicio es el **lunes 23 de noviembre de 2026** y el valor es **{precio_local}**. Incluye grabaciones de por vida y certificado.

**¿Qué hay que saber para ser analista de datos en Uruguay?** SQL para consultar bases, Power BI para armar modelos y tableros, Python para limpiar y explorar datos que en planilla se vuelven inmanejables, y un proyecto que muestre cómo pasás de un dato a una decisión. Es la combinación que aparece tanto en llamados públicos como en empresas que trabajan para el exterior.

**[CTA-TOP]** — Próxima clase en vivo: lunes 23 de noviembre de 2026 · 19:30 hora de Uruguay · «Ver el curso».

## Un mercado chico, muy medido

Uruguay tiene una industria de software y servicios globales fuerte, con zonas francas y equipos que reportan a clientes de otros países. Al lado conviven sectores tradicionales que viven de los números: frigoríficos y agro, forestal y celulosa, logística portuaria en Montevideo, banca y seguros. Y un Estado que publica datos abiertos y abre llamados para analistas.

En un mercado de este tamaño, una persona que sabe sacar, ordenar y explicar datos se vuelve visible rápido. Lo difícil no es la herramienta; es tener las tres juntas y saber contar el resultado.

## Cuánto se paga (referencia pública)

En Uruguay hay pocas fuentes privadas de sueldos con muestra suficiente, así que usamos un dato público: en 2026 el **Ministerio de Economía y Finanzas (MEF)** llamó a concurso para **Analista de datos e información**, con una remuneración nominal de **$64.986 por 40 horas semanales** (valores a enero de 2026), en Montevideo. [El País Uruguay — llamado MEF analista de datos](https://www.elpais.com.uy/informacion/servicios/mef-llama-a-concurso-para-analista-de-datos-con-salario-de-64-986-y-plazo-en-agosto-2026)

Es una referencia del sector público. En el privado, y en especial en empresas que exportan servicios, el rango varía mucho según experiencia e inglés.

## Qué aprender, y en qué orden

1. **Planilla bien usada.** Tablas, filtros y tablas dinámicas. Si te falta base, arrancá por el [curso de Excel](https://www.programbi.com/uy/cursos/excel).
2. **SQL.** Filtrar, agrupar y cruzar tablas. Te independiza de pedir exportaciones. Más en el [curso de SQL Server](https://www.programbi.com/uy/cursos/sql-server).
3. **Power BI.** Power Query, modelo estrella, tabla calendario y DAX. Mirá el [curso de Power BI](https://www.programbi.com/uy/cursos/power-bi) y la [guía de Power BI en Uruguay](/uy/guias/como-aprender-power-bi-en-uruguay).
4. **Python.** Pandas para volúmenes grandes y para trabajar con datos abiertos del Estado. Detalle en el [curso de Python](https://www.programbi.com/uy/cursos/python).
5. **Proyecto.** Una pregunta real, un tablero y una página que explique qué decidirías con eso.

Tip: las bases de los llamados de Uruguay Concursa detallan el temario evaluado. Son una checklist gratis de qué estudiar.

**[CTA-MID]** — Descargá gratis la plantilla de dashboard de ventas en pesos uruguayos.

## Ejemplo: exportaciones de un frigorífico

- **SQL** suma toneladas por destino y trimestre:
  `SELECT destino, trimestre, SUM(toneladas) AS t FROM embarques GROUP BY destino, trimestre;`
- **Power BI** compara contra el mismo trimestre del año anterior:
  `Toneladas AA = CALCULATE([Toneladas], SAMEPERIODLASTYEAR(Calendario[Fecha]))`
- **Python** cruza esos embarques con un archivo de datos abiertos descargado en CSV:
  `df = embarques.merge(pd.read_csv("abiertos.csv"), on="destino", how="left")`

El área comercial ve qué mercado crece y cuál se está enfriando, sin esperar el informe trimestral.

## Dónde buscar laburo

- **BuscoJobs** y **Gallito Trabajo**: los portales locales con más avisos.
- **LinkedIn Empleos**: software, consultoras y posiciones remotas.
- **Uruguay Concursa** (uruguayconcursa.gub.uy): llamados del Estado, incluidos los de analista de datos.

Si apuntás a empresas que trabajan para afuera, armá el portafolio en inglés: nombres de columnas, títulos y la explicación final.

## ¿Cuánto tiempo lleva?

Con cinco o seis horas por semana, en un mes manejás SQL básico y al segundo tenés un primer tablero en Power BI que podés mostrar. Python lleva algunas semanas más. El atajo es practicar con un problema de tu propio trabajo: si cada ejercicio responde algo que tu jefe ya te pidió, el aprendizaje se fija y, de paso, empezás a demostrar valor antes de terminar.

## Errores comunes

- **Aprender herramientas sueltas.** El valor está en el ciclo completo: extraer, modelar, explicar.
- **No documentar.** En un mercado chico te recomiendan por cómo trabajás; un proyecto prolijo habla por vos.
- **Tableros con todo.** Una página por pregunta.
- **Postergar SQL.** Es lo primero que te van a evaluar.

## Sectores donde más se usa

- **Software y servicios globales**: horas, proyectos y rentabilidad por cliente.
- **Agro, frigoríficos y forestal**: faena, exportaciones por destino y rendimiento.
- **Logística y puerto**: movimientos, tiempos de operación y ocupación.
- **Banca y seguros**: cartera, siniestralidad y metas comerciales.
- **Sector público**: indicadores de gestión y datos abiertos.

Si venís de alguno de estos rubros, conocer el negocio te da ventaja sobre alguien que solo sabe la herramienta. En forestal, por ejemplo, entender cómo se mide el rendimiento por predio hace que tu tablero tenga sentido para quien decide; en seguros, saber qué es la siniestralidad te ahorra semanas de preguntas.

## Cómo elegir un curso de análisis de datos en Uruguay

La oferta local es más acotada que en mercados grandes, y muchas opciones son grabadas o pensadas para otro país. Antes de anotarte, chequeá:

- **Que incluya SQL, Power BI y Python.** Así no tenés que armar tu propio programa con tres cursos distintos.
- **Que el horario sea de acá.** De 19:30 a 21:30 hora de Uruguay podés conectarte a la salida del trabajo.
- **Que sea en vivo.** Poder preguntar en el momento ahorra horas de frustración.
- **Que termine en un proyecto.** Es tu carta de presentación en llamados y entrevistas.
- **Que las clases queden grabadas.** Para repasar antes de un examen de llamado o una entrevista técnica.

## Cómo preparar un llamado público de analista de datos

Los concursos del Estado uruguayo suelen tener etapas de méritos, prueba y entrevista. Para la prueba, en general te conviene:

1. **Leer las bases con lupa**: ahí está el temario evaluado y el peso de cada etapa.
2. **Practicar con datos abiertos**: el catálogo del Estado ofrece conjuntos reales para armar un caso.
3. **Llevar un proyecto documentado**: qué pregunta respondiste, con qué datos y qué recomendarías.
4. **Preparar la explicación**: en la entrevista importa tanto el razonamiento como la herramienta.

Ese mismo proyecto sirve para postularte en empresas privadas: cambiá el enfoque y destacá el impacto en el negocio.

## El curso en vivo de ProgramBI (Uruguay)

Datos de la [ficha del curso para Uruguay](https://www.programbi.com/uy/cursos/analisis-de-datos), revisada el 4 de noviembre de 2026:

- **En vivo por Zoom**, lunes y miércoles de **19:30 a 21:30**, hora de Uruguay.
- **60 horas** en el básico-intermedio: Power BI (tableros y DAX inicial), SQL Server (consultas y agregaciones) y Python (Pandas y visualización).
- Temario: SQL desde cero, modelado y DAX, análisis exploratorio, dashboards y reportes automáticos, ETL con Power Query, proyecto final con datos reales, IA como apoyo en cada módulo.
- **Nivel avanzado** de 60 horas más: automatización, inteligencia de tiempo y modelos.
- **Grabaciones de por vida** y **certificado** al completar.
- Inicio: **lunes 23 de noviembre de 2026**. Valor: **{precio_local}**.
- Instructor: **Manuel Oliva**, Magíster en Data Science (UAI).

**Formas de pago:** los cursos de ProgramBI se pueden pagar en 3 cuotas sin interés, en todos los países.

**[CTA-END]** — {precio_local} · lunes y miércoles 19:30–21:30 hora de Uruguay · «Inscribirme» · «Hablar por WhatsApp».

## Preguntas frecuentes

**¿Cuánto cuesta el curso de análisis de datos en Uruguay?**
El nivel básico-intermedio de 60 horas cuesta {precio_local}, con grabaciones de por vida y certificado.

**¿Qué horario tiene?**
Lunes y miércoles de 19:30 a 21:30, hora de Uruguay, en vivo por Zoom.

**¿Tengo que saber programar?**
No. SQL y Python se enseñan desde cero; alcanza con manejar planillas.

**¿Cuál elijo: Power BI o análisis de datos?**
Si solo necesitás tableros, Power BI. Si querés el perfil completo de analista, análisis de datos suma SQL Server y Python.

**¿Puedo recuperar una clase?**
Sí, todas quedan grabadas con acceso de por vida.

**¿Recibo certificado?**
Sí, un certificado digital de ProgramBI al terminar.

**¿Me sirve para preparar un llamado público?**
Sí. SQL, Power BI y Python suelen aparecer en las bases de llamados de analista de datos; revisá siempre el temario específico de cada llamado.

**¿Recibo un certificado al terminar?**
Sí. Al terminar el curso recibes un certificado de ProgramBI. Puedes sumarlo a tu CV junto con el proyecto final del curso.

**¿Puedo pagar en cuotas?**
Sí. El curso se puede pagar en 3 cuotas sin interés. Escribe por WhatsApp para confirmar el valor vigente, las fechas de inicio y los medios de pago disponibles en tu país.
