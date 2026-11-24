'use client'

import { AnimatePresence, motion } from 'motion/react'
import { Check, ShoppingBag } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useCart } from '@/lib/cart/store'
import { cn } from '@/lib/format'
import { useUI } from '@/lib/ui-store'

export function AddToCartButton({
  productId,
  variantId,
  quantity = 1,
  disabled,
  openCart = false,
  className,
  label = 'Agregar al carrito',
  compact,
  onAdded,
}: {
  productId: string
  variantId: string
  quantity?: number
  disabled?: boolean
  openCart?: boolean
  className?: string
  label?: string
  compact?: boolean
  onAdded?: () => void
}) {
  const add = useCart((s) => s.add)
  const open = useUI((s) => s.openCart)
  const [done, setDone] = useState(false)
  const timer = useRef<number | undefined>(undefined)
  useEffect(() => () => window.clearTimeout(timer.current), [])

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        add(productId, variantId, quantity)
        setDone(true)
        onAdded?.()
        window.clearTimeout(timer.current)
        timer.current = window.setTimeout(() => setDone(false), 1600)
        if (openCart) window.setTimeout(open, 350)
      }}
      className={cn('btn btn-primary overflow-hidden', compact && 'min-h-10 px-4 text-[0.875rem]', className)}
      aria-live="polite"
    >
      <AnimatePresence mode="wait" initial={false}>
        {disabled ? (
          <span key="na">Sin stock</span>
        ) : done ? (
          <motion.span
            key="done"
            className="inline-flex items-center gap-2"
            initial={{ y: 14, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -14, opacity: 0 }}
            transition={{ duration: 0.28 }}
          >
            <Check size={17} strokeWidth={2.4} /> Agregado
          </motion.span>
        ) : (
          <motion.span
            key="add"
            className="inline-flex items-center gap-2"
            initial={{ y: 14, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -14, opacity: 0 }}
            transition={{ duration: 0.28 }}
          >
            <ShoppingBag size={17} /> {label}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  )
}
