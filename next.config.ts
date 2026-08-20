import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
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
    return [
      {
        source: "/cursos/copilot-studio",
        destination: "/cursos/copilot",
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
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com https://s3.tradingview.com https://*.tradingview.com;",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;",
              "img-src 'self' data: blob: https://images.unsplash.com https://cdn.shopify.com https://img.youtube.com https://mail.programbi.com https://flagcdn.com https://i.pravatar.cc https://www.svgrepo.com https://*.tradingview.com;",
              "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.mercadopago.com https://*.tradingview.com https://*.livekit.cloud wss://*.livekit.cloud https://huggingface.co https://cdn-lfs.huggingface.co https://cdn-lfs-us-1.huggingface.co;",
              "frame-src 'self' https://*.youtube.com https://*.youtube-nocookie.com https://*.tradingview.com;",
              "media-src 'self' blob: https://mail.programbi.com;",
              "font-src 'self' data: https://fonts.gstatic.com;",
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
            value: "camera=(self), microphone=(self), geolocation=()",
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
