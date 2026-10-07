import { useRef, useState } from 'react'
import { gsap, MQ, useGSAP } from '@/lib/gsap'
import { RevealText } from '@/components/ui/RevealText'
import { SectionLabel } from '@/components/ui/SectionLabel'

/* Generic system categories — no third-party logos. */
const PORTS = [
  { name: 'CRM', proto: 'REST · Webhooks', note: 'Clientes, oportunidades y actividad comercial.' },
  { name: 'ERP', proto: 'API · SQL · Archivos', note: 'Pedidos, stock, facturación y finanzas.' },
  { name: 'WhatsApp', proto: 'API de mensajería', note: 'Conversaciones con clientes en el canal que ya usan.' },
  { name: 'Email', proto: 'IMAP · SMTP · API', note: 'Bandejas compartidas, respuestas y seguimiento.' },
  { name: 'APIs', proto: 'REST · GraphQL', note: 'Cualquier servicio con una interfaz documentada.' },
  { name: 'Bases de datos', proto: 'SQL · NoSQL', note: 'Lectura y escritura controlada sobre tus datos.' },
  { name: 'E-commerce', proto: 'API · Webhooks', note: 'Catálogo, pedidos y estado de envíos.' },
  { name: 'Herramientas internas', proto: 'Conectores a medida', note: 'Planillas, sistemas propios y legados.' },
]

const PRINCIPLES = [
  { t: 'Seguridad desde el diseño', d: 'Accesos mínimos necesarios, cifrado y registros de cada acción.' },
  { t: 'Tus datos, bajo tu control', d: 'Definimos juntos qué información usa el sistema y dónde vive.' },
  { t: 'Supervisión humana', d: 'Las decisiones sensibles pueden requerir aprobación de tu equipo.' },
  { t: 'Adopción gradual', d: 'Empezamos por un proceso, medimos y escalamos sobre resultados.' },
]

export function Integrations() {
  const root = useRef<HTMLElement>(null)
  const [hot, setHot] = useState<number | null>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MQ.motion, () => {
        gsap.from('[data-port]', {
          autoAlpha: 0,
          y: 24,
          duration: 1,
          stagger: { each: 0.06, grid: 'auto', from: 'start' },
          scrollTrigger: { trigger: '[data-panel]', start: 'top 80%', once: true },
        })
        gsap.from('[data-principle]', {
          autoAlpha: 0,
          y: 20,
          duration: 1,
          stagger: 0.08,
          scrollTrigger: { trigger: '[data-principles]', start: 'top 85%', once: true },
        })
      })
      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <section ref={root} id="integraciones" data-scene="hidden" className="relative py-[14vh] lg:py-[18vh]" aria-labelledby="int-title">
      <div className="container-x">
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <SectionLabel index="10">Integración</SectionLabel>
            <RevealText id="int-title" className="text-headline mt-6 max-w-[17ch] font-medium">
              Pensado para integrarse con la realidad de tu empresa.
            </RevealText>
          </div>
          <p className="self-end text-mute lg:col-span-4" data-reveal>
            Trabajamos sobre las herramientas que ya usás. Sin migraciones forzadas, sin empezar de cero.
          </p>
        </div>

        {/* patch panel */}
        <div data-panel className="ticks relative mt-14 rounded-[26px] border border-white/[0.07] bg-ink-900/40 p-3 md:p-4 lg:mt-20">
          <span className="tick tick-tl" />
          <span className="tick tick-tr" />
          <span className="tick tick-bl" />
          <span className="tick tick-br" />
          <div className="label-mono flex items-center justify-between px-3 pb-4 pt-2 text-dim md:px-4">
            <span className="flex items-center gap-2">
              <span className="anim-blink h-1.5 w-1.5 rounded-full bg-signal" /> Panel de conexiones
            </span>
            <span className="hidden sm:inline">{hot !== null ? `${PORTS[hot].name} · ${PORTS[hot].proto}` : '8 categorías de sistemas'}</span>
          </div>
          <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-[18px] bg-white/[0.05] md:grid-cols-4">
            {PORTS.map((p, i) => (
              <li
                key={p.name}
                data-port
                tabIndex={0}
                onMouseEnter={() => setHot(i)}
                onMouseLeave={() => setHot(null)}
                onFocus={() => setHot(i)}
                onBlur={() => setHot(null)}
                className="group relative flex min-h-[170px] flex-col justify-between bg-ink-950 p-5 outline-none transition-colors duration-500 hover:bg-ink-900 focus-visible:bg-ink-900 md:min-h-[210px] md:p-6"
              >
                <div className="flex items-start justify-between">
                  {/* port socket */}
                  <span aria-hidden="true" className="relative grid h-9 w-9 place-items-center rounded-[10px] border border-white/10 transition-colors duration-500 group-hover:border-signal/50">
                    <span className="h-2.5 w-2.5 rounded-[3px] border border-white/25 transition-all duration-500 group-hover:border-signal group-hover:bg-signal group-hover:shadow-[0_0_14px_var(--color-signal)]" />
                  </span>
                  <span
                    aria-hidden="true"
                    className="h-1.5 w-1.5 rounded-full bg-white/20 transition-colors duration-500 group-hover:bg-emerald-400/90"
                  />
                </div>
                <div>
                  <h3 className="text-[1.15rem] font-medium tracking-[-0.02em] md:text-[1.3rem]">{p.name}</h3>
                  <p className="label-mono mt-1.5 text-[0.6rem] text-dim">{p.proto}</p>
                  <p className="mt-3 max-h-0 overflow-hidden text-[0.82rem] text-mute opacity-0 transition-all duration-500 ease-[var(--ease-out-expo)] group-hover:max-h-20 group-hover:opacity-100 group-focus-visible:max-h-20 group-focus-visible:opacity-100">
                    {p.note}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <ul data-principles className="mt-16 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {PRINCIPLES.map((p, i) => (
            <li key={p.t} data-principle className="border-t border-white/[0.08] pt-6">
              <p className="label-mono text-dim">0{i + 1}</p>
              <h3 className="mt-4 text-[1.1rem] font-medium tracking-[-0.015em]">{p.t}</h3>
              <p className="mt-2 text-[0.9rem] text-mute">{p.d}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
