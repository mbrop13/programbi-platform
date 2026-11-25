import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { metadataCoDesempleo, PageCoDesempleo } from "@/components/datos-co/pages/DesempleoCoPage";
import { metadataArDesempleo, PageArDesempleo } from "@/components/datos-ar/pages/DesempleoArPage";

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
  if (pais === "co") return metadataCoDesempleo({ params });
  if (pais === "ar") return metadataArDesempleo({ params });
  return {};
}

export default async function DesempleoPaisPage({ params }: { params: Promise<Params> }) {
  const { pais } = await params;
  if (pais === "co") return PageCoDesempleo({ params });
  if (pais === "ar") return PageArDesempleo({ params });
  notFound();
}
