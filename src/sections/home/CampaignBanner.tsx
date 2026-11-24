'use client'

import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRef } from 'react'
import { catalog, priceRange, primaryImage } from '@/lib/catalog/repository'
import { formatPrice } from '@/lib/format'

/** Banner de campaña editorial con parallax. Editá producto y textos acá. */
const CAMPAIGN = {
  productId: 'panales-nube-noche',
  eyebrow: 'Línea Noche',
  title: ['Noches largas,', 'sueño tranquilo.'],
  text: 'Pañales con núcleo de mayor capacidad y ajuste firme, pensados para las horas de descanso de toda la familia.',
  cta: 'Conocer la línea Noche',
}

export function CampaignBanner() {
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [80, -80])
  const rotate = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [-6, 4])
  const x = useTransform(scrollYProgress, [0, 1], reduce ? ['0%', '0%'] : ['6%', '-18%'])
  const product = catalog.getProductById(CAMPAIGN.productId)
  if (!product) return null
  const img = primaryImage(product)

  return (
    <section ref={ref} aria-labelledby="campaign-title" className="px-2 pt-24 sm:px-3 sm:pt-32">
      <div className="grain relative mx-auto max-w-[92rem] overflow-hidden rounded-[2rem] bg-[#262d33] text-paper sm:rounded-[2.5rem]">
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{ background: 'radial-gradient(60% 70% at 72% 55%, #3c4852 0%, rgba(38,45,51,0) 70%), radial-gradient(40% 40% at 15% 15%, #313a42 0%, rgba(38,45,51,0) 70%)' }}
        />
        <motion.p
          aria-hidden="true"
          style={{ x }}
          className="pointer-events-none absolute bottom-[-0.12em] left-0 whitespace-nowrap font-display-italic text-[22vw] leading-none text-paper/[0.045]"
        >
          buenas noches · buenas noches
        </motion.p>

        <div className="relative grid items-center gap-6 px-6 py-14 sm:px-12 sm:py-20 lg:grid-cols-2 lg:px-20 lg:py-28">
          <div className="relative z-10 order-2 lg:order-1">
            <p className="eyebrow mb-5 text-[#d9c8a9]">{CAMPAIGN.eyebrow}</p>
            <h2 id="campaign-title" className="font-display text-display">
              {CAMPAIGN.title.map((l, i) => (
                <span key={i} className={i === 1 ? 'block font-display-italic text-[#d9c8a9]' : 'block'}>
                  {l}
                </span>
              ))}
            </h2>
            <p className="mt-6 max-w-md text-[1.0625rem] text-paper/70">{CAMPAIGN.text}</p>
            <div className="mt-9 flex flex-wrap items-center gap-5">
              <Link href={`/producto/${product.slug}`} className="btn h-14 bg-paper px-7 text-ink hover:bg-[#d9c8a9]">
                {CAMPAIGN.cta} <ArrowRight size={18} />
              </Link>
              <span className="text-[0.9375rem] text-paper/60">Desde {formatPrice(priceRange(product).min)}</span>
            </div>
          </div>
          <motion.div style={{ y, rotate }} className="relative order-1 mx-auto aspect-square w-[78%] max-w-[34rem] lg:order-2 lg:w-full">
            <div aria-hidden="true" className="absolute inset-[12%] rounded-full bg-[#d9c8a9]/15 blur-3xl" />
            <Image src={img.src} alt={img.alt} fill sizes="(min-width: 1024px) 40vw, 80vw" className="object-contain drop-shadow-[0_40px_60px_rgba(0,0,0,0.35)]" />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
