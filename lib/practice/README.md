# Módulo de Práctica (clon de Duolingo)

Pestaña **Practica** dentro de la Comunidad. Estructura + diseño + un nivel de
muestra completo. Tú agregas los niveles siguiendo esta guía.

## Archivos

| Archivo | Qué hace |
|---|---|
| `lib/practice/types.ts` | Tipos TypeScript de la jerarquía. |
| `lib/practice/levels.ts` | **Catálogo de Units + Levels + Exercises.** Aquí agregas tus niveles. |
| `lib/practice/progress.ts` | Hook `usePracticeProgress()` (progreso en localStorage; reemplazable por Supabase). |
| `components/comunidad/practice/ExerciseRenderers.tsx` | Render UI por tipo de ejercicio. |
| `components/comunidad/practice/LessonPlayer.tsx` | Flujo de una lección (barra, corazones, feedback). |
| `components/comunidad/tabs/Practicar.tsx` | Página principal con selector de Units y path serpenteante. |

## Jerarquía (cómo Duolingo organiza y cómo la mapeamos)

Duolingo: **Sección → Unidad → Lección → Ejercicio**.

Aquí, para que sea más simple de editar a mano:

```
Unit    (sección/track)     →  Ej: "SQL Server", "Power BI", "IA"
 └─ Level  (un nodo/círculo) →  Equivalente a una "lección" de Duolingo
     └─ Exercise (pregunta)  →  Cada pregunta de la lección
```

Un Level se representa como un círculo del **path**. Cuando el usuario lo toca,
se ejecutan secuencialmente todos sus `exercises` en el `LessonPlayer`. La
"cascada" de desbloqueo es lineal: el nivel N se desbloquea cuando el N-1 está
completado (calculado en `Practicar.tsx` con `completedCount`/`nextIdx`).

## Tipos de Level (`kind`)

- `lesson` — lección normal (círculo numerado).
- `bonus` — práctica extra (estrella).
- `checkpoint` — punto de control / test (escudo).
- `trophy` — unidad completada (trofeo).

`checkpoint` y `trophy` son decorativos por ahora (no tienen ejercicios); los
puedes dejar con `exercises: []`.

## Tipos de Exercise (`type`)

| type | data | comportamiento |
|---|---|---|
| `multiple-choice` | `{ options, correctIndex }` | 1 correcta de N. |
| `select-all` | `{ options, correctIndices }` | N correctas; se marca correcto solo cuando el set elegido es **exactamente** el correcto. |
| `arrange` | `{ tokens:[{id,text}], correctOrder:[ids] }` | Tokens que el usuario toca en orden para armar (p.ej.) una query SQL. |
| `match-pairs` | `{ left, right, correctPairs }` | Empareja dos columnas. |
| `fill-blank` | `{ acceptedAnswers, placeholder? }` | Escribe la respuesta (case/trim-insensitive). |

Todos tienen `prompt`, opcional `hint`, y `explanation` (mostrado en el panel
de feedback tras responder).

## Cómo agregar un nivel nuevo

Abre `lib/practice/levels.ts` y dentro del array `levels` de un Unit añade un
objeto como este:

```ts
{
  id: "sql-4",                       // único dentro del Unit
  title: "Nivel 4 · JOINs",
  kind: "lesson",                    // lesson | bonus | checkpoint | trophy
  xp: 15,
  exercises: [
    {
      id: "sql-4-e1",
      type: "multiple-choice",
      prompt: "¿Qué JOIN devuelve solo filas con coincidencia en ambas tablas?",
      hint: "Es el JOIN por defecto.",
      data: { options: ["INNER JOIN","LEFT JOIN","FULL JOIN","CROSS JOIN"], correctIndex: 0 },
      explanation: "INNER JOIN devuelve solo las filas donde hay match en ambas tablas.",
    },
    {
      id: "sql-4-e2",
      type: "arrange",
      prompt: 'Ordena: "SELECT * FROM a INNER JOIN b ON a.id = b.id"',
      data: {
        tokens: [
          { id: "t1", text: "SELECT *" },
          { id: "t2", text: "FROM a" },
          { id: "t3", text: "INNER JOIN b" },
          { id: "t4", text: "ON a.id = b.id" },
        ],
        correctOrder: ["t1","t2","t3","t4"],
      },
      explanation: "La sintaxis del INNER JOIN requiere ON para especificar la condición de cruce.",
    },
  ],
}
```

### Reglas / buenas prácticas (estilo Duolingo)

1. **2–6 ejercicios por Level.** Lo justo para una sesión corta.
2. **Progresión incremental.** Cada nivel introduce 1 idea nueva y refuerza la anterior.
3. **Mezcla tipos.** No hagas un nivel solo de multiple-choice; alterna
   `arrange` (mayor carga cognitiva) con `multiple-choice` (más fácil).
4. **`explanation` siempre didáctica**, no solo "sí/no". Refuerza el concepto.
5. **`hint` opcional**, solo cuando el prompt pueda generar ambigüedad.
6. **Ids estables.** No los cambies una vez publicados: el link de progreso en
   localStorage depende del par `unitId:levelId`.
7. **Orden del array importa.** El path se dibuja de arriba hacia abajo y
   desbloquea en cascada lineal. Usa `checkpoint`/`trophy` al final de un bloque.

## Cómo agregar una sección (Unit) nueva

Igual, dentro de `PRACTICE_UNITS` en `levels.ts`:

```ts
{
  id: "tableau",                // único global
  slug: "tableau",              // único global, se usa en URL
  title: "Tableau",
  description: "Viz y dashboards BI.",
  icon: "BarChart3",            // nombre exacto de lucide-react (ver ICON_MAP en Practicar.tsx)
  accentColor: "#1F4E79",       // hex; se aplica al path, botones, header
  emoji: "📈",
  levels: [
    { id: "t-1", title: "Nivel 1 · Hojas y Filtros", kind: "lesson", xp: 10, exercises: [] },
    // …
  ],
}
```

Iconos disponibles actualmente (ver `Practicar.tsx`):
`Database, BarChart3, Brain, Code2, FileSpreadsheet, Table, Workflow, Cpu`.
Para agregar más, añádelo al import y a `ICON_MAP` en `Practicar.tsx`.

## Persistencia

Hoy el progreso se guarda en `localStorage` (`programbi:practice:progress:v1`).

Para guardar en Supabase:
1. Crea tabla `practice_progress(user_id uuid, unit_id text, level_id text, completed bool, best_hearts int, completed_at timestamptz)`.
2. Reemplaza `load()` / `save()` en `progress.ts` por llamadas a tu API.

La UI no necesita otros cambios: todo el flujo pasa por `usePracticeProgress()`.

## Diseño

- **Path serpenteante** con nodos circulares por nivel (`zig-zag` via `Math.sin`).
- **Estados**: completado (verde ✓), siguiente (color de acento del Unit con bounce), bloqueado (gris candado).
- **Chip "EMPEZAR"** arriba del nodo actual (estilo Duolingo "Start").
- **Player a pantalla completa** con barra de progreso + vidas (corazones) +
  panel de feedback correcto/incorrecto en la parte inferior + pantalla final
  con XP y resumen.