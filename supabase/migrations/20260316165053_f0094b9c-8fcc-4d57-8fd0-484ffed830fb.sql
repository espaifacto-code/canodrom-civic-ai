
CREATE TABLE public.civic_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  issue TEXT,
  area TEXT,
  participant TEXT,
  proposal_count INTEGER DEFAULT 0,
  avg_feasibility NUMERIC DEFAULT 0,
  avg_social_impact NUMERIC DEFAULT 0,
  avg_inclusivity NUMERIC DEFAULT 0,
  avg_sustainability NUMERIC DEFAULT 0,
  approved BOOLEAN DEFAULT false,
  ethical_issues_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'pending',
  proposals JSONB,
  scores JSONB,
  ethical_issues JSONB
);

ALTER TABLE public.civic_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access for civic_records"
  ON public.civic_records
  FOR SELECT
  TO anon, authenticated
  USING (true);
