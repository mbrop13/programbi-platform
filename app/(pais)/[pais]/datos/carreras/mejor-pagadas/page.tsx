import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  metadataPeMejorPagadas,
  PagePeMejorPagadas,
} from "@/components/datos-pe/pages/MejorPagadasPePage";
import {
  metadataCoMejorPagadas,
  PageCoMejorPagadas,
} from "@/components/datos-co/pages/MejorPagadasCoPage";
import {
  metadataArMejorPagadas,
  PageArMejorPagadas,
} from "@/components/datos-ar/pages/MejorPagadasArPage";

export const dynamic = "force-static";
export const dynamicParams = false;

type Params = { pais: string };

export function generateStaticParams(): Params[] {
  return [{ pais: "pe" }, { pais: "co" }, { pais: "ar" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { pais } = await params;
  if (pais === "pe") return metadataPeMejorPagadas({ params });
  if (pais === "co") return metadataCoMejorPagadas({ params });
  if (pais === "ar") return metadataArMejorPagadas({ params });
  return {};
}

export default async function CarrerasMejorPagadasPaisPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { pais } = await params;
  if (pais === "pe") return PagePeMejorPagadas({ params });
  if (pais === "co") return PageCoMejorPagadas({ params });
  if (pais === "ar") return PageArMejorPagadas({ params });
  notFound();
}
