import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { normalizarPais } from "@/config/paises";
import { getTestNivel, TESTS_NIVEL } from "@/lib/data/test-nivel";
import { metadataLocal } from "@/lib/paises/metadata";
import { localizarMercado } from "@/lib/paises/precios";
import { rutaLocal } from "@/lib/paises/rutas";
import { breadcrumbJsonLd, jsonLdString } from "@/lib/seo";
import TestNivelClient from "./TestNivelClient";

type Params = Promise<{ tema: string; pais?: string }>;

export function generateStaticParams() {
  return TESTS_NIVEL.map((test) => ({ tema: test.tema }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { tema, pais: rawPais } = await params;
  const test = getTestNivel(tema);
  if (!test) return { title: "Test no encontrado" };

  const pais = normalizarPais(rawPais);
  const title = `Test de nivel ${test.nombre} en Chile | ProgramBI`;
  const description = `Test de nivel ${test.nombre} gratis: 10 preguntas para medir tu conocimiento y recibir una recomendación de curso. Sin registro.`;

  return metadataLocal({
    pais,
    path: `/test-nivel/${test.tema}`,
    title,
    description,
  });
}

export default async function TestNivelPage({ params }: { params: Params }) {
  const { tema, pais: rawPais } = await params;
  const test = getTestNivel(tema);
  if (!test) notFound();

  const pais = normalizarPais(rawPais);
  const h1 = localizarMercado(`Test de nivel ${test.nombre} en Chile`, pais);
  const cursoUrl = rutaLocal(pais, `/cursos/${test.curso.slug}`);
  const otrosTests = TESTS_NIVEL.filter((item) => item.tema !== test.tema).map((item) => ({
    tema: item.tema,
    nombre: item.nombre,
    href: rutaLocal(pais, `/test-nivel/${item.tema}`),
  }));

  const breadcrumbs = breadcrumbJsonLd([
    { name: "Inicio", path: rutaLocal(pais, "/") },
    { name: "Cursos", path: rutaLocal(pais, "/cursos") },
    { name: h1, path: rutaLocal(pais, `/test-nivel/${test.tema}`) },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(breadcrumbs) }}
      />
      <TestNivelClient
        test={test}
        pais={pais}
        cursoUrl={cursoUrl}
        h1={h1}
        inicioUrl={rutaLocal(pais, "/")}
        otrosTests={otrosTests}
      />
    </>
  );
}
