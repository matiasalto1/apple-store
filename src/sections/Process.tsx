import { useRef } from 'react'
import { gsap, MQ, useGSAP } from '@/lib/gsap'
import { activateOnScroll } from '@/lib/activateOnScroll'
import { RevealText } from '@/components/ui/RevealText'
import { SectionLabel } from '@/components/ui/SectionLabel'

const STEPS = [
  { n: '01', title: 'Descubrimos', body: 'Entendemos cómo trabaja tu empresa hoy: procesos, sistemas, datos y dónde se pierde el tiempo.', out: 'Mapa de oportunidades' },
  { n: '02', title: 'Diseñamos', body: 'Definimos la solución, su arquitectura y los límites: qué decide la IA y qué sigue en manos de tu equipo.', out: 'Arquitectura y plan' },
  { n: '03', title: 'Construimos', body: 'Desarrollamos agentes, modelos y flujos a medida, con entregas cortas y validación continua.', out: 'Sistema funcional' },
  { n: '04', title: 'Integramos', body: 'Conectamos la solución con tus herramientas actuales y la ponemos en marcha junto a las personas que la usan.', out: 'Puesta en producción' },
  { n: '05', title: 'Optimizamos', body: 'Medimos, aprendemos y mejoramos. El sistema evoluciona con tu operación.', out: 'Mejora continua' },
]

export function Process() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MQ.motion, () => {
        gsap.fromTo(
          '[data-progress]',
          { scaleY: 0 },
          { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '[data-steps]', start: 'top 60%', end: 'bottom 60%', scrub: 0.4 } },
        )
        gsap.utils.toArray<HTMLElement>('[data-step]').forEach((step) => {
          activateOnScroll(step)
          gsap.from(step.querySelectorAll('[data-step-reveal]'), {
            yPercent: 100,
            autoAlpha: 0,
            duration: 1.1,
            stagger: 0.07,
            scrollTrigger: { trigger: step, start: 'top 80%', once: true },
          })
        })
      })
      mm.add(MQ.reduced, () => {
        gsap.utils.toArray<HTMLElement>('[data-step]').forEach((s) => s.classList.add('is-live'))
      })
      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <section ref={root} id="nosotros" data-scene="hidden" className="relative py-[14vh] lg:py-[18vh]" aria-labelledby="process-title">
      <div className="container-x grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <SectionLabel index="09">Cómo trabajamos</SectionLabel>
            <RevealText id="process-title" className="text-headline mt-6 max-w-[12ch] font-medium">
              Un proceso pensado para llegar a producción.
            </RevealText>
            <p className="mt-8 max-w-[24rem] text-mute" data-reveal>
              Somos un equipo de ingeniería y producto especializado en IA aplicada. No vendemos herramientas: diseñamos sistemas
              que funcionan dentro de tu operación.
            </p>
          </div>
        </div>

        <div data-steps className="relative lg:col-span-6 lg:col-start-7">
          <div aria-hidden="true" className="absolute bottom-0 left-[7px] top-2 w-px bg-white/[0.07]">
            <div data-progress className="absolute inset-0 origin-top bg-signal" />
          </div>
          <ol>
            {STEPS.map((s) => (
              <li key={s.n} data-step className="process-step relative pb-16 pl-12 last:pb-0 md:pb-24">
                <span aria-hidden="true" className="process-dot absolute left-0 top-2 h-[15px] w-[15px] rounded-full border bg-ink-950" />
                <div className="overflow-hidden">
                  <p data-step-reveal className="label-mono process-num">
                    {s.n} — Etapa
                  </p>
                </div>
                <div className="overflow-hidden">
                  <h3 data-step-reveal className="process-title mt-3 text-[clamp(2rem,4vw,3.25rem)] font-medium leading-[1.05] tracking-[-0.035em]">
                    {s.title}
                  </h3>
                </div>
                <div className="overflow-hidden">
                  <p data-step-reveal className="mt-4 max-w-[30rem] text-mute">
                    {s.body}
                  </p>
                </div>
                <div className="overflow-hidden">
                  <p data-step-reveal className="label-mono mt-5 inline-flex items-center gap-2 text-dim">
                    <span className="text-signal">↳</span> {s.out}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
