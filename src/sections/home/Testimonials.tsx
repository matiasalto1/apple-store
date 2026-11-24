import { Info, Quote } from 'lucide-react'
import { site } from '@/config/site'
import { reviews } from '@/content/reviews'
import { brandName, catalog } from '@/lib/catalog/repository'
import { Reveal } from '@/components/ui/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'

export function Testimonials() {
  const list = reviews.filter((r) => r.kind === 'real' || site.showDemoReviews)
  if (!list.length) return null
  const hasDemo = list.some((r) => r.kind === 'demo')

  return (
    <section aria-labelledby="reviews-title" className="container-x pt-24 sm:pt-32">
      <SectionHeading id="reviews-title" eyebrow="Opiniones" title={['Lo que cuentan', <em key="e" className="font-display-italic text-accent">las familias.</em>]} />

      {hasDemo && (
        <p className="mt-6 inline-flex items-start gap-2 rounded-2xl border border-dashed border-[var(--line-strong)] px-4 py-3 text-[0.875rem] text-ink-soft">
          <Info size={17} className="mt-0.5 shrink-0" />
          Contenido de prueba: estas reseñas son ilustrativas y no corresponden a clientes reales.
        </p>
      )}

      <ul className="mt-10 grid gap-4 md:grid-cols-3">
        {list.map((r, i) => {
          const p = r.productId ? catalog.getProductById(r.productId) : undefined
          return (
            <li key={r.id}>
              <Reveal delay={i * 0.08} className="h-full">
                <figure className="relative flex h-full flex-col justify-between gap-10 rounded-[var(--radius-card)] bg-ivory p-7 sm:p-8">
                  {r.kind === 'demo' && (
                    <span className="absolute right-5 top-5 rounded-full border border-dashed border-stone/50 px-2.5 py-1 text-[0.6875rem] font-semibold uppercase tracking-wider text-stone">
                      Demo
                    </span>
                  )}
                  <div>
                    <Quote size={28} className="text-accent/60" strokeWidth={1.5} />
                    <blockquote className="mt-5 font-display text-[1.375rem] leading-[1.3]">“{r.quote}”</blockquote>
                  </div>
                  <figcaption className="flex items-center gap-3">
                    <span aria-hidden="true" className="grid h-11 w-11 place-items-center rounded-full bg-sand font-display-italic text-[1.1rem] text-ink-soft">
                      {r.author.charAt(0)}
                    </span>
                    <span>
                      <span className="block font-semibold">{r.author}</span>
                      <span className="block text-[0.8125rem] text-stone">
                        {r.context}
                        {p ? ` · ${brandName(p)} ${p.name}` : ''}
                      </span>
                    </span>
                  </figcaption>
                </figure>
              </Reveal>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
