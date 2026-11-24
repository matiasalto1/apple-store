'use client'

import { ArrowUpRight, Heart, Search, User, X } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'motion/react'
import { site } from '@/config/site'
import { catalog } from '@/lib/catalog/repository'
import { useUI } from '@/lib/ui-store'
import { generalMessage } from '@/lib/whatsapp'
import { Overlay } from '@/components/ui/Overlay'
import { Logo } from '@/components/ui/Logo'
import { WhatsAppButton } from '@/components/whatsapp/WhatsAppButton'

/**
 * Menú mobile pensado para una mano: los destinos principales quedan
 * en la mitad inferior de la pantalla, el cierre también abajo.
 */
export function MobileMenu() {
  const open = useUI((s) => s.menuOpen)
  const setMenu = useUI((s) => s.setMenu)
  const setSearch = useUI((s) => s.setSearch)
  const close = () => setMenu(false)
  const links = [{ label: 'Inicio', href: '/' }, ...site.nav]
  const cats = catalog.listCategories().filter((c) => c.id !== 'ofertas')

  return (
    <Overlay open={open} onClose={close} label="Menú" side="left">
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between px-5 pt-4">
          <Logo onNavigate={close} />
          <button type="button" className="icon-btn" onClick={close} aria-label="Cerrar menú">
            <X size={21} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 pb-4 pt-6" data-lenis-prevent="">
          <p className="eyebrow mb-3 text-stone">Categorías</p>
          <ul className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 pb-2">
            {cats.map((c) => (
              <li key={c.id} className="shrink-0">
                <Link href={`/categoria/${c.slug}`} onClick={close} className="chip bg-white">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <nav aria-label="Menú principal" className="px-5">
          <ul className="border-t hairline">
            {links.map((l, i) => (
              <motion.li
                key={l.href}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.12 + i * 0.04, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="border-b hairline"
              >
                <Link href={l.href} onClick={close} className="flex min-h-[3.75rem] items-center justify-between font-display text-[1.75rem]">
                  {l.label}
                  <ArrowUpRight size={20} className="text-stone" />
                </Link>
              </motion.li>
            ))}
          </ul>
        </nav>

        <div className="grid grid-cols-3 gap-2 px-5 pt-4">
          <button type="button" onClick={() => setSearch(true)} className="flex flex-col items-center gap-1.5 rounded-2xl bg-sand/60 py-3 text-[0.8125rem] font-medium">
            <Search size={19} /> Buscar
          </button>
          <Link href="/favoritos" onClick={close} className="flex flex-col items-center gap-1.5 rounded-2xl bg-sand/60 py-3 text-[0.8125rem] font-medium">
            <Heart size={19} /> Favoritos
          </Link>
          <Link href="/cuenta" onClick={close} className="flex flex-col items-center gap-1.5 rounded-2xl bg-sand/60 py-3 text-[0.8125rem] font-medium">
            <User size={19} /> Cuenta
          </Link>
        </div>

        <div className="flex gap-2 px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-3">
          <WhatsAppButton message={generalMessage()} className="flex-1">
            Hablar por WhatsApp
          </WhatsAppButton>
          <button type="button" onClick={close} className="btn btn-ghost w-14 px-0" aria-label="Cerrar menú">
            <X size={20} />
          </button>
        </div>
      </div>
    </Overlay>
  )
}
