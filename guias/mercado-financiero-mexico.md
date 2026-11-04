---
slug: curso-mercado-financiero-mexico
ruta_sugerida: /mx/guias/curso-mercado-financiero-mexico
pais: mx
hreflang: es-MX
curso: mercado-financiero
url_curso: https://www.programbi.com/mx/cursos/mercado-financiero
title: "Curso de Mercado Financiero en México: guía 2026 | ProgramBI"
meta: "Curso de mercado financiero en México en vivo: carteras con Python, SQL, Power BI e IA en 30 h, 16:30 CDMX. Riesgo, retorno, tipo de cambio Banxico y dashboards."
h1: "Curso de Mercado Financiero en México: carteras, riesgo y datos con IA"
updated: 2026-11-04
sources:
  - https://www.programbi.com/mx/cursos/mercado-financiero
  - https://www.banxico.org.mx/
  - https://www.gob.mx/cnbv
  - https://www.bmv.com.mx/
nota_hermes: |
  ELEMENTO VISUAL: bloque «En 30 segundos» + tabla comparativa «planilla manual vs. flujo automatizado» (tiempo, errores, trazabilidad).
  Intención: "curso mercado financiero México", "curso análisis de carteras / finanzas con Python México" → click_registro en /mx/cursos/mercado-financiero. country=mx, course=mercado-financiero.
  - PRECIO: {precio_local} = placeholder de config/pricing.ts (WS1), clave mercado-financiero × mx. Manu aún no define el monto: NO escribas cifras. Sin valor → "Consulta el valor por WhatsApp".
  - FECHA: la ficha dice «Cupos abiertos — consulta fecha» y días/horario «Por confirmar»; el horario 16:30 a 18:30, hora del centro de México sale de sus preguntas frecuentes. No publicar fecha hasta que la ficha la confirme.
  - Instituciones citadas solo por nombre y enlace oficial (sin cifras). Tickers de ejemplo ilustrativos, sin precios.
  - Primeros dos párrafos = respuesta citable (GEO). Schema Article + FAQPage + BreadcrumbList, sin Course/Offer.
  - WhatsApp: "Hola, vengo de la guía de Mercado financiero para México en programbi.com y quiero info del curso en vivo".
---

# Curso de Mercado Financiero en México: carteras, riesgo y datos con IA

**Respuesta corta:** el [curso de Mercado financiero de ProgramBI para México](https://www.programbi.com/mx/cursos/mercado-financiero) es un programa **en vivo por Zoom de 30 horas en 5 módulos** para analizar, valorizar, monitorear y reportar carteras de inversión con **Python, SQL, Power BI e Inteligencia Artificial**. Las clases son de **16:30 a 18:30, hora del centro de México**, el valor es **{precio_local}** y la próxima cohorte tiene cupos abiertos (la fecha se confirma en la ficha). Se entregan datasets, scripts base, plantillas de Power BI y prompts de IA, y cierra con un Trabajo Aplicado Integrador.

**¿A quién apunta?** La ficha lo dirige a profesionales financieros y contables. Encaja si pasas horas actualizando planillas de inversiones y quieres que ese trabajo corra solo.

**[CTA-TOP]** — Cupos abiertos · 16:30 a 18:30, hora del centro de México · «Ver el curso».

## Por qué este curso tiene sentido en México

En México, la gestión de inversiones pasa por casas de bolsa, operadoras de fondos, bancos, aseguradoras y tesorerías corporativas que manejan posiciones en pesos y dólares. En muchas de ellas, el reporte diario de posición todavía se arma en Excel: se descargan precios, se actualiza el tipo de cambio, se recalculan rendimientos y se copia todo a una presentación. Con carteras que combinan emisoras locales, ETF extranjeros y deuda, ese proceso manual es lento y propenso a errores.

El curso te enseña a reemplazarlo por un flujo reproducible: datos que se actualizan solos, métricas de riesgo estándar y un tablero que explica el desempeño con ayuda de IA.

## Fuentes e instituciones clave

- **Banco de México** ([banxico.org.mx](https://www.banxico.org.mx/)): publica tipos de cambio y series económicas que puedes consultar para valorizar posiciones en dólares.
- **Comisión Nacional Bancaria y de Valores** ([gob.mx/cnbv](https://www.gob.mx/cnbv)): el supervisor del sistema financiero.
- **Bolsa Mexicana de Valores** ([bmv.com.mx](https://www.bmv.com.mx/)): información del mercado de capitales local.

Documentar la fuente de cada serie te ahorra discusiones en el comité y facilita las auditorías.

## Lo que cubre el programa

Las 30 horas se reparten en cinco bloques. Los primeros cuatro horas sientan las bases: entorno técnico, tipos de datos financieros y cómo se organiza una cartera. Le siguen cinco horas de **SQL**, donde modelas carteras, posiciones y operaciones y construyes vistas de exposición con funciones de ventana. El bloque más largo, ocho horas, es **Python**: descarga de precios con yfinance, tipos de cambio de bancos centrales, retornos, volatilidad, VaR, drawdown, beta, correlaciones, rebalanceo y usos de IA para detectar anomalías. Luego vienen siete horas de **Power BI**, con DAX aplicado a finanzas, P&L, mapas de calor y narrativa automática. Las últimas seis horas son para el **Trabajo Aplicado Integrador**, requisito de la certificación.

## Un ejemplo de código como los del curso

```python
import yfinance as yf

# Emisoras mexicanas en Yahoo Finance llevan el sufijo .MX
tickers = ["WALMEX.MX", "GMEXICOB.MX", "AMXB.MX"]
precios = yf.download(tickers, start="2025-01-01")["Close"]
retornos = precios.pct_change().dropna()
drawdown = precios / precios.cummax() - 1
```

Con el tipo de cambio de Banxico conviertes posiciones en dólares a pesos y, desde SQL, Power BI arma la vista de exposición por moneda y sector.

**[CTA-MID]** — Descarga gratis la plantilla de dashboard de ventas.

## Caso: el informe de cartera que se arma solo

Un analista de una operadora de fondos en CDMX prepara el reporte semanal de desempeño contra benchmark para tres fondos. Antes le tomaba una tarde: descargar precios, cruzar posiciones, calcular rendimientos y armar gráficas. Con el flujo del curso, Python baja precios y tipo de cambio, SQL guarda posiciones y operaciones, y Power BI muestra rendimiento vs. benchmark, volatilidad y concentración por emisora. La narrativa automática resume los movimientos principales y el analista se concentra en explicar las decisiones al comité.

## Riesgo y rendimiento en lenguaje de comité

En una operadora o casa de bolsa en México, el comité pide respuestas rápidas: ¿cómo vamos contra el benchmark?, ¿cuánto riesgo tomamos?, ¿qué tan concentrados estamos? El curso convierte cada pregunta en una métrica que se recalcula sola. El **rendimiento contra benchmark** se grafica en Power BI con medidas DAX. La **volatilidad** y el **VaR** cuantifican el riesgo de mercado. El **drawdown** muestra la peor caída del periodo y la **beta** relaciona cada emisora con el índice de referencia que tú elijas. Las **correlaciones** revelan si dos posiciones en realidad son la misma apuesta.

Con estas métricas dentro del modelo, preparar el comité deja de ser una carrera contra el reloj y pasa a ser una revisión de lo que el tablero ya muestra.

## Lo que suele fallar en un reporte manual

- **Tipo de cambio desactualizado**: se valoriza con el de ayer y el resultado no cuadra con el custodio.
- **Emisoras con series distintas** (una ajustada por dividendos, otra no) mezcladas en el mismo cálculo.
- **Fórmulas rotas** al agregar una emisora nueva a la hoja.
- **Benchmarks elegidos al azar**: el curso enseña a fijar uno y medir siempre contra él.
- **Gráficas estáticas** que nadie puede filtrar por fondo, sector o moneda.

Cada uno de estos errores desaparece cuando los datos viven en SQL y el cálculo está en código versionado.

## Dónde se usa esto en México

En OCC Mundial, LinkedIn y los portales de carrera de casas de bolsa, bancos y aseguradoras aparecen vacantes de analista de inversiones, analista de riesgos de mercado, analista de tesorería, analista de portafolios y analista financiero. Es común que pidan Excel avanzado y, cada vez más, Python, SQL o Power BI.

## Ruta de 4 semanas para llevarlo a tu chamba diaria

1. Elige el reporte semanal más pesado de tu área.
2. Modela posiciones, operaciones y precios en SQL Server, como en el módulo 2.
3. Programa en Python la descarga de precios de Yahoo Finance y del tipo de cambio, y calcula métricas de riesgo.
4. Conecta Power BI, crea medidas DAX de rendimiento y agrega la narrativa con IA.

Si ese reporte es tu Trabajo Aplicado Integrador, terminas el curso con un entregable que tu jefe puede usar desde la semana siguiente.

## La IA como copiloto del analista

En el programa, la IA aparece en todos los módulos, siempre como apoyo. En una casa de bolsa o una operadora mexicana, eso se traduce en tareas concretas: revisar series de precios y marcar saltos sospechosos antes de valorizar; sugerir agrupaciones de emisoras por comportamiento para cuestionar la diversificación; generar consultas SQL a partir de una pregunta en lenguaje natural; y escribir un borrador del comentario semanal con los principales movimientos contra el benchmark.

El analista sigue siendo responsable del resultado. El curso enseña a escribir prompts precisos, a verificar lo que devuelve el modelo y a no enviar nunca un texto generado sin revisarlo. Así ganas velocidad sin perder control.

## Cómo luciría tu tablero final

Un buen tablero para una operadora de fondos en México suele tener cuatro páginas. **Resumen**: valor de cada fondo, rendimiento del día, del mes y del año, y diferencia contra benchmark. **Riesgo**: volatilidad, VaR y drawdown con su evolución histórica. **Composición**: treemap por emisora y sector, y exposición en pesos y dólares. **Narrativa**: el texto generado con IA, revisado por el analista, que explica qué movió el resultado. En el módulo 4 construyes una versión de este tablero con las plantillas incluidas, y en el proyecto final la adaptas a tus propios datos.

## Cómo se conecta con otros cursos

Si quieres reforzar una pieza antes de este programa, tienes el [curso de Python](https://www.programbi.com/mx/cursos/python), el [curso de SQL Server](https://www.programbi.com/mx/cursos/sql-server) y el [curso de Power BI](https://www.programbi.com/mx/cursos/power-bi), además de la [guía de Power BI en México](/mx/guias/como-aprender-power-bi-en-mexico).

## Formato, valor y certificado

- Modalidad: en vivo por Zoom, 16:30 a 18:30, hora del centro de México.
- Duración: 30 horas; fecha de la próxima cohorte por confirmar en la [ficha de México](https://www.programbi.com/mx/cursos/mercado-financiero).
- Valor: {precio_local}.
- Incluye: grabaciones permanentes, material descargable y certificado al aprobar el trabajo integrador.
- Profesor: Manuel Oliva, Magíster en Data Science (UAI).

**Formas de pago:** los cursos de ProgramBI se pueden pagar en 3 cuotas sin interés, en todos los países.

**[CTA-END]** — {precio_local} · 16:30 a 18:30, hora del centro de México · «Inscribirme» · «Hablar por WhatsApp».

## Preguntas frecuentes

**¿Cuánto cuesta el curso de Mercado financiero en México?**
El valor es {precio_local} por el programa de 30 horas, con grabaciones de por vida y certificado.

**¿Cuándo y a qué hora son las clases?**
De 16:30 a 18:30, hora del centro de México, en vivo por Zoom. La ficha indica cupos abiertos; la fecha de inicio se confirma ahí o por WhatsApp.

**¿Sirve para casas de bolsa u operadoras de fondos?**
Sí. El curso trabaja casos de banca, corredoras, fondos y seguros, y se aplica igual a casas de bolsa y operadoras.

**¿Qué tipo de cambio se usa?**
El curso extrae tipos de cambio diarios de bancos centrales; en México puedes usar las series que publica Banxico.

**¿Necesito saber programar?**
Ayuda tener base en Excel; el curso incluye la configuración del entorno y entrega scripts base. Si nunca usaste Python o SQL, conviene reforzar antes con esos cursos.
