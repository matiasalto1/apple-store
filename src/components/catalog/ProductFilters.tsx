'use client'

import { Check } from 'lucide-react'
import { useId } from 'react'
import { DIAPER_SIZE_ORDER, type FilterState } from '@/lib/catalog/filters'
import { catalog, priceRange } from '@/lib/catalog/repository'
import { AGE_LABELS, type AgeStage, type Product } from '@/lib/catalog/types'
import { cn, formatPrice } from '@/lib/format'

export const PRICE_BUCKETS: { label: string; min: number | null; max: number | null }[] = [
  { label: `Hasta ${formatPrice(10000)}`, min: null, max: 10000 },
  { label: `${formatPrice(10000)} a ${formatPrice(25000)}`, min: 10000, max: 25000 },
  { label: `${formatPrice(25000)} a ${formatPrice(40000)}`, min: 25000, max: 40000 },
  { label: `Más de ${formatPrice(40000)}`, min: 40000, max: null },
]

function toggle<T>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((x) => x !== value) : [...list, value]
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  const id = useId()
  return (
    <div role="group" aria-labelledby={id} className="border-b hairline py-6 first:pt-0">
      <p id={id} className="eyebrow mb-3 text-stone">
        {title}
      </p>
      {children}
    </div>
  )
}

function CheckRow({ checked, onChange, label, count }: { checked: boolean; onChange: () => void; label: string; count?: number }) {
  return (
    <label className="flex min-h-10 cursor-pointer items-center gap-3 text-[0.9375rem]">
      <input type="checkbox" className="peer sr-only" checked={checked} onChange={onChange} />
      <span
        className={cn(
          'grid h-5 w-5 shrink-0 place-items-center rounded-md border transition peer-focus-visible:ring-2 peer-focus-visible:ring-accent',
          checked ? 'border-ink bg-ink text-paper' : 'border-[var(--line-strong)] bg-white',
        )}
      >
        {checked && <Check size={13} strokeWidth={3} />}
      </span>
      <span className="flex-1">{label}</span>
      {count != null && <span className="text-[0.8125rem] text-stone">{count}</span>}
    </label>
  )
}

export function ProductFilters({
  scope,
  value,
  onChange,
  showCategories,
}: {
  scope: Product[]
  value: FilterState
  onChange: (f: FilterState) => void
  showCategories: boolean
}) {
  const categories = catalog
    .listCategories()
    .filter((c) => c.id !== 'ofertas')
    .map((c) => ({ ...c, count: scope.filter((p) => p.categoryIds.includes(c.id)).length }))
    .filter((c) => c.count > 0)
  const brands = catalog
    .listBrands()
    .map((b) => ({ ...b, count: scope.filter((p) => p.brandId === b.id).length }))
    .filter((b) => b.count > 0)
  const sizes = DIAPER_SIZE_ORDER.filter((s) => scope.some((p) => p.variants.some((v) => v.option.name === 'Talle' && v.label === s)))
  const ages = (Object.keys(AGE_LABELS) as AgeStage[]).filter((a) => scope.some((p) => p.ages.includes(a)))
  const prices = PRICE_BUCKETS.filter((b) =>
    scope.some((p) => {
      const m = priceRange(p).min
      return (b.min == null || m >= b.min) && (b.max == null || m <= b.max)
    }),
  )

  return (
    <div>
      <Group title="Disponibilidad">
        <CheckRow checked={value.inStock} onChange={() => onChange({ ...value, inStock: !value.inStock })} label="Solo con stock" />
      </Group>

      {showCategories && categories.length > 1 && (
        <Group title="Categoría">
          {categories.map((c) => (
            <CheckRow
              key={c.id}
              checked={value.categories.includes(c.id)}
              onChange={() => onChange({ ...value, categories: toggle(value.categories, c.id) })}
              label={c.name}
              count={c.count}
            />
          ))}
        </Group>
      )}

      {sizes.length > 0 && (
        <Group title="Talle de pañal">
          <div className="flex flex-wrap gap-2">
            {sizes.map((s) => (
              <button
                key={s}
                type="button"
                className="chip min-w-12 justify-center"
                data-active={value.sizes.includes(s)}
                aria-pressed={value.sizes.includes(s)}
                onClick={() => onChange({ ...value, sizes: toggle(value.sizes, s) })}
              >
                {s}
              </button>
            ))}
          </div>
        </Group>
      )}

      {ages.length > 1 && (
        <Group title="Edad">
          {ages.map((a) => (
            <CheckRow key={a} checked={value.ages.includes(a)} onChange={() => onChange({ ...value, ages: toggle(value.ages, a) })} label={AGE_LABELS[a]} />
          ))}
        </Group>
      )}

      {brands.length > 1 && (
        <Group title="Marca">
          {brands.map((b) => (
            <CheckRow
              key={b.id}
              checked={value.brands.includes(b.id)}
              onChange={() => onChange({ ...value, brands: toggle(value.brands, b.id) })}
              label={b.name}
              count={b.count}
            />
          ))}
        </Group>
      )}

      {prices.length > 1 && (
        <Group title="Precio">
          {prices.map((b) => {
            const active = value.priceMin === b.min && value.priceMax === b.max
            return (
              <CheckRow
                key={b.label}
                checked={active}
                onChange={() => onChange({ ...value, priceMin: active ? null : b.min, priceMax: active ? null : b.max })}
                label={b.label}
              />
            )
          })}
        </Group>
      )}
    </div>
  )
}
