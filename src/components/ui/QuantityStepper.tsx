'use client'

import { Minus, Plus } from 'lucide-react'
import { cn } from '@/lib/format'

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 20,
  size = 'md',
  label = 'Cantidad',
  className,
}: {
  value: number
  onChange: (n: number) => void
  min?: number
  max?: number
  size?: 'sm' | 'md'
  label?: string
  className?: string
}) {
  const h = size === 'sm' ? 'h-9' : 'h-12'
  const w = size === 'sm' ? 'w-9' : 'w-11'
  return (
    <div
      className={cn('inline-flex items-center rounded-full border border-[var(--line-strong)] bg-white', h, className)}
      role="group"
      aria-label={label}
    >
      <button
        type="button"
        className={cn('grid place-items-center rounded-full transition hover:bg-sand disabled:opacity-30', h, w)}
        onClick={() => onChange(value - 1)}
        disabled={value <= min}
        aria-label="Restar uno"
      >
        <Minus size={size === 'sm' ? 14 : 16} />
      </button>
      <output className="min-w-7 text-center text-[0.95rem] font-semibold tabular-nums" aria-live="polite">
        {value}
      </output>
      <button
        type="button"
        className={cn('grid place-items-center rounded-full transition hover:bg-sand disabled:opacity-30', h, w)}
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
        aria-label="Sumar uno"
      >
        <Plus size={size === 'sm' ? 14 : 16} />
      </button>
    </div>
  )
}
