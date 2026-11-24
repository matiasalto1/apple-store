'use client'

import { AnimatePresence, motion } from 'motion/react'
import { ShoppingBag, X } from 'lucide-react'
import Link from 'next/link'
import { useMemo } from 'react'
import { computeTotals } from '@/lib/cart/pricing'
import { useCart } from '@/lib/cart/store'
import { catalog } from '@/lib/catalog/repository'
import { useHydrated } from '@/lib/hooks'
import { useUI } from '@/lib/ui-store'
import { cartMessage } from '@/lib/whatsapp'
import { Overlay } from '@/components/ui/Overlay'
import { WhatsAppButton } from '@/components/whatsapp/WhatsAppButton'
import { ProductImage } from '@/components/product/ProductImage'
import { CartItem } from './CartItem'
import { CartSummary } from './CartSummary'
import { CheckoutButton } from './CheckoutButton'
import { FreeShippingBar } from './FreeShippingBar'

export function CartDrawer() {
  const open = useUI((s) => s.cartOpen)
  const close = useUI((s) => s.closeCart)
  const lines = useCart((s) => s.lines)
  const hydrated = useHydrated()
  const totals = useMemo(() => computeTotals(hydrated ? lines : []), [lines, hydrated])
  const empty = totals.lines.length === 0

  // sugerencias: esenciales que no están en el carrito
  const suggestions = useMemo(() => {
    const inCart = new Set(totals.lines.map((l) => l.product.id))
    return catalog
      .listProducts()
      .filter((p) => p.tags.includes('esencial') && !inCart.has(p.id))
      .slice(0, 3)
  }, [totals.lines])

  return (
    <Overlay open={open} onClose={close} label="Carrito de compras" side="right">
      <header className="flex items-center justify-between border-b hairline px-5 py-4 sm:px-7">
        <h2 className="flex items-baseline gap-2 font-display text-[1.6rem]">
          Tu carrito
          <span className="font-sans text-[0.875rem] text-stone">
            {totals.itemCount} {totals.itemCount === 1 ? 'producto' : 'productos'}
          </span>
        </h2>
        <button type="button" onClick={close} className="icon-btn -mr-2" aria-label="Cerrar carrito">
          <X size={20} />
        </button>
      </header>

      {empty ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-6 px-8 text-center">
          <div className="grid h-20 w-20 place-items-center rounded-full bg-sand">
            <ShoppingBag size={28} className="text-stone" />
          </div>
          <div>
            <p className="font-display text-[1.6rem]">Tu carrito está vacío</p>
            <p className="mt-2 text-ink-soft">Empezá por lo esencial o armá un pack para tu etapa.</p>
          </div>
          <div className="flex w-full max-w-xs flex-col gap-3">
            <Link href="/categoria/panales" onClick={close} className="btn btn-primary">
              Ver pañales
            </Link>
            <Link href="/packs" onClick={close} className="btn btn-ghost">
              Ver packs
            </Link>
          </div>
        </div>
      ) : (
        <>
          <div className="flex-1 overflow-y-auto px-5 sm:px-7" data-lenis-prevent="">
            <div className="pt-4">
              <FreeShippingBar totals={totals} />
            </div>
            <ul className="divide-y divide-[var(--line)]">
              <AnimatePresence initial={false}>
                {totals.lines.map((l) => (
                  <motion.li
                    key={l.key}
                    layout
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0, transition: { duration: 0.25 } }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <CartItem line={l} />
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>

            {suggestions.length > 0 && (
              <section className="mb-6 mt-2 rounded-3xl bg-ivory p-4">
                <h3 className="eyebrow mb-3 text-stone">Suele sumarse</h3>
                <ul className="grid grid-cols-3 gap-3">
                  {suggestions.map((p) => (
                    <li key={p.id}>
                      <Link href={`/producto/${p.slug}`} onClick={close} className="group block">
                        <ProductImage product={p} className="aspect-square rounded-2xl" sizes="120px" imgClassName="transition-transform duration-700 group-hover:scale-105" />
                        <p className="mt-2 line-clamp-2 text-[0.75rem] font-medium leading-tight">{p.name}</p>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          <footer className="space-y-4 border-t hairline bg-ivory/60 px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-5 sm:px-7">
            <CartSummary totals={totals} />
            <CheckoutButton />
            <WhatsAppButton message={cartMessage(totals)} variant="outline" className="w-full">
              Enviar pedido por WhatsApp
            </WhatsAppButton>
          </footer>
        </>
      )}
    </Overlay>
  )
}
