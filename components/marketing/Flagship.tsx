import Link from "next/link";
import RegisterCta from "@/components/marketing/RegisterCta";
import CourseImage from "@/components/shared/CourseImage";
import { courses } from "@/lib/data/courses";

const analisis = courses.find((c) => c.slug === "analisis-de-datos");

export default function Flagship() {
  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl lg:text-5xl">
            El programa de 144 horas
          </h2>
          <p className="mt-5 max-w-[38rem] text-base leading-relaxed text-mute lg:text-lg">
            SQL Server, Power BI y Python. Tres niveles de 48 horas, proyectos reales y certificado por módulo.
          </p>
          <p className="mt-4 text-sm font-medium text-ink">Desde $299.000 CLP el nivel básico.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <RegisterCta className="inline-flex h-12 items-center rounded-full bg-ink px-7 text-base font-semibold text-canvas transition-transform active:scale-[0.98]">
              Registrarse
            </RegisterCta>
            <Link
              href="/cursos/analisis-de-datos"
              className="inline-flex h-12 items-center rounded-full border border-line bg-paper px-7 text-base font-medium text-ink no-underline transition-colors hover:bg-wash"
            >
              Temario
            </Link>
          </div>
        </div>

        <div className="relative min-h-[42vh] overflow-hidden rounded-[26px] border border-line bg-wash lg:min-h-[520px]">
          <CourseImage
            src={analisis?.imageUrl ?? ""}
            alt="Análisis de Datos — programa de 144 horas"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
