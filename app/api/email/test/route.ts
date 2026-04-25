import { NextRequest, NextResponse } from "next/server";
import {
  sendQuoteConfirmationToLead,
  sendNewLeadNotificationToAdmin,
  sendEnterpriseQuoteToLead,
  sendNotifyMeConfirmation,
  sendPaymentConfirmation,
  sendMembershipWelcome,
} from "@/lib/email/mailersend";

export const dynamic = "force-dynamic";

/**
 * GET /api/email/test?type=quote&email=tu@email.com
 * Solo para desarrollo. Testea los distintos tipos de email.
 */
export async function GET(req: NextRequest) {
  // Temporarily allow in production for debugging
  // if (process.env.NODE_ENV === "production") {
  //   return NextResponse.json({ error: "Not available in production" }, { status: 403 });
  // }

  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") || "quote";
  const email = searchParams.get("email");

  if (!email) {
    return NextResponse.json({ error: "Parámetro ?email= requerido" }, { status: 400 });
  }

  try {
    switch (type) {
      case "quote":
        await sendQuoteConfirmationToLead({
          name: "Ignacio Martínez",
          email,
          courses: ["Análisis de Datos (SQL + Power BI + Python)", "Machine Learning"],
          message: "Me interesa el horario vespertino.",
        });
        break;

      case "admin":
        await sendNewLeadNotificationToAdmin({
          name: "Ignacio Martínez",
          email: "ignacio@empresa.com",
          phone: "+56912345678",
          courses: ["Análisis de Datos", "Power BI"],
          message: "Quiero el horario vespertino.",
          leadType: "individual",
        });
        break;

      case "enterprise":
        await sendEnterpriseQuoteToLead({
          name: "María González",
          email,
          company: "Minera Los Pelambres",
          courses: ["Power BI", "SQL Server", "Python"],
          employeeCount: "30",
        });
        break;

      case "notify":
        await sendNotifyMeConfirmation({
          name: "Carlos Pérez",
          email,
          courseName: "Machine Learning con Python",
          levelName: "Avanzado",
        });
        break;

      case "payment":
        await sendPaymentConfirmation({
          name: "Ana Torres",
          email,
          courses: [
            { title: "Análisis de Datos", levelName: "Básico", price: 498000 },
            { title: "Power BI", levelName: "Intermedio", price: 249000 },
          ],
          orderId: "PROG-2026-00142",
          totalPaid: 747000,
          paymentMethod: "Flow (Tarjeta de crédito)",
        });
        break;

      case "membership":
        await sendMembershipWelcome({
          name: "Roberto Silva",
          email,
          planName: "Pro",
          price: 14900,
        });
        break;

      default:
        return NextResponse.json({
          error: "Tipo no válido",
          disponibles: ["quote", "admin", "enterprise", "notify", "payment", "membership"],
        }, { status: 400 });
    }

    return NextResponse.json({ success: true, type, sentTo: email });
  } catch (err: any) {
    console.error("Email test error:", err);
    return NextResponse.json({ error: err?.message || "Error desconocido", details: String(err) }, { status: 500 });
  }
}
