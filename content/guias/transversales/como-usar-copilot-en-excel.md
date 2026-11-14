---
title: "Cómo usar Copilot en Excel: requisitos y prompts útiles"
description: "Requisitos reales de Copilot en Excel (OneDrive, Tabla Ctrl+T, cálculo automático), prompts en español, Python en Excel y privacidad M365."
h1: "Cómo usar Copilot en Excel: requisitos reales y prompts efectivos"
country: transversal
lang: es
slug: como-usar-copilot-en-excel
path: /guias/como-usar-copilot-en-excel
updated: 2026-11-14
course: copilot
url_curso: https://www.programbi.com/cursos/copilot
sources:
  - https://support.microsoft.com/es-es/office/introducci%C3%B3n-a-copilot-en-excel-424d101d-fa47-497d-b0bc-1741e17d6092
  - https://support.microsoft.com/es-es/office/introducci%C3%B3n-a-python-en-excel-a33fbcbe-065b-41d3-82cf-23d05397f53d
  - https://support.microsoft.com/es-es/office/funci%C3%B3n-copilot-55b69c47-c0f1-4770-bda4-1bbf743c7b8d
  - https://www.programbi.com/cursos/copilot
  - https://www.programbi.com/cursos/excel
  - https://www.programbi.com/cursos/power-bi
nota_hermes: |
  ELEMENTO VISUAL: checklist de activación de Copilot en Excel (licencia M365 + OneDrive/SharePoint + Autoguardado + Tabla Ctrl+T + cálculo automático) y flujo panel lateral + Python en Excel.
---

# Cómo usar Copilot en Excel: requisitos reales y prompts efectivos

**Respuesta corta:** Para usar **Copilot en Excel** necesitas una licencia elegible de Microsoft 365 Copilot, guardar el libro en **OneDrive o SharePoint** con Autoguardado activo, mantener el modo de cálculo en **Automático** y estructurar tus datos como una **Tabla oficial de Excel (`Ctrl + T`)** o rango limpio con encabezados únicos. Además, ten en cuenta que Microsoft retiró la función experimental de celda `=COPILOT()` en septiembre de 2026, por lo que todo el trabajo con IA dentro de Excel se realiza ahora desde el **panel lateral de Copilot**.

Gran parte de la frustración inicial con Copilot en Excel ocurre porque el botón aparece atenuado o el asistente responde que no entiende el libro. Casi siempre se debe a uno de esos cuatro requisitos previos, no a la redacción del prompt.

<!-- CTA-TOP -->

## Checklist técnica: por qué no se activa Copilot en Excel

| Requisito técnico | Qué exige Microsoft | Solución rápida si falla |
| --- | --- | --- |
| Ubicación del archivo | Libro alojado en **OneDrive** o **SharePoint** (formatos `.xlsx`, `.xlsm` o `.xlsb`) | Sube el archivo desde el disco local a tu nube corporativa y activa **Autoguardado** |
| Estructura de datos | Datos dentro de una **Tabla de Excel (`Ctrl + T`)** o rango tabular limpio con una sola fila de encabezados únicos | Elimina celdas combinadas, subtotales intercalados y filas en blanco antes de convertir a Tabla |
| Opciones de cálculo | El libro debe estar configurado en **Cálculo Automático** | Ve a *Fórmulas > Opciones para el cálculo > Automático* |
| Licenciamiento | Suscripción compatible de Microsoft 365 + licencia **Microsoft 365 Copilot** asignada | Verifica en tu cuenta laboral con TI si tienes asignado el complemento Copilot |
| Flujo vigente | Uso exclusivo mediante el **panel lateral** (la función de celda `=COPILOT()` fue retirada el 14 de septiembre de 2026) | Reemplaza fórmulas heredadas `=COPILOT(...)` porque al recalcular devuelven `#NAME?` |

## Qué tareas sí resuelve bien desde el panel lateral

Una vez cumplidos los requisitos, abre el ícono de **Copilot** en la cinta superior (*Inicio*) y trabaja sobre una tabla específica:

- **Limpieza rápida (`Limpiar datos` / `@clean-data`):** desde la pestaña *Datos > Limpiar datos* o invocando `@clean-data` en el panel, detecta inconsistencias entre texto y número, espacios ocultos o variaciones tipográficas (por ejemplo, nombres de sucursal escritos con y sin tilde) y te deja aprobar cada cambio antes de aplicarlo.
- **Columnas de fórmulas explicadas:** genera columnas calculadas con `BUSCARX`, `SI.CONJUNTO` o `SUMAR.SI.CONJUNTO` mostrándote la fórmula sugerida antes de insertarla en la tabla.
- **Tablas dinámicas y gráficos:** crea borradores de tablas dinámicas o visualizaciones resumidas en hojas nuevas a partir de preguntas en español.
- **Análisis exploratorio con Python en Excel:** cuando una petición supera una fórmula tradicional (correlaciones, segmentación o gráficos estadísticos), Copilot puede apoyarse en **Python en Excel**.

<!-- CTA-MID -->

## Prompts probados en español para copiar en tu tabla

Para obtener resultados consistentes, nombra las columnas exactas de tu tabla y pide siempre que te muestre la lógica antes de modificar los datos:

```prompt
Sobre la tabla Ventas_2026: agrega una columna calculada llamada Margen_Pct usando las columnas Ingreso_Neto y Costo_Directo. Si Costo_Directo es 0 o vacío, devuelve 0 en lugar de error de división. Muéstrame la fórmula exacta antes de insertarla.
```

```prompt
Analiza la tabla Cartera_Clientes y crea en una hoja nueva una tabla dinámica que sume Saldo_Vencido por Ejecutivo y Tramo_Mora, ordenada de mayor a menor saldo vencido. Destaca los 3 ejecutivos con mayor concentración.
```

```prompt
Revisa las columnas Cliente y Ciudad en busca de inconsistencias de mayúsculas, espacios extra o montos guardados como texto en la columna Facturado, y propón las correcciones paso a paso antes de aplicar cambios.
```

## Python en Excel dentro de Copilot: ventajas y límites reales

Microsoft integró **Python en Excel** ejecutado de forma segura en la nube de Microsoft Cloud (con librerías estándar de analítica como `pandas`, `numpy`, `matplotlib` y `seaborn`), sin instalar nada en tu PC. Con Copilot puedes pedirle este tipo de análisis sin escribir el script manualmente, aunque conviene conocer sus límites prácticos:

- **Depende de conexión y cómputo en la nube:** libros muy pesados o recálculos constantes pueden tardar más que una fórmula nativa.
- **No sustituye un pipeline ETL ni un tablero compartido:** para combinar múltiples orígenes grandes, automatizar cierres diarios o aplicar seguridad por usuario, sigue siendo mejor complementar Excel con Power Query y [Power BI](/cursos/power-bi).
- **Auditoría obligatoria:** valida siempre una fila o subtotal conocido contra tu tabla dinámica tradicional antes de presentar cifras generadas mediante Python en Excel.

## Privacidad y licencias Microsoft 365: qué cuidar en tu empresa

En entornos empresariales con **Microsoft 365 Copilot**, Microsoft indica que los prompts, las respuestas y los archivos procesados dentro de tu tenant no se utilizan para entrenar los modelos fundacionales públicos y respetan los permisos ya configurados en SharePoint y OneDrive. Aun así, recuerda que Copilot **puede ver cualquier archivo al que tu usuario tenga acceso**, por lo que mantener una buena higiene de permisos en carpetas compartidas es tan importante como saber escribir buenos prompts.

Si todavía quieres reforzar fórmulas clásicas, Power Query y tablas dinámicas antes de sumar IA, revisa también nuestro [curso de Excel](/cursos/excel).

## Aprende Copilot en Excel y Copilot Studio en vivo

En ProgramBI dictamos el [curso de Copilot y Copilot Studio en vivo](/cursos/copilot) en **20 horas distribuidas en 1 único nivel (Intermedio-Avanzado)**, organizado en 5 módulos de 4 horas. El Módulo 1 aborda directamente **Copilot en Excel, Outlook, PowerPoint y Word**, y los Módulos 2 al 5 te llevan a diseñar, conectar conocimiento y publicar tus propios agentes en **Copilot Studio** con gobernanza empresarial, en clases en vivo por Zoom y grabaciones de por vida.

<!-- CTA-END -->

## Preguntas frecuentes

**¿Por qué me aparece deshabilitado el botón de Copilot en Excel?**
Las causas más habituales son cuatro: el archivo está guardado solo en tu computador y no en OneDrive o SharePoint, el Autoguardado está desactivado, los datos no están en una Tabla oficial de Excel (`Ctrl + T`) o el cálculo del libro está en modo Manual en lugar de Automático.

**¿Sigue funcionando la fórmula `=COPILOT()` dentro de las celdas?**
No. Microsoft retiró permanentemente la función experimental `=COPILOT()` el 14 de septiembre de 2026. Las hojas que aún la contengan no se actualizarán y mostrarán `#NAME?` al recalcular; debes trasladar esas tareas al panel lateral de Copilot.

**¿Necesito una licencia adicional aparte de Microsoft 365 para usar Copilot en Excel?**
Sí. Además de una suscripción compatible de Microsoft 365, necesitas tener asignada una licencia de **Microsoft 365 Copilot** (o plan elegible que incluya Copilot en aplicaciones de Office).

**¿Copilot en Excel funciona si mis datos no tienen formato de Tabla?**
Funciona mucho mejor y habilita más funciones (como limpieza y columnas calculadas) cuando conviertes el rango con `Ctrl + T`. Si trabajas con rangos sueltos, deben tener encabezados claros en la primera fila, sin celdas combinadas ni filas vacías intermedias.

**¿Puedo usar Copilot en Excel para Mac o en Excel Web?**
Sí, Microsoft soporta Copilot en Excel para Windows, Mac y Excel en la web, aunque algunas funciones nuevas o capacidades avanzadas de edición se despliegan progresivamente según canal de actualización y tipo de licencia.

**¿Qué diferencia al curso de Copilot de ProgramBI del uso básico en Excel?**
El curso dura **20 horas en un único nivel** y no se queda solo en prompts básicos de Office: dedica el primer módulo a Excel, Outlook, PowerPoint y Word, y los cuatro siguientes a construir y gobernar agentes propios con **Copilot Studio**.
