import { createOpenAI } from "@ai-sdk/openai";
import type { ChatModel } from "./models";

/**
 * Proveedor OpenRouter, endpoint OpenAI-compatible. SERVER-ONLY.
 * No importar este archivo en componentes de cliente (contiene la API key).
 */
const openrouter = createOpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY || "",
  headers: {
    "HTTP-Referer": "https://programbi.com",
    "X-Title": "ProgramBI",
  },
});

/** Devuelve el LanguageModel del SDK listo para streamText. */
export function getLanguageModel(model: ChatModel) {
  if (!process.env.OPENROUTER_API_KEY) {
    throw new Error(
      "Falta la clave OPENROUTER_API_KEY en las variables de entorno."
    );
  }

  // Mapear dinámicamente según variables de entorno o fallbacks
  let modelName = model.providerId;

  if (model.id === "rapido") {
    modelName = process.env.OPENROUTER_MODEL_FAST || "google/gemini-2.5-flash";
  } else if (model.id === "pro") {
    modelName = process.env.OPENROUTER_MODEL_PRO || "google/gemini-2.5-pro";
  }

  return openrouter(modelName);
}
