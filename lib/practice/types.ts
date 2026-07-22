// =============================================================================
// ProgramBI · Módulo de Práctica (estilo Duolingo)
//
// Jerarquía de datos:
//   Unit   → una "sección" / track de aprendizaje (ej: SQL Server, Power BI, IA)
//   Level  → un nodo del camino (un círculo de la ruta). Al abrirlo, ejecutas una
//            secuencia de ejercicios (un "集中的 lesson").
//   Exercise → una pregunta individual dentro de un Level.
//
// Esta jerarquía imita cómo Duolingo organiza:
//   Sección → Unidad → Lección → Ejercicio
// Aquí colapsamos Unidad+Sección en "Unit" y Lección→"Level".
// =============================================================================

// ─── Tipos de ejercicio soportados ───────────────────────────────────────────
// Cada tipo es una forma distinta de pregunta (igual que Duolingo tiene
// "selecciona", "ordena las palabras", "empareja", etc.).

export type ExerciseType =
  | "multiple-choice" // 1 opción correcta
  | "select-all" // N opciones correctas
  | "arrange" // ordenar tokens (p.ej. armar una query SQL)
  | "match-pairs" // emparejar dos columnas
  | "fill-blank"; // escribir la respuesta

// ─── Variantes de "Level" (el nodo del camino) ───────────────────────────────
export type LevelKind =
  | "lesson" // lección normal (círculo)
  | "bonus" // lección de práctica extra (estrella)
  | "checkpoint" // punto de control / test (escudo)
  | "trophy"; // unidad completada (trofeo)

// ─── Datos por tipo de ejercicio ─────────────────────────────────────────────
export interface MultipleChoiceData {
  options: string[]; // textos de las opciones
  correctIndex: number; // índice (0-based) de la correcta
}

export interface SelectAllData {
  options: string[];
  correctIndices: number[]; // pueden ser varias
}

export interface ArrangeData {
  // Tokens que el usuario debe colocar en orden. Cada token tiene un id
  // estable para cuando quieran usar el mismo texto varias veces.
  tokens: { id: string; text: string }[];
  correctOrder: string[]; // ids en orden correcto
}

export interface MatchPairsData {
  left: { id: string; text: string }[];
  right: { id: string; text: string }[];
  // correctPairs[i] = { left: leftId, right: rightId }
  correctPairs: { left: string; right: string }[];
}

export interface FillBlankData {
  // Respuestas aceptadas (case_insensitive, trimmed).
  acceptedAnswers: string[];
  placeholder?: string;
}

export interface Exercise {
  id: string; // único dentro del Level
  type: ExerciseType;
  prompt: string; // enunciado/pregunta
  // Pista corta opcional (equivalente al "tip" de Duolingo).
  hint?: string;
  // Datos según el tipo. Solo uno debe estar definido según `type`.
  data:
    | MultipleChoiceData
    | SelectAllData
    | ArrangeData
    | MatchPairsData
    | FillBlankData;
  // Explicación mostrada tras responder (refuerzo del aprendizaje).
  explanation: string;
}

export interface Level {
  id: string; // único dentro del Unit
  title: string;
  kind: LevelKind;
  // XP que otorga completar el nivel (solo referencia para UI).
  xp: number;
  exercises: Exercise[];
}

export interface Unit {
  id: string; // único global
  slug: string; // para URLs amigables
  title: string;
  description: string;
  // Nombre del icono de lucide-react (string, resuelto en el componente).
  icon: string;
  // Color de acento CSS (hex). Se aplica al path y a los nodos.
  accentColor: string;
  // Emoji corto para chips / headers (opcional).
  emoji?: string;
  levels: Level[];
}

// Resolución del icono por nombre string (para no importar lucide en data).
export const PRACTICE_ICONS = [
  "Database",
  "BarChart3",
  "Brain",
  "Code2",
  "Table",
  "Workflow",
  "FileSpreadsheet",
  "Cpu",
] as const;