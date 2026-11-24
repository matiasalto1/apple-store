'use client'

import { AnimatePresence, motion } from 'motion/react'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/format'

export function FaqList({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <ul className="border-t hairline">
      {items.map((f, i) => (
        <li key={f.q} className="border-b hairline">
          <button
            type="button"
            className="flex min-h-[4.5rem] w-full items-center justify-between gap-6 text-left font-display text-[1.375rem] leading-tight"
            aria-expanded={open === i}
            onClick={() => setOpen(open === i ? null : i)}
          >
            {f.q}
            <Plus size={20} className={cn('shrink-0 transition-transform duration-500', open === i && 'rotate-45')} />
          </button>
          <AnimatePresence initial={false}>
            {open === i && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }} className="overflow-hidden">
                <p className="max-w-2xl pb-7 text-ink-soft">{f.a}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </li>
      ))}
    </ul>
  )
}
