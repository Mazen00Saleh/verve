-- Partner / brand logos
CREATE TABLE IF NOT EXISTS public.brand_logos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  logo_url text NOT NULL,
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamp without time zone DEFAULT now()
);

ALTER TABLE public.brand_logos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read brand logos" ON public.brand_logos;
CREATE POLICY "Public read brand logos"
  ON public.brand_logos
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Admin insert brand logos" ON public.brand_logos;
CREATE POLICY "Admin insert brand logos"
  ON public.brand_logos
  FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

DROP POLICY IF EXISTS "Admin update brand logos" ON public.brand_logos;
CREATE POLICY "Admin update brand logos"
  ON public.brand_logos
  FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

DROP POLICY IF EXISTS "Admin delete brand logos" ON public.brand_logos;
CREATE POLICY "Admin delete brand logos"
  ON public.brand_logos
  FOR DELETE
  TO authenticated
  USING (is_admin());

GRANT SELECT ON public.brand_logos TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.brand_logos TO authenticated;
