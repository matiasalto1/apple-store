import Link from 'next/link'
import { AnnouncementBar } from '@/components/layout/AnnouncementBar'
import { Footer } from '@/components/layout/Footer'
import { GlobalUI } from '@/components/layout/GlobalUI'
import { Navbar } from '@/components/layout/Navbar'

export default function NotFound() {
  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <main id="contenido" className="container-x flex min-h-[60vh] flex-col items-start justify-center gap-6 pt-16">
        <p className="eyebrow text-accent">Error 404</p>
        <h1 className="font-display text-display">
          Esta página <em className="font-display-italic text-accent">no existe.</em>
        </h1>
        <p className="max-w-md text-ink-soft">Puede que el enlace haya cambiado. Te dejamos algunos caminos para seguir.</p>
        <div className="flex flex-wrap gap-3">
          <Link href="/" className="btn btn-primary">
            Ir al inicio
          </Link>
          <Link href="/tienda" className="btn btn-ghost">
            Ver la tienda
          </Link>
        </div>
      </main>
      <Footer />
      <GlobalUI />
    </>
  )
}
