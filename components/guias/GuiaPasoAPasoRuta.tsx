import {
  BarChart3,
  Calendar,
  CheckCircle2,
  Code2,
  Database,
  FileSpreadsheet,
  Layers,
  Mail,
  RefreshCw,
  Settings,
  ShieldCheck,
  Sparkles,
  Table2,
  Terminal,
  type LucideIcon,
} from "lucide-react";
import type { IconoPaso, PasoRutaVisual } from "@/lib/guias/paso-a-paso-tipos";

const ICONOS: Record<IconoPaso, LucideIcon> = {
  database: Database,
  code: Code2,
  table: Table2,
  chart: BarChart3,
  settings: Settings,
  check: CheckCircle2,
  sparkles: Sparkles,
  mail: Mail,
  calendar: Calendar,
  shield: ShieldCheck,
  file: FileSpreadsheet,
  refresh: RefreshCw,
  layers: Layers,
  terminal: Terminal,
};

export default function GuiaPasoAPasoRuta({ pasos }: { pasos: PasoRutaVisual[] }) {
  if (pasos.length === 0) return null;

  return (
    <section aria-labelledby="ruta-visual-titulo" className="mt-8">
      <h2 id="ruta-visual-titulo" className="text-lg font-bold tracking-tight text-ink">
        Ruta visual paso a paso
      </h2>
      <ol className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {pasos.map((paso) => {
          const Icon = ICONOS[paso.icono] ?? CheckCircle2;
          return (
            <li key={`${paso.numero}-${paso.anchorId}`} className="min-w-0">
              <a
                href={`#${paso.anchorId}`}
                className="group flex h-full flex-col rounded-2xl border border-line bg-paper p-4 no-underline transition-colors hover:border-ink/35 hover:bg-wash/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-ink px-2 text-xs font-bold text-canvas">
                    {paso.numero}
                  </span>
                  <Icon size={16} className="text-mute group-hover:text-ink" aria-hidden />
                </div>
                <p className="mt-3 text-sm font-bold leading-snug text-ink">{paso.titulo}</p>
                <p className="mt-1 text-xs leading-relaxed text-mute">{paso.resumen}</p>
              </a>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
