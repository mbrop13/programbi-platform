"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { PACK } from "@/lib/data/pack-adopcion";
import { REFERRAL_FAQS } from "@/lib/referrals/copy";
import { formatClp, formatClpCompact } from "@/lib/referrals/format";
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
      <PackStrip />
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
      <Link href="/referidos/app" className={primary}>
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
          <p className="font-mono text-[11px] font-medium tracking-[0.18em] text-faint uppercase">
            // referidos · chile · misma cuenta
          </p>
          <h1 className="mt-5 max-w-[18ch] text-4xl font-bold leading-[1.08] tracking-tight text-ink sm:text-5xl lg:text-[3.35rem] lg:leading-[1.08]">
            Trae un área en Excel.
            <br />
            Quédate el <em className="font-semibold italic">15%</em>.
          </h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-mute sm:text-lg">
            Presentas un Controller con dolor de cierre. Nosotros vendemos y entregamos el Pack.
            Tú cobras cuando se liquida la factura.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <PlatformAuthCtas />
          </div>

          <p className="mt-8 font-mono text-[12px] leading-relaxed text-faint">
            ticket {formatClpCompact(REFERRAL_TICKET_DEFAULT_CLP)}
            <span className="mx-2 text-faint">→</span>
            tu 15% {defaultPay}
            <span className="mx-2 text-faint">·</span>
            al cobro
          </p>
        </div>

        <div className="relative isolate min-h-[380px] border-t border-line sm:min-h-[460px] lg:min-h-full lg:border-t-0 lg:border-l lg:border-line">
          <HeroGlyphField className="absolute inset-0" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-canvas to-transparent lg:hidden" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-canvas to-transparent" />
          <div className="absolute inset-x-4 bottom-5 z-10 sm:inset-x-6 lg:inset-x-8 lg:bottom-8">
            <HeroTerminal />
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroTerminal() {
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-paper/90 shadow-[0_20px_50px_rgba(23,23,22,0.08)] backdrop-blur-md">
      <div className="flex items-center gap-2 border-b border-line px-3.5 py-2">
        <span className="size-2 rounded-full bg-ink/15" />
        <span className="size-2 rounded-full bg-ink/15" />
        <span className="size-2 rounded-full bg-ink/15" />
        <span className="ml-2 font-mono text-[10px] tracking-wide text-faint">referidos.ts</span>
      </div>
      <div className="overflow-x-auto px-4 py-3.5 font-mono text-[11px] leading-[1.7] text-ink sm:text-[12.5px]">
        <Line n={1} c="// Pack Adopción · factura directa" />
        <Line n={2}>
          <Kw>const</Kw> intro = <Fn>present</Fn>(controller)
        </Line>
        <Line n={3}>
          <Kw>const</Kw> pack = <Kw>await</Kw> <Fn>close</Fn>(intro)
          <Cm>{"  // nosotros"}</Cm>
        </Line>
        <Line n={4}>
          <Kw>const</Kw> pay = <Fn>floor</Fn>(neto * <Num>0.15</Num>)
          <Cm>{"  // tú"}</Cm>
        </Line>
        <Line n={5} c=" " />
        <Line n={6}>
          <Fn>assert</Fn>(pay.when === <Str>&quot;cobro&quot;</Str>)
        </Line>
        <Line n={7}>
          <Fn>assert</Fn>(clawback &lt;= <Num>60</Num>)
        </Line>
      </div>
    </div>
  );
}

function Line({
  n,
  c,
  children,
}: {
  n: number;
  c?: string;
  children?: ReactNode;
}) {
  return (
    <span className="flex gap-4">
      <span className="w-4 shrink-0 select-none text-right text-faint/70">{n}</span>
      <span className="min-w-0">{c !== undefined ? <Cm>{c}</Cm> : children}</span>
    </span>
  );
}

function Kw({ children }: { children: ReactNode }) {
  return <span className="text-ink">{children}</span>;
}
function Fn({ children }: { children: ReactNode }) {
  return <span className="text-ink/80">{children}</span>;
}
function Num({ children }: { children: ReactNode }) {
  return <span className="font-semibold text-ink">{children}</span>;
}
function Str({ children }: { children: ReactNode }) {
  return <span className="text-mute">{children}</span>;
}
function Cm({ children }: { children: ReactNode }) {
  return <span className="text-faint">{children}</span>;
}

function How() {
  const steps = [
    {
      n: "01",
      k: "present()",
      title: "Presentas el contacto",
      text: "Controller, Control de Gestión o gerencia con dolor Excel. Una intro, no un blast.",
    },
    {
      n: "02",
      k: "qualify()",
      title: "Calificamos a mano",
      text: "El equipo valida fit. Sin calificación no hay comisión — no es afiliado abierto.",
    },
    {
      n: "03",
      k: "close()",
      title: "Vendemos y entregamos",
      text: "Diagnóstico 30 min, propuesta, Pack: 1–3 dashboards + adopción 4–6 semanas.",
    },
    {
      n: "04",
      k: "floor(×0.15)",
      title: "Cobras el 15%",
      text: "Cuando se liquida la factura / OC. Transferencia a tu cuenta. Clawback 60 días.",
    },
  ];
  return (
    <section className="mx-auto max-w-[1400px] px-4 py-20 sm:px-6 lg:px-8">
      <p className="font-mono text-[11px] tracking-[0.18em] text-faint uppercase">
        // cómo funciona
      </p>
      <h2 className="mt-3 max-w-xl text-3xl font-bold tracking-tight sm:text-4xl">
        Tú abres la puerta. Nosotros cerramos el Pack.
      </h2>
      <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((s) => (
          <div key={s.n} className="bg-paper p-6">
            <p className="font-mono text-[11px] text-faint">
              {s.n} · {s.k}
            </p>
            <h3 className="mt-4 text-base font-semibold tracking-tight">{s.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-mute">{s.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function PackStrip() {
  return (
    <section className="border-y border-line bg-paper">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-8 px-4 py-16 sm:px-6 lg:flex-row lg:items-end lg:justify-between lg:px-8">
        <div className="max-w-2xl">
          <p className="font-mono text-[11px] tracking-[0.18em] text-faint uppercase">
            // qué es el pack
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">{PACK.headline}</h2>
          <p className="mt-3 max-w-xl text-mute">{PACK.tagline}</p>
          <ul className="mt-6 grid gap-2 text-sm sm:grid-cols-2">
            {[
              "1–3 dashboards con datos del área",
              "Capacitación 4–6 semanas",
              `${PACK.priceLabel} · ${PACK.priceFromLabel}`,
              "Factura directa, sin SENCE de por medio",
            ].map((t) => (
              <li key={t} className="flex items-start gap-2 text-ink">
                <Check className="mt-0.5 size-4 shrink-0 text-mute" strokeWidth={2.2} />
                {t}
              </li>
            ))}
          </ul>
        </div>
        <Link
          href="/empresas"
          className="inline-flex h-12 items-center gap-2 rounded-full border border-line bg-canvas px-6 text-[14.5px] font-semibold text-ink no-underline hover:bg-wash"
        >
          Ver oferta empresas
          <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
}

function CalculatorSection() {
  return (
    <section className="mx-auto max-w-[1400px] px-4 py-20 sm:px-6 lg:px-8">
      <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <p className="font-mono text-[11px] tracking-[0.18em] text-faint uppercase">// plata</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            15% del neto cobrado. Sin letra chica de afiliado.
          </h2>
          <p className="mt-4 max-w-md text-mute">
            Mueve el ticket referencial. El número es{" "}
            <span className="font-mono text-[13px] text-ink">floor(monto × 0.15)</span> en pesos.
            Pagamos cuando cobramos.
          </p>
          <p className="mt-6 font-mono text-[12px] text-faint">
            un Pack = una comisión
            <span className="mx-2">·</span>
            clawback 60d
          </p>
        </div>
        <CommissionCalculator />
      </div>
    </section>
  );
}

function Who() {
  const items = [
    { k: "alumni", title: "Alumni", text: "Cursaste con nosotros y tienes red en finanzas, ops o comercial." },
    { k: "client", title: "Clientes", text: "Ya viviste el Pack o un curso y conoces otra área con el mismo dolor." },
    { k: "partner", title: "Partners", text: "Consultoras, estudios y redes que tocan control de gestión en Chile." },
    { k: "other", title: "Otros", text: "Si tienes el contacto correcto, únete. Calificamos intros, no volumen." },
  ];
  return (
    <section className="mx-auto max-w-[1400px] px-4 py-20 sm:px-6 lg:px-8">
      <p className="font-mono text-[11px] tracking-[0.18em] text-faint uppercase">
        // quién puede unirse
      </p>
      <h2 className="mt-3 max-w-xl text-3xl font-bold tracking-tight sm:text-4xl">
        Red seria, no un programa masivo.
      </h2>
      <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((it) => (
          <div key={it.k} className="rounded-2xl border border-line bg-paper p-5">
            <p className="font-mono text-[11px] text-faint">{it.k}</p>
            <h3 className="mt-3 font-semibold tracking-tight">{it.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-mute">{it.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Rules() {
  const rules = [
    { k: "pay", t: "Pago solo al cobro (transferencia / OC liquidada)." },
    { k: "clawback", t: "Clawback 60 días si hay nota de crédito o devolución." },
    { k: "fit", t: "Intro calificada por el equipo. El link ?ref= sugiere, no cierra." },
    { k: "once", t: "Un Pack = una comisión. El primero atribuido; no upsells en v1." },
  ];
  return (
    <section className="border-y border-line bg-paper">
      <div className="mx-auto max-w-[1400px] px-4 py-16 sm:px-6 lg:px-8">
        <p className="font-mono text-[11px] tracking-[0.18em] text-faint uppercase">// reglas</p>
        <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">Corto y sin sorpresas.</h2>
        <ul className="mt-8 grid gap-3 sm:grid-cols-2">
          {rules.map((r) => (
            <li
              key={r.k}
              className="flex gap-3 rounded-xl border border-line bg-canvas px-4 py-3.5 text-sm"
            >
              <span className="font-mono text-[11px] text-faint">{r.k}</span>
              <span className="text-ink">{r.t}</span>
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
      <p className="font-mono text-[11px] tracking-[0.18em] text-faint uppercase">// faq</p>
      <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Preguntas</h2>
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
                <span className="font-mono text-faint">{isOpen ? "–" : "+"}</span>
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
        <p className="pointer-events-none absolute -right-4 top-1/2 hidden -translate-y-1/2 select-none font-mono text-[9rem] font-semibold leading-none text-canvas/[0.06] lg:block">
          15%
        </p>
        <p className="font-mono text-[11px] tracking-[0.18em] text-canvas/40 uppercase">
          // primera intro
        </p>
        <h2 className="relative mt-4 max-w-2xl text-3xl font-bold tracking-tight text-balance sm:text-4xl">
          Si conoces un área ahogada en Excel, esa intro vale 15%.
        </h2>
        <p className="relative mt-4 max-w-lg text-sm leading-relaxed text-canvas/65 sm:text-base">
          Usa tu cuenta de ProgramBI. Manda la primera intro. El resto lo hacemos nosotros.
        </p>
        <div className="relative mt-8 flex flex-wrap gap-3">
          <PlatformAuthCtas variant="final" />
        </div>
      </div>
    </section>
  );
}
