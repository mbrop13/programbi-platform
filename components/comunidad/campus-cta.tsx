"use client";

import { useState, type ReactNode } from "react";
import dynamic from "next/dynamic";

const AuthModal = dynamic(() => import("@/components/shared/AuthModal"), { ssr: false });

export function CampusCta({
  isLoggedIn,
  href,
  className,
  children,
}: {
  isLoggedIn: boolean;
  href: string;
  className?: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  if (isLoggedIn) {
    return (
      <a href={href} className={className}>
        {children}
      </a>
    );
  }

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={className}>
        {children}
      </button>
      {open ? (
        <AuthModal
          isOpen
          onClose={() => setOpen(false)}
          defaultTab="register"
          redirectUrl={href}
        />
      ) : null}
    </>
  );
}
