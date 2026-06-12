-- Catalog seed: 14 collections per category, 14 products per collection, 16 brochures
-- Run via: node scripts/seed-catalog.mjs (with service role) or Supabase SQL editor

DO $seed$
DECLARE
  images text[] := ARRAY[
    'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1617104424032-b9bd6972d0e4?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1618219944342-824e40a13285?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80'
  ];
  extra_titles text[] := ARRAY[
    'Atelier Edition', 'Pavilion Series', 'Gallery Reserve', 'Signature Line',
    'Maison Collection', 'Studio Archive', 'Northern Light', 'Desert Bloom'
  ];
  cat record;
  coll_id uuid;
  coll_name text;
  coll_desc text;
  i int;
  j int;
  img_idx int;
BEGIN
  FOR cat IN
    SELECT *
    FROM (VALUES
      ('32d12b0a-bd39-4187-b70c-fb4b2d7472bf'::uuid, 'Wallpapers', 'WP', ARRAY[
        'The Heritage', 'Monolith', 'Savanna', 'Aura', 'Verdant', 'Chroma'
      ], ARRAY[
        'Drawing inspiration from historic archives and classical luxury.',
        'Celebrating brutalist form and architectural simplicity.',
        'Warm, earthy tones inspired by wild grasslands.',
        'Nebula-inspired gradients and cosmic texture prints.',
        'Lush botanicals and detailed jungle foliage layers.',
        'Bold color harmonies and expressive painterly pigments.'
      ]),
      ('8e6826a4-12c9-44b4-9199-d655552e5edc'::uuid, 'Fabrics', 'FB', ARRAY[
        'Classic Linen', 'Silk Velvet', 'Bouclé & Tweed', 'Sheer Drapery', 'Jacquard & Brocade', 'Outdoor Performance'
      ], ARRAY[
        'Relaxed elegance crafted from 100% natural flax fibers.',
        'Opulent heavyweight velvets for dramatic drapery and upholstery.',
        'Richly textured nubby wools and elegant woven blends.',
        'Translucent textiles that softly filter natural light.',
        'Intricately woven classical damasks and raised floral reliefs.',
        'Weatherproof high-end canvas and moisture-resistant structures.'
      ]),
      ('ca531957-0760-4d1b-acde-a7ef9226d6c2'::uuid, 'Posters', 'PT', ARRAY[
        'Architectural Line', 'Botanical Silhouette', 'Abstract Geometry', 'Minimalist Landscape', 'Monochrome Portraits', 'Typography & Grid'
      ], ARRAY[
        'Fine art prints focusing on geometric columns and archways.',
        'Pressed flora and minimalist leafy stencil silhouettes.',
        'Intersecting shapes and neutral color block configurations.',
        'Calming views of coastlines, mountain ranges, and dunes.',
        'Expressive hand-drawn charcoal and ink figure sketches.',
        'Bauhaus and Swiss design inspired typeface arrangements.'
      ]),
      ('c4d402ea-5e2f-4ac6-9af8-68dec3f11d3c'::uuid, 'Wall Coverings', 'WC', ARRAY[
        'Grasscloth Weaves', 'Metallic Foils', 'Wood Veneers', 'Textured Cork', 'Embossed Vinyl', 'Suede & Leather'
      ], ARRAY[
        'Handcrafted natural fiber wallcoverings with organic textures.',
        'Shimmering metallic finishes and textured leaf surfaces.',
        'Genuine ultra-thin wood sheeting displaying natural grains.',
        'Natural sound-dampening cork sheets with metallic accents.',
        'High-durability wallcoverings with deep tactile reliefs.',
        'Ultra-luxurious upholstered panels and leather wall coverings.'
      ])
    ) AS t(category_id, category_name, prefix, base_names, base_descs)
  LOOP
    FOR i IN 1..14 LOOP
      IF i <= array_length(cat.base_names, 1) THEN
        coll_name := cat.base_names[i];
        coll_desc := cat.base_descs[i];
      ELSE
        coll_name := extra_titles[((i - 1) % 8) + 1] || ' ' || ((i - 1) / 8 + 1)::text;
        coll_desc := 'A curated ' || lower(cat.category_name) || ' collection designed for sophisticated interior projects.';
      END IF;

      img_idx := ((i - 1) % array_length(images, 1)) + 1;

      INSERT INTO collections (category_id, name, description, image_url)
      VALUES (cat.category_id, coll_name, coll_desc, images[img_idx])
      RETURNING id INTO coll_id;

      FOR j IN 1..14 LOOP
        img_idx := ((i * 14 + j - 1) % array_length(images, 1)) + 1;
        INSERT INTO products (collection_id, name, description, primary_image)
        VALUES (
          coll_id,
          coll_name || ' Design ' || j,
          'Premium ' || lower(cat.category_name) || ' piece from the ' || coll_name || ' collection.',
          images[img_idx]
        );
      END LOOP;
    END LOOP;
  END LOOP;
END
$seed$;

INSERT INTO brochures (name, description, file_url, image_url)
SELECT
  title,
  'Explore the ' || title || ' — premium Verve catalog and inspiration file.',
  'https://online.fliphtml5.com/pyly/zdhs',
  images[((ord - 1) % array_length(images, 1)) + 1]
FROM unnest(ARRAY[
  'General Brochure',
  'Wallcoverings Brochure',
  'Wallpaper Brochure',
  'Textile Brochure',
  'Contract Brochure',
  'Panoramique Brochure',
  'Outdoor Brochure',
  'Heritage Collection',
  'Monolith Collection',
  'Savanna Collection',
  'Classic Linen Fabrics',
  'Metallic Foils',
  'Architectural Posters',
  'Grasscloth Weaves',
  'Silk Velvet',
  'Embossed Vinyl'
]) WITH ORDINALITY AS t(title, ord)
CROSS JOIN LATERAL (
  SELECT ARRAY[
    'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1617104424032-b9bd6972d0e4?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1618219944342-824e40a13285?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80'
  ]::text[] AS images
) image_pool;
