import { NextRequest, NextResponse } from "next/server";
import { getPublishedJobs } from "@/lib/jobs/queries";
import { isRateLimited } from "@/lib/security/rate-limiter";

export async function GET(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "127.0.0.1";
    const limitRes = isRateLimited(ip, "jobs-list", 60, 60 * 1000);
    if (limitRes.limited) {
      return NextResponse.json({ error: "Demasiadas consultas. Intenta más tarde." }, { status: 429 });
    }

    const sp = req.nextUrl.searchParams;
    const parseList = (key: string) =>
      (sp.get(key) ?? "").split(",").map((s) => s.trim()).filter(Boolean).slice(0, 10);

    const result = await getPublishedJobs({
      q: sp.get("q")?.slice(0, 120) || undefined,
      skills: parseList("skills"),
      modality: parseList("modality"),
      seniority: parseList("seniority"),
      employment_type: parseList("employment_type"),
      company_id: sp.get("company_id") || undefined,
      sort: sp.get("sort") === "salary" ? "salary" : "recent",
      page: Number(sp.get("page")) || 1,
      perPage: Number(sp.get("perPage")) || 12,
    });

    return NextResponse.json(result);
  } catch (err: any) {
    console.error("API Error in jobs list:", err);
    return NextResponse.json({ error: "Error al cargar las vacantes." }, { status: 500 });
  }
}
