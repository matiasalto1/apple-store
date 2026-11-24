import { NextResponse } from 'next/server'
import { computeTotals } from '@/lib/cart/pricing'
import { MAX_QTY_PER_LINE } from '@/lib/cart/limits'
import { getProvider } from '@/lib/payments/server'
import type { CheckoutRequest, CheckoutResult, PaymentMethodId } from '@/lib/payments/types'

/**
 * Inicia el pago de un pedido. Los precios se recalculan SIEMPRE en el
 * servidor a partir del catálogo: lo que manda el navegador solo indica
 * qué productos y cuántos.
 */
const METHODS: PaymentMethodId[] = ['mercadopago', 'transfer']
const str = (v: unknown, max = 200) => (typeof v === 'string' ? v.trim().slice(0, max) : '')

export async function POST(req: Request) {
  let body: CheckoutRequest
  try {
    body = (await req.json()) as CheckoutRequest
  } catch {
    return json({ ok: false, code: 'invalid', error: 'Solicitud inválida.' }, 400)
  }

  const method = body.method
  if (!METHODS.includes(method)) return json({ ok: false, code: 'invalid', error: 'Medio de pago no válido.' }, 400)

  const lines = Array.isArray(body.lines)
    ? body.lines
        .filter((l) => l && typeof l.productId === 'string' && typeof l.variantId === 'string')
        .map((l) => ({ productId: l.productId, variantId: l.variantId, quantity: Math.max(1, Math.min(MAX_QTY_PER_LINE, Math.floor(Number(l.quantity) || 1))) }))
        .slice(0, 50)
    : []
  const totals = computeTotals(lines, { method })
  if (!totals.lines.some((l) => l.available)) return json({ ok: false, code: 'empty', error: 'El carrito está vacío.' }, 400)

  const c = body.customer ?? ({} as CheckoutRequest['customer'])
  const customer = {
    name: str(c.name, 120),
    email: str(c.email, 254),
    phone: str(c.phone, 40),
    delivery: c.delivery === 'pickup' ? ('pickup' as const) : ('shipping' as const),
    address: str(c.address),
    city: str(c.city, 120),
    province: str(c.province, 80),
    postalCode: str(c.postalCode, 12),
    notes: str(c.notes, 600),
  }
  if (!customer.name || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(customer.email) || customer.phone.replace(/\D/g, '').length < 8) {
    return json({ ok: false, code: 'invalid', error: 'Revisá tus datos de contacto.' }, 422)
  }
  if (customer.delivery === 'shipping' && (!customer.address || !customer.city || !customer.province || !customer.postalCode)) {
    return json({ ok: false, code: 'invalid', error: 'Completá la dirección de entrega.' }, 422)
  }

  const provider = getProvider(method)
  if (!provider?.isConfigured()) {
    return json({ ok: false, code: 'not_configured', error: 'Este medio de pago todavía no está disponible.' }, 501)
  }

  const orderRef = `P-${new Date().toISOString().slice(2, 10).replace(/-/g, '')}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`
  const result = await provider.createPayment({ orderRef, totals, customer })
  return json(result, result.ok ? 200 : 501)
}

function json(data: CheckoutResult, status = 200) {
  return NextResponse.json(data, { status })
}
