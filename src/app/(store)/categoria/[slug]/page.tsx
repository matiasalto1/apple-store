import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { catalog, productsInCategory } from '@/lib/catalog/repository'
import { CatalogView } from '@/components/catalog/CatalogView'
import { ProductGrid } from '@/components/product/ProductGrid'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'

type Props = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return catalog.listCategories().map((c) => ({ slug: c.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const c = catalog.getCategoryBySlug(slug)
  if (!c) return {}
  return {
    title: c.seoTitle,
    description: c.seoDescription,
    alternates: { canonical: `/categoria/${c.slug}` },
    openGraph: { title: c.seoTitle, description: c.seoDescription, url: `/categoria/${c.slug}` },
  }
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params
  const category = catalog.getCategoryBySlug(slug)
  if (!category) notFound()
  const products = productsInCategory(category.id)
  const others = catalog.listCategories().filter((c) => c.id !== category.id && c.id !== 'ofertas')

  return (
    <div className="container-x pt-8 sm:pt-12">
      <Breadcrumbs items={[{ label: 'Tienda', href: '/tienda' }, { label: category.name, href: `/categoria/${category.slug}` }]} />
      <header className="mb-8 mt-6 grid gap-6 sm:mb-12 lg:grid-cols-2 lg:items-end">
        <h1 className="font-display text-display">{category.name}</h1>
        <p className="max-w-xl text-[1.0625rem] text-ink-soft lg:justify-self-end">{category.intro}</p>
      </header>
      <nav aria-label="Otras categorías" className="no-scrollbar -mx-4 mb-10 overflow-x-auto px-4 sm:-mx-7 sm:px-7 lg:mx-0 lg:px-0">
        <ul className="flex gap-2">
          {others.map((c) => (
            <li key={c.id} className="shrink-0">
              <Link href={`/categoria/${c.slug}`} className="chip bg-white">
                {c.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <Suspense fallback={<ProductGrid products={products} priorityCount={4} />}>
        <CatalogView scope={products} lockedCategory={category.id} />
      </Suspense>
    </div>
  )
}
