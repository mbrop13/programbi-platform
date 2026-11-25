import type { GuiaPasoAPaso } from "@/lib/guias/paso-a-paso-tipos";
import { PLANTILLAS_COLOMBIA_2026 } from "@/lib/leads-magnet";

export const guia: GuiaPasoAPaso = {
  slug: "liquidacion-de-nomina-excel",
  pais: "co",
  title: "Liquidación de nómina en Excel 2026 (Colombia): guía",
  meta: "Arma una liquidación de nómina en Excel 2026 (Colombia): devengados, auxilio hasta $3.501.810, IBC, salud 4 %, pensión 4 %, FSP y provisiones.",
  h1: "Cómo hacer una liquidación de nómina en Excel en Colombia (2026)",
  subtitle:
    "Construye una nómina mensual en Excel con hoja Parametros 2026, devengados, auxilio de transporte hasta 2 SMMLV ($3.501.810), cálculo de IBC, deducciones de salud (4 %), pensión (4 %) y Fondo de Solidaridad Pensional (FSP ≥4 SMMLV) con BUSCARX, provisiones del empleador y neto a pagar.",
  keywordPrincipal: "liquidacion de nomina en excel colombia",
  keywords: [
    "liquidacion de nomina en excel colombia",
    "plantilla nomina colombia 2026 excel",
    "formula fondo solidaridad pensional buscarx",
    "provisiones nomina excel colombia 2026",
  ],
  curso: "excel",
  cursoSecundario: "power-bi",
  herramienta: "Excel",
  nivel: "Intermedio",
  updated: "2026-11-25",
  published: "2026-11-25",
  totalTimeIso: "PT35M",
  en30Segundos: {
    queLogras:
      "Un libro de nómina en Excel 2026 con hoja Parametros, tabla de tramos del Fondo de Solidaridad Pensional (FSP) consultada con BUSCARX, deducciones del trabajador, provisiones mensuales del empleador y neto a pagar.",
    herramienta: "Microsoft Excel 365 / 2021 (con BUSCARX) o equivalente",
    tiempo: "35 minutos",
    bullets: [
      "Hoja Parametros 2026: SMMLV ($1.750.905), auxilio ($249.095), tope 2 SMMLV ($3.501.810) y tabla FSP ≥4 SMMLV.",
      "Cálculo automático de devengados, auxilio proporcional y Base de Cotización (IBC).",
      "Deducciones de salud 4 %, pensión 4 % y FSP escalonado (1 % a 2 %) usando BUSCARX.",
      "Provisiones del empleador (prima 8,33 %, cesantías 8,33 %, intereses 1 %, vacaciones 4,17 %) y neto a pagar.",
    ],
  },
  rutaVisual: [
    {
      numero: 1,
      titulo: "Hoja Parametros y FSP",
      resumen: "Centraliza SMMLV 2026, porcentajes y tabla de tramos FSP.",
      anchorId: "parametros-nomina-2026",
      icono: "database",
    },
    {
      numero: 2,
      titulo: "Devengados y auxilio",
      resumen: "Calcula salario por días trabajados, extras y auxilio hasta 2 SMMLV.",
      anchorId: "devengados-auxilio-ibc",
      icono: "table",
    },
    {
      numero: 3,
      titulo: "IBC, salud y pensión",
      resumen: "Determina el IBC y descuenta 4 % de salud y 4 % de pensión.",
      anchorId: "deducciones-salud-pension",
      icono: "code",
    },
    {
      numero: 4,
      titulo: "FSP con BUSCARX",
      resumen: "Aplica el porcentaje de solidaridad pensional desde 4 SMMLV.",
      anchorId: "fsp-buscarx-excel",
      icono: "settings",
    },
    {
      numero: 5,
      titulo: "Provisiones y neto",
      resumen: "Calcula provisiones del empleador y el neto final a transferir.",
      anchorId: "provisiones-neto-pagar",
      icono: "check",
    },
  ],
  requisitos: {
    version: "Excel 365 o Excel 2021 (para BUSCARX; incluye alternativa BUSCARV para Excel 2019)",
    lista: [
      "Microsoft Excel en Windows, macOS o Excel Web.",
      "Listado de trabajadores con salario básico, días laborados (hasta 30) y novedades salariales (horas extra o comisiones).",
      "Parámetros oficiales 2026: SMMLV $1.750.905, tope 2 SMMLV $3.501.810 y auxilio de transporte $249.095.",
    ],
    compatibilidadMacWeb:
      "BUSCARX (XLOOKUP en inglés) funciona en Excel 365, Excel 2021, macOS y Excel Web. Si usas Excel 2019 o 2016, reemplaza BUSCARX por BUSCARV con coincidencia aproximada (VERDADERO).",
    avisoEducativo:
      "Guía educativa de modelado de nómina en Excel. Verifica siempre retención en la fuente (Art. 383 E.T.), exoneración de aportes parafiscales (Art. 114-1 E.T.) y clase de riesgo ARL de tu empresa.",
  },
  herramientasHowTo: [
    "Microsoft Excel",
    "Parámetros laborales MinTrabajo 2026",
  ],
  insumosHowTo: [
    "Salario básico y días trabajados del mes",
    "Novedades de horas extra, recargos o comisiones",
  ],
  secciones: [
    {
      id: "parametros-nomina-2026",
      titulo: "Crea la hoja Parametros y la tabla de tramos FSP (2026)",
      esPasoHowTo: true,
      resumenHowTo:
        "Registra el SMMLV 2026, el auxilio de transporte, los porcentajes de aportes y la tabla escalonada del Fondo de Solidaridad Pensional.",
      parrafos: [
        "En la hoja Parametros centraliza las cifras vigentes de 2026 (ver [salario mínimo Colombia 2026](/co/datos/salario-minimo)): SMMLV $1.750.905, auxilio de transporte $249.095 y tope de 2 SMMLV $3.501.810.",
        "Además, en el rango D2:E8 arma la tabla de tramos del Fondo de Solidaridad Pensional (FSP), que aplica cuando el Ingreso Base de Cotización (IBC) es igual o superior a 4 SMMLV ($7.003.620 COP en 2026).",
      ],
      tabla: {
        caption: "Tabla de parámetros y tramos FSP para nómina Colombia 2026",
        encabezados: ["Tramo IBC en SMMLV", "Límite inferior (COP)", "Tarifa FSP", "Nota"],
        filas: [
          ["Menos de 4 SMMLV", "$0", "0,0 %", "No aporta FSP"],
          ["4 a <16 SMMLV", "$7.003.620", "1,0 %", "Aporte básico solidaridad"],
          ["16 a <17 SMMLV", "$28.014.480", "1,2 %", "Incluye subcuenta subsistencia"],
          ["17 a <18 SMMLV", "$29.765.385", "1,4 %", "Incluye subcuenta subsistencia"],
          ["18 a <19 SMMLV", "$31.516.290", "1,6 %", "Incluye subcuenta subsistencia"],
          ["19 a ≤20 SMMLV", "$33.267.195", "1,8 %", "Incluye subcuenta subsistencia"],
          ["Más de 20 SMMLV", "$35.018.101", "2,0 %", "Tope máximo cotización 25 SMMLV"],
        ],
      },
    },
    {
      id: "devengados-auxilio-ibc",
      titulo: "Calcula devengados, auxilio de transporte y total devengado",
      esPasoHowTo: true,
      resumenHowTo:
        "Calcula el salario proporcional a los días trabajados y asigna el auxilio de transporte si el salario básico no supera $3.501.810.",
      parrafos: [
        "En la hoja Nomina, supón que C2 es el salario básico mensual, D2 los días laborados (de 1 a 30), E2 las horas extra o comisiones salariales, F2 el salario devengado, G2 el auxilio de transporte y H2 el total devengado.",
        "El auxilio de transporte ($249.095) se paga proporcional a los días laborados únicamente cuando el salario básico mensual (C2) es menor o igual a 2 SMMLV ($3.501.810).",
      ],
      codigos: [
        {
          titulo: "Fórmulas de devengados y auxilio de transporte (F2, G2, H2)",
          lenguaje: "excel",
          codigo: "F2 (Salario devengado):   =REDONDEAR(C2 * D2 / 30; 0)\nG2 (Auxilio transporte):  =SI(C2<=Parametros!$B$4; REDONDEAR(Parametros!$B$3 * D2 / 30; 0); 0)\nH2 (Total devengado):     =F2 + E2 + G2",
          codigoEn: "F2 (Salario devengado):   =ROUND(C2 * D2 / 30, 0)\nG2 (Auxilio transporte):  =IF(C2<=Parametros!$B$4, ROUND(Parametros!$B$3 * D2 / 30, 0), 0)\nH2 (Total devengado):     =F2 + E2 + G2",
        },
      ],
    },
    {
      id: "deducciones-salud-pension",
      titulo: "Determina el IBC, salud (4 %) y pensión (4 %)",
      esPasoHowTo: true,
      resumenHowTo:
        "Calcula el IBC excluyendo el auxilio de transporte y aplica el 4 % de salud y 4 % de pensión.",
      parrafos: [
        "El Ingreso Base de Cotización (IBC) incluye el salario devengado más horas extra, recargos y comisiones salariales, pero nunca incluye el auxilio de transporte.",
        "Con el IBC en la celda I2, calcula la deducción de salud (4 % en J2) y pensión (4 % en K2) a cargo del trabajador.",
      ],
      codigos: [
        {
          titulo: "Fórmulas de IBC, salud 4 % y pensión 4 % (I2, J2, K2)",
          lenguaje: "excel",
          codigo: "I2 (IBC):         =MIN(F2 + E2; 25 * Parametros!$B$2)\nJ2 (Salud 4%):    =REDONDEAR(I2 * 0,04; 0)\nK2 (Pensión 4%):  =REDONDEAR(I2 * 0,04; 0)",
          codigoEn: "I2 (IBC):         =MIN(F2 + E2, 25 * Parametros!$B$2)\nJ2 (Salud 4%):    =ROUND(I2 * 0.04, 0)\nK2 (Pensión 4%):  =ROUND(I2 * 0.04, 0)",
          nota: "El límite máximo del IBC en Colombia es de 25 SMMLV.",
        },
      ],
    },
    {
      id: "fsp-buscarx-excel",
      titulo: "Calcula el Fondo de Solidaridad Pensional (FSP ≥4 SMMLV) con BUSCARX",
      esPasoHowTo: true,
      resumenHowTo:
        "Usa BUSCARX con modo de coincidencia aproximada (-1) para obtener la tarifa FSP exacta según el IBC.",
      parrafos: [
        "En lugar de escribir seis funciones SI anidadas difíciles de mantener, usa BUSCARX con el argumento modo_coincidencia = -1 (coincidencia exacta o el siguiente elemento menor) sobre la tabla de tramos de la hoja Parametros (D2:D8 con límites en COP y E2:E8 con tarifas).",
      ],
      codigos: [
        {
          titulo: "Deducción de Fondo de Solidaridad Pensional (L2) con BUSCARX",
          lenguaje: "excel",
          codigo: "=REDONDEAR(I2 * BUSCARX(I2; Parametros!$D$2:$D$8; Parametros!$E$2:$E$8; 0; -1); 0)",
          codigoEn: "=ROUND(I2 * XLOOKUP(I2, Parametros!$D$2:$D$8, Parametros!$E$2:$E$8, 0, -1), 0)",
          nota: "En Excel 2019 o anterior puedes usar =REDONDEAR(I2 * BUSCARV(I2; Parametros!$D$2:$E$8; 2; VERDADERO); 0).",
        },
      ],
    },
    {
      id: "provisiones-neto-pagar",
      titulo: "Neto a pagar y provisiones mensuales del empleador",
      esPasoHowTo: true,
      resumenHowTo:
        "Resta las deducciones al total devengado para hallar el neto a pagar y calcula las provisiones de prestaciones sociales.",
      parrafos: [
        "El neto a pagar al trabajador (M2) es Total Devengado (H2) menos Salud (J2), Pensión (K2) y FSP (L2) (más otras deducciones autoradas como libranzas o retención en la fuente si aplican).",
        "En columnas paralelas de costo empresa, provisiona mensualmente prima de servicios (8,33 % sobre salario + auxilio), cesantías (8,33 % sobre salario + auxilio), intereses de cesantías (1 % mensual sobre la base o 12 % de la provisión de cesantías) y vacaciones (4,17 % solo sobre salario sin auxilio).",
      ],
      tabla: {
        caption: "Porcentajes de provisión mensual de prestaciones sociales (empleador)",
        encabezados: ["Provisión", "Base de cálculo", "Porcentaje mensual"],
        filas: [
          ["Prima de servicios", "Salario + Auxilio (si aplica)", "8,33 % (1/12)"],
          ["Cesantías", "Salario + Auxilio (si aplica)", "8,33 % (1/12)"],
          ["Intereses de cesantías", "Base de cesantías (o 12 % de cesantías)", "1,00 % mensual"],
          ["Vacaciones", "Solo salario (sin auxilio)", "4,17 % (1/24)"],
        ],
      },
      verificaResultado:
        "Para un trabajador con 1 SMMLV ($1.750.905) y 30 días laborados: Total devengado $2.000.000, Salud $70.036, Pensión $70.036, FSP $0 y Neto a pagar $1.859.928 COP.",
    },
  ],
  erroresComunes: [
    {
      error: "Incluir el auxilio de transporte dentro del IBC",
      causa: "Calcular salud (4 %) y pensión (4 %) sobre el Total Devengado (H2).",
      solucion:
        "El auxilio de transporte no es factor salarial para seguridad social. Calcula el IBC únicamente con F2 + E2.",
    },
    {
      error: "Error #N/D en BUSCARX al evaluar el tramo FSP",
      causa: "Omitir el quinto argumento (-1) en BUSCARX, lo que exige coincidencia exacta.",
      solucion:
        "Asegúrate de pasar 0 como si_no_se_encuentra y -1 como modo_coincidencia: BUSCARX(I2; ...; ...; 0; -1).",
    },
    {
      error: "Provisionar vacaciones incluyendo el auxilio de transporte",
      causa: "Usar la misma base de prima y cesantías para el 4,17 % de vacaciones.",
      solucion:
        "Aplica el 4,17 % únicamente sobre el salario devengado más recargos salariales aplicables, excluyendo el auxilio de transporte.",
    },
  ],
  plantilla: {
    titulo: "Plantilla Excel: Liquidación de nómina Colombia 2026 (.xlsx)",
    descripcion:
      "Descarga el libro con hoja Parametros 2026, tabla FSP con BUSCARX, devengados, deducciones 4 % / 4 %, provisiones de prestaciones y neto a pagar.",
  },
  plantillaArchivo: PLANTILLAS_COLOMBIA_2026.liquidacionNomina,
  faqs: [
    {
      q: "¿Hasta qué salario se paga auxilio de transporte en Colombia en 2026?",
      a: "Se paga a trabajadores que devenguen hasta 2 SMMLV, equivalentes a $3.501.810 COP en 2026.",
    },
    {
      q: "¿Cuándo se descuenta el Fondo de Solidaridad Pensional (FSP)?",
      a: "Cuando el Ingreso Base de Cotización (IBC) del trabajador es igual o superior a 4 SMMLV ($7.003.620 COP en 2026), iniciando en 1 % y escalando hasta 2 % según el rango de SMMLV.",
    },
    {
      q: "¿Qué porcentaje de salud y pensión paga el trabajador?",
      a: "El trabajador aporta el 4 % a salud y el 4 % a pensión sobre su IBC. El empleador asume el 12 % de pensión y el 8,5 % de salud (salvo exoneración del Art. 114-1 E.T.).",
    },
    {
      q: "¿Cómo puedo pasar esta nómina a un tablero mensual de costos?",
      a: "Puedes conectar tu tabla de nómina en Excel directamente a Power BI para analizar costos por centro de costo, provisiones y horas extra mes a mes.",
    },
  ],
  relacionadas: [
    "prima-de-servicios-excel",
    "cesantias-2026",
    "liquidacion-de-contrato-excel",
  ],
  enlacesExternos: [
    {
      label: "Ministerio del Trabajo de Colombia",
      url: "https://www.mintrabajo.gov.co",
      fuente: "MinTrabajo",
    },
    {
      label: "UGPP — Ingreso Base de Cotización (IBC)",
      url: "https://www.ugpp.gov.co",
      fuente: "UGPP",
    },
  ],
  enlacesInternosExtra: [
    {
      label: "Curso de Excel en vivo en Colombia",
      href: "/co/cursos/excel",
      descripcion: "Domina BUSCARX, nómina automatizada y tablas dinámicas en vivo.",
    },
    {
      label: "Salario mínimo Colombia 2026",
      href: "/co/datos/salario-minimo",
      descripcion: "Consulta SMMLV ($1.750.905) y auxilio de transporte ($249.095).",
    },
    {
      label: "Indicadores y datos de Colombia",
      href: "/co/datos",
      descripcion: "Cifras laborales, IPC y tasas oficiales de Colombia.",
    },
  ],
};
