import NotFoundPage from "@/components/shared/NotFoundPage";

/**
 * 404 dentro de las versiones por país: hereda el layout de `[pais]`, así que
 * aquí NO se declara `robots`. Next inyecta `<meta name="robots"
 * content="noindex">` en toda respuesta 404; duplicarlo dejaría dos metas.
 */
export default function NotFound() {
  return <NotFoundPage />;
}
