# Migraciones SQL — Chat Maverlang en ProgramBI

Aplica estos scripts en el **Supabase de ProgramBI** (SQL Editor) en este orden aproximado:

1. `ai-chats-migration.sql` — historial `ai_saved_chats`
2. `supabase-migration.sql` — `assistant_configs` (y tablas base si no existen)
3. `supabase-webbuilder-migration.sql` — proyectos WebBuilder
4. `token-logs-migration.sql` + `add-tokens-columns.sql` — cuotas de tokens
5. `projects-migration.sql` — proyectos de usuario (opcional)
6. `shared-chat-full-migration.sql` — compartir chats (opcional)

Sin estas tablas el chat carga, pero historial / cuotas / webbuilder pueden fallar al guardar.

## Variables de entorno recomendadas

En `platform/.env.local` (además de Supabase ya configurado):

```env
# LLM principal del chat Maverlang (Xiaomi Mimo / OpenRouter compatible)
MIMO_API_KEY=
LLM_API_KEY=          # opcional, fallback
LLM_BASE_URL=         # default: https://api.xiaomimimo.com/v1

# OpenRouter (chatbot de ventas y fallbacks)
OPENROUTER_API_KEY=

# Rate limit distribuido (opcional en dev; recomendado en prod)
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```

El endpoint del chat es `POST /api/ai-chat`. La UI vive en `/ai`.
