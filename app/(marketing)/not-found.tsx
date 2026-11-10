import NotFoundPage from "@/components/shared/NotFoundPage";

/**
 * 404 dentro del grupo de marketing: hereda sus layouts, así que aquí NO se
 * declara `robots` (ni index ni noindex). Next inyecta por su cuenta
 * `<meta name="robots" content="noindex">` en toda respuesta 404 y una segunda
 * declaración dejaría la página con dos metas robots.
 */
export default function NotFound() {
  return <NotFoundPage />;
}
