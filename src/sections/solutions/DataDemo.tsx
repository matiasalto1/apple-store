import { useSequence } from '@/hooks/useSequence'
import { DemoFrame } from './DemoFrame'

const STAGES = ['Fuentes', 'Unifica', 'Modela', 'Detecta', 'Predice', 'Insight']
const SOURCES = ['Ventas', 'CRM', 'Inventario', 'Web']
// illustrative series (not real data)
const HISTORY = [38, 44, 41, 52, 49, 58, 61, 57, 66]
const FORECAST = [70, 76, 81]

export function DataDemo({ active }: { active: boolean }) {
  const i = useSequence(STAGES.length, { active, step: 850 })
  const max = 90
  const W = 100
  const n = HISTORY.length + FORECAST.length
  const x = (k: number) => (k / (n - 1)) * W
  const y = (v: number) => 40 - (v / max) * 36
  const forecastPath = [HISTORY.length - 1, ...FORECAST.map((_, k) => HISTORY.length + k)]
    .map((k, j) => `${j ? 'L' : 'M'}${x(k)},${y(k < HISTORY.length ? HISTORY[k] : FORECAST[k - HISTORY.length])}`)
    .join(' ')

  return (
    <DemoFrame title="datos.inteligencia" running={i >= 0 && i < STAGES.length} done={i >= STAGES.length}>
      <ol className="mb-6 flex flex-wrap gap-x-1 gap-y-2">
        {STAGES.map((s, k) => (
          <li key={s} className="flex items-center gap-1">
            <span
              className={`label-mono rounded-full px-2.5 py-1 transition-all duration-500 ${
                k <= i ? 'bg-signal/[0.12] text-signal-soft' : 'text-dim'
              }`}
            >
              {s}
            </span>
            {k < STAGES.length - 1 && <span className="text-[10px] text-faint">→</span>}
          </li>
        ))}
      </ol>

      <div className="grid gap-5 md:grid-cols-[120px_1fr]">
        <ul className="grid grid-cols-4 gap-2 md:grid-cols-1">
          {SOURCES.map((s, k) => (
            <li
              key={s}
              className={`label-mono flex items-center gap-2 rounded-lg border px-3 py-2 transition-all duration-500 ${
                i >= 1 ? 'border-signal/25 text-fg-soft' : i >= 0 ? 'border-white/10 text-mute' : 'border-white/[0.05] text-dim'
              }`}
              style={{ transitionDelay: `${k * 80}ms` }}
            >
              <span className={`h-1 w-1 rounded-full ${i >= 1 ? 'bg-signal' : 'bg-white/25'}`} />
              {s}
            </li>
          ))}
        </ul>

        <div className="rounded-xl border border-white/[0.06] bg-ink-950/60 p-4">
          <svg viewBox="0 0 100 44" className="h-36 w-full overflow-visible md:h-40" aria-label="Serie de datos ilustrativa con previsión">
            {[10, 22, 34].map((g) => (
              <line key={g} x1="0" x2="100" y1={g} y2={g} stroke="white" strokeOpacity=".05" strokeWidth=".3" />
            ))}
            {HISTORY.map((v, k) => (
              <rect
                key={k}
                x={x(k) - 2}
                width="4"
                rx=".6"
                y={i >= 2 ? y(v) : 40}
                height={i >= 2 ? 40 - y(v) : 0}
                fill="white"
                fillOpacity={i >= 3 && k >= 5 ? 0.35 : 0.14}
                style={{ transition: `all .9s cubic-bezier(.16,1,.3,1) ${k * 45}ms` }}
              />
            ))}
            <path
              d={forecastPath}
              fill="none"
              stroke="var(--color-signal)"
              strokeWidth=".7"
              strokeDasharray="2 1.4"
              style={{ opacity: i >= 4 ? 1 : 0, transition: 'opacity .8s' }}
            />
            {FORECAST.map((v, k) => (
              <circle key={k} cx={x(HISTORY.length + k)} cy={y(v)} r=".9" fill="var(--color-signal)" style={{ opacity: i >= 4 ? 1 : 0, transition: `opacity .6s ${k * 120}ms` }} />
            ))}
          </svg>
          <div
            className={`mt-3 flex items-start gap-3 rounded-lg border border-signal/20 bg-signal/[0.06] p-3 text-[0.85rem] transition-all duration-700 ease-[var(--ease-out-expo)] ${
              i >= 5 ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
            }`}
          >
            <span className="label-mono mt-[3px] text-signal">Insight</span>
            <span className="text-fg-soft">Demanda prevista en alza para la categoría B. Sugerencia: anticipar reposición.</span>
          </div>
        </div>
      </div>
    </DemoFrame>
  )
}
