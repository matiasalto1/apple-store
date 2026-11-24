import { brand } from '@/config/brand'
import { site } from '@/config/site'
import { brandName, primaryImage } from '@/lib/catalog/repository'
import type { Product } from '@/lib/catalog/types'

export const absoluteUrl = (path: string) => `${brand.url}${path.startsWith('/') ? path : `/${path}`}`

export function organizationJsonLd() {
  const sameAs = [site.social.instagram, site.social.tiktok, site.social.facebook].filter(
    (u) => u && u !== 'https://www.instagram.com/',
  )
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'OnlineStore',
        '@id': `${brand.url}/#store`,
        name: brand.name,
        url: brand.url,
        logo: absoluteUrl('/icon.svg'),
        description: brand.tagline,
        currenciesAccepted: 'ARS',
        areaServed: { '@type': 'Country', name: 'Argentina' },
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'customer service',
          email: site.contact.email,
          availableLanguage: 'es',
        },
        ...(sameAs.length ? { sameAs } : {}),
      },
      {
        '@type': 'WebSite',
        '@id': `${brand.url}/#website`,
        url: brand.url,
        name: brand.name,
        inLanguage: 'es-AR',
        publisher: { '@id': `${brand.url}/#store` },
        potentialAction: {
          '@type': 'SearchAction',
          target: { '@type': 'EntryPoint', urlTemplate: `${brand.url}/tienda?q={search_term_string}` },
          'query-input': 'required name=search_term_string',
        },
      },
    ],
  }
}

/**
 * Datos estructurados de producto. Solo se publican para productos reales
 * (`demo: false`): Google no debe indexar precios de ejemplo como ofertas.
 */
export function productJsonLd(product: Product) {
  if (product.demo) return null
  const img = primaryImage(product)
  const availability = {
    in_stock: 'https://schema.org/InStock',
    low_stock: 'https://schema.org/LimitedAvailability',
    out_of_stock: 'https://schema.org/OutOfStock',
  }
  return {
    '@context': 'https://schema.org',
    '@type': 'ProductGroup',
    name: `${brandName(product)} ${product.name}`,
    description: product.description,
    url: absoluteUrl(`/producto/${product.slug}`),
    brand: { '@type': 'Brand', name: brandName(product) },
    image: absoluteUrl(img.src),
    productGroupID: product.id,
    variesBy: product.variants.length > 1 ? [product.variants[0].option.name] : undefined,
    hasVariant: product.variants.map((v) => ({
      '@type': 'Product',
      sku: v.sku,
      name: `${brandName(product)} ${product.name} ${v.label}`,
      image: absoluteUrl(img.src),
      offers: {
        '@type': 'Offer',
        price: v.price,
        priceCurrency: 'ARS',
        availability: availability[v.availability],
        url: absoluteUrl(`/producto/${product.slug}?variante=${v.id}`),
        seller: { '@id': `${brand.url}/#store` },
      },
    })),
  }
}
