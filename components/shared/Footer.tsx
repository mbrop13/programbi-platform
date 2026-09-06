import Link from "next/link";
import Image from "next/image";
import { getCoursesBySlugs } from "@/lib/data/courses";
import { HOME_COURSE_SLUGS } from "@/lib/seo";

const socialLinks = [
  { name: "Instagram", href: "https://www.instagram.com/programbi_capacitaciones/" },
  { name: "LinkedIn", href: "https://cl.linkedin.com/company/programbi" },
  { name: "YouTube", href: "https://www.youtube.com/@ProgramBi" },
  { name: "TikTok", href: "https://www.tiktok.com/@programbi" },
];

const companyLinks = [
  { label: "Empresas — Pack Adopción Power BI", href: "/empresas" },
  { label: "Curso Power BI Chile", href: "/cursos/power-bi" },
  { label: "Cursos de análisis de datos", href: "/cursos/analisis-de-datos" },
  { label: "Power BI para minería", href: "/cursos/analitica-mineria" },
  { label: "Referidos", href: "/referidos" },
  { label: "Migrar Excel a Power BI", href: "/migrar-excel-a-power-bi" },
  { label: "Curso vs Pack Adopción", href: "/curso-power-bi-vs-pack-adopcion" },
  { label: "Cursos", href: "/cursos" },
  { label: "Blog", href: "/blog" },
  { label: "Preguntas frecuentes", href: "/#faq" },
];

export default function Footer({ compact: _compact = false }: { compact?: boolean }) {
  const topCourses = getCoursesBySlugs(HOME_COURSE_SLUGS);

  return (
    <footer className="border-t border-line bg-paper px-4 py-12 sm:px-6 lg:px-8" aria-label="Pie de página">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <Link href="/" className="relative block h-8 w-[148px]" aria-label="ProgramBI">
            <Image src="/images/logo.png" alt="ProgramBI" fill sizes="148px" className="object-contain object-left" />
          </Link>
          <p className="mt-4 max-w-[28rem] text-sm leading-relaxed text-mute">
            Pack Adopción BI para empresas y cursos en vivo de Power BI, SQL y Python. Santiago, Chile.
          </p>
        </div>

        <nav className="flex flex-col gap-3 text-sm font-medium text-ink" aria-label="Sitio">
          {companyLinks.map((item) => (
            <Link key={item.href} href={item.href} className="no-underline hover:text-mute">
              {item.label}
            </Link>
          ))}
        </nav>

        <nav className="flex flex-col gap-3 text-sm font-medium text-ink" aria-label="Cursos">
          {topCourses.map((course) => (
            <Link key={course.slug} href={`/cursos/${course.slug}`} className="no-underline hover:text-mute">
              {course.title}
            </Link>
          ))}
        </nav>

        <div className="flex flex-col gap-3 text-sm text-mute">
          {socialLinks.map((social) => (
            <a key={social.name} href={social.href} target="_blank" rel="noopener noreferrer">
              {social.name}
            </a>
          ))}
          <a href="mailto:contacto@programbi.cl">contacto@programbi.cl</a>
          <a href="https://wa.me/56935409699">WhatsApp</a>
          <Link href="/privacidad" className="no-underline">
            Privacidad
          </Link>
          <Link href="/terminos" className="no-underline">
            Términos
          </Link>
        </div>
      </div>
      <p className="mx-auto mt-12 max-w-[1400px] text-xs text-faint">ProgramBI SPA · Chile</p>
    </footer>
  );
}
