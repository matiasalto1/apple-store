'use client'

import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

interface FavoritesState {
  ids: string[]
  toggle: (productId: string) => void
  has: (productId: string) => boolean
}

export const useFavorites = create<FavoritesState>()(
  persist(
    (set, get) => ({
      ids: [],
      toggle: (id) => set((s) => ({ ids: s.ids.includes(id) ? s.ids.filter((x) => x !== id) : [id, ...s.ids] })),
      has: (id) => get().ids.includes(id),
    }),
    { name: 'favorites-v1', storage: createJSONStorage(() => localStorage), partialize: (s) => ({ ids: s.ids }) },
  ),
)
