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
      // Las específicas van antes que los comodines y todas son 301 (Vercel) o
      // 308 `permanent: true` (Next), que Google trata igual.
      {
        source: "/pages/cursos-1",
        destination: "/cursos",
        permanent: true,
      },
      {
        source: "/pages/cursos",
        destination: "/cursos",
        permanent: true,
      },
      {
        source: "/pages/bootcamp",
        destination: "/cursos/analisis-de-datos",
        permanent: true,
      },
      {
        source: "/pages/contact",
        destination: "/empresas",
        permanent: true,
      },
      {
        source: "/pages/webinar",
        destination: claseGratis ? "/clase-gratis" : "/cursos",
        permanent: true,
      },
      {
        source: "/pages",
        destination: "/cursos",
        permanent: true,
      },
      {
        source: "/campus",
        destination: "/login",
        permanent: true,
      },
      {
        source: "/cart",
        destination: "/cursos",
        permanent: true,
      },
      {
        source: "/recommendations/products",
        destination: "/cursos",
        permanent: true,
      },
      {
        source: "/recommendations/products/:path*",
        destination: "/cursos",
        permanent: true,
      },
      {
        source: "/apps/:path*",
        destination: "/cursos",
        permanent: true,
      },
      {
        source: "/products/excel",
        destination: "/cursos/excel",
        permanent: true,
      },
      {
        source: "/products/curso-analisis-de-datos-para-la-mineria",
        destination: "/cursos/analitica-mineria",
        permanent: true,
      },
      {
        source: "/products/curso-de-analisis-de-datos-para-el-sector-financiero",
        destination: "/cursos/mercado-financiero",
        permanent: true,
      },
      {
        source: "/products/sql-server-program-bi",
        destination: "/cursos/sql-server",
        permanent: true,
      },
      {
        source: "/cursos/copilot-studio",
        destination: "/cursos/copilot",
        permanent: true,
      },
      {
        source: "/cursos/analitica-financiera",
        destination: "/cursos/mercado-financiero",
        permanent: true,
      },
      {
        source: "/cursos/analitica-financiera/:path*",
        destination: "/cursos/mercado-financiero",
        permanent: true,
      },
      {
        source: "/:pais/cursos/analitica-financiera",
        destination: "/:pais/cursos/mercado-financiero",
        permanent: true,
      },
      {
        source: "/:pais/cursos/analitica-financiera/:path*",
        destination: "/:pais/cursos/mercado-financiero",
        permanent: true,
      },
      {
        source: "/consultorias",
        destination: "/empresas",
        permanent: true,
      },
      {
        source: "/consultoria",
        destination: "/empresas",
        permanent: true,
      },
      {
        source: "/asesorias",
        destination: "/empresas",
        permanent: true,
      },
      {
        source: "/comunidad/configuracion",
        destination: "/comunidad/ajustes",
        permanent: true,
      },
      {
        source: "/comunidad/ai",
        destination: "/ai",
        permanent: true,
      },
      {
        source: "/comunidad/ai/:path*",
        destination: "/ai/:path*",
        permanent: true,
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
