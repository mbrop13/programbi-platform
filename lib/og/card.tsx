import { OG_SIZE } from "@/lib/og/assets";

export const OG_WIDTH = OG_SIZE.width;
export const OG_HEIGHT = OG_SIZE.height;

type OgCardProps = {
  logoSrc: string;
  kicker?: string;
  title: string;
  description?: string;
  tags?: string[];
  theme?: "paper" | "ink";
  accent?: string;
  path?: string;
  verified?: boolean;
};

export function OgCard({
  logoSrc,
  kicker,
  title,
  description,
  tags = [],
  theme = "paper",
  accent,
  path,
  verified,
}: OgCardProps) {
  const paper = theme !== "ink";
  const bg = paper ? "#F6F4EF" : "#171716";
  const ink = paper ? "#171716" : "#F6F4EF";
  const mute = paper ? "#6B675F" : "#B7B3AA";

  return (
    <div
      style={{
        width: OG_SIZE.width,
        height: OG_SIZE.height,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: bg,
        color: ink,
        padding: "56px 64px",
        fontFamily: "Georgia, 'Times New Roman', serif",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoSrc} alt="ProgramBI" width={180} height={48} style={{ objectFit: "contain" }} />
        {kicker ? (
          <div
            style={{
              fontFamily: "sans-serif",
              fontSize: 18,
              fontWeight: 600,
              color: mute,
              letterSpacing: "0.04em",
            }}
          >
            {kicker}
          </div>
        ) : null}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 18, maxWidth: 980 }}>
        <div style={{ fontSize: 58, lineHeight: 1.12, fontWeight: 700, letterSpacing: "-0.03em" }}>
          {title}
        </div>
        {description ? (
          <div style={{ fontFamily: "sans-serif", fontSize: 26, lineHeight: 1.35, color: mute }}>
            {description}
          </div>
        ) : null}
      </div>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
        {verified ? (
          <div
            style={{
              fontFamily: "sans-serif",
              fontSize: 16,
              fontWeight: 700,
              padding: "8px 16px",
              borderRadius: 999,
              background: accent || "#0f7a4d",
              color: "#F6F4EF",
            }}
          >
            Verificado
          </div>
        ) : null}
        {tags.map((tag) => (
          <div
            key={tag}
            style={{
              fontFamily: "sans-serif",
              fontSize: 18,
              fontWeight: 600,
              padding: "8px 16px",
              borderRadius: 999,
              border: `1px solid ${paper ? "#D9D4C8" : "#3A3936"}`,
              color: ink,
            }}
          >
            {tag}
          </div>
        ))}
        {path ? (
          <div
            style={{
              fontFamily: "sans-serif",
              fontSize: 16,
              color: mute,
              marginLeft: "auto",
            }}
          >
            /{path.replace(/^\//, "")}
          </div>
        ) : null}
      </div>
    </div>
  );
}
