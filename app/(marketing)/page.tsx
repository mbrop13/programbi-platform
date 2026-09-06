import type { Metadata } from "next";
import HeroSection from "@/components/marketing/HeroSection";
import LogoSlider from "@/components/marketing/LogoSlider";
import Metrics from "@/components/marketing/Metrics";
import Flagship from "@/components/marketing/Flagship";
import Programs from "@/components/marketing/Programs";
import JobsBanner from "@/components/marketing/JobsBanner";
import Team from "@/components/marketing/Team";
import Quote from "@/components/marketing/Quote";
import FaqSection from "@/components/marketing/FaqSection";
import LeadForm from "@/components/marketing/LeadForm";
import { homeFaqs } from "@/lib/data/site";
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
  mainEntity: homeFaqs.map((faq) => ({
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
      <Metrics />
      <Flagship />
      <Programs />
      <JobsBanner />
      <Team />
      <Quote />
      <FaqSection />
      <LeadForm />
    </>
  );
}
