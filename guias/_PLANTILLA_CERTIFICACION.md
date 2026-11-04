---
# PLANTILLA de certificación (ejemplo PL-300). Archivo omitido por el build
# porque empieza con "_". Copia, renombra sin guion bajo y reemplaza valores.
#
# slug: estable; forma la URL. Para certificaciones globales no lleva país.
slug: certificacion-<examen>-<tema>
# ruta_sugerida: /guias/<slug> (Chile y transversales).
ruta_sugerida: /guias/certificacion-<examen>-<tema>
# pais: usa cl o latam; la certificación es global.
pais: cl
# hreflang: "es" para una guía única en español, sin variantes por país.
hreflang: es
# curso: curso al que empuja la guía (power-bi, analisis-de-datos…).
curso: power-bi
# url_curso: ficha del curso relacionado.
url_curso: https://www.programbi.com/cursos/<curso>
# layout: certificacion.
layout: certificacion
# publicar: false opcional para dejar la guía en borrador.
# publicar: false
title: "Certificación <EXAMEN>: guía <año> | ProgramBI"
meta: "Guía de la certificación <EXAMEN>: temario oficial, duración, puntaje, renovación y cómo prepararte."
h1: "Certificación <EXAMEN>: qué evalúa, cómo es el examen y cómo prepararte"
updated: 2026-11-04
sources:
  - https://learn.microsoft.com/es-es/credentials/certifications/<slug-oficial>/
  - https://learn.microsoft.com/es-es/credentials/certifications/resources/study-guides/<examen>
  - https://www.programbi.com/cursos/<curso>
# nota_hermes: instrucciones internas. Incluye ELEMENTO VISUAL obligatorio.
nota_hermes: |
  ELEMENTO VISUAL: gráfico de barras con el peso de cada área del examen + tabla «Qué cubre el curso vs. qué estudiar aparte».
  Intención: "<examen>", "cómo prepararse para <examen>" (informacional) → click_registro en /cursos/<curso> (secundario).
  - Datos del examen: únicamente desde la guía de estudio oficial de Microsoft Learn, con fecha de consulta.
  - No publicar el precio del examen (Microsoft lo fija por país): enlazar a Learn.
  - No afirmar que el curso es oficial ni garantizar la aprobación.
  - hreflang "es" único; el examen es global.
  - Revisar el registro de cambios cada 3 meses.
  - Schema Article + FAQPage + BreadcrumbList, sin Course/Offer.
  - WhatsApp: "Hola, vengo de la guía de la certificación <EXAMEN> en programbi.com y quiero info del curso".
---

# Certificación <EXAMEN>: qué evalúa, cómo es el examen y cómo prepararte

**Respuesta corta:** la <EXAMEN> otorga la certificación **<nombre oficial>**. Es de nivel **<nivel>**, dura **<minutos> minutos**, se aprueba con **<puntaje> puntos o más** y evalúa <N> áreas: <área 1> (<peso>), <área 2> (<peso>), <área 3> (<peso>) y <área 4> (<peso>). Se renueva cada **<meses>** con <condiciones de renovación>. Datos consultados en Microsoft Learn el <fecha>.

<Segundo párrafo: para quién tiene sentido certificarse y qué NO garantiza el certificado.>

**[CTA-TOP]** — Prepara la <EXAMEN> con el curso de <Curso> · «Ver el curso».

## Qué es la <EXAMEN> y a quién le sirve

<Definición oficial, perfil objetivo y utilidad real en el mercado. Sin inventar tasas de aprobación ni salarios.>

## Las áreas que evalúa el examen

| Área | Peso | Qué se evalúa |
|---|---|---|
| <Área 1> | <25-30 %> | <contenido> |
| <Área 2> | <25-30 %> | <contenido> |
| <Área 3> | <25-30 %> | <contenido> |
| <Área 4> | <15-20 %> | <contenido> |

<ELEMENTO VISUAL sugerido: gráfico de barras con estos pesos.>

## Formato del examen

- **Duración:** <minutos> minutos.
- **Puntaje de aprobación:** <puntaje>.
- **Idiomas:** <idiomas disponibles, incluido español si aplica>.
- **Renovación:** <cada N meses, condiciones>.
- **Reintento:** <política oficial>.
- **Precio:** lo fija Microsoft por país; consulta la página oficial.

## Cómo prepararte en <N> semanas

1. **Semana 1-2.** <Área y práctica.>
2. **Semana 3-4.** <Área y práctica.>
3. **Semana 5-6.** <Área y práctica.>
4. **Semana 7-8.** <Simulacro y repaso.>

**[CTA-MID]** — <Descarga el temario / conoce el curso de <Curso>>.

## Qué cubre el curso y qué estudiar aparte

| Tema del examen | Curso de ProgramBI | Estudio adicional |
|---|---|---|
| <tema> | <sí / parcial> | <recurso oficial> |
| <tema> | <sí / parcial> | <recurso oficial> |

## Errores típicos al rendir la <EXAMEN>

- **<Error 1>.** <Cómo evitarlo.>
- **<Error 2>.** <Cómo evitarlo.>
- **<Error 3>.** <Cómo evitarlo.>

**[CTA-END]** — <Curso de <Curso>> · «Inscribirme» · «Escribir por WhatsApp».

## Preguntas frecuentes

**¿Cuánto cuesta el examen <EXAMEN>?**
Microsoft fija el precio por país; revisa la página oficial de la certificación.

**¿Cuánto dura y cuántos puntos necesito para aprobar?**
<minutos> minutos y <puntaje> puntos, según la guía de estudio vigente.

**¿La certificación caduca?**
Se renueva cada <meses> con <condiciones>. <Aclarar si es gratis.>

**¿El curso de ProgramBI es oficial de Microsoft?**
No; es una preparación independiente. <Aclarar qué cubre y qué no.>

**¿Necesito experiencia previa?**
<Nivel recomendado y conocimientos previos.>

**¿En qué idioma puedo rendir el examen?**
<Idiomas oficiales disponibles según Microsoft Learn.>

**¿Qué pasa si no apruebo?**
<Política oficial de reintento.>
