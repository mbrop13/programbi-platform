"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Boxes,
  CheckCircle2,
  Database,
  FileSpreadsheet,
  FileText,
  Inbox,
  Mail,
  Search,
  Send,
  Workflow,
} from "lucide-react";

/* ─────────────────────────────────────────────────────────────
   Maquetas de sistemas a la medida.
   Ventanas ilustrativas (etiquetadas "demo") que muestran el tipo
   de software que ProgramBI diseña y desarrolla por encargo.
   ───────────────────────────────────────────────────────────── */

const reveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] as const },
};

function Window({
  title,
  icon: Icon,
  children,
  className = "",
}: {
  title: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-all duration-300 group-hover:border-slate-300 group-hover:shadow-[0_12px_36px_rgba(15,23,42,0.08)] ${className}`}
    >
      {/* Barra de título */}
      <div className="flex h-8 shrink-0 items-center gap-2 border-b border-slate-100 bg-slate-50/70 px-3">
        <span className="flex gap-1">
          <span className="h-2 w-2 rounded-full bg-slate-300" />
          <span className="h-2 w-2 rounded-full bg-slate-300" />
          <span className="h-2 w-2 rounded-full bg-slate-300" />
        </span>
        <span className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-500">
          <Icon size={11} />
          {title}
        </span>
        <span className="ml-auto rounded bg-slate-200/70 px-1.5 py-px text-[8px] font-bold uppercase tracking-wider text-slate-400">
          demo
        </span>
      </div>
      <div className="min-h-0 flex-1">{children}</div>
    </div>
  );
}

/* 1. Dashboard ejecutivo */
function MockDashboard() {
  const bars = [42, 55, 48, 66, 58, 74, 62, 81, 70, 92, 84, 100];
  return (
    <Window title="Panel ejecutivo · Gestión comercial" icon={BarChart3}>
      <div className="flex h-full">
        {/* Sidebar */}
        <div className="hidden w-24 shrink-0 flex-col gap-0.5 border-r border-slate-100 bg-slate-50/50 p-2 sm:flex">
          {["Resumen", "Ventas", "Operación", "Inventario", "Reportes"].map((item, i) => (
            <span
              key={item}
              className={`rounded px-2 py-1.5 text-[9px] font-semibold ${
                i === 0 ? "bg-slate-900 text-white" : "text-slate-400"
              }`}
            >
              {item}
            </span>
          ))}
        </div>
        {/* Contenido */}
        <div className="flex-1 p-3">
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "Ventas", value: "$84,2M", delta: "+12%" },
              { label: "Órdenes", value: "1.284", delta: "+8%" },
              { label: "Margen", value: "31,4%", delta: "+2,1pp" },
            ].map((kpi) => (
              <div key={kpi.label} className="rounded-lg border border-slate-100 bg-slate-50/60 p-2">
                <p className="text-[8px] font-semibold uppercase tracking-wide text-slate-400">{kpi.label}</p>
                <p className="mt-0.5 text-[13px] font-bold text-slate-900">{kpi.value}</p>
                <p className="text-[8px] font-bold text-emerald-600">{kpi.delta}</p>
              </div>
            ))}
          </div>
          {/* Gráfico de barras */}
          <div className="mt-2.5 rounded-lg border border-slate-100 p-2.5">
            <div className="flex items-center justify-between">
              <p className="text-[9px] font-bold text-slate-600">Ventas mensuales 2026</p>
              <div className="flex items-center gap-2 text-[8px] text-slate-400">
                <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-sm bg-slate-800" />2026</span>
                <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-sm bg-slate-300" />2025</span>
              </div>
            </div>
            <div className="mt-2 flex h-20 items-end gap-1.5">
              {bars.map((h, i) => (
                <div key={i} className="flex w-full flex-col justify-end gap-px" style={{ height: "100%" }}>
                  <div className="w-full rounded-t-sm bg-slate-800" style={{ height: `${h}%` }} />
                  <div className="w-full rounded-b-sm bg-slate-300" style={{ height: `${h * 0.62}%` }} />
                </div>
              ))}
            </div>
          </div>
          {/* Top productos */}
          <div className="mt-2.5 space-y-1.5">
            {[
              { name: "Línea industrial", pct: 86 },
              { name: "Servicios", pct: 54 },
            ].map((p) => (
              <div key={p.name} className="flex items-center gap-2">
                <span className="w-20 shrink-0 truncate text-[9px] text-slate-500">{p.name}</span>
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-blue-600" style={{ width: `${p.pct}%` }} />
                </div>
                <span className="text-[9px] font-bold text-slate-600">{p.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Window>
  );
}

/* 2. Automatización de procesos */
function MockAutomatizacion() {
  const steps = [
    { icon: Database, title: "Se detectan datos nuevos", sub: "SQL Server · tabla ventas" },
    { icon: Workflow, title: "Procesa y valida", sub: "Python · reglas de calidad" },
    { icon: FileText, title: "Genera reporte PDF", sub: "Consolidado + gráficos" },
    { icon: Mail, title: "Se envía a gerencia", sub: "Lunes 8:00 · 6 destinatarios" },
  ];
  return (
    <Window title="Flujo · Reporte semanal automático" icon={Workflow}>
      <div className="flex h-full flex-col justify-between p-3.5">
        <div className="space-y-0">
          {steps.map((s, i) => (
            <div key={s.title}>
              <div className="flex items-center gap-2.5 rounded-lg border border-slate-100 bg-slate-50/60 px-2.5 py-2">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-slate-900 text-white">
                  <s.icon size={11} />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-[10px] font-bold text-slate-800">{s.title}</p>
                  <p className="truncate text-[8.5px] text-slate-400">{s.sub}</p>
                </div>
                <span className="ml-auto flex items-center gap-1 text-[8px] font-bold text-emerald-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  OK
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className="ml-[26px] h-2.5 w-px bg-slate-200" />
              )}
            </div>
          ))}
        </div>
        <div className="mt-2 flex items-center justify-between rounded-lg bg-slate-900 px-3 py-2">
          <p className="text-[9px] font-semibold text-white/80">Última ejecución: lunes 08:00 · 4,2 s</p>
          <p className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[8px] font-bold text-emerald-300">Flujo activo</p>
        </div>
      </div>
    </Window>
  );
}

/* 3. Inventario y bodega */
function MockInventario() {
  const rows = [
    { p: "Válvula 220V", s: "142", st: "ok" },
    { p: "Correa transportadora", s: "8", st: "bajo" },
    { p: "Sensor PT-100", s: "0", st: "critico" },
    { p: "Rodamiento SKF-6204", s: "310", st: "ok" },
    { p: "Filtro industrial", s: "23", st: "bajo" },
  ];
  return (
    <Window title="Bodega · Control de stock" icon={Boxes}>
      <div className="flex h-full flex-col p-3">
        <div className="flex items-center gap-2">
          <div className="flex h-6 flex-1 items-center gap-1.5 rounded-md border border-slate-200 px-2">
            <Search size={9} className="text-slate-300" />
            <span className="text-[9px] text-slate-300">Buscar producto…</span>
          </div>
          <span className="rounded-md bg-slate-900 px-2 py-1 text-[8px] font-bold text-white">Filtros</span>
        </div>
        <div className="mt-2.5 flex-1">
          <div className="grid grid-cols-[1fr_38px_52px] gap-x-2 border-b border-slate-100 pb-1 text-[8px] font-bold uppercase tracking-wide text-slate-400">
            <span>Producto</span>
            <span className="text-right">Stock</span>
            <span className="text-right">Estado</span>
          </div>
          {rows.map((r) => (
            <div key={r.p} className="grid grid-cols-[1fr_38px_52px] items-center gap-x-2 border-b border-slate-50 py-[7px]">
              <span className="truncate text-[9.5px] font-medium text-slate-700">{r.p}</span>
              <span className="text-right font-mono text-[9.5px] font-bold text-slate-800">{r.s}</span>
              <span className="flex justify-end">
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[7.5px] font-bold ${
                    r.st === "ok"
                      ? "bg-emerald-50 text-emerald-600"
                      : r.st === "bajo"
                        ? "bg-amber-50 text-amber-600"
                        : "bg-red-50 text-red-600"
                  }`}
                >
                  {r.st === "ok" ? "OK" : r.st === "bajo" ? "BAJO" : "CRÍTICO"}
                </span>
              </span>
            </div>
          ))}
        </div>
        <div className="mt-1.5 flex items-center justify-between text-[8.5px] text-slate-400">
          <span>1.284 SKU activos</span>
          <span className="font-bold text-slate-600">3 requieren reposición</span>
        </div>
      </div>
    </Window>
  );
}

/* 4. CRM / seguimiento comercial */
function MockCrm() {
  const cols = [
    {
      label: "Nuevos",
      cards: [{ n: "Minera Los Andes", v: "$12,4M" }, { n: "Agrícola Sur", v: "$3,8M" }],
    },
    {
      label: "Propuesta",
      cards: [{ n: "Constructora VA", v: "$8,1M" }],
    },
    {
      label: "Cerrado",
      cards: [{ n: "Alimentos del Pacífico", v: "$21,0M" }],
    },
  ];
  return (
    <Window title="CRM · Pipeline comercial" icon={Inbox}>
      <div className="grid h-full grid-cols-3 gap-2 p-3">
        {cols.map((c) => (
          <div key={c.label} className="flex flex-col">
            <div className="flex items-center justify-between pb-1.5">
              <p className="text-[8px] font-bold uppercase tracking-wide text-slate-400">{c.label}</p>
              <span className="rounded-full bg-slate-100 px-1.5 text-[8px] font-bold text-slate-500">{c.cards.length}</span>
            </div>
            <div className="space-y-1.5">
              {c.cards.map((card) => (
                <div key={card.n} className="rounded-lg border border-slate-100 bg-slate-50/60 p-2">
                  <p className="truncate text-[9px] font-bold text-slate-700">{card.n}</p>
                  <p className="mt-0.5 font-mono text-[9px] font-bold text-slate-900">{card.v}</p>
                  {c.label === "Cerrado" && (
                    <p className="mt-1 inline-flex items-center gap-0.5 text-[7.5px] font-bold text-emerald-600">
                      <CheckCircle2 size={8} /> Ganado
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Window>
  );
}

/* 5. Aprobación de órdenes de compra */
function MockOc() {
  const orders = [
    { n: "OC-2481 · Insumos mantención", v: "$1.840.000", step: "Finanzas" },
    { n: "OC-2482 · Servicios TI", v: "$960.000", step: "Gerencia" },
    { n: "OC-2483 · Fletes norte", v: "$2.310.000", step: "Finanzas" },
  ];
  return (
    <Window title="Compras · Aprobación de OC" icon={FileSpreadsheet}>
      <div className="flex h-full flex-col p-3">
        {/* Steps */}
        <div className="flex items-center gap-1">
          {["Solicitado", "Jefe área", "Finanzas", "OC emitida"].map((s, i) => (
            <div key={s} className="flex flex-1 items-center gap-1">
              <div
                className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[7px] font-bold ${
                  i < 2 ? "bg-emerald-500 text-white" : i === 2 ? "bg-amber-400 text-white" : "border border-slate-200 bg-white text-slate-300"
                }`}
              >
                {i < 2 ? "✓" : i + 1}
              </div>
              <span className={`hidden truncate text-[8px] font-semibold sm:block ${i <= 2 ? "text-slate-600" : "text-slate-300"}`}>
                {s}
              </span>
              {i < 3 && <div className={`h-px flex-1 ${i < 2 ? "bg-emerald-400" : "bg-slate-200"}`} />}
            </div>
          ))}
        </div>
        {/* Órdenes */}
        <div className="mt-3 flex-1 space-y-1.5">
          {orders.map((o) => (
            <div key={o.n} className="flex items-center gap-2 rounded-lg border border-slate-100 px-2.5 py-2">
              <div className="min-w-0 flex-1">
                <p className="truncate text-[9.5px] font-bold text-slate-700">{o.n}</p>
                <p className="text-[8.5px] text-slate-400">Esperando: {o.step}</p>
              </div>
              <span className="font-mono text-[9.5px] font-bold text-slate-900">{o.v}</span>
              <span className="rounded-md bg-slate-900 px-2 py-1 text-[8px] font-bold text-white">Aprobar</span>
            </div>
          ))}
        </div>
        <p className="mt-1.5 flex items-center gap-1 text-[8.5px] text-slate-400">
          <Send size={8} />
          Aprobación se notifica por email y queda en la bitácora
        </p>
      </div>
    </Window>
  );
}

/* ─────────────────────────────────────────────────────────────
   Sección
   ───────────────────────────────────────────────────────────── */

const CARD_CLASS = "group flex flex-col gap-3";

function CardText({ title, text }: { title: string; text: string }) {
  return (
    <div>
      <h3 className="text-[15px] font-bold tracking-tight text-slate-900">{title}</h3>
      <p className="mt-1 text-sm leading-relaxed text-slate-500">{text}</p>
    </div>
  );
}

export default function SistemasSection() {
  return (
    <section id="sistemas" className="py-16 lg:py-24">
      <div className="max-w-6xl mx-auto px-5 lg:px-8">
        <motion.div {...reveal}>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-3">
            Desarrollo a medida
          </p>
          <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-[2.75rem] text-slate-900 tracking-tight leading-[1.15] max-w-3xl">
            Sistemas de gestión y automatización,{" "}
            <span className="font-serif italic font-normal">hechos a tu medida</span>
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-500">
            No solo capacitamos equipos: diseñamos y desarrollamos el sistema que tu
            operación necesita. Dashboards de gestión, control de bodega, automatización
            de reportes, aprobaciones y flujos internos — integrados con tus planillas,
            bases de datos y procesos actuales.
          </p>
        </motion.div>

        {/* Bento de maquetas */}
        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-12">
          <motion.div {...reveal} className="lg:col-span-7">
            <div className={`${CARD_CLASS} h-full`}>
              <div className="h-[300px]">
                <MockDashboard />
              </div>
              <CardText
                title="Paneles de gestión ejecutivos"
                text="KPIs de tu operación en tiempo real: ventas, margen, operaciones y cumplimiento de metas."
              />
            </div>
          </motion.div>

          <motion.div {...reveal} transition={{ ...reveal.transition, delay: 0.08 }} className="lg:col-span-5">
            <div className={`${CARD_CLASS} h-full`}>
              <div className="h-[300px]">
                <MockAutomatizacion />
              </div>
              <CardText
                title="Automatización de procesos"
                text="Flujos que corren solos: reportes semanales, validación de datos, correos y alertas."
              />
            </div>
          </motion.div>

          <motion.div {...reveal} className="lg:col-span-4">
            <div className={`${CARD_CLASS} h-full`}>
              <div className="h-[240px]">
                <MockInventario />
              </div>
              <CardText
                title="Inventario y bodega"
                text="Stock en línea, alertas de reposición y trazabilidad por producto y sucursal."
              />
            </div>
          </motion.div>

          <motion.div {...reveal} transition={{ ...reveal.transition, delay: 0.08 }} className="lg:col-span-4">
            <div className={`${CARD_CLASS} h-full`}>
              <div className="h-[240px]">
                <MockCrm />
              </div>
              <CardText
                title="CRM y seguimiento comercial"
                text="Pipeline de oportunidades, estados por etapa y cierre al día, sin planillas paralelas."
              />
            </div>
          </motion.div>

          <motion.div {...reveal} transition={{ ...reveal.transition, delay: 0.16 }} className="lg:col-span-4">
            <div className={`${CARD_CLASS} h-full`}>
              <div className="h-[240px]">
                <MockOc />
              </div>
              <CardText
                title="Aprobaciones y flujos internos"
                text="Órdenes de compra, permisos y solicitudes con bitácora, notificaciones y reglas."
              />
            </div>
          </motion.div>
        </div>

        {/* Más ideas + CTA */}
        <motion.div {...reveal} className="mt-10 rounded-2xl border border-slate-200 bg-slate-50/60 px-6 py-6 lg:px-10 lg:py-8">
          <div className="flex flex-col items-start justify-between gap-5 lg:flex-row lg:items-center">
            <div className="max-w-xl">
              <p className="text-sm font-bold text-slate-900">
                ¿Y lo que no está en la lista? Se construye.
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-500">
                Control de asistencia, mantenciones, cotizaciones, portales de proveedores,
                integración con Power BI, ERP o planillas — cada sistema parte de cero
                según tu operación.
              </p>
            </div>
            <Link
              href="/empresas#contacto"
              className="inline-flex h-11 shrink-0 items-center gap-2 rounded-full bg-slate-900 px-6 text-sm font-bold text-white transition-transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Conversar mi sistema
              <ArrowRight size={15} strokeWidth={2.4} />
            </Link>
          </div>
          <p className="mt-5 text-[11px] text-slate-400">
            Maquetas ilustrativas: cada sistema se diseña a partir de tus procesos y datos reales.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
