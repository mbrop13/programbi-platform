"use client";

/**
 * Generador del brochure PDF en el navegador.
 *
 * jsPDF se carga en demanda para no pesar en la ruta del brochure. El diseño
 * es editorial «Paper & Ink»: papel crema, tarjetas blancas, acento del curso
 * y Helvetica. Todo el documento se dibuja con `rect`, `text` y `line`: no se
 * usa `autoTable` (no está instalado).
 */

import type { CourseBrochureData, BrochureProfesor } from "@/lib/brochure/brochure-data";

type RGB = [number, number, number];

type FotoCargada = { dataUrl: string; format: string } | null;

const PAGE_W = 210;
const PAGE_H = 297;
const MARGEN = 16;
const ANCHO = PAGE_W - MARGEN * 2;
const PIE_Y = PAGE_H - 16;
const LIMITE = PAGE_H - 24;

const PAPEL: RGB = [247, 247, 244];
const TINTA: RGB = [23, 23, 22];
const GRIS: RGB = [95, 94, 89];
const TENUE: RGB = [106, 105, 100];
const BLANCO: RGB = [255, 255, 255];
const LINEA: RGB = [228, 228, 224];
const LAVADO: RGB = [235, 235, 230];

const HEX = /^#?([0-9a-f]{6})$/i;

function aRgb(hex: string, respaldo: RGB = [24, 144, 255]): RGB {
  const match = HEX.exec((hex || "").trim());
  if (!match) return respaldo;
  const valor = parseInt(match[1], 16);
  return [(valor >> 16) & 255, (valor >> 8) & 255, valor & 255];
}

/** Mezcla un color con blanco (0 = blanco, 1 = color puro). */
function tinte(color: RGB, fuerza: number): RGB {
  return color.map((canal) => Math.round(255 - (255 - canal) * fuerza)) as RGB;
}

/** Recorta un texto a una cantidad de líneas. */
function recortar(lineas: string[], maximo: number): string[] {
  if (lineas.length <= maximo) return lineas;
  const copia = lineas.slice(0, maximo);
  copia[maximo - 1] = `${copia[maximo - 1].replace(/[.,;:]?$/, "")}…`;
  return copia;
}

function iniciales(nombre: string): string {
  return nombre
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((parte) => parte.charAt(0).toUpperCase())
    .join("");
}

/** Descarga una foto remota como base64. Cualquier fallo devuelve null. */
async function cargarFoto(url: string | null): Promise<FotoCargada> {
  if (!url) return null;
  const control = new AbortController();
  const temporizador = setTimeout(() => control.abort(), 5000);
  try {
    const respuesta = await fetch(url, {
      mode: "cors",
      referrerPolicy: "no-referrer",
      cache: "force-cache",
      signal: control.signal,
    });
    if (!respuesta.ok) return null;
    const blob = await respuesta.blob();
    if (!blob.type.startsWith("image/")) return null;
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const lector = new FileReader();
      lector.onload = () => resolve(String(lector.result || ""));
      lector.onerror = () => reject(new Error("No se pudo leer la foto"));
      lector.readAsDataURL(blob);
    });
    if (!dataUrl.startsWith("data:image/")) return null;
    const format = blob.type.includes("png")
      ? "PNG"
      : blob.type.includes("webp")
        ? "WEBP"
        : blob.type.includes("gif")
          ? "GIF"
          : "JPEG";
    return { dataUrl, format };
  } catch {
    return null;
  } finally {
    clearTimeout(temporizador);
  }
}

/**
 * Genera y descarga el brochure del curso en A4 multipágina.
 * No lanza por fotos inaccesibles: en ese caso dibuja las iniciales.
 */
export async function generateCoursePdf(data: CourseBrochureData): Promise<void> {
  const { jsPDF } = await import("jspdf");

  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const acento = aRgb(data.accentColor);
  const acentoSuave = tinte(acento, 0.12);
  const acentoMedio = tinte(acento, 0.35);

  let y = MARGEN;

  const fondo = () => {
    doc.setFillColor(PAPEL[0], PAPEL[1], PAPEL[2]);
    doc.rect(0, 0, PAGE_W, PAGE_H, "F");
  };

  const relleno = (color: RGB) => doc.setFillColor(color[0], color[1], color[2]);
  const trazo = (color: RGB) => doc.setDrawColor(color[0], color[1], color[2]);
  const colorTexto = (color: RGB) => doc.setTextColor(color[0], color[1], color[2]);

  const nuevaPagina = () => {
    doc.addPage();
    fondo();
    y = MARGEN;
  };

  const ensureSpace = (alto: number) => {
    if (y + alto > LIMITE) nuevaPagina();
  };

  const bullets = (
    items: string[],
    ancho: number,
    tamano: number,
    color: RGB,
    punto: RGB = acento
  ) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(tamano);
    for (const item of items) {
      const lineas = doc.splitTextToSize(item, ancho - 5) as string[];
      ensureSpace(lineas.length * tamano * 0.3528 * 1.3 + 1.2);
      colorTexto(punto);
      doc.text("•", MARGEN, y);
      colorTexto(color);
      doc.text(lineas, MARGEN + 4, y);
      y += lineas.length * tamano * 0.3528 * 1.3 + 1.4;
    }
  };

  const cabecera = (kicker: string, titulo: string, subtitulo?: string) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    colorTexto(acento);
    doc.setCharSpace(0.8);
    doc.text(kicker.toUpperCase(), MARGEN, y);
    doc.setCharSpace(0);
    y += 7;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(21);
    colorTexto(TINTA);
    const lineas = doc.splitTextToSize(titulo, ANCHO) as string[];
    doc.text(lineas, MARGEN, y);
    y += lineas.length * 8.2 + 1.5;
    if (subtitulo) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      colorTexto(GRIS);
      const sub = doc.splitTextToSize(subtitulo, ANCHO) as string[];
      doc.text(sub, MARGEN, y);
      y += sub.length * 4.2;
    }
    y += 4;
    trazo(LINEA);
    doc.setLineWidth(0.35);
    doc.line(MARGEN, y, PAGE_W - MARGEN, y);
    y += 7;
  };

  const tarjeta = (x: number, alto: number, ancho = ANCHO, rellenoColor: RGB = BLANCO) => {
    relleno(rellenoColor);
    doc.roundedRect(x, y, ancho, alto, 3, 3, "F");
  };

  const pie = () => {
    const total = doc.getNumberOfPages();
    for (let pagina = 1; pagina <= total; pagina += 1) {
      doc.setPage(pagina);
      trazo(LINEA);
      doc.setLineWidth(0.3);
      doc.line(MARGEN, PIE_Y, PAGE_W - MARGEN, PIE_Y);
      relleno(acento);
      doc.rect(MARGEN, PIE_Y - 1.1, 12, 0.9, "F");
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.2);
      colorTexto(TENUE);
      doc.text("programbi.com", MARGEN, PIE_Y + 4);
      doc.text(`Página ${pagina} de ${total}`, PAGE_W - MARGEN, PIE_Y + 4, {
        align: "right",
      });
    }
  };

  // ── Portada ────────────────────────────────────────────────────────────────
  fondo();
  relleno(acento);
  doc.rect(0, 0, PAGE_W, 5.5, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(17);
  colorTexto(TINTA);
  doc.text("ProgramBI", MARGEN, 21);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  colorTexto(TENUE);
  doc.setCharSpace(0.9);
  doc.text("BROCHURE OFICIAL", PAGE_W - MARGEN, 20.5, { align: "right" });
  doc.setCharSpace(0);

  trazo(LINEA);
  doc.setLineWidth(0.4);
  doc.line(MARGEN, 27, PAGE_W - MARGEN, 27);

  y = 41;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  colorTexto(acento);
  doc.setCharSpace(0.9);
  doc.text(
    `${data.categoryLabel} · ${data.paisNombre.toUpperCase()}`,
    MARGEN,
    y
  );
  doc.setCharSpace(0);
  y += 9;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(28);
  colorTexto(TINTA);
  const tituloLineas = doc.splitTextToSize(data.title, ANCHO) as string[];
  doc.text(tituloLineas, MARGEN, y);
  y += tituloLineas.length * 11 + 4;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10.5);
  colorTexto(GRIS);
  const resumen = recortar(
    doc.splitTextToSize(data.shortDescription, ANCHO - 6) as string[],
    4
  );
  doc.text(resumen, MARGEN, y);
  y += resumen.length * 4.6 + 9;

  // Insignia de modalidad.
  const insigniaLineas = doc.splitTextToSize(data.insignia, ANCHO - 14) as string[];
  const altoInsignia = insigniaLineas.length * 4 + 8;
  relleno(acentoSuave);
  doc.roundedRect(MARGEN, y, ANCHO, altoInsignia, 2.5, 2.5, "F");
  relleno(acento);
  doc.rect(MARGEN, y, 1.6, altoInsignia, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.6);
  colorTexto(TINTA);
  doc.text(insigniaLineas, MARGEN + 6, y + 5.6);
  y += altoInsignia + 10;

  // Métricas.
  const metricas: { valor: string; etiqueta: string }[] = [
    { valor: `${data.hours}`, etiqueta: data.levelsCount > 1 ? "horas por nivel" : "horas en vivo" },
    { valor: `${data.modulesCount}`, etiqueta: "módulos" },
    { valor: `${data.levelsCount}`, etiqueta: "niveles" },
    { valor: "100%", etiqueta: "en vivo por Zoom" },
  ];
  const anchoMetrica = (ANCHO - 3 * 4) / 4;
  const inicioMetricas = y;
  metricas.forEach((metrica, indice) => {
    const x = MARGEN + indice * (anchoMetrica + 4);
    relleno(BLANCO);
    doc.roundedRect(x, inicioMetricas, anchoMetrica, 23, 2.5, 2.5, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(15);
    colorTexto(TINTA);
    doc.text(metrica.valor, x + 4, inicioMetricas + 10);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.8);
    colorTexto(GRIS);
    doc.text(metrica.etiqueta, x + 4, inicioMetricas + 16);
  });
  y = inicioMetricas + 31;

  // Descripción larga.
  const descripcion = recortar(
    doc.splitTextToSize(data.description, ANCHO) as string[],
    7
  );
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.2);
  colorTexto(GRIS);
  doc.text(descripcion, MARGEN, y);
  y += descripcion.length * 4.1 + 8;

  // Panel de país y vigencia (anclado sobre el pie para no invadirlo).
  const panelY = Math.min(y, PIE_Y - 26);
  relleno(TINTA);
  doc.roundedRect(MARGEN, panelY, ANCHO, 22, 3, 3, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  doc.text(
    `Precios en ${data.moneda} para ${data.paisNombre}`,
    MARGEN + 6,
    panelY + 8
  );
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.2);
  doc.setTextColor(200, 200, 195);
  doc.text(
    `Actualizado ${data.actualizado} · ProgramBI, academia de datos en vivo`,
    MARGEN + 6,
    panelY + 14.5
  );
  // ── Inversión ──────────────────────────────────────────────────────────────
  nuevaPagina();
  cabecera(
    "Inversión",
    "Un precio claro, en la moneda de tu país",
    `Valores vigentes para ${data.paisNombre}. El monto incluye el programa completo y el acceso al campus.`
  );

  const altoPrecio = data.precioLista ? 54 : 44;
  tarjeta(MARGEN, altoPrecio);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  colorTexto(GRIS);
  doc.text(`Precio oficial en ${data.paisNombre}`, MARGEN + 7, y + 9);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(data.precio && data.precio >= 1_000_000 ? 24 : 31);
  colorTexto(TINTA);
  doc.text(data.precioFormateado, MARGEN + 7, y + 24);

  if (data.precioLista && data.precioListaFormateado) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    colorTexto(TENUE);
    const anchoLista = doc.getTextWidth(data.precioListaFormateado);
    doc.text(data.precioListaFormateado, MARGEN + 7, y + 34);
    trazo(TENUE);
    doc.setLineWidth(0.35);
    doc.line(MARGEN + 7, y + 33, MARGEN + 7 + anchoLista, y + 33);

    relleno(acentoSuave);
    doc.roundedRect(PAGE_W - MARGEN - 42, y + 24, 35, 10, 2, 2, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.4);
    colorTexto(acento);
    doc.text(`${data.descuentoPct}% de descuento`, PAGE_W - MARGEN - 24.5, y + 30.5, {
      align: "center",
    });
  }
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.4);
  colorTexto(TENUE);
  doc.text(`Moneda: ${data.moneda} (${data.simbolo})`, MARGEN + 7, y + altoPrecio - 5);
  y += altoPrecio + 8;

  // Cuotas.
  ensureSpace(30);
  tarjeta(MARGEN, 28, ANCHO, acentoSuave);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  colorTexto(acento);
  doc.text(`${data.cuotas} cuotas sin interés`, MARGEN + 7, y + 9);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12.5);
  colorTexto(TINTA);
  doc.text(data.cuotaTexto, MARGEN + 7, y + 17);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.4);
  colorTexto(GRIS);
  doc.text(data.notaCuotas, MARGEN + 7, y + 23.5);
  y += 36;

  // Medios de pago.
  ensureSpace(20);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  colorTexto(TINTA);
  doc.text("Medios de pago disponibles", MARGEN, y);
  y += 6;
  bullets(data.mediosPago, ANCHO, 8, GRIS);
  y += 4;

  ensureSpace(18);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.6);
  colorTexto(TENUE);
  const notaPago = doc.splitTextToSize(data.notaPago, ANCHO) as string[];
  doc.text(notaPago, MARGEN, y);
  y += notaPago.length * 3.6 + 6;

  ensureSpace(26);
  tarjeta(MARGEN, 18, ANCHO, LAVADO);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  colorTexto(TINTA);
  doc.text("Inscripción en línea", MARGEN + 6, y + 7.5);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  colorTexto(GRIS);
  doc.text(`programbi.com${data.inscripcionUrl}`, MARGEN + 6, y + 13.5);
  y += 26;

  // ── Fechas y horarios ──────────────────────────────────────────────────────
  nuevaPagina();
  cabecera(
    "Calendario",
    "Próximas fechas y horarios en tu hora",
    `Las clases se dictan desde Chile. Cada horario ya está convertido a la hora local de ${data.paisNombre}.`
  );

  if (data.schedules.length === 0) {
    tarjeta(MARGEN, 24, ANCHO, acentoSuave);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    colorTexto(TINTA);
    doc.text("Cupos abiertos — consulta fecha", MARGEN + 7, y + 10);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    colorTexto(GRIS);
    doc.text(
      "La próxima cohorte se confirma por WhatsApp o al inscribirte en línea.",
      MARGEN + 7,
      y + 16.5
    );
    y += 32;
  } else {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10.5);
    colorTexto(TINTA);
    doc.text("Cohortes confirmadas", MARGEN, y);
    y += 6;
    for (const cohorte of data.schedules.slice(0, 4)) {
      ensureSpace(19);
      tarjeta(MARGEN, 17);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9.2);
      colorTexto(TINTA);
      doc.text(cohorte.fecha, MARGEN + 6, y + 6.5);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.8);
      colorTexto(GRIS);
      doc.text(
        `${cohorte.dias}${cohorte.hours ? ` · ${cohorte.hours} horas` : ""}`,
        MARGEN + 6,
        y + 12
      );
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.2);
      colorTexto(acento);
      doc.text(cohorte.horario, PAGE_W - MARGEN - 6, y + 7, { align: "right" });
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);
      colorTexto(TENUE);
      doc.text(cohorte.horaChile, PAGE_W - MARGEN - 6, y + 12.5, {
        align: "right",
      });
      y += 21;
    }
  }

  // Tabla de equivalencias.
  ensureSpace(46);
  y += 3;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10.5);
  colorTexto(TINTA);
  doc.text("La misma clase en cada mercado", MARGEN, y);
  y += 3;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.2);
  colorTexto(TENUE);
  doc.text(
    `Hora de inicio en ${data.paisNombre}: ${data.equivalencias.inicio} (${data.equivalencias.offset}) · término ${data.equivalencias.fin}`,
    MARGEN,
    y + 3
  );
  y += 9;

  const filas: { mercado: string; hora: string }[] = [
    { mercado: data.paisNombre, hora: data.equivalencias.inicio },
  ];
  for (const tramo of data.equivalencias.cadenaMercados.split(" = ")) {
    const partes = tramo.match(/^(\d{1,2}:\d{2})\s+en\s+(.+)$/);
    if (partes && partes[2] !== data.paisNombre) {
      filas.push({ mercado: partes[2], hora: partes[1] });
    }
  }

  const altoFila = 7.6;
  relleno(LAVADO);
  doc.rect(MARGEN, y, ANCHO, altoFila, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.4);
  colorTexto(GRIS);
  doc.text("MERCADO", MARGEN + 4, y + 5);
  doc.text("HORA DE INICIO", PAGE_W - MARGEN - 4, y + 5, { align: "right" });
  y += altoFila;

  filas.forEach((fila, indice) => {
    ensureSpace(altoFila + 2);
    if (indice % 2 === 0) {
      relleno(BLANCO);
      doc.rect(MARGEN, y, ANCHO, altoFila, "F");
    }
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    colorTexto(TINTA);
    doc.text(fila.mercado, MARGEN + 4, y + 5);
    doc.setFont("helvetica", "bold");
    doc.text(fila.hora, PAGE_W - MARGEN - 4, y + 5, { align: "right" });
    trazo(LINEA);
    doc.setLineWidth(0.2);
    doc.line(MARGEN, y + altoFila, PAGE_W - MARGEN, y + altoFila);
    y += altoFila;
  });
  y += 7;

  ensureSpace(12);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.4);
  colorTexto(TENUE);
  const notaHorario = doc.splitTextToSize(
    "Los horarios respetan el horario de verano de cada país y se confirman al inscribirte. Si no puedes asistir en vivo, la clase queda grabada en el campus.",
    ANCHO
  ) as string[];
  doc.text(notaHorario, MARGEN, y);
  y += notaHorario.length * 3.5 + 4;

  // ── Equipo docente ─────────────────────────────────────────────────────────
  nuevaPagina();
  cabecera(
    "Equipo docente",
    "Quién te enseña",
    "Profesionales en ejercicio que dictan lo mismo que aplican en banca, minería y retail."
  );

  const fotos = await Promise.all(
    data.profesores.map((profesor) => cargarFoto(profesor.imageUrl))
  );

  const altoProfesor = 51;
  data.profesores.forEach((profesor: BrochureProfesor, indice) => {
    ensureSpace(altoProfesor + 3);
    tarjeta(MARGEN, altoProfesor);

    const marcoX = MARGEN + 5;
    const marcoY = y + 5;
    relleno(LAVADO);
    doc.roundedRect(marcoX, marcoY, 31, 35, 2.5, 2.5, "F");

    const foto = fotos[indice];
    let dibujada = false;
    if (foto) {
      try {
        const props = doc.getImageProperties(foto.dataUrl);
        const relacion = props.width / props.height;
        let anchoFoto = 29;
        let altoFoto = anchoFoto / relacion;
        if (altoFoto > 33) {
          altoFoto = 33;
          anchoFoto = altoFoto * relacion;
        }
        doc.addImage(
          foto.dataUrl,
          foto.format,
          marcoX + (31 - anchoFoto) / 2,
          marcoY + (35 - altoFoto) / 2,
          anchoFoto,
          altoFoto
        );
        dibujada = true;
      } catch {
        dibujada = false;
      }
    }
    if (!dibujada) {
      relleno(acentoSuave);
      doc.circle(marcoX + 15.5, marcoY + 17.5, 10.5, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      colorTexto(acento);
      doc.text(iniciales(profesor.name), marcoX + 15.5, marcoY + 19.3, {
        align: "center",
      });
    }

    const textoX = MARGEN + 41;
    const anchoTexto = ANCHO - 47;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    colorTexto(TINTA);
    doc.text(profesor.name, textoX, y + 9);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.6);
    colorTexto(acento);
    doc.text(`${profesor.role} · ${profesor.title}`, textoX, y + 14);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.4);
    colorTexto(GRIS);
    const credenciales = recortar(
      doc.splitTextToSize(profesor.credentials.join(" · "), anchoTexto) as string[],
      2
    );
    doc.text(credenciales, textoX, y + 19.5);

    const carrera =
      profesor.founderCareer.length > 0
        ? profesor.founderCareer
        : profesor.founderAcademics;
    if (carrera.length > 0) {
      doc.setFontSize(7.2);
      colorTexto(TENUE);
      const trayectoria = recortar(
        doc.splitTextToSize(carrera.slice(0, 2).join(" · "), anchoTexto) as string[],
        2
      );
      doc.text(trayectoria, textoX, y + 27.5);
    }

    if (profesor.founderBio) {
      doc.setFontSize(6.9);
      colorTexto(TENUE);
      const bio = recortar(
        doc.splitTextToSize(profesor.founderBio, anchoTexto) as string[],
        3
      );
      doc.text(bio, textoX, y + 36);
    }

    y += altoProfesor + 4;
  });

  // Cintillo de empresas.
  ensureSpace(24);
  tarjeta(MARGEN, 22, ANCHO, LAVADO);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.4);
  colorTexto(GRIS);
  doc.setCharSpace(0.5);
  doc.text("EMPRESAS QUE CAPACITARON A SUS EQUIPOS CON PROGRAMBI", MARGEN + 6, y + 7);
  doc.setCharSpace(0);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.6);
  colorTexto(TINTA);
  const empresas = doc.splitTextToSize(data.empresas.join("  ·  "), ANCHO - 12) as string[];
  doc.text(empresas, MARGEN + 6, y + 14);
  y += 30;

  // ── Programa académico ─────────────────────────────────────────────────────
  nuevaPagina();
  cabecera(
    "Programa académico",
    "Todo lo que vas a dominar",
    `${data.modulesCount} módulos organizados por nivel. Cada módulo combina clase en vivo, práctica guiada y proyecto.`
  );

  // Resultados de aprendizaje en dos columnas.
  if (data.whatYouLearn.length > 0) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10.5);
    colorTexto(TINTA);
    doc.text("Resultados de aprendizaje", MARGEN, y);
    y += 6;

    const mitad = Math.ceil(data.whatYouLearn.length / 2);
    const columnas = [data.whatYouLearn.slice(0, mitad), data.whatYouLearn.slice(mitad)];
    const anchoColumna = (ANCHO - 8) / 2;
    let altoMaximo = 0;

    columnas.forEach((columna, indice) => {
      const x = MARGEN + indice * (anchoColumna + 8);
      let yColumna = y;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      for (const item of columna) {
        const lineas = doc.splitTextToSize(item, anchoColumna - 5) as string[];
        colorTexto(acento);
        doc.text("•", x, yColumna);
        colorTexto(GRIS);
        doc.text(lineas, x + 4, yColumna);
        yColumna += lineas.length * 3.6 + 1.4;
      }
      altoMaximo = Math.max(altoMaximo, yColumna - y);
    });
    y += altoMaximo + 5;
  }

  const dibujarModulo = (titulo: string, hours: number | null, topics: string[]) => {
    ensureSpace(12);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.4);
    colorTexto(TINTA);
    const tituloLineas = doc.splitTextToSize(titulo, ANCHO - 26) as string[];
    doc.text(tituloLineas, MARGEN + 4, y);
    if (hours) {
      relleno(acentoSuave);
      doc.roundedRect(PAGE_W - MARGEN - 19, y - 4, 19, 6.5, 1.6, 1.6, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(6.6);
      colorTexto(acento);
      doc.text(`${hours} h`, PAGE_W - MARGEN - 9.5, y + 0.4, { align: "center" });
    }
    y += tituloLineas.length * 4.2 + 2;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.8);
    for (const tema of topics) {
      const lineas = doc.splitTextToSize(tema, ANCHO - 13) as string[];
      const alto = lineas.length * 3.5 + 1.2;
      if (y + alto > LIMITE) {
        nuevaPagina();
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8.4);
        colorTexto(GRIS);
        doc.text(`${titulo} (continuación)`, MARGEN, y);
        y += 5;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(7.8);
      }
      colorTexto(acentoMedio);
      doc.text("·", MARGEN + 5, y);
      colorTexto(GRIS);
      doc.text(lineas, MARGEN + 8, y);
      y += alto;
    }
    y += 3;
  };

  for (const nivel of data.temario) {
    ensureSpace(24);
    y += 2;
    relleno(LAVADO);
    doc.roundedRect(MARGEN, y, ANCHO, 13, 2.5, 2.5, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10.5);
    colorTexto(TINTA);
    doc.text(nivel.label, MARGEN + 5, y + 8.4);
    if (nivel.shortLabel) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.6);
      colorTexto(GRIS);
      doc.text(nivel.shortLabel, PAGE_W - MARGEN - 5, y + 8.4, { align: "right" });
    }
    y += 19;

    for (const modulo of nivel.modules) {
      ensureSpace(14);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9.4);
      colorTexto(TINTA);
      const tituloLineas = doc.splitTextToSize(modulo.title, ANCHO - 26) as string[];
      const altoBloque = tituloLineas.length * 4.2 + 2;
      if (y + altoBloque > LIMITE) nuevaPagina();
      dibujarModulo(modulo.title, modulo.hours, modulo.topics);
    }
  }

  // ── Cierre ─────────────────────────────────────────────────────────────────
  ensureSpace(50);
  y += 4;
  relleno(TINTA);
  doc.roundedRect(MARGEN, y, ANCHO, 42, 3, 3, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.4);
  doc.setTextColor(180, 180, 174);
  doc.setCharSpace(0.8);
  doc.text("CERTIFICADO DIGITAL VERIFICABLE", MARGEN + 7, y + 9);
  doc.setCharSpace(0);
  doc.setFontSize(14);
  doc.setTextColor(255, 255, 255);
  doc.text("Inscríbete y certifícate", MARGEN + 7, y + 18);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.6);
  doc.setTextColor(205, 205, 199);
  const cierre = doc.splitTextToSize(
    "Certificado digital con código de verificación al completar el programa. Acceso a las grabaciones en el campus y acompañamiento del equipo docente.",
    ANCHO - 14
  ) as string[];
  doc.text(cierre, MARGEN + 7, y + 24);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  doc.text(`programbi.com${data.inscripcionUrl}`, MARGEN + 7, y + 38);
  if (data.whatsappUrl) {
    doc.text(
      `WhatsApp: ${data.whatsappUrl.replace(/^https?:\/\/wa\.me\//, "+")}`,
      PAGE_W - MARGEN - 7,
      y + 38,
      { align: "right" }
    );
  }
  y += 50;

  pie();
  doc.save(`Brochure_ProgramBI_${data.slug}_${data.pais.toUpperCase()}.pdf`);
}
