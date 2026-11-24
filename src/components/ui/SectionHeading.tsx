import { cn } from '@/lib/format'
import { RevealLines } from './Reveal'

export function SectionHeading({
  eyebrow,
  title,
  text,
  align = 'left',
  className,
  id,
  action,
}: {
  eyebrow?: string
  title: React.ReactNode[]
  text?: string
  align?: 'left' | 'center'
  className?: string
  id?: string
  action?: React.ReactNode
}) {
  return (
    <div
      className={cn(
        'flex flex-col gap-6 md:flex-row md:items-end md:justify-between',
        align === 'center' && 'items-center text-center md:flex-col md:items-center',
        className,
      )}
    >
      <div className={cn('max-w-3xl', align === 'center' && 'mx-auto')}>
        {eyebrow && <p className="eyebrow mb-4 text-accent">{eyebrow}</p>}
        <h2 id={id} className="font-display text-headline">
          <RevealLines lines={title} />
        </h2>
        {text && <p className={cn('mt-5 max-w-xl text-[1.0625rem] text-ink-soft', align === 'center' && 'mx-auto')}>{text}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}
