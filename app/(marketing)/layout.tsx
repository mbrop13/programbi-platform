import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import PromoPopup from "@/components/shared/PromoPopup";
import WhatsAppButton from "@/components/shared/WhatsAppButton";
import BlogSubscribeWidget from "@/components/shared/BlogSubscribeWidget";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="flex-1 bg-canvas">{children}</main>
      <Footer />
      <PromoPopup />
      <WhatsAppButton />
      <BlogSubscribeWidget />
    </>
  );
}
