import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.join(__dirname),
  },
  experimental: {
    // Cada grupo de rutas tiene su propio root layout, así que el 404 global
    // se declara en app/global-not-found.tsx.
    globalNotFound: true,
    optimizePackageImports: [
      "lucide-react",
      "framer-motion",
      "@radix-ui/react-dialog",
      "@radix-ui/react-dropdown-menu",
      "@radix-ui/react-select",
      "@radix-ui/react-tooltip",
      "@radix-ui/react-popover",
      "@radix-ui/react-collapsible",
      "@radix-ui/react-scroll-area",
      "@radix-ui/react-slot",
      "recharts",
      "sonner",
    ],
  },
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 14,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.shopify.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "img.youtube.com",
      },
      {
        protocol: "https",
        hostname: "mail.programbi.com",
      },
      {
        protocol: "https",
        hostname: "flagcdn.com",
      },
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
      },
    ],
  },
  async redirects() {
    // ── FUENTE ÚNICA DE REDIRECCIONES ─────────────────────────────────────
    // La fuente de verdad es `vercel.json`: es la tabla que rige en
    // Production (Vercel la aplica en el edge antes de Next).
    //
    // Esta función replica EXACTAMENTE esa tabla —mismo orden, mismos
    // orígenes y mismos destinos— porque `next start` local NO lee
    // `vercel.json` y el verificador `scripts/smoke-redirects.mjs` corre
    // contra local. Si cambia una regla, se cambia en los dos archivos a la
    // vez; si alguna vez difieren, en Vercel manda `vercel.json`.
    //
    // Reglas duras de esta tabla:
    //  1. Cero cadenas: ningún destino vuelve a redirigir (todos dan 200,
    //     salvo las rutas con sesión: /ai y /comunidad/ajustes).
    //  2. Las reglas de `/products/*` específicas van ANTES del comodín
    //     `/products/:path*`; si no, el comodín se las come.
    //  3. Las reglas de apex → www van PRIMERO para que un request al apex
    //     no encadene "legacy 301 + apex 301".
    //  4. Nada de destinos que dependan de variables de entorno: `/pages/webinar`
    //     va siempre a `/cursos`, igual que en Production (el JSON de Vercel no
    //     evalúa env y una tabla env-dependiente rompe la paridad local/Vercel).
    //  5. Destinos con `#ancla` (p. ej. `/empresas#contacto`): la sección
    //     `id="contacto"` existe en /empresas (components/empresas/empresas-landing.tsx).
    return [
      // ── Apex → www (canónico). Primero de todo. ─────────────────────────
      {
        source: "/",
        has: [{ type: "host", value: "programbi.com" }],
        destination: "https://www.programbi.com/",
        statusCode: 301,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "programbi.com" }],
        destination: "https://www.programbi.com/:path*",
        statusCode: 301,
      },

      // ── Legacy WordPress (`/pages/*`) ───────────────────────────────────
      // `/pages/` (con barra final) lo normaliza la plataforma con un 308 a
      // `/pages` antes de evaluar esta tabla; por eso no hay regla propia.
      {
        source: "/pages/cursos-1",
        destination: "/cursos",
        statusCode: 301,
      },
      {
        source: "/pages/cursos",
        destination: "/cursos",
        statusCode: 301,
      },
      {
        source: "/pages/contacto",
        destination: "/empresas#contacto",
        statusCode: 301,
      },
      {
        source: "/pages/contact",
        destination: "/empresas#contacto",
        statusCode: 301,
      },
      {
        source: "/pages/empresas",
        destination: "/empresas",
        statusCode: 301,
      },
      {
        source: "/pages/bootcamp",
        destination: "/cursos/analisis-de-datos",
        statusCode: 301,
      },
      {
        source: "/pages/bootcamps",
        destination: "/cursos/analisis-de-datos",
        statusCode: 301,
      },
      {
        source: "/pages/bootcamps/:rest*",
        destination: "/cursos/analisis-de-datos",
        statusCode: 301,
      },
      {
        source: "/pages/webinar",
        destination: "/cursos",
        statusCode: 301,
      },
      {
        source: "/pages",
        destination: "/cursos",
        statusCode: 301,
      },

      // ── Contacto, cuenta y comercio legacy ──────────────────────────────
      {
        source: "/contacto",
        destination: "/empresas#contacto",
        statusCode: 301,
      },
      {
        source: "/consultorias",
        destination: "/empresas",
        statusCode: 301,
      },
      {
        source: "/consultoria",
        destination: "/empresas",
        statusCode: 301,
      },
      {
        source: "/asesorias",
        destination: "/empresas",
        statusCode: 301,
      },
      {
        source: "/campus",
        destination: "/login",
        statusCode: 301,
      },
      {
        source: "/auth/login",
        destination: "/login",
        statusCode: 301,
      },
      {
        source: "/account",
        destination: "/login",
        statusCode: 301,
      },
      {
        source: "/account/:rest*",
        destination: "/login",
        statusCode: 301,
      },
      {
        source: "/checkout",
        destination: "/cursos",
        statusCode: 301,
      },
      {
        source: "/search",
        destination: "/cursos",
        statusCode: 301,
      },
      {
        source: "/cart",
        destination: "/cursos",
        statusCode: 301,
      },
      {
        source: "/recommendations/products",
        destination: "/cursos",
        statusCode: 301,
      },
      {
        source: "/recommendations/products/:rest*",
        destination: "/cursos",
        statusCode: 301,
      },
      {
        source: "/apps/:rest*",
        destination: "/cursos",
        statusCode: 301,
      },
      {
        source: "/collections/:rest*",
        destination: "/cursos",
        statusCode: 301,
      },
      {
        source: "/programa-bi",
        destination: "/cursos",
        statusCode: 301,
      },
      {
        source: "/programa-bi/:rest*",
        destination: "/cursos",
        statusCode: 301,
      },

      // ── Blog legacy (WordPress) ─────────────────────────────────────────
      {
        source: "/blogs/news",
        destination: "/blog",
        statusCode: 301,
      },
      {
        source: "/blogs/:rest*",
        destination: "/blog",
        statusCode: 301,
      },

      // ── Shopify `/products/*`: específicas primero, comodín al final ────
      // Los slugs con "minería" y "financiero" van antes que los comodines
      // genéricos que también los capturarían.
      {
        source: "/products/curso-analisis-de-datos-para-la-mineria",
        destination: "/cursos/analitica-mineria",
        statusCode: 301,
      },
      {
        source: "/products/curso-de-analisis-de-datos-para-el-sector-financiero",
        destination: "/cursos/mercado-financiero",
        statusCode: 301,
      },
      {
        source: "/products/curso-power-bi",
        destination: "/cursos/power-bi",
        statusCode: 301,
      },
      {
        source: "/products/curso-de-power-bi",
        destination: "/cursos/power-bi",
        statusCode: 301,
      },
      {
        source: "/products/curso-power-bi-online",
        destination: "/cursos/power-bi",
        statusCode: 301,
      },
      {
        source: "/products/:handle(power-bi.*)",
        destination: "/cursos/power-bi",
        statusCode: 301,
      },
      {
        source: "/products/:handle(curso-analisis-de-datos.*)",
        destination: "/cursos/analisis-de-datos",
        statusCode: 301,
      },
      {
        source: "/products/:handle(curso-sql.*)",
        destination: "/cursos/sql-server",
        statusCode: 301,
      },
      {
        source: "/products/:handle(sql-server.*)",
        destination: "/cursos/sql-server",
        statusCode: 301,
      },
      {
        source: "/products/:handle(.*python.*)",
        destination: "/cursos/python",
        statusCode: 301,
      },
      {
        source: "/products/:handle(.*excel.*)",
        destination: "/cursos/excel",
        statusCode: 301,
      },
      {
        source: "/products/:handle(.*power-automate.*)",
        destination: "/cursos/power-automate",
        statusCode: 301,
      },
      {
        source: "/products/:handle(.*machine.*)",
        destination: "/cursos/machine-learning",
        statusCode: 301,
      },
      {
        source: "/products/:handle(.*mineria.*)",
        destination: "/cursos/analitica-mineria",
        statusCode: 301,
      },
      {
        source: "/products/:handle(.*mercado-financiero.*)",
        destination: "/cursos/mercado-financiero",
        statusCode: 301,
      },
      {
        source: "/products/:handle(.*financiero.*)",
        destination: "/cursos/mercado-financiero",
        statusCode: 301,
      },
      // No hay ficha de Big Data en el catálogo actual: al índice de cursos.
      {
        source: "/products/big-data-program-bi",
        destination: "/cursos",
        statusCode: 301,
      },
      // Comodín final de la familia /products. Siempre al final.
      {
        source: "/products/:path*",
        destination: "/cursos",
        statusCode: 301,
      },

      // ── Slugs de curso renombrados ──────────────────────────────────────
      {
        source: "/cursos/copilot-studio",
        destination: "/cursos/copilot",
        statusCode: 301,
      },
      {
        source: "/cursos/analitica-financiera",
        destination: "/cursos/mercado-financiero",
        statusCode: 301,
      },
      {
        source: "/cursos/analitica-financiera/:rest*",
        destination: "/cursos/mercado-financiero",
        statusCode: 301,
      },
      {
        source: "/:pais/cursos/analitica-financiera",
        destination: "/:pais/cursos/mercado-financiero",
        statusCode: 301,
      },
      {
        source: "/:pais/cursos/analitica-financiera/:rest*",
        destination: "/:pais/cursos/mercado-financiero",
        statusCode: 301,
      },

      // ── Comunidad: rutas movidas (destinos con sesión, no SEO) ──────────
      {
        source: "/comunidad/configuracion",
        destination: "/comunidad/ajustes",
        statusCode: 301,
      },
      {
        source: "/comunidad/ai",
        destination: "/ai",
        statusCode: 301,
      },
      {
        source: "/comunidad/ai/:rest*",
        destination: "/ai/:rest*",
        statusCode: 301,
      },
      // ── 301 directos (espejo de vercel.json): evitan el doble salto que
      // hoy resuelve proxy.ts en la función Node (0 Fluid CPU en el edge).
      {
        source: "/cl/curso-power-bi",
        destination: "/cursos/power-bi",
        statusCode: 301,
      },
      {
        source: "/cl/cursos/copilot-studio",
        destination: "/cursos/copilot",
        statusCode: 301,
      },
      {
        source: "/cl/cursos/analitica-financiera",
        destination: "/cursos/mercado-financiero",
        statusCode: 301,
      },
      {
        source: "/cl/cursos/analitica-financiera/:rest*",
        destination: "/cursos/mercado-financiero",
        statusCode: 301,
      },
      {
        source: "/es/curso-power-bi",
        destination: "/cursos/power-bi",
        statusCode: 301,
      },
      {
        source: "/es/cursos/copilot-studio",
        destination: "/cursos/copilot",
        statusCode: 301,
      },
      {
        source: "/es/cursos/analitica-financiera",
        destination: "/cursos/mercado-financiero",
        statusCode: 301,
      },
      {
        source: "/es/cursos/analitica-financiera/:rest*",
        destination: "/cursos/mercado-financiero",
        statusCode: 301,
      },
      {
        source: "/en/curso-power-bi",
        destination: "/cursos/power-bi",
        statusCode: 301,
      },
      {
        source: "/en/cursos/copilot-studio",
        destination: "/cursos/copilot",
        statusCode: 301,
      },
      {
        source: "/en/cursos/analitica-financiera",
        destination: "/cursos/mercado-financiero",
        statusCode: 301,
      },
      {
        source: "/en/cursos/analitica-financiera/:rest*",
        destination: "/cursos/mercado-financiero",
        statusCode: 301,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self';",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com https://www.googletagmanager.com https://www.google-analytics.com https://www.clarity.ms https://scripts.clarity.ms https://s3.tradingview.com https://*.tradingview.com;",
              "style-src 'self' 'unsafe-inline';",
              "img-src 'self' data: blob: https://images.unsplash.com https://cdn.shopify.com https://img.youtube.com https://mail.programbi.com https://flagcdn.com https://i.pravatar.cc https://www.svgrepo.com https://www.googletagmanager.com https://www.google-analytics.com https://*.google-analytics.com https://*.clarity.ms https://*.tradingview.com https://*.supabase.co;",
              "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.mercadopago.com https://www.google-analytics.com https://analytics.google.com https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com https://www.clarity.ms https://*.clarity.ms https://*.tradingview.com https://huggingface.co https://cdn-lfs.huggingface.co https://cdn-lfs-us-1.huggingface.co https://api.pwnedpasswords.com;",
              "frame-src 'self' https://*.youtube.com https://*.youtube-nocookie.com https://*.tradingview.com;",
              "media-src 'self' blob: https://mail.programbi.com;",
              "font-src 'self' data:;",
              "object-src 'none';",
              "base-uri 'self';",
              "form-action 'self';",
              "frame-ancestors 'none';",
            ].join(" "),
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
