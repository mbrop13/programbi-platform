import type { Metadata } from "next";
import HeroSection from "@/components/marketing/HeroSection";
import LogoSlider from "@/components/marketing/LogoSlider";
import Metrics from "@/components/marketing/Metrics";
import Programs from "@/components/marketing/Programs";
import Team from "@/components/marketing/Team";
import Quote from "@/components/marketing/Quote";
import FaqSection from "@/components/marketing/FaqSection";
import HomeDeferred from "@/components/marketing/HomeDeferred";
import { homeFaqs } from "@/lib/data/site";
import { courses } from "@/lib/data/courses";
import { catalogHours, publicLevelCount } from "@/lib/data/course-views";
import { getActiveSchedules } from "@/lib/supabase/comunidad-ai";
import type { CourseSchedule } from "@/lib/data/course-schedules";
import { SITE_URL, absoluteUrl, jsonLdString, DEFAULT_OG_IMAGE } from "@/lib/seo";
import { PAGE_SEO } from "@/lib/seo/money";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: { absolute: PAGE_SEO.home.title },
  description: PAGE_SEO.home.description,
  alternates: { canonical: absoluteUrl("/") },
  openGraph: {
    title: PAGE_SEO.home.title,
    description: PAGE_SEO.home.description,
    url: SITE_URL,
    type: "website",
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: PAGE_SEO.home.title,
    description: PAGE_SEO.home.description,
    images: [DEFAULT_OG_IMAGE.url],
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

export default async function HomePage() {
  const schedules = (await getActiveSchedules()) as CourseSchedule[];
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(faqJsonLd) }} />
      <HeroSection />
      <LogoSlider />
      <Metrics />
      <Programs
        schedules={schedules}
        catalog={courses.map((c) => ({
          slug: c.slug,
          title: c.title,
          shortDescription: c.shortDescription,
          imageUrl: c.imageUrl,
          durationHours: catalogHours(c),
          techStack: c.techStack,
          badgeLabel: c.badgeLabel,
          levelsCount: publicLevelCount(c),
        }))}
      />
      <Team />
      <Quote />
      <FaqSection />
      <HomeDeferred />
    </>
  );
}
