import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

type Props = {
  referrerName: string;
  prospectName: string;
  prospectCompany: string;
  statusLabel: string;
  panelUrl: string;
};

export function StatusChangeEmail({
  referrerName,
  prospectName,
  prospectCompany,
  statusLabel,
  panelUrl,
}: Props) {
  return (
    <Html lang="es">
      <Head />
      <Preview>
        {statusLabel}: {prospectName} · {prospectCompany}
      </Preview>
      <Body style={body}>
        <Container style={box}>
          <Text style={kicker}>ProgramBI · Referidos</Text>
          <Heading style={h1}>{statusLabel}</Heading>
          <Text style={p}>Hola {referrerName},</Text>
          <Text style={p}>
            Tu intro de <strong>{prospectName}</strong> ({prospectCompany}) ahora está en{" "}
            <strong>{statusLabel}</strong>.
          </Text>
          <Section style={{ marginTop: 24 }}>
            <Button href={panelUrl} style={btn}>
              Ver detalle
            </Button>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const body = { backgroundColor: "#f3f3f0", fontFamily: "Inter, Segoe UI, Arial, sans-serif" };
const box = { backgroundColor: "#ffffff", margin: "32px auto", padding: "32px 36px", borderRadius: 16, maxWidth: 560 };
const kicker = { fontSize: 12, letterSpacing: "0.16em", textTransform: "uppercase" as const, color: "#8c8b85", fontWeight: 600 };
const h1 = { fontSize: 22, fontWeight: 700, letterSpacing: "-0.03em", color: "#171716" };
const p = { fontSize: 15, lineHeight: "1.65", color: "#5f5e59" };
const btn = { backgroundColor: "#171716", color: "#f7f7f4", padding: "12px 18px", borderRadius: 10, fontWeight: 600, fontSize: 14 };
