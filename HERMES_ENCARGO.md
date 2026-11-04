# ENCARGO PARA HERMES AGENT (de Radar, SEO/GEO de ProgramBI) — 04/11/2026

Eres el orquestador. Objetivo: implementar, rápido y con calidad profesional, todas las mejoras de ProgramBI para conseguir más visitas cualificadas (SEO + GEO) y más leads/inscripciones en LATAM.

Lee en esta carpeta, en este orden:
1. ANALISIS_Y_MEJORAS.md (diagnóstico y backlog priorizado, el más reciente: manda)
2. HERMES_ORQUESTACION.md (workstreams WS1–WS4, ramas, reglas, prompts de sub-bots)
3. GUIAS_POWER_BI_PAISES.md (textos completos de guías + corrección de precios §8)
4. PLAN_MEJORAS.md (registro de estado: actualízalo siempre)

Cómo trabajar:
- Delega en hasta 4 sub-bots en paralelo con el modelo DeepSeek V4.1 Flash, uno por workstream, cada uno en su rama feat/ws1-..feat/ws4-.. y su worktree, sin pisarse archivos.
- Prioridad 1 (antes que nada): precios reales Chile = 169.000 CLP todos los cursos, Análisis de datos 338.000, Mercado financiero 349.000; una sola fuente de verdad (UI, niveles, JSON-LD Offer, checkout); quitar "Se cobra en CLP" junto al precio local; wa.me con ?text= (curso + país) en el HTML del servidor; revisar la fricción del formulario de contacto previo al registro (commit 05dacd9) que coincide con la caída de form_start→generate_lead de 41% a 18%.
- Luego: integrar países secundarios (/sv /ve /cr /do /py /bo /ec /gt) en sitemap y hreflang; medición GA4 ((not set), parámetros, duplicados); llms.txt con precios y FAQ; reforzar /cursos/power-bi y /cursos/analisis-de-datos; publicar guías en olas (Chile, Perú, Argentina y DAX primero).
- Datos: nunca inventes cifras; toda cifra con fuente.
- Verificaciones: durante el trabajo solo build/typecheck por rama. Las verificaciones pesadas (curl de todo el sitemap, titles, hreflang, JSON-LD, precios, wa.me) SOLO al final, una vez, sobre la rama integradora mejora/integracion-v2.
- Reglas duras: NO merge ni push a main, NO deploy a producción, NO tocar DNS, ads ni Supabase de producción, NO enviar mensajes a nadie. Push de ramas a GitHub sí está permitido para que Vercel genere preview.
- Estado: anota cada tarea en PLAN_MEJORAS.md (pendiente / en curso / hecho + rama + hash).

Al terminar, escribe HERMES_REPORTE.md en esta carpeta con: qué se hizo, ramas y hashes, resultado de la verificación final, pendientes y decisiones que necesita Manu (migración leads_magnet, IP_HASH_SALT, precio /py en USD), y el link de preview de mejora/integracion-v2. Radar lo revisará después.

- Modelo: usa provider opencode-go con modelo deepseek-v4.1-flash para ti y para todos los sub-bots (--provider opencode-go -m deepseek-v4.1-flash).
