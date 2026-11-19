import Image, { type ImageProps } from "next/image";

const DEFAULT_FILL_SIZES = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw";

function isLocalImageSrc(src: ImageProps["src"]): boolean {
  return typeof src === "string" ? src.startsWith("/") || !/^https?:\/\//i.test(src) : true;
}

/**
 * Course/marketing covers optimized via Next.js Image pipeline (AVIF/WebP).
 * Never forces `unoptimized` on local images and ensures responsive `sizes` when `fill` is used.
 */
export default function CourseImage({
  src,
  alt,
  unoptimized,
  fill,
  sizes,
  ...rest
}: ImageProps) {
  const isLocal = isLocalImageSrc(src);
  const effectiveSizes = fill ? (sizes ?? DEFAULT_FILL_SIZES) : sizes;
  return (
    <Image
      {...rest}
      src={src}
      alt={alt}
      fill={fill}
      sizes={effectiveSizes}
      unoptimized={isLocal ? undefined : unoptimized}
    />
  );
}
