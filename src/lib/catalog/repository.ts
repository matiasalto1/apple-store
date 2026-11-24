/**
 * Capa de acceso al catálogo.
 *
 * Hoy lee datos estáticos (./data). Para conectar una base de datos o un
 * panel administrativo, implementá `CatalogRepository` con otra fuente
 * (Postgres, Supabase, un CMS…) y exportala como `catalog`.
 * El resto del frontend no cambia.
 */
import { brands } from './data/brands'
import { categories } from './data/categories'
import { packs } from './data/packs'
import { products } from './data/products'
import type { Brand, Category, Pack, Product, ProductImage, ProductVariant } from './types'

export interface CatalogRepository {
  listProducts(): Product[]
  getProductBySlug(slug: string): Product | undefined
  getProductById(id: string): Product | undefined
  listCategories(): Category[]
  getCategoryBySlug(slug: string): Category | undefined
  listBrands(): Brand[]
  getBrand(id: string): Brand | undefined
  listPacks(): Pack[]
}

const byId = new Map(products.map((p) => [p.id, p]))
const bySlug = new Map(products.map((p) => [p.slug, p]))

export const catalog: CatalogRepository = {
  listProducts: () => products,
  getProductBySlug: (slug) => bySlug.get(slug),
  getProductById: (id) => byId.get(id),
  listCategories: () => [...categories].sort((a, b) => a.order - b.order),
  getCategoryBySlug: (slug) => categories.find((c) => c.slug === slug),
  listBrands: () => brands,
  getBrand: (id) => brands.find((b) => b.id === id),
  listPacks: () => packs,
}

/* ───────────── helpers derivados ───────────── */

export function getVariant(product: Product, variantId?: string): ProductVariant {
  return product.variants.find((v) => v.id === variantId) ?? defaultVariant(product)
}

/** Primera variante disponible (o la primera si no hay stock). */
export function defaultVariant(product: Product): ProductVariant {
  return product.variants.find((v) => v.availability !== 'out_of_stock') ?? product.variants[0]
}

export function priceRange(product: Product): { min: number; max: number } {
  const prices = product.variants.map((v) => v.price)
  return { min: Math.min(...prices), max: Math.max(...prices) }
}

export function isOnSale(product: Product): boolean {
  return product.variants.some((v) => v.compareAtPrice && v.compareAtPrice > v.price)
}

export function isAvailable(product: Product): boolean {
  return product.variants.some((v) => v.availability !== 'out_of_stock')
}

/** Imagen principal: foto real si existe; si no, el render generado del empaque. */
export function primaryImage(product: Product): ProductImage {
  return (
    product.images[0] ?? {
      src: `/products/${product.id}.webp`,
      alt: `${brandName(product)} ${product.name}`,
      width: 1200,
      height: 1200,
    }
  )
}

export function brandName(product: Product): string {
  return catalog.getBrand(product.brandId)?.name ?? ''
}

export function productsInCategory(categoryId: string): Product[] {
  if (categoryId === 'ofertas') return products.filter(isOnSale)
  return products.filter((p) => p.categoryIds.includes(categoryId))
}

export function packTotals(pack: Pack) {
  let subtotal = 0
  const lines = pack.items.flatMap((item) => {
    const product = byId.get(item.productId)
    if (!product) return []
    const variant = getVariant(product, item.variantId)
    subtotal += variant.price * item.quantity
    return [{ product, variant, quantity: item.quantity }]
  })
  const discount = pack.discountPercent ? Math.round((subtotal * pack.discountPercent) / 100) : 0
  return { lines, subtotal, discount, total: subtotal - discount }
}

export const catalogIsDemo = products.some((p) => p.demo)

// Chequeo de integridad en desarrollo: packs que apuntan a variantes inexistentes.
if (process.env.NODE_ENV !== 'production') {
  for (const pack of packs) {
    for (const item of pack.items) {
      const p = byId.get(item.productId)
      if (!p || !p.variants.some((v) => v.id === item.variantId)) {
        console.warn(`[catalog] El pack "${pack.id}" referencia ${item.productId}/${item.variantId}, que no existe.`)
      }
    }
  }
}
