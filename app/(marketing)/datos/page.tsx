import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowUpRight,
  BarChart3,
  Calculator,
  Compass,
  GitCompare,
  GraduationCap,
  Percent,
  Sparkles,
  Target,
} from "lucide-react";
import { getMetaCarreras, getRankingCarreras, TIPO_ETIQUETAS } from "@/lib/datos/carreras";
import { entero, fechaCorta, pesos, porcentaje } from "@/lib/datos/formato";
import { getUltimoIpc } from "@/lib/datos/ipc";
import { breadcrumbsSchema, metadataSimpleDatos } from "@/lib/datos/seo-carreras";
import { resumenHubCarreras } from "@/lib/datos/textos-carreras";

export const dynamic = "force-static";

export function generateMetadata(): Metadata {
  return metadataSimpleDatos({
    path: "/datos",
    title: "Datos de Chile: carreras, sueldos e IPC oficial",
    description:
      "Observatorio de datos oficiales de Chile: ranking de sueldos y empleabilidad de carreras (mifuturo.cl), comparador, calculadoras de retorno e IPC.",
  });
}

export default function DatosHubPage() {
  const meta = getMetaCarreras();
  const ranking = getRankingCarreras();
  const ultimoIpc = getUltimoIpc();
  const topMed = ranking.find((r) => r.slug === "medicina" && r.tipo === "u");
  const resumen = resumenHubCarreras();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      breadcrumbsSchema([
        { label: "Inicio", path: "/" },
        { label: "Datos de Chile", path: "/datos" },
      ]),
    ],
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />

      <nav aria-label="Ruta de navegación" className="mb-6 text-sm text-[#5c5c58]">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link href="/" className="hover:text-[#171716] hover:underline">
              Inicio
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="font-medium text-[#171716]">
            Datos de Chile
          </li>
        </ol>
      </nav>

      <header className="mb-8 max-w-3xl">
        <p className="inline-flex items-center gap-2 rounded-full border border-[#e2e2dc] bg-white px-3 py-1 text-xs font-semibold tracking-wide text-[#1890ff] uppercase">
          <BarChart3 className="size-3.5" aria-hidden="true" />
          Datos de Chile · ProgramBI
        </p>
        <h1 className="h1-datos mt-3 text-[#171716]">
          Datos oficiales de Chile, explicados en simple
        </h1>
        <p className="mt-3 text-base text-[#5c5c58] sm:text-lg">
          Cifras abiertas del Mineduc y del INE convertidas en herramientas claras para tomar
          decisiones reales sin mitos ni cifras inventadas.
        </p>
      </header>

      <section
        aria-labelledby="hub-carreras-titulo"
        className="mb-8 grid gap-6 rounded-xl border border-[#d6e6f5] bg-white p-6 shadow-xs lg:grid-cols-[1.2fr_0.8fr] lg:p-8"
      >
        <div className="flex flex-col justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-[#5c5c58]">
              <span className="rounded-md bg-[#e9f4ff] px-2.5 py-0.5 text-[#1890ff]">
                Edición {meta.edicion}
              </span>
              <span>Actualizado {fechaCorta(meta.fetched_at)}</span>
            </div>
            <h2 id="hub-carreras-titulo" className="h2-datos mt-3 text-[#171716]">
              Ranking de Carreras: sueldos, empleabilidad y aranceles
            </h2>
            {topMed ? (
              <div className="mt-4">
                <p className="kpi-hero text-[#171716]">{pesos(topMed.ing4)}</p>
                <p className="mt-2 text-sm text-[#5c5c58]">
                  Ingreso bruto mensual promedio al 4.º año de {topMed.nombre} (
                  {TIPO_ETIQUETAS[topMed.tipo].plural}), empleabilidad al 1.er año de{" "}
                  {porcentaje(topMed.emp1)}, en pesos de septiembre de 2025.
                </p>
              </div>
            ) : null}
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href="/datos/carreras"
              className="inline-flex items-center gap-2 rounded-lg bg-[#1890ff] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#1074d4]"
            >
              Explorar las {meta.conteos.genericas_unicas} carreras
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </Link>
            <Link
              href="/datos/carreras/comparar"
              className="inline-flex items-center gap-2 rounded-lg border border-[#e2e2dc] bg-[#f7f7f4] px-4 py-3 text-sm font-semibold text-[#171716] transition-colors hover:bg-[#eeeee8]"
            >
              Comparar carreras
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 self-center">
          <div className="rounded-xl border border-[#e2e2dc] bg-[#f7f7f4] p-4">
            <p className="text-xs font-medium text-[#5c5c58]">Carreras genéricas</p>
            <p className="mt-1 text-2xl font-bold text-[#171716]">
              {meta.conteos.genericas_unicas}
            </p>
            <p className="mt-1 text-xs text-[#5c5c58]">U, IP y CFT</p>
          </div>
          <div className="rounded-xl border border-[#e2e2dc] bg-[#f7f7f4] p-4">
            <p className="text-xs font-medium text-[#5c5c58]">Programas 2026</p>
            <p className="mt-1 text-2xl font-bold text-[#171716]">
              {entero(meta.conteos.filas_C)}
            </p>
            <p className="mt-1 text-xs text-[#5c5c58]">16 regiones de Chile</p>
          </div>
          <div className="rounded-xl border border-[#e2e2dc] bg-[#f7f7f4] p-4">
            <p className="text-xs font-medium text-[#5c5c58]">Carreras × IES</p>
            <p className="mt-1 text-2xl font-bold text-[#171716]">
              {entero(meta.conteos.filas_B)}
            </p>
            <p className="mt-1 text-xs text-[#5c5c58]">Tramos y acreditación</p>
          </div>
          <div className="rounded-xl border border-[#e2e2dc] bg-[#f7f7f4] p-4">
            <p className="text-xs font-medium text-[#5c5c58]">Último IPC</p>
            <p className="mt-1 text-2xl font-bold text-[#171716]">
              {ultimoIpc.v.toFixed(2).replace(".", ",")}
            </p>
            <p className="mt-1 text-xs text-[#5c5c58]">Base 2023=100 ({ultimoIpc.m})</p>
          </div>
        </div>
      </section>

      <section aria-label="Herramientas disponibles" className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          {
            href: "/datos/carreras/comparar",
            icon: GitCompare,
            titulo: "Comparador de carreras",
            desc: "Compara hasta 3 carreras lado a lado y genera una tarjeta para compartir.",
          },
          {
            href: "/datos/carreras/test",
            icon: Compass,
            titulo: "Test «¿Qué carrera me conviene?»",
            desc: "Responde 5 preguntas y ordena carreras según sueldo, empleo y presupuesto.",
          },
          {
            href: "/datos/carreras/retorno",
            icon: Calculator,
            titulo: "Calculadora de retorno",
            desc: "Estima el costo total de estudiar y cuántos meses de ingreso bruto equivale.",
          },
          {
            href: "/datos/carreras/puntaje-ponderado",
            icon: Target,
            titulo: "Calculadora PAES ponderada",
            desc: "Aplica las ponderaciones oficiales 2025–2026 de cada programa.",
          },
          {
            href: "/datos/carreras/tecnologia-y-datos",
            icon: GraduationCap,
            titulo: "Carreras de tecnología y datos",
            desc: "Ranking de informática, conectividad y estadística más habilidades clave.",
          },
          {
            href: "/datos/inflacion",
            icon: Percent,
            titulo: "Calculadora de IPC (pesos de hoy)",
            desc: "Actualiza montos desde pesos de septiembre de 2025 al último IPC.",
          },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="group flex flex-col justify-between rounded-xl border border-[#e2e2dc] bg-white p-5 transition-colors hover:border-[#1890ff]"
            >
              <div>
                <div className="mb-3 inline-flex size-9 items-center justify-center rounded-lg bg-[#e9f4ff] text-[#1890ff]">
                  <Icon className="size-4" aria-hidden="true" />
                </div>
                <h3 className="text-base font-bold text-[#171716] group-hover:text-[#1890ff]">
                  {item.titulo}
                </h3>
                <p className="mt-1.5 text-sm text-[#5c5c58]">{item.desc}</p>
              </div>
              <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-[#1890ff]">
                Abrir herramienta <ArrowUpRight className="size-3.5" aria-hidden="true" />
              </span>
            </Link>
          );
        })}
      </section>

      <section
        aria-labelledby="hub-resumen-titulo"
        className="prose-datos rounded-xl border border-[#e2e2dc] border-t-4 border-t-[#1890ff] bg-white p-6"
      >
        <h2 id="hub-resumen-titulo" className="flex items-center gap-2 text-lg font-bold text-[#171716]">
          <Sparkles className="size-4 text-[#1890ff]" aria-hidden="true" />
          En resumen
        </h2>
        <div className="mt-3 space-y-2.5 text-sm text-[#3c3c39]">
          {resumen.map((frase) => (
            <p key={frase}>{frase}</p>
          ))}
        </div>
        <p className="mt-4 text-xs text-[#5c5c58]">
          Fuente: Elaboración propia a partir de bases oficiales publicadas en www.mifuturo.cl
          (Mineduc) e INE vía Banco Central de Chile. ProgramBI no está afiliado al Mineduc.
        </p>
      </section>
    </div>
  );
}
