import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { brandName, catalog, primaryImage, priceRange } from '@/lib/catalog/repository'
import { formatPrice } from '@/lib/format'
import { productJsonLd } from '@/lib/seo'
import { ProductDetail } from '@/components/product/ProductDetail'
import { ProductCarousel } from '@/components/product/ProductCarousel'
import { JsonLd } from '@/components/seo/JsonLd'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { SectionHeading } from '@/components/ui/SectionHeading'

type Props = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return catalog.listProducts().map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const p = catalog.getProductBySlug(slug)
  if (!p) return {}
  const title = `${brandName(p)} ${p.name}`
  const description = `${p.short} Desde ${formatPrice(priceRange(p).min)}. ${p.description}`.slice(0, 158)
  const img = primaryImage(p)
  return {
    title,
    description,
    alternates: { canonical: `/producto/${p.slug}` },
    openGraph: { title, description, url: `/producto/${p.slug}`, images: [{ url: img.src, width: img.width, height: img.height, alt: img.alt }] },
  }
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params
  const product = catalog.getProductBySlug(slug)
  if (!product) notFound()
  const category = catalog.listCategories().find((c) => product.categoryIds.includes(c.id))
  const related = catalog
    .listProducts()
    .filter((p) => p.id !== product.id && p.categoryIds.some((c) => product.categoryIds.includes(c)))
    .sort((a, b) => a.rank - b.rank)
    .slice(0, 8)
  const jsonLd = productJsonLd(product)

  return (
    <>
      <div className="container-x pt-8 sm:pt-12">
        <Breadcrumbs
          items={[
            ...(category ? [{ label: category.name, href: `/categoria/${category.slug}` }] : [{ label: 'Tienda', href: '/tienda' }]),
            { label: product.name, href: `/producto/${product.slug}` },
          ]}
        />
        <div className="mt-6">
          <ProductDetail product={product} />
        </div>
      </div>
      {related.length > 0 && (
        <section aria-labelledby="related-title" className="container-x pt-24 sm:pt-32">
          <SectionHeading id="related-title" eyebrow="También te puede servir" title={['Completá tu pedido']} />
          <div className="mt-10">
            <ProductCarousel products={related} label="Productos relacionados" />
          </div>
        </section>
      )}
      {jsonLd && <JsonLd data={jsonLd} />}
    </>
  )
}
