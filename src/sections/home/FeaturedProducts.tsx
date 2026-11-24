import { ArrowUpRight } from 'lucide-react'
import Link from 'next/link'
import { catalog } from '@/lib/catalog/repository'
import { ProductCarousel } from '@/components/product/ProductCarousel'
import { SectionHeading } from '@/components/ui/SectionHeading'

export function FeaturedProducts() {
  const products = catalog
    .listProducts()
    .filter((p) => p.tags.includes('destacado'))
    .sort((a, b) => a.rank - b.rank)

  return (
    <section aria-labelledby="featured-title" className="container-x pt-24 sm:pt-32">
      <SectionHeading
        id="featured-title"
        eyebrow="Selección"
        title={['Los que no pueden faltar']}
        text="Una selección corta de productos que resuelven el día a día. Elegí talle o presentación sin salir de la página."
        action={
          <Link href="/tienda" className="btn btn-ghost">
            Ver catálogo <ArrowUpRight size={17} />
          </Link>
        }
      />
      <div className="mt-12">
        <ProductCarousel products={products} label="Productos destacados" />
      </div>
    </section>
  )
}
