---
# ============================================================================
# PLANTILLA DE GUÍA CURSO × PAÍS
# ============================================================================
# Copia este archivo, quita el guion bajo del nombre y reemplaza los valores.
# Los archivos que empiezan con "_" NO se publican: scripts/build-guias.mjs los
# ignora por completo. El nombre del archivo no forma la URL; la forma el slug.
#
# Flujo: copia → edita → `node scripts/build-guias.mjs` → `--check` → commit.
# Documentación completa: docs/PLANTILLA_GUIAS.md
#
# Campos obligatorios: slug, ruta_sugerida, pais, hreflang, curso, title, meta,
# h1, updated. Recomendados: url_curso, sources, nota_hermes.
# Opcionales: layout, publicar.
# ============================================================================

# slug: identificador único y estable. Forma la URL y NO se cambia después de
# publicar. Convención: curso-<curso>-<pais>; el último segmento de la ruta debe
# ser exactamente este valor.
slug: curso-<curso>-<pais>

# ruta_sugerida: /guias/<slug> para Chile y para guías transversales (latam);
# /<pais>/guias/<slug> para el resto de los países de config/paises.ts.
ruta_sugerida: /<pais>/guias/curso-<curso>-<pais>

# pais: ISO de config/paises.ts (cl, ar, bo, co, cr, ec, sv, gt, hn, mx, ni, pa,
# py, pe, do, uy, ve) o latam para una guía sin variante por mercado. El build
# normaliza latam → transversal. Un ISO que no exista es error de validación.
pais: <pais>

# hreflang: BCP 47 del mercado (es-CL, es-AR, es-MX, es-CO, es-PE, es-UY…) o
# "es" si es una única versión en español. Se usa en <html lang>, en el JSON-LD
# y en los alternates recíprocos cuando hay variantes por país.
hreflang: es-<PAIS>

# curso: slug del curso al que empuja la guía. Debe existir en SLUGS_CURSO de
# config/paises.ts: analisis-de-datos, power-bi, python, sql-server, excel,
# copilot, claude, access, power-automate, machine-learning, ia-productividad,
# mercado-financiero, analitica-mineria. Un curso desconocido ("general", etc.)
# hace que el archivo se omita con aviso, no que el build falle.
curso: <curso>

# url_curso: URL real de la ficha del curso en ese mercado. Se usa en el
# JSON-LD (about → Course) y en el CTA. Si no existe la ficha local, usa la de
# Chile o la del catálogo; no inventes una URL.
url_curso: https://www.programbi.com/<pais>/cursos/<curso>

# layout (opcional): comparativa | certificacion | sueldos | curso. Si falta, se
# usa el render estándar de guía. Para curso × país puedes dejarlo comentado.
# layout: curso

# publicar (opcional): false deja la guía fuera del build sin borrar el archivo.
# publicar: false

# title: máximo 60 caracteres. Se usa como <title> absoluto (sin sufijo del
# layout). Si supera 60, el build lo reporta como aviso.
title: "Curso de <Curso> en <País> | ProgramBI"

# meta: 150–160 caracteres. Se usa como meta description y en Open Graph.
meta: "Curso de <Curso> en <País>: <horas> en vivo, temario, horarios y precio local. <CTA>."

# h1: un solo H1, distinto del title. Debe repetirse como primer "#" del cuerpo;
# el renderizador quita ese primer H1 para no duplicarlo.
h1: "Curso de <Curso> en <País>: <beneficio concreto>, en vivo"

# updated: fecha ISO YYYY-MM-DD de la última revisión de datos. Se muestra como
# «Actualizado el …» y alimenta dateModified del JSON-LD.
updated: 2026-11-04

# sources: URLs reales consultadas. Se muestran al pie y como citation del
# Article. No inventes fuentes; si no hay, deja el campo fuera.
sources:
  - https://www.programbi.com/<pais>/cursos/<curso>
  - https://<fuente-oficial-consultada>

# nota_hermes: instrucciones internas para Pluma/Radar. No se publica tal cual.
# Incluye SIEMPRE una línea "ELEMENTO VISUAL:" con la tabla, gráfico o checklist
# que debe verse; el renderizador la muestra como «Lo que vas a ver en esta guía».
nota_hermes: |
  ELEMENTO VISUAL: tabla de 3 columnas (módulo · contenido · entregable) + checklist de requisitos previos.
  Intención: "<keyword principal>", "<keyword secundaria>" → click_registro en /<pais>/cursos/<curso>.
  - PRECIO: usa {precio_local}; no escribas cifras a mano.
  - FECHA: revisar la ficha antes de publicar; si no hay cohorte, decir «cupos abiertos».
  - Primeros dos párrafos = respuesta citable (GEO). Schema Article + FAQPage + BreadcrumbList.
  - WhatsApp: "Hola, vengo de la guía de <Curso> para <País> en programbi.com y quiero info del curso en vivo".
---

# Curso de <Curso> en <País>: <beneficio concreto>, en vivo

**Respuesta corta:** el [curso de <Curso> de ProgramBI](https://www.programbi.com/<pais>/cursos/<curso>) son **<N> horas en vivo por Zoom**, en **<N> módulos**, para <público objetivo>. Incluye grabaciones de por vida, certificado y <proyecto o práctica>. Cuesta **{precio_local}** y <estado de la cohorte>. Datos revisados en la ficha el <fecha>.

<Segundo párrafo: qué problema resuelve, para quién es y qué sale sabiendo hacer. Sin promesas que no estén en la ficha.>

<!-- Los CTA se escriben en su propia línea con este formato exacto. El build
     reemplaza toda la línea por el marcador interno CTA-TOP y el componente
     inserta el bloque real con el precio y el enlace al curso. Puedes cambiar
     el copy de apoyo; lo que importa es el marcador **[CTA-TOP]** al inicio. -->
**[CTA-TOP]** — ¿Quieres ver el temario completo? · {precio_local} · «Ver el curso».

## Por qué <Curso> en <País>

<Contexto del mercado local con datos citables: sectores que contratan, herramientas que piden, problema típico. Dos o tres párrafos.>

## Qué incluye el curso

1. **<Módulo 1>.** <Qué se aprende y con qué ejercicio.>
2. **<Módulo 2>.** <Qué se aprende y con qué ejercicio.>
3. **<Módulo 3>.** <Qué se aprende y con qué ejercicio.>
4. **<Módulo 4>.** <Qué se aprende y con qué ejercicio.>

## Temario y ejemplo práctico

<Tabla o lista con el temario. Incluye un ejemplo aplicado al país o al puesto objetivo.>

| Módulo | Contenido | Entregable |
|---|---|---|
| 1 | <contenido> | <entregable> |
| 2 | <contenido> | <entregable> |
| 3 | <contenido> | <entregable> |

## Precio, fechas y modalidad

- **Precio:** {precio_local}. <Formas de pago vigentes en la ficha.>
- **Inicio:** <fecha o «cupos abiertos»>.
- **Horario:** <días y hora local del país>.
- **Modalidad:** en vivo por Zoom, con grabaciones de por vida en el campus.
- **Certificado:** al completar el curso.

**[CTA-MID]** — Descarga el temario o consulta disponibilidad por WhatsApp.

## Para quién es (y para quién no)

<Sí: perfiles que se benefician. No: perfiles que necesitan otro curso o nivel.>

## Errores típicos al empezar

- **<Error 1>.** <Cómo lo evita el curso.>
- **<Error 2>.** <Cómo lo evita el curso.>
- **<Error 3>.** <Cómo lo evita el curso.>

## Después de <Curso>, ¿qué sigue?

- <Siguiente curso o guía interna, con enlace.>
- <Recurso complementario, con enlace.>

**[CTA-END]** — {precio_local} · <estado de la cohorte> · «Inscribirme» · «Escribir por WhatsApp».

## Preguntas frecuentes

<!-- Formato obligatorio: pregunta en negrita terminada en "?" y respuesta en
     el párrafo siguiente. El generador extrae este bloque para el FAQPage.
     Mínimo recomendado: 4 preguntas. Aquí van 6 de ejemplo. -->

**¿Cuánto cuesta el curso de <Curso> en <País>?**
{precio_local}; confirma en la ficha las formas de pago vigentes.

**¿Cuándo empieza y en qué horario?**
<Respuesta con fecha y horario local, o «cupos abiertos»; no inventes cohortes.>

**¿Necesito experiencia previa?**
<Respuesta según el requisito real de la ficha.>

**¿Qué incluye además de las clases?**
Grabaciones de por vida, certificado y <proyecto, comunidad o material>.

**¿Puedo pagar en cuotas?**
<Respuesta según la ficha del país; no generalices si no aplica.>

**¿Sirve si trabajo en <sector local>?**
<Ejemplo concreto de aplicación y qué entregable sale sabiendo hacer.>

<!-- ============================================================================
     LISTA DE COMPROBACIÓN ANTES DE PUBLICAR
     ============================================================================
     [ ] Copié el archivo y quité el "_" inicial del nombre.
     [ ] slug estable y igual al último segmento de ruta_sugerida.
     [ ] pais existe en config/paises.ts; Chile/transversal usa /guias/.
     [ ] curso existe en SLUGS_CURSO (no "general" ni inventados).
     [ ] title ≤ 60 caracteres y distinto del h1.
     [ ] meta entre 150 y 160 caracteres, sin promesas no verificadas.
     [ ] El primer "#" del cuerpo coincide exactamente con h1.
     [ ] Hay 4+ preguntas bajo "## Preguntas frecuentes", en negrita y con "?".
     [ ] Están los tres CTA (TOP, MID, END) y ningún monto escrito a mano.
     [ ] {precio_local} aparece donde corresponde; no hay cifras locales fijas.
     [ ] nota_hermes tiene "ELEMENTO VISUAL:" y fuentes reales en sources.
     [ ] updated es la fecha real de revisión.
     [ ] `node scripts/build-guias.mjs` publica la guía y `--check` da OK.
     [ ] La guía aparece en /guias o /<pais>/guias y el sitemap la incluye.
     ============================================================================ -->
