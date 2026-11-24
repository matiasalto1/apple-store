'use client'

import { Heart } from 'lucide-react'
import Link from 'next/link'
import { catalog } from '@/lib/catalog/repository'
import { useFavorites } from '@/lib/favorites'
import { useHydrated } from '@/lib/hooks'
import { ProductGrid } from '@/components/product/ProductGrid'

export function FavoritesView() {
  const hydrated = useHydrated()
  const ids = useFavorites((s) => s.ids)
  if (!hydrated) return <div className="h-64" />
  const products = ids.flatMap((id) => catalog.getProductById(id) ?? [])
  if (!products.length)
    return (
      <div className="flex flex-col items-start gap-5 rounded-[var(--radius-card)] bg-ivory p-8 sm:p-12">
        <Heart size={28} className="text-stone" />
        <p className="font-display text-[1.75rem]">Todavía no guardaste productos.</p>
        <p className="text-ink-soft">Tocá el corazón en cualquier producto para encontrarlo rápido después.</p>
        <Link href="/tienda" className="btn btn-primary">
          Explorar la tienda
        </Link>
      </div>
    )
  return <ProductGrid products={products} />
}
