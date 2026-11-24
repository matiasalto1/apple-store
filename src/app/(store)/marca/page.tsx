import type { Metadata } from 'next'
import Link from 'next/link'
import { brand } from '@/config/brand'
import { brandStory } from '@/content/brand-story'
import { catalog } from '@/lib/catalog/repository'
import { generalMessage } from '@/lib/whatsapp'
import { ProductImage } from '@/components/product/ProductImage'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { Reveal, RevealLines } from '@/components/ui/Reveal'
import { WhatsAppButton } from '@/components/whatsapp/WhatsAppButton'
import { Benefits } from '@/sections/home/Benefits'

export const metadata: Metadata = {
  title: 'Nuestra marca',
  description: `Conocé ${brand.name}: una pañalera online que selecciona pocos productos, buenos, y acompaña a las familias con atención real.`,
  alternates: { canonical: '/marca' },
}

export default function BrandPage() {
  const hero = catalog.getProductById('kit-recien-nacido')
  return (
    <>
      <div className="container-x pt-8 sm:pt-12">
        <Breadcrumbs items={[{ label: 'Nuestra marca', href: '/marca' }]} />
        <header className="mt-8 grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="eyebrow mb-5 text-accent">Nuestra marca</p>
            <h1 className="font-display text-mega">
              <RevealLines lines={['Cuidar', <em key="e" className="font-display-italic text-accent">también es</em>, 'elegir.']} />
            </h1>
          </div>
          {hero && <ProductImage product={hero} priority className="aspect-[4/3] rounded-[2rem]" sizes="(min-width:1024px) 45vw, 100vw" />}
        </header>

        <section className="mx-auto max-w-3xl pt-24 sm:pt-32">
          <Reveal>
            <p className="font-display text-[clamp(1.6rem,3vw,2.5rem)] leading-[1.25]">
              {brand.name} nace de una idea simple: cuando llega un bebé, sobran opciones y falta tiempo. Por eso seleccionamos
              pocos productos, los que realmente funcionan, y te acompañamos para que elegir sea fácil.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-8 text-[1.0625rem] text-ink-soft">
              [completar: historia real de la tienda, quiénes están detrás, desde dónde despachan y qué los diferencia.]
            </p>
          </Reveal>
        </section>

        <ol className="grid gap-4 pt-20 sm:grid-cols-2 lg:grid-cols-4">
          {brandStory.steps.map((s, i) => (
            <li key={s.id}>
              <Reveal delay={i * 0.06} className="h-full rounded-[var(--radius-card)] bg-ivory p-7">
                <p className="eyebrow text-stone">{s.kicker}</p>
                <h2 className="mt-4 font-display text-[1.6rem] leading-[1.1]">{s.title}</h2>
                <p className="mt-3 text-[0.9375rem] text-ink-soft">{s.text}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
      <Benefits />
      <div className="container-x flex flex-col items-center gap-5 pt-24 text-center">
        <h2 className="font-display text-headline">¿Tenés una duda? Hablemos.</h2>
        <div className="flex flex-wrap justify-center gap-3">
          <WhatsAppButton message={generalMessage()}>Escribinos por WhatsApp</WhatsAppButton>
          <Link href="/tienda" className="btn btn-ghost">
            Ir a la tienda
          </Link>
        </div>
      </div>
    </>
  )
}
