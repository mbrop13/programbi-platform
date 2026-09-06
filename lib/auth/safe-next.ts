/** Internal path only. Blocks protocol-relative and off-site redirects. */
export function safeNextPath(
  raw: string | null | undefined,
  fallback = "/comunidad/inicio"
): string {
  if (!raw) return fallback;
  const path = raw.trim();
  if (!path || path === "/") return fallback;
  if (!path.startsWith("/")) return fallback;
  if (path.startsWith("//") || path.startsWith("/\\")) return fallback;
  if (path.includes("://") || path.includes("\\")) return fallback;
  return path;
}
