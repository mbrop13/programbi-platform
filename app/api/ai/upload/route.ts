import { createClient } from "@/lib/supabase/server";
import { isRateLimited } from "@/lib/security/rate-limiter";
import { uploadAttachment } from "@/lib/ai/attachments";

export const maxDuration = 30;

function json(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return json({ error: "No autorizado" }, 401);
  }

  const rl = isRateLimited(user.id, "ai-upload", 10, 60_000);
  if (rl.limited) {
    return json({ error: "Demasiadas subidas. Espera un momento." }, 429);
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return json({ error: "Se esperaba un formulario con un archivo." }, 400);
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return json({ error: "No se encontró ningún archivo." }, 400);
  }

  const result = await uploadAttachment(supabase, user.id, file);

  if (result.error && !result.url) {
    return json({ error: result.error }, 400);
  }

  return json(result, 200);
}
