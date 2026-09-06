"use client";

import { CountryProvider } from "@/lib/context/CountryContext";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
      <CountryProvider>
        {children}
      </CountryProvider>
      <Toaster richColors position="top-right" />
    </ThemeProvider>
  );
}
