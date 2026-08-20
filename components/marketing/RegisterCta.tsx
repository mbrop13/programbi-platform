"use client";

import type { ReactNode } from "react";
import Link from "next/link";

export default function RegisterCta({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <Link
      href="/registro"
      className={className}
      onClick={(e) => {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent("open-auth-modal", { detail: { tab: "register" } }));
      }}
    >
      {children}
    </Link>
  );
}
