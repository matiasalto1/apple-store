import type { Metadata } from 'next'
import { Heart, Package, ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import { generalMessage } from '@/lib/whatsapp'
import { WhatsAppButton } from '@/components/whatsapp/WhatsAppButton'

export const metadata: Metadata = { title: 'Mi cuenta', robots: { index: false } }

/**
 * Las cuentas de cliente todavía no existen (requieren backend de autenticación).
 * Esta página lo dice con claridad y ofrece lo que sí funciona hoy.
 */
export default function AccountPage() {
  return (
    <div className="container-x max-w-4xl pt-10 sm:pt-14">
      <h1 className="font-display text-display">Mi cuenta</h1>
      <p className="mt-5 max-w-xl text-[1.0625rem] text-ink-soft">
        Muy pronto vas a poder crear tu cuenta para ver tus pedidos y repetir compras. Por ahora no hace falta registrarse:
        tu carrito y tus favoritos se guardan en este dispositivo.
      </p>
      <ul className="mt-12 grid gap-4 sm:grid-cols-3">
        <li>
          <Link href="/favoritos" className="flex h-full flex-col gap-4 rounded-[var(--radius-card)] bg-ivory p-6 transition hover:bg-sand/70">
            <Heart size={22} className="text-accent" />
            <span className="font-semibold">Mis favoritos</span>
          </Link>
        </li>
        <li>
          <Link href="/checkout" className="flex h-full flex-col gap-4 rounded-[var(--radius-card)] bg-ivory p-6 transition hover:bg-sand/70">
            <ShoppingBag size={22} className="text-accent" />
            <span className="font-semibold">Mi carrito</span>
          </Link>
        </li>
        <li className="flex h-full flex-col gap-4 rounded-[var(--radius-card)] bg-ivory p-6">
          <Package size={22} className="text-accent" />
          <span className="font-semibold">Estado de un pedido</span>
          <WhatsAppButton message={`${generalMessage()} Quiero consultar el estado de mi pedido.`} variant="link">
            Consultar por WhatsApp
          </WhatsAppButton>
        </li>
      </ul>
    </div>
  )
}
