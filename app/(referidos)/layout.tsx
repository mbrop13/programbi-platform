export const metadata = { robots: { index: false, follow: false } };

export default function ReferidosGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-dvh bg-canvas text-ink">{children}</div>;
}
