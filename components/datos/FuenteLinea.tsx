import { cn } from "@/lib/utils";

export interface FuenteLineaProps {
  edicion?: string;
  fuente?: string;
  conAviso?: boolean;
  className?: string;
}

export function FuenteLinea({
  edicion = "2025–2026",
  fuente,
  conAviso = false,
  className,
}: FuenteLineaProps) {
  const textoFuente =
    fuente ??
    `Fuente: www.mifuturo.cl (Mineduc) · Edición ${edicion} · ProgramBI no está afiliado al Mineduc`;

  return (
    <footer className={cn("space-y-1.5 text-xs leading-relaxed text-[#5c5c58]", className)}>
      <p>{textoFuente}</p>
      {conAviso ? (
        <p className="text-[11px] text-[#5c5c58]">
          Cifras referenciales con datos oficiales. No son una oferta de sueldo ni una garantía de
          empleo. Antes de postular, revisa la información en mifuturo.cl y en la institución.
        </p>
      ) : null}
    </footer>
  );
}
