---
slug: curso-mercado-financiero-colombia
ruta_sugerida: /co/guias/curso-mercado-financiero-colombia
pais: co
hreflang: es-CO
curso: mercado-financiero
url_curso: https://www.programbi.com/co/cursos/mercado-financiero
title: "Curso de Mercado Financiero Colombia: guía 2026 | ProgramBI"
meta: "Curso de mercado financiero en Colombia en vivo: carteras con Python, SQL, Power BI e IA en 30 h, 17:30. Riesgo, retorno, tipo de cambio y dashboards de portafolio."
h1: "Curso de Mercado Financiero en Colombia: portafolios con datos e IA"
updated: 2026-11-04
sources:
  - https://www.programbi.com/co/cursos/mercado-financiero
  - https://www.banrep.gov.co/
  - https://www.superfinanciera.gov.co/
  - https://www.bvc.com.co/
nota_hermes: |
  ELEMENTO VISUAL: diagrama del flujo de datos (Banco de la República / Yahoo Finance → Python → SQL → Power BI) + bloque «En 30 segundos».
  Intención: "curso mercado financiero Colombia", "curso análisis de carteras / finanzas con Python Colombia" → click_registro en /co/cursos/mercado-financiero. country=co, course=mercado-financiero.
  - PRECIO: {precio_local} = placeholder de config/pricing.ts (WS1), clave mercado-financiero × co. Manu aún no define el monto: NO escribas cifras. Sin valor → "Consulta el valor por WhatsApp".
  - FECHA: la ficha dice «Cupos abiertos — consulta fecha» y días/horario «Por confirmar»; el horario 17:30 a 19:30, hora de Colombia sale de sus preguntas frecuentes. No publicar fecha hasta que la ficha la confirme.
  - Instituciones citadas solo por nombre y enlace oficial (sin cifras). Tickers de ejemplo ilustrativos, sin precios.
  - Primeros dos párrafos = respuesta citable (GEO). Schema Article + FAQPage + BreadcrumbList, sin Course/Offer.
  - WhatsApp: "Hola, vengo de la guía de Mercado financiero para Colombia en programbi.com y quiero info del curso en vivo".
---

# Curso de Mercado Financiero en Colombia: portafolios con datos e IA

**Respuesta corta:** el [curso de Mercado financiero de ProgramBI para Colombia](https://www.programbi.com/co/cursos/mercado-financiero) es un programa **en vivo por Zoom de 30 horas en 5 módulos** para analizar, valorizar, monitorear y reportar carteras de inversión con **Python, SQL, Power BI e Inteligencia Artificial**. Las clases son de **17:30 a 19:30, hora de Colombia**, el valor es **{precio_local}** y la próxima cohorte tiene cupos abiertos (la fecha se confirma en la ficha). Se entregan datasets, scripts base, plantillas de Power BI y prompts de IA, y cierra con un Trabajo Aplicado Integrador.

**Perfil ideal:** alguien que ya trabaja con números financieros —contabilidad, control de gestión, tesorería o inversiones— y necesita pasar de la planilla manual a un flujo automatizado con datos e IA.

**[CTA-TOP]** — Cupos abiertos · 17:30 a 19:30, hora de Colombia · «Ver el curso».

## Por qué este curso tiene sentido en Colombia

En Colombia, el análisis de portafolios se hace en fiduciarias, comisionistas de bolsa, fondos de pensiones, aseguradoras, bancos y tesorerías de empresas. Un patrón común: los precios y la tasa de cambio se actualizan a mano, la valoración se recalcula en Excel y el informe para la junta o el comité se arma copiando gráficos. Cuando hay posiciones en pesos y dólares, renta fija y variable, cualquier error de fecha cambia el resultado.

Este curso te enseña a construir un flujo que haga ese trabajo solo: extracción automática de datos, cálculos de riesgo estándar y un tablero que explica el desempeño con ayuda de IA.

## Instituciones y fuentes de datos

- **Banco de la República** ([banrep.gov.co](https://www.banrep.gov.co/)): publica series económicas y financieras, incluidas las de tasa de cambio.
- **Superintendencia Financiera de Colombia** ([superfinanciera.gov.co](https://www.superfinanciera.gov.co/)): el supervisor del sistema financiero y del mercado de valores.
- **Bolsa de Valores de Colombia** ([bvc.com.co](https://www.bvc.com.co/)): información del mercado local.

En un informe a la junta, saber de dónde sale cada dato es tan importante como el dato mismo.

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

# Acciones colombianas en Yahoo Finance llevan el sufijo .CL
tickers = ["ECOPETROL.CL", "PFBCOLOM.CL", "ISA.CL"]
precios = yf.download(tickers, start="2025-01-01")["Close"]
retornos = precios.pct_change().dropna()
var_95 = retornos.quantile(0.05)   # VaR histórico diario al 95 %
```

Con la serie de tasa de cambio conviertes posiciones en dólares a pesos, y SQL Server deja la información lista para Power BI.

**[CTA-MID]** — Descarga gratis la plantilla de dashboard de ventas.

## Caso: el informe de cartera que se arma solo

Una analista de riesgo de una fiduciaria en Bogotá entrega cada lunes el informe de VaR y exposición de tres portafolios. Antes lo armaba en Excel, con datos copiados de varias fuentes. Con el flujo del curso, Python actualiza precios y tasa de cambio, calcula VaR histórico y paramétrico y drawdown; SQL guarda posiciones y resultados; y Power BI muestra un tablero con exposición por moneda y sector y una narrativa automática. Lo que tomaba la mañana ahora se revisa en minutos.

## VaR, volatilidad y drawdown sin misterio

En Colombia, las áreas de riesgo trabajan con reglas claras de medición y reporte, y el analista que domina las métricas tiene ventaja. El curso cubre el **VaR histórico**, que toma la distribución real de retornos pasados, y el **VaR paramétrico**, que supone una distribución normal; aprenderás cuándo cada uno sobrestima o subestima el riesgo. La **volatilidad** anualizada, el **drawdown** máximo y la **beta** contra un índice completan el cuadro. Con la **matriz de correlaciones** verás si el portafolio está realmente diversificado.

Todo eso se calcula en Python, se guarda en SQL y se presenta en Power BI con filtros por portafolio, moneda y tipo de activo, para que la junta lo explore sin pedirte un archivo nuevo.

## Errores frecuentes en informes de portafolio

- **Confundir la TRM de un día con la de otro** al valorar posiciones en dólares.
- **Calcular el VaR con ventanas distintas** cada mes, lo que vuelve imposible comparar.
- **Ignorar los días sin negociación** de algunas acciones locales, que distorsionan retornos y correlaciones.
- **Reportar solo rentabilidad** sin acompañarla de riesgo.
- **Archivos sueltos** en vez de una base única: cuando alguien pregunta por un dato, nadie sabe cuál es la versión buena.

## Dónde se usa esto en Colombia

En LinkedIn, Computrabajo, elempleo.com y los portales de bancos, fiduciarias, comisionistas y fondos de pensiones aparecen cargos como analista de inversiones, analista de riesgo de mercado, analista de tesorería, analista de portafolios y analista financiero. Las vacantes más técnicas suelen pedir Python, SQL o Power BI además de Excel.

## Cómo aplicarlo en tu trabajo, paso a paso

1. **Elige un portafolio piloto** y define qué informe quieres automatizar.
2. **Carga la historia** de posiciones y operaciones en SQL Server con un modelo limpio.
3. **Escribe el script** de Python que actualiza precios y tasa de cambio, y calcula VaR y drawdown.
4. **Publica el tablero** en Power BI con la narrativa automática.
5. **Escala** al resto de portafolios cuando el piloto funcione.

El Trabajo Aplicado Integrador del módulo 5 es el lugar ideal para construir ese piloto con acompañamiento.

## Inteligencia artificial aplicada al portafolio

Cada módulo del curso integra IA, y en una fiduciaria o comisionista colombiana su uso es muy práctico. Puedes pedirle que revise los datos cargados y te señale valores atípicos antes de calcular el VaR; que te proponga una consulta SQL para la vista de exposición que necesitas; que agrupe activos por patrones de retorno; o que redacte un primer resumen del periodo con base en las métricas del tablero.

La regla que se repite en clase es simple: la IA propone y el analista valida. Todo resultado se contrasta con los datos y toda narrativa se edita antes de llegar a la junta. Así el informe sale más rápido, pero con la misma rigurosidad.

## Las páginas del tablero que vas a construir

En el módulo 4 armas un tablero de Power BI pensado para una junta o un comité de inversiones colombiano. La **portada** resume el valor de cada portafolio y su rentabilidad del periodo. La página de **riesgo** muestra VaR histórico y paramétrico, volatilidad y drawdown, con su evolución en el tiempo. La de **exposición** desglosa por moneda, sector, emisor y tipo de activo, con mapas de calor para detectar concentraciones. La de **desempeño** compara cada portafolio con su benchmark. Y la última reúne la **narrativa** generada con IA, revisada por ti antes de publicar.

Con las plantillas del curso no partes de cero: adaptas la estructura a tus portafolios y la conectas a tu base SQL.

## Antes de inscribirte

Conviene que tengas soltura con Excel y conceptos básicos de inversiones (rentabilidad, riesgo, diversificación). Si nunca has escrito código, dedica unas horas previas a repasar Python; el curso entrega scripts base, pero el ritmo es exigente porque cubre cuatro herramientas en 30 horas.

## Cómo se conecta con otros cursos

Si quieres reforzar una pieza antes de este programa, tienes el [curso de Python](https://www.programbi.com/co/cursos/python), el [curso de SQL Server](https://www.programbi.com/co/cursos/sql-server) y el [curso de Power BI](https://www.programbi.com/co/cursos/power-bi), además de la [guía de Power BI en Colombia](/co/guias/como-aprender-power-bi-en-colombia).

## Datos prácticos de la cohorte

La [ficha para Colombia](https://www.programbi.com/co/cursos/mercado-financiero) (consultada el 4 de noviembre de 2026) indica clases en vivo por Zoom de 17:30 a 19:30, hora de Colombia, con cupos abiertos y fecha de inicio por confirmar. Son 30 horas; el valor es {precio_local}. Cada clase queda grabada y tienes acceso de por vida. Al aprobar el proyecto final recibes certificado. Enseña Manuel Oliva, Magíster en Data Science de la UAI.

**[CTA-END]** — {precio_local} · 17:30 a 19:30, hora de Colombia · «Inscribirme» · «Hablar por WhatsApp».

## Preguntas frecuentes

**¿Cuánto cuesta el curso de Mercado financiero en Colombia?**
El valor es {precio_local} por el programa de 30 horas, con grabaciones de por vida y certificado.

**¿Cuándo y a qué hora son las clases?**
De 17:30 a 19:30, hora de Colombia, en vivo por Zoom. La ficha indica cupos abiertos; la fecha de inicio se confirma ahí o por WhatsApp.

**¿Me sirve si trabajo en una fiduciaria o comisionista de bolsa?**
Sí. El curso trabaja casos de banca, corredoras, fondos y seguros, que aplican directamente a fiduciarias y comisionistas.

**¿Se calcula el VaR?**
Sí. El temario incluye VaR histórico y paramétrico, drawdown, beta y correlaciones.

**¿Necesito saber programar?**
Ayuda tener base en Excel; el curso incluye la configuración del entorno y entrega scripts base. Si nunca usaste Python o SQL, conviene reforzar antes con esos cursos.
