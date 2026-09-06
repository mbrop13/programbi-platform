# Programa de referidos — ProgramBI

Plataforma v1 integrada en www.programbi.com. Comisión: **15% del neto cobrado del primer Pack Adopción atribuido**. Pago al cobro. Clawback 60 días. Intros calificadas a mano (no afiliados abiertos).

No toca capacitaciones.programbi.cl.

## Cómo correr

1. Variables de entorno (además de las de Supabase / SES ya usadas):

```
REFERRAL_BANK_KEY=   # secreto ≥16 chars para cifrar datos bancarios (AES-256-GCM)
REFERRAL_AUTO_ACTIVE_DOMAINS=   # opcional; vacío = auto-activar a todos
```

El resto reutiliza `NEXT_PUBLIC_SUPABASE_*`, `SUPABASE_SECRET_KEY`, `SES_SMTP_*`, `UPSTASH_REDIS_*`.

2. Migración + seed (Supabase SQL editor o CLI):

```
supabase/migrations/20260906000000_referrals.sql
supabase/seeds/referrals_seed.sql
```

El seed espera usuarios auth:

- `leo.a@example.org` (admin: `profiles.role = admin`)
- `tom.h@example.org`
- `paula.r@example.org`

3. `npm run dev` → [http://localhost:3000/referidos](http://localhost:3000/referidos)

## Flujo de pago

1. Referidor envía intro (`/referidos/app/nueva`). Estado: **Enviada**.
2. Admin califica → agenda → propuesta (`/referidos/admin`).
3. Admin marca **won** con el **monto neto cobrado** (CLP). Comisión = `floor(monto * 15 / 100)`, estado **por pagar**.
4. Admin marca **pagada** con referencia de transferencia. El referidor la ve en `/referidos/app/comisiones`.
5. Si hay NC/devolución ≤ 60 días: **clawback**.

Un Pack = una comisión. Cookie `?ref=CODIGO` en `/empresas` dura 90 días y **sugiere** atribución; un admin confirma.

## Rutas

| Ruta | Quién |
| --- | --- |
| `/referidos` | Landing (navbar/footer del sitio; no está en el menú público) |
| `/referidos/terminos` | Público |
| `/login?next=/referidos/app` `/registro?from=/referidos` | Misma cuenta de la plataforma |
| `/referidos/app/*` | Referidor (sesión ProgramBI; se crea el perfil al entrar) |
| `/referidos/admin/*` | Admin ProgramBI |

`/referidos/login` y `/referidos/registro` redirigen al login/registro normal.

## QA checklist

### Desktop
- [ ] `/referidos` hero, calculadora 15%, FAQ, navbar del sitio (sin toggle de tema)
- [ ] Login/registro de la plataforma → panel (sin cuenta aparte)
- [ ] Nueva intro aparece en lista referidor y cola admin
- [ ] Admin won + monto → comisión 15%
- [ ] Admin pagada → referidor ve “Pagada”
- [ ] Export CSV
- [ ] Focus rings / labels en forms

### Mobile
- [ ] Landing apilada, CTAs táctiles
- [ ] Calculadora usable
- [ ] Panel: menú hamburguesa + “Nueva intro” visible
- [ ] Admin: tabla scrollea / kanban horizontal

### Seguridad
- [ ] Sin sesión, `/referidos/app` redirige a `/login?next=/referidos/app`
- [ ] No-admin no entra a `/referidos/admin`
- [ ] Datos bancarios no salen en logs
- [ ] Rate limit 5 intros/día
