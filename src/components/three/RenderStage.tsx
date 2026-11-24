'use client'

/**
 * Escenario para generar las imágenes de producto (solo desarrollo).
 * `npm run render:products` abre esta página con Playwright y guarda
 * cada render en /public/products/{id}.webp.
 */
import { Canvas, useThree } from '@react-three/fiber'
import { useEffect } from 'react'
import { fraunces, instrument } from '@/app/fonts'
import type { ProductVisual } from '@/lib/catalog/types'
import { Package, PACKAGE_HEIGHT, useCanvasFonts } from './Package'
import { Studio } from './Studio'
import { HeroComposition } from './HeroComposition'

const FONTS = { display: fraunces.style.fontFamily, sans: instrument.style.fontFamily }

function ReadyFlag({ ready }: { ready: boolean }) {
  const { gl, scene, camera } = useThree()
  useEffect(() => {
    if (!ready) return
    let frames = 0
    let raf = 0
    const tick = () => {
      gl.render(scene, camera)
      if (++frames > 8) {
        ;(window as unknown as { __renderReady: boolean }).__renderReady = true
        return
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [ready, gl, scene, camera])
  return null
}

export function RenderStage({
  mode,
  visual,
  brandLabel,
  size = 1200,
  elev,
}: {
  mode: 'product' | 'hero'
  visual?: ProductVisual
  brandLabel?: string
  size?: number
  /** Altura extra de cámara (debug / tomas cenitales) */
  elev?: number
}) {
  const ready = useCanvasFonts(FONTS)
  const h = visual ? PACKAGE_HEIGHT[visual.kind] : 2
  const wide = visual && ['wipes', 'pouch'].includes(visual.kind)
  const dist = mode === 'hero' ? 11.6 : Math.max(h, wide ? 1.7 : 1.2) * 2.9 + 1.2

  return (
    <div id="stage" style={{ width: size, height: mode === 'hero' ? size * 0.8 : size, background: 'transparent' }}>
      <Canvas
        gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true }}
        dpr={1}
        frameloop="demand"
        camera={{ position: [0, mode === 'hero' ? 2.6 : h * 0.62 + 1.1 + (elev ?? (wide ? 1.4 : 0)), dist], fov: 26 }}
        onCreated={({ camera }) => camera.lookAt(0, mode === 'hero' ? 1.0 : h * 0.47, 0)}
      >
        <Studio />
        {mode === 'product' && visual && (
          <group rotation-y={wide ? -0.32 : -0.42}>
            <Package visual={visual} brandLabel={brandLabel ?? ''} fonts={FONTS} fontsReady={ready} />
          </group>
        )}
        {mode === 'hero' && <HeroComposition fonts={FONTS} fontsReady={ready} />}
        <ReadyFlag ready={ready} />
      </Canvas>
    </div>
  )
}
