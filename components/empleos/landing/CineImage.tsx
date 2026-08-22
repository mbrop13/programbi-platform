import fs from "node:fs";
import path from "node:path";
import Image from "next/image";

/**
 * Imagen cinematográfica opcional: si el archivo existe en public/ se usa;
 * si no, cae a un fallback (p. ej. los heroes) para que la sección nunca
 * se vea rota. Ejecuta en build/render del server component.
 */
export default function CineImage({
  src,
  fallbackSrc,
  alt = "",
  dimClass = "",
  priority = false,
  sizes = "100vw",
  className = "",
}: {
  src: string;
  fallbackSrc: string;
  alt?: string;
  dimClass?: string;
  priority?: boolean;
  sizes?: string;
  className?: string;
}) {
  const file = src.startsWith("/") ? src.slice(1) : src;
  const exists = fs.existsSync(path.join(process.cwd(), "public", file));
  const finalSrc = exists ? src : fallbackSrc;

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`} aria-hidden={alt ? undefined : true}>
      <Image
        src={finalSrc}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        quality={75}
        className={`object-cover ${dimClass}`}
      />
    </div>
  );
}
