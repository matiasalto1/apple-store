import { useRef, type PointerEvent, type ReactNode } from 'react'
import { gsap, MQ, useGSAP } from '@/lib/gsap'
import { TESTIMONIALS, type Testimonial } from '@/data/testimonials'
import { site } from '@/config/site'
import { RevealText } from '@/components/ui/RevealText'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { Arrow, MagneticButton } from '@/components/ui/MagneticButton'

function useSpotlight() {
  const ref = useRef<HTMLElement>(null)
  const onPointerMove = (e: PointerEvent) => {
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
  const onPointerLeave = () => {
    ref.current?.style.setProperty('--rx', '0deg')
    ref.current?.style.setProperty('--ry', '0deg')
  }
  return { ref, onPointerMove, onPointerLeave }
}

const cardClass =
  'spotlight relative flex h-full flex-col justify-between overflow-hidden rounded-[26px] border border-white/[0.07] bg-gradient-to-b from-ink-850 to-ink-900/60 p-7 transition-[transform,border-color] duration-700 ease-[var(--ease-out-expo)] hover:border-white/[0.12] md:p-10'
const tilt = { transform: 'perspective(1200px) rotateX(var(--rx,0deg)) rotateY(var(--ry,0deg))' }

function VerifyLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="label-mono inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 text-[0.625rem] text-mute transition-colors hover:border-white/25 hover:text-fg"
    >
      {children} <span aria-hidden="true">↗</span>
    </a>
  )
}

/** Testimonio real: nombre, cargo, empresa y enlaces para verificarlo. */
export function TestimonialCard({ t, featured = false }: { t: Testimonial; featured?: boolean }) {
  const spot = useSpotlight()
  const a = t.author

  return (
    <figure ref={spot.ref} data-testimonial onPointerMove={spot.onPointerMove} onPointerLeave={spot.onPointerLeave} className={cardClass} style={tilt}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        {a.logo ? (
          <img src={a.logo} alt={a.company} className="h-6 w-auto opacity-80" loading="lazy" />
        ) : (
          <span className="label-mono text-dim">{a.company}</span>
        )}
        <span className="label-mono text-[0.625rem] text-mute">{t.project}</span>
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
        {t.result && <p className="mt-6 text-[0.95rem] text-signal-soft">{t.result}</p>}
      </blockquote>

      <figcaption className="mt-10 border-t border-white/[0.06] pt-6">
        <div className="flex items-center gap-4">
          {a.photo && <img src={a.photo} alt={a.name} width={48} height={48} loading="lazy" className="h-12 w-12 rounded-full object-cover" />}
          <div className="leading-tight">
            <p className="text-[0.95rem] text-fg">{a.name}</p>
            <p className="mt-1 text-[0.85rem] text-mute">
              {a.role} · {a.company}
            </p>
          </div>
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          <VerifyLink href={a.linkedin}>LinkedIn de {a.name.split(' ')[0]}</VerifyLink>
          {a.companyUrl && <VerifyLink href={a.companyUrl}>Sitio de {a.company}</VerifyLink>}
          {t.referenceCall && <span className="label-mono px-1 py-1.5 text-[0.625rem] text-mute">Acepta llamada de referencia</span>}
        </div>
      </figcaption>
    </figure>
  )
}

/** Mientras no haya clientes reales: la oferta para ser uno de los primeros. */
function PilotProgram() {
  const spot = useSpotlight()
  const { pilot } = site
  return (
    <article ref={spot.ref} data-testimonial onPointerMove={spot.onPointerMove} onPointerLeave={spot.onPointerLeave} className={cardClass} style={tilt}>
      <span className="label-mono inline-flex w-fit items-center gap-2 rounded-full border border-signal/25 bg-signal/[0.06] px-3 py-1.5 text-[0.625rem] text-signal-soft">
        <span className="h-1 w-1 rounded-full bg-signal" />
        {pilot.slots} cupos
      </span>
      <h3 className="mt-10 text-[clamp(1.6rem,3vw,2.6rem)] font-medium leading-[1.12] tracking-[-0.025em] text-fg md:mt-16">
        Programa de primeros clientes
      </h3>
      <ul className="mt-8 grid gap-4">
        {pilot.perks.map((p) => (
          <li key={p} className="flex gap-3 text-[1rem] leading-snug text-fg-soft md:text-[1.05rem]">
            <span aria-hidden="true" className="mt-[0.55em] h-1.5 w-1.5 shrink-0 rounded-full bg-signal" />
            {p}
          </li>
        ))}
      </ul>
      <div className="mt-10 border-t border-white/[0.06] pt-6">
        <MagneticButton href={site.contactHref} strength={0.3}>
          Quiero ser uno de los primeros <Arrow />
        </MagneticButton>
      </div>
    </article>
  )
}

/** Quién está detrás: lo que un decisor puede verificar hoy. */
function FounderCard() {
  const spot = useSpotlight()
  const f = site.founder
  return (
    <figure ref={spot.ref} data-testimonial onPointerMove={spot.onPointerMove} onPointerLeave={spot.onPointerLeave} className={cardClass} style={tilt}>
      <p className="label-mono text-mute">Quién está detrás</p>
      <figcaption className="mt-8 flex items-center gap-4">
        {f.photo && <img src={f.photo} alt={f.name} width={64} height={64} loading="lazy" className="h-16 w-16 rounded-full object-cover" />}
        <div className="leading-tight">
          <p className="text-[1.15rem] text-fg">{f.name}</p>
          <p className="mt-1 text-[0.9rem] text-mute">
            {f.role} · {site.name}
          </p>
        </div>
      </figcaption>
      {f.bio && <p className="mt-6 text-[1rem] leading-snug text-fg-soft">{f.bio}</p>}
      <div className="mt-8 flex flex-wrap gap-2">
        <VerifyLink href={f.linkedin}>Ver perfil en LinkedIn</VerifyLink>
      </div>
    </figure>
  )
}

export function Testimonials() {
  const root = useRef<HTMLElement>(null)
  const [first, ...rest] = TESTIMONIALS
  const showFounder = Boolean(site.founder.name && site.founder.linkedin)

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
        <SectionLabel index="06">{first ? 'Clientes' : 'Primeros clientes'}</SectionLabel>
        <div className="mt-6 grid gap-6 lg:grid-cols-12">
          <RevealText id="testimonials-title" className="text-headline max-w-[16ch] font-medium lg:col-span-8">
            {first ? 'Lo que dicen quienes ya trabajan con nosotros.' : 'Estamos sumando a nuestros primeros clientes.'}
          </RevealText>
          <p className="max-w-[30rem] text-[1rem] text-mute lg:col-span-4 lg:self-end" data-reveal>
            {first
              ? 'Cada testimonio tiene nombre, empresa y perfil público. Podés verificarlo o pedirnos el contacto.'
              : 'Preferimos no mostrar testimonios que no podés verificar. Por eso abrimos pocos cupos, medimos el resultado con vos y lo contamos solo si lo aprobás.'}
          </p>
        </div>

        <div data-testimonial-grid className="mt-14 grid gap-4 lg:mt-20 lg:grid-cols-12">
          <div className="lg:col-span-7">{first ? <TestimonialCard t={first} featured /> : <PilotProgram />}</div>
          {(rest.length > 0 || showFounder) && (
            <div className="grid content-start gap-4 lg:col-span-5 lg:pt-24">
              {rest.map((t) => (
                <TestimonialCard key={t.id} t={t} />
              ))}
              {showFounder && <FounderCard />}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
