import { ImageResponse } from "next/og";
import { loadLogoDataUrl } from "@/lib/og/assets";
import { getMetaCarreras, TIPO_ETIQUETAS } from "./carreras";
import { pesos, porcentaje } from "./formato";
import { filasPreset, PRESETS_MAP, type PresetSlug } from "./presets";

export async function renderPresetOgImage(slug: PresetSlug) {
  const logoSrc = await loadLogoDataUrl();
  const meta = getMetaCarreras();
  const def = PRESETS_MAP[slug];
  const filas = filasPreset(slug, slug === "mejor-pagadas" ? "u" : undefined).slice(0, 3);

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#f7f7f4",
          color: "#171716",
          padding: "52px 64px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logoSrc} alt="ProgramBI" width={180} height={46} style={{ objectFit: "contain" }} />
          <div
            style={{
              display: "flex",
              fontSize: 18,
              fontWeight: 700,
              padding: "8px 18px",
              borderRadius: 999,
              background: "#e9f4ff",
              color: "#1890ff",
            }}
          >
            {`Edición ${meta.edicion} · ${def.tituloCorto}`}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ fontSize: 48, fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.1 }}>
            {def.h1}
          </div>
          <div style={{ display: "flex", gap: 16, marginTop: 8 }}>
            {filas.map((f, idx) => (
              <div
                key={`${f.slug}-${f.tipo}`}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  background: "#ffffff",
                  border: "1px solid #e2e2dc",
                  borderRadius: 16,
                  padding: "16px 20px",
                  flex: 1,
                }}
              >
                <span style={{ fontSize: 15, color: "#5c5c58" }}>
                  {`#${idx + 1} · ${TIPO_ETIQUETAS[f.tipo].corto}`}
                </span>
                <span style={{ fontSize: 22, fontWeight: 700, color: "#171716", marginTop: 4 }}>
                  {f.nombre}
                </span>
                <span style={{ fontSize: 28, fontWeight: 800, color: "#1890ff", marginTop: 6 }}>
                  {f.textoMetrica}
                </span>
                <span style={{ fontSize: 15, color: "#5c5c58", marginTop: 4 }}>
                  {`4.º año: ${pesos(f.ing4)} · Emp: ${porcentaje(f.emp1)}`}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 18, color: "#5c5c58" }}>
          <span>Fuente: www.mifuturo.cl (Mineduc)</span>
          <span>{`programbi.com/datos/carreras/${slug}`}</span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
