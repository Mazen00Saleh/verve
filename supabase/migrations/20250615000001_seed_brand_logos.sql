-- Seed existing partner logos from the static catalog
INSERT INTO public.brand_logos (name, logo_url, order_index)
SELECT name, logo_url, order_index
FROM (VALUES
  ('D&G', '/images/brands/d-g.webp', 0),
  ('ARMANI/CASA', '/images/brands/armani-casa.webp', 1),
  ('Baker Lifestyle', '/images/brands/baker-lifestyle.webp', 2),
  ('BLACK edition', '/images/brands/black-edition.webp', 3),
  ('CAMENGO', '/images/brands/camengo.webp', 4),
  ('CASADECO', '/images/brands/casadeco.webp', 5),
  ('CASAMANCE', '/images/brands/casamance.webp', 6),
  ('JV ITALIAN DESIGN', '/images/brands/jv-italian-design.webp', 7),
  ('MISSONI HOME', '/images/brands/missoni-home.webp', 8),
  ('omexco', '/images/brands/omexco.webp', 9),
  ('PHILLIP JEFFRIES', '/images/brands/phillip-jeffries.webp', 10),
  ('PIERRE FREY', '/images/brands/pierre-frey.webp', 11),
  ('pt', '/images/brands/pt.webp', 12),
  ('RUBELLI', '/images/brands/rubelli.webp', 13),
  ('SAHCO', '/images/brands/sahco.webp', 14),
  ('SAMUEL & SONS', '/images/brands/samuel-and-sons.webp', 15),
  ('zinc textile', '/images/brands/zinc-textile.webp', 16),
  ('ZOFFANY', '/images/brands/zoffany.webp', 17),
  ('HOULES', '/images/brands/houles.webp', 18),
  ('kravet', '/images/brands/kravet.webp', 19)
) AS seed(name, logo_url, order_index)
WHERE NOT EXISTS (
  SELECT 1 FROM public.brand_logos
);
