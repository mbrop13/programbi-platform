import HeroSection from "@/components/marketing/HeroSection";
import LogoSlider from "@/components/marketing/LogoSlider";
import CoursesSection from "@/components/marketing/CoursesSection";
import GallerySection from "@/components/marketing/GallerySection";
import DiagnosticSection from "@/components/marketing/DiagnosticSection";
import MentorsSection from "@/components/marketing/MentorsSection";
import FounderSection from "@/components/marketing/FounderSection";
import FaqSection from "@/components/marketing/FaqSection";
import ContactSection from "@/components/marketing/ContactSection";
import CtaBanner from "@/components/marketing/CtaBanner";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <LogoSlider />
      <CoursesSection />
      <GallerySection />
      <DiagnosticSection />
      <MentorsSection />
      <FounderSection />
      <FaqSection />
      <CtaBanner />
      <ContactSection />
    </>
  );
}
