import Link from 'next/link'
import { site } from '@/config/site'
import { BenefitIcon } from '@/components/ui/BenefitIcon'
import { Reveal } from '@/components/ui/Reveal'

/** Beneficios: salen 100% de `site.benefits`. Lo deshabilitado no se muestra. */
export function Benefits() {
  const items = site.benefits.filter((b) => b.enabled)
  if (!items.length) return null
  return (
    <section aria-label="Beneficios" className="container-x pt-24 sm:pt-32">
      <ul className="grid overflow-hidden rounded-[2rem] border hairline bg-white sm:grid-cols-2 lg:grid-cols-4">
        {items.map((b, i) => (
          <li key={b.id} className="border-b hairline last:border-b-0 sm:[&:nth-child(odd)]:border-r lg:border-b-0 lg:border-r lg:last:border-r-0">
            <Reveal delay={i * 0.06} className="h-full">
              <Link href={b.href} className="group flex h-full flex-col gap-5 p-7 transition-colors hover:bg-ivory sm:p-8">
                <span className="grid h-12 w-12 place-items-center rounded-full bg-accent-soft text-accent transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110">
                  <BenefitIcon name={b.icon} />
                </span>
                <div>
                  <h3 className="text-[1.0625rem] font-semibold">{b.title}</h3>
                  <p className="mt-1.5 text-[0.9375rem] text-ink-soft">{b.text}</p>
                </div>
              </Link>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  )
}
