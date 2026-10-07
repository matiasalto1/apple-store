import { useRef } from 'react'
import { gsap, MQ, useGSAP } from '@/lib/gsap'
import { IMPACT, type ImpactMetric } from '@/data/impact'
import { RevealText } from '@/components/ui/RevealText'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { IllustrativeTag } from '@/components/ui/IllustrativeTag'

/* Editorial grid: sizes vary on purpose — no identical cards */
const SPANS = [
  'md:col-span-6 lg:col-span-7 lg:row-span-2',
  'md:col-span-3 lg:col-span-5',
  'md:col-span-3 lg:col-span-5',
  'md:col-span-6 lg:col-span-4',
  'md:col-span-3 lg:col-span-4',
  'md:col-span-3 lg:col-span-4',
]

function Metric({ m, big }: { m: ImpactMetric; big: boolean }) {
  const prefix = m.unit === '/7' ? '' : m.direction === 'up' ? (m.unit === '×' ? '' : '+') : '−'
  return (
    <article
      data-metric
      className="spotlight group flex h-full flex-col justify-between rounded-[22px] border border-white/[0.07] bg-ink-900/50 p-6 transition-colors duration-500 hover:border-white/[0.12] md:p-8"
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect()
        e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`)
        e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`)
      }}
    >
      <div className="flex items-start justify-between gap-4">
        <h3 className="flex items-center gap-3 text-[1.05rem] font-medium tracking-[-0.01em] text-fg">
          <span className={`text-[1.2rem] ${m.direction === 'up' ? 'text-signal' : 'text-ice'}`} aria-label={m.direction === 'up' ? 'aumenta' : 'disminuye'}>
            {m.direction === 'up' ? '↑' : '↓'}
          </span>
          {m.label}
        </h3>
      </div>

      <div className={big ? 'mt-16 lg:mt-24' : 'mt-10'}>
        <p className="label-mono mb-2 text-dim">Ej.</p>
        <p
          className={`font-medium leading-none tracking-[-0.05em] tabular-nums ${big ? 'text-[clamp(4.5rem,11vw,10rem)]' : 'text-[clamp(3rem,5vw,4.25rem)]'}`}
        >
          <span>{prefix}</span>
          <span data-count={m.example}>{m.example}</span>
          <span className="text-mute">{m.unit}</span>
        </p>

        {/* before / after scenario bars */}
        <div className="mt-8 space-y-2.5" aria-hidden="true">
          {(['before', 'after'] as const).map((k) => (
            <div key={k} className="grid grid-cols-[64px_1fr] items-center gap-3">
              <span className="label-mono text-[0.6rem] text-dim">{k === 'before' ? 'Hoy' : 'Con IA'}</span>
              <span className="h-[3px] overflow-hidden rounded-full bg-white/[0.05]">
                <span
                  data-bar
                  className={`block h-full origin-left rounded-full ${k === 'after' ? (m.direction === 'up' ? 'bg-signal' : 'bg-ice') : 'bg-white/25'}`}
                  style={{ width: `${m[k] * 100}%` }}
                />
              </span>
            </div>
          ))}
        </div>

        <p className="mt-6 max-w-[28rem] text-[0.88rem] text-mute">{m.note}</p>
        <IllustrativeTag className="mt-5" >{big ? 'Escenario ilustrativo' : 'Ejemplo de impacto potencial'}</IllustrativeTag>
      </div>
    </article>
  )
}

export function Impact() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MQ.motion, () => {
        gsap.utils.toArray<HTMLElement>('[data-metric]').forEach((card, i) => {
          const tl = gsap.timeline({ scrollTrigger: { trigger: card, start: 'top 88%', once: true } })
          tl.from(card, { autoAlpha: 0, y: 40, duration: 1.2, delay: (i % 3) * 0.08 })
            .from(card.querySelectorAll('[data-bar]'), { scaleX: 0, duration: 1.4, stagger: 0.15, ease: 'expo.inOut' }, 0.2)
          const counter = card.querySelector<HTMLElement>('[data-count]')
          if (counter) {
            const end = Number(counter.dataset.count)
            const obj = { v: 0 }
            tl.to(obj, { v: end, duration: 1.6, ease: 'power3.out', onUpdate: () => (counter.textContent = String(Math.round(obj.v))) }, 0.15)
          }
        })
      })
      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <section ref={root} id="impacto" data-scene="hidden" className="relative py-[14vh] lg:py-[18vh]" aria-labelledby="impact-title">
      <div className="container-x">
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <SectionLabel index="06">Impacto</SectionLabel>
            <RevealText id="impact-title" className="text-headline mt-6 max-w-[14ch] font-medium">
              El impacto potencial de la IA.
            </RevealText>
          </div>
          <div className="self-end lg:col-span-4 lg:col-start-9" data-reveal>
            <p className="text-mute">
              Escenarios demostrativos para dimensionar lo que es posible. No son resultados de clientes: cada proyecto se mide
              sobre su propia línea base.
            </p>
          </div>
        </div>

        <div className="mt-14 grid gap-4 md:grid-cols-6 lg:mt-20 lg:grid-cols-12">
          {IMPACT.map((m, i) => (
            <div key={m.key} className={SPANS[i]}>
              <Metric m={m} big={i === 0} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
