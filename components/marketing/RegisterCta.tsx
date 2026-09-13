"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { trackClickRegistro, trackHomePrimaryRegistro } from "@/lib/analytics/marketing";

export default function RegisterCta({
  className,
  children,
  ctaId,
}: {
  className?: string;
  children: ReactNode;
  /** Home primary CTA id for click_cta_primary. */
  ctaId?: string;
}) {
  return (
    <Link
      href="/registro"
      className={className}
      data-cta-id={ctaId}
      onClick={(e) => {
        e.preventDefault();
        if (ctaId) trackHomePrimaryRegistro(ctaId);
        else trackClickRegistro();
        window.dispatchEvent(new CustomEvent("open-auth-modal", { detail: { tab: "register" } }));
      }}
    >
      {children}
    </Link>
  );
}
