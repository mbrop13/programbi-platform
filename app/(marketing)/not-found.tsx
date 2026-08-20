import Link from "next/link";
import StatusPage from "@/components/shared/StatusPage";

export default function MarketingNotFound() {
  return (
    <StatusPage
      code="404"
      title="Esta página no existe"
      description="El enlace está mal o la página se movió. Vuelve al inicio o entra al catálogo de cursos."
      actions={
        <>
          <Link
            href="/"
            className="inline-flex h-12 items-center rounded-full bg-ink px-7 text-base font-semibold text-canvas no-underline transition-transform active:scale-[0.98]"
          >
            Ir al inicio
          </Link>
          <Link
            href="/cursos"
            className="inline-flex h-12 items-center rounded-full border border-line bg-paper px-7 text-base font-medium text-ink no-underline transition-colors hover:bg-wash active:scale-[0.98]"
          >
            Ver cursos
          </Link>
        </>
      }
      links={[
        { href: "/comunidad", label: "Comunidad" },
        { href: "/blog", label: "Blog" },
      ]}
    />
  );
}
