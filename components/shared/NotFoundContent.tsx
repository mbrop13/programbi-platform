import Link from "next/link";
import { PACK } from "@/lib/data/pack-adopcion";

export default function NotFoundContent() {
  return (
    <main className="flex min-h-[70dvh] flex-col items-center justify-center bg-canvas px-4 py-20 text-center">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-mute">404</p>
      <h1 className="mt-3 max-w-xl text-3xl font-bold tracking-tight text-ink sm:text-4xl">
        Esta página no está.
      </h1>
      <p className="mt-4 max-w-md text-base leading-relaxed text-mute">
        Si buscabas implementación Power BI o migrar Excel, el Pack Adopción está en empresas. Los cursos abiertos
        siguen en el catálogo.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/empresas"
          className="inline-flex h-12 items-center justify-center rounded-full bg-ink px-6 text-sm font-semibold text-canvas no-underline"
        >
          Pack Adopción BI
        </Link>
        <Link
          href="/cursos/power-bi"
          className="inline-flex h-12 items-center justify-center rounded-full border border-line bg-paper px-6 text-sm font-medium text-ink no-underline"
        >
          Curso Power BI
        </Link>
        <Link
          href="/migrar-excel-a-power-bi"
          className="inline-flex h-12 items-center justify-center rounded-full border border-line bg-paper px-6 text-sm font-medium text-ink no-underline"
        >
          Migrar Excel → Power BI
        </Link>
      </div>
      <p className="mt-8 text-sm text-mute">{PACK.tagline}</p>
    </main>
  );
}
