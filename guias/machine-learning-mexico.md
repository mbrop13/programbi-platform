---
slug: curso-machine-learning-mexico
ruta_sugerida: /mx/guias/curso-machine-learning-mexico
pais: mx
hreflang: es-MX
curso: machine-learning
url_curso: https://www.programbi.com/mx/cursos/machine-learning
title: "Curso de Machine Learning en México: guía 2026 | ProgramBI"
meta: "Curso de machine learning en México en vivo: 20 h de regresión, clasificación, clustering y anomalías con Python a las 16:30 CDMX."
h1: "Curso de Machine Learning en México: de los datos a la predicción"
updated: 2026-11-04
sources:
  - https://www.programbi.com/mx/cursos/machine-learning
nota_hermes: |
  ELEMENTO VISUAL: diagrama de ruta «datos CFDI/ERP → modelo → predicción → tablero Power BI» + bloque «En 30 segundos».
  Intención: "curso machine learning méxico", "curso de machine learning en vivo" → click_registro en /mx/cursos/machine-learning. country=mx, course=machine-learning.
  - PRECIO: {precio_local} = placeholder de config/pricing.ts (WS1), clave machine-learning × mx. Manu aún no define el monto: NO escribas cifras. Sin valor → "Consulta el valor por WhatsApp".
  - FECHA: la ficha dice «Cupos abiertos — consulta fecha» y días/horario «Por confirmar»; el horario sale de sus preguntas frecuentes. No publicar fecha hasta que la ficha la confirme. La ficha menciona «redes neuronales» en el lema pero no en el temario: la guía no las promete.
  - Primeros dos párrafos = respuesta citable (GEO). Schema Article + FAQPage + BreadcrumbList, sin Course/Offer.
  - WhatsApp: "Hola, vengo de la guía de Machine Learning para México en programbi.com y quiero info del curso en vivo".
---

# Curso de Machine Learning en México: de los datos a la predicción

**Respuesta corta:** el [curso de Machine Learning de ProgramBI para México](https://www.programbi.com/mx/cursos/machine-learning) dura **20 horas en vivo por Zoom**, en horario de **16:30 a 18:30, hora del centro de México**, y enseña a construir modelos predictivos con Python: regresión, clasificación, árboles y ensembles, validación, clustering, PCA, detección de anomalías y reglas de asociación. El precio es **{precio_local}**, con grabaciones de por vida y certificado digital.

Está pensado para quien **ya programa en Python** y quiere aplicarlo a problemas de negocio. La ficha, revisada el 4 de noviembre de 2026, indica **cupos abiertos · fechas vigentes en calendario**.

**[CTA-TOP]** — Cupos abiertos · 16:30 a 18:30 CDMX · «Ver el curso».

## Por qué machine learning tiene tanto sentido en México

La propia ficha del curso para México describe el punto de partida típico: datos en el CFDI, el ERP y los reportes de tienda. Eso significa que muchas empresas ya tienen años de historia transaccional ordenada por fecha, sucursal, producto y cliente. Es exactamente el tipo de dato que un modelo supervisado necesita para aprender.

El salto que propone este curso es pasar de la pregunta "¿qué pasó?" a "¿qué va a pasar y qué hago al respecto?". Una cadena con decenas de sucursales no necesita otro reporte de ventas del mes pasado; necesita saber cuánto inventario mandar a cada tienda la próxima semana. Un área de cobranza no necesita la lista de clientes morosos de ayer; necesita priorizar a quién contactar antes de que se atrase.

## Lo que cubre cada módulo

### Módulo 1: aprendizaje supervisado

Aquí trabajas con datos donde la respuesta ya se conoce y entrenas modelos para predecirla en casos nuevos:

- **Regresión lineal y polinómica** para estimar valores numéricos, como unidades vendidas o monto de un ticket.
- **Clasificación con regresión logística y SVM** para decidir entre categorías: paga o no paga, compra o no compra.
- **Árboles de decisión y métodos ensemble**, que combinan muchos modelos y suelen ganar en datos tabulares.
- **Validación cruzada y métricas**, para saber si el modelo funcionará fuera del notebook.

### Módulo 2: aprendizaje no supervisado

Aquí no hay etiqueta; buscas patrones:

- **K-Means** para segmentar clientes, sucursales o productos.
- **PCA y t-SNE** para resumir y visualizar datos con muchas columnas.
- **Detección de anomalías** para encontrar registros fuera de lo normal.
- **Reglas de asociación** para descubrir combinaciones de productos que se compran juntos.

## Ejemplo: segmentar sucursales con K-Means

```python
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans

vars_ = ["venta_prom_diaria", "ticket_promedio", "margen_pct", "rotacion_inv"]
X = StandardScaler().fit_transform(sucursales[vars_])

km = KMeans(n_clusters=4, n_init=10, random_state=0).fit(X)
sucursales["segmento"] = km.labels_
print(sucursales.groupby("segmento")[vars_].mean())
```

El resultado no es solo una etiqueta: es una tabla que te dice, por ejemplo, que un grupo de sucursales vende mucho con margen bajo y otro vende poco pero con ticket alto. Con eso, comercial puede diseñar estrategias distintas para cada grupo en lugar de tratar a todas las tiendas igual. En el curso se discute cómo elegir el número de grupos y cómo explicar cada segmento a quien toma decisiones.

## Casos de uso que verás en empresas mexicanas

**Pronóstico de demanda por sucursal.** Con ventas diarias por tienda y producto, más variables como día de la semana, quincena y promociones, un modelo de árboles estima la demanda de los próximos días. El resultado alimenta el pedido a proveedores y reduce tanto quiebres de inventario como sobrestock.

**Priorización de cobranza.** Con historial de pagos, antigüedad y monto, un clasificador asigna a cada cuenta una probabilidad de atraso. El equipo de cobranza empieza el día por las cuentas con mayor riesgo y mayor monto, no por orden alfabético.

**Revisión de facturas fuera de patrón.** En empresas que procesan grandes volúmenes de CFDI de proveedores, un modelo de detección de anomalías ayuda a marcar facturas con montos, conceptos o frecuencias atípicas para que contabilidad las revise antes de pagar.

**Canasta de compra en e-commerce.** Las reglas de asociación muestran qué productos aparecen juntos en los pedidos y alimentan recomendaciones del tipo "quienes compraron esto también llevaron".

## Requisito: Python sí o sí

La ficha lo dice sin rodeos: el curso es para quienes ya manejan Python. Antes de inscribirte, revisa si puedes hacer esto sin buscar en Google:

1. Leer un archivo de Excel o CSV con pandas.
2. Crear una columna nueva a partir de otras.
3. Agrupar y resumir con `groupby`.
4. Graficar una serie de tiempo.

Si alguna te cuesta, la ruta lógica es tomar primero el [curso de Python para datos en México](https://www.programbi.com/mx/cursos/python) y luego este.

## Cuatro trampas que el curso te ayuda a evitar

- **Fuga de información.** Usar variables que en la vida real conocerás después de la predicción, como el estatus de cobranza del mes siguiente.
- **Desbalance de clases.** Si solo el 3 % de las cuentas cae en mora, la exactitud engaña; hay que mirar precisión, sensibilidad o AUC.
- **Sobreajuste.** Un árbol muy profundo memoriza los datos de entrenamiento. La validación cruzada lo delata.
- **Clusters sin historia.** Un segmento que nadie entiende no cambia ninguna decisión.

## Qué métrica usar según la pregunta

Elegir la métrica correcta es la mitad del trabajo, y es uno de los temas del módulo 1:

- **Para estimar números** (demanda, montos, tiempos): el error absoluto medio te dice, en las mismas unidades del negocio, cuánto se equivoca el modelo en promedio. "Fallamos por 12 unidades por tienda al día" es algo que un gerente entiende.
- **Para clasificar con clases equilibradas**: la exactitud puede bastar.
- **Para clasificar eventos raros** (mora, fraude, fuga): precisión y sensibilidad, o el área bajo la curva ROC. La pregunta clave es qué cuesta más, una falsa alarma o un caso no detectado.
- **Para clustering**: no hay respuesta "correcta"; se usan indicadores como la inercia o la silueta, pero la prueba de fuego es si negocio puede actuar con los segmentos.

Una recomendación práctica: antes de entrenar cualquier modelo, escribe en una línea qué decisión tomará alguien con la predicción. Esa línea define la métrica, el umbral y hasta qué variables tiene sentido usar.

## Del modelo al tablero

Un modelo que vive en un notebook no le sirve al director comercial. Lo habitual en las empresas es guardar las predicciones en una tabla y presentarlas en Power BI: la demanda estimada por sucursal, el ranking de cuentas por riesgo o el mapa de segmentos. Si quieres cerrar ese ciclo, el [curso de Power BI](https://www.programbi.com/mx/cursos/power-bi) y la [guía para aprender Power BI en México](/mx/guias/como-aprender-power-bi-en-mexico) son el complemento.

## Tu chamba con machine learning

En OCC Mundial, LinkedIn y Computrabajo México, las vacantes de científico de datos, analista de datos avanzado o analista de riesgo suelen pedir Python y experiencia con modelos. Lo que más distingue a un candidato es un proyecto propio bien documentado: el problema, los datos, el modelo base, la mejora con un ensemble, las métricas y la recomendación. El proyecto con datos reales del curso es un buen punto de partida para ese portafolio.

**[CTA-MID]** — Descarga gratis la plantilla de dashboard de ventas.

## Horario y forma de pago en México

Según la ficha para México, las clases son de 16:30 a 18:30 en Ciudad de México. Como México dejó el horario de verano en la mayor parte del país y Chile sí lo aplica, la ficha advierte que según la época la clase puede verse a las 16:30 o a las 17:30; la hora exacta aparece en la ficha de tu cohorte. El pago se hace en pesos mexicanos con Mercado Pago México, que acepta tarjeta, SPEI, OXXO y Mercado Pago Wallet.

## Resumen del curso

- **20 horas** en dos módulos: supervisado y no supervisado.
- **En vivo por Zoom**, 16:30 a 18:30 CDMX; cupos abiertos y próximas fechas de apertura.
- **Grabaciones de por vida** y **certificado digital**.
- Proyectos con datos reales.
- Instructor: **Manuel Oliva**, Magíster en Data Science (UAI).
- Precio: **{precio_local}**.

**Formas de pago:** los cursos de ProgramBI se pueden pagar en 3 cuotas sin interés, en todos los países.

**[CTA-END]** — {precio_local} · 16:30 a 18:30 CDMX · «Inscribirme» · «Hablar por WhatsApp».

## Preguntas frecuentes

**¿Cuánto cuesta el curso de Machine Learning en México?**
{precio_local}, pagadero en pesos mexicanos con Mercado Pago México (tarjeta, SPEI u OXXO).

**¿A qué hora son las clases?**
De 16:30 a 18:30, hora del centro de México. Según la época del año puede correrse una hora; la ficha de la cohorte muestra la hora exacta.

**¿Necesito experiencia previa?**
Sí, manejo de Python. El curso no enseña el lenguaje desde cero.

**¿Qué pasa si no puedo conectarme a una clase?**
Queda grabada y la puedes ver cuando quieras; el acceso es de por vida.

**¿Recibo constancia?**
Sí, un certificado digital de ProgramBI al completar el curso.

**¿Puedo usar datos de mi empresa en el proyecto?**
Sí, siempre que estén anonimizados. Trabajar con un problema propio hace que el proyecto final tenga valor inmediato en tu área.
