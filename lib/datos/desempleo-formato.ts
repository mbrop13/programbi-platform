const porcentaje = new Intl.NumberFormat("es-CL", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});
const entero = new Intl.NumberFormat("es-CL", { useGrouping: "always", maximumFractionDigits: 0 });
const meses = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];

export function cifra(tasa: number) {
  return porcentaje.format(tasa);
}

export function tasa(tasa: number) {
  return `${cifra(tasa)} %`;
}

export function puntos(delta: number, conSigno = true) {
  const absoluta = cifra(Math.abs(delta));
  const signo = conSigno && absoluta !== "0,0" ? (delta > 0 ? "+" : "−") : "";
  return `${signo}${absoluta} pp.`;
}

export function personas(miles: number) {
  return entero.format(miles * 1000);
}

export function periodo(codigo: string) {
  const [ano, mes] = codigo.split("-").map(Number);
  if (mes === 1) return `dic ${ano - 1}–feb ${ano}`;
  if (mes === 12) return `nov ${ano}–ene ${ano + 1}`;
  return `${meses[mes - 2]}–${meses[mes]} ${ano}`;
}

export function fechaCorta(fecha: string) {
  const [ano, mes, dia] = fecha.slice(0, 10).split("-");
  return `${dia}-${mes}-${ano}`;
}
