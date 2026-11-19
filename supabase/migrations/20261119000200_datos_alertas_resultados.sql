alter table public.datos_alertas_ediciones
  add column sustituida_por text references public.datos_alertas_ediciones (periodo),
  add constraint datos_alertas_edicion_sustituida
    check (sustituida_por is null or (finalizado_en is not null and sustituida_por > periodo));

alter table public.datos_alertas_envios
  add column descartado_en timestamptz,
  add constraint datos_alertas_envio_resultado_exclusivo
    check (enviado_en is null or descartado_en is null);
