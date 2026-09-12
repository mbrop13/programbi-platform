"use client";

import dynamic from "next/dynamic";

const PromoPopup = dynamic(() => import("./PromoPopup"), { ssr: false });
const WhatsAppButton = dynamic(() => import("./WhatsAppButton"), { ssr: false });
const BlogSubscribeWidget = dynamic(() => import("./BlogSubscribeWidget"), { ssr: false });

/** Below-fold marketing widgets — keep them out of the home/cursos JS critical path. */
export default function MarketingChrome() {
  return (
    <>
      <PromoPopup />
      <WhatsAppButton />
      <BlogSubscribeWidget />
    </>
  );
}
