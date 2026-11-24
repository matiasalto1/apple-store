'use client'

import dynamic from 'next/dynamic'

// Overlays: se cargan después del contenido principal.
const CartDrawer = dynamic(() => import('@/components/cart/CartDrawer').then((m) => m.CartDrawer), { ssr: false })
const MobileMenu = dynamic(() => import('./MobileMenu').then((m) => m.MobileMenu), { ssr: false })
const SearchOverlay = dynamic(() => import('./SearchOverlay').then((m) => m.SearchOverlay), { ssr: false })
const ProductQuickView = dynamic(() => import('@/components/product/ProductQuickView').then((m) => m.ProductQuickView), { ssr: false })
const FloatingActions = dynamic(() => import('./FloatingActions').then((m) => m.FloatingActions), { ssr: false })
const SmoothScroll = dynamic(() => import('./SmoothScroll').then((m) => m.SmoothScroll), { ssr: false })

export function GlobalUI() {
  return (
    <>
      <SmoothScroll />
      <CartDrawer />
      <MobileMenu />
      <SearchOverlay />
      <ProductQuickView />
      <FloatingActions />
    </>
  )
}
