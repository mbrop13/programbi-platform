"use client";

import Link from "next/link";
import { trackCtaClick } from "@/lib/analytics/marketing";

/** CTA de comparativa con el evento GA4 `cta_click` { location: 'comparativa' }. */
export default function ComparativaCta({
  href,
  label,
  rival,
  country,
  className,
  children,
}: {
  href: string;
  label: string;
  rival: string;
  country: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={className}
      onClick={() =>
        trackCtaClick(label, "comparativa", {
          rival,
          country,
          cta_label: label,
        })
      }
    >
      {children}
    </Link>
  );
}
