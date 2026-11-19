import type { Observacion } from "@/lib/datos/desempleo";
import { periodo, tasa } from "@/lib/datos/desempleo-formato";

export function SocialDatos({ titulo, actual, serie, logo, chile }: {
  titulo: string; actual: Pick<Observacion, "p" | "tasa">; serie: readonly Pick<Observacion, "p" | "tasa">[];
  logo: string; chile?: number;
}) {
  const ultimos = serie.slice(-12);
  const maximo = Math.max(...ultimos.map((item) => item.tasa), 1);

  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%", height: "100%", padding: 60,
      backgroundColor: "#eaf4fc", color: "#142c43", borderTop: "14px solid #1264a7" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 26, color: "#265475" }}>
        <span>ENCUESTA NACIONAL DE EMPLEO</span>
        {/* ImageResponse se renderiza fuera del navegador con un logo local. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logo} width={190} height={49} alt="ProgramBI" />
      </div>
      <div style={{ display: "flex", alignItems: "center", minHeight: 112, fontSize: titulo.length > 26 ? 62 : 76, fontWeight: 700, lineHeight: 1.05 }}>
        {titulo}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: 16 }}>
        <div style={{ display: "flex", flexDirection: "column", flexShrink: 0 }}>
          <span style={{ fontSize: 122, lineHeight: 1.05, color: "#1264a7", fontWeight: 700 }}>{tasa(actual.tasa)}</span>
          <span style={{ fontSize: 33, marginTop: 12 }}>{periodo(actual.p)}</span>
        </div>
        {chile === undefined ? (
          <div style={{ display: "flex", alignItems: "flex-end", gap: 8, padding: "0 0 16px 20px", height: 190 }}>
            {ultimos.map((item, index) => <span key={item.p} style={{ display: "flex", width: 19, height: Math.max(16, item.tasa / maximo * 155), backgroundColor: index === ultimos.length - 1 ? "#1469ad" : "#96bad4", borderRadius: "5px 5px 0 0" }} />)}
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", paddingBottom: 12, width: 370 }}>
            <span style={{ fontSize: 28 }}>Chile · {tasa(chile)}</span>
            <div style={{ display: "flex", backgroundColor: "#aac9e0", borderRadius: 4, height: 17, width: chile / Math.max(chile, actual.tasa, 1) * 340 }} />
            <span style={{ marginTop: 12, fontSize: 28 }}>Región · {tasa(actual.tasa)}</span>
            <div style={{ display: "flex", backgroundColor: "#1264a7", borderRadius: 4, height: 17, width: actual.tasa / Math.max(chile, actual.tasa, 1) * 340 }} />
          </div>
        )}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 23, marginTop: "auto", borderTop: "1px solid #afcadf", paddingTop: 22 }}>
        <span>Fuente: INE, Encuesta Nacional de Empleo</span>
        <span>programbi.com/datos</span>
      </div>
    </div>
  );
}
