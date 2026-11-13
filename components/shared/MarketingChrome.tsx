"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

const PromoPopup = dynamic(() => import("./PromoPopup"), { ssr: false });
const WhatsAppButton = dynamic(() => import("./WhatsAppButton"));
const BlogSubscribeWidget = dynamic(() => import("./BlogSubscribeWidget"), { ssr: false });

/** Below-fold marketing widgets — keep them out of the home/cursos JS critical path. */
export default function MarketingChrome() {
  const pathname = usePathname();

  // El brochure se muestra como visor de documento a pantalla completa: sin
  // PromoPopup, WhatsAppButton ni BlogSubscribeWidget.
  const isBrochure = pathname?.endsWith("/brochure") ?? false;
  if (isBrochure) return null;

  return (
    <>
      <PromoPopup />
      <WhatsAppButton />
      {pathname?.startsWith("/blog") ? <BlogSubscribeWidget /> : null}
    </>
  );
}
