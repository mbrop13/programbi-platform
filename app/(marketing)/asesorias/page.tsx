import { redirect } from "next/navigation";

// La antigua página de asesorías ahora es la página de Empresas.
// Redirect permanente (308) para conservar SEO y no romper enlaces entrantes.
export default function AsesoriasRedirect() {
  redirect("/empresas");
}
