import type { Metadata } from 'next'
import { Suspense } from 'react'
import { catalog } from '@/lib/catalog/repository'
import { CatalogView } from '@/components/catalog/CatalogView'
import { ProductGrid } from '@/components/product/ProductGrid'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'

export const metadata: Metadata = {
  title: 'Tienda: todos los productos para bebés',
  description: 'Catálogo completo de pañales, toallitas, cremas, higiene, alimentación y accesorios para bebés. Filtrá por talle, edad, marca y precio.',
  alternates: { canonical: '/tienda' },
}

export default function ShopPage() {
  const products = catalog.listProducts()
  return (
    <div className="container-x pt-8 sm:pt-12">
      <Breadcrumbs items={[{ label: 'Tienda', href: '/tienda' }]} />
      <header className="mb-10 mt-6 max-w-3xl sm:mb-14">
        <h1 className="font-display text-display">Tienda</h1>
        <p className="mt-4 text-[1.0625rem] text-ink-soft">
          Todo el catálogo en un solo lugar. Filtrá por talle, edad o marca y ordená como prefieras.
        </p>
      </header>
      <Suspense fallback={<ProductGrid products={[...products].sort((a, b) => a.rank - b.rank)} priorityCount={4} />}>
        <CatalogView scope={products} />
      </Suspense>
    </div>
  )
}
