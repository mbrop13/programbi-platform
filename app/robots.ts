import type { MetadataRoute } from "next";
import { CANONICAL_HOST, SITE_URL } from "@/lib/seo";

const DISALLOWED_PATHS = ["/api/", "/auth/", "/*?wc-ajax=", "/*?id="];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: ["Bytespider", "PetalBot", "MJ12bot", "SemrushBot", "AhrefsBot", "DataForSEOBot"],
        disallow: "/",
      },
      {
        userAgent: [
          "GPTBot",
          "ChatGPT-User",
          "OAI-SearchBot",
          "Google-Extended",
          "PerplexityBot",
          "Anthropic-ai",
          "ClaudeBot",
          "CCBot",
        ],
        allow: "/",
        disallow: DISALLOWED_PATHS,
      },
      {
        userAgent: "*",
        allow: "/",
        // /login, /comunidad, /admin, /pago, /referidos/app y /referidos/admin NO se
        // bloquean: emiten noindex (meta robots y/o X-Robots-Tag) y los bots deben
        // poder rastrearlos para leer la directiva y evitar avisos en GSC.
        // /*?wc-ajax= y /*?id= son restos de WordPress que solo generan URLs
        // duplicadas; no aportan nada al rastreo.
        disallow: DISALLOWED_PATHS,
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: CANONICAL_HOST,
  };
}
