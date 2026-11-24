import type { Metadata } from "next";
import type { ReactNode } from "react";
import { DatosRootShell } from "@/components/datos/DatosRootShell";
import SiteAnalytics from "@/components/shared/SiteAnalytics";
import { METADATA_BASE } from "@/lib/seo/metadata-base";
import "./datos-base.css";

export const metadata: Metadata = METADATA_BASE;

export default function DatosPublicosLayout({ children }: { children: ReactNode }) {
  return <DatosRootShell analytics={<SiteAnalytics />}>{children}</DatosRootShell>;
}
