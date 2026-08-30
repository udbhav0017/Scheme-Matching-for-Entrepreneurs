CREATE TABLE public.schemes (
  id text PRIMARY KEY,
  name text NOT NULL,
  name_hi text NOT NULL,
  ministry text NOT NULL,
  summary text NOT NULL,
  summary_hi text NOT NULL,
  categories text[] NOT NULL DEFAULT '{}',
  sectors text[] NOT NULL DEFAULT '{}',
  states text[] NOT NULL DEFAULT '{}',
  max_income bigint NOT NULL,
  min_loan bigint NOT NULL,
  max_loan bigint NOT NULL,
  subsidy_rate numeric NOT NULL,
  subsidy_cap bigint NOT NULL,
  documents text[] NOT NULL DEFAULT '{}',
  apply_url text NOT NULL,
  apply_steps text[] NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.schemes TO anon;
GRANT SELECT ON public.schemes TO authenticated;
GRANT ALL ON public.schemes TO service_role;

ALTER TABLE public.schemes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Schemes are publicly readable"
  ON public.schemes FOR SELECT
  TO anon, authenticated
  USING (true);