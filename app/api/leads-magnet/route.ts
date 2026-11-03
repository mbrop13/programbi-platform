import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/server";
import { isRateLimited } from "@/lib/security/rate-limiter";
import { esIsoPais } from "@/config/paises";
import {
  RECURSO_PLANTILLA_VENTAS,
  esRecursoLeadMagnet,
} from "@/lib/leads-magnet";

const leadMagnetSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(254),
  pais: z.string().trim().toLowerCase().max(8).optional().nullable(),
  recurso: z
    .string()
    .trim()
    .toLowerCase()
    .max(60)
    .regex(/^[a-z0-9][a-z0-9-]{1,59}$/)
    .optional(),
  _website: z.string().max(200).optional().nullable(),
  _t: z.any().optional(),
});

function fakeSuccess() {
  return NextResponse.json({ success: true });
}

function isTimingBot(t: unknown): boolean {
  if (typeof t !== "number" || !Number.isFinite(t)) return false;
  const elapsed = t > 1e11 ? Date.now() - t : t;
  return elapsed >= 0 && elapsed < 1500;
}

export async function POST(req: NextRequest) {
  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      req.headers.get("x-real-ip")?.trim() ||
      "127.0.0.1";

    const limitRes = isRateLimited(ip, "leads-magnet", 5, 60 * 1000);
    if (limitRes.limited) {
      return NextResponse.json(
        { error: "Demasiados intentos. Espera un minuto y vuelve a intentar." },
        { status: 429 }
      );
    }

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
    }

    const validation = leadMagnetSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ error: "Datos de entrada inválidos" }, { status: 400 });
    }

    const data = validation.data;

    if (data._website || isTimingBot(data._t)) {
      return fakeSuccess();
    }

    const pais = data.pais || "cl";
    if (!esIsoPais(pais)) {
      return NextResponse.json({ error: "País inválido" }, { status: 400 });
    }

    const recurso = data.recurso || RECURSO_PLANTILLA_VENTAS;
    if (!esRecursoLeadMagnet(recurso)) {
      return NextResponse.json({ error: "Recurso inválido" }, { status: 400 });
    }

    // La tabla no acepta INSERT anónimo: solo el backend (service_role) escribe.
    // Así el rate limit y el antibot no se pueden saltar llamando a Supabase.
    const supabase = createAdminClient();
    const { error } = await supabase.from("leads_magnet").insert({
      email: data.email,
      pais,
      recurso,
    });

    if (error) {
      // Duplicado email + recurso: el lead ya estaba guardado, así que la
      // descarga puede continuar. Cualquier otro error no debe simular éxito.
      if (error.code === "23505") return fakeSuccess();
      console.error("Error inserting leads_magnet:", error.code, error.message);
      return NextResponse.json(
        { error: "No se pudo registrar el email. Intenta de nuevo." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("API Error in leads-magnet:", err);
    return NextResponse.json(
      { error: "Ocurrió un error inesperado." },
      { status: 500 }
    );
  }
}
