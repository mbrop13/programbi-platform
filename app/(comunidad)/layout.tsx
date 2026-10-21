import type { Metadata } from "next";
import RootShell from "@/components/shared/RootShell";
import { METADATA_BASE } from "@/lib/seo/metadata-base";

export const metadata: Metadata = {
  ...METADATA_BASE,
};

export default function ComunidadLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RootShell lang="es-CL">{children}</RootShell>;
}
