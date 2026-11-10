import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Clock, Target } from "lucide-react";
import { normalizarPais } from "@/config/paises";
import { TESTS_NIVEL } from "@/lib/data/test-nivel";
import { metadataLocal } from "@/lib/paises/metadata";
import { rutaLocal } from "@/lib/paises/rutas";
import { breadcrumbJsonLd, jsonLdString } from "@/lib/seo";

type Params = Promise<{ pais?: string }>;

const PATH = "/test-nivel";

const COPY = {
  titulo: "Test de nivel SQL y Excel en Chile",
  descripcion:
    "Dos tests gratuitos de 10 preguntas para saber tu nivel de SQL o Excel y recibir el curso que te conviene. Sin registro.",
  h1: "Test de nivel SQL y Excel en Chile",
  intro:
    "Elige el test, responde 10 preguntas y obtén tu nivel con una recomendación de curso. No necesitas cuenta ni dejar datos: el resultado se calcula en tu navegador.",
} as const;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const rawPais = (await params).pais;
  const pais = normalizarPais(rawPais);
  // La misma página sirve la raíz (/test-nivel) y las variantes por país
  // (/ve/test-nivel). Solo la raíz se indexa: el test es idéntico en todos los
  // mercados. Las variantes quedan `noindex, follow`, con canonical propio y
  // sin hreflang; la raíz tampoco emite hreflang hacia variantes noindex.
  return metadataLocal({
    pais,
    path: PATH,
    title: COPY.titulo,
    description: COPY.descripcion,
    forzarNoindex: Boolean(rawPais),
    sinHreflang: true,
  });
}

export default async function TestNivelHubPage({ params }: { params: Params }) {
  const pais = normalizarPais((await params).pais);
  const href = (destino: string) => rutaLocal(pais, destino);
  const tests = TESTS_NIVEL.map((test) => ({
    tema: test.tema,
    nombre: test.nombre,
    titulo: test.titulo,
    descripcion: test.descripcion,
    preguntas: test.preguntas.length,
    curso: test.curso.nombre,
    cursoHref: href(`/cursos/${test.curso.slug}`),
    href: href(`/test-nivel/${test.tema}`),
  }));

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ItemList",
        name: "Tests de nivel de ProgramBI",
        numberOfItems: tests.length,
        itemListElement: tests.map((test, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: test.nombre,
          url: test.href,
        })),
      },
      breadcrumbJsonLd([
        { name: "Inicio", path: href("/") },
        { name: "Cursos", path: href("/cursos") },
        { name: "Test de nivel", path: href(PATH) },
      ]),
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }}
      />

      <main className="min-h-screen bg-[#FAFBFC] pt-28 pb-20 lg:pt-32 lg:pb-28">
        <div className="mx-auto max-w-[900px] px-5 lg:px-10">
          <nav className="mb-7 flex items-center gap-2 text-xs font-semibold text-slate-400">
            <Link href={href("/")} className="text-slate-500 no-underline transition-colors hover:text-[#1890FF]">
              Inicio
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-slate-700">Test de nivel</span>
          </nav>

          <header className="mb-8">
            <span className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-blue-100/60 bg-blue-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-[#1890FF]">
              <Target className="h-3 w-3" />
              Gratis y sin registro
            </span>
            <h1 className="mb-4 font-display text-3xl font-black leading-[1.1] tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
              {COPY.h1}
            </h1>
            <p className="mb-0 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
              {COPY.intro}
            </p>
          </header>

          <section className="grid gap-5 sm:grid-cols-2">
            {tests.map((test) => (
              <article
                key={test.tema}
                className="flex flex-col rounded-3xl border border-slate-100 bg-white p-6 shadow-sm"
              >
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  {test.preguntas} preguntas
                </span>
                <h2 className="mt-2 font-display text-xl font-black tracking-tight text-slate-900">
                  {test.nombre}
                </h2>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">{test.descripcion}</p>
                <p className="mt-4 flex items-center gap-2 text-xs font-semibold text-slate-500">
                  <Clock className="h-3.5 w-3.5" aria-hidden />
                  Menos de 5 minutos
                </p>
                <Link
                  href={test.href}
                  className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-[#1890FF] px-5 py-3 text-sm font-bold text-white no-underline transition-colors hover:bg-blue-600"
                >
                  Empezar el test
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </article>
            ))}
          </section>

          <section className="mt-6 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="font-display text-lg font-black tracking-tight text-slate-900">
              Cómo funciona
            </h2>
            <ul className="mt-4 space-y-3">
              {[
                "Respondes 10 preguntas de alternativas, sin tiempo límite.",
                "Ves al instante cuántas acertaste y en qué nivel estás.",
                "Recibes el curso de ProgramBI que corresponde a ese nivel, con su ficha.",
                "Si quieres, dejas tu email para guardar el resultado. Es opcional.",
              ].map((paso) => (
                <li key={paso} className="flex items-start gap-2.5 text-sm leading-relaxed text-slate-600">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" aria-hidden />
                  <span>{paso}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </main>
    </>
  );
}
