// Fotos de instituciones de educación superior obtenidas de Wikimedia Commons.
// Cada entrada conserva autor y licencia para la atribución obligatoria (CC BY / CC BY-SA).

export interface FotoInstitucion {
  src: string;
  srcSm: string;
  autor: string;
  licencia: string;
  licenciaUrl: string;
  fuenteUrl: string;
  alt: string;
}

export const FOTOS_INSTITUCIONES: Record<string, FotoInstitucion> = {
  "UNIVERSIDAD DE CHILE": {
    src: "/images/datos/instituciones/uchile.webp",
    srcSm: "/images/datos/instituciones/uchile-sm.webp",
    autor: "Rjcastillo",
    licencia: "CC BY-SA 4.0",
    licenciaUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    fuenteUrl: "https://commons.wikimedia.org/wiki/File:Casa_Central_de_la_Universidad_de_Chile_I.jpg",
    alt: "Casa Central de la Universidad de Chile en la Alameda, Santiago",
  },
  "PONTIFICIA UNIVERSIDAD CATOLICA DE CHILE": {
    src: "/images/datos/instituciones/uc.webp",
    srcSm: "/images/datos/instituciones/uc-sm.webp",
    autor: "Jorge Láscar",
    licencia: "CC BY 2.0",
    licenciaUrl: "https://creativecommons.org/licenses/by/2.0/",
    fuenteUrl: "https://commons.wikimedia.org/wiki/File:Pontificia_Universidad_Cat%C3%B3lica_de_Chile%27s_Casa_Central_campus.jpg",
    alt: "Casa Central de la Pontificia Universidad Católica de Chile vista desde el cerro Santa Lucía, Santiago",
  },
  "UNIVERSIDAD TECNICA FEDERICO SANTA MARIA": {
    src: "/images/datos/instituciones/usm.webp",
    srcSm: "/images/datos/instituciones/usm-sm.webp",
    autor: "Alexxxos",
    licencia: "CC BY-SA 3.0",
    licenciaUrl: "https://creativecommons.org/licenses/by-sa/3.0/",
    fuenteUrl: "https://commons.wikimedia.org/wiki/File:Central_Building,_Universidad_T%C3%A9cnica_Federico_Santa_Mar%C3%ADa,_Valpara%C3%ADso,_Chile.jpg",
    alt: "Edificio central de la Universidad Técnica Federico Santa María en Valparaíso",
  },
  "UNIVERSIDAD DE CONCEPCION": {
    src: "/images/datos/instituciones/udec.webp",
    srcSm: "/images/datos/instituciones/udec-sm.webp",
    autor: "Vllpr",
    licencia: "CC BY 4.0",
    licenciaUrl: "https://creativecommons.org/licenses/by/4.0/",
    fuenteUrl: "https://commons.wikimedia.org/wiki/File:Arco,_Universidad_de_Concepci%C3%B3n.jpg",
    alt: "Edificio del Arco en el campus de la Universidad de Concepción",
  },
  "UNIVERSIDAD DE SANTIAGO DE CHILE": {
    src: "/images/datos/instituciones/usach.webp",
    srcSm: "/images/datos/instituciones/usach-sm.webp",
    autor: "Gatotienesueño",
    licencia: "CC BY 4.0",
    licenciaUrl: "https://creativecommons.org/licenses/by/4.0/",
    fuenteUrl: "https://commons.wikimedia.org/wiki/File:Casa_Central_USACH.jpg",
    alt: "Fachada vidriada de la Casa Central de la Universidad de Santiago de Chile, Estación Central",
  },
  "PONTIFICIA UNIVERSIDAD CATOLICA DE VALPARAISO": {
    src: "/images/datos/instituciones/pucv.webp",
    srcSm: "/images/datos/instituciones/pucv-sm.webp",
    autor: "Carlos Figueroa Rojas",
    licencia: "CC BY-SA 4.0",
    licenciaUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    fuenteUrl: "https://commons.wikimedia.org/wiki/File:Casa_Central_PUCV,_Valpara%C3%ADso_20230903_03.jpg",
    alt: "Casa Central de la Pontificia Universidad Católica de Valparaíso en avenida Brasil",
  },
  "UNIVERSIDAD DIEGO PORTALES": {
    src: "/images/datos/instituciones/udp.webp",
    srcSm: "/images/datos/instituciones/udp-sm.webp",
    autor: "Carlos Figueroa Rojas",
    licencia: "CC BY-SA 4.0",
    licenciaUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    fuenteUrl: "https://commons.wikimedia.org/wiki/File:Facultad_de_Educaci%C3%B3n_UDP,_Santiago_20231014.jpg",
    alt: "Facultad de Educación de la Universidad Diego Portales en el barrio universitario de Santiago",
  },
  "UNIVERSIDAD ANDRES BELLO": {
    src: "/images/datos/instituciones/unab.webp",
    srcSm: "/images/datos/instituciones/unab-sm.webp",
    autor: "Felipe Restrepo Acosta",
    licencia: "CC BY-SA 4.0",
    licenciaUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    fuenteUrl: "https://commons.wikimedia.org/wiki/File:2017_Santiago_de_Chile_-_Universidad_Andr%C3%A9s_Bello_-_Facultad_de_Medicina_-_Av._Rep%C3%BAblica_590.jpg",
    alt: "Edificio de la Facultad de Medicina de la Universidad Andrés Bello en avenida República, Santiago",
  },
  "UNIVERSIDAD DEL DESARROLLO": {
    src: "/images/datos/instituciones/udd.webp",
    srcSm: "/images/datos/instituciones/udd-sm.webp",
    autor: "Medicina UDD",
    licencia: "CC BY-SA 4.0",
    licenciaUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    fuenteUrl: "https://commons.wikimedia.org/wiki/File:Campus_Las_Condes_UDD.jpg",
    alt: "Facultad de Medicina Clínica Alemana-Universidad del Desarrollo, campus Las Condes",
  },
};

function normalizarClave(key: string): string {
  return key
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase()
    .replace(/\s+/g, " ")
    .trim();
}

export function getFotoInstitucion(key: string): FotoInstitucion | undefined {
  return FOTOS_INSTITUCIONES[normalizarClave(key)];
}
