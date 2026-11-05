import Link from "next/link";

import StatusPage from "@/components/shared/StatusPage";

/**
 * 404 propio de la ficha: `notFound()` se dispara tanto por formato inválido
 * como por código inexistente, sin revelar cuál de los dos fue.
 */
export default function CertificadoNoEncontrado() {
  return (
    <StatusPage
      code="404"
      title="Certificado no encontrado"
      description="No hay un certificado registrado con ese código. Revisa que esté completo, sin espacios ni caracteres de más, y vuelve a intentarlo."
      actions={
        <>
          <Link
            href="/verificar-certificado"
            className="inline-flex h-12 items-center rounded-full bg-ink px-7 text-base font-semibold text-canvas no-underline transition-transform active:scale-[0.98]"
          >
            Verificar otro código
          </Link>
          <Link
            href="/cursos"
            className="inline-flex h-12 items-center rounded-full border border-line bg-paper px-7 text-base font-medium text-ink no-underline transition-colors hover:bg-wash active:scale-[0.98]"
          >
            Ver cursos
          </Link>
        </>
      }
    />
  );
}
