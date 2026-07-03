/**
 * Tipos permissivos para los mensajes/parts del chat.
 * Los UIMessage del AI SDK (con parts como unión compleja) son asignables a estos,
 * lo que evita `any` y facilita el acceso a campos en la UI.
 */
export interface ChatPart {
  type: string;
  // text / reasoning
  text?: string;
  state?: string;
  // file / image
  mediaType?: string;
  url?: string;
  filename?: string;
  // tool
  toolCallId?: string;
  toolName?: string;
  input?: unknown;
  output?: unknown;
  errorText?: string;
}

export interface ChatMessage {
  id: string;
  role: string;
  parts: ChatPart[];
  metadata?: unknown;
}
