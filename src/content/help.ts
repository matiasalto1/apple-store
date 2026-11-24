/**
 * Preguntas frecuentes y páginas de ayuda.
 * ⚠️ TEXTOS BASE: revisalos y completalos con las condiciones reales del negocio
 * (plazos, costos, zonas, datos fiscales) antes de publicar. Donde dice
 * [completar] falta un dato que solo la tienda puede confirmar.
 */
import { brand } from '@/config/brand'
import { site } from '@/config/site'

export const faq: { q: string; a: string }[] = [
  {
    q: '¿Cómo elijo el talle de pañal?',
    a: 'Guiate por el peso del bebé y no por la edad. Cada producto indica el rango de kilos por talle. Si está en el límite entre dos talles, conviene el más grande. Si tenés dudas, escribinos por WhatsApp y te ayudamos.',
  },
  {
    q: '¿Cómo hago un pedido?',
    a: 'Agregá productos al carrito, revisá cantidades y talles y finalizá la compra. También podés enviarnos el pedido armado por WhatsApp desde el carrito y lo coordinamos con vos.',
  },
  {
    q: '¿Qué medios de pago aceptan?',
    a: `Por el momento: ${site.payments.accepted.join(', ')}. Los detalles de cada medio están en la página de medios de pago.`,
  },
  {
    q: '¿Hacen envíos? ¿Cuánto tardan?',
    a: 'Coordinamos el envío según tu zona. El costo y el plazo se confirman antes de que pagues. [completar con zonas y plazos reales]',
  },
  {
    q: '¿Puedo cambiar un producto?',
    a: 'Sí, siempre que esté sin abrir y en su empaque original. Mirá las condiciones completas en la página de cambios y devoluciones.',
  },
  {
    q: '¿Los precios incluyen IVA?',
    a: 'Sí. Todos los precios se muestran en pesos argentinos con IVA incluido.',
  },
  {
    q: '¿Necesito crear una cuenta?',
    a: 'No. Podés comprar sin registrarte: tu carrito y tus favoritos se guardan en este dispositivo.',
  },
]

export interface HelpPage {
  slug: string
  title: string
  description: string
  sections: { heading: string; body: string[] }[]
}

export const helpPages: HelpPage[] = [
  {
    slug: 'envios',
    title: 'Envíos',
    description: 'Cómo funcionan los envíos: zonas, costos y plazos.',
    sections: [
      {
        heading: 'Cómo funciona',
        body: [
          'Una vez confirmado tu pedido, te contactamos para coordinar la entrega. El costo y el plazo dependen de tu zona y se informan antes del pago.',
          '[completar: zonas de cobertura, empresas de envío, plazos estimados y costos]',
        ],
      },
      {
        heading: 'Seguimiento',
        body: ['Te avisamos por WhatsApp o email cuando el pedido sale y, si corresponde, te enviamos el código de seguimiento.'],
      },
      ...(site.shipping.freeShippingThreshold
        ? [{ heading: 'Envío gratis', body: [`Los pedidos que superen el monto indicado en el carrito tienen envío gratis.`] }]
        : []),
    ],
  },
  {
    slug: 'cambios-y-devoluciones',
    title: 'Cambios y devoluciones',
    description: 'Condiciones para cambiar o devolver un producto.',
    sections: [
      {
        heading: 'Cambios',
        body: [
          'Podés cambiar productos sin abrir, en su empaque original y en buen estado. Por razones de higiene, no se aceptan cambios de productos abiertos o usados.',
          '[completar: plazo para solicitar el cambio y quién asume el costo del envío]',
        ],
      },
      {
        heading: 'Derecho de arrepentimiento',
        body: [
          'De acuerdo con la Ley 24.240 de Defensa del Consumidor, podés revocar la compra dentro de los 10 días corridos desde que recibiste el producto, sin costo y sin necesidad de explicar el motivo.',
          'Para iniciarlo, escribinos a ' + site.contact.email + ' o por WhatsApp indicando tu número de pedido.',
        ],
      },
    ],
  },
  {
    slug: 'medios-de-pago',
    title: 'Medios de pago',
    description: 'Formas de pago disponibles para tus compras.',
    sections: [
      {
        heading: 'Transferencia bancaria',
        body: [
          'Al confirmar el pedido te mostramos los datos bancarios. Una vez acreditada la transferencia, preparamos tu envío.',
          ...(site.payments.transfer.discountPercent ? [`Pagando por transferencia tenés ${site.payments.transfer.discountPercent}% de descuento.`] : []),
        ],
      },
      {
        heading: 'Mercado Pago y tarjetas',
        body: [
          `${site.payments.cards.label}. ${site.payments.cards.note}`,
          'Mientras terminamos la integración online, podés coordinar el pago con Mercado Pago por WhatsApp.',
        ],
      },
    ],
  },
  {
    slug: 'terminos',
    title: 'Términos y condiciones',
    description: `Condiciones generales de uso y compra en ${brand.name}.`,
    sections: [
      {
        heading: 'Generalidades',
        body: [
          `Estas condiciones regulan el uso del sitio y las compras realizadas en ${brand.name}. [completar: razón social, CUIT y domicilio legal]`,
          'Los precios publicados están expresados en pesos argentinos e incluyen IVA. Pueden modificarse sin previo aviso, pero se respeta el precio vigente al momento de confirmar el pedido.',
        ],
      },
      {
        heading: 'Disponibilidad',
        body: ['Todas las compras están sujetas a disponibilidad de stock. Si un producto no está disponible, te contactamos para ofrecerte una alternativa o el reintegro.'],
      },
    ],
  },
  {
    slug: 'privacidad',
    title: 'Política de privacidad',
    description: 'Cómo tratamos tus datos personales.',
    sections: [
      {
        heading: 'Datos que recopilamos',
        body: [
          'Solo pedimos los datos necesarios para procesar tu pedido y contactarte: nombre, email, teléfono y dirección de entrega.',
          'El carrito y los favoritos se guardan en tu propio dispositivo (almacenamiento local del navegador).',
        ],
      },
      {
        heading: 'Tus derechos',
        body: [
          'Podés solicitar el acceso, la rectificación o la eliminación de tus datos en cualquier momento escribiendo a ' + site.contact.email + ', conforme a la Ley 25.326 de Protección de Datos Personales.',
        ],
      },
    ],
  },
]
