import Link from "next/link";

export default function CampusNotFound() {
  return (
    <div className="rounded-xl border border-border bg-surface px-6 py-16 text-center max-w-lg mx-auto">
      <h1 className="text-xl font-semibold tracking-tight">No encontrado</h1>
      <p className="mt-1 text-sm text-muted-foreground">Esa página del campus no existe o ya no está disponible.</p>
      <Link href="/comunidad/inicio" className="mt-4 inline-flex text-sm font-medium underline underline-offset-4">
        Volver al inicio
      </Link>
    </div>
  );
}
