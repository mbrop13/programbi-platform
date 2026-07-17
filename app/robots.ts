import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Disallow known aggressive web scrapers
      {
        userAgent: ["Bytespider", "PetalBot", "MJ12bot", "SemrushBot", "AhrefsBot", "DataForSEOBot"],
        disallow: "/",
      },
      // AI Search & Retrieval Bots — WELCOME
      { userAgent: "GPTBot", allow: "/" },
      { userAgent: "ChatGPT-User", allow: "/" },
      { userAgent: "OAI-SearchBot", allow: "/" },
      { userAgent: "Google-Extended", allow: "/" },
      { userAgent: "PerplexityBot", allow: "/" },
      { userAgent: "Anthropic-ai", allow: "/" },
      { userAgent: "ClaudeBot", allow: "/" },
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
