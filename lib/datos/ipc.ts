import ipcData from "@/data/ipc/ipc.json";

export interface PuntoIpc {
  m: string;
  v: number;
}

const IPC_SERIE: readonly PuntoIpc[] = ipcData;
const IPC_POR_MES = new Map(IPC_SERIE.map((p) => [p.m, p.v]));

export function getIpcSeries(): readonly PuntoIpc[] {
  return IPC_SERIE;
}

export function getUltimoIpc(): PuntoIpc {
  return IPC_SERIE[IPC_SERIE.length - 1] ?? { m: "2026-10", v: 114.13 };
}

export function getIpcMes(ym: string): number | null {
  return IPC_POR_MES.get(ym) ?? null;
}

/**
 * Ajusta un monto desde `desde` (por defecto "2025-09") hasta `hasta` (por defecto último IPC).
 * Fórmula oficial: monto * IPC_hasta / IPC_desde.
 */
export function ajustarPorIpc(
  monto: number,
  desde = "2025-09",
  hasta?: string,
  serie: readonly PuntoIpc[] = IPC_SERIE
): { montoAjustado: number; factor: number; ipcDesde: number; ipcHasta: number; mesHasta: string } | null {
  const mapa = new Map(serie.map((p) => [p.m, p.v]));
  const ultimo = serie[serie.length - 1];
  const mesHasta = hasta ?? ultimo?.m;
  if (!mesHasta) return null;
  const ipcDesde = mapa.get(desde);
  const ipcHasta = mapa.get(mesHasta);
  if (!ipcDesde || !ipcHasta) return null;
  const factor = ipcHasta / ipcDesde;
  return {
    montoAjustado: Math.round(monto * factor),
    factor,
    ipcDesde,
    ipcHasta,
    mesHasta,
  };
}

export function variacionIpc(
  desde: string,
  hasta?: string,
  serie: readonly PuntoIpc[] = IPC_SERIE
): number | null {
  const res = ajustarPorIpc(100, desde, hasta, serie);
  if (!res) return null;
  return (res.ipcHasta - res.ipcDesde) / res.ipcDesde;
}
