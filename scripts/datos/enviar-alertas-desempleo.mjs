import { createClient } from "@supabase/supabase-js";
import nodemailer from "nodemailer";
import { z } from "zod";

const sitio = "https://www.programbi.com";
const ruta = "/datos/desempleo";
const tabla = "datos_alertas_desempleo";
const ediciones = "datos_alertas_ediciones";
const envios = "datos_alertas_envios";
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseSecret = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
const smtpUser = process.env.SES_SMTP_USER;
const smtpPass = process.env.SES_SMTP_PASS;

function exigir(resultado, tarea) {
  if (resultado.error) throw new Error(`Falló el acceso a datos al ${tarea}.`);
  return resultado.data;
}

async function jsonPublico(path) {
  const respuesta = await fetch(`${sitio}${ruta}/${path}`, {
    cache: "no-store",
    redirect: "error",
    signal: AbortSignal.timeout(15_000),
  });
  if (!respuesta.ok) throw new Error("No se pudo comprobar la edición publicada.");
  return respuesta.json();
}

async function leerEdicion() {
  const meta = z.object({
    version: z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/),
    ultimo_periodo: z.object({
      codigo: z.string(),
      label: z.string().min(5).max(35).regex(/^[a-z0-9 –-]+$/i),
    }),
    ine_fecha_actualizacion: z.string().regex(/^\d{2}-\d{2}-\d{4}$/),
  }).parse(await jsonPublico("meta.json"));
  const serie = z.array(z.object({
    p: z.string(),
    tasa: z.number().min(0).max(40),
  })).min(13).parse(await jsonPublico(`nacional.json?v=${meta.version}`));
  const cierre = serie.at(-1);
  if (meta.version !== meta.ultimo_periodo.codigo || cierre.p !== meta.version) {
    throw new Error("Los archivos públicos muestran ediciones diferentes.");
  }
  return { periodo: cierre.p, nombre: meta.ultimo_periodo.label, tasa: cierre.tasa, fecha: meta.ine_fecha_actualizacion };
}

async function notificar(db, mailer, suscripcion, edicion) {
  const reserva = await db.from(envios).insert({ periodo: edicion.periodo, suscripcion_id: suscripcion.id });
  if (reserva.error?.code === "23505") {
    const anterior = exigir(await db.from(envios).select("enviado_en")
      .eq("periodo", edicion.periodo).eq("suscripcion_id", suscripcion.id).maybeSingle(), "leer el envío");
    return anterior?.enviado_en ? "preexistente" : "pendiente";
  }
  exigir(reserva, "reservar el envío");

  const activa = exigir(await db.from(tabla).select("baja_token").eq("id", suscripcion.id)
    .not("activo_desde", "is", null).maybeSingle(), "comprobar la suscripción");
  if (!activa) {
    exigir(await db.from(envios).delete().eq("periodo", edicion.periodo).eq("suscripcion_id", suscripcion.id), "liberar una baja");
    return "baja";
  }

  const baja = `${sitio}${ruta}/alertas/gestionar#baja=${activa.baja_token}`;
  const tasa = edicion.tasa.toLocaleString("es-CL", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  const texto = [
    `La tasa de desocupación en Chile fue de ${tasa} % en ${edicion.nombre}.`,
    `Fuente: INE, Encuesta Nacional de Empleo, actualizada el ${edicion.fecha}.`,
    `Revisa el mapa y las series completas en ${sitio}${ruta}.`,
    `Gestiona o cancela tu suscripción: ${baja}`,
  ].join("\n\n");

  try {
    await mailer.sendMail({
      from: { name: process.env.SES_FROM_NAME || "ProgramBI", address: process.env.SES_FROM_EMAIL || "noreply@programbi.com" },
      to: suscripcion.email,
      subject: `Desempleo en Chile · ${edicion.nombre}`,
      text: texto,
      list: { unsubscribe: baja },
    });
  } catch (error) {
    // Un rechazo SMTP explícito puede reintentarse. Ante un timeout se conserva
    // la reserva porque el servidor de correo pudo haber aceptado la entrega.
    if (error?.responseCode >= 400 && error.responseCode < 600) {
      exigir(await db.from(envios).delete().eq("periodo", edicion.periodo).eq("suscripcion_id", suscripcion.id), "liberar el envío rechazado");
    }
    return "pendiente";
  }

  exigir(await db.from(envios).update({ enviado_en: new Date().toISOString() })
    .eq("periodo", edicion.periodo).eq("suscripcion_id", suscripcion.id), "marcar el envío");
  return "enviado";
}

async function main() {
  if (!supabaseUrl || !supabaseSecret || !smtpUser || !smtpPass) {
    console.log("Sin configuración de Supabase y SES para despachar alertas.");
    return;
  }
  const edicion = await leerEdicion();
  const db = createClient(supabaseUrl, supabaseSecret, { auth: { persistSession: false } });
  const ultima = exigir(await db.from(ediciones).select("*")
    .order("periodo", { ascending: false }).limit(1).maybeSingle(), "leer la última edición");
  if (ultima && edicion.periodo < ultima.periodo) throw new Error("La edición publicada retrocedió.");
  if (!ultima) {
    exigir(await db.from(ediciones).upsert({
      periodo: edicion.periodo,
      finalizado_en: new Date().toISOString(),
    }, { ignoreDuplicates: true }), "registrar la edición inicial");
    console.log(`Edición inicial registrada: ${edicion.periodo}.`);
    return;
  }
  if (ultima.periodo === edicion.periodo && ultima.finalizado_en) {
    console.log(`Sin edición nueva: ${edicion.periodo}.`);
    return;
  }
  if (ultima.periodo !== edicion.periodo) {
    exigir(await db.from(ediciones).upsert({ periodo: edicion.periodo }, { ignoreDuplicates: true }), "registrar la edición");
  }
  const corte = exigir(await db.from(ediciones).select("detectado_en")
    .eq("periodo", edicion.periodo).single(), "obtener la fecha de edición").detectado_en;

  const port = Number(process.env.SES_SMTP_PORT || 465);
  const mailer = nodemailer.createTransport({
    host: process.env.SES_SMTP_HOST || "email-smtp.us-east-1.amazonaws.com",
    port,
    secure: port === 465,
    requireTLS: port !== 465,
    auth: { user: smtpUser, pass: smtpPass },
    connectionTimeout: 15_000,
    socketTimeout: 30_000,
    pool: true,
    maxConnections: 1,
  });

  let despues;
  let enviados = 0;
  let pendientes = 0;
  try {
    for (;;) {
      let consulta = db.from(tabla).select("id,email")
        .not("activo_desde", "is", null).lte("activo_desde", corte)
        .order("id").limit(500);
      if (despues) consulta = consulta.gt("id", despues);
      const registros = exigir(await consulta, "leer las suscripciones");
      if (!registros.length) break;
      for (const suscripcion of registros) {
        const estado = await notificar(db, mailer, suscripcion, edicion);
        if (estado === "enviado") enviados += 1;
        if (estado === "pendiente") pendientes += 1;
      }
      despues = registros.at(-1).id;
    }
  } finally {
    mailer.close();
  }

  console.log(`Edición ${edicion.periodo}: ${enviados} avisos enviados, ${pendientes} pendientes.`);
  if (pendientes) throw new Error("Revisar los envíos pendientes antes de cerrar la edición.");
  exigir(await db.from(ediciones).update({ finalizado_en: new Date().toISOString() })
    .eq("periodo", edicion.periodo), "cerrar la edición");
}

main().catch((error) => {
  console.error(error instanceof Error && !("issues" in error) ? error.message : "La edición publicada no cumple el esquema.");
  process.exitCode = 1;
});
