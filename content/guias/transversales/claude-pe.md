---
title: "Claude para análisis de datos en Perú: guía práctica"
description: "Aprende a limpiar planillas, conciliar comprobantes SUNAT y crear fórmulas de Excel con Claude. Ejemplos en soles (PEN) y reglas de privacidad."
h1: "Cómo usar Claude para análisis de datos en Perú sin saber programar"
country: pe
lang: es-PE
slug: como-usar-claude-para-analisis-de-datos
path: /pe/guias/como-usar-claude-para-analisis-de-datos
updated: 2026-11-14
course: claude
url_curso: https://www.programbi.com/pe/cursos/claude
sources:
  - https://www.anthropic.com/claude
  - https://support.claude.com/
  - https://www.gob.pe/institucion/congreso-de-la-republica/normas-legales/243470-29733
  - https://www.programbi.com/pe/cursos/claude
  - https://www.programbi.com/pe/cursos/power-bi
  - https://www.programbi.com/pe/cursos/analisis-de-datos
nota_hermes: |
  ELEMENTO VISUAL: flujo de trabajo en 4 etapas (anonimizar datos según Ley 29733 -> auditar Excel/SUNAT en soles -> diseñar fórmulas/DAX -> validar totales manualmente).
---

# Cómo usar Claude para análisis de datos en Perú sin saber programar

**Respuesta corta:** Claude te permite revisar archivos de Excel o CSV en segundos, encontrar comprobantes SUNAT descuadrados, generar fórmulas complejas y redactar reportes ejecutivos en soles (PEN) usando instrucciones en español. Funciona como copiloto de preparación y lectura de datos: no reemplaza a Power BI ni la revisión contable final, y antes de subir bases con datos personales en Perú conviene anonimizar nombres, DNI y RUC de personas naturales conforme a la Ley 29733.

En equipos comerciales, contables y de operaciones en Lima o Arequipa, buena parte del tiempo semanal se pierde ordenando exportaciones de ERP, unificando códigos de sucursal o buscando diferencias en el IGV antes de poder analizar nada. Con instrucciones bien estructuradas, Claude acelera esa etapa previa para que dediques tu jornada a interpretar cifras y tomar decisiones.

<!-- CTA-TOP -->

## Qué tareas operativas resuelve Claude con planillas en soles

| Necesidad habitual en oficina | Qué le pides a Claude | Qué debes validar tú después |
| --- | --- | --- |
| Cruzar Registro de Ventas (RVIE/SIRE) con caja o ERP | Detectar series F001/B001 faltantes o montos PEN distintos | Confirmar en el sistema fuente las notas de crédito del periodo |
| Estandarizar bases con texto desordenado | Reglas para separar distrito, razón social o formato `S/` | Revisar en Excel una muestra de filas modificadas |
| Armar fórmulas sin recordar la sintaxis | Fórmulas `BUSCARX`, `SI.CONJUNTO` o `SUMAR.SI.CONJUNTO` comentadas | Probar la fórmula sobre un total conocido |
| Explicar variaciones de margen por sede | Tabla comparativa Lima vs. Arequipa y borrador para gerencia | Contrastar hipótesis con inventarios o campañas reales |
| Preparar un tablero periódico | Esquema de tablas de hechos y dimensiones o medidas DAX | Implementar y programar actualización en [Power BI](/pe/cursos/power-bi) |

## Anatomía de una instrucción precisa para datos comerciales

Cuando una consulta queda vaga («revisa este Excel y dime qué opinas»), el modelo responde con obviedades. En cambio, al fijar escenario, archivo, formato de salida y límites explícitos, obtienes tablas auditables desde el primer intento:

```prompt
Actúa como controlador financiero de una distribuidora en Lima (montos expresados en soles PEN sin IGV).
Adjunto el cruce mensual entre despachos de almacén Callao y facturación electrónica.
Identifica: 1) guías de remisión sin factura asociada, 2) facturas con diferencia mayor a S/ 50 respecto al valor guía, 3) clientes duplicados por espacios o puntos en la razón social.
Entrega tres tablas separadas en Markdown y cierra con el total neto pendiente por conciliar.
No asumas causas ni completes importes vacíos; marca cualquier campo ilegible como "REVISAR EN ERP".
```

<!-- CTA-MID -->

## Caso guiado en Perú: conciliación previa al cierre de IGV

Imagina una empresa comercializadora con tiendas en Lima Metropolitana y una sede en Arequipa que consolida ventas mensuales antes de declarar el IGV (18 %):

1. **Retira identificadores sensibles primero.** Elimina columnas con DNI, teléfonos de contacto o direcciones domiciliarias antes de cargar la hoja, especialmente si trabajas desde una cuenta individual.
2. **Mapea la estructura del archivo.** Pídele: *«Lista nombres de columnas, tipos de dato detectados y filas donde la fecha no siga el orden dd/mm/aaaa o el monto en soles aparezca como texto»*.
3. **Solicita pasos reproducibles en Excel o Power Query.** En vez de dejar que modifique valores en silencio, pide la secuencia exacta de transformación o la fórmula de validación del 18 % de IGV para aplicarla dentro de tu propio libro.
4. **Compara sedes sin inventar explicaciones.** *«Agrupa ventas netas en PEN por sede (Miraflores, San Isidro, Ate, Arequipa) comparando este mes contra el anterior; separa datos observados de posibles hipótesis comerciales»*.
5. **Transforma el resultado en visualizaciones con Artifacts.** Pide un resumen tabular o un gráfico exploratorio rápido dentro de Artifacts para validar tendencias antes de construir el reporte definitivo en Power BI.

## Uso de Projects para procesos que se repiten cada mes

Si todos los meses repites el mismo cuadre de cobranzas, planillas de comisiones o control presupuestal, crea un **Project** dedicado. Allí puedes dejar cargadas las reglas internas de negocio —por ejemplo, cómo clasifican ventas mayoristas vs. canal moderno, o qué centros de costo pertenecen a Arequipa— junto con un ejemplo anónimo del entregable aprobado por gerencia. Así evitas volver a explicar definiciones en cada conversación nueva.

## Reglas de privacidad y verificación obligatoria (Ley 29733)

Anthropic establece en su documentación de soporte que los planes comerciales (Team y Enterprise) no utilizan la información cargada para entrenar modelos, mientras que en cuentas personales conviene revisar tus ajustes de privacidad antes de trabajar. En el contexto peruano, la **Ley N.° 29733** de Protección de Datos Personales exige resguardar datos identificables de clientes y colaboradores:

- **Nunca subas bases crudas de planilla, DNI o clientes persona natural** a una cuenta personal sin autorización formal de Seguridad de la Información o TI.
- **Trabaja con códigos internos anonimizados** (`ID_CLI_041`) en lugar de nombres completos cuando necesites depurar fórmulas o detectar atípicos.
- **Cuadra siempre los totales generales** (venta gravada, IGV 18 % y total comprobante) contra tu ERP o portal SUNAT antes de emitir reportes oficiales.

## Del análisis puntual en Claude al ecosistema profesional de datos

Claude destaca en la exploración inicial, la escritura de fórmulas, la creación de scripts de limpieza y la síntesis escrita. Cuando tu área necesita actualizar tableros diarios conectados a bases SQL o compartir indicadores por roles en la nube, el siguiente paso natural es combinarlo con el [curso de Power BI en Perú](/pe/cursos/power-bi) o el programa integral de [Análisis de datos](/pe/cursos/analisis-de-datos).

## Formación en vivo para equipos de Perú en ProgramBI

El [curso de Claude en vivo](/pe/cursos/claude) de ProgramBI tiene **20 horas prácticas en 1 solo nivel completo** (5 módulos de 4 horas): arranque seguro y privacidad, diseño de prompts profesionales, Projects y Artifacts, **Claude aplicado a Excel y flujos administrativos**, y automatización cotidiana con proyecto final sobre un archivo real de tu área.

Las sesiones son **lunes y miércoles de 17:30 a 19:30, hora de Perú**, por Zoom con **Manuel Oliva** (Magíster en Data Science), grabaciones disponibles de por vida y certificado digital. Puedes revisar la fecha mensual vigente, el temario completo y el arancel en soles (pagable con Yape, Plin, Mercado Pago Perú o transferencia) en la [guía del curso Claude en Perú](/pe/guias/curso-claude-peru) o descargando el PDF oficial en la ficha del curso.

<!-- CTA-END -->

## Preguntas frecuentes

**¿Claude puede analizar archivos Excel descargados de SUNAT o de mi ERP?**
Sí. Acepta archivos `.xlsx` y `.csv` para inspeccionar columnas, detectar duplicados y generar fórmulas; recuerda retirar datos personales según la Ley 29733 y validar siempre los totales finales en tu hoja original.

**¿El curso de Claude de ProgramBI tiene varios niveles o es un programa único?**
Es un programa único de **20 horas** dividido en 5 módulos de 4 horas, diseñado para avanzar desde cero hasta automatizaciones prácticas sin conocimientos de programación.

**¿En qué horario se dictan las clases para Perú?**
Se dictan en vivo por Zoom los lunes y miércoles de **17:30 a 19:30 (hora de Perú)**, con inicios todos los meses y acceso permanente a todas las grabaciones.

**¿Puedo pagar el curso en soles usando Yape o Plin?**
Sí. La ficha oficial de Perú muestra el valor actualizado en soles (`S/`) y habilita pago mediante Yape, Plin, Mercado Pago Perú o transferencia bancaria.

**¿Sirve Claude para aprender o acelerar medidas DAX en Power BI?**
Sí. Puedes pasarle la estructura de tus tablas para que te sugiera medidas DAX comentadas y luego validarlas dentro de Power BI Desktop.

**¿Cómo protejo la confidencialidad financiera de mi empresa al usar Claude?**
Valida con tu área de TI qué licencia utilizan, desactiva opciones de entrenamiento si aplican en cuentas individuales y sustituye razones sociales sensibles o DNI por códigos internos antes de adjuntar archivos.
