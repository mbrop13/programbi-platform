import type { Metadata } from "next";
import type { ReactNode } from "react";
import { DatosRootShell } from "@/components/datos/DatosRootShell";
import { DatosAnalytics } from "@/components/datos/DatosAnalytics";
import { METADATA_BASE } from "@/lib/seo/metadata-base";
import "@/app/globals.css";

export const metadata: Metadata = METADATA_BASE;

export default function DatosPublicosLayout({ children }: { children: ReactNode }) {
  return <DatosRootShell analytics={<DatosAnalytics />}>{children}</DatosRootShell>;
}
