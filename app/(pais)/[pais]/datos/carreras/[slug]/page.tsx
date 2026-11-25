import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCarrerasPe } from "@/lib/datos-pe/carreras";
import { getFichasCarrerasCo } from "@/lib/datos-co/carreras";
import { getCarrerasPublicablesMx } from "@/lib/datos-mx/carreras";
import { metadataPeFicha, PagePeFicha } from "@/components/datos-pe/pages/FichaCarreraPePage";
import { metadataCoFicha, PageCoFicha } from "@/components/datos-co/pages/FichaCarreraCoPage";
import { metadataMxFicha, PageMxFicha } from "@/components/datos-mx/pages/FichaCarreraMxPage";

export const dynamic = "force-static";
export const dynamicParams = false;

type Params = { pais: string; slug: string };

export function generateStaticParams(): Params[] {
  const pe = getCarrerasPe().map((c) => ({ pais: "pe", slug: c.slug }));
  const co = getFichasCarrerasCo().map((c) => ({ pais: "co", slug: c.slug }));
  const mx = getCarrerasPublicablesMx().map((c) => ({ pais: "mx", slug: c.slug }));
  return [...pe, ...co, ...mx];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { pais, slug } = await params;
  const resolved = Promise.resolve({ pais, slug });
  if (pais === "pe") return metadataPeFicha({ params: resolved });
  if (pais === "co") return metadataCoFicha({ params: resolved });
  if (pais === "mx") return metadataMxFicha({ params: resolved });
  return {};
}

export default async function FichaCarreraPaisPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { pais, slug } = await params;
  const resolved = Promise.resolve({ pais, slug });
  if (pais === "pe") return PagePeFicha({ params: resolved });
  if (pais === "co") return PageCoFicha({ params: resolved });
  if (pais === "mx") return PageMxFicha({ params: resolved });
  notFound();
}
