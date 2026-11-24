'use client'

import { Heart } from 'lucide-react'
import { motion } from 'motion/react'
import { useFavorites } from '@/lib/favorites'
import { useHydrated } from '@/lib/hooks'
import { cn } from '@/lib/format'

export function FavoriteButton({ productId, name, className }: { productId: string; name: string; className?: string }) {
  const hydrated = useHydrated()
  const active = useFavorites((s) => s.ids.includes(productId)) && hydrated
  const toggle = useFavorites((s) => s.toggle)
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        toggle(productId)
      }}
      aria-pressed={active}
      aria-label={active ? `Quitar ${name} de favoritos` : `Guardar ${name} en favoritos`}
      className={cn('icon-btn bg-white/70 backdrop-blur hover:bg-white', className)}
    >
      <motion.span key={String(active)} initial={{ scale: 0.6 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 500, damping: 18 }}>
        <Heart size={18} className={active ? 'fill-accent text-accent' : ''} />
      </motion.span>
    </button>
  )
}
