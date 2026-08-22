-- ============================================================
-- SEED OPCIONAL — Bolsa de Trabajo ProgramBI (datos demo)
-- ============================================================
-- Ejecutar SOLO si quieres cargar empresas y vacantes de ejemplo
-- para que la bolsa no se vea vacía durante el lanzamiento.
--
-- Requisitos:
--   1. Haber aplicado antes las migraciones:
--      20260821000000_bolsa_trabajo.sql y 20260822000000_bolsa_trabajo_pro.sql
--   2. Tener al menos un admin en public.admin_users (será dueño de las empresas demo).
--
-- Personaliza los nombres/emails antes de ejecutar. Para eliminar los datos
-- demo después: DELETE FROM public.employer_companies WHERE slug IN
--   ('datos-mineria-demo', 'banco-analitica-demo');
-- ============================================================

-- Dueño de las empresas demo: el primer admin registrado
DO $$
DECLARE
  demo_owner UUID;
  c1 UUID;
  c2 UUID;
BEGIN
  SELECT user_id INTO demo_owner FROM public.admin_users ORDER BY created_at LIMIT 1;
  IF demo_owner IS NULL THEN
    RAISE EXCEPTION 'No hay usuarios admin en admin_users. Carga el seed cuando exista al menos uno.';
  END IF;

  -- ── Empresa demo 1 ──
  INSERT INTO public.employer_companies
    (name, slug, website, industry, description, size, city, country, contact_email, status, owner_user_id)
  VALUES (
    'Minería & Datos SpA (demo)',
    'datos-mineria-demo',
    'https://programbi.com',
    'Minería',
    'Empresa de analítica minera. Somos partner de ProgramBI y buscamos talento certificado para nuestros equipos de datos.',
    '51-200', 'Antofagasta', 'Chile', 'contacto@programbi.cl', 'approved', demo_owner
  )
  ON CONFLICT (slug) DO NOTHING
  RETURNING id INTO c1;

  IF c1 IS NOT NULL THEN
    INSERT INTO public.employer_members (company_id, user_id, role)
    VALUES (c1, demo_owner, 'owner')
    ON CONFLICT DO NOTHING;

    INSERT INTO public.jobs
      (company_id, title, slug, location_city, modality, employment_type, seniority,
       description, requirements, skills, salary_min_clp, salary_max_clp, salary_visible,
       apply_via, status, published_at, expires_at)
    VALUES
    (
      c1, 'Analista de Datos Power BI', 'analista-datos-power-bi-demo', 'Antofagasta', 'hibrido', 'full_time', 'junior',
      E'Somos el equipo de datos de una operación minera de mediana escala. Buscamos un/a analista para mantener y crear dashboards operacionales que usan gerencia y superintendencias cada mañana.\n\n**Qué harás**\n- Construir dashboards en Power BI con datos de producción y mantención\n- Escribir consultas SQL sobre nuestro data warehouse (SQL Server)\n- Automatizar la carga de datos y alertas de desvíos\n\nTrabajamos en ciclos quincenales con demos abiertas: lo que construyes se usa de verdad.',
      ARRAY['Experiencia construyendo dashboards (Power BI o similar)', 'SQL intermedio (JOINs, GROUP BY, window functions básicas)', 'Comunicación con áreas de negocio'],
      ARRAY['power-bi','sql-server','dax','excel'],
      1200000, 1600000, TRUE,
      'plataforma', 'published', NOW() - INTERVAL '2 days', NOW() + INTERVAL '28 days'
    ),
    (
      c1, 'Ingeniero/a de Automatización y ETL', 'ingeniero-etl-demo', 'Antofagasta', 'remoto', 'contrato', 'semi',
      E'Buscamos a alguien para automatizar reportes que hoy se hacen a mano en Excel: consolidar planillas, cruzar APIs internas y dejar todo en tablas confiables.\n\nStack principal: Python (pandas), SQL Server y Power Automate.',
      ARRAY['Python para datos (pandas o similar)', 'SQL sólido', 'Experiencia con Power Automate o herramientas RPA'],
      ARRAY['python','sql-server','power-automate','etl'],
      1800000, 2400000, TRUE,
      'plataforma', 'published', NOW() - INTERVAL '4 days', NOW() + INTERVAL '26 days'
    )
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- ── Empresa demo 2 ──
  INSERT INTO public.employer_companies
    (name, slug, website, industry, description, size, city, country, contact_email, status, owner_user_id)
  VALUES (
    'Banco Analítica (demo)',
    'banco-analitica-demo',
    'https://programbi.com',
    'Servicios financieros',
    'Área de inteligencia de negocio de una institución financiera. Contratamos personas formadas en ProgramBI para el equipo de reporting regulatorio y analítica de riesgo.',
    '500+', 'Santiago', 'Chile', 'contacto@programbi.cl', 'approved', demo_owner
  )
  ON CONFLICT (slug) DO NOTHING
  RETURNING id INTO c2;

  IF c2 IS NOT NULL THEN
    INSERT INTO public.employer_members (company_id, user_id, role)
    VALUES (c2, demo_owner, 'owner')
    ON CONFLICT DO NOTHING;

    INSERT INTO public.jobs
      (company_id, title, slug, location_city, modality, employment_type, seniority,
       description, requirements, benefits, skills, salary_min_clp, salary_max_clp, salary_visible,
       apply_via, status, published_at, expires_at)
    VALUES
    (
      c2, 'Analista de Reporting Senior', 'analista-reporting-senior-demo', 'Santiago', 'presencial', 'full_time', 'senior',
      E'Liderarás la generación de reportes regulatorios y ejecutivos mensuales, con foco en calidad de datos y tiempos de entrega.\n\nIdeal para egresados del programa completo de ProgramBI que ya tienen experiencia en analítica.',
      ARRAY['5+ años en analítica o reporting', 'Power BI avanzado (DAX, modelado)', 'SQL Server avanzado'],
      ARRAY['Salario competitivo', 'Seguro de salud', 'Horario flexible'],
      ARRAY['power-bi','sql-server','dax','excel'],
      2600000, 3200000, TRUE,
      'plataforma', 'published', NOW() - INTERVAL '1 day', NOW() + INTERVAL '29 days'
    ),
    (
      c2, 'Practicante de Ciencia de Datos', 'practicante-ciencia-datos-demo', 'Santiago', 'hibrido', 'practica', 'junior',
      E'Práctica profesional remunerada en el equipo de modelos de riesgo. Aprenderás producción de modelos con acompañamiento de data scientists senior.\n\nPerfecta para estudiantes del curso de Machine Learning de ProgramBI.',
      ARRAY['Conocimientos de Python y estadística', 'Curiosidad por modelos predictivos', 'Disponibilidad 20 h/semana'],
      ARRAY['Remuneración $800.000 CLP', 'Posibilidad de contratación al terminar'],
      ARRAY['python','machine-learning','estadistica'],
      800000, 800000, TRUE,
      'plataforma', 'published', NOW() - INTERVAL '6 hours', NOW() + INTERVAL '30 days'
    )
    ON CONFLICT (slug) DO NOTHING;
  END IF;
END $$;
