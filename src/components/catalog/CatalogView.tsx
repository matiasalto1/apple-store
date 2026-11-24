'use client'

import { AnimatePresence, motion } from 'motion/react'
import { SlidersHorizontal, X } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useMemo, useState, useTransition } from 'react'
import {
  activeFilterCount,
  applyFilters,
  EMPTY_FILTERS,
  filtersFromParams,
  filtersToParams,
  SORT_OPTIONS,
  type FilterState,
  type SortKey,
} from '@/lib/catalog/filters'
import { catalog } from '@/lib/catalog/repository'
import { AGE_LABELS, type Product } from '@/lib/catalog/types'
import { ProductCard } from '@/components/product/ProductCard'
import { Overlay } from '@/components/ui/Overlay'
import { ProductFilters } from './ProductFilters'

export function CatalogView({ scope, lockedCategory }: { scope: Product[]; lockedCategory?: string }) {
  const params = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const [, startTransition] = useTransition()
  const [sheet, setSheet] = useState(false)

  const filters = useMemo(() => filtersFromParams(new URLSearchParams(params.toString())), [params])
  const results = useMemo(() => applyFilters(scope, filters), [scope, filters])
  const active = activeFilterCount(filters, lockedCategory)

  const update = (next: FilterState) => {
    const qs = filtersToParams(next, lockedCategory).toString()
    startTransition(() => router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false }))
  }

  const chips: { key: string; label: string; next: FilterState }[] = [
    ...(filters.q ? [{ key: 'q', label: `“${filters.q}”`, next: { ...filters, q: '' } }] : []),
    ...(filters.inStock ? [{ key: 'stock', label: 'Con stock', next: { ...filters, inStock: false } }] : []),
    ...filters.categories.map((c) => ({
      key: `c-${c}`,
      label: catalog.getCategoryBySlug(c)?.name ?? c,
      next: { ...filters, categories: filters.categories.filter((x) => x !== c) },
    })),
    ...filters.sizes.map((s) => ({ key: `s-${s}`, label: `Talle ${s}`, next: { ...filters, sizes: filters.sizes.filter((x) => x !== s) } })),
    ...filters.ages.map((a) => ({ key: `a-${a}`, label: AGE_LABELS[a], next: { ...filters, ages: filters.ages.filter((x) => x !== a) } })),
    ...filters.brands.map((b) => ({
      key: `b-${b}`,
      label: catalog.getBrand(b)?.name ?? b,
      next: { ...filters, brands: filters.brands.filter((x) => x !== b) },
    })),
    ...(filters.priceMin != null || filters.priceMax != null
      ? [{ key: 'price', label: 'Precio', next: { ...filters, priceMin: null, priceMax: null } }]
      : []),
  ]

  const clear = () => update({ ...EMPTY_FILTERS, sort: filters.sort })

  return (
    <div className="grid gap-10 lg:grid-cols-[16rem_1fr] xl:grid-cols-[17rem_1fr]">
      <aside className="hidden lg:block" aria-label="Filtros">
        <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pb-10 pr-2" data-lenis-prevent="">
          <ProductFilters scope={scope} value={filters} onChange={update} showCategories={!lockedCategory} />
        </div>
      </aside>

      <div>
        <div className="sticky top-[4.25rem] z-20 -mx-4 mb-6 flex items-center justify-between gap-3 border-b hairline bg-paper/85 px-4 py-3 backdrop-blur-md sm:-mx-7 sm:px-7 lg:static lg:mx-0 lg:border-0 lg:bg-transparent lg:px-0 lg:py-0 lg:backdrop-blur-none">
          <button type="button" className="chip bg-white lg:hidden" onClick={() => setSheet(true)}>
            <SlidersHorizontal size={16} /> Filtrar{active > 0 && <span className="ml-0.5 rounded-full bg-ink px-1.5 text-[0.75rem] text-paper">{active}</span>}
          </button>
          <p className="hidden text-[0.875rem] text-stone lg:block" aria-live="polite">
            {results.length} {results.length === 1 ? 'producto' : 'productos'}
          </p>
          <label className="flex items-center gap-2 text-[0.875rem]">
            <span className="hidden text-stone sm:inline">Ordenar por</span>
            <select
              value={filters.sort}
              onChange={(e) => update({ ...filters, sort: e.target.value as SortKey })}
              className="h-10 rounded-full border border-[var(--line-strong)] bg-white pl-4 pr-8 text-[0.875rem] font-medium"
              aria-label="Ordenar productos"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        {chips.length > 0 && (
          <div className="mb-8 flex flex-wrap items-center gap-2">
            {chips.map((c) => (
              <button key={c.key} type="button" onClick={() => update(c.next)} className="chip h-9 min-h-9 bg-white text-[0.8125rem]" aria-label={`Quitar filtro ${c.label}`}>
                {c.label} <X size={14} />
              </button>
            ))}
            <button type="button" onClick={clear} className="ml-1 text-[0.8125rem] font-semibold underline">
              Limpiar todo
            </button>
          </div>
        )}

        {results.length === 0 ? (
          <div className="rounded-[var(--radius-card)] bg-ivory px-6 py-16 text-center">
            <p className="font-display text-[1.75rem]">
              {lockedCategory === 'ofertas' && !active ? 'No hay ofertas activas en este momento.' : 'No hay productos con estos filtros.'}
            </p>
            <p className="mx-auto mt-3 max-w-md text-ink-soft">
              {lockedCategory === 'ofertas' && !active
                ? 'Cuando haya promociones vigentes van a aparecer acá automáticamente.'
                : 'Probá quitando algún filtro o buscá en todo el catálogo.'}
            </p>
            {active > 0 && (
              <button type="button" onClick={clear} className="btn btn-primary mt-6">
                Limpiar filtros
              </button>
            )}
          </div>
        ) : (
          <motion.ul layout className="grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-5 md:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4">
            <AnimatePresence initial={false} mode="popLayout">
              {results.map((p, i) => (
                <motion.li
                  key={p.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="flex"
                >
                  <ProductCard product={p} priority={i < 4} className="w-full" />
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ul>
        )}
      </div>

      <Overlay open={sheet} onClose={() => setSheet(false)} label="Filtros" side="center">
        <div className="flex max-h-[92dvh] flex-col">
          <div className="flex items-center justify-between border-b hairline px-5 py-4">
            <h2 className="font-display text-[1.5rem]">Filtrar</h2>
            <button type="button" className="icon-btn -mr-2" onClick={() => setSheet(false)} aria-label="Cerrar filtros">
              <X size={20} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-5 pt-6" data-lenis-prevent="">
            <ProductFilters scope={scope} value={filters} onChange={update} showCategories={!lockedCategory} />
          </div>
          <div className="flex gap-3 border-t hairline px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4">
            <button type="button" onClick={clear} className="btn btn-ghost flex-1">
              Limpiar
            </button>
            <button type="button" onClick={() => setSheet(false)} className="btn btn-primary flex-[2]">
              Ver {results.length} {results.length === 1 ? 'producto' : 'productos'}
            </button>
          </div>
        </div>
      </Overlay>
    </div>
  )
}
