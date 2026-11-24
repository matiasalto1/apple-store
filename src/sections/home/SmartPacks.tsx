import { ArrowUpRight } from 'lucide-react'
import Link from 'next/link'
import { catalog } from '@/lib/catalog/repository'
import { PackCard } from '@/components/packs/PackCard'
import { Reveal } from '@/components/ui/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'

export function SmartPacks() {
  const packs = catalog.listPacks()
  return (
    <section aria-labelledby="packs-title" className="container-x pt-24 sm:pt-32">
      <SectionHeading
        id="packs-title"
        eyebrow="Packs inteligentes"
        title={['Armados para cada', <em key="e" className="font-display-italic text-accent">necesidad concreta.</em>]}
        text="Combinaciones pensadas por etapa. Las agregás en un clic y después ajustás talles y cantidades desde el carrito."
        action={
          <Link href="/packs" className="btn btn-ghost">
            Todos los packs <ArrowUpRight size={17} />
          </Link>
        }
      />
      <ul className="no-scrollbar -mx-4 mt-12 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-4 px-4 pb-4 sm:-mx-7 sm:gap-5 sm:px-7 lg:mx-0 lg:grid lg:grid-cols-3 lg:overflow-visible lg:px-0">
        {packs.map((p, i) => (
          <li key={p.id} className="w-[82%] shrink-0 snap-start sm:w-[46%] lg:w-auto">
            <Reveal delay={(i % 3) * 0.06} className="h-full">
              <PackCard pack={p} />
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  )
}
