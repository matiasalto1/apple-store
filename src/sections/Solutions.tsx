import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { gsap, useGSAP } from '@/lib/gsap'
import { SOLUTIONS } from '@/data/solutions'
import { MODULES, moduleIndexFor } from '@/data/modules'
import { useInView } from '@/hooks/useInView'
import { RevealText } from '@/components/ui/RevealText'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { systemState } from '@/three/systemStore'
import { AgentsDemo } from './solutions/AgentsDemo'
import { AutomationDemo } from './solutions/AutomationDemo'
import { DataDemo } from './solutions/DataDemo'
import { IntegrationsDemo } from './solutions/IntegrationsDemo'

const DEMOS = {
  automation: AutomationDemo,
  agents: AgentsDemo,
  data: DataDemo,
  integrations: IntegrationsDemo,
}

export function Solutions() {
  const root = useRef<HTMLElement>(null)
  const panel = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(1) // start on "Agentes de IA"
  const inView = useInView(panel, { threshold: 0.2 })
  const sol = SOLUTIONS[active]
  const moduleIdx = moduleIndexFor(sol.key)
  const Demo = DEMOS[sol.key]

  // The matching 3D node takes focus: the module "becomes" the solution
  useEffect(() => {
    systemState.focus = moduleIdx
  }, [moduleIdx])

  // Panel transition on tab change
  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
      gsap.fromTo(
        '[data-sol-anim]',
        { autoAlpha: 0, y: 14, filter: 'blur(6px)' },
        { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.9, stagger: 0.06, ease: 'expo.out' },
      )
    },
    { scope: panel, dependencies: [active] },
  )

  const tabs = useRef<(HTMLButtonElement | null)[]>([])
  const onKey = (e: KeyboardEvent) => {
    const dir = e.key === 'ArrowDown' || e.key === 'ArrowRight' ? 1 : e.key === 'ArrowUp' || e.key === 'ArrowLeft' ? -1 : 0
    if (!dir) return
    e.preventDefault()
    const next = (active + dir + SOLUTIONS.length) % SOLUTIONS.length
    setActive(next)
    tabs.current[next]?.focus()
  }

  return (
    <section ref={root} id="soluciones" data-scene="solutions" className="relative py-[14vh] lg:py-[18vh]" aria-labelledby="solutions-title">
      <div className="container-x">
        <div className="grid gap-x-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <SectionLabel index="03">Nuestras soluciones</SectionLabel>
            <RevealText id="solutions-title" className="text-headline mt-6 max-w-[15ch] font-medium">
              Construimos inteligencia alrededor de tu negocio.
            </RevealText>
          </div>
          <p className="mt-6 max-w-[26rem] self-end text-mute lg:col-span-4 lg:col-start-9 lg:mt-0" data-reveal>
            Cada módulo del sistema se convierte en una capacidad concreta. Elegí una para verla funcionar.
          </p>
        </div>

        <div className="mt-14 grid gap-10 lg:mt-20 lg:grid-cols-12 lg:gap-12">
          {/* left: the system window + selector */}
          <div className="lg:col-span-5">
            <div className="ticks relative overflow-hidden rounded-[22px] border border-white/[0.06]">
              <span className="tick tick-tl" />
              <span className="tick tick-tr" />
              <span className="tick tick-bl" />
              <span className="tick tick-br" />
              <div data-system-anchor="solutions" data-cursor="explore" aria-hidden="true" className="h-[30svh] min-h-[220px] lg:h-[34vh]" />
              <div className="label-mono flex items-center justify-between border-t border-white/[0.06] px-4 py-3 text-dim">
                <span>Nodo de origen</span>
                <span className="flex items-center gap-2 text-fg">
                  <span className="h-1.5 w-1.5 rounded-full bg-signal shadow-[0_0_10px_var(--color-signal)]" />
                  {MODULES[moduleIdx]?.label}
                  <span className="text-dim">→</span>
                  <span className="text-signal-soft">{sol.title}</span>
                </span>
              </div>
            </div>

            <div role="tablist" aria-label="Soluciones" aria-orientation="vertical" className="mt-8" onKeyDown={onKey}>
              {SOLUTIONS.map((s, i) => {
                const on = i === active
                return (
                  <button
                    key={s.key}
                    ref={(el) => void (tabs.current[i] = el)}
                    role="tab"
                    id={`sol-tab-${s.key}`}
                    aria-selected={on}
                    aria-controls="sol-panel"
                    tabIndex={on ? 0 : -1}
                    onClick={() => setActive(i)}
                    className={`group relative flex w-full items-baseline gap-5 border-t py-5 text-left transition-colors duration-500 last:border-b ${
                      on ? 'border-white/15' : 'border-white/[0.06]'
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className={`absolute -top-px left-0 h-px bg-signal transition-[width] duration-700 ease-[var(--ease-out-expo)] ${on ? 'w-full' : 'w-0'}`}
                    />
                    <span className={`label-mono transition-colors ${on ? 'text-signal' : 'text-dim'}`}>{s.index}</span>
                    <span className="flex-1">
                      <span
                        className={`block text-[1.35rem] font-medium tracking-[-0.025em] transition-colors duration-500 md:text-[1.6rem] ${
                          on ? 'text-fg' : 'text-mute group-hover:text-fg-soft'
                        }`}
                      >
                        {s.title}
                      </span>
                      <span
                        className={`grid transition-[grid-template-rows,opacity] duration-700 ease-[var(--ease-out-expo)] ${
                          on ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                        }`}
                      >
                        <span className="overflow-hidden">
                          <span className="block pt-1.5 text-[0.95rem] text-mute">{s.summary}</span>
                        </span>
                      </span>
                    </span>
                    <span aria-hidden="true" className={`transition-all duration-500 ${on ? 'translate-x-0 text-signal opacity-100' : '-translate-x-2 opacity-0'}`}>
                      →
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* right: live demo */}
          <div ref={panel} id="sol-panel" role="tabpanel" aria-labelledby={`sol-tab-${sol.key}`} className="lg:col-span-7">
            <div className="lg:sticky lg:top-28">
              <div data-sol-anim className="flex items-baseline gap-4">
                <span className="label-mono text-signal">{sol.index}</span>
                <h3 className="text-title font-medium">{sol.title}</h3>
              </div>
              <p data-sol-anim className="mt-4 max-w-[36rem] text-mute">
                {sol.description}
              </p>
              <ul data-sol-anim className="mt-6 flex flex-wrap gap-2">
                {sol.capabilities.map((c) => (
                  <li key={c} className="rounded-full border border-white/10 px-3 py-1.5 text-[0.8rem] text-fg-soft">
                    {c}
                  </li>
                ))}
              </ul>
              <div data-sol-anim className="mt-8">
                <Demo key={sol.key} active={inView} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
