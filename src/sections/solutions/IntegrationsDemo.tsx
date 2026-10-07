import { useSequence } from '@/hooks/useSequence'
import { DemoFrame } from './DemoFrame'

const SYSTEMS = ['CRM', 'ERP', 'Email', 'WhatsApp', 'E-commerce', 'Base de datos']
const EVENTS = [
  { from: 4, to: 1, msg: 'Pedido web → ERP' },
  { from: 1, to: 0, msg: 'Estado de cuenta → CRM' },
  { from: 3, to: 0, msg: 'Conversación registrada en CRM' },
  { from: 0, to: 2, msg: 'Seguimiento programado por email' },
  { from: 5, to: 4, msg: 'Stock sincronizado con la tienda' },
]

export function IntegrationsDemo({ active }: { active: boolean }) {
  const i = useSequence(EVENTS.length, { active, step: 1100 })
  const R = 38
  const pos = SYSTEMS.map((_, k) => {
    const a = (k / SYSTEMS.length) * Math.PI * 2 - Math.PI / 2
    return { x: 50 + Math.cos(a) * R, y: 50 + Math.sin(a) * R * 0.78 }
  })
  const ev = i >= 0 && i < EVENTS.length ? EVENTS[i] : null

  return (
    <DemoFrame title="integraciones.hub" running={!!ev} done={i >= EVENTS.length}>
      <div className="grid items-center gap-6 md:grid-cols-[1.25fr_1fr]">
        <div className="relative aspect-[1.15]">
          <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
            {pos.map((p, k) => {
              const hot = ev && (ev.from === k || ev.to === k)
              return (
                <line
                  key={k}
                  x1="50"
                  y1="50"
                  x2={p.x}
                  y2={p.y}
                  stroke={hot ? 'var(--color-signal)' : 'white'}
                  strokeOpacity={hot ? 0.8 : 0.1}
                  strokeWidth=".35"
                  style={{ transition: 'all .5s' }}
                />
              )
            })}
            {ev && (
              <g key={i}>
                <circle r="1.3" fill="var(--color-signal-soft)">
                  <animate attributeName="cx" values={`${pos[ev.from].x};50;${pos[ev.to].x}`} dur="1s" fill="freeze" />
                  <animate attributeName="cy" values={`${pos[ev.from].y};50;${pos[ev.to].y}`} dur="1s" fill="freeze" />
                </circle>
              </g>
            )}
            <circle cx="50" cy="50" r="7" fill="var(--color-ink-800)" stroke="var(--color-signal)" strokeOpacity=".6" strokeWidth=".4" />
            <circle cx="50" cy="50" r="2.2" fill="var(--color-signal)" />
          </svg>
          {pos.map((p, k) => {
            const hot = ev && (ev.from === k || ev.to === k)
            return (
              <span
                key={SYSTEMS[k]}
                className={`label-mono absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full border bg-ink-900 px-2.5 py-1 transition-all duration-500 ${
                  hot ? 'border-signal/50 text-fg' : 'border-white/10 text-mute'
                }`}
                style={{ left: `${p.x}%`, top: `${p.y}%` }}
              >
                {SYSTEMS[k]}
              </span>
            )
          })}
        </div>
        <ul className="space-y-2 font-mono text-[12px]">
          {EVENTS.map((e, k) => (
            <li
              key={e.msg}
              className={`flex items-center gap-3 rounded-lg border px-3 py-2 transition-all duration-500 ${
                k === i ? 'border-signal/30 bg-signal/[0.06] text-fg' : k < i ? 'border-white/[0.05] text-mute' : 'border-transparent text-dim opacity-40'
              }`}
            >
              <span className={k <= i ? 'text-signal' : ''}>{k < i || i >= EVENTS.length ? '✓' : k === i ? '↻' : '·'}</span>
              {e.msg}
            </li>
          ))}
        </ul>
      </div>
    </DemoFrame>
  )
}
