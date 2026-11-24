/**
 * Modelo de catálogo.
 *
 * Está pensado para mapear 1:1 con tablas de una base de datos
 * (products, product_variants, categories, brands, packs) cuando
 * se incorpore el panel administrativo. El frontend solo consume
 * estos tipos a través de `repository.ts`, nunca los archivos de datos.
 */

export type Availability = 'in_stock' | 'low_stock' | 'out_of_stock'

export type PackageKind =
  | 'diaperPack'
  | 'pants'
  | 'wipes'
  | 'tube'
  | 'jar'
  | 'pumpBottle'
  | 'bottle'
  | 'feedingBottle'
  | 'box'
  | 'pouch'

/**
 * Describe el empaque para el render 3D y las imágenes generadas.
 * Cuando haya fotos reales, alcanza con completar `images` en el producto.
 */
export interface ProductVisual {
  kind: PackageKind
  /** Color base del empaque */
  color: string
  /** Color de acento (banda, tapa, detalles) */
  accent: string
  /** Fondo de la card / escena */
  backdrop: string
  /** Texto principal impreso en el empaque */
  label: string
  /** Texto secundario impreso */
  sublabel?: string
  /** Tono del texto impreso */
  ink?: 'dark' | 'light'
}

export interface ProductImage {
  src: string
  alt: string
  width: number
  height: number
}

export interface VariantOption {
  /** p. ej. "Talle", "Presentación", "Color" */
  name: string
  value: string
}

export interface ProductVariant {
  id: string
  sku: string
  /** Etiqueta corta visible: "M", "x80", "Salvia" */
  label: string
  /** Detalle: "6 a 10 kg · 44 unidades" */
  detail?: string
  option: VariantOption
  price: number
  /** Precio anterior REAL. Solo completar si hubo un precio previo efectivamente publicado. */
  compareAtPrice?: number
  availability: Availability
  /** Para talles de pañal: rango de peso, se usa en el filtro "Edad / peso" */
  weightRangeKg?: [number, number]
  /** Color de swatch si la variante es un color */
  swatch?: string
}

export interface Product {
  id: string
  slug: string
  name: string
  brandId: string
  categoryIds: string[]
  /** Una línea para la card */
  short: string
  /** Descripción larga para la ficha */
  description: string
  highlights: string[]
  /** Etapas para el filtro de edad */
  ages: AgeStage[]
  variants: ProductVariant[]
  tags: ProductTag[]
  visual: ProductVisual
  /** Fotos reales. Si está vacío se usa el render generado en /public/products/{id}.webp */
  images: ProductImage[]
  /** Posición en "Más vendidos". Solo con datos reales de ventas; en demo es un orden editorial. */
  rank: number
  createdAt: string
  /** true = producto de demostración. Reemplazar antes de vender. */
  demo: boolean
}

export type ProductTag = 'nuevo' | 'destacado' | 'esencial' | 'recien-nacido'

export type AgeStage = '0-3m' | '3-6m' | '6-12m' | '12-24m' | '24m+'

export interface Category {
  id: string
  slug: string
  name: string
  /** Texto corto para cards */
  blurb: string
  /** Contenido SEO de la página de categoría */
  seoTitle: string
  seoDescription: string
  intro: string
  /** Producto cuya imagen representa la categoría */
  heroProductId?: string
  /** Mostrar en la navegación de categorías de la home */
  featured: boolean
  order: number
}

export interface Brand {
  id: string
  name: string
  demo: boolean
}

export interface PackItem {
  productId: string
  variantId: string
  quantity: number
}

export interface Pack {
  id: string
  slug: string
  name: string
  moment: string
  description: string
  items: PackItem[]
  /**
   * Descuento del pack en %. `null` = sin descuento (precio = suma de productos).
   * Configurar solo con una promoción real.
   */
  discountPercent: number | null
  /** Producto cuya imagen ilustra el pack */
  coverProductId: string
  tone: string
}

export const AGE_LABELS: Record<AgeStage, string> = {
  '0-3m': '0 a 3 meses',
  '3-6m': '3 a 6 meses',
  '6-12m': '6 a 12 meses',
  '12-24m': '12 a 24 meses',
  '24m+': 'Más de 2 años',
}

export const AVAILABILITY_LABELS: Record<Availability, string> = {
  in_stock: 'Disponible',
  low_stock: 'Últimas unidades',
  out_of_stock: 'Sin stock',
}
