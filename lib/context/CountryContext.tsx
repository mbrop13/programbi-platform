"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";

/* ═══════════════════════════════════════════════════════════════ */
/* TYPES                                                           */
/* ═══════════════════════════════════════════════════════════════ */
export interface CountryData {
  iso: string;
  name: string;
  shortName: string;
  phoneCode: string;
  currency: { code: string; symbol: string; rate: number; decimals: number };
  timezone: { offset: number; label: string };
  flagUrl: string;
}

interface CountryContextValue {
  country: CountryData;
  setCountryByIso: (iso: string) => void;
  countries: CountryData[];
  convertPrice: (clpAmount: number) => string;
  convertPriceRaw: (clpAmount: number) => number;
  convertTime: (chileTime: string) => string;
  isDetecting: boolean;
}

/* ═══════════════════════════════════════════════════════════════ */
/* COUNTRY DATA                                                    */
/* ═══════════════════════════════════════════════════════════════ */
// Exchange rates are approximate CLP → local currency
// 1 CLP = rate units of target currency
export const COUNTRIES: CountryData[] = [
  { iso: "cl", name: "Chile", shortName: "Chile", phoneCode: "+56",
    currency: { code: "CLP", symbol: "$", rate: 1, decimals: 0 },
    timezone: { offset: -4, label: "Chile" },
    flagUrl: "https://flagcdn.com/w40/cl.png" },
  { iso: "mx", name: "México", shortName: "México", phoneCode: "+52",
    currency: { code: "MXN", symbol: "$", rate: 0.018, decimals: 0 },
    timezone: { offset: -6, label: "México Centro" },
    flagUrl: "https://flagcdn.com/w40/mx.png" },
  { iso: "ar", name: "Argentina", shortName: "Argentina", phoneCode: "+54",
    currency: { code: "ARS", symbol: "$", rate: 0.95, decimals: 0 },
    timezone: { offset: -3, label: "Argentina" },
    flagUrl: "https://flagcdn.com/w40/ar.png" },
  { iso: "co", name: "Colombia", shortName: "Colombia", phoneCode: "+57",
    currency: { code: "COP", symbol: "$", rate: 4.3, decimals: 0 },
    timezone: { offset: -5, label: "Colombia" },
    flagUrl: "https://flagcdn.com/w40/co.png" },
  { iso: "pe", name: "Perú", shortName: "Perú", phoneCode: "+51",
    currency: { code: "PEN", symbol: "S/", rate: 0.0039, decimals: 2 },
    timezone: { offset: -5, label: "Perú" },
    flagUrl: "https://flagcdn.com/w40/pe.png" },
  { iso: "ec", name: "Ecuador", shortName: "Ecuador", phoneCode: "+593",
    currency: { code: "USD", symbol: "$", rate: 0.00105, decimals: 2 },
    timezone: { offset: -5, label: "Ecuador" },
    flagUrl: "https://flagcdn.com/w40/ec.png" },
  { iso: "pa", name: "Panamá", shortName: "Panamá", phoneCode: "+507",
    currency: { code: "USD", symbol: "$", rate: 0.00105, decimals: 2 },
    timezone: { offset: -5, label: "Panamá" },
    flagUrl: "https://flagcdn.com/w40/pa.png" },
  { iso: "ve", name: "Venezuela", shortName: "Venezuela", phoneCode: "+58",
    currency: { code: "USD", symbol: "$", rate: 0.00105, decimals: 2 },
    timezone: { offset: -4, label: "Venezuela" },
    flagUrl: "https://flagcdn.com/w40/ve.png" },
  { iso: "uy", name: "Uruguay", shortName: "Uruguay", phoneCode: "+598",
    currency: { code: "UYU", symbol: "$", rate: 0.042, decimals: 0 },
    timezone: { offset: -3, label: "Uruguay" },
    flagUrl: "https://flagcdn.com/w40/uy.png" },
  { iso: "py", name: "Paraguay", shortName: "Paraguay", phoneCode: "+595",
    currency: { code: "PYG", symbol: "₲", rate: 7.8, decimals: 0 },
    timezone: { offset: -4, label: "Paraguay" },
    flagUrl: "https://flagcdn.com/w40/py.png" },
  { iso: "bo", name: "Bolivia", shortName: "Bolivia", phoneCode: "+591",
    currency: { code: "BOB", symbol: "Bs", rate: 0.0073, decimals: 2 },
    timezone: { offset: -4, label: "Bolivia" },
    flagUrl: "https://flagcdn.com/w40/bo.png" },
  { iso: "gt", name: "Guatemala", shortName: "Guatemala", phoneCode: "+502",
    currency: { code: "GTQ", symbol: "Q", rate: 0.0082, decimals: 2 },
    timezone: { offset: -6, label: "Guatemala" },
    flagUrl: "https://flagcdn.com/w40/gt.png" },
  { iso: "cr", name: "Costa Rica", shortName: "Costa Rica", phoneCode: "+506",
    currency: { code: "CRC", symbol: "₡", rate: 0.54, decimals: 0 },
    timezone: { offset: -6, label: "Costa Rica" },
    flagUrl: "https://flagcdn.com/w40/cr.png" },
  { iso: "sv", name: "El Salvador", shortName: "El Salvador", phoneCode: "+503",
    currency: { code: "USD", symbol: "$", rate: 0.00105, decimals: 2 },
    timezone: { offset: -6, label: "El Salvador" },
    flagUrl: "https://flagcdn.com/w40/sv.png" },
  { iso: "hn", name: "Honduras", shortName: "Honduras", phoneCode: "+504",
    currency: { code: "HNL", symbol: "L", rate: 0.026, decimals: 2 },
    timezone: { offset: -6, label: "Honduras" },
    flagUrl: "https://flagcdn.com/w40/hn.png" },
  { iso: "ni", name: "Nicaragua", shortName: "Nicaragua", phoneCode: "+505",
    currency: { code: "NIO", symbol: "C$", rate: 0.039, decimals: 2 },
    timezone: { offset: -6, label: "Nicaragua" },
    flagUrl: "https://flagcdn.com/w40/ni.png" },
  { iso: "do", name: "Rep. Dominicana", shortName: "R.D.", phoneCode: "+1",
    currency: { code: "DOP", symbol: "RD$", rate: 0.062, decimals: 0 },
    timezone: { offset: -4, label: "Rep. Dominicana" },
    flagUrl: "https://flagcdn.com/w40/do.png" },
  { iso: "es", name: "España", shortName: "España", phoneCode: "+34",
    currency: { code: "EUR", symbol: "€", rate: 0.00097, decimals: 2 },
    timezone: { offset: 2, label: "España" },
    flagUrl: "https://flagcdn.com/w40/es.png" },
  { iso: "us", name: "Estados Unidos", shortName: "EE.UU.", phoneCode: "+1",
    currency: { code: "USD", symbol: "$", rate: 0.00105, decimals: 2 },
    timezone: { offset: -5, label: "EE.UU. Este" },
    flagUrl: "https://flagcdn.com/w40/us.png" },
];

const STORAGE_KEY = "programbi_country_iso";
const DEFAULT_ISO = "cl";

/* ═══════════════════════════════════════════════════════════════ */
/* CONTEXT                                                         */
/* ═══════════════════════════════════════════════════════════════ */
const CountryContext = createContext<CountryContextValue | null>(null);

export function useCountry(): CountryContextValue {
  const ctx = useContext(CountryContext);
  if (!ctx) throw new Error("useCountry must be used inside <CountryProvider>");
  return ctx;
}

function getCountry(iso: string): CountryData {
  return COUNTRIES.find((c) => c.iso === iso) || COUNTRIES[0];
}

/* ═══════════════════════════════════════════════════════════════ */
/* PROVIDER                                                        */
/* ═══════════════════════════════════════════════════════════════ */
export function CountryProvider({ children }: { children: React.ReactNode }) {
  const [iso, setIso] = useState<string>(DEFAULT_ISO);
  const [isDetecting, setIsDetecting] = useState(true);

  // On mount: check localStorage first, then IP detection
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && COUNTRIES.some((c) => c.iso === saved)) {
      setIso(saved);
      setIsDetecting(false);
      return;
    }

    // Auto-detect by IP
    const detect = async () => {
      try {
        const res = await fetch("https://ipapi.co/json/", { signal: AbortSignal.timeout(4000) });
        if (res.ok) {
          const data = await res.json();
          const code = (data.country_code || "").toLowerCase();
          if (COUNTRIES.some((c) => c.iso === code)) {
            setIso(code);
            localStorage.setItem(STORAGE_KEY, code);
          }
        }
      } catch {
        // Silently fail, keep default (Chile)
      } finally {
        setIsDetecting(false);
      }
    };

    detect();
  }, []);

  const setCountryByIso = useCallback((newIso: string) => {
    if (COUNTRIES.some((c) => c.iso === newIso)) {
      setIso(newIso);
      localStorage.setItem(STORAGE_KEY, newIso);
    }
  }, []);

  const country = useMemo(() => getCountry(iso), [iso]);

  const convertPrice = useCallback((clpAmount: number): string => {
    const { currency } = getCountry(iso);
    if (currency.code === "CLP") {
      return `$${Math.round(clpAmount).toLocaleString("es-CL")}`;
    }
    const converted = clpAmount * currency.rate;
    if (currency.decimals === 0) {
      return `${currency.symbol}${Math.round(converted).toLocaleString("es-CL")}`;
    }
    return `${currency.symbol}${converted.toFixed(currency.decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
  }, [iso]);

  const convertPriceRaw = useCallback((clpAmount: number): number => {
    const { currency } = getCountry(iso);
    return clpAmount * currency.rate;
  }, [iso]);

  const convertTime = useCallback((chileTime: string): string => {
    const chileOffset = -4;
    const targetOffset = getCountry(iso).timezone.offset;
    const diff = targetOffset - chileOffset;
    return chileTime.replace(/(\d{1,2}):(\d{2})/g, (_, h, m) => {
      const hour = (parseInt(h) + diff + 24) % 24;
      return `${hour.toString().padStart(2, "0")}:${m}`;
    });
  }, [iso]);

  const value = useMemo<CountryContextValue>(() => ({
    country,
    setCountryByIso,
    countries: COUNTRIES,
    convertPrice,
    convertPriceRaw,
    convertTime,
    isDetecting,
  }), [country, setCountryByIso, convertPrice, convertPriceRaw, convertTime, isDetecting]);

  return (
    <CountryContext.Provider value={value}>
      {children}
    </CountryContext.Provider>
  );
}
