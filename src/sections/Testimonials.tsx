import { useRef, type PointerEvent } from 'react'
import { gsap, MQ, useGSAP } from '@/lib/gsap'
import { TESTIMONIALS, type Testimonial } from '@/data/testimonials'
import { RevealText } from '@/components/ui/RevealText'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { IllustrativeAvatar } from '@/components/ui/IllustrativeAvatar'

function Stars({ n, illustrative }: { n: number; illustrative: boolean }) {
  return (
    <p className="flex gap-1 text-[0.85rem] text-signal" aria-label={`${n} de 5${illustrative ? ' (valoración ilustrativa)' : ''}`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} aria-hidden="true" className={i < n ? '' : 'text-faint'}>
          ★
        </span>
      ))}
    </p>
  )
}

/**
 * Renders either an illustrative scenario or a real testimonial.
 * Swap data in `data/testimonials.ts` — no component changes needed.
 */
export function TestimonialCard({ t, featured = false }: { t: Testimonial; featured?: boolean }) {
  const illustrative = t.kind === 'illustrative'
  const ref = useRef<HTMLElement>(null)

  const onMove = (e: PointerEvent) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const x = e.clientX - r.left
    const y = e.clientY - r.top
    el.style.setProperty('--mx', `${x}px`)
    el.style.setProperty('--my', `${y}px`)
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    el.style.setProperty('--rx', `${((y / r.height) - 0.5) * -3}deg`)
    el.style.setProperty('--ry', `${((x / r.width) - 0.5) * 3}deg`)
  }
  const onLeave = () => {
    ref.current?.style.setProperty('--rx', '0deg')
    ref.current?.style.setProperty('--ry', '0deg')
  }

  return (
    <figure
      ref={ref}
      data-testimonial
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className="spotlight relative flex h-full flex-col justify-between overflow-hidden rounded-[26px] border border-white/[0.07] bg-gradient-to-b from-ink-850 to-ink-900/60 p-7 transition-[transform,border-color] duration-700 ease-[var(--ease-out-expo)] hover:border-white/[0.12] md:p-10"
      style={{ transform: 'perspective(1200px) rotateX(var(--rx,0deg)) rotateY(var(--ry,0deg))' }}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        {illustrative ? (
          <span className="label-mono inline-flex items-center gap-2 rounded-full border border-signal/25 bg-signal/[0.06] px-3 py-1.5 text-[0.625rem] text-signal-soft">
            <span className="h-1 w-1 rounded-full bg-signal" />
            Testimonio demostrativo
          </span>
        ) : t.author.logo ? (
          <img src={t.author.logo} alt={t.author.company ?? ''} className="h-6 w-auto opacity-80" loading="lazy" />
        ) : (
          <span className="label-mono text-dim">{t.author.company}</span>
        )}
        {t.rating ? <Stars n={t.rating} illustrative={illustrative} /> : null}
      </div>

      <blockquote className={`relative mt-10 ${featured ? 'md:mt-16' : ''}`}>
        <span aria-hidden="true" className="absolute -left-1 -top-8 font-serif text-[5rem] leading-none text-white/[0.06]">
          “
        </span>
        <p
          className={`relative font-medium tracking-[-0.025em] text-fg ${
            featured ? 'text-[clamp(1.6rem,3vw,2.6rem)] leading-[1.12]' : 'text-[1.3rem] leading-[1.25] md:text-[1.45rem]'
          }`}
        >
          {t.quote}
        </p>
      </blockquote>

      <figcaption className="mt-10 flex items-center gap-4 border-t border-white/[0.06] pt-6">
        {t.author.photo && !illustrative ? (
          <img src={t.author.photo} alt={t.author.name ?? ''} width={48} height={48} loading="lazy" className="h-12 w-12 rounded-full object-cover" />
        ) : (
          <IllustrativeAvatar seed={t.id} />
        )}
        <div className="leading-tight">
          <p className="text-[0.95rem] text-fg">{illustrative ? 'Experiencia ilustrativa' : t.author.name}</p>
          <p className="mt-1 text-[0.85rem] text-mute">
            {t.author.role}
            {!illustrative && t.author.company ? ` · ${t.author.company}` : ''}
          </p>
          {t.context && <p className="label-mono mt-2 text-[0.6rem] text-dim">{t.context}</p>}
        </div>
      </figcaption>
    </figure>
  )
}

export function Testimonials() {
  const root = useRef<HTMLElement>(null)
  const hasIllustrative = TESTIMONIALS.some((t) => t.kind === 'illustrative')
  const [first, ...rest] = TESTIMONIALS

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MQ.motion, () => {
        gsap.from('[data-testimonial]', {
          autoAlpha: 0,
          y: 50,
          duration: 1.3,
          stagger: 0.14,
          scrollTrigger: { trigger: '[data-testimonial-grid]', start: 'top 80%', once: true },
        })
      })
      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <section ref={root} id="testimonios" data-scene="hidden" className="relative py-[14vh] lg:py-[18vh]" aria-labelledby="testimonials-title">
      <div className="container-x">
        <SectionLabel index="07">Experiencias</SectionLabel>
        <div className="mt-6 grid gap-6 lg:grid-cols-12">
          <RevealText id="testimonials-title" className="text-headline max-w-[16ch] font-medium lg:col-span-8">
            Cómo podría sentirse trabajar con un sistema inteligente.
          </RevealText>
        </div>

        <div data-testimonial-grid className="mt-14 grid gap-4 lg:mt-20 lg:grid-cols-12">
          {first && (
            <div className="lg:col-span-7">
              <TestimonialCard t={first} featured />
            </div>
          )}
          <div className="grid gap-4 lg:col-span-5 lg:pt-24">
            {rest.map((t) => (
              <TestimonialCard key={t.id} t={t} />
            ))}
          </div>
        </div>

        {hasIllustrative && (
          <p className="mt-8 max-w-[44rem] text-[0.8rem] text-dim">
            Los testimonios de esta sección son escenarios demostrativos creados para ilustrar la experiencia. No corresponden a
            clientes reales ni a personas identificables.
          </p>
        )}
      </div>
    </section>
  )
}
