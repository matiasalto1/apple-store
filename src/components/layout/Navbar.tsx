'use client'

import { motion, useAnimationControls } from 'motion/react'
import { Heart, Menu, Search, ShoppingBag, User } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { site } from '@/config/site'
import { useCart } from '@/lib/cart/store'
import { useFavorites } from '@/lib/favorites'
import { cn } from '@/lib/format'
import { useHydrated } from '@/lib/hooks'
import { useUI } from '@/lib/ui-store'
import { Logo } from '@/components/ui/Logo'

export function Navbar() {
  const pathname = usePathname()
  const overlayMode = pathname === '/'
  const [scrolled, setScrolled] = useState(false)
  const hydrated = useHydrated()
  const count = useCart((s) => s.lines.reduce((n, l) => n + l.quantity, 0))
  const lastAdded = useCart((s) => s.lastAdded)
  const favCount = useFavorites((s) => s.ids.length)
  const { openCart, setMenu, setSearch } = useUI()
  const bump = useAnimationControls()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (lastAdded) bump.start({ scale: [1, 1.28, 0.92, 1], rotate: [0, -8, 6, 0], transition: { duration: 0.6 } })
  }, [lastAdded, bump])

  const solid = scrolled || !overlayMode

  return (
    <header className="sticky top-0 z-[60] px-2 pt-2 sm:px-3">
      <div
        className={cn(
          'mx-auto flex max-w-[92rem] items-center justify-between gap-4 rounded-full px-3 transition-all duration-700 ease-[var(--ease-out-expo)] sm:px-5',
          solid ? 'glass h-14 bg-paper/85' : 'h-16 border border-transparent bg-transparent',
        )}
      >
        <div className="flex items-center gap-1 lg:gap-8">
          <button type="button" className="icon-btn lg:hidden" onClick={() => setMenu(true)} aria-label="Abrir menú">
            <Menu size={21} />
          </button>
          <Logo />
          <nav aria-label="Principal" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {site.nav.map((item) => {
                const active = pathname.startsWith(item.href)
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? 'page' : undefined}
                      className={cn(
                        'relative rounded-full px-3.5 py-2 text-[0.9rem] font-medium transition-colors hover:bg-ink/5',
                        active ? 'text-ink' : 'text-ink-soft hover:text-ink',
                      )}
                    >
                      {item.label}
                      {active && <motion.span layoutId="nav-dot" className="absolute bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-accent" />}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>
        </div>

        <div className="flex items-center">
          <button type="button" className="icon-btn" onClick={() => setSearch(true)} aria-label="Buscar productos">
            <Search size={20} />
          </button>
          <Link href="/cuenta" className="icon-btn hidden sm:inline-grid" aria-label="Mi cuenta">
            <User size={20} />
          </Link>
          <Link href="/favoritos" className="icon-btn relative hidden sm:inline-grid" aria-label={`Favoritos${hydrated && favCount ? ` (${favCount})` : ''}`}>
            <Heart size={20} />
            {hydrated && favCount > 0 && <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-accent" aria-hidden="true" />}
          </Link>
          <button
            type="button"
            onClick={openCart}
            className="relative ml-1 inline-flex h-11 items-center gap-2 rounded-full bg-ink pl-3.5 pr-4 text-paper transition hover:bg-accent-deep"
            aria-label={`Abrir carrito, ${hydrated ? count : 0} productos`}
          >
            <motion.span animate={bump} className="inline-grid">
              <ShoppingBag size={18} />
            </motion.span>
            <span className="min-w-3 text-[0.875rem] font-semibold tabular-nums">{hydrated ? count : 0}</span>
          </button>
        </div>
      </div>
    </header>
  )
}
