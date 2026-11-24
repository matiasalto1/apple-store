import type { Metadata } from 'next'
import { FavoritesView } from './FavoritesView'

export const metadata: Metadata = { title: 'Favoritos', robots: { index: false } }

export default function FavoritesPage() {
  return (
    <div className="container-x pt-10 sm:pt-14">
      <h1 className="font-display text-display">Favoritos</h1>
      <p className="mt-4 text-ink-soft">Se guardan en este dispositivo.</p>
      <div className="mt-12">
        <FavoritesView />
      </div>
    </div>
  )
}
