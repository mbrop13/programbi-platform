import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";
import {
  getCarrera,
  getMetaCarreras,
  TIPO_ETIQUETAS,
  tipoPrincipalDeCarrera,
  type CarreraRecord,
  type CarreraTipoData,
  type TipoIesKey,
} from "@/lib/datos/carreras";
import { pesos, porcentaje, semestres } from "@/lib/datos/formato";
import { loadLogoDataUrl } from "@/lib/og/assets";

export const runtime = "nodejs";

type FormatoKey = "1080x1350" | "1080x1920" | "1200x630";

const FORMATOS: Record<FormatoKey, { width: number; height: number }> = {
  "1080x1350": { width: 1080, height: 1350 },
  "1080x1920": { width: 1080, height: 1920 },
  "1200x630": { width: 1200, height: 630 },
};

function parseFormato(raw: string | null): FormatoKey {
  if (raw === "1080x1920" || raw === "1200x630" || raw === "1080x1350") return raw;
  return "1080x1350";
}

function parseTipo(raw: string | null): TipoIesKey | undefined {
  if (raw === "u" || raw === "ip" || raw === "cft") return raw;
  return undefined;
}

function resolverTipo(
  carrera: CarreraRecord,
  preferido?: TipoIesKey
): { key: TipoIesKey; data: CarreraTipoData } | null {
  if (preferido && carrera.tipos[preferido]) {
    return { key: preferido, data: carrera.tipos[preferido]! };
  }
  return tipoPrincipalDeCarrera(carrera);
}

function notFoundResponse() {
  return new Response("Not Found", {
    status: 404,
    headers: { "Cache-Control": "public, s-maxage=86400" },
  });
}

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ a: string; b: string }> }
) {
  const { a, b } = await context.params;
  const { searchParams } = req.nextUrl;
  const formato = parseFormato(searchParams.get("formato"));
  const dims = FORMATOS[formato];
  const ta = parseTipo(searchParams.get("ta"));
  const tb = parseTipo(searchParams.get("tb"));

  const meta = getMetaCarreras();
  const logoSrc = await loadLogoDataUrl();

  // Modo Top 3 del test: /datos/carreras/compartir/test/slug1,slug2,slug3
  if (a === "test") {
    const rawSlugs = decodeURIComponent(b)
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, 3);

    if (rawSlugs.length === 0) return notFoundResponse();

    const items: { carrera: CarreraRecord; key: TipoIesKey; data: CarreraTipoData }[] = [];
    for (const slug of rawSlugs) {
      const c = getCarrera(slug);
      if (!c) return notFoundResponse();
      const t = resolverTipo(c);
      if (!t) return notFoundResponse();
      items.push({ carrera: c, key: t.key, data: t.data });
    }

    const maxIng = Math.max(...items.map((x) => x.data.ing[3] ?? 0), 1);
    const isWide = formato === "1200x630";

    const image = new ImageResponse(
      (
        <div
          style={{
            width: dims.width,
            height: dims.height,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            background: "#f7f7f4",
            color: "#171716",
            padding: isWide ? "40px 56px" : "60px 64px",
            fontFamily: "sans-serif",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={logoSrc} alt="ProgramBI" width={isWide ? 160 : 190} height={48} style={{ objectFit: "contain" }} />
            <div
              style={{
                display: "flex",
                fontSize: isWide ? 16 : 20,
                fontWeight: 700,
                padding: "8px 18px",
                borderRadius: 999,
                background: "#e9f4ff",
                color: "#1890ff",
              }}
            >
              Top {items.length} según tus prioridades · {meta.edicion}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: isWide ? 16 : 24 }}>
            <div
              style={{
                display: "flex",
                fontSize: isWide ? 36 : 48,
                fontWeight: 800,
                letterSpacing: "-0.03em",
                lineHeight: 1.1,
              }}
            >
              Tus {items.length} carreras destacadas con datos oficiales
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: isWide ? 12 : 20 }}>
              {items.map((item, idx) => {
                const ing4 = item.data.ing[3] ?? null;
                const emp1 = item.data.emp1 ?? null;
                const barPct = ing4 ? Math.max(12, Math.round((ing4 / maxIng) * 100)) : 12;
                const color = idx === 0 ? "#1890ff" : idx === 1 ? "#f99c00" : "#171716";

                return (
                  <div
                    key={item.carrera.slug}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      background: "#ffffff",
                      border: "1px solid #e2e2dc",
                      borderRadius: 18,
                      padding: isWide ? "16px 22px" : "24px 30px",
                      gap: isWide ? 8 : 14,
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: isWide ? 32 : 40,
                            height: isWide ? 32 : 40,
                            borderRadius: 999,
                            background: color,
                            color: "#ffffff",
                            fontSize: isWide ? 16 : 20,
                            fontWeight: 800,
                          }}
                        >
                          {idx + 1}
                        </div>
                        <div style={{ display: "flex", flexDirection: "column" }}>
                          <span style={{ fontSize: isWide ? 22 : 28, fontWeight: 800, color: "#171716" }}>
                            {item.carrera.nombre}
                          </span>
                          <span style={{ fontSize: isWide ? 14 : 18, color: "#5c5c58" }}>
                            {TIPO_ETIQUETAS[item.key].singular} · {item.carrera.area}
                          </span>
                        </div>
                      </div>

                      <div style={{ display: "flex", alignItems: "baseline", gap: 18 }}>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                          <span style={{ fontSize: isWide ? 12 : 14, color: "#5c5c58" }}>Ingreso 4.º año</span>
                          <span style={{ fontSize: isWide ? 24 : 32, fontWeight: 800, color }}>{pesos(ing4)}</span>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                          <span style={{ fontSize: isWide ? 12 : 14, color: "#5c5c58" }}>Empleo 1.er año</span>
                          <span style={{ fontSize: isWide ? 20 : 26, fontWeight: 700, color: "#171716" }}>
                            {porcentaje(emp1)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        width: "100%",
                        height: isWide ? 10 : 14,
                        borderRadius: 999,
                        background: "#f0f0ec",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          width: `${barPct}%`,
                          height: "100%",
                          borderRadius: 999,
                          background: color,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderTop: "1px solid #e2e2dc",
              paddingTop: 20,
              fontSize: isWide ? 16 : 20,
              color: "#5c5c58",
            }}
          >
            <span>Fuente: mifuturo.cl (Mineduc) · programbi.com/datos/carreras</span>
            <span style={{ fontWeight: 700, color: "#171716" }}>Sin orientación vocacional</span>
          </div>
        </div>
      ),
      {
        ...dims,
        headers: {
          "Cache-Control": "public, s-maxage=31536000, immutable",
        },
      }
    );
    return image;
  }

  // Modo comparación A vs B
  const carreraA = getCarrera(a);
  const carreraB = getCarrera(b);
  if (!carreraA || !carreraB) return notFoundResponse();

  const tipoA = resolverTipo(carreraA, ta);
  const tipoB = resolverTipo(carreraB, tb);
  if (!tipoA || !tipoB) return notFoundResponse();

  const ing4A = tipoA.data.ing[3] ?? null;
  const ing4B = tipoB.data.ing[3] ?? null;
  const emp1A = tipoA.data.emp1 ?? null;
  const emp1B = tipoB.data.emp1 ?? null;
  const durA = tipoA.data.dur_real ?? tipoA.data.dur_formal ?? null;
  const durB = tipoB.data.dur_real ?? tipoB.data.dur_formal ?? null;

  const maxIng = Math.max(ing4A ?? 0, ing4B ?? 0, 1);
  const pctBarA = ing4A ? Math.max(12, Math.round((ing4A / maxIng) * 100)) : 12;
  const pctBarB = ing4B ? Math.max(12, Math.round((ing4B / maxIng) * 100)) : 12;
  const isWide = formato === "1200x630";
  const isTall = formato === "1080x1920";

  return new ImageResponse(
    (
      <div
        style={{
          width: dims.width,
          height: dims.height,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#f7f7f4",
          color: "#171716",
          padding: isWide ? "40px 56px" : isTall ? "80px 64px" : "60px 64px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logoSrc} alt="ProgramBI" width={isWide ? 160 : 200} height={50} style={{ objectFit: "contain" }} />
          <div
            style={{
              display: "flex",
              fontSize: isWide ? 16 : 20,
              fontWeight: 700,
              padding: "8px 18px",
              borderRadius: 999,
              background: "#e9f4ff",
              color: "#1890ff",
            }}
          >
            Comparador oficial · {meta.edicion}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: isWide ? 18 : 28 }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            <span style={{ fontSize: isWide ? 16 : 20, fontWeight: 700, color: "#5c5c58", textTransform: "uppercase" }}>
              Ingreso bruto 4.º año y empleabilidad 1.er año
            </span>
            <div
              style={{
                display: "flex",
                fontSize: isWide ? 36 : 48,
                fontWeight: 800,
                letterSpacing: "-0.03em",
                lineHeight: 1.1,
              }}
            >
              {carreraA.nombre} vs {carreraB.nombre}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: isWide ? "row" : "column",
              gap: isWide ? 24 : 24,
            }}
          >
            {[
              {
                carrera: carreraA,
                tipo: tipoA,
                ing4: ing4A,
                emp1: emp1A,
                dur: durA,
                barPct: pctBarA,
                color: "#1890ff",
              },
              {
                carrera: carreraB,
                tipo: tipoB,
                ing4: ing4B,
                emp1: emp1B,
                dur: durB,
                barPct: pctBarB,
                color: "#f99c00",
              },
            ].map((item, idx) => (
              <div
                key={`${item.carrera.slug}-${idx}`}
                style={{
                  display: "flex",
                  ...(isWide ? { flex: 1 } : { width: "100%" }),
                  flexDirection: "column",
                  background: "#ffffff",
                  border: "1px solid #e2e2dc",
                  borderTop: `6px solid ${item.color}`,
                  borderRadius: 20,
                  padding: isWide ? "22px 26px" : "34px 38px",
                  gap: isWide ? 14 : 20,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    <span style={{ fontSize: isWide ? 24 : 32, fontWeight: 800, color: "#171716", lineHeight: 1.15 }}>
                      {item.carrera.nombre}
                    </span>
                    <span style={{ fontSize: isWide ? 15 : 20, color: "#5c5c58" }}>
                      {TIPO_ETIQUETAS[item.tipo.key].singular} ({TIPO_ETIQUETAS[item.tipo.key].corto})
                    </span>
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 16 }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    <span style={{ fontSize: isWide ? 13 : 17, color: "#5c5c58" }}>Ingreso 4.º año</span>
                    <span style={{ fontSize: isWide ? 36 : 54, fontWeight: 800, color: item.color, letterSpacing: "-0.03em", lineHeight: 1.05 }}>
                      {pesos(item.ing4)}
                    </span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
                    <span style={{ fontSize: isWide ? 13 : 17, color: "#5c5c58" }}>Empleo 1.er año</span>
                    <span style={{ fontSize: isWide ? 26 : 36, fontWeight: 800, color: "#171716", lineHeight: 1.05 }}>
                      {porcentaje(item.emp1)}
                    </span>
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    width: "100%",
                    height: isWide ? 12 : 16,
                    borderRadius: 999,
                    background: "#f0f0ec",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      width: `${item.barPct}%`,
                      height: "100%",
                      borderRadius: 999,
                      background: item.color,
                    }}
                  />
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", fontSize: isWide ? 14 : 18, color: "#5c5c58" }}>
                  <span>Duración real: {semestres(item.dur)}</span>
                  <span>Ingreso 1.er año: {pesos(item.tipo.data.ing[0] ?? null)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid #e2e2dc",
            paddingTop: 20,
            fontSize: isWide ? 16 : 20,
            color: "#5c5c58",
          }}
        >
          <span>Fuente: mifuturo.cl (Mineduc) · programbi.com/datos/carreras</span>
          <span>Pesos de {meta.pesos_de}</span>
        </div>
      </div>
    ),
    {
      ...dims,
      headers: {
        "Cache-Control": "public, s-maxage=31536000, immutable",
      },
    }
  );
}
