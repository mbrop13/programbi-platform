import Link from "next/link";
import HubTestNivel from "../../../(marketing)/test-nivel/page";

// La metadata y el canonical salen de la página nacional: `metadataLocal`
// detecta el país por `params` y la deja en noindex, follow (WS6).
export { generateMetadata } from "../../../(marketing)/test-nivel/page";

export const revalidate = 86400;

type Params = Promise<{ pais: string }>;

/**
 * Variante por país del hub de test de nivel. Se mantiene la UX local (mismos
 * enlaces a los tests del país) y se agrega al final un enlace a la versión
 * general, que es la única indexable.
 */
export default async function TestNivelPaisPage({ params }: { params: Params }) {
  return (
    <>
      <HubTestNivel params={params} />
      <div className="mx-auto max-w-[900px] px-5 pb-16 lg:px-10">
        <p className="mb-0 rounded-2xl border border-slate-100 bg-white p-5 text-sm leading-relaxed text-slate-600 shadow-sm">
          El test de nivel también está en la versión general del sitio.{" "}
          <Link
            href="/test-nivel"
            className="font-bold text-[#1890FF] no-underline transition-colors hover:text-blue-600 hover:underline"
          >
            Ver el test de nivel general
          </Link>
          .
        </p>
      </div>
    </>
  );
}
