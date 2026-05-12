-- Seed: form_responses — Workshop Canodrom
-- Ejecutar en Supabase SQL Editor para probar el dashboard

INSERT INTO public.form_responses (
  top_effects,
  relevance_digital_platforms, relevance_political_framework, relevance_data_transparency,
  relevance_proximity_economy, relevance_environmental_impact, relevance_right_to_city,
  proposal_idea, relevant_actors, good_practices
) VALUES
(
  ARRAY['Vivienda', 'Identidad', 'Derecho a la ciudad'],
  4, 3, 4, 5, 3, 5,
  'Regular los pisos turísticos con cuotas por barrio y reinvertir las tasas en vivienda social para residentes históricos.',
  ARRAY['Administración', 'Ciudadanía'],
  'Amsterdam limitó los días de alquiler turístico a 30 al año por piso.'
),
(
  ARRAY['Espacio público', 'Ruido', 'Transporte'],
  3, 4, 5, 3, 4, 4,
  'Crear franjas horarias en las plazas para uso preferente de vecinos, especialmente por las mañanas.',
  ARRAY['Administración', 'Ciudadanía'],
  'Venecia tiene acceso controlado al centro histórico en temporada alta.'
),
(
  ARRAY['Vivienda', 'Comercio local', 'Identidad'],
  5, 4, 3, 5, 2, 4,
  'Proteger el comercio de proximidad con contratos de alquiler de larga duración y precios regulados.',
  ARRAY['Administración', 'Empresas'],
  'El Poblenou tiene un plan de protección del tejido comercial local.'
),
(
  ARRAY['Derecho a la ciudad', 'Vivienda', 'Transporte'],
  4, 5, 4, 4, 3, 5,
  'Necesitamos una moratoria de nuevos hoteles en zonas ya saturadas como Gòtic y Barceloneta.',
  ARRAY['Administración'],
  'Barcelona ya declaró la Barceloneta zona de alta tensión residencial.'
),
(
  ARRAY['Identidad', 'Comercio local', 'Limpieza'],
  3, 3, 4, 5, 4, 4,
  'Crear un sello de "Comerç de Barri" con visibilidad en apps turísticas para apoyar el comercio local.',
  ARRAY['Empresas', 'Ciudadanía', 'Academia'],
  NULL
),
(
  ARRAY['Ruido', 'Espacio público', 'Derecho a la ciudad'],
  4, 4, 3, 3, 5, 5,
  'Zonas de silencio nocturno con mediación activa en los barrios más afectados por el ocio nocturno.',
  ARRAY['Administración', 'Ciudadanía'],
  'El barrio del Raval tiene una red de mediación vecinal activa.'
),
(
  ARRAY['Recursos', 'Limpieza', 'Transporte'],
  3, 4, 5, 4, 5, 3,
  'Tasa ambiental por pernoctación turística destinada a limpieza y gestión de residuos en zonas saturadas.',
  ARRAY['Administración', 'Empresas'],
  'Baleares aplica un ecotax que financia proyectos ambientales.'
),
(
  ARRAY['Trabajo', 'Derecho a la ciudad', 'Vivienda'],
  4, 5, 4, 4, 3, 5,
  'El turismo debe generar empleos dignos. Necesitamos un sello de turismo justo con auditorías laborales.',
  ARRAY['Empresas', 'Academia', 'Administración'],
  NULL
);
