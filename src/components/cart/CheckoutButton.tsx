'use client'

import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/format'
import { useUI } from '@/lib/ui-store'

export function CheckoutButton({ disabled, className }: { disabled?: boolean; className?: string }) {
  const close = useUI((s) => s.closeCart)
  if (disabled)
    return (
      <button type="button" disabled className={cn('btn btn-primary w-full', className)}>
        Finalizar compra
      </button>
    )
  return (
    <Link href="/checkout" onClick={close} className={cn('btn btn-primary w-full', className)}>
      Finalizar compra <ArrowRight size={17} />
    </Link>
  )
}
