import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Award, BookOpen, Users, Building, ShieldCheck, ArrowRight, UserCheck } from "lucide-react";

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
    url: "https://programbi.com/nosotros",
    type: "website",
  },
};

const STATS = [
  { value: "+5,000", label: "Estudiantes formados", icon: Users },
  { value: "4.9 / 5", label: "Satisfacción promedio", icon: Award },
  { value: "100%", label: "Clases en vivo e interactivas", icon: BookOpen },
  { value: "30+", label: "Clientes corporativos", icon: Building },
];

const TEAM = [
  {
    name: "Manuel Oliva",
    role: "CEO & Fundador",
    bio: "Magíster en Data Science (Universidad Adolfo Ibáñez), Contador Auditor (Universidad de Concepción), Ex-Mesa de Dinero Banco Itaú Chile. Profesor MBA (Universidad Gabriela Mistral).",
    linkedin: "https://cl.linkedin.com/company/programbi",
  },
  {
    name: "Emanuel Berrocal",
    role: "Instructor de Machine Learning",
    bio: "Ingeniero Civil Matemático (Universidad de Chile), Diplomado en Estadísticas (Universidad Católica de Chile). Portfolio Manager en Banco Itaú.",
    linkedin: "https://cl.linkedin.com/company/programbi",
  },
  {
    name: "Joaquin Villagra",
    role: "Docente de SQL & Python",
    bio: "MSc. Inteligencia Artificial, Magíster en Ingeniería Informática. Docente de Postgrado en la Universidad Adolfo Ibáñez.",
    linkedin: "https://cl.linkedin.com/company/programbi",
  },
  {
    name: "Rodrigo Vega",
    role: "Instructor de Power BI",
    bio: "Ingeniero Comercial (Universidad de Chile). Especialista en automatización y analista senior de Inteligencia de Negocios en Infracommerce.",
    linkedin: "https://cl.linkedin.com/company/programbi",
  },
];

export default function NosotrosPage() {
  const aboutJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "AboutPage",
        "@id": "https://programbi.com/nosotros/#webpage",
        url: "https://programbi.com/nosotros",
        name: "Sobre Nosotros — Academia de Análisis de Datos | ProgramBI",
        description: "Información institucional sobre la academia ProgramBI, fundadores, equipo docente y misión.",
        isPartOf: { "@id": "https://programbi.com/#website" },
        mainEntity: { "@id": "https://programbi.com/#organization" },
      },
      {
        "@type": "EducationalOrganization",
        "@id": "https://programbi.com/#organization",
        name: "ProgramBI SPA",
        url: "https://programbi.com",
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
      
      <main className="bg-white min-h-screen pt-28 pb-20 sm:pt-32">
        {/* Hero Section */}
        <section className="relative overflow-hidden mb-16 lg:mb-24">
          <div className="max-w-6xl mx-auto px-5">
            <div className="max-w-3xl">
              <span className="text-xs font-black uppercase tracking-widest text-[#1890FF] bg-blue-50 px-3.5 py-1.5 rounded-full inline-block mb-4">
                Quiénes Somos
              </span>
              <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-slate-900 tracking-tight leading-[1.1] mb-6">
                Capacitando a la próxima generación de profesionales de datos
              </h1>
              <p className="text-gray-500 text-lg sm:text-xl leading-relaxed mb-8">
                ProgramBI nace bajo la visión de cerrar la brecha técnica en el mercado laboral latinoamericano,
                ofreciendo programas prácticos de analítica dictados por profesionales que lideran proyectos reales de datos en el día a día.
              </p>
            </div>
          </div>
        </section>

        {/* Stats Grid */}
        <section className="bg-slate-50 py-16 mb-20">
          <div className="max-w-6xl mx-auto px-5">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {STATS.map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <div key={i} className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center text-center">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#1890FF] mb-4">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="block font-display font-black text-2xl sm:text-3xl text-slate-900 mb-1">
                      {stat.value}
                    </span>
                    <span className="text-xs sm:text-sm text-gray-400 font-semibold leading-snug">
                      {stat.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="max-w-6xl mx-auto px-5 mb-24">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <h2 className="font-display font-black text-3xl sm:text-4xl text-slate-900 tracking-tight leading-tight">
                Nuestra Historia & Enfoque Metodológico
              </h2>
              <p className="text-gray-600 leading-relaxed text-base">
                Fundada por <strong>Manuel Oliva</strong> en Santiago de Chile, ProgramBI nació al constatar que la mayoría de los profesionales en las áreas de finanzas, administración y logística invertían horas haciendo tareas repetitivas en Excel que podían resolverse en minutos con SQL, Python o automatizaciones en Power BI.
              </p>
              <p className="text-gray-600 leading-relaxed text-base">
                Decidimos diferenciarnos radicalmente de los cursos pregrabados tradicionales. Diseñamos una metodología interactiva basada en **clases 100% online en vivo**, con bases de datos que simulan problemas reales de negocios y soporte permanente fuera de clases. Hoy, contamos con estudiantes activos en más de 5 países de Latinoamérica.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-bold text-slate-800">100% Clases Prácticas</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-bold text-slate-800">Profesores con Experiencia</span>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-6 bg-slate-900 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#1890FF]/15 rounded-full blur-2xl" />
              <h3 className="font-display font-black text-2xl mb-4">¿Por qué ProgramBI?</h3>
              <ul className="space-y-4 pl-0 list-none my-0">
                <li className="flex gap-3 items-start pl-0 text-slate-300 text-sm sm:text-base leading-relaxed">
                  <span className="text-[#1890FF] font-black">✓</span>
                  <span>Instructores con Postgrado y trayectoria corporativa en mesa de dinero, retail y tecnología.</span>
                </li>
                <li className="flex gap-3 items-start pl-0 text-slate-300 text-sm sm:text-base leading-relaxed">
                  <span className="text-[#1890FF] font-black">✓</span>
                  <span>Temarios optimizados para el mercado laboral actual, incluyendo Inteligencia Artificial generativa aplicada.</span>
                </li>
                <li className="flex gap-3 items-start pl-0 text-slate-300 text-sm sm:text-base leading-relaxed">
                  <span className="text-[#1890FF] font-black">✓</span>
                  <span>Certificados oficiales validados con código de verificación para potenciar tu currículum.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="max-w-6xl mx-auto px-5 mb-12">
          <h2 className="font-display font-black text-3xl sm:text-4xl text-slate-900 tracking-tight leading-tight text-center mb-16">
            Equipo docente y mentores
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {TEAM.map((member, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-150 p-6 flex flex-col hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#1890FF] to-indigo-600 flex items-center justify-center text-white font-display font-black text-lg mb-5 shadow-sm">
                  {member.name[0]}
                </div>
                <h3 className="font-display font-bold text-slate-900 text-lg mb-1 leading-snug">
                  {member.name}
                </h3>
                <span className="text-xs font-bold text-[#1890FF] uppercase tracking-wider block mb-4">
                  {member.role}
                </span>
                <p className="text-gray-500 text-xs sm:text-sm leading-relaxed mb-6 flex-1">
                  {member.bio}
                </p>
                <a 
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-slate-500 hover:text-[#1890FF] no-underline flex items-center gap-1.5 transition-colors mt-auto"
                >
                  Ver LinkedIn
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
