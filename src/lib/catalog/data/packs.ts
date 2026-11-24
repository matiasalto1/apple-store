import type { Pack } from '../types'

/**
 * Packs inteligentes. El precio se calcula sumando los productos.
 * `discountPercent` queda en null: completalo solo si existe una promoción real.
 */
export const packs: Pack[] = [
  {
    id: 'pack-recien-nacido',
    slug: 'recien-nacido',
    name: 'Recién nacido',
    moment: 'Semanas 0 a 4',
    description: 'Pañales RN, toallitas sin perfume, crema para el cambio y un biberón de 150 ml.',
    items: [
      { productId: 'panales-nube-premium', variantId: 'nube-prem-rn', quantity: 2 },
      { productId: 'toallitas-nube-agua', variantId: 'nube-agua-3-x-80', quantity: 1 },
      { productId: 'crema-cambio-brote', variantId: 'brote-zinc-60-g', quantity: 1 },
      { productId: 'biberon-lumi', variantId: 'lumi-bib-150-ml', quantity: 1 },
    ],
    discountPercent: null,
    coverProductId: 'kit-recien-nacido',
    tone: '#e7dfd1',
  },
  {
    id: 'pack-primer-mes',
    slug: 'primer-mes',
    name: 'Primer mes',
    moment: 'Reposición completa',
    description: 'Pañales RN y P para la transición, toallitas para todo el mes y baño suave.',
    items: [
      { productId: 'panales-nube-premium', variantId: 'nube-prem-rn', quantity: 2 },
      { productId: 'panales-nube-premium', variantId: 'nube-prem-p', quantity: 2 },
      { productId: 'toallitas-nube-agua', variantId: 'nube-agua-3-x-80', quantity: 2 },
      { productId: 'bano-suave-brote', variantId: 'brote-bano-250-ml', quantity: 1 },
    ],
    discountPercent: null,
    coverProductId: 'panales-nube-premium',
    tone: '#e6ddcd',
  },
  {
    id: 'pack-reposicion',
    slug: 'reposicion',
    name: 'Reposición',
    moment: 'Cada mes, sin pensar',
    description: 'Lo que más se repite: pañales en tu talle y toallitas. Cambiás el talle en el carrito.',
    items: [
      { productId: 'panales-nube-premium', variantId: 'nube-prem-m', quantity: 3 },
      { productId: 'toallitas-nube-agua', variantId: 'nube-agua-3-x-80', quantity: 2 },
    ],
    discountPercent: null,
    coverProductId: 'toallitas-nube-agua',
    tone: '#e9e3d8',
  },
  {
    id: 'pack-salida',
    slug: 'salida',
    name: 'Salida',
    moment: 'Para el bolso',
    description: 'Cambiador plegable, toallitas formato bolso y crema en tubo chico.',
    items: [
      { productId: 'cambiador-lino', variantId: 'lino-camb-arena', quantity: 1 },
      { productId: 'toallitas-brote-aloe', variantId: 'brote-aloe-x50', quantity: 2 },
      { productId: 'crema-cambio-brote', variantId: 'brote-zinc-60-g', quantity: 1 },
    ],
    discountPercent: null,
    coverProductId: 'cambiador-lino',
    tone: '#ebe3d6',
  },
  {
    id: 'pack-higiene',
    slug: 'higiene',
    name: 'Higiene',
    moment: 'Rutina del baño',
    description: 'Baño cabeza a pies, crema hidratante, aceite para masajes e hisopos.',
    items: [
      { productId: 'bano-suave-brote', variantId: 'brote-bano-500-ml', quantity: 1 },
      { productId: 'crema-hidratante-brote', variantId: 'brote-hidra-200-ml', quantity: 1 },
      { productId: 'aceite-masaje-lumi', variantId: 'lumi-aceite-120-ml', quantity: 1 },
      { productId: 'hisopos-brote', variantId: 'brote-hisopos-x100', quantity: 1 },
    ],
    discountPercent: null,
    coverProductId: 'bano-suave-brote',
    tone: '#e2e6df',
  },
  {
    id: 'pack-regalo',
    slug: 'regalo',
    name: 'Regalo',
    moment: 'Para un nacimiento',
    description: 'El kit de bienvenida y el bolso cambiador. Un regalo que se usa todos los días.',
    items: [
      { productId: 'kit-recien-nacido', variantId: 'kit-rn-caja', quantity: 1 },
      { productId: 'bolso-cambiador-lino', variantId: 'lino-bolso-arena', quantity: 1 },
    ],
    discountPercent: null,
    coverProductId: 'bolso-cambiador-lino',
    tone: '#ddd6cb',
  },
]
