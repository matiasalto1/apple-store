'use client'

import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { MAX_QTY_PER_LINE } from './limits'

export { MAX_QTY_PER_LINE }

export interface CartLine {
  productId: string
  variantId: string
  quantity: number
}


interface CartState {
  lines: CartLine[]
  /** Último producto agregado, para feedback visual (no se persiste). */
  lastAdded: { productId: string; at: number } | null
  add: (productId: string, variantId: string, quantity?: number) => void
  addMany: (items: CartLine[]) => void
  setQuantity: (productId: string, variantId: string, quantity: number) => void
  changeVariant: (productId: string, fromVariantId: string, toVariantId: string) => void
  remove: (productId: string, variantId: string) => void
  clear: () => void
}

const same = (l: CartLine, productId: string, variantId: string) =>
  l.productId === productId && l.variantId === variantId

const clamp = (n: number) => Math.max(1, Math.min(MAX_QTY_PER_LINE, Math.round(n)))

function merge(lines: CartLine[], item: CartLine): CartLine[] {
  const existing = lines.find((l) => same(l, item.productId, item.variantId))
  if (existing) {
    return lines.map((l) => (l === existing ? { ...l, quantity: clamp(l.quantity + item.quantity) } : l))
  }
  return [...lines, { ...item, quantity: clamp(item.quantity) }]
}

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      lines: [],
      lastAdded: null,
      add: (productId, variantId, quantity = 1) =>
        set((s) => ({
          lines: merge(s.lines, { productId, variantId, quantity }),
          lastAdded: { productId, at: Date.now() },
        })),
      addMany: (items) =>
        set((s) => ({
          lines: items.reduce(merge, s.lines),
          lastAdded: items[0] ? { productId: items[0].productId, at: Date.now() } : s.lastAdded,
        })),
      setQuantity: (productId, variantId, quantity) =>
        set((s) => ({
          lines:
            quantity <= 0
              ? s.lines.filter((l) => !same(l, productId, variantId))
              : s.lines.map((l) => (same(l, productId, variantId) ? { ...l, quantity: clamp(quantity) } : l)),
        })),
      changeVariant: (productId, fromVariantId, toVariantId) =>
        set((s) => {
          const line = s.lines.find((l) => same(l, productId, fromVariantId))
          if (!line || fromVariantId === toVariantId) return s
          const rest = s.lines.filter((l) => l !== line)
          // si ya existe la variante destino, se suman las cantidades
          return { lines: merge(rest, { productId, variantId: toVariantId, quantity: line.quantity }) }
        }),
      remove: (productId, variantId) => set((s) => ({ lines: s.lines.filter((l) => !same(l, productId, variantId)) })),
      clear: () => set({ lines: [] }),
    }),
    {
      name: 'cart-v1',
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ lines: s.lines }),
    },
  ),
)
