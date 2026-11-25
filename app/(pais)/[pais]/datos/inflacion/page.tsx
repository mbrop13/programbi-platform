import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { metadataCoInflacion, PageCoInflacion } from "@/components/datos-co/pages/InflacionCoPage";
import { metadataArInflacion, PageArInflacion } from "@/components/datos-ar/pages/InflacionArPage";

export const revalidate = 86400;
export const dynamicParams = false;

type Params = { pais: string };

export function generateStaticParams(): Params[] {
  return [{ pais: "co" }, { pais: "ar" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { pais } = await params;
  if (pais === "co") return metadataCoInflacion({ params });
  if (pais === "ar") return metadataArInflacion({ params });
  return {};
}

export default async function InflacionPaisPage({ params }: { params: Promise<Params> }) {
  const { pais } = await params;
  if (pais === "co") return PageCoInflacion({ params });
  if (pais === "ar") return PageArInflacion({ params });
  notFound();
}
