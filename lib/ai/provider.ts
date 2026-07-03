import { createOpenAI } from "@ai-sdk/openai";
import type { ChatModel } from "./models";

/**
 * Proveedor Alibaba Cloud (DashScope), endpoint OpenAI-compatible. SERVER-ONLY.
 * No importar este archivo en componentes de cliente (contiene la API key).
 *
 * Docs: https://help.aliyun.com/zh/model-studio/developer-reference/use-qwen-by-calling-api
 * Modelo compatible con el AI SDK vía createOpenAI apuntando al compatible-mode.
 */
const dashscope = createOpenAI({
  baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1",
  apiKey: process.env.DASHSCOPE_API_KEY || "",
  headers: {
    "X-DashScope-WorkSpace": "programbi",
  },
});

/** Devuelve el LanguageModel del SDK listo para streamText. */
export function getLanguageModel(model: ChatModel) {
  if (!process.env.DASHSCOPE_API_KEY) {
    throw new Error(
      "Falta DASHSCOPE_API_KEY. Configúrala en las variables de entorno."
    );
  }
  return dashscope(model.providerId);
}
