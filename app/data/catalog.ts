export interface Product {
  id: string
  name: string
  sku: string
  image: string
  description: string
  secondaryImages: string[]
  mockupImages: string[]
}

export interface FeaturedCollection extends Collection {
  categorySlug: string
  categoryTitle: string
}

export interface PublicBrochure {
  id: string
  title: string
  description: string
  fileUrl: string
  date: string
  slug: string
  coverImage: string
}

export interface Collection {
  title: string
  slug: string
  description: string
  longDescription: string
  heroImage: string
  products: Product[]
}

export interface Category {
  title: string
  slug: string
  description: string
  image: string
  collections: Collection[]
}

// Pre-defined high quality interior and texture images from Unsplash
const images = [
  'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1617104424032-b9bd6972d0e4?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1618219944342-824e40a13285?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80'
]

// Help generate unique images for collections and products
const getImage = (index: number) => images[index % images.length]

const rawCatalogData = [
  {
    categoryTitle: 'Wallpapers',
    categorySlug: 'wallpapers',
    categoryDescription: 'A wide range of wallpapers with different designs and colors.',
    categoryImage: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80',
    collections: [
      {
        title: 'The Heritage',
        slug: 'the-heritage',
        description: 'Drawing inspiration from historic archives and classical luxury.',
        longDescription: 'The Heritage collection reinterprets damask patterns, gold accents, and deep jewel tones for modern stately residences. Each design carries the weight of history and the sophistication of modern luxury.',
        productNames: ['Imperial Damask', 'Regal Stripe', 'Gilded Scroll', 'Palace Trellis', 'Fleur De Lis', 'Manor Texture'],
        skuPrefix: 'WP-HR'
      },
      {
        title: 'Monolith',
        slug: 'monolith',
        description: 'Celebrating brutalist form and architectural simplicity.',
        longDescription: 'Monolith presents stone-like textures, matte plaster finishes, and structured geometric block prints. A collection for minimalist environments that demand powerful texture and form.',
        productNames: ['Brutalist Block', 'Matte Plaster', 'Structured Slate', 'Basalt Column', 'Obsidian Slab', 'Concrete Veil'],
        skuPrefix: 'WP-MN'
      },
      {
        title: 'Savanna',
        slug: 'savanna',
        description: 'Warm, earthy tones and patterns inspired by wild grasslands.',
        longDescription: 'Capturing the raw beauty of dry grasslands, sun-baked clay, and organic wild fauna silhouettes. Bring the soft, warm golden glow of the Savanna sunset directly to your walls.',
        productNames: ['Desert Dune', 'Safari Palm', 'Oasis Stripe', 'Acacia Bark', 'Serengeti Clay', 'Sunset Horizon'],
        skuPrefix: 'WP-SV'
      },
      {
        title: 'Aura',
        slug: 'aura',
        description: 'Nebula-inspired gradients and cosmic texture prints.',
        longDescription: 'Exploring soft color blends, stardust glimmers, and gaseous sky gradients. Aura wallcoverings bring an ethereal atmospheric presence into contemporary hospitality and residential projects.',
        productNames: ['Nebula Mist', 'Solar Flare', 'Cosmic Dust', 'Lunar Eclipse', 'Stardust Weave', 'Aurora Glow'],
        skuPrefix: 'WP-AU'
      },
      {
        title: 'Verdant',
        slug: 'verdant',
        description: 'Lush botanicals and detailed jungle foliage layers.',
        longDescription: 'A deep-dive into tropical glasshouses and native forest canopies. Features large-scale palm prints, intricate fern line drawings, and moss-green structural backgrounds.',
        productNames: ['Forest Canopy', 'Fern Silhouette', 'Mossy Glade', 'Ivy Trellis', 'Jungle Leaf', 'Woodland Fern'],
        skuPrefix: 'WP-VR'
      },
      {
        title: 'Chroma',
        slug: 'chroma',
        description: 'Bold color harmonies and expressive painterly pigments.',
        longDescription: 'Designed for spaces that refuse to be quiet. Chroma features paint-brush sweeps, rich multi-colored splash panels, and sophisticated pigment palettes that act as standalone art installations.',
        productNames: ['Crimson Tide', 'Cobalt Wave', 'Amber Glow', 'Emerald Depth', 'Indigo Shade', 'Saffron Hue'],
        skuPrefix: 'WP-CH'
      }
    ]
  },
  {
    categoryTitle: 'Fabrics',
    categorySlug: 'fabrics',
    categoryDescription: 'A wide range of fabrics with different designs and colors.',
    categoryImage: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1200&q=80',
    collections: [
      {
        title: 'Classic Linen',
        slug: 'classic-linen',
        description: 'Relaxed elegance crafted from 100% natural flax fibers.',
        longDescription: 'Woven with organic texture, Classic Linen offers lightweight breathing fabrics for luxury curtains, soft upholstery, and premium custom cushions.',
        productNames: ['Pure Flax Weave', 'Oatmeal Twill', 'Warm Ochre Linen', 'Natural Stone Linen', 'Sage Linen', 'Indigo Thread Linen'],
        skuPrefix: 'FB-LN'
      },
      {
        title: 'Silk Velvet',
        slug: 'silk-velvet',
        description: 'Opulent heavyweight velvets for dramatic drapery and upholstery.',
        longDescription: 'Featuring a dense pile and rich lustre, our Silk Velvet collection represents the pinnacle of tactile luxury. Brings depth and light-catching elegance to spaces.',
        productNames: ['Royal Emerald Velvet', 'Amber Sheen Velvet', 'Plum Velvet', 'Slate Grey Velvet', 'Midnight Blue Velvet', 'Rose Velvet'],
        skuPrefix: 'FB-VV'
      },
      {
        title: 'Bouclé & Tweed',
        slug: 'boucle-tweed',
        description: 'Richly textured nubby wools and elegant woven blends.',
        longDescription: 'Cozy and sophisticated fabrics that emphasize weight and dimensional texture. Perfect for soft organic sofas, sculptural chairs, and statement headboards.',
        productNames: ['Cream Bouclé', 'Charcoal Tweed', 'Hazelnut Slub', 'Ivory Loop', 'Taupe Blend', 'Sesame Weave'],
        skuPrefix: 'FB-BT'
      },
      {
        title: 'Sheer Drapery',
        slug: 'sheer-drapery',
        description: 'Translucent, delicate textiles that softly filter natural light.',
        longDescription: 'A collection of lightweight cottons, linens, and fine organzas designed for sweeping floor-to-ceiling windows. Brings an airy, cloud-like softness to any room.',
        productNames: ['Mist Organza', 'Alabaster Voile', 'Sand Batiste', 'Parchment Gauze', 'Pearly Chiffon', 'Frost Netting'],
        skuPrefix: 'FB-SD'
      },
      {
        title: 'Jacquard & Brocade',
        slug: 'jacquard-brocade',
        description: 'Intricately woven classical damasks and raised floral reliefs.',
        longDescription: 'Heavyweight decorative textiles crafted on advanced jacquard looms. Perfect for structural wall panels, majestic bedspreads, and dining room seat pads.',
        productNames: ['Gilded Tapestry', 'Baroque Brocade', 'Damask Jacquard', 'Medallion Weave', 'Vine Tendril', 'Florentine Scroll'],
        skuPrefix: 'FB-JB'
      },
      {
        title: 'Outdoor Performance',
        slug: 'outdoor-performance',
        description: 'Weatherproof high-end canvas and moisture-resistant structures.',
        longDescription: 'Sophisticated outdoor living requires matching textiles. UV-resistant, stain-repellent, and luxurious to the touch—engineered to perform without sacrificing style.',
        productNames: ['Sailcloth White', 'Stripe Horizon', 'Silt Grey Canvas', 'Terracotta Linen', 'Navy Cordage', 'Moss Stripe'],
        skuPrefix: 'FB-OP'
      }
    ]
  },
  {
    categoryTitle: 'Posters',
    categorySlug: 'posters',
    categoryDescription: 'A wide range of posters with different designs and colors.',
    categoryImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    collections: [
      {
        title: 'Architectural Line',
        slug: 'architectural-line',
        description: 'Fine art prints focusing on geometric columns and archways.',
        longDescription: 'A minimalist print collection exploring the play of shadow on classic architectural columns and curved entryways. Perfect for styling editorial gallery walls.',
        productNames: ['Column Study I', 'Archway Study II', 'Façade Blueprint III', 'Dome Perspective IV', 'Pillar Elevation V', 'Corinthian Detail VI'],
        skuPrefix: 'PT-AR'
      },
      {
        title: 'Botanical Silhouette',
        slug: 'botanical-silhouette',
        description: 'Pressed flora and minimalist leafy stencil silhouettes.',
        longDescription: 'Quiet graphic prints illustrating leaf structures, skeletal trees, and wildflower shadows. Hand-drawn prints on thick linen-texture cotton stock.',
        productNames: ['Eucalyptus Stem', 'Fern Leaf', 'Palm Frond', 'Olive Branch', 'Monstera Leaf', 'Ginkgo Sprig'],
        skuPrefix: 'PT-BT'
      },
      {
        title: 'Abstract Geometry',
        slug: 'abstract-geometry',
        description: 'Intersecting shapes and neutral color block configurations.',
        longDescription: 'Exploring mid-century modernist forms, earthy clay circles, and textured brush strokes. An ideal print collection to balance clean lines in modern apartments.',
        productNames: ['Sphere and Plane', 'Intersecting Arcs', 'Textured Arc', 'Linear Horizon', 'Terrazzo Collage', 'Brutalist Shapes'],
        skuPrefix: 'PT-AG'
      },
      {
        title: 'Minimalist Landscape',
        slug: 'minimalist-landscape',
        description: 'Calming views of coastlines, mountain ranges, and dunes.',
        longDescription: 'Art photography focusing on vast, peaceful horizons. Quiet dunes, soft ocean fog, and snowy mountain ridges bring space and stillness to busy urban homes.',
        productNames: ['Quiet Coastline', 'Misty Ridges', 'Sienna Hills', 'Arctic Silence', 'Desert Dusk', 'Solitary Pine'],
        skuPrefix: 'PT-ML'
      },
      {
        title: 'Monochrome Portraits',
        slug: 'monochrome-portraits',
        description: 'Expressive hand-drawn charcoal and ink figure sketches.',
        longDescription: 'Elegant, single-line ink drawings and deep charcoal gesture studies representing the classic human silhouette. Balanced on structured cream-toned backings.',
        productNames: ['Shaded Profile', 'Contour Gesture', 'Classical Bust', 'Sculptural Hand', 'Pensive Pose', 'Minimalist Figure'],
        skuPrefix: 'PT-MP'
      },
      {
        title: 'Typography & Grid',
        slug: 'typography-grid',
        description: 'Bauhaus and Swiss design inspired typeface arrangements.',
        longDescription: 'A poster collection celebrating type and graphic systems. Clean layouts, mathematical alignment, and bold character details for home office spaces.',
        productNames: ['Helvetica Study', 'Bauhaus Form', 'Swiss Grid I', 'Serif Character', 'Type Hierarchy', 'Abstract Numeral'],
        skuPrefix: 'PT-TG'
      }
    ]
  },
  {
    categoryTitle: 'Wallcoverings',
    categorySlug: 'wallcoverings',
    categoryDescription: 'A wide range of wallcoverings with different designs and colors.',
    categoryImage: 'https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?auto=format&fit=crop&w=1200&q=80',
    collections: [
      {
        title: 'Grasscloth Weaves',
        slug: 'grasscloth-weaves',
        description: 'Handcrafted natural fiber wallcoverings with organic textures.',
        longDescription: 'Sourced from renewable natural grasses, woven by master artisans, and laminated onto premium paper. Gives walls an unmatched warmth and architectural depth.',
        productNames: ['Natural Sisal Weave', 'Golden Jute Weave', 'Silver Abaca Weave', 'Copper Seagrass', 'Charcoal Arrowroot', 'Ivory Raffia'],
        skuPrefix: 'WC-GC'
      },
      {
        title: 'Metallic Foils',
        slug: 'metallic-foils',
        description: 'Shimmering metallic finishes and textured leaf surfaces.',
        longDescription: 'Add reflective drama to statement spaces. Our Metallic Foils capture and warm up natural light with delicate leafing overlays and textured grid patterns.',
        productNames: ['Bronze Leaf', 'Platinum Grid', 'Burnished Copper', 'Gilded Texture', 'Silver Leafing', 'Antique Brass Foil'],
        skuPrefix: 'WC-MF'
      },
      {
        title: 'Wood Veneers',
        slug: 'wood-veneers',
        description: 'Genuine ultra-thin wood sheeting displaying natural grains.',
        longDescription: 'Brings the natural, comforting presence of raw forests indoors. Perfectly sliced walnut, ash, and oak veneers structured onto flexible wall backings.',
        productNames: ['Sliced Walnut', 'Quartered Oak', 'Ebonized Ash', 'Bleached Maple', 'Rustic Cherry', 'Smoked Larch'],
        skuPrefix: 'WC-WV'
      },
      {
        title: 'Textured Cork',
        slug: 'textured-cork',
        description: 'Natural sound-dampening cork sheets with metallic accents.',
        longDescription: 'Sustainability meets architectural design. Organic cork bark sheets combined with subtle silver and gold metallic flakes for sound absorption and visual charm.',
        productNames: ['Natural Cork Bark', 'Sienna Cork Tile', 'Gilded Cork Sheet', 'Flecked Charcoal Cork', 'Oatmeal Cork', 'Bronze Cork Weave'],
        skuPrefix: 'WC-TC'
      },
      {
        title: 'Embossed Vinyl',
        slug: 'embossed-vinyl',
        description: 'High-durability wallcoverings with deep tactile reliefs.',
        longDescription: 'Perfect for busy commercial spaces and hotels. Water-resistant, scrubbable vinyl textured to perfectly mimic industrial plaster, fine woven linen, and concrete.',
        productNames: ['Chevron Plaster', 'Linear Striae', 'Pebbled Shagreen', 'Waffle Weave', 'Hammered Metal', 'Washed Concrete'],
        skuPrefix: 'WC-EV'
      },
      {
        title: 'Suede & Leather',
        slug: 'suede-leather',
        description: 'Ultra-luxurious upholstered panels and leather wall coverings.',
        longDescription: 'Soft-touch suede and grain leather panels create cozy acoustic chambers. Brings a tactile and rich leather scent and appearance to libraries and master bedrooms.',
        productNames: ['Camel Suede Panel', 'Slate Grey Nubuck', 'Tuscan Tan Leather', 'Espresso Pebble', 'Ivory Velvet Suede', 'Charcoal Nappa'],
        skuPrefix: 'WC-SL'
      }
    ]
  }
]

export const categories: Category[] = rawCatalogData.map((cat, catIdx) => {
  return {
    title: cat.categoryTitle,
    slug: cat.categorySlug,
    description: cat.categoryDescription,
    image: cat.categoryImage,
    collections: cat.collections.map((coll, collIdx) => {
      const collectionImgIdx = (catIdx * 6) + collIdx
      const heroImage = getImage(collectionImgIdx + 8)
      
      const products: Product[] = coll.productNames.map((pName, pIdx) => {
        const productImgIdx = (collectionImgIdx * 6) + pIdx
        return {
          id: `${cat.categorySlug}-${coll.slug}-${pIdx}`,
          name: pName,
          sku: `${coll.skuPrefix}-${1001 + pIdx}`,
          image: getImage(productImgIdx),
          description: coll.longDescription,
          secondaryImages: [],
          mockupImages: [],
        }
      })
      
      return {
        title: coll.title,
        slug: coll.slug,
        description: coll.description,
        longDescription: coll.longDescription,
        heroImage,
        products
      }
    })
  }
})
