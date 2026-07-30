/**
 * Legacy mentor chat endpoint (AI SDK v6).
 * Replaced by Maverlang chat at POST /api/ai-chat.
 * Kept as a clear redirect so old clients fail gracefully.
 */
export const maxDuration = 60;

export async function POST() {
  return new Response(
    JSON.stringify({
      error:
        "Este endpoint fue reemplazado. Usa el chat de ProgramBI IA en /ai (API /api/ai-chat).",
      code: "ENDPOINT_MOVED",
      next: "/api/ai-chat",
    }),
    { status: 410, headers: { "Content-Type": "application/json" } }
  );
}
