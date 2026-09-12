import Image, { type ImageProps } from "next/image";

/**
 * Course/marketing covers.
 * Local files in /public/images/courses are already resized (~1600px, ~80–170 KB).
 * Serving them as static assets avoids the raw 2 MB mail.programbi.com JPEGs and
 * does not depend on the image optimizer at request time.
 * Remaining remote URLs go through the Next optimizer (GET works; HEAD is 405).
 */
export default function CourseImage({ src, alt, unoptimized, ...rest }: ImageProps) {
  const local = typeof src === "string" && src.startsWith("/");
  return <Image {...rest} src={src} alt={alt} unoptimized={unoptimized ?? local} />;
}
