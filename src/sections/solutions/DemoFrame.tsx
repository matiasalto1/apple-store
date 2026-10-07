import type { ReactNode } from 'react'
import { IllustrativeTag } from '@/components/ui/IllustrativeTag'

interface Props {
  title: string
  running: boolean
  done: boolean
  children: ReactNode
}

/** Instrument-like frame shared by the solution mini-demos. */
export function DemoFrame({ title, running, done, children }: Props) {
  return (
    <div className="ticks relative rounded-[22px] border border-white/[0.07] bg-ink-900/80">
      <span className="tick tick-tl rounded-tl-[22px]" />
      <span className="tick tick-tr rounded-tr-[22px]" />
      <span className="tick tick-bl rounded-bl-[22px]" />
      <span className="tick tick-br rounded-br-[22px]" />
      <div className="flex items-center justify-between gap-4 border-b border-white/[0.06] px-5 py-3.5 md:px-6">
        <div className="label-mono flex items-center gap-2.5 text-mute">
          <span
            className={`h-1.5 w-1.5 rounded-full transition-colors duration-500 ${
              done ? 'bg-emerald-400/90' : running ? 'anim-blink bg-signal' : 'bg-white/25'
            }`}
          />
          <span className="truncate">{title}</span>
          <span className="hidden text-dim sm:inline">· {done ? 'completado' : running ? 'ejecutando' : 'en espera'}</span>
        </div>
        <IllustrativeTag>Demostración</IllustrativeTag>
      </div>
      <div className="p-5 md:p-7">{children}</div>
    </div>
  )
}

export function Check({ on }: { on: boolean }) {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true" className={`transition-opacity duration-500 ${on ? 'opacity-100' : 'opacity-0'}`}>
      <path d="M3.5 8.5l3 3 6-7" fill="none" stroke="var(--color-signal)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
