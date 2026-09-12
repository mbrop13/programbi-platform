import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import MarketingChrome from "@/components/shared/MarketingChrome";
import AttributionCapture from "@/components/shared/AttributionCapture";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-ink focus:px-4 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-canvas"
      >
        Saltar al contenido
      </a>
      <AttributionCapture />
      <Navbar />
      <main id="contenido" className="flex-1 bg-canvas">
        {children}
      </main>
      <Footer />
      <MarketingChrome />
    </>
  );
}
