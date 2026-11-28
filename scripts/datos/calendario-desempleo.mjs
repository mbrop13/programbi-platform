const AGENDA_INE = "https://www.ine.gob.cl/inicio/agendaestadistica/";
const ZONA_CHILE = "America/Santiago";
const MESES = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];

export function horaPublicacionDesempleo(html, fecha) {
  const [anio, mes, dia] = fecha.split("-").map(Number);
  const anioAgenda = html.match(/Agenda Estad(?:í|&#237;|&iacute;)stica\s+(\d{4})/i);
  const mesesAgenda = [
    ...html.matchAll(/<h1\b[^>]*\bclass="tituloMesEaV2"[^>]*>\s*(\w+)\s*<\/h1>/gi),
  ];
  if (!anioAgenda || mesesAgenda.length === 0) {
    throw new Error("No se pudo leer el calendario oficial del INE");
  }
  if (Number(anioAgenda[1]) !== anio) return null;
  const indice = mesesAgenda.findIndex((mesAgenda) => mesAgenda[1].toLowerCase() === MESES[mes - 1]);
  if (indice === -1) return null;

  const seccion = html.slice(mesesAgenda[indice].index, mesesAgenda[indice + 1]?.index);
  const eventos = seccion.matchAll(/<div\b[^>]*\bclass="eventoAgendaV2"[^>]*>([\s\S]*?)<\/div>/gi);
  for (const [, evento] of eventos) {
    if (!/<span\b[^>]*\bclass="tituloea2"[^>]*>\s*Empleo Nacional\s*(?:,|<)/i.test(evento)) continue;
    const fechaEvento = evento.match(/\bclass="diaea2"[^>]*>[^\d]*?\s*(\d{1,2})\s*<\/span>/i);
    const horaEvento = evento.match(/\bclass="horaea2"[^>]*>[^\d]*?\s*((?:[01]\d|2[0-3]):[0-5]\d)\s*<\/span>/i);
    if (!fechaEvento || !horaEvento) throw new Error("Fecha u hora de Empleo Nacional ilegible en la agenda");
    if (Number(fechaEvento[1]) === dia) return horaEvento[1];
  }
  return null;
}

if (import.meta.main) {
  const respuesta = await fetch(AGENDA_INE, { signal: AbortSignal.timeout(30_000) });
  if (!respuesta.ok) throw new Error("La agenda del INE respondió HTTP " + respuesta.status);
  const partes = new Intl.DateTimeFormat("en", {
    timeZone: ZONA_CHILE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const fecha = Object.fromEntries(partes.map(({ type, value }) => [type, value]));
  const hoy = [fecha.year, fecha.month, fecha.day].join("-");
  const hora = horaPublicacionDesempleo(await respuesta.text(), hoy);
  if (hora) console.log(hora);
}
