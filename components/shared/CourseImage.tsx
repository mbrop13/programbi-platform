import Image, { type ImageProps } from "next/image";

/** Remote course covers (mail.programbi.com) reject the Next optimizer HEAD check. */
export default function CourseImage({ src, alt, ...rest }: ImageProps) {
  const remote = typeof src === "string" && src.startsWith("http");
  return <Image {...rest} src={src} alt={alt} unoptimized={remote} />;
}
