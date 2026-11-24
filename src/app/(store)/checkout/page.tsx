import type { Metadata } from 'next'
import { CheckoutView } from './CheckoutView'

export const metadata: Metadata = { title: 'Finalizar compra', robots: { index: false } }

export default function CheckoutPage() {
  return (
    <div className="container-x pt-8 sm:pt-12">
      <h1 className="font-display text-display">Finalizar compra</h1>
      <div className="mt-10">
        <CheckoutView />
      </div>
    </div>
  )
}
