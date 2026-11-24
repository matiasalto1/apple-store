/**
 * Medios de pago visibles en el checkout. Seguro para el cliente:
 * no lee secretos, solo flags públicos.
 */
import { site } from '@/config/site'
import type { PaymentMethodInfo } from './types'

/** Se setea en .env.local cuando Mercado Pago esté integrado y probado. */
const mpEnabled = process.env.NEXT_PUBLIC_MERCADOPAGO_ENABLED === 'true'

export function paymentMethods(): PaymentMethodInfo[] {
  return [
    {
      id: 'mercadopago',
      label: site.payments.mercadopago.label,
      description: `${site.payments.cards.label}, dinero en cuenta y otros medios. ${site.payments.cards.note}`,
      available: mpEnabled,
      unavailableReason: 'Integración pendiente de configuración.',
    },
    {
      id: 'transfer',
      label: 'Transferencia bancaria',
      description: site.payments.transfer.discountPercent
        ? `${site.payments.transfer.discountPercent}% de descuento. Te enviamos los datos al confirmar.`
        : 'Te mostramos los datos bancarios al confirmar el pedido.',
      available: site.payments.transfer.enabled,
    },
    {
      id: 'whatsapp',
      label: 'Coordinar por WhatsApp',
      description: 'Enviás el pedido armado y coordinamos pago y entrega con una persona.',
      available: true,
    },
  ]
}
