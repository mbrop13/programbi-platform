import Link from "next/link";

/**
 * Estado de respaldo cuando Supabase no responde y no hay versión cacheada.
 * Responde 200 (nunca 500) y no inventa contenido: solo explica el problema
 * y ofrece volver al listado.
 */
export default function ContenidoNoDisponible({
  seccion,
}: {
  seccion: "blog" | "newsletter";
}) {
  const esBlog = seccion === "blog";

  return (
    <section className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-6 py-24 text-center">
      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
        {esBlog ? "Blog" : "Newsletter"}
      </p>
      <h1 className="mt-4 font-serif text-3xl font-bold text-slate-950 sm:text-4xl">
        No pudimos cargar este artículo
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-slate-600">
        Tuvimos un problema temporal para obtener el contenido. Vuelve a intentarlo en unos
        minutos.
      </p>
      <Link
        href={esBlog ? "/blog" : "/newsletter"}
        className="mt-8 inline-flex h-11 items-center rounded-full bg-slate-950 px-6 text-sm font-semibold text-white no-underline"
      >
        {esBlog ? "Volver al blog" : "Volver a la newsletter"}
      </Link>
    </section>
  );
}
