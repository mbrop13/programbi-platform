/** Proyección pública usada por el comparador, generada a partir de carreras normalizadas. */
export function generarComparador(carreras) {
  return carreras.map((carrera) => ({
    slug: carrera.slug,
    nombre: carrera.nombre,
    area: carrera.area,
    tipos: Object.fromEntries(Object.entries(carrera.tipos).filter(([, tipo]) => tipo).map(([clave, tipo]) => [clave, {
      ing: tipo.ing,
      emp1: tipo.emp1,
      emp2: tipo.emp2,
      dur_formal: tipo.dur_formal,
      dur_real: tipo.dur_real,
      arancel_med: tipo.oferta?.arancel?.med ?? null,
      costo_tit_med: tipo.oferta?.costo_titulacion_med ?? null,
    }])),
  }));
}
