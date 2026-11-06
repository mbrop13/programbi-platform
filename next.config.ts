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
    // `/clase-gratis` responde 404 con el flag apagado, así que el destino de
    // /pages/webinar depende de NEXT_PUBLIC_CLASE_GRATIS. En vercel.json esa
    // regla apunta a /cursos (el JSON no evalúa variables de entorno) y es la
    // que manda en producción; al encender el flag hay que cambiarla a mano.
    // Ver docs/fase5/WS4.md.
    const claseGratis =
      (process.env.NEXT_PUBLIC_CLASE_GRATIS || "").trim().toLowerCase() === "1";

    return [
      // URLs antiguas de Shopify/WordPress que Search Console reporta como 404.
      // Las específicas van antes que los comodines. Todas son 301 explícitos
      // (`statusCode: 301`), igual que en vercel.json.
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
        source: "/pages/bootcamp",
        destination: "/cursos/analisis-de-datos",
        statusCode: 301,
      },
      {
        source: "/pages/contact",
        destination: "/empresas",
        statusCode: 301,
      },
      {
        source: "/pages/webinar",
        destination: claseGratis ? "/clase-gratis" : "/cursos",
        statusCode: 301,
      },
      {
        source: "/pages",
        destination: "/cursos",
        statusCode: 301,
      },
      {
        source: "/campus",
        destination: "/login",
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
        source: "/recommendations/products/:path*",
        destination: "/cursos",
        statusCode: 301,
      },
      {
        source: "/apps/:path*",
        destination: "/cursos",
        statusCode: 301,
      },
      {
        source: "/products/excel",
        destination: "/cursos/excel",
        statusCode: 301,
      },
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
        source: "/products/sql-server-program-bi",
        destination: "/cursos/sql-server",
        statusCode: 301,
      },
      // Fallback de la familia /products (handles viejos de Shopify). Va después
      // de las reglas específicas para no comérselas; en vercel.json el
      // equivalente `/products/:path*` también está al final del bloque.
      {
        source: "/products/:path*",
        destination: "/cursos",
        statusCode: 301,
      },
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
        source: "/cursos/analitica-financiera/:path*",
        destination: "/cursos/mercado-financiero",
        statusCode: 301,
      },
      {
        source: "/:pais/cursos/analitica-financiera",
        destination: "/:pais/cursos/mercado-financiero",
        statusCode: 301,
      },
      {
        source: "/:pais/cursos/analitica-financiera/:path*",
        destination: "/:pais/cursos/mercado-financiero",
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
      // Near-brand: /programa-bi aparece en Search Console y hoy da 404.
      // No existe ninguna ruta bajo esa carpeta, así que el comodín es seguro.
      {
        source: "/programa-bi",
        destination: "/cursos",
        statusCode: 301,
      },
      {
        source: "/programa-bi/:path*",
        destination: "/cursos",
        statusCode: 301,
      },
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
        source: "/comunidad/ai/:path*",
        destination: "/ai/:path*",
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
