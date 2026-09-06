import type { Metadata } from "next";
import HeroSection from "@/components/marketing/HeroSection";
import LogoSlider from "@/components/marketing/LogoSlider";
import HomeProof from "@/components/marketing/HomeProof";
import PackBand from "@/components/marketing/PackBand";
import HomeMoneyPaths from "@/components/marketing/HomeMoneyPaths";
import ProgramsCatalog from "@/components/marketing/ProgramsCatalog";
import JobsBanner from "@/components/marketing/JobsBanner";
import Team from "@/components/marketing/Team";
import Quote from "@/components/marketing/Quote";
import FaqSection from "@/components/marketing/FaqSection";
import LeadForm from "@/components/marketing/LeadForm";
import { HOME_FAQS, PACK } from "@/lib/data/pack-adopcion";
import { SITE_URL, jsonLdString } from "@/lib/seo";
import { PAGE_SEO } from "@/lib/seo/money";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: { absolute: PAGE_SEO.home.title },
  description: PAGE_SEO.home.description,
  alternates: { canonical: "/" },
  openGraph: {
    title: PAGE_SEO.home.title,
    description: PAGE_SEO.home.description,
    url: SITE_URL,
    type: "website",
  },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: HOME_FAQS.map((faq) => ({
    "@type": "Question",
    name: faq.q,
    acceptedAnswer: { "@type": "Answer", text: faq.a },
  })),
};

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(faqJsonLd) }} />
      <HeroSection />
      <LogoSlider />
      <PackBand />
      <HomeProof />
      <HomeMoneyPaths />
      <ProgramsCatalog />
      <JobsBanner />
      <Team />
      <Quote />
      <FaqSection />
      <LeadForm />
      <p className="sr-only">
        {PACK.name}. {PACK.headline}. {PACK.tagline}.
      </p>
    </>
  );
}
