import { useSequence } from '@/hooks/useSequence'
import { DemoFrame } from './DemoFrame'

const STEPS = [
  { k: 'Cliente', d: '“¿Mi pedido llega antes del viernes?”' },
  { k: 'Consulta', d: 'Intención detectada: estado de entrega' },
  { k: 'Agente analiza', d: 'Identifica cliente y pedido asociado' },
  { k: 'Consulta sistemas', d: 'CRM · ERP · transportista' },
  { k: 'Toma decisión', d: 'Demora de 1 día → ofrecer envío prioritario' },
  { k: 'Ejecuta', d: 'Actualiza el pedido y registra la acción' },
  { k: 'Resultado', d: 'Respuesta enviada · cliente informado' },
]

export function AgentsDemo({ active }: { active: boolean }) {
  const i = useSequence(STEPS.length, { active, step: 820 })
  return (
    <DemoFrame title="agente.atencion" running={i >= 0 && i < STEPS.length} done={i >= STEPS.length}>
      <ol className="relative">
        <span aria-hidden="true" className="absolute bottom-3 left-[5px] top-3 w-px bg-white/[0.07]" />
        <span
          aria-hidden="true"
          className="absolute left-[5px] top-3 w-px origin-top bg-gradient-to-b from-signal to-signal/40 transition-[height] duration-700 ease-[var(--ease-out-expo)]"
          style={{ height: `calc(${(Math.max(0, Math.min(i, STEPS.length - 1)) / (STEPS.length - 1)) * 100}% - 24px)` }}
        />
        {STEPS.map((s, k) => {
          const on = k <= i
          const current = k === i
          return (
            <li key={s.k} className="relative flex items-start gap-4 py-[7px] md:gap-6">
              <span
                aria-hidden="true"
                className={`relative z-10 mt-[5px] h-[11px] w-[11px] shrink-0 rounded-full border transition-all duration-500 ${
                  on ? 'border-signal bg-signal' : 'border-white/20 bg-ink-900'
                } ${current ? 'shadow-[0_0_0_5px_rgb(255_148_71/0.15)]' : ''}`}
              />
              <div className="grid flex-1 gap-1 sm:grid-cols-[150px_1fr] sm:gap-6">
                <span className={`label-mono pt-[3px] transition-colors duration-500 ${on ? 'text-fg' : 'text-dim'}`}>{s.k}</span>
                <span
                  className={`text-[0.92rem] transition-all duration-700 ease-[var(--ease-out-expo)] ${
                    on ? 'translate-x-0 text-fg-soft opacity-100' : 'translate-x-2 opacity-0'
                  } ${k === STEPS.length - 1 && on ? 'text-signal-soft' : ''}`}
                >
                  {s.d}
                </span>
              </div>
            </li>
          )
        })}
      </ol>
    </DemoFrame>
  )
}
