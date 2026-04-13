export default function ComunidadLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <main className="flex-1 bg-surface-1 min-h-screen">
        {children}
      </main>
    </>
  );
}
