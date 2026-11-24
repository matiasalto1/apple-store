'use client'

/** Visor 3D del empaque en la ficha de producto: arrastrar para girar. */
import { Canvas, useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'
import { fraunces, instrument } from '@/app/fonts'
import { brandName } from '@/lib/catalog/repository'
import type { Product } from '@/lib/catalog/types'
import { Package, PACKAGE_HEIGHT, useCanvasFonts } from './Package'
import { Studio } from './Studio'

const FONTS = { display: fraunces.style.fontFamily, sans: instrument.style.fontFamily }

function Spinner({ children, drag }: { children: React.ReactNode; drag: React.RefObject<{ active: boolean; vel: number; rot: number }> }) {
  const g = useRef<THREE.Group>(null)
  useFrame((_, delta) => {
    const d = drag.current
    if (!d.active) {
      d.vel = THREE.MathUtils.damp(d.vel, 0.35, 1.5, delta)
      d.rot += d.vel * delta
    }
    if (g.current) g.current.rotation.y = THREE.MathUtils.damp(g.current.rotation.y, d.rot, 10, delta)
  })
  return <group ref={g}>{children}</group>
}

export default function ProductViewer3D({ product }: { product: Product }) {
  const ready = useCanvasFonts(FONTS)
  const drag = useRef({ active: false, vel: 0.35, rot: -0.4, x: 0 })
  const h = PACKAGE_HEIGHT[product.visual.kind]
  const wide = ['wipes', 'pouch'].includes(product.visual.kind)

  return (
    <div
      className="absolute inset-0 cursor-grab touch-pan-y active:cursor-grabbing"
      onPointerDown={(e) => {
        drag.current.active = true
        drag.current.x = e.clientX
        ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
      }}
      onPointerMove={(e) => {
        if (!drag.current.active) return
        const dx = e.clientX - drag.current.x
        drag.current.x = e.clientX
        drag.current.rot += dx * 0.012
        drag.current.vel = dx * 0.6
      }}
      onPointerUp={() => (drag.current.active = false)}
      onPointerCancel={() => (drag.current.active = false)}
      aria-label="Vista 3D del producto. Arrastrá para girarlo."
      role="img"
    >
      <Canvas dpr={[1, 1.75]} gl={{ antialias: true, alpha: true }} camera={{ position: [0, h * 0.6 + (wide ? 2 : 0.9), Math.max(h, wide ? 1.8 : 1.2) * 3 + 1.4], fov: 26 }} onCreated={({ camera }) => camera.lookAt(0, h * 0.45, 0)}>
        <Studio />
        <Spinner drag={drag}>
          <Package visual={product.visual} brandLabel={brandName(product)} fonts={FONTS} fontsReady={ready} />
        </Spinner>
      </Canvas>
      <p className="pointer-events-none absolute inset-x-0 top-16 text-center text-[0.75rem] text-ink-soft/70">Arrastrá para girar</p>
    </div>
  )
}
