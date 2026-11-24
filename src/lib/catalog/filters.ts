import { brandName, isAvailable, priceRange } from './repository'
import type { AgeStage, Product } from './types'

export type SortKey = 'relevancia' | 'precio-asc' | 'precio-desc' | 'novedades'

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'relevancia', label: 'Más vendidos' },
  { value: 'precio-asc', label: 'Precio: menor a mayor' },
  { value: 'precio-desc', label: 'Precio: mayor a menor' },
  { value: 'novedades', label: 'Novedades' },
]

export interface FilterState {
  q: string
  categories: string[]
  brands: string[]
  sizes: string[]
  ages: AgeStage[]
  inStock: boolean
  priceMin: number | null
  priceMax: number | null
  sort: SortKey
}

export const EMPTY_FILTERS: FilterState = {
  q: '',
  categories: [],
  brands: [],
  sizes: [],
  ages: [],
  inStock: false,
  priceMin: null,
  priceMax: null,
  sort: 'relevancia',
}

export const DIAPER_SIZE_ORDER = ['RN', 'P', 'M', 'G', 'XG', 'XXG']

const normalize = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')

export function matchesQuery(product: Product, q: string): boolean {
  if (!q.trim()) return true
  const hay = normalize(
    [product.name, brandName(product), product.short, product.categoryIds.join(' '), ...product.highlights].join(' '),
  )
  return normalize(q)
    .split(/\s+/)
    .filter(Boolean)
    .every((term) => hay.includes(term))
}

export function applyFilters(list: Product[], f: FilterState): Product[] {
  const out = list.filter((p) => {
    if (!matchesQuery(p, f.q)) return false
    if (f.categories.length && !f.categories.some((c) => p.categoryIds.includes(c))) return false
    if (f.brands.length && !f.brands.includes(p.brandId)) return false
    if (f.sizes.length && !p.variants.some((v) => v.option.name === 'Talle' && f.sizes.includes(v.label))) return false
    if (f.ages.length && !f.ages.some((a) => p.ages.includes(a))) return false
    if (f.inStock && !isAvailable(p)) return false
    const { min } = priceRange(p)
    if (f.priceMin != null && min < f.priceMin) return false
    if (f.priceMax != null && min > f.priceMax) return false
    return true
  })

  const sorted = [...out]
  switch (f.sort) {
    case 'precio-asc':
      sorted.sort((a, b) => priceRange(a).min - priceRange(b).min)
      break
    case 'precio-desc':
      sorted.sort((a, b) => priceRange(b).min - priceRange(a).min)
      break
    case 'novedades':
      sorted.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      break
    default:
      sorted.sort((a, b) => a.rank - b.rank)
  }
  // Los productos sin stock van al final, sin ocultarlos.
  return sorted.sort((a, b) => Number(!isAvailable(a)) - Number(!isAvailable(b)))
}

/* ── Serialización a la URL (filtros compartibles e indexables) ── */

export function filtersFromParams(params: URLSearchParams, base?: Partial<FilterState>): FilterState {
  const list = (k: string) => params.get(k)?.split(',').filter(Boolean) ?? []
  const num = (k: string) => {
    const v = Number(params.get(k))
    return params.has(k) && Number.isFinite(v) ? v : null
  }
  const sort = params.get('orden') as SortKey | null
  return {
    ...EMPTY_FILTERS,
    ...base,
    q: params.get('q') ?? '',
    categories: params.has('categoria') ? list('categoria') : (base?.categories ?? []),
    brands: list('marca'),
    sizes: list('talle'),
    ages: list('edad') as AgeStage[],
    inStock: params.get('stock') === '1',
    priceMin: num('desde'),
    priceMax: num('hasta'),
    sort: sort && SORT_OPTIONS.some((o) => o.value === sort) ? sort : 'relevancia',
  }
}

export function filtersToParams(f: FilterState, lockedCategory?: string): URLSearchParams {
  const p = new URLSearchParams()
  if (f.q) p.set('q', f.q)
  const cats = f.categories.filter((c) => c !== lockedCategory)
  if (cats.length) p.set('categoria', cats.join(','))
  if (f.brands.length) p.set('marca', f.brands.join(','))
  if (f.sizes.length) p.set('talle', f.sizes.join(','))
  if (f.ages.length) p.set('edad', f.ages.join(','))
  if (f.inStock) p.set('stock', '1')
  if (f.priceMin != null) p.set('desde', String(f.priceMin))
  if (f.priceMax != null) p.set('hasta', String(f.priceMax))
  if (f.sort !== 'relevancia') p.set('orden', f.sort)
  return p
}

export function activeFilterCount(f: FilterState, lockedCategory?: string): number {
  return (
    f.categories.filter((c) => c !== lockedCategory).length +
    f.brands.length +
    f.sizes.length +
    f.ages.length +
    (f.inStock ? 1 : 0) +
    (f.priceMin != null || f.priceMax != null ? 1 : 0)
  )
}
