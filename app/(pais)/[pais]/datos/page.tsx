import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { metadataPeHub, PagePeHub } from "@/components/datos-pe/pages/DatosHubPePage";
import { metadataCoHub, PageCoHub } from "@/components/datos-co/pages/DatosHubCoPage";
import { metadataMxHub, PageMxHub } from "@/components/datos-mx/pages/DatosHubMxPage";
import { metadataArHub, PageArHub } from "@/components/datos-ar/pages/DatosHubArPage";

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
  if (pais === "pe") return metadataPeHub({ params });
  if (pais === "co") return metadataCoHub({ params });
  if (pais === "mx") return metadataMxHub({ params });
  if (pais === "ar") return metadataArHub({ params });
  return {};
}

export default async function DatosPaisPage({ params }: { params: Promise<Params> }) {
  const { pais } = await params;
  if (pais === "pe") return PagePeHub({ params });
  if (pais === "co") return PageCoHub({ params });
  if (pais === "mx") return PageMxHub({ params });
  if (pais === "ar") return PageArHub({ params });
  notFound();
}
