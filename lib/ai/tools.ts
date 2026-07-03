import { tool } from "ai";
import { z } from "zod";

/**
 * Tool de búsqueda web para el mentor IA.
 * Usa Tavily (AI-optimized). Requiere TAVILY_API_KEY.
 * Si no está configurada, devuelve un error graceful (no rompe el flujo).
 */
export const webSearchTool = tool({
  description:
    "Busca información actualizada en la web. Úsalo cuando el estudiante pregunte por datos actuales, eventos recientes, versiones de librerías, precios, o cualquier tema que requiera información al día. No lo uses para conceptos teóricos de Python/SQL/Power BI que ya dominas.",
  inputSchema: z.object({
    query: z
      .string()
      .describe(
        "Consulta de búsqueda optimizada. Usa español o inglés según lo que dé mejores resultados."
      ),
  }),
  execute: async ({ query }) => {
    const apiKey = process.env.TAVILY_API_KEY;
    if (!apiKey) {
      return {
        query,
        error: "Búsqueda web no configurada en el servidor.",
        results: [],
      };
    }

    try {
      const res = await fetch("https://api.tavily.com/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          api_key: apiKey,
          query,
          max_results: 5,
          search_depth: "advanced",
          include_answer: true,
        }),
      });

      if (!res.ok) {
        return { query, error: `Error de búsqueda (${res.status}).`, results: [] };
      }

      const data = await res.json();
      const results = (data?.results ?? []).map(
        (r: { title?: string; url?: string; content?: string }) => ({
          title: r.title ?? "",
          url: r.url ?? "",
          content: String(r.content ?? "").slice(0, 800),
        })
      );

      return {
        query,
        answer: (data?.answer as string | undefined) ?? null,
        results,
      };
    } catch (e) {
      return {
        query,
        error: (e as Error)?.message ?? "Error desconocido en la búsqueda.",
        results: [],
      };
    }
  },
});
