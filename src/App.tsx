import { lazy, Suspense, useEffect, useState } from 'react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Cursor } from '@/components/ui/Cursor'
import { ContactDialog } from '@/components/ui/ContactDialog'
import { Hero } from '@/sections/Hero'
import { Problem } from '@/sections/Problem'
import { Transformation } from '@/sections/Transformation'
import { Solutions } from '@/sections/Solutions'
import { LiveDemo } from '@/sections/LiveDemo'
import { UseCases } from '@/sections/UseCases'
import { Testimonials } from '@/sections/Testimonials'
import { Architecture } from '@/sections/Architecture'
import { Process } from '@/sections/Process'
import { Integrations } from '@/sections/Integrations'
import { FinalCTA } from '@/sections/FinalCTA'
import { useScrollScenes } from '@/hooks/useScrollScenes'
import { device } from '@/lib/device'

// three.js + R3F load in their own chunk, after the first paint
const SystemCanvas = lazy(() => import('@/three/SystemCanvas'))

export default function App() {
  useScrollScenes()
  const [webgl, setWebgl] = useState(false)
  useEffect(() => setWebgl(device().webgl), [])

  return (
    <div className="grain relative">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-fg focus:px-4 focus:py-2 focus:text-ink-950">
        Saltar al contenido
      </a>
      {webgl && (
        <Suspense fallback={null}>
          <SystemCanvas />
        </Suspense>
      )}
      <Cursor />
      <Navbar />
      <main id="main" className="relative z-10">
        <Hero />
        <Problem />
        <Transformation />
        <Solutions />
        <LiveDemo />
        <UseCases />
        <Testimonials />
        <Architecture />
        <Process />
        <Integrations />
        <FinalCTA />
      </main>
      <Footer />
      <ContactDialog />
    </div>
  )
}
