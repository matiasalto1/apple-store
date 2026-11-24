/**
 * ─────────────────────────────────────────────────────────────
 *  CONFIGURACIÓN COMERCIAL
 * ─────────────────────────────────────────────────────────────
 *  Todo lo que la tienda promete al cliente sale de acá.
 *  Si un beneficio no está confirmado, dejalo en `enabled: false`
 *  y desaparece de la web. No hay textos comerciales dispersos.
 *
 *  ⚠️ Los valores marcados con TODO son placeholders.
 */
import { brand } from './brand'

export const site = {
  /** Barra superior. `null` para ocultarla. */
  announcement: {
    enabled: true,
    // Mientras el catálogo sea de demostración, este aviso se muestra en lugar del mensaje comercial.
    demoNotice: 'Catálogo de demostración · productos y precios de ejemplo',
    message: 'Atención personalizada por WhatsApp de lunes a sábado',
  },

  contact: {
    // TODO: número real en formato internacional, sin + ni espacios (54 9 + área + número).
    whatsapp: '5491100000000',
    whatsappDisplay: '+54 9 11 0000-0000',
    // TODO: email real
    email: 'hola@tu-dominio.com.ar',
    hours: 'Lunes a viernes de 9 a 18 h · Sábados de 9 a 13 h',
    // TODO: ciudad / zona de despacho
    location: 'Buenos Aires, Argentina',
  },

  social: {
    // TODO: reemplazar por los perfiles reales. Dejar '' para ocultar el ícono.
    instagram: 'https://www.instagram.com/',
    instagramHandle: '@tumarca',
    tiktok: '',
    facebook: '',
  },

  /**
   * Beneficios que se muestran en Home, ficha de producto y carrito.
   * Redactados sin cifras: completá con datos reales antes de prometer plazos o montos.
   */
  benefits: [
    {
      id: 'envios',
      enabled: true,
      icon: 'truck',
      title: 'Envíos a domicilio',
      text: 'Coordinamos la entrega con vos. Consultá zonas, plazos y costos antes de comprar.',
      href: '/ayuda/envios',
    },
    {
      id: 'pagos',
      enabled: true,
      icon: 'card',
      title: 'Medios de pago',
      text: 'Transferencia bancaria y Mercado Pago. Te contamos todas las opciones.',
      href: '/ayuda/medios-de-pago',
    },
    {
      id: 'atencion',
      enabled: true,
      icon: 'chat',
      title: 'Atención personalizada',
      text: 'Personas reales que te ayudan a elegir talle, cantidad y reposición.',
      href: '/ayuda',
    },
    {
      id: 'segura',
      enabled: true,
      icon: 'shield',
      title: 'Compra segura',
      text: 'Revisás tu pedido completo antes de confirmar. Sin cargos ocultos.',
      href: '/ayuda/terminos',
    },
  ],

  shipping: {
    /** Monto (ARS) a partir del cual el envío es gratis. `null` = no se promete envío gratis. */
    freeShippingThreshold: null as number | null,
    /** Permite elegir retiro en un punto propio en el checkout. */
    pickupEnabled: false,
    pickupAddress: '',
  },

  payments: {
    transfer: {
      enabled: true,
      /** % de descuento por transferencia. `null` = sin descuento. */
      discountPercent: null as number | null,
      // TODO: datos bancarios reales. Se muestran al confirmar el pedido.
      holder: 'Titular de la cuenta',
      bank: 'Banco',
      cbu: '0000000000000000000000',
      alias: 'tu.alias.aqui',
    },
    mercadopago: {
      /** Se activa sola cuando existe MERCADOPAGO_ACCESS_TOKEN en el servidor. Ver src/lib/payments. */
      label: 'Mercado Pago',
    },
    cards: {
      label: 'Tarjetas de crédito y débito',
      note: 'Se procesan a través de Mercado Pago.',
    },
    /** Logos/nombres que se listan en el footer. */
    accepted: ['Transferencia', 'Mercado Pago', 'Visa', 'Mastercard', 'American Express'],
  },

  /** Promociones automáticas del carrito. Vacío = ninguna. */
  promotions: [] as Array<{
    id: string
    label: string
    type: 'percent'
    value: number
    minSubtotal?: number
  }>,

  /** Muestra reseñas de demostración (claramente marcadas). Apagar cuando haya reseñas reales. */
  showDemoReviews: true,

  newsletter: {
    title: 'Una carta por mes, sin ruido.',
    text: 'Reposiciones, novedades y guías prácticas para cada etapa. Te podés dar de baja cuando quieras.',
  },

  nav: [
    { label: 'Pañales', href: '/categoria/panales' },
    { label: 'Higiene', href: '/categoria/higiene' },
    { label: 'Accesorios', href: '/categoria/accesorios' },
    { label: 'Packs y ofertas', href: '/packs' },
    { label: 'Nuestra marca', href: '/marca' },
  ],
} as const

export const seo = {
  defaultTitle: `${brand.name} — ${brand.descriptor} online | Pañales, higiene y accesorios para bebés`,
  titleTemplate: `%s | ${brand.name}`,
  description:
    'Pañales, toallitas, cremas, higiene y accesorios para bebés, seleccionados con criterio. Comprá online en Argentina y recibí atención personalizada por WhatsApp.',
}

export type SiteConfig = typeof site
