/**
 * Contrato común para medios de pago.
 * Cada proveedor (Mercado Pago, transferencia, etc.) implementa `PaymentProvider`
 * en el servidor. El frontend solo conoce `PaymentMethodInfo`.
 */
import type { CartTotals } from '@/lib/cart/pricing'

export type PaymentMethodId = 'mercadopago' | 'transfer' | 'whatsapp'

export interface PaymentMethodInfo {
  id: PaymentMethodId
  label: string
  description: string
  /** false = se muestra como "próximamente" y no se puede elegir */
  available: boolean
  unavailableReason?: string
}

export interface CheckoutCustomer {
  name: string
  email: string
  phone: string
  delivery: 'shipping' | 'pickup'
  address?: string
  city?: string
  province?: string
  postalCode?: string
  notes?: string
}

export interface CheckoutRequest {
  lines: { productId: string; variantId: string; quantity: number }[]
  customer: CheckoutCustomer
  method: PaymentMethodId
}

export type CheckoutResult =
  | { ok: true; kind: 'redirect'; url: string }
  | { ok: true; kind: 'instructions'; orderRef: string; totals: Pick<CartTotals, 'subtotal' | 'discountTotal' | 'total'> }
  | { ok: false; error: string; code: 'invalid' | 'not_configured' | 'empty' | 'unavailable' }

export interface PaymentProvider {
  id: PaymentMethodId
  isConfigured(): boolean
  createPayment(input: { orderRef: string; totals: CartTotals; customer: CheckoutCustomer }): Promise<CheckoutResult>
}
