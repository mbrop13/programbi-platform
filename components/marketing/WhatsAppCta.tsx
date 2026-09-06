"use client";

import { useEffect, useState } from "react";
import { whatsappHref, withPageUtms, type WhatsAppIntent } from "@/lib/whatsapp";

export default function WhatsAppCta({
  page,
  intent = "pack",
  course,
  children,
  className,
}: {
  page: string;
  intent?: WhatsAppIntent;
  course?: string;
  children: React.ReactNode;
  className?: string;
}) {
  const base = whatsappHref({ page, intent, course });
  const [href, setHref] = useState(base);

  useEffect(() => {
    setHref(withPageUtms(base));
  }, [base]);

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {children}
    </a>
  );
}
