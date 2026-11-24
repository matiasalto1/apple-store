import { useRef } from 'react'
import { gsap, MQ, useGSAP } from '@/lib/gsap'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { activateOnScroll } from '@/lib/activateOnScroll'

const LAYERS = [
  { name: 'Empresa', desc: 'Procesos, personas y objetivos', items: ['Procesos', 'Equipos', 'Reglas de negocio'] },
  { name: 'Datos', desc: 'La materia prima, unificada', items: ['Documentos', 'Bases de datos', 'Eventos', 'Conversaciones'] },
  { name: 'Modelos de IA', desc: 'Comprensión y predicción', items: ['Lenguaje', 'Clasificación', 'Predicción', 'Búsqueda semántica'] },
  { name: 'Agentes', desc: 'Razonan y actúan dentro de límites', items: ['Atención', 'Comercial', 'Operaciones', 'Análisis'] },
  { name: 'Automatizaciones', desc: 'Ejecución confiable y trazable', items: ['Flujos', 'Disparadores', 'Excepciones'] },
  { name: 'Sistemas existentes', desc: 'Lo que ya usás, conectado', items: ['CRM', 'ERP', 'Email', 'Mensajería', 'E-commerce'] },
]

const RAIL = ['Seguridad', 'Supervisión humana', 'Observabilidad', 'Control de accesos']

export function Architecture() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add({ wide: `${MQ.motion} and ${MQ.desktop}`, narrow: `${MQ.motion} and ${MQ.mobile}` }, (self) => {
        // A rightward entrance would push the bands past a narrow viewport,
        // so the layers rise instead of sliding in below the desktop breakpoint.
        const wide = !!self.conditions?.wide
        const layers = gsap.utils.toArray<HTMLElement>('[data-layer]')
        gsap.fromTo(
          '[data-spine]',
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: 'none',
            scrollTrigger: { trigger: '[data-stack]', start: 'top 70%', end: 'bottom 60%', scrub: 0.5 },
          },
        )
        layers.forEach((layer) => {
          gsap.from(layer, {
            autoAlpha: 0,
            x: wide ? 30 : 0,
            y: wide ? 0 : 24,
            duration: 1.1,
            scrollTrigger: { trigger: layer, start: 'top 85%', once: true },
          })
          activateOnScroll(layer, 'top 65%')
        })
      })
      mm.add(MQ.reduced, () => {
        gsap.utils.toArray<HTMLElement>('[data-layer]').forEach((l) => l.classList.add('is-live'))
      })
      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <section ref={root} id="tecnologia" data-scene="hidden" className="relative py-[14vh] lg:py-[18vh]" aria-labelledby="arch-title">
      <div className="container-x grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <SectionLabel index="08">Arquitectura</SectionLabel>
            <h2 id="arch-title" className="text-headline mt-6 font-medium" data-reveal>
              No agregamos IA.
              <br />
              <span className="text-mute">La integramos a tu operación.</span>
            </h2>
            <p className="mt-8 max-w-[26rem] text-mute" data-reveal>
              Una arquitectura en capas, diseñada sobre los sistemas que ya existen. Cada capa tiene una responsabilidad clara y
              todo el recorrido queda registrado.
            </p>
            <ul className="mt-10 hidden flex-wrap gap-2 lg:flex">
              {RAIL.map((r) => (
                <li key={r} className="label-mono flex items-center gap-2 rounded-full border border-white/10 px-3 py-1.5 text-mute">
                  <span className="h-1 w-1 rounded-full bg-ice" />
                  {r}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div data-stack className="relative lg:col-span-7">
          {/* spine with travelling pulses */}
          <div aria-hidden="true" className="absolute bottom-6 left-[19px] top-6 w-px bg-white/[0.06] md:left-[23px]">
            <div data-spine className="absolute inset-0 origin-top bg-gradient-to-b from-signal/80 via-signal/50 to-signal/20" />
            {[0, 1, 2].map((k) => (
              <span key={k} className="spine-pulse absolute left-1/2 h-10 w-[3px] -translate-x-1/2 rounded-full" style={{ animationDelay: `${k * 1.3}s` }} />
            ))}
          </div>

          <ol className="relative space-y-3">
            {LAYERS.map((l, i) => (
              <li key={l.name} data-layer className="arch-layer group relative pl-14 md:pl-16">
                <span aria-hidden="true" className="arch-node absolute left-[13px] top-1/2 h-[13px] w-[13px] -translate-y-1/2 rounded-full border bg-ink-950 md:left-[17px]" />
                <div className="arch-band rounded-[18px] border bg-ink-900/50 p-5 md:p-6">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="label-mono text-dim">L{i}</p>
                      <h3 className="mt-1.5 text-[1.3rem] font-medium tracking-[-0.02em] md:text-[1.5rem]">{l.name}</h3>
                      <p className="mt-1 text-[0.88rem] text-mute">{l.desc}</p>
                    </div>
                    <ul className="flex flex-wrap gap-1.5 md:max-w-[55%] md:justify-end">
                      {l.items.map((it) => (
                        <li key={it} className="arch-chip label-mono rounded-md border px-2.5 py-1.5 text-[0.6rem]">
                          {it}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </li>
            ))}
          </ol>

          <ul className="mt-8 flex flex-wrap gap-2 lg:hidden">
            {RAIL.map((r) => (
              <li key={r} className="label-mono flex items-center gap-2 rounded-full border border-white/10 px-3 py-1.5 text-mute">
                <span className="h-1 w-1 rounded-full bg-ice" />
                {r}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
