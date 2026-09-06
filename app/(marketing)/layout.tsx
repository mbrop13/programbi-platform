import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import PromoPopup from "@/components/shared/PromoPopup";
import WhatsAppButton from "@/components/shared/WhatsAppButton";
import BlogSubscribeWidget from "@/components/shared/BlogSubscribeWidget";
import AttributionCapture from "@/components/shared/AttributionCapture";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AttributionCapture />
      <Navbar />
      <main className="flex-1 bg-canvas">{children}</main>
      <Footer />
      <PromoPopup />
      <WhatsAppButton />
      <BlogSubscribeWidget />
    </>
  );
}
