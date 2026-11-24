import type { CartTotals } from '@/lib/cart/pricing'
import { formatPrice } from '@/lib/format'

/** Solo se muestra si hay un umbral de envío gratis configurado en site.shipping. */
export function FreeShippingBar({ totals }: { totals: CartTotals }) {
  const fs = totals.freeShipping
  if (!fs) return null
  const pct = Math.min(100, (totals.subtotal / fs.threshold) * 100)
  return (
    <div className="rounded-2xl bg-sand/70 p-4 text-[0.875rem]">
      <p>{fs.reached ? 'Tu pedido tiene envío gratis.' : <>Te faltan <strong>{formatPrice(fs.remaining)}</strong> para el envío gratis.</>}</p>
      <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-white">
        <div className="h-full rounded-full bg-accent transition-all duration-700" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}
