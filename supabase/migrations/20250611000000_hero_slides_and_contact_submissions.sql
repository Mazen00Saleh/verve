-- Hero slides CMS
CREATE TABLE IF NOT EXISTS public.hero_slides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  left_image_url text NOT NULL,
  right_image_url text NOT NULL,
  link_url text NOT NULL,
  cta_label text NOT NULL DEFAULT 'Explore Collection',
  order_index integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp without time zone DEFAULT now()
);

ALTER TABLE public.hero_slides ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read active hero slides" ON public.hero_slides;
CREATE POLICY "Public read active hero slides"
  ON public.hero_slides
  FOR SELECT
  USING (is_active = true);

DROP POLICY IF EXISTS "Admins manage hero slides" ON public.hero_slides;
CREATE POLICY "Admins manage hero slides"
  ON public.hero_slides
  FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

GRANT SELECT ON public.hero_slides TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.hero_slides TO authenticated;

-- Contact submissions
CREATE TABLE IF NOT EXISTS public.contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'read', 'archived')),
  created_at timestamp without time zone DEFAULT now()
);

ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins read contact submissions" ON public.contact_submissions;
CREATE POLICY "Admins read contact submissions"
  ON public.contact_submissions
  FOR SELECT
  TO authenticated
  USING (is_admin());

DROP POLICY IF EXISTS "Admins update contact submissions" ON public.contact_submissions;
CREATE POLICY "Admins update contact submissions"
  ON public.contact_submissions
  FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

GRANT SELECT, UPDATE ON public.contact_submissions TO authenticated;
