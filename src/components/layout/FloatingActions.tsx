'use client'

import { AnimatePresence, motion } from 'motion/react'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { generalMessage, whatsappUrl } from '@/lib/whatsapp'
import { WhatsAppIcon } from '@/components/ui/BrandIcons'

/** Botón flotante de WhatsApp. Se oculta en checkout y en fichas (allí hay barra propia). */
export function FloatingActions() {
  const pathname = usePathname()
  const [show, setShow] = useState(false)
  const hidden = pathname.startsWith('/checkout') || pathname.startsWith('/producto/')

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 480)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <AnimatePresence>
      {show && !hidden && (
        <motion.a
          href={whatsappUrl(generalMessage())}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Escribinos por WhatsApp"
          initial={{ opacity: 0, scale: 0.6, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 20 }}
          transition={{ type: 'spring', stiffness: 380, damping: 26 }}
          className="group fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-50 flex h-14 items-center gap-2 rounded-full bg-whatsapp pl-4 pr-4 text-white shadow-[0_18px_40px_-12px_rgb(31_143_85/0.6)] sm:right-6"
        >
          <WhatsAppIcon size={24} />
          <span className="hidden max-w-0 overflow-hidden whitespace-nowrap text-[0.9rem] font-semibold transition-all duration-500 group-hover:max-w-40 sm:inline">
            ¿Te ayudamos?
          </span>
        </motion.a>
      )}
    </AnimatePresence>
  )
}
