import type { ReactNode } from "react";

export default function EmbedLayout({ children }: { children: ReactNode }) {
  return <html lang="es-CL"><body style={{ margin: 0 }}>{children}</body></html>;
}
