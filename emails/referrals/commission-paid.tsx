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
  prospectCompany: string;
  amountLabel: string;
  paymentRef: string;
  panelUrl: string;
};

export function CommissionPaidEmail({
  referrerName,
  prospectCompany,
  amountLabel,
  paymentRef,
  panelUrl,
}: Props) {
  return (
    <Html lang="es">
      <Head />
      <Preview>
        Comisión pagada: {amountLabel} · {prospectCompany}
      </Preview>
      <Body style={body}>
        <Container style={box}>
          <Text style={kicker}>ProgramBI · Referidos</Text>
          <Heading style={h1}>Comisión pagada</Heading>
          <Text style={p}>Hola {referrerName},</Text>
          <Text style={{ ...p, fontSize: 28, color: "#0f7a4d", fontWeight: 700, letterSpacing: "-0.04em" }}>
            {amountLabel}
          </Text>
          <Text style={p}>
            Transferimos tu 15% por la venta de {prospectCompany}. Referencia: {paymentRef}.
            Clawback 60 días si hay nota de crédito.
          </Text>
          <Section style={{ marginTop: 24 }}>
            <Button href={panelUrl} style={btn}>
              Ver comisiones
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
