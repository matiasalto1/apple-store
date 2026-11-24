import { ArrowUpRight } from 'lucide-react'
import Link from 'next/link'
import { catalog, productsInCategory } from '@/lib/catalog/repository'
import { cn } from '@/lib/format'
import { ProductImage } from '@/components/product/ProductImage'
import { Reveal } from '@/components/ui/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'

export function Categories() {
  const cats = catalog.listCategories().filter((c) => c.featured)

  return (
    <section aria-labelledby="cat-title" className="container-x pt-24 sm:pt-32">
      <SectionHeading
        id="cat-title"
        eyebrow="Categorías"
        title={['Todo en un solo lugar,', <em key="e" className="font-display-italic text-accent">ordenado por momento.</em>]}
        action={
          <Link href="/tienda" className="btn btn-ghost">
            Ver todo el catálogo <ArrowUpRight size={17} />
          </Link>
        }
      />

      <ul className="no-scrollbar -mx-4 mt-12 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-4 px-4 pb-2 sm:-mx-7 sm:px-7 md:mx-0 md:grid md:snap-none md:grid-cols-4 md:auto-rows-[minmax(15rem,1fr)] md:gap-4 md:overflow-visible md:px-0 lg:auto-rows-[minmax(17rem,1fr)]">
        {cats.map((c, i) => {
          const hero = c.heroProductId ? catalog.getProductById(c.heroProductId) : undefined
          const count = productsInCategory(c.id).length
          const big = i === 0
          return (
            <li
              key={c.id}
              className={cn('w-[64%] shrink-0 snap-start sm:w-[40%] md:w-auto', big && 'md:col-span-2 md:row-span-2', (i === 1 || i === cats.length - 1) && 'md:col-span-2')}
            >
              <Reveal delay={i * 0.05} className="h-full">
                <Link
                  href={`/categoria/${c.slug}`}
                  className="group relative flex h-full min-h-[19rem] flex-col justify-between overflow-hidden rounded-[var(--radius-card)] p-5 sm:p-6"
                  style={{ background: hero?.visual.backdrop ?? '#ece3d4' }}
                >
                  <div className="relative z-10 flex items-start justify-between gap-4">
                    <div>
                      <h3 className={cn('font-display leading-[1]', big ? 'text-[clamp(2.25rem,4vw,3.5rem)]' : 'text-[1.75rem]')}>{c.name}</h3>
                      <p className="mt-2 max-w-[16rem] text-[0.875rem] text-ink-soft">{c.blurb}</p>
                    </div>
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-paper/70 transition-all duration-500 group-hover:rotate-45 group-hover:bg-ink group-hover:text-paper">
                      <ArrowUpRight size={17} />
                    </span>
                  </div>
                  {hero && (
                    <ProductImage
                      product={hero}
                      backdrop={false}
                      sizes={big ? '(min-width: 768px) 45vw, 70vw' : '(min-width: 768px) 22vw, 60vw'}
                      className={cn(
                        'pointer-events-none absolute',
                        big ? 'inset-x-[8%] bottom-[-6%] top-[22%]' : 'bottom-[-10%] right-[-8%] h-[72%] w-[72%]',
                      )}
                      imgClassName="transition-transform duration-[1.4s] ease-[var(--ease-out-expo)] group-hover:-translate-y-2 group-hover:scale-[1.04]"
                    />
                  )}
                  <p className="relative z-10 text-[0.75rem] font-semibold text-ink-soft">
                    {count} {count === 1 ? 'producto' : 'productos'}
                  </p>
                </Link>
              </Reveal>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
