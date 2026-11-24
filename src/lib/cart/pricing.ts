/**
 * Cálculo de totales. Se usa igual en el cliente (carrito) y en el
 * servidor (/api/checkout), que SIEMPRE recalcula con precios del catálogo.
 */
import { site } from '@/config/site'
import { catalog, getVariant } from '@/lib/catalog/repository'
import type { Product, ProductVariant } from '@/lib/catalog/types'
import type { CartLine } from './store'

export interface ResolvedLine {
  key: string
  product: Product
  variant: ProductVariant
  quantity: number
  unitPrice: number
  lineTotal: number
  available: boolean
}

export interface CartTotals {
  lines: ResolvedLine[]
  itemCount: number
  subtotal: number
  discounts: { id: string; label: string; amount: number }[]
  discountTotal: number
  total: number
  /** null si no hay umbral de envío gratis configurado */
  freeShipping: { threshold: number; remaining: number; reached: boolean } | null
}

export function resolveLines(lines: CartLine[]): ResolvedLine[] {
  return lines.flatMap((l) => {
    const product = catalog.getProductById(l.productId)
    if (!product) return []
    const variant = product.variants.find((v) => v.id === l.variantId) ?? getVariant(product)
    return [
      {
        key: `${product.id}:${variant.id}`,
        product,
        variant,
        quantity: l.quantity,
        unitPrice: variant.price,
        lineTotal: variant.price * l.quantity,
        available: variant.availability !== 'out_of_stock',
      },
    ]
  })
}

export function computeTotals(lines: CartLine[], opts: { method?: string } = {}): CartTotals {
  const resolved = resolveLines(lines)
  const billable = resolved.filter((l) => l.available)
  const subtotal = billable.reduce((s, l) => s + l.lineTotal, 0)
  const itemCount = resolved.reduce((s, l) => s + l.quantity, 0)

  const discounts = site.promotions
    .filter((p) => p.minSubtotal == null || subtotal >= p.minSubtotal)
    .map((p) => ({ id: p.id, label: p.label, amount: Math.round((subtotal * p.value) / 100) }))
  const transferPct = site.payments.transfer.discountPercent
  if (opts.method === 'transfer' && transferPct) {
    discounts.push({ id: 'transfer', label: `Transferencia (−${transferPct}%)`, amount: Math.round((subtotal * transferPct) / 100) })
  }
  const discountTotal = discounts.reduce((s, d) => s + d.amount, 0)

  const threshold = site.shipping.freeShippingThreshold
  return {
    lines: resolved,
    itemCount,
    subtotal,
    discounts,
    discountTotal,
    total: Math.max(0, subtotal - discountTotal),
    freeShipping:
      threshold != null
        ? { threshold, remaining: Math.max(0, threshold - subtotal), reached: subtotal >= threshold }
        : null,
  }
}
