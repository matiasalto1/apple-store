'use client'

import { create } from 'zustand'

/** Estado de interfaz global (no persistido): drawers, overlays y quick view. */
interface UIState {
  cartOpen: boolean
  menuOpen: boolean
  searchOpen: boolean
  quickViewId: string | null
  openCart: () => void
  closeCart: () => void
  setMenu: (open: boolean) => void
  setSearch: (open: boolean) => void
  openQuickView: (productId: string) => void
  closeQuickView: () => void
}

export const useUI = create<UIState>()((set) => ({
  cartOpen: false,
  menuOpen: false,
  searchOpen: false,
  quickViewId: null,
  openCart: () => set({ cartOpen: true, menuOpen: false, searchOpen: false, quickViewId: null }),
  closeCart: () => set({ cartOpen: false }),
  setMenu: (menuOpen) => set({ menuOpen, searchOpen: false }),
  setSearch: (searchOpen) => set({ searchOpen, menuOpen: false }),
  openQuickView: (quickViewId) => set({ quickViewId }),
  closeQuickView: () => set({ quickViewId: null }),
}))
