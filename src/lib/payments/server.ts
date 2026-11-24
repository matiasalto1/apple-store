import 'server-only'
/**
 * Proveedores de pago del lado del servidor.
 *
 * ⚠️ No hay ningún cobro real implementado. Mercado Pago queda como
 * punto de integración: cuando tengas credenciales, implementá
 * `createPayment` creando una preferencia con el SDK oficial
 * (npm i mercadopago) y devolviendo `{ kind: 'redirect', url: preference.init_point }`.
 * Probalo primero con credenciales de prueba.
 */
import type { PaymentMethodId, PaymentProvider } from './types'

const mercadopago: PaymentProvider = {
  id: 'mercadopago',
  isConfigured: () => Boolean(process.env.MERCADOPAGO_ACCESS_TOKEN) && process.env.NEXT_PUBLIC_MERCADOPAGO_ENABLED === 'true',
  async createPayment() {
    // TODO(pagos): crear preferencia de Mercado Pago aquí.
    return {
      ok: false,
      code: 'not_configured',
      error: 'Mercado Pago todavía no está integrado. Elegí transferencia o coordiná por WhatsApp.',
    }
  },
}

const transfer: PaymentProvider = {
  id: 'transfer',
  isConfigured: () => true,
  async createPayment({ orderRef, totals }) {
    // TODO(pedidos): persistir el pedido en la base de datos antes de devolver instrucciones.
    return {
      ok: true,
      kind: 'instructions',
      orderRef,
      totals: { subtotal: totals.subtotal, discountTotal: totals.discountTotal, total: totals.total },
    }
  },
}

const providers: Partial<Record<PaymentMethodId, PaymentProvider>> = { mercadopago, transfer }

export function getProvider(id: PaymentMethodId): PaymentProvider | undefined {
  return providers[id]
}
