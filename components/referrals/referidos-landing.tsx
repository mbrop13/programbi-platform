"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { REFERRAL_FAQS } from "@/lib/referrals/copy";
import { formatClp } from "@/lib/referrals/format";
import { REFERRAL_TICKET_DEFAULT_CLP } from "@/lib/referrals/constants";
import { calculateCommissionClp } from "@/lib/referrals/commission";
import { createClient } from "@/lib/supabase/client";
import { CommissionCalculator } from "./commission-calculator";
import { HeroGlyphField } from "./hero-glyph-field";

const defaultPay = formatClp(calculateCommissionClp(REFERRAL_TICKET_DEFAULT_CLP));

export function ReferidosLanding() {
  return (
    <div className="bg-canvas text-ink">
      <Hero />
      <How />
      <OfferStrip />
      <CalculatorSection />
      <Who />
      <Rules />
      <Faq />
      <FinalCta />
    </div>
  );
}

function PlatformAuthCtas({
  variant = "hero",
}: {
  variant?: "hero" | "final";
}) {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data }) => {
      setLoggedIn(Boolean(data.session));
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setLoggedIn(Boolean(session));
    });
    return () => subscription.unsubscribe();
  }, []);

  const primary =
    variant === "final"
      ? "inline-flex h-12 items-center gap-2 rounded-full bg-canvas px-7 text-[14.5px] font-semibold text-ink no-underline transition-transform active:scale-[0.98]"
      : "inline-flex h-12 items-center gap-2 rounded-full bg-ink px-7 text-[14.5px] font-semibold text-canvas no-underline shadow-md shadow-ink/10 transition-transform active:scale-[0.98]";
  const secondary =
    variant === "final"
      ? "inline-flex h-12 items-center rounded-full border border-canvas/20 px-7 text-[14.5px] font-medium text-canvas/80 no-underline hover:text-canvas"
      : "inline-flex h-12 items-center rounded-full border border-line bg-paper px-7 text-[14.5px] font-medium text-ink no-underline transition-colors hover:bg-wash active:scale-[0.98]";

  return (
    <>
      <Link href={loggedIn ? "/referidos/app" : "/login?next=/referidos/app"} className={primary}>
        {loggedIn ? "Entrar al panel" : "Entrar con mi cuenta"}
        <ArrowRight size={16} strokeWidth={2.4} />
      </Link>
      {loggedIn ? null : (
        <Link href="/registro?from=/referidos&next=/referidos/app" className={secondary}>
          Crear cuenta ProgramBI
        </Link>
      )}
    </>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-line lg:min-h-[calc(100dvh-72px)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_70%_40%,rgba(23,23,22,0.04),transparent_55%)]" />

      <div className="relative mx-auto grid h-full min-h-0 max-w-[1400px] lg:min-h-[calc(100dvh-72px)] lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:items-stretch">
        <div className="flex flex-col justify-center px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20 xl:px-10">
          <p className="text-[11px] font-semibold tracking-[0.16em] text-faint uppercase">
            Programa de referidos · Chile
          </p>
          <h1 className="mt-5 max-w-[16ch] text-4xl font-bold leading-[1.08] tracking-tight text-ink sm:text-5xl lg:text-[3.35rem] lg:leading-[1.08]">
            Invita a amigos o empresas.
          </h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-mute sm:text-lg">
            Recomienda un curso o una capacitación para un equipo. Si se cierra y se cobra, ganas
            el 15%.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <PlatformAuthCtas />
          </div>

          <p className="mt-8 text-[13px] text-faint">
            Ejemplo con un curso de {formatClp(REFERRAL_TICKET_DEFAULT_CLP)}: tu 15% son {defaultPay}.
          </p>
        </div>

        <div className="relative isolate min-h-[320px] border-t border-line sm:min-h-[420px] lg:min-h-full lg:border-t-0 lg:border-l lg:border-line">
          <HeroGlyphField className="absolute inset-0" />
        </div>
      </div>
    </section>
  );
}

function How() {
  const steps = [
    {
      n: "01",
      title: "Invitas",
      text: "Un amigo para un curso, o un área / empresa para una capacitación. Una intro, no un blast.",
    },
    {
      n: "02",
      title: "Calificamos",
      text: "El equipo valida el contacto a mano. Sin calificación no hay comisión.",
    },
    {
      n: "03",
      title: "Cerramos y formamos",
      text: "Nosotros conversamos, cobramos y entregamos el curso o la capacitación in-company.",
    },
    {
      n: "04",
      title: "Cobras el 15%",
      text: "Cuando se liquida la factura. Transferencia a tu cuenta. Clawback 60 días.",
    },
  ];
  return (
    <section className="mx-auto max-w-[1400px] px-4 py-20 sm:px-6 lg:px-8">
      <p className="text-[11px] font-semibold tracking-[0.16em] text-faint uppercase">Cómo funciona</p>
      <h2 className="mt-3 max-w-xl text-3xl font-bold tracking-tight sm:text-4xl">
        Tú presentas. Nosotros cerramos.
      </h2>
      <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((s) => (
          <div key={s.n} className="bg-paper p-6">
            <p className="text-[11px] font-semibold tracking-wide text-faint">{s.n}</p>
            <h3 className="mt-4 text-base font-semibold tracking-tight">{s.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-mute">{s.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function OfferStrip() {
  return (
    <section className="border-y border-line bg-paper">
      <div className="mx-auto max-w-[1400px] px-4 py-16 sm:px-6 lg:px-8">
        <p className="text-[11px] font-semibold tracking-[0.16em] text-faint uppercase">Qué puedes recomendar</p>
        <h2 className="mt-3 max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">
          Cursos para personas. Capacitación para equipos.
        </h2>
        <div className="mt-10 grid gap-4 lg:grid-cols-2">
          <article className="rounded-2xl border border-line bg-canvas p-6 sm:p-8">
            <p className="text-[11px] font-semibold tracking-[0.14em] text-faint uppercase">Amigos</p>
            <h3 className="mt-2 text-xl font-semibold tracking-tight">Cursos abiertos</h3>
            <p className="mt-2 text-sm leading-relaxed text-mute">
              Power BI, SQL, Python, Excel y más. Clases en vivo, para alguien que quiere aprender
              análisis de datos.
            </p>
            <ul className="mt-5 space-y-2 text-sm">
              {[
                "Cursos en vivo, online y presencial",
                "Niveles básico, intermedio y avanzado",
                "Misma cuenta de ProgramBI para el referido",
              ].map((t) => (
                <li key={t} className="flex items-start gap-2">
                  <Check className="mt-0.5 size-4 shrink-0 text-mute" strokeWidth={2.2} />
                  {t}
                </li>
              ))}
            </ul>
            <Link
              href="/cursos"
              className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-ink no-underline hover:underline"
            >
              Ver cursos <ArrowRight size={14} />
            </Link>
          </article>
          <article className="rounded-2xl border border-line bg-canvas p-6 sm:p-8">
            <p className="text-[11px] font-semibold tracking-[0.14em] text-faint uppercase">Empresas</p>
            <h3 className="mt-2 text-xl font-semibold tracking-tight">Capacitación corporativa</h3>
            <p className="mt-2 text-sm leading-relaxed text-mute">
              Formamos al equipo con los datos y procesos de la empresa. Programas in-company, no
              un curso genérico suelto.
            </p>
            <ul className="mt-5 space-y-2 text-sm">
              {[
                "Programas en vivo adaptados al equipo",
                "Facturación a la empresa",
                "Se cotiza; el 15% es sobre lo cobrado",
              ].map((t) => (
                <li key={t} className="flex items-start gap-2">
                  <Check className="mt-0.5 size-4 shrink-0 text-mute" strokeWidth={2.2} />
                  {t}
                </li>
              ))}
            </ul>
            <Link
              href="/empresas"
              className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-ink no-underline hover:underline"
            >
              Ver empresas <ArrowRight size={14} />
            </Link>
          </article>
        </div>
      </div>
    </section>
  );
}

function CalculatorSection() {
  return (
    <section className="mx-auto max-w-[1400px] px-4 py-20 sm:px-6 lg:px-8">
      <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.16em] text-faint uppercase">Comisión</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            15% de lo cobrado. Curso o empresa.
          </h2>
          <p className="mt-4 max-w-md text-mute">
            El ejemplo usa precios de cursos abiertos. Si cierras una capacitación a empresas, el
            15% se calcula igual: sobre el neto cobrado.
          </p>
        </div>
        <CommissionCalculator />
      </div>
    </section>
  );
}

function Who() {
  const items = [
    { title: "Alumni", text: "Cursaste con nosotros y conoces a alguien que también debería." },
    { title: "Alumnos", text: "Un compañero de trabajo o un amigo que quiere el mismo curso." },
    { title: "Empresas", text: "Tu área u otra empresa que necesita formar al equipo en datos." },
    { title: "Otros", text: "Si tienes el contacto correcto, únete. Calificamos intros, no volumen." },
  ];
  return (
    <section className="mx-auto max-w-[1400px] px-4 py-20 sm:px-6 lg:px-8">
      <p className="text-[11px] font-semibold tracking-[0.16em] text-faint uppercase">Quién puede unirse</p>
      <h2 className="mt-3 max-w-xl text-3xl font-bold tracking-tight sm:text-4xl">
        Si tienes a quién invitar, basta.
      </h2>
      <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((it) => (
          <div key={it.title} className="rounded-2xl border border-line bg-paper p-5">
            <h3 className="font-semibold tracking-tight">{it.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-mute">{it.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Rules() {
  const rules = [
    "Pago solo al cobro (transferencia / OC liquidada).",
    "Clawback 60 días si hay nota de crédito o devolución.",
    "Intro calificada por el equipo. El link ?ref= sugiere, no cierra.",
    "Una venta atribuida = una comisión. Curso o capacitación a empresas.",
  ];
  return (
    <section className="border-y border-line bg-paper">
      <div className="mx-auto max-w-[1400px] px-4 py-16 sm:px-6 lg:px-8">
        <p className="text-[11px] font-semibold tracking-[0.16em] text-faint uppercase">Reglas</p>
        <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">Corto y sin sorpresas.</h2>
        <ul className="mt-8 grid gap-3 sm:grid-cols-2">
          {rules.map((r) => (
            <li key={r} className="rounded-xl border border-line bg-canvas px-4 py-3.5 text-sm text-ink">
              {r}
            </li>
          ))}
        </ul>
        <Link
          href="/referidos/terminos"
          className="mt-6 inline-flex text-sm text-mute no-underline underline-offset-4 hover:text-ink hover:underline"
        >
          Leer términos completos
        </Link>
      </div>
    </section>
  );
}

function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
      <p className="text-[11px] font-semibold tracking-[0.16em] text-faint uppercase">Preguntas</p>
      <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">FAQ</h2>
      <div className="mt-10 divide-y divide-line border-y border-line">
        {REFERRAL_FAQS.map((item, i) => {
          const isOpen = open === i;
          return (
            <div key={item.q}>
              <button
                type="button"
                className="flex w-full items-center justify-between gap-4 py-4 text-left text-sm font-medium tracking-tight"
                aria-expanded={isOpen}
                onClick={() => setOpen(isOpen ? null : i)}
              >
                {item.q}
                <span className="text-faint">{isOpen ? "–" : "+"}</span>
              </button>
              {isOpen ? <p className="pb-4 text-sm leading-relaxed text-mute">{item.a}</p> : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="px-4 pb-20 sm:px-6 lg:px-8">
      <div className="relative mx-auto max-w-[1400px] overflow-hidden rounded-[28px] bg-ink px-6 py-14 text-canvas sm:px-12 sm:py-16">
        <h2 className="relative max-w-2xl text-3xl font-bold tracking-tight text-balance sm:text-4xl">
          Si conoces a alguien que debería aprender datos, invítalo.
        </h2>
        <p className="relative mt-4 max-w-lg text-sm leading-relaxed text-canvas/65 sm:text-base">
          Un amigo para un curso, o un equipo para una capacitación. Usa tu cuenta de ProgramBI.
        </p>
        <div className="relative mt-8 flex flex-wrap gap-3">
          <PlatformAuthCtas variant="final" />
        </div>
      </div>
    </section>
  );
}
