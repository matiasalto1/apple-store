'use client'

import { motion, useAnimationControls } from 'motion/react'
import { Eye, Plus } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { AVAILABILITY_LABELS, type Product } from '@/lib/catalog/types'
import { brandName, defaultVariant, getVariant, priceRange } from '@/lib/catalog/repository'
import { useCart } from '@/lib/cart/store'
import { cn } from '@/lib/format'
import { useUI } from '@/lib/ui-store'
import { Price } from '@/components/ui/Price'
import { AddToCartButton } from './AddToCartButton'
import { FavoriteButton } from './FavoriteButton'
import { ProductBadges } from './ProductBadges'
import { ProductImage } from './ProductImage'
import { VariantSelector } from './VariantSelector'

export function ProductCard({ product, priority, className }: { product: Product; priority?: boolean; className?: string }) {
  const [variantId, setVariantId] = useState(() => defaultVariant(product).id)
  const variant = getVariant(product, variantId)
  const range = priceRange(product)
  const multi = product.variants.length > 1
  const openQuickView = useUI((s) => s.openQuickView)
  const add = useCart((s) => s.add)
  const jump = useAnimationControls()
  const out = variant.availability === 'out_of_stock'
  const href = `/producto/${product.slug}`
  const name = `${brandName(product)} ${product.name}`

  const bounce = () =>
    jump.start({ y: [0, -14, 0], scale: [1, 1.04, 1], transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } })

  return (
    <article className={cn('group relative flex flex-col', className)}>
      <div className="relative overflow-hidden rounded-[var(--radius-card)] shadow-[var(--shadow-soft)] transition-shadow duration-700 ease-[var(--ease-out-expo)] group-hover:shadow-[var(--shadow-lift)]">
        <motion.div animate={jump}>
          <ProductImage
            product={product}
            priority={priority}
            className="aspect-[4/5]"
            imgClassName="scale-[0.94] transition-transform duration-[1.2s] ease-[var(--ease-out-expo)] group-hover:scale-100"
          />
        </motion.div>

        <div className="pointer-events-none absolute inset-x-3 top-3 flex items-start justify-between">
          <ProductBadges product={product} />
        </div>
        <div className="absolute right-3 top-3 z-10">
          <FavoriteButton productId={product.id} name={name} />
        </div>

        {/* Quick add — desktop: aparece al hover */}
        <div className="absolute inset-x-3 bottom-3 z-10 hidden translate-y-3 opacity-0 transition-all duration-500 ease-[var(--ease-out-expo)] group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:translate-y-0 group-hover:opacity-100 lg:block">
          <div className="glass flex flex-col gap-2.5 rounded-[1.25rem] p-2.5">
            {multi && (
              <div className="px-1">
                <VariantSelector product={product} value={variantId} onChange={setVariantId} size="sm" showLabel={false} />
              </div>
            )}
            <div className="flex gap-2">
              <AddToCartButton
                productId={product.id}
                variantId={variant.id}
                disabled={out}
                compact
                label="Agregar"
                className="flex-1"
                onAdded={bounce}
              />
              <button
                type="button"
                onClick={() => openQuickView(product.id)}
                className="icon-btn h-10 w-10 bg-white/80"
                aria-label={`Vista rápida de ${name}`}
              >
                <Eye size={17} />
              </button>
            </div>
          </div>
        </div>

        {/* Quick add — touch */}
        <button
          type="button"
          onClick={() => {
            if (multi) openQuickView(product.id)
            else if (!out) {
              add(product.id, variant.id, 1)
              bounce()
            }
          }}
          disabled={!multi && out}
          className="absolute bottom-3 right-3 z-10 grid h-11 w-11 place-items-center rounded-full bg-ink text-paper shadow-lg transition active:scale-90 disabled:opacity-40 lg:hidden"
          aria-label={multi ? `Elegir opción y agregar ${name}` : `Agregar ${name} al carrito`}
        >
          <Plus size={20} />
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-1 px-1 pt-4">
        <p className="eyebrow text-stone">{brandName(product)}</p>
        <h3 className="text-[1.0625rem] font-semibold leading-snug tracking-[-0.01em]">
          <Link href={href} className="after:absolute after:inset-0 after:z-0 after:rounded-[var(--radius-card)] focus-visible:outline-none">
            {product.name}
          </Link>
        </h3>
        <p className="line-clamp-2 text-[0.875rem] text-ink-soft">{product.short}</p>
        <div className="mt-auto flex items-end justify-between gap-3 pt-2.5">
          <Price value={range.min} compareAt={multi ? undefined : variant.compareAtPrice} from={range.min !== range.max} />
          <span className="text-[0.75rem] text-stone">
            {multi ? `${product.variants.length} ${product.variants[0].option.name === 'Talle' ? 'talles' : 'opciones'}` : AVAILABILITY_LABELS[variant.availability]}
          </span>
        </div>
      </div>
    </article>
  )
}
