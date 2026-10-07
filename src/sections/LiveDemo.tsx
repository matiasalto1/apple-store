import { useEffect, useRef, useState } from 'react'
import { useInView } from '@/hooks/useInView'
import { RevealText } from '@/components/ui/RevealText'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { IllustrativeTag } from '@/components/ui/IllustrativeTag'
import { MagneticButton } from '@/components/ui/MagneticButton'

const STEPS = [
  { title: 'Identifica al cliente', call: 'crm.buscar(remitente)', out: 'Cliente existente · cuenta activa' },
  { title: 'Consulta CRM', call: 'crm.historial(cliente)', out: '3 pedidos previos · condiciones preferenciales' },
  { title: 'Consulta inventario', call: 'inventario.disponibilidad("Línea Pro")', out: 'Disponible · entrega estimada 72 h' },
  { title: 'Calcula propuesta', call: 'precios.calcular(volumen, condiciones)', out: 'Descuento por volumen aplicado' },
  { title: 'Genera respuesta', call: 'redactar(respuesta, tono="cercano")', out: 'Borrador personalizado listo' },
  { title: 'Actualiza CRM', call: 'crm.oportunidad.crear()', out: 'Etapa: propuesta enviada' },
  { title: 'Envía seguimiento', call: 'agenda.seguimiento("+3 días")', out: 'Recordatorio programado' },
]

const REPLY =
  'Hola, gracias por escribirnos. Tenemos disponibilidad inmediata de la Línea Pro y podemos entregar en 72 h. Te adjunto una propuesta con las condiciones preferenciales de tu cuenta. ¿Querés que coordinemos una llamada esta semana?'

// Illustrative example values — NOT customer results.
const HUMAN_MIN = 18
const AI_SEC = 42
const STEP_MS = 1150

export function LiveDemo() {
  const root = useRef<HTMLDivElement>(null)
  const inView = useInView(root, { once: true, threshold: 0.3 })
  const [run, setRun] = useState(0)
  const [step, setStep] = useState(-1)
  const [typed, setTyped] = useState(0)
  const done = step >= STEPS.length

  // step driver
  useEffect(() => {
    if (!inView) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setStep(STEPS.length)
      setTyped(REPLY.length)
      return
    }
    if (step >= STEPS.length) return
    const t = window.setTimeout(() => setStep((s) => s + 1), step < 0 ? 600 : STEP_MS)
    return () => window.clearTimeout(t)
  }, [inView, step, run])

  // reply typing during "Genera respuesta"
  useEffect(() => {
    if (step < 4 || typed >= REPLY.length) return
    const t = window.setTimeout(() => setTyped((n) => Math.min(REPLY.length, n + 3)), 14)
    return () => window.clearTimeout(t)
  }, [step, typed])

  const replay = () => {
    setStep(-1)
    setTyped(0)
    setRun((r) => r + 1)
  }

  const progress = Math.max(0, Math.min(1, (step + 1) / STEPS.length))
  const simSeconds = Math.round(progress * AI_SEC)

  return (
    <section id="demo" data-scene="hidden" className="relative py-[14vh] lg:py-[18vh]" aria-labelledby="demo-title">
      <div className="container-x">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <SectionLabel index="04">Demostración</SectionLabel>
            <RevealText id="demo-title" className="text-headline mt-6 max-w-[17ch] font-medium">
              De una tarea manual a un sistema inteligente.
            </RevealText>
          </div>
          <div className="flex flex-col items-start gap-3 lg:items-end">
            <IllustrativeTag>Simulación ilustrativa</IllustrativeTag>
            <p className="max-w-[22rem] text-[0.9rem] text-mute lg:text-right">
              Un caso típico, paso a paso. Datos ficticios con fines demostrativos.
            </p>
          </div>
        </div>

        <div ref={root} className="mt-14 grid gap-4 lg:mt-20 lg:grid-cols-12">
          {/* incoming request */}
          <article className="min-w-0 rounded-[22px] border border-white/[0.07] bg-ink-900/70 p-6 lg:col-span-4">
            <header className="label-mono flex items-center justify-between text-dim">
              <span>Bandeja de entrada</span>
              <span>09:41</span>
            </header>
            <div className="mt-6 flex items-center gap-3">
              <span aria-hidden="true" className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-ink-800 text-[0.8rem] text-mute">
                C
              </span>
              <div className="leading-tight">
                <p className="text-[0.95rem] text-fg">Cliente</p>
                <p className="label-mono mt-1 text-dim">Empresa ficticia</p>
              </div>
            </div>
            <p className="mt-6 text-[1.25rem] leading-snug tracking-[-0.015em] text-fg md:text-[1.4rem]">
              “¿Podrían informarme si tienen disponibilidad y enviarme una propuesta?”
            </p>
            <div className="mt-8 border-t border-white/[0.06] pt-5">
              <p className="label-mono text-dim">Proceso manual habitual</p>
              <ul className="mt-3 space-y-1.5 text-[0.88rem] text-mute">
                <li>Buscar al cliente · revisar historial</li>
                <li>Consultar stock con otra área</li>
                <li>Armar la propuesta en una planilla</li>
                <li>Redactar, enviar y acordarse de hacer seguimiento</li>
              </ul>
            </div>
          </article>

          {/* agent execution */}
          <div className="relative min-w-0 overflow-hidden rounded-[22px] border border-white/[0.07] bg-ink-900/70 lg:col-span-5">
            <div className="flex items-center justify-between border-b border-white/[0.06] px-6 py-4">
              <span className="label-mono flex items-center gap-2.5 text-mute">
                <span className={`h-1.5 w-1.5 rounded-full ${done ? 'bg-emerald-400/90' : step >= 0 ? 'anim-blink bg-signal' : 'bg-white/25'}`} />
                agente.comercial
              </span>
              <span className="label-mono tabular-nums text-dim">
                t = 00:{String(simSeconds).padStart(2, '0')}
              </span>
            </div>
            <div className="h-px bg-white/[0.04]">
              <div className="h-px bg-signal transition-[width] duration-700 ease-[var(--ease-out-expo)]" style={{ width: `${progress * 100}%` }} />
            </div>
            <ol className="space-y-1 p-4 md:p-5" aria-live="polite">
              {STEPS.map((s, k) => {
                const state = k < step ? 'done' : k === step ? 'run' : 'wait'
                return (
                  <li
                    key={s.title}
                    className={`rounded-xl border px-4 py-3 transition-all duration-700 ease-[var(--ease-out-expo)] ${
                      state === 'run'
                        ? 'border-signal/25 bg-signal/[0.05]'
                        : state === 'done'
                          ? 'border-transparent'
                          : 'border-transparent opacity-30'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="label-mono w-5 text-dim">{k + 1}</span>
                      <span className={`flex-1 text-[0.95rem] ${state === 'wait' ? 'text-mute' : 'text-fg'}`}>{s.title}</span>
                      <span className="label-mono text-[0.6rem]">
                        {state === 'done' ? <span className="text-signal">✓</span> : state === 'run' ? <span className="anim-blink text-signal-soft">●</span> : null}
                      </span>
                    </div>
                    <div
                      className={`grid transition-[grid-template-rows,opacity] duration-700 ease-[var(--ease-out-expo)] ${
                        state === 'wait' ? 'grid-rows-[0fr] opacity-0' : 'grid-rows-[1fr] opacity-100'
                      }`}
                    >
                      <div className="overflow-hidden">
                        <p className="ml-8 mt-1.5 truncate font-mono text-[11.5px] text-dim">
                          <span className="text-ice/70">{s.call}</span>
                          <span className="text-faint"> → </span>
                          <span className="text-mute">{s.out}</span>
                        </p>
                      </div>
                    </div>
                  </li>
                )
              })}
            </ol>
          </div>

          {/* output */}
          <div className="flex min-w-0 flex-col gap-4 lg:col-span-3">
            <article className="flex-1 rounded-[22px] border border-white/[0.07] bg-ink-900/70 p-6">
              <p className="label-mono text-dim">Respuesta generada</p>
              <p className="mt-4 min-h-[9.5rem] text-[0.92rem] leading-relaxed text-fg-soft">
                {REPLY.slice(0, typed)}
                {step >= 4 && typed < REPLY.length && <span className="anim-caret ml-0.5 inline-block h-[1em] w-[2px] translate-y-[2px] bg-signal" />}
                {step < 4 && <span className="text-dim">Esperando contexto…</span>}
              </p>
              <p className="label-mono mt-5 flex items-center gap-2 text-dim">
                <span className="h-1 w-1 rounded-full bg-ice" /> Aprobación humana configurable
              </p>
            </article>
          </div>

          {/* completion */}
          <div
            className={`min-w-0 rounded-[22px] border p-6 transition-all duration-1000 ease-[var(--ease-out-expo)] md:p-8 lg:col-span-12 ${
              done ? 'border-signal/20 bg-gradient-to-r from-signal/[0.06] to-transparent' : 'border-white/[0.06] opacity-50'
            }`}
          >
            <div className="grid items-center gap-8 lg:grid-cols-[auto_1fr_auto]">
              <p className="flex items-center gap-3 text-[1.3rem] font-medium tracking-[-0.02em]">
                <span className={`grid h-8 w-8 place-items-center rounded-full border transition-colors ${done ? 'border-signal text-signal' : 'border-white/15 text-dim'}`}>✓</span>
                {done ? 'Proceso completado' : 'Procesando…'}
              </p>
              <div className="grid gap-3">
                <Bar label="Tiempo humano (estimado)" value={`${HUMAN_MIN} minutos`} pct={done ? 100 : 0} muted />
                <Bar label="Tiempo con IA" value={`${AI_SEC} segundos`} pct={done ? (AI_SEC / (HUMAN_MIN * 60)) * 100 : 0} />
              </div>
              <div className="flex flex-col items-start gap-3 lg:items-end">
                <IllustrativeTag>Ejemplo ilustrativo</IllustrativeTag>
                <MagneticButton variant="ghost" onClick={replay} strength={0.15}>
                  ↻ Reproducir
                </MagneticButton>
              </div>
            </div>
            <p className="mt-6 text-[0.78rem] text-dim">
              Valores de ejemplo con fines demostrativos. No representan resultados reales de clientes; el impacto depende de cada proceso.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

function Bar({ label, value, pct, muted }: { label: string; value: string; pct: number; muted?: boolean }) {
  return (
    <div className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1.5 sm:grid-cols-[180px_1fr_110px]">
      <span className="label-mono text-dim">{label}</span>
      <span className="order-last col-span-2 h-[3px] overflow-hidden rounded-full bg-white/[0.06] sm:order-none sm:col-span-1">
        <span
          className={`block h-full rounded-full transition-[width] duration-[1600ms] ease-[var(--ease-out-expo)] ${muted ? 'bg-white/30' : 'bg-signal'}`}
          style={{ width: `${Math.max(pct, pct > 0 ? 1.5 : 0)}%` }}
        />
      </span>
      <span className={`text-right text-[0.95rem] tabular-nums ${muted ? 'text-mute' : 'text-fg'}`}>{value}</span>
    </div>
  )
}
