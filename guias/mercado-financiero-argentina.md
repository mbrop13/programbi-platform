---
slug: curso-mercado-financiero-argentina
ruta_sugerida: /ar/guias/curso-mercado-financiero-argentina
pais: ar
hreflang: es-AR
curso: mercado-financiero
url_curso: https://www.programbi.com/ar/cursos/mercado-financiero
title: "Curso de Mercado Financiero Argentina: guía 2026 | ProgramBI"
meta: "Curso de mercado financiero en Argentina en vivo: carteras con Python, SQL, Power BI e IA en 30 h, 19:30. Riesgo, retorno, tipo de cambio y tableros de cartera."
h1: "Curso de Mercado Financiero en Argentina: carteras con datos e IA"
updated: 2026-11-04
sources:
  - https://www.programbi.com/ar/cursos/mercado-financiero
  - https://www.bcra.gob.ar/
  - https://www.argentina.gob.ar/cnv
  - https://www.byma.com.ar/
nota_hermes: |
  ELEMENTO VISUAL: bloque «En 30 segundos» + mini tabla «cartera en pesos vs. en dólares» para ilustrar la valorización multimoneda.
  Intención: "curso mercado financiero Argentina", "curso análisis de carteras / finanzas con Python Argentina" → click_registro en /ar/cursos/mercado-financiero. country=ar, course=mercado-financiero.
  - PRECIO: {precio_local} = placeholder de config/pricing.ts (WS1), clave mercado-financiero × ar. Manu aún no define el monto: NO escribas cifras. Sin valor → "Consulta el valor por WhatsApp".
  - FECHA: la ficha dice «Cupos abiertos — consulta fecha» y días/horario «Por confirmar»; el horario 19:30 a 21:30, hora de Argentina sale de sus preguntas frecuentes. No publicar fecha hasta que la ficha la confirme.
  - Instituciones citadas solo por nombre y enlace oficial (sin cifras). Tickers de ejemplo ilustrativos, sin precios.
  - Primeros dos párrafos = respuesta citable (GEO). Schema Article + FAQPage + BreadcrumbList, sin Course/Offer.
  - WhatsApp: "Hola, vengo de la guía de Mercado financiero para Argentina en programbi.com y quiero info del curso en vivo".
---

# Curso de Mercado Financiero en Argentina: carteras con datos e IA

**Respuesta corta:** el [curso de Mercado financiero de ProgramBI para Argentina](https://www.programbi.com/ar/cursos/mercado-financiero) es un programa **en vivo por Zoom de 30 horas en 5 módulos** para analizar, valorizar, monitorear y reportar carteras de inversión con **Python, SQL, Power BI e Inteligencia Artificial**. Las clases son de **19:30 a 21:30, hora de Argentina**, el valor es **{precio_local}** y la próxima cohorte tiene cupos abiertos (la fecha se confirma en la ficha). Se entregan datasets, scripts base, plantillas de Power BI y prompts de IA, y cierra con un Trabajo Aplicado Integrador.

**¿Para quién es?** Para profesionales del área financiera y contable, o que quieren trabajar en control de gestión financiera, según la ficha. Si hoy armás reportes de cartera en Excel, acá aprendés a automatizarlos de punta a punta.

**[CTA-TOP]** — Cupos abiertos · 19:30 a 21:30, hora de Argentina · «Ver el curso».

## Por qué este curso tiene sentido en Argentina

En Argentina, quien analiza carteras trabaja en un contexto muy particular: posiciones en pesos y en dólares, inflación que distorsiona las comparaciones en el tiempo y precios que se mueven rápido. En ALyC, sociedades gerentes de fondos, bancos, aseguradoras y tesorerías de empresas, el reporte de cartera suele depender de planillas que alguien actualiza a mano con el tipo de cambio del día. Cualquier error de fecha o de moneda cambia el resultado.

Este curso te enseña a armar un flujo que lo resuelva: datos que se bajan solos, valorización multimoneda, métricas de riesgo estándar y un tablero con narrativa automática.

## Las fuentes que vas a usar

- **Banco Central de la República Argentina** ([bcra.gob.ar](https://www.bcra.gob.ar/)): publica estadísticas y series de tipo de cambio.
- **Comisión Nacional de Valores** ([argentina.gob.ar/cnv](https://www.argentina.gob.ar/cnv)): el regulador del mercado de capitales.
- **Bolsas y Mercados Argentinos** ([byma.com.ar](https://www.byma.com.ar/)): información del mercado local.

Con tipos de cambio que cambian seguido, dejar documentado qué cotización usaste y de qué fecha es indispensable.

## El temario en cinco etapas

1. **Arranque (4 h).** Preparás el entorno de trabajo con Python, Jupyter, SQL y Power BI, repasás tipos de activos y fuentes de datos financieros, y ves casos de banca, corredoras, fondos y seguros.
2. **Base de datos de carteras (5 h).** Diseñás tablas de carteras, posiciones y operaciones; consultas con joins y funciones de ventana; vistas de exposición por activo, sector y moneda.
3. **Análisis cuantitativo en Python (8 h).** pandas, numpy y yfinance para retornos, volatilidad, VaR histórico y paramétrico, drawdown, beta, correlaciones, introducción a derivados y rebalanceo; la IA apoya con anomalías y clustering.
4. **Visualización (7 h).** Power BI con medidas DAX financieras, mapas de calor, treemaps, desempeño contra benchmark, P&L y narrativa generada con IA.
5. **Proyecto final (6 h).** Un Trabajo Aplicado Integrador, individual o en dupla, obligatorio para certificar.

## Un ejemplo de código como los del curso

```python
import yfinance as yf

# Acciones argentinas en Yahoo Finance llevan el sufijo .BA
tickers = ["GGAL.BA", "YPFD.BA", "PAMP.BA"]
precios = yf.download(tickers, start="2025-01-01")["Close"]
import numpy as np
retornos_log = np.log(precios / precios.shift(1)).dropna()
acumulado = retornos_log.cumsum().apply(np.exp) - 1
```

Más importante que el código: valorizar en pesos y en dólares a la vez, para que la inflación no te haga creer que una cartera ganó cuando en moneda dura perdió.

**[CTA-MID]** — Descargá gratis la plantilla de dashboard de ventas.

## Caso: el informe de cartera que se arma solo

Un analista de una ALyC en Buenos Aires arma cada mañana la valorización de carteras de clientes con bonos, acciones y CEDEAR. Antes: cotizaciones copiadas, tipo de cambio pegado y fórmulas revisadas a mano. Con el flujo del curso, Python baja precios y tipo de cambio, SQL guarda posiciones y operaciones, y Power BI muestra valorización en pesos y en dólares, P&L y composición por moneda y sector, con una narrativa automática que resume qué explicó el resultado. El analista llega a la reunión con el informe listo.

## Rendimiento real: el problema de medir en pesos

En Argentina, mirar el rendimiento de una cartera solo en pesos puede llevarte a conclusiones equivocadas: con inflación, un número positivo no garantiza que hayas ganado poder de compra. Por eso el curso insiste en valorizar en más de una moneda y en comparar contra un benchmark adecuado. Vas a calcular **retornos** simples y logarítmicos, **volatilidad**, **VaR**, **drawdown** y **beta**, y vas a armar en Power BI un tablero que muestre lado a lado la cartera en pesos y en dólares.

Esa doble lectura es lo que te piden en cualquier reunión con clientes o con el comité: no alcanza con decir cuánto subió la cartera, hay que explicar contra qué y en qué moneda.

## Errores que vas a dejar de cometer

- **Usar el tipo de cambio equivocado**: con varias cotizaciones conviviendo, hay que dejar explícito cuál se usa y por qué.
- **Comparar periodos sin ajustar** por la moneda de medición.
- **Mezclar CEDEAR con su subyacente** sin considerar el ratio de conversión.
- **Rehacer el informe a mano** cada vez que un cliente pide otra fecha de corte.
- **No guardar la historia**: sin una base en SQL, no podés reconstruir qué valía la cartera hace tres meses.

## Dónde se usa esto en Argentina

En LinkedIn, Bumeran, ZonaJobs y los portales de bancos, ALyC, sociedades gerentes y aseguradoras aparecen búsquedas de analista de inversiones, analista de riesgo, analista de mesa de dinero, analista de tesorería y analista financiero. Las posiciones más técnicas piden Python y SQL, y en empresas que trabajan con el exterior, inglés.

## Tu plan de 30 días después del curso

1. **Semana 1:** elegí la cartera o el informe que más tiempo te consume.
2. **Semana 2:** modelá posiciones y operaciones en SQL, con la moneda como columna explícita.
3. **Semana 3:** automatizá con Python la descarga de precios y tipo de cambio, y calculá rendimiento en pesos y en dólares.
4. **Semana 4:** publicá el tablero de Power BI y sumá la narrativa con IA.

Si usás ese caso como Trabajo Aplicado Integrador, terminás el curso con algo que ya funciona en tu laburo.

## IA para el analista, no en lugar del analista

La IA está presente en los cinco módulos y, en una ALyC o una sociedad gerente argentina, rinde sobre todo en tres frentes. El primero es el **control de calidad**: marcar cotizaciones que saltaron por un error o fechas que no coinciden. El segundo es la **exploración**: agrupar activos por comportamiento o sugerir consultas SQL que no se te habían ocurrido. El tercero es la **comunicación**: redactar un borrador del informe para clientes con lo que explicó el resultado del mes, en pesos y en dólares.

Vos seguís firmando el informe. En el curso aprendés a escribir prompts concretos, a chequear cada número contra la base y a editar el texto antes de enviarlo.

## Lo que vas a poder mostrar al terminar

Al cerrar el curso tenés un proyecto completo que podés presentar en una entrevista o en tu trabajo actual: una base SQL con carteras, posiciones y operaciones; scripts de Python que bajan precios y tipo de cambio y calculan métricas de riesgo; y un tablero de Power BI con valorización en pesos y en dólares, exposición por moneda y sector, desempeño contra benchmark y una narrativa revisada. Para alguien que busca pasar de contabilidad o back office a un rol de análisis de inversiones, ese portafolio pesa más que una lista de cursos en el CV.

## Cómo se conecta con otros cursos

Si querés reforzar una pieza antes de este programa, tenés el [curso de Python](https://www.programbi.com/ar/cursos/python), el [curso de SQL Server](https://www.programbi.com/ar/cursos/sql-server) y el [curso de Power BI](https://www.programbi.com/ar/cursos/power-bi), además de la [guía de Power BI en Argentina](/ar/guias/como-aprender-power-bi-en-argentina).

## Datos prácticos de la cohorte

La [ficha para Argentina](https://www.programbi.com/ar/cursos/mercado-financiero) (consultada el 4 de noviembre de 2026) indica clases en vivo por Zoom de 19:30 a 21:30, hora de Argentina, con cupos abiertos y fecha de inicio por confirmar. Son 30 horas; el valor es {precio_local}. Cada clase queda grabada y tenés acceso de por vida. Al aprobar el proyecto final recibís certificado. Enseña Manuel Oliva, Magíster en Data Science de la UAI.

**Formas de pago:** los cursos de ProgramBI se pueden pagar en 3 cuotas sin interés, en todos los países.

**[CTA-END]** — {precio_local} · 19:30 a 21:30, hora de Argentina · «Inscribirme» · «Hablar por WhatsApp».

## Preguntas frecuentes

**¿Cuánto cuesta el curso de Mercado financiero en Argentina?**
El valor es {precio_local} por el programa de 30 horas, con grabaciones de por vida y certificado.

**¿Cuándo y a qué hora son las clases?**
De 19:30 a 21:30, hora de Argentina, en vivo por Zoom. La ficha indica cupos abiertos; la fecha de inicio se confirma ahí o por WhatsApp.

**¿Sirve si trabajo en una ALyC o en una sociedad gerente de fondos?**
Sí. El curso trabaja casos de banca, corredoras, fondos y seguros, aplicables a ALyC y sociedades gerentes.

**¿Cómo se maneja la valorización en distintas monedas?**
El temario incluye valorizar carteras mixtas con caja en varias monedas y analizar la exposición por moneda.

**¿Necesito saber programar?**
Ayuda tener base en Excel; el curso incluye la configuración del entorno y entrega scripts base. Si nunca usaste Python o SQL, conviene reforzar antes con esos cursos.
