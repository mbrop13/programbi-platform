import { NextRequest, NextResponse } from "next/server";
import { sendNewMemberNotification } from "@/lib/email/mailersend";
import { z } from "zod";
import { isRateLimited } from "@/lib/security/rate-limiter";

const memberSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email(),
  phone: z.string().max(30).optional().nullable(),
});

export async function POST(req: NextRequest) {
  try {
    // ─── Rate Limiting ───
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "127.0.0.1";
    const limitRes = isRateLimited(ip, "auth-new-member", 5, 60 * 1000); // Max 5 requests per minute
    if (limitRes.limited) {
      return NextResponse.json({ error: "Demasiados intentos. Por favor intente más tarde." }, { status: 429 });
    }

    const body = await req.json();

    // ─── Input Validation ───
    const validation = memberSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ error: "Datos de entrada inválidos" }, { status: 400 });
    }

    const { name, email, phone } = validation.data;

    await sendNewMemberNotification({ name, email, phone: phone ?? undefined });
    console.log("✅ New member notification sent for:", name, email);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("❌ New member notification error:", err?.message, err?.stack);
    // Don't fail the registration — just log the error and return generic error message
    return NextResponse.json({ success: false, error: "No se pudo enviar la notificación de bienvenida" }, { status: 200 });
  }
}
