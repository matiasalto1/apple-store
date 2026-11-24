import { isAvailable, isOnSale } from '@/lib/catalog/repository'
import type { Product } from '@/lib/catalog/types'

export function ProductBadges({ product }: { product: Product }) {
  const badges: { label: string; tone: 'ink' | 'accent' | 'soft' }[] = []
  if (!isAvailable(product)) badges.push({ label: 'Sin stock', tone: 'soft' })
  else if (isOnSale(product)) badges.push({ label: 'Oferta', tone: 'accent' })
  if (product.tags.includes('nuevo')) badges.push({ label: 'Nuevo', tone: 'ink' })
  if (product.tags.includes('recien-nacido')) badges.push({ label: 'Recién nacido', tone: 'soft' })
  if (!badges.length) return null
  return (
    <div className="flex flex-wrap gap-1.5">
      {badges.map((b) => (
        <span
          key={b.label}
          className={
            b.tone === 'ink'
              ? 'rounded-full bg-ink px-2.5 py-1 text-[0.6875rem] font-semibold tracking-wide text-paper'
              : b.tone === 'accent'
                ? 'rounded-full bg-accent px-2.5 py-1 text-[0.6875rem] font-semibold tracking-wide text-paper'
                : 'rounded-full bg-white/80 px-2.5 py-1 text-[0.6875rem] font-semibold tracking-wide text-ink-soft backdrop-blur'
          }
        >
          {b.label}
        </span>
      ))}
    </div>
  )
}
