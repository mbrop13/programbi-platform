---
slug: curso-machine-learning-argentina
ruta_sugerida: /ar/guias/curso-machine-learning-argentina
pais: ar
hreflang: es-AR
curso: machine-learning
url_curso: https://www.programbi.com/ar/cursos/machine-learning
title: "Curso de Machine Learning Argentina: guía 2026 | ProgramBI"
meta: "Curso de machine learning en Argentina en vivo: 20 h de regresión, clasificación, clustering y anomalías con Python, 19:30 hora de Buenos Aires. Requisito: Python."
h1: "Curso de Machine Learning en Argentina: modelos que predicen, con Python"
updated: 2026-11-04
sources:
  - https://www.programbi.com/ar/cursos/machine-learning
  - https://www.indec.gob.ar/
nota_hermes: |
  ELEMENTO VISUAL: diagrama de ruta «ventas nominales → deflactar con índice INDEC → modelo → validación temporal → tablero» + bloque «En 30 segundos».
  Intención: "curso machine learning argentina", "curso machine learning online en vivo" → click_registro en /ar/cursos/machine-learning. country=ar, course=machine-learning.
  - PRECIO: {precio_local} = placeholder de config/pricing.ts (WS1), clave machine-learning × ar. Manu aún no define el monto: NO escribas cifras. Sin valor → "Consulta el valor por WhatsApp".
  - FECHA: la ficha dice «Cupos abiertos — consulta fecha» y días/horario «Por confirmar»; el horario sale de sus preguntas frecuentes. No publicar fecha hasta que la ficha la confirme. La ficha menciona «redes neuronales» en el lema pero no en el temario: la guía no las promete.
  - Primeros dos párrafos = respuesta citable (GEO). Schema Article + FAQPage + BreadcrumbList, sin Course/Offer.
  - WhatsApp: "Hola, vengo de la guía de Machine Learning para Argentina en programbi.com y quiero info del curso en vivo".
---

# Curso de Machine Learning en Argentina: modelos que predicen, con Python

**Respuesta corta:** el [curso de Machine Learning de ProgramBI para Argentina](https://www.programbi.com/ar/cursos/machine-learning) son **20 horas en vivo por Zoom**, de **19:30 a 21:30, hora de Argentina**, para quienes ya programan en Python y quieren armar modelos predictivos aplicados a negocios. Vas a ver aprendizaje supervisado —regresión, clasificación con logística y SVM, árboles y ensembles, validación cruzada— y no supervisado —K-Means, PCA, t-SNE, anomalías y reglas de asociación—. El precio es **{precio_local}**, con grabaciones de por vida y certificado.

La ficha, revisada el 4 de noviembre de 2026, muestra **cupos abiertos con fecha por confirmar**. El pago se hace en pesos argentinos con Mercado Pago o transferencia.

**[CTA-TOP]** — Cupos abiertos · 19:30 a 21:30 (Argentina) · «Ver el curso».

## Predecir en un contexto que cambia rápido

Si trabajás con datos en Argentina, sabés que la historia no siempre se parece al futuro. Precios que se mueven mes a mes, cambios de reglas, consumo que se ajusta de golpe. Eso no vuelve inútil al machine learning; lo vuelve más exigente. Un modelo que en otro país se entrena una vez al año acá tal vez necesite reentrenarse cada mes, usar variables en términos reales en lugar de nominales, o medirse con un horizonte más corto.

El curso te da las herramientas para hacerlo bien: elegir el modelo adecuado, validarlo de forma honesta y entender cuándo dejó de funcionar. Esa última parte, saber detectar que un modelo se degradó, vale oro en un contexto inestable.

La ficha para Argentina menciona un punto de partida habitual: ventas en el ERP, comprobantes de ARCA y una planilla de tesorería para seguir el tipo de cambio. Con esa base ya se pueden plantear modelos útiles.

## Qué vas a ver

**Módulo 1 — Supervisado.** Entrenás modelos con datos donde ya conocés la respuesta:

- Regresión lineal y polinómica, para estimar cantidades.
- Regresión logística y SVM, para clasificar.
- Árboles de decisión y ensembles, los caballos de batalla con datos tabulares.
- Validación cruzada y métricas, para no engañarte con resultados demasiado buenos.

**Módulo 2 — No supervisado.** Buscás estructura sin etiqueta:

- K-Means para armar segmentos.
- PCA y t-SNE para reducir y visualizar.
- Detección de anomalías.
- Reglas de asociación para canastas de compra.

## Un ejemplo: ventas en términos reales

```python
import pandas as pd
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.model_selection import TimeSeriesSplit, cross_val_score

# ventas ya deflactadas con un índice de precios para comparar meses
df["ventas_reales"] = df["ventas_nominales"] / df["indice_precios"]
X = df[["mes", "dia_semana", "promo", "ventas_reales_lag7", "ventas_reales_lag28"]]
y = df["ventas_reales"]

cv = TimeSeriesSplit(n_splits=5)
mae = -cross_val_score(GradientBoostingRegressor(), X, y, cv=cv,
                       scoring="neg_mean_absolute_error")
print(mae.mean())
```

Dos detalles importan acá. Primero, el modelo trabaja con ventas en términos reales, deflactadas con un índice de precios, para que el aumento nominal no se confunda con crecimiento. Segundo, la validación respeta el orden del tiempo: se entrena con el pasado y se evalúa con lo que vino después. Son decisiones que se discuten en clase y que marcan la diferencia entre un pronóstico creíble y uno que solo funciona en el papel. Como fuente pública del índice podés usar las series del [INDEC](https://www.indec.gob.ar/), que la propia ficha menciona como referencia local.

## Dónde aplicarlo en Argentina

**Consumo masivo y retail.** Pronóstico de demanda por sucursal o por SKU, en unidades y no en pesos, para que la inflación no distorsione el plan de compras.

**Fintech y crédito.** Clasificación del riesgo de mora con historial de pagos. La regresión logística y los ensembles son el estándar, y la validación cruzada evita sorpresas cuando el modelo pasa a producción.

**Agro y logística.** Detección de anomalías en lecturas, tiempos de viaje o rendimientos, y segmentación de clientes o zonas con K-Means.

**E-commerce.** Reglas de asociación para recomendar productos complementarios en el carrito.

## Antes de anotarte

El requisito es manejar Python. Hacete estas preguntas:

- ¿Podés leer un CSV, filtrarlo y agrupar con pandas sin copiar código de otro lado?
- ¿Entendés la diferencia entre una lista, un diccionario y un DataFrame?
- ¿Graficaste alguna vez con matplotlib o seaborn?

Si dudaste en alguna, empezá por el [curso de Python para datos en Argentina](https://www.programbi.com/ar/cursos/python). Llegar con esa base hace que las 20 horas rindan mucho más, porque en clase el foco está en los modelos y no en la sintaxis del lenguaje.

## Errores que vas a dejar de cometer

- **Validar mezclando el tiempo.** Con datos temporales, partir al azar filtra el futuro al entrenamiento.
- **Modelar en pesos nominales.** El modelo aprende la inflación, no el negocio.
- **Confiar en la exactitud con clases desbalanceadas.** En mora o fraude, mirá precisión, sensibilidad y AUC.
- **Dejar el modelo andando sin monitoreo.** Definí una métrica y revisala cada mes; si cae, reentrenás.
- **Segmentos sin nombre.** Un clúster solo sirve si alguien puede decir qué hacer con él.

## Cómo darte cuenta de que tu modelo dejó de servir

En un contexto que cambia rápido, el modelo que funcionaba en marzo puede fallar en agosto. Tres señales de alerta:

1. **El error sube de forma sostenida.** Si medís el error del pronóstico cada semana y empieza a crecer, algo cambió en los datos.
2. **Las variables de entrada se corren.** Si el ticket promedio o la cantidad de transacciones se mueven fuera del rango con el que entrenaste, el modelo está extrapolando.
3. **El negocio deja de confiar.** Cuando el equipo comercial empieza a "corregir a mano" las predicciones, es hora de revisar.

La respuesta casi siempre es la misma: reentrenar con datos recientes, revisar si conviene trabajar en unidades o en valores reales y, si hace falta, acortar la ventana de entrenamiento. El curso te da la base de validación para hacer ese diagnóstico con números y no por intuición.

## Supervisado o no supervisado, en una tabla

| Si tu pregunta es… | Tipo | Qué usás |
|---|---|---|
| ¿Cuánto voy a vender? | Supervisado | Regresión, árboles, ensembles |
| ¿Este cliente va a pagar tarde? | Supervisado | Logística, SVM, ensembles |
| ¿Qué tipos de clientes tengo? | No supervisado | K-Means |
| ¿Esta transacción es rara? | No supervisado | Detección de anomalías |
| ¿Qué se compra junto? | No supervisado | Reglas de asociación |

Con esta tabla en la cabeza, cualquier problema de negocio se vuelve más fácil de plantear: primero definís si tenés la respuesta histórica, después elegís la familia de modelos.

## Qué te piden en el laburo

En LinkedIn, Bumeran y ZonaJobs, las búsquedas de data scientist, analista de datos semi senior o analista de riesgo suelen pedir Python y experiencia con modelos. Lo que más pesa en una entrevista técnica es un proyecto propio: explicá qué problema resolviste, cómo validaste y qué harías distinto.

## Del notebook al tablero

Una predicción que nadie ve no cambia nada. Lo habitual es dejar los resultados en una tabla y mostrarlos en Power BI: pronóstico por sucursal, ranking de clientes por riesgo, mapa de segmentos. Para esa parte tenés el [curso de Power BI en Argentina](https://www.programbi.com/ar/cursos/power-bi) y la [guía para aprender Power BI en Argentina](/ar/guias/como-aprender-power-bi-en-argentina).

**[CTA-MID]** — Descargá gratis la plantilla de dashboard de ventas.

## Horario y pagos

Las clases son de 19:30 a 21:30 en Buenos Aires. Argentina usa UTC-3 todo el año y Chile cambia entre UTC-3 y UTC-4, por eso la ficha aclara que, según la época, la clase puede verse a las 19:30 o a las 20:30; la hora exacta figura en la ficha de tu cohorte. El pago es en pesos argentinos con Mercado Pago (tarjeta de crédito o débito, o Wallet) o transferencia bancaria.

## Ficha resumida

- 20 horas en 2 módulos, supervisado y no supervisado.
- En vivo por Zoom; cupos abiertos, fecha por confirmar.
- Grabaciones de por vida, certificado digital, proyectos con datos reales.
- Instructor: Manuel Oliva, Magíster en Data Science (UAI).
- Precio: {precio_local}.

**[CTA-END]** — {precio_local} · 19:30 a 21:30 · «Inscribirme» · «Hablar por WhatsApp».

## Preguntas frecuentes

**¿Cuánto sale el curso de Machine Learning en Argentina?**
{precio_local}, en pesos argentinos con Mercado Pago o transferencia.

**¿Tengo que saber Python?**
Sí. El curso es para quienes ya lo manejan; no arranca desde cero.

**¿Cuándo empieza?**
La ficha muestra cupos abiertos con fecha por confirmar. Escribí por WhatsApp para saber la próxima.

**¿Qué pasa si me pierdo una clase?**
Queda grabada y la ves cuando quieras, con acceso de por vida.

**¿Me dan certificado?**
Sí, un certificado digital de ProgramBI al completar el curso.

**¿Sirve si trabajo con datos en pesos que cambian todo el tiempo?**
Sí, y es justamente donde más se nota la diferencia. El curso trabaja validación y métricas, y la guía muestra cómo modelar en términos reales para que la inflación no distorsione el pronóstico.

**¿Qué librerías vamos a usar?**
Técnicas clásicas de machine learning en Python; scikit-learn es la librería estándar para regresión, clasificación, clustering y PCA.
