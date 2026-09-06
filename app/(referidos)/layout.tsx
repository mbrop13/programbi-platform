import Navbar from "@/components/shared/Navbar";

export default function ReferidosGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
