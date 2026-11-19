import { ImageResponse } from "next/og";
import {
  getCarrera,
  getCarreras,
  getMetaCarreras,
  TIPO_ETIQUETAS,
  tipoPrincipalDeCarrera,
} from "@/lib/datos/carreras";
import { pesos, porcentaje, semestres } from "@/lib/datos/formato";
import { loadLogoDataUrl } from "@/lib/og/assets";

export const dynamic = "force-static";
export const alt = "Sueldo y empleabilidad de carrera en Chile | ProgramBI";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return getCarreras().map((c) => ({ slug: c.slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const carrera = getCarrera(slug);
  const meta = getMetaCarreras();
  const logoSrc = await loadLogoDataUrl();
  const principal = carrera ? tipoPrincipalDeCarrera(carrera) : null;

  const nombre = carrera?.nombre ?? "Carrera en Chile";
  const area = carrera?.area ?? "Datos de Chile";
  const tipoLabel = principal ? TIPO_ETIQUETAS[principal.key].plural : "Educación Superior";
  const ing4 = principal?.data.ing[3] ?? null;
  const emp1 = principal?.data.emp1 ?? null;
  const durReal = principal?.data.dur_real ?? null;

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
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={logoSrc}
            alt="ProgramBI"
            width={180}
            height={46}
            style={{ objectFit: "contain" }}
          />
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
            {tipoLabel} · Edición {meta.edicion}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ fontSize: 22, fontWeight: 600, color: "#5c5c58" }}>
            {area}
          </div>
          <div
            style={{
              fontSize: nombre.length > 38 ? 44 : 54,
              fontWeight: 800,
              letterSpacing: "-0.03em",
              lineHeight: 1.08,
            }}
          >
            {nombre}
          </div>

          <div style={{ display: "flex", gap: 22, marginTop: 14 }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                background: "#ffffff",
                border: "1px solid #e2e2dc",
                borderTop: "4px solid #1890ff",
                borderRadius: 16,
                padding: "20px 28px",
                minWidth: 320,
              }}
            >
              <span style={{ fontSize: 16, color: "#5c5c58" }}>
                Ingreso bruto 4.º año
              </span>
              <span
                style={{
                  fontSize: 42,
                  fontWeight: 800,
                  color: "#1890ff",
                  marginTop: 6,
                }}
              >
                {pesos(ing4)}
              </span>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                background: "#ffffff",
                border: "1px solid #e2e2dc",
                borderRadius: 16,
                padding: "20px 28px",
                minWidth: 260,
              }}
            >
              <span style={{ fontSize: 16, color: "#5c5c58" }}>
                Empleabilidad 1.er año
              </span>
              <span
                style={{
                  fontSize: 42,
                  fontWeight: 800,
                  color: "#171716",
                  marginTop: 6,
                }}
              >
                {porcentaje(emp1)}
              </span>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                background: "#ffffff",
                border: "1px solid #e2e2dc",
                borderRadius: 16,
                padding: "20px 28px",
                minWidth: 240,
              }}
            >
              <span style={{ fontSize: 16, color: "#5c5c58" }}>
                Duración real
              </span>
              <span
                style={{
                  fontSize: 38,
                  fontWeight: 800,
                  color: "#171716",
                  marginTop: 8,
                }}
              >
                {semestres(durReal)}
              </span>
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 18,
            color: "#5c5c58",
          }}
        >
          <span>Fuente: mifuturo.cl (Mineduc) · Pesos sep-2025</span>
          <span>programbi.com/datos/carreras</span>
        </div>
      </div>
    ),
    size
  );
}
