---
slug: curso-mercado-financiero-paraguay
ruta_sugerida: /py/guias/curso-mercado-financiero-paraguay
pais: py
hreflang: es-PY
curso: mercado-financiero
url_curso: https://www.programbi.com/py/cursos/mercado-financiero
title: "Curso de Mercado Financiero Paraguay: guía 2026 | ProgramBI"
meta: "Curso de mercado financiero en Paraguay en vivo: carteras con Python, SQL, Power BI e IA en 30 h, 19:30. Riesgo, retorno, tipo de cambio y tableros de inversión."
h1: "Curso de Mercado Financiero en Paraguay: inversiones con datos e IA"
updated: 2026-11-04
sources:
  - https://www.programbi.com/py/cursos/mercado-financiero
  - https://www.bcp.gov.py/
  - https://www.bolsadevalores.com.py/
nota_hermes: |
  ELEMENTO VISUAL: diagrama del flujo «BCP / Yahoo Finance → Python → SQL → Power BI» + bloque «En 30 segundos».
  Intención: "curso mercado financiero Paraguay", "curso análisis de carteras / finanzas con Python Paraguay" → click_registro en /py/cursos/mercado-financiero. country=py, course=mercado-financiero.
  - PRECIO: {precio_local} = placeholder de config/pricing.ts (WS1), clave mercado-financiero × py. Manu aún no define el monto: NO escribas cifras. Sin valor → "Consulta el valor por WhatsApp". La ficha /py/ puede publicar un Offer en USD no aprobado: WS1 debe quitarlo o alinearlo.
  - FECHA: la ficha dice «Cupos abiertos — consulta fecha» y días/horario «Por confirmar»; el horario 19:30 a 21:30, hora de Paraguay sale de sus preguntas frecuentes. No publicar fecha hasta que la ficha la confirme.
  - Instituciones citadas solo por nombre y enlace oficial (sin cifras). Tickers de ejemplo ilustrativos, sin precios.
  - Primeros dos párrafos = respuesta citable (GEO). Schema Article + FAQPage + BreadcrumbList, sin Course/Offer.
  - WhatsApp: "Hola, vengo de la guía de Mercado financiero para Paraguay en programbi.com y quiero info del curso en vivo".
---

# Curso de Mercado Financiero en Paraguay: inversiones con datos e IA

**Respuesta corta:** el [curso de Mercado financiero de ProgramBI para Paraguay](https://www.programbi.com/py/cursos/mercado-financiero) es un programa **en vivo por Zoom de 30 horas en 5 módulos** para analizar, valorizar, monitorear y reportar carteras de inversión con **Python, SQL, Power BI e Inteligencia Artificial**. Las clases son de **19:30 a 21:30, hora de Paraguay**, el valor es **{precio_local}** y la próxima cohorte tiene cupos abiertos (la fecha se confirma en la ficha). Se entregan datasets, scripts base, plantillas de Power BI y prompts de IA, y cierra con un Trabajo Aplicado Integrador.

**¿Para quién es?** Para profesionales del área financiera y contable, o que quieren trabajar en control de gestión financiera, según la ficha. Si hoy armás reportes de cartera en Excel, acá aprendés a automatizarlos de punta a punta.

**[CTA-TOP]** — Cupos abiertos · 19:30 a 21:30, hora de Paraguay · «Ver el curso».

## Por qué este curso tiene sentido en Paraguay

En Paraguay, la gestión de inversiones se concentra en bancos, financieras, casas de bolsa, aseguradoras, cooperativas grandes y tesorerías de empresas, con posiciones en guaraníes y dólares. Muchas carteras combinan bonos locales, depósitos y activos internacionales. En equipos chicos, el reporte se arma en planillas con cotizaciones copiadas a mano, y una sola fecha mal cargada cambia toda la valorización.

Este curso te enseña a automatizar ese trabajo con Python, SQL y Power BI, y a sumar IA para revisar anomalías y redactar el informe.

## Fuentes e instituciones

- **Banco Central del Paraguay** ([bcp.gov.py](https://www.bcp.gov.py/)): publica estadísticas y cotizaciones de referencia.
- **Bolsa de Valores de Asunción** ([bolsadevalores.com.py](https://www.bolsadevalores.com.py/)): información de emisiones y operaciones del mercado local.

Si la cartera incluye activos internacionales, Yahoo Finance complementa las fuentes locales.

## Lo que cubre el programa

Las 30 horas se reparten en cinco bloques. Los primeros cuatro horas sientan las bases: entorno técnico, tipos de datos financieros y cómo se organiza una cartera. Le siguen cinco horas de **SQL**, donde modelás carteras, posiciones y operaciones y construís vistas de exposición con funciones de ventana. El bloque más largo, ocho horas, es **Python**: descarga de precios con yfinance, tipos de cambio de bancos centrales, retornos, volatilidad, VaR, drawdown, beta, correlaciones, rebalanceo y usos de IA para detectar anomalías. Luego vienen siete horas de **Power BI**, con DAX aplicado a finanzas, P&L, mapas de calor y narrativa automática. Las últimas seis horas son para el **Trabajo Aplicado Integrador**, requisito de la certificación.

## Un ejemplo de código como los del curso

```python
import yfinance as yf

tickers = ["SPY", "TLT", "GLD"]   # activos internacionales de ejemplo
precios = yf.download(tickers, start="2025-01-01")["Close"]
retornos = precios.pct_change().dropna()
vol = retornos.std() * (252 ** 0.5)
```

Con la cotización de referencia del BCP llevás la valorización a guaraníes y la guardás en SQL para el tablero de Power BI.

**[CTA-MID]** — Descargá gratis la plantilla de dashboard de ventas.

## Caso: el informe de cartera que se arma solo

Una analista de tesorería de una aseguradora en Asunción prepara cada mes el informe de la cartera de inversiones: bonos locales, depósitos a plazo y fondos internacionales. Antes: planillas de cada custodio y cotizaciones copiadas. Con el flujo del curso, Python actualiza precios y cotizaciones, SQL guarda posiciones y vencimientos, y Power BI muestra composición por moneda y emisor, rendimiento y riesgo, con una narrativa automática. El comité recibe un informe claro y trazable.

## Métricas de riesgo para un mercado en crecimiento

Si tu cartera combina bonos locales con fondos internacionales, necesitás medir bien las dos partes, y el curso te da las herramientas para hacerlo. Vas a calcular **retornos**, **volatilidad**, **VaR**, **drawdown**, **beta** y **correlaciones** para los activos con precio diario, y a construir vistas de **exposición por moneda, emisor y plazo** para el resto.

En Power BI, esas vistas se convierten en un tablero que el comité puede filtrar, y la IA te ayuda a redactar el comentario del periodo y a detectar movimientos anómalos que merecen revisión.

## Errores frecuentes al reportar inversiones

- **Cotización del dólar mal fechada** al pasar a guaraníes.
- **Vencimientos y cupones** anotados a mano, que se olvidan o se duplican.
- **Mezclar activos con y sin precio diario** en el mismo cálculo de volatilidad.
- **Planillas por custodio** que nunca terminan de conciliarse.
- **Informes sin fuente**: ante una auditoría, cada número debe poder rastrearse.

## Dónde se usa esto en Paraguay

En LinkedIn, Computrabajo Paraguay y los sitios de bancos, financieras, casas de bolsa y aseguradoras aparecen búsquedas de analista de inversiones, analista de tesorería, analista de riesgo y analista financiero. Saber automatizar reportes con Python, SQL o Power BI es todavía un diferencial claro en el mercado local.

## Cómo aplicarlo en tu laburo en 4 semanas

1. **Semana 1:** elegí el informe de inversiones que más tiempo te lleva.
2. **Semana 2:** armá en SQL las tablas de posiciones, operaciones, precios y vencimientos.
3. **Semana 3:** automatizá con Python la descarga de precios y cotizaciones, y calculá métricas.
4. **Semana 4:** publicá el tablero en Power BI con narrativa automática.

Si lo hacés como Trabajo Aplicado Integrador, cerrás el curso con una herramienta real para tu equipo.

## Lo que aporta la IA en tu trabajo

El programa suma inteligencia artificial en sus cinco módulos. En una casa de bolsa, banco o aseguradora paraguaya, eso se traduce en tareas concretas: revisar que las cotizaciones y precios cargados no tengan errores; sugerir consultas SQL para nuevas vistas de exposición; agrupar activos por comportamiento; y preparar un primer borrador del informe mensual de inversiones.

La IA acelera, pero no firma. En clase se practica cómo escribir buenas instrucciones, cómo verificar lo que devuelve el modelo y cómo editar el texto antes de presentarlo al comité.

## El tablero que vas a construir

En el módulo 4 diseñás un tablero de Power BI para el comité de inversiones. La **portada** muestra el valor de la cartera en guaraníes y en dólares, y su rendimiento. La página de **vencimientos** ordena bonos y depósitos por fecha, algo clave cuando la cartera tiene mucha renta fija. La de **riesgo** presenta volatilidad, VaR y drawdown para los activos con precio diario. La de **exposición** desglosa por moneda, emisor y plazo. Y la de **comentario** reúne la narrativa generada con IA, revisada por vos.

## Antes de inscribirte

Vas a aprovechar más el curso si manejás Excel con soltura y conocés conceptos básicos de inversiones. No hace falta saber programar, porque se entregan scripts base, pero un repaso de Python antes de arrancar te va a ayudar: en 30 horas se cubren cuatro herramientas.

## Qué preguntarle al equipo antes de arrancar

Antes de empezar, escribile por WhatsApp a ProgramBI con tres consultas concretas: la fecha de inicio de la próxima cohorte, porque la ficha todavía la marca como «por confirmar»; si podés trabajar el proyecto final con datos anonimizados de tu empresa; y si conviene tomar antes el curso de Python o de SQL según tu experiencia. Con esas respuestas sabés si llegás preparado y cómo planificar las 30 horas junto con tu trabajo. Muchos alumnos aprovechan el Trabajo Aplicado Integrador para resolver un problema real de su área: es la mejor forma de justificar el curso ante tu jefe.

## Cómo se conecta con otros cursos

Si querés reforzar una pieza antes de este programa, tenés el [curso de Python](https://www.programbi.com/py/cursos/python), el [curso de SQL Server](https://www.programbi.com/py/cursos/sql-server) y el [curso de Power BI](https://www.programbi.com/py/cursos/power-bi), además de la [guía de Power BI en Paraguay](/py/guias/como-aprender-power-bi-en-paraguay).

## Formato, valor y certificado

- Modalidad: en vivo por Zoom, 19:30 a 21:30, hora de Paraguay.
- Duración: 30 horas; fecha de la próxima cohorte por confirmar en la [ficha de Paraguay](https://www.programbi.com/py/cursos/mercado-financiero).
- Valor: {precio_local}.
- Incluye: grabaciones permanentes, material descargable y certificado al aprobar el trabajo integrador.
- Profesor: Manuel Oliva, Magíster en Data Science (UAI).

**Formas de pago:** los cursos de ProgramBI se pueden pagar en 3 cuotas sin interés, en todos los países.

**[CTA-END]** — {precio_local} · 19:30 a 21:30, hora de Paraguay · «Inscribirme» · «Hablar por WhatsApp».

## Preguntas frecuentes

**¿Cuánto cuesta el curso de Mercado financiero en Paraguay?**
El valor es {precio_local} por el programa de 30 horas, con grabaciones de por vida y certificado.

**¿Cuándo y a qué hora son las clases?**
De 19:30 a 21:30, hora de Paraguay, en vivo por Zoom. La ficha indica cupos abiertos; la fecha de inicio se confirma ahí o por WhatsApp.

**¿Me sirve si trabajo en una casa de bolsa o una aseguradora?**
Sí. El curso trabaja casos de banca, corredoras, fondos y seguros.

**¿Se trabaja con guaraníes y dólares?**
Sí. El temario incluye valorizar carteras con caja en varias monedas y medir la exposición por moneda.

**¿Necesito saber programar?**
Ayuda tener base en Excel; el curso incluye la configuración del entorno y entrega scripts base. Si nunca usaste Python o SQL, conviene reforzar antes con esos cursos.
