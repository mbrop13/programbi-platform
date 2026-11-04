/**
 * Compatibilidad: el contenido de comparativas vive en `lib/data/academias.ts`.
 *
 * `app/sitemap.ts` (que integra el orquestador) importa desde este módulo.
 * Lo dejamos como re-export para no acoplar el sitemap a un rename.
 */
export * from "./academias";
