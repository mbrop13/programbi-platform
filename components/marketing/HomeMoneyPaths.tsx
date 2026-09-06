import Link from "next/link";
import { ArrowRight } from "lucide-react";

const paths = [
  {
    href: "/empresas",
    kicker: "Empresas",
    title: "Pack Adopción Power BI",
    text: "1–3 dashboards en producción + equipo autónomo. Power BI para empresas en Chile.",
  },
  {
    href: "/cursos/power-bi",
    kicker: "Curso",
    title: "Curso Power BI Chile",
    text: "En vivo: Power Query, DAX y dashboards. Formación individual.",
  },
  {
    href: "/cursos/analisis-de-datos",
    kicker: "Programa 144 h",
    title: "Cursos de análisis de datos",
    text: "SQL Server + Power BI + Python. El programa largo para salir de Excel.",
  },
  {
    href: "/cursos/analitica-mineria",
    kicker: "Vertical",
    title: "Power BI para minería",
    text: "Faena, OEE y reportes de turno. Curso abierto o Pack in-company.",
  },
];

export default function HomeMoneyPaths() {
  return (
    <section className="border-t border-line px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-[1400px]">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-mute">Por dónde partir</p>
        <h2 className="mt-3 max-w-2xl text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          Empresas, Power BI, análisis de datos o minería
        </h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {paths.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group flex flex-col rounded-2xl border border-line bg-paper p-5 no-underline transition-colors hover:border-ink/25 hover:bg-wash"
            >
              <span className="text-[11px] font-bold uppercase tracking-widest text-mute">{item.kicker}</span>
              <span className="mt-2 text-lg font-semibold tracking-tight text-ink">{item.title}</span>
              <span className="mt-2 flex-1 text-sm leading-relaxed text-mute">{item.text}</span>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-ink">
                Ver
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
