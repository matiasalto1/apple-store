'use client'

import type { Product } from '@/lib/catalog/types'
import { cn } from '@/lib/format'

/** Selector de talle / presentación / color. Las variantes sin stock se muestran tachadas. */
export function VariantSelector({
  product,
  value,
  onChange,
  size = 'md',
  showLabel = true,
}: {
  product: Product
  value: string
  onChange: (variantId: string) => void
  size?: 'sm' | 'md'
  showLabel?: boolean
}) {
  if (product.variants.length < 2) return null
  const current = product.variants.find((v) => v.id === value)
  const optionName = product.variants[0].option.name
  const isColor = product.variants.some((v) => v.swatch)

  return (
    <fieldset>
      {showLabel && (
        <legend className="mb-2.5 flex w-full items-baseline justify-between gap-3 text-[0.875rem]">
          <span>
            <span className="font-semibold">{optionName}:</span> <span className="text-ink-soft">{current?.label}</span>
          </span>
          {current?.detail && <span className="text-stone">{current.detail}</span>}
        </legend>
      )}
      <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={optionName}>
        {product.variants.map((v) => {
          const active = v.id === value
          const out = v.availability === 'out_of_stock'
          return (
            <button
              key={v.id}
              type="button"
              role="radio"
              aria-checked={active}
              aria-label={`${optionName} ${v.label}${out ? ' (sin stock)' : ''}`}
              title={v.detail}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onChange(v.id)
              }}
              className={cn(
                'relative inline-flex items-center justify-center gap-2 rounded-full border font-semibold transition-all duration-300',
                size === 'sm' ? 'h-9 min-w-9 px-3 text-[0.8125rem]' : 'h-11 min-w-12 px-4 text-[0.9rem]',
                active ? 'border-ink bg-ink text-paper' : 'border-[var(--line-strong)] bg-white hover:border-ink',
                out && !active && 'text-stone-light line-through decoration-1',
              )}
            >
              {isColor && v.swatch && (
                <span className="h-3.5 w-3.5 rounded-full ring-1 ring-black/10" style={{ background: v.swatch }} aria-hidden="true" />
              )}
              {v.label}
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}
