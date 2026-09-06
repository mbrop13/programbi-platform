"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  Check,
  GraduationCap,
  Handshake,
  Shield,
  Sparkles,
  Users,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PACK } from "@/lib/data/pack-adopcion";
import { REFERRAL_FAQS } from "@/lib/referrals/copy";
import { createClient } from "@/lib/supabase/client";
import { CommissionCalculator } from "./commission-calculator";
import { BorderBeam } from "./magic/border-beam";
import { Particles } from "./magic/particles";

const fade = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function ReferidosLanding() {
  return (
    <div className="bg-canvas text-ink">
      <Hero />
      <How />
      <PackBlock />
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
      ? cn(
          buttonVariants({ size: "lg" }),
          "h-11 bg-background px-5 text-foreground no-underline hover:bg-background/90"
        )
      : cn(buttonVariants({ size: "lg" }), "h-11 px-5 no-underline");
  const secondary =
    variant === "final"
      ? "inline-flex h-11 items-center justify-center px-5 text-sm text-background/80 no-underline hover:text-background"
      : cn(buttonVariants({ variant: "outline", size: "lg" }), "h-11 px-5 no-underline");

  return (
    <>
      <Link href="/referidos/app" className={primary}>
        {loggedIn ? "Entrar al panel" : "Entrar con mi cuenta"}
        <ArrowRight className="size-4" />
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
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(23,23,22,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(23,23,22,0.05)_1px,transparent_1px)] bg-[size:56px_56px] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)]"
      />
      <Particles className="opacity-70" />
      <div className="relative mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <motion.div initial="hidden" animate="show" variants={fade}>
          <p className="inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
            <Sparkles className="size-3.5 text-emerald-700 dark:text-emerald-400" />
            Programa de intros · Chile
          </p>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-[3.4rem] lg:leading-[1.05]">
            Gana 15% por cada Pack Adopción que cierres con tu intro
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Presentas un Controller / área con dolor Excel. Nosotros vendemos y entregamos. Tú cobras al cierre.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <PlatformAuthCtas />
          </div>
          <ul className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-1.5">
              <BadgeCheck className="size-4 text-emerald-700 dark:text-emerald-400" />
              Factura directa
            </li>
            <li className="flex items-center gap-1.5">
              <BadgeCheck className="size-4 text-emerald-700 dark:text-emerald-400" />
              Pack {PACK.priceLabel}
            </li>
            <li className="flex items-center gap-1.5">
              <BadgeCheck className="size-4 text-emerald-700 dark:text-emerald-400" />
              Chile
            </li>
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.55 }}
          className="relative"
        >
          <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
            <BorderBeam />
            <PackMock />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function PackMock() {
  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          Pack Adopción · simulación
        </p>
        <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-800 ring-1 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-500/20">
          15% al cobro
        </span>
      </div>
      <div className="mt-5 grid grid-cols-3 gap-2">
        {[
          { l: "Ticket", v: "$3.2M" },
          { l: "Tu 15%", v: "$480 mil" },
          { l: "Plazo", v: "4–6 sem" },
        ].map((k) => (
          <div key={k.l} className="rounded-xl bg-muted/60 px-3 py-3">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{k.l}</p>
            <p className="mt-1 text-sm font-semibold tabular-nums">{k.v}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 space-y-2">
        {["Cierre Excel", "Tablero en producción", "Equipo autónomo"].map((row, i) => (
          <div
            key={row}
            className="flex items-center justify-between rounded-xl border border-border/80 px-3 py-2.5 text-sm"
          >
            <span>{row}</span>
            <span className="h-1.5 w-24 overflow-hidden rounded-full bg-muted">
              <span
                className="block h-full rounded-full bg-emerald-700 dark:bg-emerald-400"
                style={{ width: `${70 - i * 18}%` }}
              />
            </span>
          </div>
        ))}
      </div>
      <p className="mt-4 text-xs text-muted-foreground">
        UI ilustrativa del Pack — no es un dato de clientes ni un caso publicado.
      </p>
    </div>
  );
}

function How() {
  const steps = [
    {
      n: "01",
      title: "Presentas el contacto",
      text: "Controller, Control de Gestión o gerencia con dolor Excel. Una intro, no un blast.",
    },
    {
      n: "02",
      title: "Calificamos a mano",
      text: "El equipo valida fit. Sin calificación no hay comisión — no es afiliado abierto.",
    },
    {
      n: "03",
      title: "Vendemos y entregamos",
      text: "Diagnóstico 30 min, propuesta, Pack: 1–3 dashboards + adopción 4–6 semanas.",
    },
    {
      n: "04",
      title: "Cobras el 15%",
      text: "Cuando se liquida la factura / OC. Transferencia a tu cuenta. Clawback 60 días.",
    },
  ];
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        Cómo funciona
      </p>
      <h2 className="mt-2 max-w-xl text-3xl font-semibold tracking-tight">
        Tú abres la puerta. Nosotros cerramos el Pack.
      </h2>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((s) => (
          <div key={s.n} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <p className="font-mono text-xs text-emerald-700 dark:text-emerald-400">{s.n}</p>
            <h3 className="mt-3 text-base font-semibold">{s.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function PackBlock() {
  return (
    <section className="border-y border-border bg-muted/40">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-16 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Qué es el Pack
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight">{PACK.headline}</h2>
          <p className="mt-3 text-muted-foreground">{PACK.tagline}</p>
          <ul className="mt-5 space-y-2 text-sm">
            {[
              `1–3 dashboards con datos del área`,
              `Capacitación 4–6 semanas`,
              `${PACK.priceLabel} · ${PACK.priceFromLabel}`,
              "Factura directa, sin SENCE de por medio",
            ].map((t) => (
              <li key={t} className="flex items-start gap-2">
                <Check className="mt-0.5 size-4 shrink-0 text-emerald-700 dark:text-emerald-400" />
                {t}
              </li>
            ))}
          </ul>
        </div>
        <Link
          href="/empresas"
          className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-11 px-5 no-underline")}
        >
          Ver Pack Adopción
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </section>
  );
}

function CalculatorSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Plata
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight">
            15% del neto cobrado. Sin letra chica de afiliado.
          </h2>
          <p className="mt-3 text-muted-foreground">
            Mueve el ticket referencial. El número es floor(monto × 0.15) en pesos. Pagamos cuando
            cobramos.
          </p>
        </div>
        <CommissionCalculator />
      </div>
    </section>
  );
}

function Who() {
  const items = [
    {
      icon: GraduationCap,
      title: "Alumni",
      text: "Cursaste con nosotros y tienes red en finanzas, ops o comercial.",
    },
    {
      icon: Building2,
      title: "Clientes",
      text: "Ya viviste el Pack o un curso y conoces otra área con el mismo dolor.",
    },
    {
      icon: Handshake,
      title: "Partners",
      text: "Consultoras, estudios y redes que tocan control de gestión en Chile.",
    },
    {
      icon: Users,
      title: "Otros",
      text: "Si tienes el contacto correcto, únete. Calificamos intros, no volumen.",
    },
  ];
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        Quién puede unirse
      </p>
      <h2 className="mt-2 text-3xl font-semibold tracking-tight">Red seria, no un programa masivo.</h2>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((it) => (
          <div key={it.title} className="rounded-2xl border border-border bg-card p-5">
            <it.icon className="size-5 text-foreground" />
            <h3 className="mt-4 font-semibold">{it.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{it.text}</p>
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
    "Un Pack = una comisión. El primero atribuido; no upsells en v1.",
  ];
  return (
    <section className="border-y border-border bg-card">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="flex items-start gap-3">
          <Shield className="mt-1 size-5 text-emerald-700 dark:text-emerald-400" />
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Reglas cortas</h2>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {rules.map((r) => (
                <li key={r} className="rounded-xl border border-border bg-background px-4 py-3 text-sm">
                  {r}
                </li>
              ))}
            </ul>
            <Link
              href="/referidos/terminos"
              className="mt-5 inline-flex text-sm text-muted-foreground underline-offset-4 hover:underline"
            >
              Leer términos completos
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
      <h2 className="text-3xl font-semibold tracking-tight">Preguntas</h2>
      <div className="mt-8 divide-y divide-border border-y border-border">
        {REFERRAL_FAQS.map((item, i) => {
          const isOpen = open === i;
          return (
            <div key={item.q}>
              <button
                type="button"
                className="flex w-full items-center justify-between gap-4 py-4 text-left text-sm font-medium"
                aria-expanded={isOpen}
                onClick={() => setOpen(isOpen ? null : i)}
              >
                {item.q}
                <span className="text-muted-foreground">{isOpen ? "–" : "+"}</span>
              </button>
              {isOpen ? (
                <p className="pb-4 text-sm leading-relaxed text-muted-foreground">{item.a}</p>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="px-4 pb-20 sm:px-6">
      <div className="relative mx-auto max-w-4xl overflow-hidden rounded-3xl border border-border bg-foreground px-6 py-12 text-background sm:px-12">
        <h2 className="text-3xl font-semibold tracking-tight text-balance">
          Si conoces un área ahogada en Excel, esa intro vale 15%.
        </h2>
        <p className="mt-3 max-w-xl text-sm text-background/70">
          Usa tu cuenta de ProgramBI. Manda la primera intro. El resto lo hacemos nosotros.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <PlatformAuthCtas variant="final" />
        </div>
      </div>
    </section>
  );
}
