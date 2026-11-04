---
slug: curso-machine-learning-uruguay
ruta_sugerida: /uy/guias/curso-machine-learning-uruguay
pais: uy
hreflang: es-UY
curso: machine-learning
url_curso: https://www.programbi.com/uy/cursos/machine-learning
title: "Curso de Machine Learning Uruguay: guía 2026 | ProgramBI"
meta: "Curso de machine learning en Uruguay en vivo por Zoom: 20 h de modelos predictivos, clustering y anomalías con Python, de 19:30 a 21:30. Requisito: saber Python."
h1: "Curso de Machine Learning en Uruguay: predicción y patrones con Python"
updated: 2026-11-04
sources:
  - https://www.programbi.com/uy/cursos/machine-learning
nota_hermes: |
  ELEMENTO VISUAL: tabla comparativa «decisión de negocio uruguaya → técnica → resultado» (margen por lote, riesgo de cliente, anomalías) + bloque «En 30 segundos».
  Intención: "curso machine learning uruguay", "curso machine learning montevideo" → click_registro en /uy/cursos/machine-learning. country=uy, course=machine-learning.
  - PRECIO: {precio_local} = placeholder de config/pricing.ts (WS1), clave machine-learning × uy. Manu aún no define el monto: NO escribas cifras. Sin valor → "Consulta el valor por WhatsApp".
  - FECHA: la ficha dice «Cupos abiertos — consulta fecha» y días/horario «Por confirmar»; el horario sale de sus preguntas frecuentes. No publicar fecha hasta que la ficha la confirme. La ficha menciona «redes neuronales» en el lema pero no en el temario: la guía no las promete.
  - Primeros dos párrafos = respuesta citable (GEO). Schema Article + FAQPage + BreadcrumbList, sin Course/Offer.
  - WhatsApp: "Hola, vengo de la guía de Machine Learning para Uruguay en programbi.com y quiero info del curso en vivo".
---

# Curso de Machine Learning en Uruguay: predicción y patrones con Python

**Respuesta corta:** el [curso de Machine Learning de ProgramBI para Uruguay](https://www.programbi.com/uy/cursos/machine-learning) son **20 horas en vivo por Zoom**, de **19:30 a 21:30, hora de Uruguay**, para quienes ya manejan Python y quieren construir modelos predictivos aplicados a negocios. Recorre aprendizaje supervisado —regresión, clasificación con logística y SVM, árboles, ensembles y validación cruzada— y no supervisado —K-Means, PCA, t-SNE, detección de anomalías y reglas de asociación—. El precio es **{precio_local}** e incluye grabaciones de por vida y certificado digital.

Según la ficha consultada el 4 de noviembre de 2026, hay **cupos abiertos con fecha por confirmar**. Se paga en pesos uruguayos con Mercado Pago Uruguay o transferencia.

**[CTA-TOP]** — Cupos abiertos · 19:30 a 21:30 (Montevideo) · «Ver el curso».

## Machine learning a escala uruguaya

Uruguay tiene muchas empresas medianas donde una sola persona, o un equipo muy chico, se encarga de todos los datos. En ese contexto, machine learning no se trata de grandes plataformas, sino de modelos concretos que ahorran tiempo y mejoran una decisión puntual: cuánto stock pedir, a qué cliente llamar primero, qué registro revisar antes de cerrar el mes.

La ficha del curso para Uruguay describe un punto de partida típico: el dato vive en la facturación electrónica de DGI, las planillas de campo y los sistemas de faena, y el primer tablero suele mostrar margen por lote o por destino de exportación. Con esa historia ordenada, el paso siguiente natural es anticipar en lugar de solo describir.

## Lo que vas a aprender

### Supervisado (módulo 1)

Trabajás con datos que ya traen la respuesta:

- **Regresión lineal y polinómica**: estimar un valor, como kilos, precio o margen.
- **Regresión logística y SVM**: clasificar, por ejemplo, un cliente que renueva o no.
- **Árboles de decisión y ensembles**: modelos flexibles que suelen dar los mejores resultados con datos de negocio en tablas.
- **Validación cruzada y métricas**: la forma honesta de saber cuánto rinde un modelo.

### No supervisado (módulo 2)

Buscás estructura sin etiqueta previa:

- **K-Means** para agrupar clientes, productos o lotes.
- **PCA y t-SNE** para resumir y visualizar muchas variables.
- **Detección de anomalías** para encontrar registros raros.
- **Reglas de asociación** para descubrir combinaciones frecuentes.

## Ejemplo: estimar el margen de un lote

```python
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import cross_val_score

X = pd.get_dummies(lotes[["peso_promedio", "dias_proceso", "categoria", "destino"]])
y = lotes["margen_por_kg"]

rf = RandomForestRegressor(n_estimators=400, random_state=3)
mae = -cross_val_score(rf, X, y, cv=5, scoring="neg_mean_absolute_error")
print(f"Error medio: {mae.mean():.2f} por kg")

rf.fit(X, y)
importancias = pd.Series(rf.feature_importances_, index=X.columns).sort_values()
```

Además de la predicción, el bosque aleatorio te dice qué variables pesan más en el margen. Esa lista de importancias suele ser lo primero que pregunta el gerente: ¿es el destino, la categoría o el tiempo de proceso lo que más mueve el resultado? En el curso se discute cómo leer esas importancias con cuidado, porque una variable importante para el modelo no siempre es la causa del resultado.

## Dónde encaja en empresas uruguayas

**Agroindustria y exportación.** Estimar margen o rendimiento por lote, segmentar destinos con K-Means según precio y volumen, y marcar registros de planta o de campo que se salen de rango antes de consolidar el mes.

**Servicios y zonas francas.** Empresas de servicios con muchos clientes pueden clasificar el riesgo de baja o de atraso y priorizar la gestión comercial.

**Retail y distribución.** Pronosticar ventas por local o por cliente mayorista para planificar compras, y usar reglas de asociación para armar combos o sugerencias de pedido.

**Finanzas internas.** Detección de anomalías en gastos, facturas de proveedores o asientos contables, como apoyo a la revisión de auditoría.

## Antes de anotarte

El curso pide que ya manejes Python. Un chequeo rápido:

- ¿Podés cargar un Excel con pandas y limpiar columnas?
- ¿Sabés agrupar y resumir datos con `groupby`?
- ¿Hiciste algún gráfico con matplotlib o seaborn?

Si la respuesta es sí a las tres, estás en condiciones de arrancar. Si no, el [curso de Python para datos en Uruguay](https://www.programbi.com/uy/cursos/python) es el paso previo recomendado.

## Errores frecuentes con muestras chicas

En empresas medianas, los datasets no siempre son enormes, y eso trae sus propios riesgos:

- **Modelos demasiado complejos para pocos datos.** Con algunos cientos de registros, un ensemble muy profundo puede sobreajustar. Empezá simple.
- **Validar con una sola partición.** Con pocos datos, el azar de la partición pesa mucho; la validación cruzada da una estimación más estable.
- **Demasiadas categorías.** Si tenés decenas de destinos con pocos casos cada uno, conviene agruparlos antes de modelar.
- **Olvidar la estacionalidad.** La zafra, las temporadas de exportación o las fiestas cambian los patrones; el modelo tiene que saberlo.

## Un plan realista para el primer proyecto

1. Elegí una decisión concreta que hoy se tome con intuición.
2. Juntá al menos un año de historia en una sola tabla.
3. Armá un modelo base simple y medí su error.
4. Probá un árbol o un ensemble y compará con validación cruzada.
5. Presentá el resultado en términos del negocio: kilos, pesos, horas ahorradas.

## Las métricas, en palabras simples

Medir bien es la mitad del trabajo, y el módulo 1 le dedica tiempo:

- **Error absoluto medio:** cuánto se equivoca el modelo en promedio, en las mismas unidades del negocio. "Erramos el margen por 3 pesos por kilo" se entiende en cualquier reunión.
- **Exactitud:** el porcentaje de aciertos; útil solo cuando las clases están equilibradas.
- **Precisión y sensibilidad:** cuando buscás algo poco frecuente, como un cliente que se va, importa cuántas alarmas son ciertas y cuántos casos reales se te escapan.
- **AUC:** resume qué tan bien el modelo ordena los casos de más a menos riesgo.

Antes de entrenar, definí qué cuesta más: una falsa alarma o un caso perdido. Esa respuesta te dice qué métrica mirar.

## Cómo aprovechar las 20 horas

Llegá con un problema propio en la cabeza, aunque sea chico. Cada técnica que veas, probala esa misma semana con tus datos, anonimizados si son de la empresa. Las preguntas que surgen con datos reales son las que más enseñan, y en una clase en vivo las podés hacer en el momento. Las grabaciones quedan para repasar con calma el fin de semana.

## Qué piden en el mercado

En LinkedIn y BuscoJobs, las búsquedas de científico de datos, analista de datos o analista de inteligencia de negocios en Uruguay suelen pedir Python y, a menudo, conocimientos de modelos predictivos; muchas también piden inglés. Tener un proyecto propio bien documentado —problema, datos, modelo, métrica, recomendación— es lo que más pesa al momento de la entrevista.

## Del modelo al tablero

El resultado de un modelo tiene que estar donde la gente mira. Lo habitual es guardar las predicciones en una tabla y mostrarlas en Power BI: margen estimado por lote, ranking de clientes por riesgo, alertas de anomalías. Para eso tenés el [curso de Power BI en Uruguay](https://www.programbi.com/uy/cursos/power-bi) y la [guía para aprender Power BI en Uruguay](/uy/guias/como-aprender-power-bi-en-uruguay).

**[CTA-MID]** — Descargá gratis la plantilla de dashboard de ventas.

## Horario y pago

Las clases son de 19:30 a 21:30 en Montevideo. Uruguay mantiene UTC-3 todo el año, igual que Argentina; como Chile cambia entre UTC-3 y UTC-4, la ficha aclara que la clase puede verse a las 19:30 o a las 20:30, según la época. La ficha de cada cohorte muestra la hora exacta. Se paga en pesos uruguayos con Mercado Pago Uruguay (tarjeta o Wallet) o transferencia bancaria.

## Ficha resumida

- 20 horas en 2 módulos: supervisado y no supervisado.
- En vivo por Zoom; cupos abiertos, fecha por confirmar.
- Grabaciones de por vida y certificado digital.
- Proyectos con datos reales.
- Instructor: Manuel Oliva, Magíster en Data Science (UAI).
- Precio: {precio_local}.

**Formas de pago:** los cursos de ProgramBI se pueden pagar en 3 cuotas sin interés, en todos los países.

**[CTA-END]** — {precio_local} · 19:30 a 21:30 · «Inscribirme» · «Hablar por WhatsApp».

## Preguntas frecuentes

**¿Cuánto cuesta el curso de Machine Learning en Uruguay?**
{precio_local}, en pesos uruguayos con Mercado Pago Uruguay o transferencia.

**¿Necesito saber Python?**
Sí. El curso es para quienes ya lo manejan.

**¿Cuándo arranca?**
La ficha muestra cupos abiertos con fecha por confirmar. Consultá por WhatsApp la próxima fecha.

**¿Sirve con datasets chicos?**
Sí, con cuidado: la validación cruzada que se ve en el módulo 1 es especialmente útil cuando hay pocos datos.

**¿Hay grabaciones y certificado?**
Sí: grabaciones con acceso de por vida y certificado digital al completar.

**¿Puedo usar datos de mi empresa?**
Sí, anonimizados. Trabajar sobre un problema propio, como el margen por lote o el riesgo de clientes, hace que el proyecto tenga valor inmediato en tu trabajo y sea fácil de mostrar.

**¿Qué viene después del curso?**
Lo lógico es llevar las predicciones a un tablero con Power BI, o profundizar en Python y SQL para automatizar la carga de datos del modelo.
