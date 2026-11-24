/**
 * Mensajes de WhatsApp generados dinámicamente.
 * El número sale únicamente de `site.contact.whatsapp`.
 */
import { brand } from '@/config/brand'
import { site } from '@/config/site'
import { brandName } from '@/lib/catalog/repository'
import type { Product, ProductVariant } from '@/lib/catalog/types'
import { formatPrice } from '@/lib/format'
import type { CartTotals } from '@/lib/cart/pricing'

export function whatsappUrl(message: string): string {
  return `https://wa.me/${site.contact.whatsapp}?text=${encodeURIComponent(message)}`
}

export function generalMessage(): string {
  return `¡Hola ${brand.name}! Quería hacerles una consulta.`
}

export function productMessage(product: Product, variant?: ProductVariant, quantity = 1): string {
  const lines = [
    `¡Hola ${brand.name}! Me interesa este producto:`,
    '',
    `• ${brandName(product)} ${product.name}`,
  ]
  if (variant && product.variants.length > 1) lines.push(`• ${variant.option.name}: ${variant.label}${variant.detail ? ` (${variant.detail})` : ''}`)
  lines.push(`• Cantidad: ${quantity}`)
  if (variant) lines.push(`• Precio publicado: ${formatPrice(variant.price * quantity)}`)
  lines.push('', `${brand.url}/producto/${product.slug}`)
  return lines.join('\n')
}

export function cartMessage(totals: CartTotals, extra?: string[]): string {
  const lines = [`¡Hola ${brand.name}! Quiero hacer este pedido:`, '']
  for (const l of totals.lines) {
    const variant = l.product.variants.length > 1 ? ` · ${l.variant.label}` : ''
    lines.push(`• ${l.quantity} × ${brandName(l.product)} ${l.product.name}${variant} — ${formatPrice(l.lineTotal)}`)
  }
  lines.push('', `Subtotal: ${formatPrice(totals.subtotal)}`)
  for (const d of totals.discounts) lines.push(`${d.label}: −${formatPrice(d.amount)}`)
  lines.push(`Total: ${formatPrice(totals.total)}`)
  if (extra?.length) lines.push('', ...extra)
  return lines.join('\n')
}
