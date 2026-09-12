"use client";

import dynamic from "next/dynamic";
import { CountryProvider } from "@/lib/context/CountryContext";
import { ThemeProvider } from "@/components/theme-provider";

const Toaster = dynamic(() => import("sonner").then((m) => m.Toaster), { ssr: false });

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
