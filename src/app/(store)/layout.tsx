import { AnnouncementBar } from '@/components/layout/AnnouncementBar'
import { Footer } from '@/components/layout/Footer'
import { GlobalUI } from '@/components/layout/GlobalUI'
import { Navbar } from '@/components/layout/Navbar'
import { JsonLd } from '@/components/seo/JsonLd'
import { organizationJsonLd } from '@/lib/seo'

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:text-paper"
      >
        Saltar al contenido
      </a>
      <AnnouncementBar />
      <Navbar />
      <main id="contenido" className="relative">
        {children}
      </main>
      <Footer />
      <GlobalUI />
      <JsonLd data={organizationJsonLd()} />
    </>
  )
}
