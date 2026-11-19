"use server";

import { createHash, randomBytes } from "node:crypto";
import { headers } from "next/headers";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/server";
import { isRateLimited } from "@/lib/security/rate-limiter";
import { sendDatosConfirmation } from "@/lib/email/mailersend";
import { SITE_URL } from "@/lib/seo";
import { RUTA_GESTION_ALERTAS, type EstadoAlerta } from "./alertas-config";

const tabla = "datos_alertas_desempleo";
const errorTemporal: EstadoAlerta = {
  estado: "error",
  mensaje: "No pudimos completar la solicitud. Intenta nuevamente en unos minutos.",
};
const correoEnviado: EstadoAlerta = {
  estado: "enviado",
  mensaje: "Si tu correo todavía no está suscrito, recibirás un enlace para confirmar la alerta.",
};

async function limiteAlcanzado(tipo: string, cantidad: number) {
  const requestHeaders = await headers();
  const ip = requestHeaders.get("x-real-ip")
    ?? requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim()
    ?? "127.0.0.1";
  return isRateLimited(ip, tipo, cantidad, 10 * 60_000).limited;
}

function huella(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export async function solicitarAlerta(_: EstadoAlerta, datos: FormData): Promise<EstadoAlerta> {
  const email = z.string().trim().toLowerCase().email().max(254).safeParse(datos.get("email"));
  if (!email.success || datos.get("consentimiento") !== "on") {
    return { estado: "error", mensaje: "Escribe un correo válido y acepta recibir el aviso." };
  }
  if (datos.get("_website")) return correoEnviado;
  if (await limiteAlcanzado("datos-alerta-solicitar", 5)) return errorTemporal;

  const token = randomBytes(32).toString("hex");
  const hash = huella(token);
  try {
    const db = createAdminClient();
    const { data, error } = await db.rpc("datos_preparar_alerta_desempleo", {
      correo: email.data, huella: hash,
    });
    if (error) return errorTemporal;
    if (!data) return correoEnviado;

    try {
      await sendDatosConfirmation({
        email: email.data,
        confirmar: `${SITE_URL}${RUTA_GESTION_ALERTAS}#confirmar=${token}`,
      });
    } catch {
      // Revoca este token y permite reintentar si SES rechazó el correo.
      await db.from(tabla).update({
        confirmacion_hash: null, confirmacion_expira: null, confirmacion_solicitada: null,
      }).eq("confirmacion_hash", hash);
      return errorTemporal;
    }
    return correoEnviado;
  } catch {
    return errorTemporal;
  }
}

export async function gestionarAlerta(_: EstadoAlerta, datos: FormData): Promise<EstadoAlerta> {
  const operacion = datos.get("operacion");
  const token = datos.get("token");
  const invalido: EstadoAlerta = { estado: "error", mensaje: "El enlace venció o ya fue utilizado." };
  if (typeof token !== "string" || (operacion !== "confirmar" && operacion !== "baja")) return invalido;
  if (await limiteAlcanzado("datos-alerta-gestionar", 12)) return errorTemporal;

  try {
    const db = createAdminClient();
    if (operacion === "baja") {
      if (!z.string().uuid().safeParse(token).success) return invalido;
      const { error } = await db.from(tabla).delete().eq("baja_token", token);
      if (error) return errorTemporal;
      return { estado: "baja", mensaje: "La alerta está desactivada." };
    }

    if (!/^[0-9a-f]{64}$/.test(token)) return invalido;
    const ahora = new Date().toISOString();
    const { data, error } = await db.from(tabla).update({
      activo_desde: ahora, confirmacion_hash: null, confirmacion_expira: null, confirmacion_solicitada: null,
    }).eq("confirmacion_hash", huella(token)).gt("confirmacion_expira", ahora)
      .is("activo_desde", null).select("id").maybeSingle();
    if (error) return errorTemporal;
    if (!data) return invalido;
    return { estado: "confirmado", mensaje: "Recibirás un correo cuando se publique un nuevo trimestre móvil." };
  } catch {
    return errorTemporal;
  }
}
