import Link from "@/components/datos/EnlaceNavegacionDatos";
import {
  BookOpen,
  Briefcase,
  Building2,
  CheckCircle2,
  Compass,
  GitCompare,
  Sparkles,
  XCircle,
} from "lucide-react";
import type { CarreraRecord } from "@/lib/datos/carreras";
import type { ContextoComparativoFicha } from "@/lib/datos/textos-carreras";
import { anosDesdeSemestres, pesos, porcentaje } from "@/lib/datos/formato";
import { sujetoCarrera, type PerfilCarrera } from "@/lib/datos/perfiles-carreras";

/** Accesos rápidos bajo el hero: saltan a cada bloque de la ficha. */
export function NavegacionFicha({ conPerfil }: { conPerfil: boolean }) {
  const enlaces = [
    { href: "#cifras", label: "Sueldo y empleo" },
    ...(conPerfil
      ? [
          { href: "#que-hace", label: "¿Qué hace?" },
          { href: "#es-para-ti", label: "¿Es para ti?" },
        ]
      : []),
    { href: "#parecidas", label: "Carreras parecidas" },
    { href: "#preguntas", label: "Preguntas" },
  ];
  return (
    <nav aria-label="Secciones de la ficha" className="-mx-4 overflow-x-auto px-4 [scrollbar-width:none] sm:mx-0 sm:px-0">
      <ul className="flex w-max gap-2">
        {enlaces.map((e) => (
          <li key={e.href}>
            <a
              href={e.href}
              className="inline-flex h-9 items-center rounded-full border border-border bg-card px-3.5 text-sm font-medium text-foreground/80 no-underline transition-colors hover:border-[#1890ff] hover:text-[#0958d9]"
            >
              {e.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function Chips({ items, tono = "neutro" }: { items: string[]; tono?: "neutro" | "azul" }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {items.map((item) => (
        <li
          key={item}
          className={
            tono === "azul"
              ? "rounded-full bg-[#e6f4ff] px-3 py-1.5 text-sm font-medium text-[#0958d9]"
              : "rounded-full border border-border bg-background px-3 py-1.5 text-sm text-foreground/85"
          }
        >
          {item}
        </li>
      ))}
    </ul>
  );
}

/** «¿Qué hace un/a …?»: día a día, dónde trabaja, ramos y habilidades. */
export function SobreLaCarrera({
  carrera,
  perfil,
}: {
  carrera: CarreraRecord;
  perfil: PerfilCarrera;
}) {
  return (
    <section id="que-hace" aria-labelledby="que-hace-titulo" className="scroll-mt-24 space-y-6">
      <div className="max-w-3xl space-y-3">
        <p className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.14em] text-[#0958d9]">
          <Compass className="size-3.5" aria-hidden="true" /> Sobre la carrera
        </p>
        <h2 id="que-hace-titulo" className="h2-datos text-foreground">
          ¿Qué hace {sujetoCarrera(carrera)}?
        </h2>
        <p className="text-base leading-relaxed text-foreground/80 sm:text-lg">{perfil.queHace}</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.25fr_1fr] lg:items-start">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-xs sm:p-6">
          <h3 className="flex items-center gap-2 text-base font-semibold text-foreground">
            <Briefcase className="size-4 text-[#1890ff]" aria-hidden="true" /> Su día a día
          </h3>
          <ol className="mt-4 space-y-3">
            {perfil.tareas.map((tarea, i) => (
              <li key={tarea} className="flex items-start gap-3 text-[15px] leading-snug text-foreground/85">
                <span
                  aria-hidden="true"
                  className="mt-px flex size-6 shrink-0 items-center justify-center rounded-full bg-[#e6f4ff] text-xs font-bold text-[#0958d9]"
                >
                  {i + 1}
                </span>
                {tarea}
              </li>
            ))}
          </ol>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-xs sm:p-6">
            <h3 className="flex items-center gap-2 text-base font-semibold text-foreground">
              <Building2 className="size-4 text-[#1890ff]" aria-hidden="true" /> Dónde trabaja
            </h3>
            <div className="mt-3">
              <Chips items={perfil.dondeTrabaja} />
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5 shadow-xs sm:p-6">
            <h3 className="flex items-center gap-2 text-base font-semibold text-foreground">
              <BookOpen className="size-4 text-[#1890ff]" aria-hidden="true" /> Ramos que vas a ver
            </h3>
            <div className="mt-3">
              <Chips items={perfil.ramos} />
            </div>
            <h3 className="mt-5 flex items-center gap-2 text-base font-semibold text-foreground">
              <Sparkles className="size-4 text-[#1890ff]" aria-hidden="true" /> Habilidades que desarrollas
            </h3>
            <div className="mt-3">
              <Chips items={perfil.habilidades} tono="azul" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/** «¿Deberías estudiar …?»: para quién es, para quién no y las cifras clave. */
export function EsParaTi({
  carrera,
  ctx,
  perfil,
  slugComparar,
}: {
  carrera: CarreraRecord;
  ctx: ContextoComparativoFicha;
  perfil: PerfilCarrera;
  slugComparar?: string;
}) {
  const { data } = ctx;
  const cifras = [
    { label: "Sueldo al 4.º año", valor: data.ing[3] ? pesos(data.ing[3]) : null },
    { label: "Empleabilidad 1.er año", valor: data.emp1 !== null ? porcentaje(data.emp1) : null },
    { label: "Duración real", valor: data.dur_real ? anosDesdeSemestres(data.dur_real) : null },
  ].filter((c): c is { label: string; valor: string } => c.valor !== null);

  const hrefComparar = slugComparar
    ? `/datos/carreras/comparar?c=${encodeURIComponent(`${carrera.slug},${slugComparar}`)}`
    : `/datos/carreras/comparar?c=${encodeURIComponent(carrera.slug)}`;

  return (
    <section
      id="es-para-ti"
      aria-labelledby="es-para-ti-titulo"
      className="scroll-mt-24 space-y-6 rounded-3xl border border-[#bae0ff] bg-gradient-to-br from-[#e6f4ff] via-white to-white p-5 sm:p-8"
    >
      <div className="max-w-3xl space-y-2">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#0958d9]">Antes de decidir</p>
        <h2 id="es-para-ti-titulo" className="h2-datos text-foreground">
          ¿Deberías estudiar {carrera.nombre}?
        </h2>
        <p className="text-base leading-relaxed text-foreground/75">
          Revisa si te identificas con estos rasgos y míralo junto con las cifras oficiales.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-xs sm:p-6">
          <h3 className="text-base font-semibold text-foreground">Te puede gustar si…</h3>
          <ul className="mt-4 space-y-3">
            {perfil.paraQuien.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-[15px] leading-snug text-foreground/85">
                <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-[#1890ff]" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-border bg-card/70 p-5 sm:p-6">
          <h3 className="text-base font-semibold text-foreground">Quizás no es para ti</h3>
          <ul className="mt-4 space-y-3">
            {perfil.noEsParaTi.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-[15px] leading-snug text-foreground/75">
                <XCircle className="mt-0.5 size-5 shrink-0 text-slate-400" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {cifras.length > 0 ? (
        <dl className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          {cifras.map((c) => (
            <div key={c.label} className="rounded-2xl border border-border bg-card px-4 py-3">
              <dt className="text-xs font-medium text-muted-foreground">{c.label}</dt>
              <dd className="mt-1 text-xl font-bold tracking-tight text-foreground tabular-nums">{c.valor}</dd>
            </div>
          ))}
        </dl>
      ) : null}

      <div className="flex flex-col gap-2 sm:flex-row">
        <Link
          href={hrefComparar}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#1890ff] px-5 text-sm font-semibold text-white no-underline transition-colors hover:bg-[#0958d9]"
        >
          <GitCompare className="size-4" aria-hidden="true" />
          Compárala con otra carrera
        </Link>
        <Link
          href="/datos/carreras/test"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-border bg-card px-5 text-sm font-semibold text-foreground no-underline transition-colors hover:border-[#1890ff] hover:text-[#0958d9]"
        >
          <Compass className="size-4" aria-hidden="true" />
          ¿No estás seguro? Haz el test vocacional
        </Link>
      </div>
    </section>
  );
}
