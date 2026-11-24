import { useRef } from 'react'
import { gsap, MQ, useGSAP } from '@/lib/gsap'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { systemState } from '@/three/systemStore'

const BEFORE = ['Tareas manuales', 'Emails', 'Excel', 'CRM', 'Procesos repetitivos', 'Errores']
const AFTER = ['Agentes', 'Automatización', 'Datos conectados', 'Decisiones inteligentes', 'Procesos autónomos']

function Flow({ items, kind }: { items: string[]; kind: 'before' | 'after' }) {
  const before = kind === 'before'
  return (
    <ol className="flex flex-col items-start" aria-label={before ? 'Antes' : 'Después'}>
      {items.map((label, i) => (
        <li key={label} className="flex flex-col items-start" data-flow={kind}>
          {i > 0 && (
            <span aria-hidden="true" className="relative ml-[5px] block h-6 w-px md:h-8" data-connector>
              {before ? (
                <span className="absolute inset-0 border-l border-dashed border-white/20" />
              ) : (
                <>
                  <span className="absolute inset-0 bg-gradient-to-b from-signal/70 to-signal/25" />
                  <span className="flow-pulse absolute left-1/2 top-0 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-signal-soft" style={{ animationDelay: `${i * 0.35}s` }} />
                </>
              )}
            </span>
          )}
          <span
            data-flow-item
            className={`flex items-center gap-3 ${before ? 'text-mute' : 'text-fg'}`}
            style={before ? { transform: `translateX(${[0, 6, -3, 9, 2, 5][i]}px)` } : undefined}
          >
            <span
              aria-hidden="true"
              className={`h-[11px] w-[11px] shrink-0 rounded-full border ${
                before ? 'border-white/25' : 'border-signal bg-signal/20 shadow-[0_0_14px_rgb(255_148_71/0.45)]'
              }`}
            />
            <span className={`text-[1.05rem] md:text-[1.2rem] ${before && label === 'Errores' ? 'text-signal/70' : ''}`}>{label}</span>
          </span>
        </li>
      ))}
    </ol>
  )
}

export function Transformation() {
  const root = useRef<HTMLElement>(null)
  const meter = useRef<HTMLSpanElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      const setMeter = (v: number) => {
        if (meter.current) meter.current.textContent = `${Math.round(v * 100)}%`
      }

      mm.add(MQ.reduced, () => {
        systemState.reconnect = 1
        setMeter(1)
      })

      // Desktop: pinned, scrubbed narrative
      mm.add(`${MQ.motion} and ${MQ.desktop}`, () => {
        const tl = gsap.timeline({
          defaults: { ease: 'power2.out', duration: 1 },
          scrollTrigger: {
            trigger: '[data-pin]',
            start: 'top top',
            end: '+=240%',
            pin: true,
            scrub: 0.6,
            onUpdate(self) {
              const v = gsap.utils.clamp(0, 1, gsap.utils.mapRange(0.36, 0.76, 0, 1, self.progress))
              systemState.reconnect = v
              setMeter(v)
            },
          },
        })
        tl.from('[data-flow="before"] [data-flow-item]', { autoAlpha: 0, x: -24, stagger: 0.32 }, 0)
          .from('[data-flow="before"] [data-connector]', { scaleY: 0, transformOrigin: 'top', stagger: 0.32 }, 0.2)
          .from('[data-core-caption]', { autoAlpha: 0, y: 16 }, 1.4)
          .to('[data-flow="before"] [data-flow-item]', { autoAlpha: 0.22, filter: 'blur(1.5px)', stagger: 0.08 }, 2.6)
          .to('[data-before-head]', { autoAlpha: 0.35 }, 2.6)
          .from('[data-flow="after"] [data-flow-item]', { autoAlpha: 0, x: 24, stagger: 0.34 }, 3.4)
          .from('[data-flow="after"] [data-connector]', { scaleY: 0, transformOrigin: 'top', stagger: 0.34 }, 3.6)
          .from('[data-after-head]', { autoAlpha: 0 }, 3.2)
          .to({}, { duration: 0.8 })
      })

      // Mobile / tablet: unpinned, reconnect follows the system anchor
      mm.add(`${MQ.motion} and ${MQ.mobile}`, () => {
        gsap.utils.toArray<HTMLElement>('[data-flow-item]').forEach((el) => {
          gsap.from(el, { autoAlpha: 0, y: 14, duration: 0.9, scrollTrigger: { trigger: el, start: 'top 90%', once: true } })
        })
        gsap.to({}, {
          scrollTrigger: {
            trigger: '[data-system-anchor="transform"]',
            start: 'top 85%',
            end: 'bottom 35%',
            scrub: true,
            onUpdate(self) {
              systemState.reconnect = self.progress
              setMeter(self.progress)
            },
          },
        })
      })

      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <section ref={root} id="transformacion" data-scene="transform" className="relative" aria-labelledby="transform-title">
      <div data-pin className="relative flex min-h-[100svh] flex-col justify-center py-[12vh] lg:h-[100svh] lg:py-0">
        <div className="container-x">
          <div className="mb-12 flex flex-col gap-6 lg:mb-[6vh] lg:flex-row lg:items-end lg:justify-between">
            <div>
              <SectionLabel index="02">La transformación</SectionLabel>
              <h2 id="transform-title" className="text-headline mt-6 max-w-[16ch] font-medium">
                Del trabajo fragmentado a un sistema que fluye.
              </h2>
            </div>
            <p className="max-w-[24rem] text-mute">
              Los mismos módulos. Las mismas personas. La diferencia está en cómo se conectan y en quién hace el trabajo repetitivo.
            </p>
          </div>

          <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.5fr_1fr] lg:gap-6">
            <div>
              <p data-before-head className="label-mono mb-6 text-dim">
                Antes
              </p>
              <Flow items={BEFORE} kind="before" />
            </div>

            <div className="relative">
              <div data-system-anchor="transform" aria-hidden="true" className="h-[42svh] lg:h-[56vh]" />
              <div data-core-caption className="mt-2 text-center">
                <p className="label-mono text-signal-soft">Transformación mediante IA</p>
                <p className="label-mono mt-2 text-dim">
                  Integración del sistema · <span ref={meter} className="text-fg tabular-nums">0%</span>
                </p>
              </div>
            </div>

            <div className="lg:justify-self-end">
              <p data-after-head className="label-mono mb-6 text-signal">
                Después
              </p>
              <Flow items={AFTER} kind="after" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
