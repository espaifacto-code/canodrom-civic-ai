-- Tabla: form_responses
-- Mapea directamente las respuestas del formulario Tally del Workshop Canodrom

CREATE TABLE public.form_responses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- Pregunta 1: 3 efectos más preocupantes (array de strings)
  top_effects TEXT[] DEFAULT '{}',

  -- Pregunta 2: Relevancia de ejes (1-5)
  relevance_digital_platforms   NUMERIC,
  relevance_political_framework NUMERIC,
  relevance_data_transparency   NUMERIC,
  relevance_proximity_economy   NUMERIC,
  relevance_environmental_impact NUMERIC,
  relevance_right_to_city       NUMERIC,

  -- Pregunta 3: Propuesta abierta
  proposal_idea TEXT,

  -- Pregunta 4: Actores relevantes (array)
  relevant_actors TEXT[] DEFAULT '{}',

  -- Pregunta 5: Buenas prácticas
  good_practices TEXT,

  -- Metadata
  tally_response_id TEXT,
  processed BOOLEAN DEFAULT false
);

ALTER TABLE public.form_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read" ON public.form_responses
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Public insert" ON public.form_responses
  FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Public update" ON public.form_responses
  FOR UPDATE TO anon, authenticated USING (true);
