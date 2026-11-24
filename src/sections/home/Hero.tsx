import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { site } from '@/config/site'
import { catalog } from '@/lib/catalog/repository'
import { HeroIntro } from './HeroIntro'
import { HeroVisual } from './HeroVisual'

/**
 * Orden mobile: titular → CTAs → producto → texto (el producto entra en la primera pantalla).
 * Orden desktop: texto a la izquierda, producto a la derecha.
 */
export function Hero() {
  const words = catalog.listCategories().map((c) => c.name)
  const trust = site.benefits.filter((b) => b.enabled).slice(0, 3)

  return (
    <section aria-labelledby="hero-title" className="grain relative -mt-[4.5rem] overflow-hidden pt-[4.5rem]">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(70% 60% at 78% 38%, #f3eadc 0%, rgba(243,234,220,0) 70%), radial-gradient(60% 50% at 10% 90%, #e8eee7 0%, rgba(232,238,231,0) 70%), linear-gradient(180deg, #f8f3eb 0%, #fbf8f3 100%)',
        }}
      />

      <HeroIntro className="container-x flex flex-col pb-10 pt-4 lg:grid lg:min-h-[calc(100svh-6.75rem)] lg:grid-cols-12 lg:grid-rows-[1fr_auto_auto_auto_1fr] lg:gap-x-6 lg:pb-16 lg:pt-4">
        <div className="relative z-10 lg:col-span-6 lg:row-start-2">
          <p data-intro className="eyebrow mb-5 inline-flex items-center gap-2 text-accent sm:mb-6">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" /> Pañalera online · Argentina
          </p>
          <h1 id="hero-title" className="font-display text-[clamp(2.6rem,5.1vw,5.75rem)] leading-[0.94] tracking-[-0.035em]">
            <span data-intro-line className="block overflow-hidden pb-[0.06em]">
              <span className="block">Lo esencial</span>
            </span>
            <span data-intro-line className="block overflow-hidden pb-[0.06em]">
              <span className="block">
                para tu <em className="font-display-italic text-accent">bebé,</em>
              </span>
            </span>
            <span data-intro-line className="block overflow-hidden pb-[0.06em]">
              <span className="block">elegido con calma.</span>
            </span>
          </h1>
        </div>

        <p
          data-intro
          className="order-4 mt-2 max-w-[34rem] text-[1.0625rem] leading-relaxed text-ink-soft sm:text-[1.125rem] lg:order-none lg:col-span-6 lg:row-start-3 lg:mt-7"
        >
          Pañales, toallitas, higiene y accesorios seleccionados uno por uno. Comprá en minutos y recibí atención real por
          WhatsApp cuando la necesites.
        </p>

        <div data-intro className="order-2 mt-7 flex gap-3 lg:order-none lg:col-span-6 lg:row-start-4 lg:mt-9">
          <Link href="/categoria/panales" className="btn btn-primary h-13 flex-1 px-5 sm:h-14 sm:flex-none sm:px-7 sm:text-[1rem]">
            Comprar pañales <ArrowRight size={18} className="hidden sm:block" />
          </Link>
          <Link href="/packs" className="btn btn-ghost h-13 flex-1 px-5 sm:h-14 sm:flex-none sm:px-7 sm:text-[1rem]">
            Armar mi pack
          </Link>
        </div>

        <ul data-intro className="order-5 mt-8 flex flex-wrap gap-x-6 gap-y-2 text-[0.8125rem] text-ink-soft lg:order-none lg:col-span-6 lg:row-start-5 lg:mt-10 lg:self-start">
          {trust.map((t) => (
            <li key={t.id} className="flex items-center gap-2">
              <span className="h-1 w-1 rounded-full bg-accent" />
              {t.title}
            </li>
          ))}
        </ul>

        <div className="relative order-3 -mx-2 mt-4 lg:order-none lg:col-span-6 lg:col-start-7 lg:row-span-5 lg:row-start-1 lg:mx-0 lg:mt-0 lg:h-[min(78vh,52rem)] lg:self-center">
          <HeroVisual featuredId="panales-nube-premium" />
        </div>
      </HeroIntro>

      {/* Marquesina de categorías */}
      <div className="relative border-y hairline bg-paper/60 py-4 backdrop-blur" aria-hidden="true">
        <div className="flex w-max animate-marquee gap-10 whitespace-nowrap font-display-italic text-[1.5rem] text-ink-soft/70">
          {[...words, ...words, ...words, ...words].map((w, i) => (
            <span key={i} className="flex items-center gap-10">
              {w}
              <span className="h-1.5 w-1.5 rounded-full bg-accent/50" />
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
