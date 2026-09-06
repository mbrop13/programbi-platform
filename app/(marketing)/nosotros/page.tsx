import type { Metadata } from "next";
import Link from "next/link";
import { Award, BookOpen, Users, Building, ShieldCheck, UserCheck } from "lucide-react";
import MentorsSection from "@/components/marketing/MentorsSection";
import { ogImageUrl } from "@/lib/og/url";

export const metadata: Metadata = {
  title: "Sobre Nosotros — Academia de Análisis de Datos | ProgramBI",
  description:
    "Conoce ProgramBI: la institución de capacitación profesional líder en Power BI, SQL, Python y Machine Learning en Chile y Latinoamérica. Fundada por Manuel Oliva.",
  alternates: {
    canonical: "/nosotros",
  },
  openGraph: {
    title: "Sobre Nosotros — Academia de Análisis de Datos | ProgramBI",
    description:
      "Conoce nuestra misión, metodología de clases en vivo e instructores de la industria. Liderando la capacitación en ciencia de datos y BI en Latinoamérica.",
    url: "https://www.programbi.com/nosotros",
    type: "website",
    images: [
      {
        url: ogImageUrl({
          kicker: "Quiénes somos",
          title: "+5.000 profesionales formados en análisis de datos",
          description:
            "Clases en vivo, instructores de la industria y proyectos reales. Desde Chile para Latinoamérica.",
          path: "nosotros",
        }),
        width: 1200,
        height: 630,
        alt: "Sobre ProgramBI",
      },
    ],
  },
};

const STATS = [
  { value: "+5,000", label: "Estudiantes formados", icon: Users },
  { value: "4.9 / 5", label: "Satisfacción promedio", icon: Award },
  { value: "100%", label: "Clases en vivo e interactivas", icon: BookOpen },
  { value: "30+", label: "Clientes corporativos", icon: Building },
];

export default function NosotrosPage() {
  const aboutJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "AboutPage",
        "@id": "https://www.programbi.com/nosotros/#webpage",
        url: "https://www.programbi.com/nosotros",
        name: "Sobre Nosotros — Academia de Análisis de Datos | ProgramBI",
        description: "Información institucional sobre la academia ProgramBI, fundadores, equipo docente y misión.",
        isPartOf: { "@id": "https://www.programbi.com/#website" },
        mainEntity: { "@id": "https://www.programbi.com/#organization" },
      },
      {
        "@type": "EducationalOrganization",
        "@id": "https://www.programbi.com/#organization",
        name: "ProgramBI SPA",
        url: "https://www.programbi.com",
        logo: {
          "@type": "ImageObject",
          url: "https://cdn.shopify.com/s/files/1/0564/3812/8712/files/logo-03_b7b98699-bd18-46ee-8b1b-31885a2c4c62.png?v=1766816974"
        },
        description: "Institución líder de formación profesional y consultoría de Business Intelligence en Chile y Latinoamérica."
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutJsonLd) }}
      />
      
      <main className="bg-canvas min-h-dvh pt-12 pb-20 sm:pt-16 text-ink relative">
        <section className="relative mb-16 lg:mb-20">
          <div className="max-w-6xl mx-auto px-5">
            <div className="max-w-3xl">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-ink tracking-tight leading-[1.12] mb-6">
                Capacitando a la próxima generación de profesionales de{" "}
                <em className="italic font-semibold">datos</em>
              </h1>
              <p className="text-mute text-lg sm:text-xl leading-relaxed mb-8 max-w-[65ch]">
                ProgramBI nace bajo la visión de cerrar la brecha técnica en el mercado laboral latinoamericano,
                ofreciendo programas prácticos de analítica dictados por profesionales que lideran proyectos reales de datos en el día a día.
              </p>
            </div>
          </div>
        </section>

        {/* Stats Grid */}
        <section className="py-16 mb-20 relative z-10">
          <div className="max-w-6xl mx-auto px-5">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {STATS.map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <div key={i} className="bg-paper p-6 sm:p-8 rounded-[26px] border border-line flex flex-col items-center text-center">
                    <div className="w-12 h-12 rounded-xl bg-wash flex items-center justify-center text-ink mb-4">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="block font-bold text-2xl sm:text-3xl text-ink mb-1">
                      {stat.value}
                    </span>
                    <span className="text-xs sm:text-sm text-mute font-medium leading-snug">
                      {stat.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="max-w-6xl mx-auto px-5 mb-4 relative z-10">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <h2 className="text-3xl sm:text-4xl font-bold text-ink tracking-tight leading-tight">
                Nuestra Historia & Enfoque Metodológico
              </h2>
              <p className="text-mute leading-relaxed text-base">
                Fundada por <strong>Manuel Oliva</strong> en Santiago de Chile, ProgramBI nació al constatar que la mayoría de los profesionales en las áreas de finanzas, administración y logística invertían horas haciendo tareas repetitivas en Excel que podían resolverse en minutos con SQL, Python o automatizaciones en Power BI.
              </p>
              <p className="text-mute leading-relaxed text-base">
                Decidimos diferenciarnos radicalmente de los cursos pregrabados tradicionales. Diseñamos una metodología interactiva basada en clases 100% online en vivo, con bases de datos que simulan problemas reales de negocios y soporte permanente fuera de clases. Hoy, contamos con estudiantes activos en más de 5 países de Latinoamérica.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-semibold text-ink">100% Clases Prácticas</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-semibold text-ink">Profesores con Experiencia</span>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-6 bg-paper border border-line rounded-[26px] p-8 sm:p-12 relative">
              <h3 className="font-bold text-2xl mb-4 text-ink">¿Por qué ProgramBI?</h3>
              <ul className="space-y-4 pl-0 list-none my-0">
                <li className="flex gap-3 items-start pl-0 text-zinc-600 text-sm sm:text-base leading-relaxed">
                  <span className="text-ink font-bold">✓</span>
                  <span>Instructores con Postgrado y trayectoria corporativa en mesa de dinero, retail y tecnología.</span>
                </li>
                <li className="flex gap-3 items-start pl-0 text-zinc-600 text-sm sm:text-base leading-relaxed">
                  <span className="text-ink font-bold">✓</span>
                  <span>Temarios optimizados para el mercado laboral actual, incluyendo Inteligencia Artificial generativa aplicada.</span>
                </li>
                <li className="flex gap-3 items-start pl-0 text-zinc-600 text-sm sm:text-base leading-relaxed">
                  <span className="text-ink font-bold">✓</span>
                  <span>Certificados oficiales validados con código de verificación para potenciar tu currículum.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Dynamic Accordion Team Section */}
        <div className="relative z-10 pt-2">
          <MentorsSection />
        </div>
      </main>
    </>
  );
}

