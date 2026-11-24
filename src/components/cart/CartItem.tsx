'use client'

import { Trash2 } from 'lucide-react'
import Link from 'next/link'
import type { ResolvedLine } from '@/lib/cart/pricing'
import { MAX_QTY_PER_LINE, useCart } from '@/lib/cart/store'
import { brandName } from '@/lib/catalog/repository'
import { formatPrice } from '@/lib/format'
import { useUI } from '@/lib/ui-store'
import { ProductImage } from '@/components/product/ProductImage'
import { QuantityStepper } from '@/components/ui/QuantityStepper'

export function CartItem({ line, compact }: { line: ResolvedLine; compact?: boolean }) {
  const setQuantity = useCart((s) => s.setQuantity)
  const changeVariant = useCart((s) => s.changeVariant)
  const remove = useCart((s) => s.remove)
  const close = useUI((s) => s.closeCart)
  const { product, variant } = line
  const multi = product.variants.length > 1

  return (
    <div className="flex gap-4 py-5">
      <Link href={`/producto/${product.slug}`} onClick={close} className="shrink-0">
        <ProductImage product={product} className="h-24 w-24 rounded-2xl sm:h-28 sm:w-28" sizes="112px" />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="eyebrow text-stone">{brandName(product)}</p>
            <Link href={`/producto/${product.slug}`} onClick={close} className="block truncate font-semibold hover:underline">
              {product.name}
            </Link>
          </div>
          <p className="shrink-0 font-semibold tabular-nums">{formatPrice(line.lineTotal)}</p>
        </div>

        {multi && !compact ? (
          <label className="flex items-center gap-2 text-[0.8125rem] text-ink-soft">
            <span>{variant.option.name}:</span>
            <select
              className="rounded-full border border-[var(--line-strong)] bg-white py-1 pl-3 pr-7 text-[0.8125rem] font-medium"
              value={variant.id}
              onChange={(e) => changeVariant(product.id, variant.id, e.target.value)}
            >
              {product.variants.map((v) => (
                <option key={v.id} value={v.id} disabled={v.availability === 'out_of_stock'}>
                  {v.label}
                  {v.detail ? ` · ${v.detail}` : ''}
                  {v.availability === 'out_of_stock' ? ' (sin stock)' : ''}
                </option>
              ))}
            </select>
          </label>
        ) : (
          multi && <p className="text-[0.8125rem] text-ink-soft">{variant.option.name}: {variant.label}</p>
        )}

        {!line.available && <p className="text-[0.8125rem] font-medium text-danger">Sin stock: no se incluye en el total.</p>}

        <div className="mt-auto flex items-center justify-between gap-3">
          <QuantityStepper
            size="sm"
            value={line.quantity}
            max={MAX_QTY_PER_LINE}
            onChange={(n) => setQuantity(product.id, variant.id, n)}
            label={`Cantidad de ${product.name}`}
          />
          <span className="hidden text-[0.75rem] text-stone sm:inline">{formatPrice(line.unitPrice)} c/u</span>
          <button
            type="button"
            onClick={() => remove(product.id, variant.id)}
            className="icon-btn h-9 w-9 text-stone hover:text-danger"
            aria-label={`Eliminar ${product.name}`}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
