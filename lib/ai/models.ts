/**
 * Registro de modelos del chat de ProgramBI.
 * Todos se sirven a través de OpenRouter (proveedor OpenAI-compatible).
 *
 * ⚠️ Este archivo NO debe importar el proveedor ni variables de entorno:
 * es cliente-safe (lo usa el selector de modelos en el navegador).
 */
export interface ChatModel {
  id: string;
  label: string;
  providerId: string; // ID en OpenRouter
  description: string;
  vision: boolean; // acepta imágenes
  reasoning: boolean; // emite partes de razonamiento (thinking)
  premium: boolean; // solo para planes de pago
  badge?: string;
}

export const MODELS: ChatModel[] = [
  {
    id: "llama-3-8b",
    label: "Llama 3 8B",
    providerId: "meta-llama/llama-3-8b-instruct:free",
    description: "Rápido y gratuito. Ideal para dudas rápidas del día a día.",
    vision: false,
    reasoning: false,
    premium: false,
    badge: "Gratis",
  },
  {
    id: "gpt-4o-mini",
    label: "GPT-4o mini",
    providerId: "openai/gpt-4o-mini",
    description: "Equilibrio entre velocidad y calidad. Soporta imágenes.",
    vision: true,
    reasoning: false,
    premium: true,
    badge: "Vision",
  },
  {
    id: "gemini-flash",
    label: "Gemini Flash",
    providerId: "google/gemini-flash-1.5",
    description: "Respuestas veloces y contexto amplio. Soporta imágenes.",
    vision: true,
    reasoning: false,
    premium: true,
    badge: "Vision",
  },
  {
    id: "claude-3.5-sonnet",
    label: "Claude 3.5 Sonnet",
    providerId: "anthropic/claude-3.5-sonnet",
    description: "La mejor calidad para código, análisis y explicaciones detalladas.",
    vision: true,
    reasoning: false,
    premium: true,
    badge: "Premium",
  },
  {
    id: "deepseek-r1",
    label: "DeepSeek R1",
    providerId: "deepseek/deepseek-r1",
    description: "Modelo de razonamiento: muestra su pensamiento paso a paso.",
    vision: false,
    reasoning: true,
    premium: true,
    badge: "Razonamiento",
  },
];

export const DEFAULT_MODEL_ID = "llama-3-8b";

export function getModel(id: string | undefined | null): ChatModel {
  if (!id) return MODELS[0];
  return MODELS.find((m) => m.id === id) ?? MODELS[0];
}

/** Filtra modelos según el plan del usuario (free vs premium). */
export function getAvailableModels(isPremium: boolean): ChatModel[] {
  return MODELS.filter((m) => isPremium || !m.premium);
}
