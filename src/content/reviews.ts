/**
 * Reseñas.
 * ⚠️ Las entradas `kind: 'demo'` son CONTENIDO DE PRUEBA: no son clientes reales.
 * Se muestran con una etiqueta visible y desaparecen al poner
 * `site.showDemoReviews = false`. Para publicar reseñas reales agregá entradas
 * `kind: 'real'` con autorización de la persona.
 */
export interface Review {
  id: string
  kind: 'demo' | 'real'
  author: string
  context: string
  quote: string
  productId?: string
}

export const reviews: Review[] = [
  {
    id: 'demo-1',
    kind: 'demo',
    author: 'Nombre de ejemplo',
    context: 'Reseña de prueba',
    quote: 'Acá va la experiencia real de una familia con la compra: qué pidió, cómo fue la atención y la entrega.',
    productId: 'panales-nube-premium',
  },
  {
    id: 'demo-2',
    kind: 'demo',
    author: 'Nombre de ejemplo',
    context: 'Reseña de prueba',
    quote: 'Texto ilustrativo para mostrar el diseño del módulo. Reemplazar por una opinión auténtica y autorizada.',
    productId: 'toallitas-nube-agua',
  },
  {
    id: 'demo-3',
    kind: 'demo',
    author: 'Nombre de ejemplo',
    context: 'Reseña de prueba',
    quote: 'Las reseñas reales ayudan a otras familias a decidir. Este espacio queda listo para cargarlas.',
    productId: 'kit-recien-nacido',
  },
]
