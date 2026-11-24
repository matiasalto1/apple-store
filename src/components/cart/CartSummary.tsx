import type { CartTotals } from '@/lib/cart/pricing'
import { formatPrice } from '@/lib/format'

export function CartSummary({ totals, shippingNote = true }: { totals: CartTotals; shippingNote?: boolean }) {
  return (
    <dl className="space-y-2 text-[0.9375rem]">
      <div className="flex justify-between">
        <dt className="text-ink-soft">Subtotal</dt>
        <dd className="tabular-nums">{formatPrice(totals.subtotal)}</dd>
      </div>
      {totals.discounts.map((d) => (
        <div key={d.id} className="flex justify-between text-accent">
          <dt>{d.label}</dt>
          <dd className="tabular-nums">−{formatPrice(d.amount)}</dd>
        </div>
      ))}
      {shippingNote && (
        <div className="flex justify-between">
          <dt className="text-ink-soft">Envío</dt>
          <dd className="text-ink-soft">{totals.freeShipping?.reached ? 'Gratis' : 'Se calcula al coordinar'}</dd>
        </div>
      )}
      <div className="flex items-baseline justify-between border-t hairline pt-3 text-[1.125rem] font-semibold">
        <dt>Total</dt>
        <dd className="tabular-nums">{formatPrice(totals.total)}</dd>
      </div>
    </dl>
  )
}
