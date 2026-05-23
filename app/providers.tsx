"use client";

import { CountryProvider } from "@/lib/context/CountryContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CountryProvider>
      {children}
    </CountryProvider>
  );
}
