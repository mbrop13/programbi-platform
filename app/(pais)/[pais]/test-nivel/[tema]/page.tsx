import Link from "next/link";
import { getTestNivel } from "@/lib/data/test-nivel";
import TestNivelPais from "../../../../(marketing)/test-nivel/[tema]/page";

// La metadata y el canonical salen de la página nacional: `metadataLocal`
// detecta el país por `params` y la deja en noindex, follow (WS6).
export {
  generateMetadata,
  generateStaticParams,
} from "../../../../(marketing)/test-nivel/[tema]/page";

type Params = Promise<{ tema: string; pais: string }>;

/**
 * Variante por país de un test de nivel. Conserva el test y su CTA local, y
 * cierra con un enlace a la versión general (la indexable).
 */
export default async function TestNivelTemaPaisPage({ params }: { params: Params }) {
  const { tema } = await params;
  const test = getTestNivel(tema);

  return (
    <>
      <TestNivelPais params={params} />
      {test && (
        <div className="mx-auto max-w-[900px] px-5 pb-16 lg:px-10">
          <p className="mb-0 rounded-2xl border border-slate-100 bg-white p-5 text-sm leading-relaxed text-slate-600 shadow-sm">
            El test de {test.nombre} también está en la versión general del sitio.{" "}
            <Link
              href={`/test-nivel/${test.tema}`}
              className="font-bold text-[#1890FF] no-underline transition-colors hover:text-blue-600 hover:underline"
            >
              Ver el test de {test.nombre} general
            </Link>
            .
          </p>
        </div>
      )}
    </>
  );
}
