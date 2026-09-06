import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { HeroGlyphField } from "@/components/referrals/hero-glyph-field";
import LogoSlider from "@/components/marketing/LogoSlider";
import { whatsappHref } from "@/lib/whatsapp";
import { EmpresasContactForm } from "./empresas-contact-form";
import { EmpresasFaq } from "./empresas-faq";

const WA = whatsappHref({
  page: "/empresas",
  intent: "empresas",
});

const INCLUDES = [
  {
    title: "En vivo, para el equipo",
    text: "Sesiones con mentor. No es un video suelto ni un curso masivo.",
  },
  {
    title: "Con sus datos",
    text: "Ejercicios sobre las planillas, sistemas y KPIs que ya usan.",
  },
  {
    title: "Factura a la empresa",
    text: "Propuesta, OC si hace falta y reporte de asistencia.",
  },
  {
    title: "El equipo queda haciendo el trabajo",
    text: "Salen armando reportes y consultas. No dependen de un consultor para cada filtro.",
  },
];

const STEPS = [
  {
    n: "01",
    title: "Nos cuentas el caso",
    text: "Área, tamaño del grupo y qué necesitan saber hacer. 20–30 minutos.",
  },
  {
    n: "02",
    title: "Armamos el programa",
    text: "Temas, nivel, fechas y valor. Te llega una propuesta concreta.",
  },
  {
    n: "03",
    title: "Capacitamos en vivo",
    text: "El equipo practica con sus datos. Quedan grabaciones y material.",
  },
];

const TOPICS = [
  { name: "Power BI", line: "Dashboards, modelo y DAX." },
  { name: "SQL Server", line: "Consultas, joins y bases de trabajo." },
  { name: "Python", line: "Análisis y automatización de reportes." },
  { name: "Excel", line: "De planilla eterna a proceso claro." },
  { name: "Power Automate", line: "Flujos, avisos y menos copiar-pegar." },
  { name: "IA en el trabajo", line: "Copilot y productividad del equipo." },
];

export function EmpresasLanding() {
  return (
    <div className="bg-canvas text-ink">
      <Hero />
      <LogoSlider className="border-0 bg-transparent" />
      <Includes />
      <How />
      <Topics />
      <Faq />
      <Contact />
    </div>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-line lg:min-h-[calc(100dvh-72px)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_70%_40%,rgba(23,23,22,0.04),transparent_55%)]" />

      <div className="relative mx-auto grid h-full min-h-0 max-w-[1400px] lg:min-h-[calc(100dvh-72px)] lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:items-stretch">
        <div className="flex flex-col justify-center px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20 xl:px-10">
          <p className="text-[11px] font-semibold tracking-[0.16em] text-faint uppercase">
            Capacitación corporativa · Chile
          </p>
          <h1 className="mt-5 max-w-[14ch] text-4xl font-bold leading-[1.08] tracking-tight text-ink sm:text-5xl lg:text-[3.35rem] lg:leading-[1.08]">
            Formamos a tu equipo en datos.
          </h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-mute sm:text-lg">
            Power BI, SQL, Python y automatización. En vivo, con los casos de la
            empresa. Factura a nombre de la empresa.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#contacto"
              className="inline-flex h-12 items-center gap-2 rounded-full bg-ink px-7 text-[14.5px] font-semibold text-canvas no-underline shadow-md shadow-ink/10 transition-transform active:scale-[0.98]"
            >
              Pedir una propuesta
              <ArrowRight size={16} strokeWidth={2.4} />
            </a>
            <a
              href={WA}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center rounded-full border border-line bg-paper px-7 text-[14.5px] font-medium text-ink no-underline transition-colors hover:bg-wash active:scale-[0.98]"
            >
              WhatsApp
            </a>
          </div>

          <p className="mt-8 text-[13px] text-faint">
            No es el curso abierto. Es un programa para el equipo.
          </p>
        </div>

        <div className="relative isolate min-h-[280px] border-t border-line sm:min-h-[380px] lg:min-h-full lg:border-t-0 lg:border-l lg:border-line">
          <HeroGlyphField text="equipo" className="absolute inset-0" />
        </div>
      </div>
    </section>
  );
}

function Includes() {
  return (
    <section className="mx-auto max-w-[1400px] px-4 py-20 sm:px-6 lg:px-8">
      <p className="text-[11px] font-semibold tracking-[0.16em] text-faint uppercase">
        Qué ofrecemos
      </p>
      <h2 className="mt-3 max-w-xl text-3xl font-bold tracking-tight sm:text-4xl">
        Capacitación in-company. Claro y directo.
      </h2>
      <p className="mt-4 max-w-xl text-mute">
        Formamos al equipo para que arme y mantenga sus propios reportes. Si
        también hay que construir un tablero, lo conversamos aparte.
      </p>
      <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2">
        {INCLUDES.map((item) => (
          <div key={item.title} className="bg-paper p-6">
            <h3 className="text-base font-semibold tracking-tight">{item.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-mute">{item.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function How() {
  return (
    <section className="border-y border-line bg-paper">
      <div className="mx-auto max-w-[1400px] px-4 py-16 sm:px-6 lg:px-8">
        <p className="text-[11px] font-semibold tracking-[0.16em] text-faint uppercase">
          Cómo funciona
        </p>
        <h2 className="mt-3 max-w-xl text-3xl font-bold tracking-tight sm:text-4xl">
          Tres pasos. Conversación, propuesta, clases.
        </h2>
        <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-line bg-line lg:grid-cols-3">
          {STEPS.map((step) => (
            <div key={step.n} className="bg-canvas p-6">
              <p className="text-[11px] font-semibold tracking-wide text-faint">{step.n}</p>
              <h3 className="mt-4 text-base font-semibold tracking-tight">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-mute">{step.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Topics() {
  return (
    <section className="mx-auto max-w-[1400px] px-4 py-20 sm:px-6 lg:px-8">
      <p className="text-[11px] font-semibold tracking-[0.16em] text-faint uppercase">
        Temas
      </p>
      <h2 className="mt-3 max-w-xl text-3xl font-bold tracking-tight sm:text-4xl">
        Lo que enseñamos al equipo.
      </h2>
      <p className="mt-4 max-w-xl text-mute">
        Combinamos lo que el área necesita. No hay que comprar un curso suelto
        por persona.
      </p>
      <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {TOPICS.map((topic) => (
          <div key={topic.name} className="rounded-2xl border border-line bg-paper p-5">
            <h3 className="font-semibold tracking-tight">{topic.name}</h3>
            <p className="mt-2 text-sm leading-relaxed text-mute">{topic.line}</p>
          </div>
        ))}
      </div>
      <p className="mt-8 text-sm text-mute">
        Si alguien del equipo quiere un cupo en un curso abierto, está en{" "}
        <Link href="/cursos" className="font-semibold text-ink underline-offset-4 hover:underline">
          /cursos
        </Link>
        .
      </p>
    </section>
  );
}

function Faq() {
  return (
    <section className="border-y border-line bg-paper">
      <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
        <p className="text-[11px] font-semibold tracking-[0.16em] text-faint uppercase">
          Preguntas
        </p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">FAQ</h2>
        <EmpresasFaq />
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section id="contacto" className="scroll-mt-24">
      <div className="mx-auto grid max-w-[1400px] gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:items-start lg:px-8">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.16em] text-faint uppercase">
            Contacto
          </p>
          <h2 className="mt-3 max-w-[16ch] text-3xl font-bold tracking-tight sm:text-4xl">
            Cuéntanos del equipo. Te armamos una propuesta.
          </h2>
          <p className="mt-4 max-w-md text-mute">
            Respondemos con temas, formato y valor. Sin un proceso largo.
          </p>
          <ul className="mt-8 space-y-3 text-sm">
            {[
              "Propuesta para capacitación in-company",
              "Factura a la empresa",
              "WhatsApp +56 9 3540 9699",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <Check className="mt-0.5 size-4 shrink-0 text-mute" strokeWidth={2.2} />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <EmpresasContactForm />
      </div>
    </section>
  );
}
