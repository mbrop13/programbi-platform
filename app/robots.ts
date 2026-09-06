import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

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
        disallow: ["/api/", "/auth/", "/comunidad/", "/_next/", "/admin/", "/login", "/pago"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: "www.programbi.com",
  };
}
