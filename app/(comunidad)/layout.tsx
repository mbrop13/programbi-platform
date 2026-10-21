import type { Metadata } from "next";
import RootShell from "@/components/shared/RootShell";
import { METADATA_BASE, ROBOTS_NOINDEX_FOLLOW } from "@/lib/seo/metadata-base";

/**
 * Root layout de /comunidad (y sus subrutas) y de /ai.
 * No se indexan, pero sí se siguen: meta robots "noindex, follow".
 */
export const metadata: Metadata = {
  ...METADATA_BASE,
  // Sin canonical: estas páginas no tienen una equivalente que canonicizar.
  alternates: { canonical: null },
  robots: ROBOTS_NOINDEX_FOLLOW,
};

export default function ComunidadLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RootShell lang="es-CL">{children}</RootShell>;
}
