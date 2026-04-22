"use client";

import { useState, useEffect } from "react";

export function useGeoPricing() {
  const [isInternational, setIsInternational] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkCountry() {
      // Usar localStorage para no saturar la API
      const cached = localStorage.getItem('is_international');
      if (cached !== null) {
        setIsInternational(cached === 'true');
        setLoading(false);
        return;
      }

      try {
        const res = await fetch('https://ipapi.co/json/');
        if (!res.ok) throw new Error("API fetch failed");
        const data = await res.json();
        
        // Si el código de país no es CL (Chile), se considera internacional
        const international = data.country_code !== "CL";
        setIsInternational(international);
        localStorage.setItem('is_international', international.toString());
      } catch (err) {
        // En caso de error, asumimos Chile por defecto o por seguridad
        setIsInternational(false);
      } finally {
        setLoading(false);
      }
    }
    checkCountry();
  }, []);

  // Función para formatear el precio basándose en la ubicación
  const formatGeoPrice = (clpAmount: number) => {
    if (isInternational) {
      const usdAmount = Math.ceil(clpAmount / 1000);
      return `$${usdAmount} USD`;
    } else {
      return new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP',
        maximumFractionDigits: 0
      }).format(clpAmount);
    }
  };

  return { isInternational, loading, formatGeoPrice };
}
