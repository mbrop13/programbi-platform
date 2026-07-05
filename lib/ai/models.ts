/**
 * Registro de modelos del chat de ProgramBI.
 * Todos se sirven a través de OpenRouter (endpoint OpenAI-compatible).
 *
 * ⚠️ Este archivo NO debe importar el proveedor ni variables de entorno:
 * es cliente-safe (lo usa el selector de modelos en el navegador).
 */
export interface ChatModel {
  id: string;
  label: string;
  providerId: string; // ID por defecto en el proveedor
  description: string;
  vision: boolean; // acepta imágenes
  reasoning: boolean; // emite partes de razonamiento (thinking)
  premium: boolean; // solo para planes de pago
  badge?: string;
}

export const MODELS: ChatModel[] = [
  {
    id: "rapido",
    label: "Rápido",
    providerId: "qwen-turbo",
    description: "Respuestas veloces para dudas rápidas del día a día.",
    vision: false,
    reasoning: false,
    premium: false,
  },
  {
    id: "pro",
    label: "Pro",
    providerId: "qwen-max",
    description: "Máxima calidad para análisis, código y explicaciones detalladas.",
    vision: false,
    reasoning: false,
    premium: false,
  },
];

export const DEFAULT_MODEL_ID = "rapido";

export function getModel(id: string | undefined | null): ChatModel {
  if (!id) return MODELS[0];
  return MODELS.find((m) => m.id === id) ?? MODELS[0];
}

/** Filtra modelos según el plan del usuario (free vs premium). */
export function getAvailableModels(isPremium: boolean): ChatModel[] {
  return MODELS.filter((m) => isPremium || !m.premium);
}
