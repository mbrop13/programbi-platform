import Image, { type ImageProps } from "next/image";

/**
 * Course/marketing covers optimized via Next.js Image pipeline (AVIF/WebP).
 */
export default function CourseImage({ src, alt, unoptimized, ...rest }: ImageProps) {
  return <Image {...rest} src={src} alt={alt} unoptimized={unoptimized} />;
}
