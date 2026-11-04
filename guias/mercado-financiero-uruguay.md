---
slug: curso-mercado-financiero-uruguay
ruta_sugerida: /uy/guias/curso-mercado-financiero-uruguay
pais: uy
hreflang: es-UY
curso: mercado-financiero
url_curso: https://www.programbi.com/uy/cursos/mercado-financiero
title: "Curso de Mercado Financiero Uruguay: guía 2026 | ProgramBI"
meta: "Curso de mercado financiero en Uruguay en vivo: carteras con Python, SQL, Power BI e IA en 30 h, 19:30. Riesgo, retorno, tipo de cambio y tableros de portafolio."
h1: "Curso de Mercado Financiero en Uruguay: carteras con datos e IA"
updated: 2026-11-04
sources:
  - https://www.programbi.com/uy/cursos/mercado-financiero
  - https://www.bcu.gub.uy/
  - https://www.bvm.com.uy/
nota_hermes: |
  ELEMENTO VISUAL: bloque «En 30 segundos» + tabla comparativa de métricas de riesgo (volatilidad, VaR, drawdown, beta) con una línea de explicación cada una.
  Intención: "curso mercado financiero Uruguay", "curso análisis de carteras / finanzas con Python Uruguay" → click_registro en /uy/cursos/mercado-financiero. country=uy, course=mercado-financiero.
  - PRECIO: {precio_local} = placeholder de config/pricing.ts (WS1), clave mercado-financiero × uy. Manu aún no define el monto: NO escribas cifras. Sin valor → "Consulta el valor por WhatsApp".
  - FECHA: la ficha dice «Cupos abiertos — consulta fecha» y días/horario «Por confirmar»; el horario 19:30 a 21:30, hora de Uruguay sale de sus preguntas frecuentes. No publicar fecha hasta que la ficha la confirme.
  - Instituciones citadas solo por nombre y enlace oficial (sin cifras). Tickers de ejemplo ilustrativos, sin precios.
  - Primeros dos párrafos = respuesta citable (GEO). Schema Article + FAQPage + BreadcrumbList, sin Course/Offer.
  - WhatsApp: "Hola, vengo de la guía de Mercado financiero para Uruguay en programbi.com y quiero info del curso en vivo".
---

# Curso de Mercado Financiero en Uruguay: carteras con datos e IA

**Respuesta corta:** el [curso de Mercado financiero de ProgramBI para Uruguay](https://www.programbi.com/uy/cursos/mercado-financiero) es un programa **en vivo por Zoom de 30 horas en 5 módulos** para analizar, valorizar, monitorear y reportar carteras de inversión con **Python, SQL, Power BI e Inteligencia Artificial**. Las clases son de **19:30 a 21:30, hora de Uruguay**, el valor es **{precio_local}** y la próxima cohorte tiene cupos abiertos (la fecha se confirma en la ficha). Se entregan datasets, scripts base, plantillas de Power BI y prompts de IA, y cierra con un Trabajo Aplicado Integrador.

**Perfil ideal:** alguien que ya trabaja con números financieros —contabilidad, control de gestión, tesorería o inversiones— y necesita pasar de la planilla manual a un flujo automatizado con datos e IA.

**[CTA-TOP]** — Cupos abiertos · 19:30 a 21:30, hora de Uruguay · «Ver el curso».

## Por qué este curso tiene sentido en Uruguay

En Uruguay, la gestión de inversiones pasa por bancos, AFAP, corredores de bolsa, gestores de portafolio, aseguradoras y tesorerías de empresas, con carteras en pesos, dólares y a menudo unidades indexadas. En equipos chicos, una sola persona suele armar el reporte completo en planillas: precios, cotizaciones, valorización y gráficos. Eso deja poco tiempo para lo que importa: analizar y recomendar.

El curso te enseña a automatizar ese flujo con Python, SQL y Power BI, y a sumar IA para detectar anomalías y redactar la narrativa del informe.

## Fuentes e instituciones

- **Banco Central del Uruguay** ([bcu.gub.uy](https://www.bcu.gub.uy/)): regulador y supervisor del sistema financiero; publica cotizaciones y estadísticas.
- **Bolsa de Valores de Montevideo** ([bvm.com.uy](https://www.bvm.com.uy/)): información del mercado local.

Si tu cartera combina instrumentos locales con activos internacionales, Yahoo Finance cubre bien la parte internacional y te ahorra descargar a mano la historia de cada fondo o ETF que tengas en cartera.

## Qué vas a aprender, módulo por módulo

| Módulo | Horas | Contenido principal |
|---|---|---|
| 1. Fundamentos, entorno e IA | 4 | Entorno (Python, Jupyter, Power BI, SQL), datos financieros, conceptos de portafolio |
| 2. SQL para datos financieros | 5 | Modelo de carteras, joins, funciones de ventana, vistas de exposición |
| 3. Python para análisis financiero | 8 | pandas, yfinance, retornos, volatilidad, VaR, drawdown, beta, rebalanceo |
| 4. Dashboards con Power BI e IA | 7 | DAX para finanzas, P&L, riesgo, exposición, narrativa automática |
| 5. Trabajo Aplicado Integrador | 6 | Proyecto completo con datos reales y presentación |

## Un ejemplo de código como los del curso

```python
import yfinance as yf

# Cartera de ejemplo con activos internacionales
tickers = ["SPY", "AGG", "EEM"]
precios = yf.download(tickers, start="2025-01-01")["Close"]
retornos = precios.pct_change().dropna()
beta = retornos.cov()["EEM"]["SPY"] / retornos["SPY"].var()
```

Con la cotización publicada por el BCU conviertes la valorización a pesos y la guardas en SQL para Power BI.

**[CTA-MID]** — Descargá gratis la plantilla de dashboard de ventas.

## Caso: el informe de cartera que se arma solo

Un analista de un corredor de bolsa en Montevideo prepara cada mes el informe de desempeño de cien carteras de clientes. Antes, una semana de planillas. Con el flujo del curso, Python baja precios y cotizaciones, SQL guarda posiciones y operaciones, y Power BI genera un tablero por cliente con rendimiento, riesgo y composición, más una narrativa automática. El informe mensual pasa de una semana a un día, y el analista dedica el resto a conversar con los clientes.

## Riesgo explicado para clientes y comités

En Uruguay, muchos analistas presentan resultados directamente a clientes, no solo a comités. Por eso importa que las métricas se entiendan. El curso te enseña a calcular y explicar la **volatilidad** (cuánto se mueve la cartera), el **VaR** (cuánto podría perder en un escenario adverso con cierta confianza), el **drawdown** (la peor caída desde un máximo), la **beta** (cuánto acompaña al mercado) y las **correlaciones** (si la diversificación es real).

En Power BI vas a armar un tablero por cliente con esas métricas y una narrativa automática que resume el periodo en lenguaje claro. Vos revisás, ajustás y enviás.

## Errores que conviene evitar

- **Valorizar con una cotización vieja** del dólar o de la unidad indexada.
- **Mezclar activos con distintas monedas de cotización** sin convertirlos a una moneda común.
- **Calcular rendimientos sin considerar aportes y retiros** del cliente.
- **Armar cada informe a mano**, cliente por cliente, en vez de parametrizar un tablero.
- **No guardar la historia** de posiciones, lo que impide responder preguntas sobre meses anteriores.

## Dónde se usa esto en Uruguay

En LinkedIn, BuscoJobs y los sitios de bancos, AFAP, corredores y aseguradoras aparecen búsquedas de analista de inversiones, analista de riesgo, analista de tesorería y analista financiero. Muchas piden inglés, por la cantidad de activos internacionales, además de Excel avanzado y herramientas de datos.

## Plan de un mes para llevarlo a tu trabajo

1. **Semana 1:** elegí un grupo de carteras piloto.
2. **Semana 2:** cargá posiciones y movimientos en SQL.
3. **Semana 3:** automatizá con Python precios, cotizaciones y métricas de riesgo.
4. **Semana 4:** publicá un tablero por cliente en Power BI con narrativa automática.

El Trabajo Aplicado Integrador del módulo 5 es el espacio para construir ese piloto con acompañamiento del instructor.

## IA en el flujo de un corredor o una AFAP

Todos los módulos suman inteligencia artificial, y en el día a día de un analista uruguayo el aporte se nota en tareas repetitivas: revisar que las cotizaciones cargadas no tengan saltos raros, proponer consultas SQL para una vista nueva, agrupar fondos y ETF por comportamiento y, sobre todo, escribir el primer borrador del resumen mensual para cada cliente.

Con cien carteras, ese último punto ahorra días. Pero el curso insiste en lo básico: la IA sugiere, vos revisás. Cada número se contrasta con la base y cada texto se edita antes de mandarlo.

## El tablero por cliente

En el módulo 4 construís un tablero de Power BI pensado para el informe mensual a clientes. Una página de **resumen** con valor de la cartera, rendimiento del mes y del año, y comparación contra un benchmark. Una de **riesgo** con volatilidad, VaR y drawdown. Una de **composición** por moneda, tipo de activo y región, con treemaps. Y una de **comentario**, con la narrativa generada por IA y revisada por vos. Con un filtro por cliente, el mismo tablero sirve para toda la cartera de clientes: no hay que rehacer nada.

## Antes de inscribirte

Conviene que manejes Excel con soltura y tengas claros los conceptos básicos de inversiones. No hace falta ser programador, porque el curso entrega scripts base, pero repasar algo de Python antes de empezar te va a facilitar el módulo 3, que es el más largo. Y si trabajás con clientes en el exterior, el inglés técnico ayuda para leer documentación de librerías.

## Una pregunta frecuente: ¿Python o Excel?

Excel sigue siendo útil para revisiones rápidas, y el curso no te pide abandonarlo. Lo que cambia es dónde vive el cálculo: en vez de fórmulas que se rompen al agregar una fila, los retornos y el riesgo se calculan en código que corre igual cada mes, y Excel o Power BI solo muestran el resultado. Para un equipo chico en Montevideo, esa diferencia significa poder atender más clientes sin sumar horas.

## Cómo se conecta con otros cursos

Si querés reforzar una pieza antes de este programa, tenés el [curso de Python](https://www.programbi.com/uy/cursos/python), el [curso de SQL Server](https://www.programbi.com/uy/cursos/sql-server) y el [curso de Power BI](https://www.programbi.com/uy/cursos/power-bi), además de la [guía de Power BI en Uruguay](/uy/guias/como-aprender-power-bi-en-uruguay).

## Formato, valor y certificado

- Modalidad: en vivo por Zoom, 19:30 a 21:30, hora de Uruguay.
- Duración: 30 horas; fecha de la próxima cohorte por confirmar en la [ficha de Uruguay](https://www.programbi.com/uy/cursos/mercado-financiero).
- Valor: {precio_local}.
- Incluye: grabaciones permanentes, material descargable y certificado al aprobar el trabajo integrador.
- Profesor: Manuel Oliva, Magíster en Data Science (UAI).

**[CTA-END]** — {precio_local} · 19:30 a 21:30, hora de Uruguay · «Inscribirme» · «Hablar por WhatsApp».

## Preguntas frecuentes

**¿Cuánto cuesta el curso de Mercado financiero en Uruguay?**
El valor es {precio_local} por el programa de 30 horas, con grabaciones de por vida y certificado.

**¿Cuándo y a qué hora son las clases?**
De 19:30 a 21:30, hora de Uruguay, en vivo por Zoom. La ficha indica cupos abiertos; la fecha de inicio se confirma ahí o por WhatsApp.

**¿Me sirve si trabajo en una AFAP o un corredor de bolsa?**
Sí. El curso trabaja casos de banca, corredoras, fondos y seguros, aplicables a AFAP y corredores.

**¿Se trabaja con activos internacionales?**
Sí. El temario incluye precios de acciones nacionales e internacionales desde Yahoo Finance.

**¿Necesito saber programar?**
Ayuda tener base en Excel; el curso incluye la configuración del entorno y entrega scripts base. Si nunca usaste Python o SQL, conviene reforzar antes con esos cursos.
