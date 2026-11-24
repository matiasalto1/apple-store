import { discountPercent, formatPrice, cn } from '@/lib/format'

/** Precio con precio anterior y % solo si existe un precio anterior real. */
export function Price({
  value,
  compareAt,
  from,
  size = 'md',
  className,
}: {
  value: number
  compareAt?: number
  from?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}) {
  const off = discountPercent(value, compareAt)
  return (
    <span className={cn('inline-flex flex-wrap items-baseline gap-x-2 gap-y-0.5', className)}>
      {from && <span className="text-[0.8em] text-stone">Desde</span>}
      <span
        className={cn(
          'font-semibold tabular-nums tracking-[-0.01em]',
          size === 'lg' && 'text-[1.75rem]',
          size === 'md' && 'text-[1.0625rem]',
          size === 'sm' && 'text-[0.9375rem]',
        )}
      >
        {formatPrice(value)}
      </span>
      {off != null && compareAt && (
        <>
          <span className="text-[0.85em] text-stone line-through tabular-nums">{formatPrice(compareAt)}</span>
          <span className="rounded-full bg-accent-soft px-2 py-0.5 text-[0.72em] font-semibold text-accent-deep">−{off}%</span>
        </>
      )}
    </span>
  )
}
