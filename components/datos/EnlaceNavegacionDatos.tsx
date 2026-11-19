import type { ComponentProps } from "react";
import Link from "next/link";

export default function EnlaceNavegacionDatos(props: ComponentProps<typeof Link>) {
  return <Link {...props} prefetch={false} />;
}
