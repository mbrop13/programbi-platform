import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // AI Search & Retrieval Bots — WELCOME
      { userAgent: "GPTBot", allow: "/" },
      { userAgent: "ChatGPT-User", allow: "/" },
      { userAgent: "OAI-SearchBot", allow: "/" },
      { userAgent: "Google-Extended", allow: "/" },
      { userAgent: "PerplexityBot", allow: "/" },
      { userAgent: "Anthropic-ai", allow: "/" },
      { userAgent: "ClaudeBot", allow: "/" },
      { userAgent: "Bytespider", allow: "/" },
      { userAgent: "CCBot", allow: "/" },
      // General crawlers
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/auth/", "/comunidad/", "/_next/"],
      },
    ],
    sitemap: "https://programbi.com/sitemap.xml",
  };
}
