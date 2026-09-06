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
  name: string;
  code: string;
  panelUrl: string;
  trackUrl: string;
};

export function WelcomeReferrerEmail({ name, code, panelUrl, trackUrl }: Props) {
  return (
    <Html lang="es">
      <Head />
      <Preview>Bienvenido al programa de referidos ProgramBI</Preview>
      <Body style={body}>
        <Container style={box}>
          <Text style={kicker}>ProgramBI · Referidos</Text>
          <Heading style={h1}>Tu cuenta está lista</Heading>
          <Text style={p}>Hola {name},</Text>
          <Text style={p}>
            Presentas un Controller / área con dolor Excel. Nosotros vendemos y entregamos el Pack
            Adopción. Tú cobras 15% al cobro del primer Pack atribuido.
          </Text>
          <Text style={p}>
            Código opcional (cookie 90 días en /empresas): <strong>{code}</strong>
          </Text>
          <Text style={{ ...p, fontSize: 13 }}>
            El código sugiere atribución. Una intro calificada la confirma el equipo.
          </Text>
          <Section style={{ marginTop: 24 }}>
            <Button href={panelUrl} style={btn}>
              Abrir panel
            </Button>
          </Section>
          <Text style={{ ...p, fontSize: 12, marginTop: 16 }}>
            Link de tracking: {trackUrl}
          </Text>
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
