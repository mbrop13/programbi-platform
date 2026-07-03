import { createOpenAI } from "@ai-sdk/openai";
import type { ChatModel } from "./models";

/**
 * Proveedor OpenRouter (OpenAI-compatible). SERVER-ONLY.
 * No importar este archivo en componentes de cliente (contiene la API key).
 */
const openrouter = createOpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY || "",
  headers: {
    "HTTP-Referer": "https://programbi.com",
    "X-Title": "ProgramBI LMS",
  },
});

/** Devuelve el LanguageModel del SDK listo para streamText. */
export function getLanguageModel(model: ChatModel) {
  if (!process.env.OPENROUTER_API_KEY) {
    throw new Error(
      "Falta OPENROUTER_API_KEY. Configúrala en las variables de entorno."
    );
  }
  return openrouter(model.providerId);
}
