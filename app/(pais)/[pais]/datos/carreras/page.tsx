import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { metadataPeCarreras, PagePeCarreras } from "@/components/datos-pe/pages/CarrerasPePage";
import { metadataCoCarreras, PageCoCarreras } from "@/components/datos-co/pages/CarrerasCoPage";
import { metadataMxCarreras, PageMxCarreras } from "@/components/datos-mx/pages/CarrerasMxPage";
import { metadataArCarreras, PageArCarreras } from "@/components/datos-ar/pages/CarrerasArPage";

export const dynamic = "force-static";
export const dynamicParams = false;

type Params = { pais: string };

export function generateStaticParams(): Params[] {
  return [{ pais: "pe" }, { pais: "co" }, { pais: "mx" }, { pais: "ar" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { pais } = await params;
  if (pais === "pe") return metadataPeCarreras({ params });
  if (pais === "co") return metadataCoCarreras({ params });
  if (pais === "mx") return metadataMxCarreras({ params });
  if (pais === "ar") return metadataArCarreras({ params });
  return {};
}

export default async function CarrerasPaisPage({ params }: { params: Promise<Params> }) {
  const { pais } = await params;
  if (pais === "pe") return PagePeCarreras({ params });
  if (pais === "co") return PageCoCarreras({ params });
  if (pais === "mx") return PageMxCarreras({ params });
  if (pais === "ar") return PageArCarreras({ params });
  notFound();
}
