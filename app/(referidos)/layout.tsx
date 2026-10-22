import type { Metadata } from "next";
import RootShell from "@/components/shared/RootShell";
import { METADATA_BASE } from "@/lib/seo/metadata-base";

export const metadata: Metadata = {
  ...METADATA_BASE,
  alternates: { canonical: null },
  robots: { index: false, follow: false },
};

export default function ReferidosGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RootShell lang="es-CL">
      <div className="min-h-dvh bg-canvas text-ink">{children}</div>
    </RootShell>
  );
}
