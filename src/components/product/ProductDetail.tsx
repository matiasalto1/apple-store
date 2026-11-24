'use client'

import { AnimatePresence, motion } from 'motion/react'
import { Box, ChevronDown, ImageIcon } from 'lucide-react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { site } from '@/config/site'
import { brandName, defaultVariant, getVariant } from '@/lib/catalog/repository'
import { AVAILABILITY_LABELS, type Product } from '@/lib/catalog/types'
import { cn } from '@/lib/format'
import { productMessage } from '@/lib/whatsapp'
import { BenefitIcon } from '@/components/ui/BenefitIcon'
import { Price } from '@/components/ui/Price'
import { QuantityStepper } from '@/components/ui/QuantityStepper'
import { WhatsAppButton } from '@/components/whatsapp/WhatsAppButton'
import { AddToCartButton } from './AddToCartButton'
import { FavoriteButton } from './FavoriteButton'
import { ProductBadges } from './ProductBadges'
import { ProductImage } from './ProductImage'
import { VariantSelector } from './VariantSelector'

const ProductViewer3D = dynamic(() => import('@/components/three/ProductViewer3D'), {
  ssr: false,
  loading: () => <div className="grid h-full place-items-center text-[0.875rem] text-stone">Cargando vista 3D…</div>,
})

const DOT = { in_stock: 'bg-ok', low_stock: 'bg-warn', out_of_stock: 'bg-danger' } as const

function Disclosure({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-b hairline">
      <button type="button" className="flex min-h-14 w-full items-center justify-between text-left font-semibold" aria-expanded={open} onClick={() => setOpen(!open)}>
        {title}
        <ChevronDown size={18} className={cn('transition-transform duration-500', open && 'rotate-180')} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }} className="overflow-hidden">
            <div className="pb-6 text-[0.9375rem] text-ink-soft">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function ProductDetail({ product }: { product: Product }) {
  const [variantId, setVariantId] = useState(() => defaultVariant(product).id)
  const [qty, setQty] = useState(1)
  const [view, setView] = useState<'photo' | '3d'>('photo')
  const [stickyBar, setStickyBar] = useState(false)
  const cta = useRef<HTMLDivElement>(null)
  const variant = getVariant(product, variantId)
  const out = variant.availability === 'out_of_stock'
  const name = `${brandName(product)} ${product.name}`
  const hasRealPhotos = product.images.length > 0

  // ?variante=… para compartir una variante concreta
  useEffect(() => {
    const v = new URLSearchParams(window.location.search).get('variante')
    if (v && product.variants.some((x) => x.id === v)) setVariantId(v)
  }, [product])

  const choose = (id: string) => {
    setVariantId(id)
    const url = new URL(window.location.href)
    url.searchParams.set('variante', id)
    window.history.replaceState(null, '', url)
  }

  useEffect(() => {
    const el = cta.current
    if (!el) return
    let raf = 0
    const check = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => setStickyBar(el.getBoundingClientRect().bottom < 0))
    }
    check()
    window.addEventListener('scroll', check, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', check)
    }
  }, [])

  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
      {/* Galería */}
      <div className="lg:col-span-7">
        <div className="lg:sticky lg:top-24">
          <div className="relative aspect-square overflow-hidden rounded-[2rem] sm:aspect-[5/4] lg:aspect-square" style={{ background: product.visual.backdrop }}>
            {view === 'photo' ? (
              <ProductImage product={product} priority className="h-full w-full" sizes="(min-width: 1024px) 55vw, 100vw" />
            ) : (
              <ProductViewer3D product={product} />
            )}
            <div className="absolute left-4 top-4">
              <ProductBadges product={product} />
            </div>
            <div className="absolute right-4 top-4">
              <FavoriteButton productId={product.id} name={name} />
            </div>
            {!hasRealPhotos && (
              <div className="glass absolute bottom-4 left-1/2 flex -translate-x-1/2 rounded-full p-1" role="tablist" aria-label="Tipo de vista">
                <button
                  type="button"
                  role="tab"
                  aria-selected={view === 'photo'}
                  onClick={() => setView('photo')}
                  className={cn('flex h-10 items-center gap-2 whitespace-nowrap rounded-full px-4 text-[0.875rem] font-medium transition', view === 'photo' ? 'bg-ink text-paper' : 'hover:bg-white/70')}
                >
                  <ImageIcon size={16} /> Imagen
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={view === '3d'}
                  onClick={() => setView('3d')}
                  className={cn('flex h-10 items-center gap-2 whitespace-nowrap rounded-full px-4 text-[0.875rem] font-medium transition', view === '3d' ? 'bg-ink text-paper' : 'hover:bg-white/70')}
                >
                  <Box size={16} /> Ver en 3D
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Información */}
      <div className="lg:col-span-5">
        <p className="eyebrow text-stone">{brandName(product)}</p>
        <h1 className="mt-3 font-display text-[clamp(2.25rem,4.4vw,3.75rem)] leading-[1]">{product.name}</h1>
        <div className="mt-5">
          <Price value={variant.price} compareAt={variant.compareAtPrice} size="lg" />
          <p className="mt-1 text-[0.8125rem] text-stone">Precio final en pesos argentinos.</p>
        </div>
        <p className="mt-6 text-[1.0625rem] text-ink-soft">{product.short}</p>

        <div className="mt-8 space-y-6">
          <VariantSelector product={product} value={variant.id} onChange={choose} />

          <p className="flex items-center gap-2 text-[0.875rem]">
            <span className={cn('h-2 w-2 rounded-full', DOT[variant.availability])} />
            {AVAILABILITY_LABELS[variant.availability]}
          </p>

          <div ref={cta} className="flex flex-col gap-3 sm:flex-row">
            <QuantityStepper value={qty} onChange={setQty} />
            <AddToCartButton productId={product.id} variantId={variant.id} quantity={qty} disabled={out} openCart className="h-12 flex-1" />
          </div>
          <WhatsAppButton message={productMessage(product, variant, qty)} variant="outline" className="w-full">
            {out ? 'Avisame cuando vuelva' : 'Consultar por WhatsApp'}
          </WhatsAppButton>
        </div>

        <ul className="mt-8 grid grid-cols-2 gap-3">
          {site.benefits
            .filter((b) => b.enabled)
            .map((b) => (
              <li key={b.id}>
                <Link href={b.href} className="flex h-full items-start gap-3 rounded-2xl bg-ivory p-3.5 text-[0.8125rem] transition hover:bg-sand/70">
                  <BenefitIcon name={b.icon} size={18} className="mt-0.5 shrink-0 text-accent" />
                  <span className="font-medium">{b.title}</span>
                </Link>
              </li>
            ))}
        </ul>

        <div className="mt-8 border-t hairline">
          <Disclosure title="Descripción" defaultOpen>
            <p>{product.description}</p>
          </Disclosure>
          <Disclosure title="Características">
            <ul className="space-y-2">
              {product.highlights.map((h) => (
                <li key={h} className="flex gap-2.5">
                  <span className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-accent" />
                  {h}
                </li>
              ))}
              {product.variants.length > 1 && (
                <li className="flex gap-2.5">
                  <span className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-accent" />
                  {product.variants[0].option.name}s: {product.variants.map((v) => v.label + (v.detail ? ` (${v.detail})` : '')).join(' · ')}
                </li>
              )}
            </ul>
          </Disclosure>
          <Disclosure title="Envíos, cambios y pagos">
            <p>
              Coordinamos la entrega según tu zona. Mirá{' '}
              <Link href="/ayuda/envios" className="underline">
                envíos
              </Link>
              ,{' '}
              <Link href="/ayuda/cambios-y-devoluciones" className="underline">
                cambios y devoluciones
              </Link>{' '}
              y{' '}
              <Link href="/ayuda/medios-de-pago" className="underline">
                medios de pago
              </Link>
              .
            </p>
          </Disclosure>
        </div>
      </div>

      {/* Barra fija mobile */}
      <AnimatePresence>
        {stickyBar && (
          <motion.div
            initial={{ y: '110%' }}
            animate={{ y: 0 }}
            exit={{ y: '110%' }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="glass fixed inset-x-2 bottom-[max(0.5rem,env(safe-area-inset-bottom))] z-50 flex items-center gap-3 rounded-[1.5rem] p-2 pl-4 lg:hidden"
          >
            <div className="min-w-0 flex-1">
              <p className="truncate text-[0.8125rem] font-semibold">
                {product.name}
                {product.variants.length > 1 ? ` · ${variant.label}` : ''}
              </p>
              <Price value={variant.price * qty} size="sm" />
            </div>
            <AddToCartButton productId={product.id} variantId={variant.id} quantity={qty} disabled={out} openCart compact label="Agregar" className="h-11" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
