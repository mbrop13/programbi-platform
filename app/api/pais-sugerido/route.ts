import { NextResponse } from "next/server";
import { esIsoPais } from "@/config/paises";

export const dynamic = "force-dynamic";

/** Lee el país que Vercel pone en el request. No usa geolocalización en el cliente. */
export async function GET(req: Request) {
  const code = (req.headers.get("x-vercel-ip-country") || "").toLowerCase();
  return NextResponse.json({ iso: esIsoPais(code) ? code : null });
}
