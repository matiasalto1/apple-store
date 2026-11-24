'use client'

import { ArrowRight, X } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { brandName, catalog, defaultVariant, getVariant } from '@/lib/catalog/repository'
import { AVAILABILITY_LABELS } from '@/lib/catalog/types'
import { useUI } from '@/lib/ui-store'
import { productMessage } from '@/lib/whatsapp'
import { Overlay } from '@/components/ui/Overlay'
import { Price } from '@/components/ui/Price'
import { QuantityStepper } from '@/components/ui/QuantityStepper'
import { WhatsAppButton } from '@/components/whatsapp/WhatsAppButton'
import { AddToCartButton } from './AddToCartButton'
import { ProductImage } from './ProductImage'
import { VariantSelector } from './VariantSelector'

export function ProductQuickView() {
  const id = useUI((s) => s.quickViewId)
  const close = useUI((s) => s.closeQuickView)
  const product = id ? catalog.getProductById(id) : undefined
  const [variantId, setVariantId] = useState('')
  const [qty, setQty] = useState(1)

  useEffect(() => {
    if (product) {
      setVariantId(defaultVariant(product).id)
      setQty(1)
    }
  }, [product])

  const variant = product ? getVariant(product, variantId) : undefined

  return (
    <Overlay open={Boolean(product)} onClose={close} label={product ? `Vista rápida: ${product.name}` : 'Vista rápida'} side="center">
      {product && variant && (
        <div className="grid md:grid-cols-2">
          <ProductImage product={product} className="aspect-square md:aspect-auto md:h-full md:min-h-[34rem]" sizes="(min-width: 768px) 32rem, 100vw" />
          <div className="flex flex-col gap-6 p-6 pb-8 sm:p-8 md:p-10">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="eyebrow text-stone">{brandName(product)}</p>
                <h2 className="mt-2 font-display text-[2rem] leading-[1.05]">{product.name}</h2>
              </div>
              <button type="button" className="icon-btn -mr-2 -mt-1 shrink-0" onClick={close} aria-label="Cerrar">
                <X size={20} />
              </button>
            </div>
            <Price value={variant.price * qty} compareAt={variant.compareAtPrice ? variant.compareAtPrice * qty : undefined} size="lg" />
            <p className="text-ink-soft">{product.short}</p>
            <VariantSelector product={product} value={variant.id} onChange={setVariantId} />
            <p className="text-[0.8125rem] text-stone">
              {AVAILABILITY_LABELS[variant.availability]}
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <QuantityStepper value={qty} onChange={setQty} />
              <AddToCartButton
                productId={product.id}
                variantId={variant.id}
                quantity={qty}
                disabled={variant.availability === 'out_of_stock'}
                className="flex-1"
                openCart
                onAdded={() => window.setTimeout(close, 320)}
              />
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 border-t hairline pt-5">
              <WhatsAppButton message={productMessage(product, variant, qty)} variant="link">
                Consultar este producto
              </WhatsAppButton>
              <Link href={`/producto/${product.slug}`} onClick={close} className="inline-flex items-center gap-1.5 text-[0.9rem] font-semibold hover:underline">
                Ver ficha completa <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      )}
    </Overlay>
  )
}
