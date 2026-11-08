alter table public.courses
  add column if not exists brochure_pdf_url text;

comment on column public.courses.brochure_pdf_url is
  'URL de un brochure PDF personalizado. Si es null, la web genera el brochure con jsPDF.';
