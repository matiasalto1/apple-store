import type { Product } from '@/lib/catalog/types'
import { cn } from '@/lib/format'
import { ProductCard } from './ProductCard'

export function ProductGrid({ products, className, priorityCount = 0 }: { products: Product[]; className?: string; priorityCount?: number }) {
  return (
    <ul className={cn('grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-5 md:grid-cols-3 xl:grid-cols-4', className)}>
      {products.map((p, i) => (
        <li key={p.id} className="flex">
          <ProductCard product={p} priority={i < priorityCount} className="w-full" />
        </li>
      ))}
    </ul>
  )
}
