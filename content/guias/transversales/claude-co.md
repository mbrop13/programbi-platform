---
title: "Claude para análisis de datos en Colombia: guía práctica"
description: "Prompts en español para auditar facturas DIAN, depurar hojas de Excel y resumir KPIs en COP con Claude, cuidando tus datos según la Ley 1581."
h1: "Cómo usar Claude para análisis de datos en Colombia paso a paso"
country: co
lang: es-CO
slug: como-usar-claude-para-analisis-de-datos
path: /co/guias/como-usar-claude-para-analisis-de-datos
updated: 2026-11-14
course: claude
url_curso: https://www.programbi.com/co/cursos/claude
sources:
  - https://www.anthropic.com/claude
  - https://support.claude.com/
  - https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=49981
  - https://www.programbi.com/co/cursos/claude
  - https://www.programbi.com/co/cursos/power-bi
  - https://www.programbi.com/co/cursos/analisis-de-datos
nota_hermes: |
  ELEMENTO VISUAL: arquitectura práctica en Colombia (protección Habeas Data Ley 1581 -> auditoría de CSV/Excel DIAN en COP -> extracción de fórmulas/Python/DAX -> tablero Power BI).
---

# Cómo usar Claude para análisis de datos en Colombia paso a paso

**Respuesta corta:** Claude te ayuda a diagnosticar hojas de Excel, detectar inconsistencias entre reportes contables y facturación DIAN, escribir fórmulas avanzadas y redactar resúmenes gerenciales en pesos colombianos (COP) sin escribir código manual. Para usarlo de forma responsable en Colombia, anonimiza cédulas, datos de contacto y nómina según la Ley 1581 de 2012, valida el plan contratado con tu empresa y verifica cada cifra resultante frente a tu sistema fuente.

En áreas administrativas, financieras y comerciales de Bogotá, Medellín o Cali, gran parte del esfuerzo previo a un informe se va limpiando archivos exportados con miles de filas en formato inconsistente, revisando bases de IVA del 19 % o cruzando facturas electrónicas. Un flujo ordenado con Claude reduce ese trabajo manual repetitivo sin ceder el criterio analítico.

<!-- CTA-TOP -->

## Dónde aporta valor real en empresas de Colombia

| Proceso frecuente | Qué resuelve Claude | Control humano indispensable |
| --- | --- | --- |
| Revisión de facturación electrónica DIAN | Cruce por prefijo/número, CUFE faltante o bases de IVA 19 % | Confirmar notas crédito y retenciones en el software contable |
| Depuración de terceros y NIT | Detectar NIT repetidos por guiones, espacios o dígito de verificación | Validar en el RUT antes de fusionar maestros de clientes |
| Fórmulas complejas en Excel | Generar `BUSCARX`, `FILTRAR` o `SUMAR.SI.CONJUNTO` explicadas | Comprobar dos registros reales contra la tabla dinámica |
| Reportes de desempeño por regional | Comparar sedes Bogotá, Medellín y Cali en millones de COP | Verificar estacionalidad o cierres de campaña con el área comercial |
| Diseño previo de reportes gerenciales | Sugerir tablas de hechos/dimensiones y medidas DAX comentadas | Llevar el modelo automatizado a [Power BI](/co/cursos/power-bi) |

## Plantilla de prompt para auditoría financiera en COP

Un pedido abierto genera texto genérico; uno con rol claro, moneda local, formato estricto y reglas de freno evita alucinaciones:

```prompt
Eres analista senior de control interno en una comercializadora B2B de Bogotá (cifras en COP).
Archivo adjunto: auxiliar_facturacion_dian.xlsx.
Revisa únicamente las columnas Subtotal, IVA_19, ReteFuente y Total_COP:
1) Marca las facturas donde IVA_19 se desvíe más de $500 COP respecto al 19 % del Subtotal.
2) Lista los NIT que aparezcan escritos con formatos diferentes en la misma razón social.
Formato de salida: una tabla resumen ordenada por mayor diferencia absoluta en COP y una lista de máximo 5 acciones de corrección en Excel.
Restricción: no recalcules ni completes celdas vacías por tu cuenta; señala cualquier fila sin Subtotal como "DATO INCOMPLETO".
```

<!-- CTA-MID -->

## Ejemplo práctico: informe mensual de cartera entre Bogotá y Medellín

Así puedes estructurar una rutina real de cierre semanal sin depender de programación:

1. **Seudonimiza antes de cargar.** Reemplaza nombres propios de personas naturales, números de cédula y correos por códigos internos (`TERCERO_001`) si trabajas en una cuenta individual.
2. **Diagnóstico rápido de calidad.** Pide a Claude: *«Inspecciona el archivo adjunto, enumera errores de formato en fechas o separadores de miles COP y dime cuántas filas afecta cada problema»*.
3. **Generación de fórmulas auditables.** En lugar de pedirle el archivo corregido a ciegas, solicita: *«Dame la fórmula de Excel en español para clasificar la cartera vencida en rangos de 0-30, 31-60, 61-90 y >90 días, explicando cada parámetro»*.
4. **Lectura ejecutiva con Artifacts.** Usa **Artifacts** para armar un borrador interactivo de tabla comparativa entre la operación de Bogotá y la de Medellín y detectar qué segmento concentra el atraso.
5. **Validación final contra ERP.** Contrasta el saldo total de cartera vencida con el balance oficial antes de compartir el resumen con gerencia.

## Projects: memoria compartida para procesos recurrentes

Cuando el equipo repite cierres quincenales, reportes de nómina consolidada o seguimiento a presupuestos por regional, conviene crear un **Project**. Dentro del Project puedes adjuntar el diccionario de cuentas, criterios contables internos (por ejemplo, cuándo se excluyen devoluciones de producto) y una plantilla de informe aprobado. De ese modo, cada miembro del área parte del mismo estándar en vez de redactar instrucciones desde cero.

## Cumplimiento y privacidad bajo la Ley 1581 de 2012

La **Ley 1581 de 2012** (Régimen General de Protección de Datos Personales en Colombia) exige cuidado especial al tratar información de titulares identificados o identificables:

- **Consulta primero con TI y Cumplimiento:** los entornos empresariales de Claude (Team y Enterprise) excluyen por contrato los datos del cliente del entrenamiento de modelos; en cuentas personales revisa la configuración de privacidad y evita cargar bases sensibles.
- **Principio de minimización:** si tu objetivo es depurar montos o encontrar duplicados de facturas, elimina columnas de teléfono, dirección o cédula antes de subir el Excel.
- **Responsabilidad profesional:** la IA redacta y calcula borradores; la firma del informe o declaración ante la DIAN siempre recae en el responsable del proceso.

## Puente hacia Excel avanzado, Power BI y Analítica

Claude acorta el camino entre una base desordenada y un análisis limpio, pero los tableros corporativos conectados a múltiples orígenes requieren modelado y actualización automática. Por eso muchos analistas en Colombia combinan el uso diario de IA con el [curso de Power BI en Colombia](/co/cursos/power-bi) o el recorrido completo de [Análisis de datos](/co/cursos/analisis-de-datos) (SQL, Power BI y Python).

## Curso de Claude en vivo desde Colombia con ProgramBI

En ProgramBI dictamos el [curso de Claude en vivo](/co/cursos/claude) en **20 horas distribuidas en un único nivel completo** (5 módulos de 4 horas): fundamentos y privacidad de datos, ingeniería de prompts en español, Projects/Artifacts/Slides, **Claude integrado a Excel y tareas administrativas**, y flujos de automatización cotidiana aplicados a un caso real de tu trabajo.

Las clases son en vivo por Zoom los **lunes y miércoles de 17:30 a 19:30, hora de Colombia**, guiadas por **Manuel Oliva** (Magíster en Data Science), con grabaciones de por vida y certificado al finalizar. Consulta los próximos inicios mensuales y el valor vigente en COP (con pago por PSE, Nequi, Mercado Pago Colombia o transferencia) en la [guía del curso Claude en Colombia](/co/guias/curso-claude-colombia) o en la ficha oficial del curso.

<!-- CTA-END -->

## Preguntas frecuentes

**¿Claude sirve para revisar archivos exportados del portal DIAN o del software contable?**
Sí. Puedes adjuntar reportes en `.csv` o `.xlsx` para ubicar diferencias en IVA, prefijos o terceros repetidos; asegúrate de ocultar datos personales cubiertos por la Ley 1581 y cotejar siempre el total en tu sistema contable.

**¿El curso de Claude tiene niveles Básico y Avanzado?**
No. Es un **único nivel de 20 horas** (5 módulos de 4 horas) pensado para pasar de cero a casos prácticos de oficina con Excel, Projects y automatización ligera.

**¿A qué hora se dictan las clases para Colombia?**
Los lunes y miércoles de **17:30 a 19:30 (hora de Colombia)** en modalidad 100 % en vivo por Zoom, con grabaciones de por vida en la plataforma.

**¿Cómo se realiza el pago desde Colombia en ProgramBI?**
La ficha del curso para Colombia muestra el arancel en pesos colombianos (`COP`) e incluye medios locales como PSE, Nequi, Mercado Pago Colombia y transferencia.

**¿Claude escribe fórmulas de Excel compatibles con configuración regional en español?**
Sí, siempre que se lo indiques en el prompt (por ejemplo, nombres de funciones en español como `BUSCARX` y separador punto y coma si tu equipo lo usa).

**¿Puedo pasar los resultados de Claude directamente a Power BI?**
Sí. Puedes pedirle scripts de Power Query (M) o medidas DAX documentadas para pegarlas y probarlas dentro de Power BI Desktop.
