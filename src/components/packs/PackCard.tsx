'use client'

import { Check, Plus } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { brandName, catalog, packTotals } from '@/lib/catalog/repository'
import type { Pack } from '@/lib/catalog/types'
import { useCart } from '@/lib/cart/store'
import { formatPrice, cn } from '@/lib/format'
import { useUI } from '@/lib/ui-store'
import { ProductImage } from '@/components/product/ProductImage'

export function PackCard({ pack, detailed = false, className }: { pack: Pack; detailed?: boolean; className?: string }) {
  const totals = packTotals(pack)
  const cover = catalog.getProductById(pack.coverProductId)
  const addMany = useCart((s) => s.addMany)
  const openCart = useUI((s) => s.openCart)
  const [added, setAdded] = useState(false)
  const unavailable = totals.lines.some((l) => l.variant.availability === 'out_of_stock')
  const units = totals.lines.reduce((n, l) => n + l.quantity, 0)

  return (
    <article id={pack.slug} className={cn('group flex h-full scroll-mt-28 flex-col overflow-hidden rounded-[var(--radius-card)] bg-white shadow-[var(--shadow-soft)]', className)}>
      <div className="relative" style={{ background: pack.tone }}>
        {cover && (
          <ProductImage
            product={cover}
            backdrop={false}
            className="mx-auto aspect-[4/3] w-[86%]"
            sizes="(min-width: 1024px) 30vw, 80vw"
            imgClassName="transition-transform duration-[1.2s] ease-[var(--ease-out-expo)] group-hover:scale-105"
          />
        )}
        <span className="absolute left-4 top-4 rounded-full bg-paper/85 px-3 py-1 text-[0.75rem] font-semibold backdrop-blur">{pack.moment}</span>
        <ul className="absolute bottom-3 right-3 flex -space-x-3" aria-hidden="true">
          {totals.lines.slice(0, 4).map((l) => (
            <li key={l.variant.id} className="h-11 w-11 overflow-hidden rounded-full border-2 border-white bg-white">
              <ProductImage product={l.product} className="h-full w-full" sizes="44px" />
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5 sm:p-6">
        <div>
          <h3 className="font-display text-[1.75rem] leading-[1.05]">Pack {pack.name}</h3>
          <p className="mt-2 text-[0.9375rem] text-ink-soft">{pack.description}</p>
        </div>

        {detailed && (
          <ul className="space-y-2 border-t hairline pt-4 text-[0.875rem]">
            {totals.lines.map((l) => (
              <li key={l.variant.id} className="flex justify-between gap-3">
                <Link href={`/producto/${l.product.slug}`} className="hover:underline">
                  {l.quantity} × {brandName(l.product)} {l.product.name}
                  {l.product.variants.length > 1 ? ` · ${l.variant.label}` : ''}
                </Link>
                <span className="shrink-0 tabular-nums text-ink-soft">{formatPrice(l.variant.price * l.quantity)}</span>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-auto flex items-end justify-between gap-3 border-t hairline pt-4">
          <div>
            <p className="text-[0.75rem] text-stone">{units} productos</p>
            {totals.discount > 0 && <p className="text-[0.875rem] text-stone line-through">{formatPrice(totals.subtotal)}</p>}
            <p className="text-[1.25rem] font-semibold tabular-nums">{formatPrice(totals.total)}</p>
          </div>
          <button
            type="button"
            disabled={unavailable}
            onClick={() => {
              addMany(
                totals.lines
                  .filter((l) => l.variant.availability !== 'out_of_stock')
                  .map((l) => ({ productId: l.product.id, variantId: l.variant.id, quantity: l.quantity })),
              )
              setAdded(true)
              window.setTimeout(() => setAdded(false), 1800)
              window.setTimeout(openCart, 400)
            }}
            className="btn btn-primary min-h-11 px-5"
          >
            {added ? <Check size={17} /> : <Plus size={17} />}
            {unavailable ? 'Sin stock' : added ? 'Agregado' : 'Agregar pack'}
          </button>
        </div>
        {!detailed && (
          <Link href={`/packs#${pack.slug}`} className="text-[0.8125rem] font-semibold text-ink-soft hover:text-ink hover:underline">
            Ver qué incluye
          </Link>
        )}
      </div>
    </article>
  )
}
