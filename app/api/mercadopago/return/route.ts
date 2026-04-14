import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const preapproval_id = url.searchParams.get("preapproval_id");
  const status = url.searchParams.get("status");

  if (!preapproval_id) {
    return NextResponse.redirect(new URL("/comunidad/cursos?subscription=error", req.url));
  }

  // Si el preapproval_id existe y el estado no es un rechazo explícito, asumimos éxito inicial.
  // El control real de facturación se maneja asíncronamente en el webhook.
  if (status === "rejected" || status === "cancelled") {
    return NextResponse.redirect(new URL("/comunidad/cursos?subscription=rejected", req.url));
  }

  // Redirigir a éxito
  return NextResponse.redirect(new URL("/comunidad/inicio?subscription=success", req.url));
}
