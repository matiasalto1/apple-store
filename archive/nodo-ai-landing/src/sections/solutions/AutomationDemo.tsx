import { useSequence } from '@/hooks/useSequence'
import { Check, DemoFrame } from './DemoFrame'

const STEPS = [
  { k: 'Evento', d: 'Nuevo pedido recibido', t: '00.0s' },
  { k: 'Valida', d: 'Datos y condiciones comerciales', t: '00.4s' },
  { k: 'Stock', d: 'Disponibilidad confirmada', t: '01.1s' },
  { k: 'Factura', d: 'Documento generado', t: '01.9s' },
  { k: 'Notifica', d: 'Equipo y cliente informados', t: '02.3s' },
  { k: 'Registra', d: 'ERP y CRM actualizados', t: '02.8s' },
]

export function AutomationDemo({ active }: { active: boolean }) {
  const i = useSequence(STEPS.length, { active, step: 700 })
  const pct = Math.max(0, Math.min(i, STEPS.length - 1)) / (STEPS.length - 1)
  return (
    <DemoFrame title="flujo.pedidos" running={i >= 0 && i < STEPS.length} done={i >= STEPS.length}>
      {/* pipeline track */}
      <div className="relative mb-8 mt-2 hidden sm:block">
        <div className="absolute left-0 right-0 top-[15px] h-px bg-white/[0.08]" />
        <div
          className="absolute left-0 top-[15px] h-px bg-signal transition-[width] duration-700 ease-[var(--ease-out-expo)]"
          style={{ width: i < 0 ? '0%' : `${pct * 100}%` }}
        />
        <div
          className="absolute top-[11px] h-[9px] w-[9px] -translate-x-1/2 rounded-full bg-signal-soft shadow-[0_0_16px_var(--color-signal)] transition-[left,opacity] duration-700 ease-[var(--ease-out-expo)]"
          style={{ left: `${pct * 100}%`, opacity: i >= 0 && i < STEPS.length ? 1 : 0 }}
        />
        <ol className="relative flex justify-between">
          {STEPS.map((s, k) => (
            <li key={s.k} className="flex flex-col items-center gap-3">
              <span
                className={`grid h-[31px] w-[31px] place-items-center rounded-[9px] border bg-ink-900 transition-colors duration-500 ${
                  k <= i ? 'border-signal/60' : 'border-white/12'
                }`}
              >
                <Check on={k < i || i >= STEPS.length} />
              </span>
              <span className={`label-mono transition-colors duration-500 ${k <= i ? 'text-fg' : 'text-dim'}`}>{s.k}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* execution log */}
      <div className="rounded-xl border border-white/[0.06] bg-ink-950/60 p-4 font-mono text-[12px] leading-relaxed">
        {STEPS.map((s, k) => (
          <div
            key={s.k}
            className={`flex gap-4 transition-all duration-500 ${k <= i ? 'opacity-100' : 'opacity-0'} ${k === i ? 'text-fg' : 'text-mute'}`}
          >
            <span className="w-12 shrink-0 text-dim">{s.t}</span>
            <span className="w-16 shrink-0 text-signal-soft">{s.k.toLowerCase()}</span>
            <span className="truncate">{s.d}</span>
          </div>
        ))}
        <div className={`mt-2 border-t border-white/[0.06] pt-2 text-signal-soft transition-opacity duration-500 ${i >= STEPS.length ? 'opacity-100' : 'opacity-0'}`}>
          ✓ Flujo completado sin intervención manual
        </div>
      </div>
    </DemoFrame>
  )
}
