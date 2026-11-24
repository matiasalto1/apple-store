import type { Metadata } from 'next'
import { catalog, isOnSale } from '@/lib/catalog/repository'
import { PackCard } from '@/components/packs/PackCard'
import { ProductGrid } from '@/components/product/ProductGrid'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { Reveal } from '@/components/ui/Reveal'

export const metadata: Metadata = {
  title: 'Packs y ofertas para bebés',
  description: 'Packs armados por etapa: recién nacido, primer mes, reposición, salida, higiene y regalo. Agregalos en un clic y ajustá talles en el carrito.',
  alternates: { canonical: '/packs' },
}

export default function PacksPage() {
  const packs = catalog.listPacks()
  const offers = catalog.listProducts().filter(isOnSale)
  return (
    <div className="container-x pt-8 sm:pt-12">
      <Breadcrumbs items={[{ label: 'Packs y ofertas', href: '/packs' }]} />
      <header className="mb-12 mt-6 grid gap-6 lg:grid-cols-2 lg:items-end">
        <h1 className="font-display text-display">
          Packs <em className="font-display-italic text-accent">inteligentes</em>
        </h1>
        <p className="max-w-xl text-[1.0625rem] text-ink-soft lg:justify-self-end">
          Combinaciones armadas por etapa para resolver una necesidad completa en una sola compra. El precio es la suma de los
          productos; después podés cambiar talles y cantidades desde el carrito.
        </p>
      </header>
      <ul className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {packs.map((p, i) => (
          <li key={p.id}>
            <Reveal delay={(i % 3) * 0.06} className="h-full">
              <PackCard pack={p} detailed />
            </Reveal>
          </li>
        ))}
      </ul>

      <section aria-labelledby="offers-title" className="pt-24">
        <h2 id="offers-title" className="font-display text-headline">
          Ofertas vigentes
        </h2>
        {offers.length ? (
          <div className="mt-10">
            <ProductGrid products={offers} />
          </div>
        ) : (
          <p className="mt-5 max-w-xl rounded-[var(--radius-card)] bg-ivory p-8 text-ink-soft">
            No hay ofertas activas en este momento. Cuando un producto tenga un precio rebajado vigente, va a aparecer acá automáticamente.
          </p>
        )}
      </section>
    </div>
  )
}
