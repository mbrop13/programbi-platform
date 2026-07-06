# 🔒 Auditoría OWASP ASVS Nivel 3 — ProgramBI Platform

Auditoría de seguridad estática realizada el **2026-07-05** siguiendo el estándar **OWASP ASVS 4.0.3 Nivel 3** (Application Security Verification Standard — el más estricto, 286 requisitos).

## Documentos

| Archivo | Contenido |
|---|---|
| [`OWASP_ASVS_L3_Informe.md`](./OWASP_ASVS_L3_Informe.md) | Resumen ejecutivo, scorecard por dominio, top 8 hallazgos críticos y plan de remediación por fases |
| [`OWASP_ASVS_L3_Hallazgos_Detallados.md`](./OWASP_ASVS_L3_Hallazgos_Detallados.md) | Evidencia técnica completa por dominio ASVS, con código citado y fixes específicos |

## Scorecard global

| Dominio | Score |
|---|---|
| V2 Autenticación | D |
| V3 Sesión | D |
| V4 Control de acceso | D- |
| V5 Inyección/XSS | D |
| V6 Criptografía | C |
| V7 Logging | F |
| V8 Datos/Privacidad | D |
| V9 Comunicaciones | A- |
| V12 Archivos | D |
| V13 API | D- |
| V14 Supply chain | C- |

**8 críticas · 25 altas · 18 medias · 15 bajas**

## ⚡ Acciones inmediatas (Fase 0, ≤ 24h)

1. Rotar todos los secretos de `.env.local` (OneDrive).
2. Eliminar backdoor admin por email (`CR-2`).
3. Parchear RLS de `profiles` (`CR-1`).
4. HMAC en webhook MercadoPago (`CR-3`).
5. RLS en tablas críticas (`CR-7`).
6. `npm install next@16.2.10 nodemailer@^9` (`A-28`, `A-29`).

## Limitaciones

- Auditoría **estática** (sin pentest dinámico).
- Las tablas `payments`, `asesoria_slots`, `course_schedules`, `chatbot_*`, `articles`, `promo_popups` **no están en migraciones versionadas** → su RLS real no fue auditable (asumir inseguras hasta verificar).
- `supabase/config.toml` no versionado → políticas de Auth no verificadas.
- Despliegue Vercel productivo fuera del alcance.
