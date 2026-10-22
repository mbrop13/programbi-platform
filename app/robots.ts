import type { MetadataRoute } from "next";
import { CANONICAL_HOST, SITE_URL } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: ["Bytespider", "PetalBot", "MJ12bot", "SemrushBot", "AhrefsBot", "DataForSEOBot"],
        disallow: "/",
      },
      { userAgent: "GPTBot", allow: "/" },
      { userAgent: "ChatGPT-User", allow: "/" },
      { userAgent: "OAI-SearchBot", allow: "/" },
      { userAgent: "Google-Extended", allow: "/" },
      { userAgent: "PerplexityBot", allow: "/" },
      { userAgent: "Anthropic-ai", allow: "/" },
      { userAgent: "ClaudeBot", allow: "/" },
      { userAgent: "CCBot", allow: "/" },
      {
        userAgent: "*",
        allow: "/",
        // /login y /comunidad NO se bloquean: llevan meta robots noindex, follow y
        // para que Google los lea tiene que poder rastrearlos.
        disallow: ["/api/", "/auth/", "/admin/", "/pago", "/referidos/app", "/referidos/admin"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: CANONICAL_HOST,
  };
}
