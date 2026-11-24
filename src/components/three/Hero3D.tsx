'use client'

/**
 * Escena 3D del hero (se carga diferida, nunca bloquea el contenido).
 * - Entrada animada, flotación suave, parallax con el cursor y reacción al scroll.
 * - Se pausa fuera de pantalla o con la pestaña oculta.
 * - Click en un producto → su ficha.
 */
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { fraunces, instrument } from '@/app/fonts'
import { catalog } from '@/lib/catalog/repository'
import { HeroComposition } from './HeroComposition'
import { useCanvasFonts } from './Package'
import { Studio } from './Studio'

const FONTS = { display: fraunces.style.fontFamily, sans: instrument.style.fontFamily }

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)
const damp = THREE.MathUtils.damp

function Rig({
  children,
  pointer,
  interactive,
  onFirstFrame,
}: {
  children: React.ReactNode
  pointer: React.RefObject<{ x: number; y: number }>
  interactive: boolean
  onFirstFrame: () => void
}) {
  const group = useRef<THREE.Group>(null)
  const start = useRef<number | null>(null)
  const notified = useRef(false)
  const { size } = useThree()
  const compact = size.width < 640

  useFrame((state, delta) => {
    const g = group.current
    if (!g) return
    if (start.current == null) start.current = state.clock.getElapsedTime()
    const t = Math.min(1, (state.clock.getElapsedTime() - start.current) / 1.8)
    const e = easeOutCubic(t)
    if (!notified.current && t > 0.02) {
      notified.current = true
      onFirstFrame()
    }

    // scroll: 0 en el tope, 1 cuando el hero salió de pantalla
    const scroll = Math.min(1, window.scrollY / Math.max(1, window.innerHeight))
    const px = interactive ? pointer.current.x : 0
    const py = interactive ? pointer.current.y : 0
    const idle = Math.sin(state.clock.getElapsedTime() * 0.25) * 0.06

    const targetRotY = (1 - e) * -0.9 + px * 0.32 + idle + scroll * 0.55
    const targetRotX = py * 0.06 + scroll * 0.12
    g.rotation.y = damp(g.rotation.y, targetRotY, 4, delta)
    g.rotation.x = damp(g.rotation.x, targetRotX, 4, delta)
    g.position.y = (1 - e) * -0.6 - scroll * 0.9 + (compact ? -0.05 : 0)
    const s = (0.86 + 0.14 * e) * (1 - scroll * 0.12) * (compact ? 0.98 : 1)
    g.scale.setScalar(s)
  })

  return <group ref={group}>{children}</group>
}

/** Pequeñas esferas tipo algodón que flotan alrededor. */
function Floaters({ animated }: { animated: boolean }) {
  const items = useMemo(
    () => [
      { p: [-2.05, 3.05, -1.4], r: 0.2, c: '#f4efe6', s: 0.7 },
      { p: [2.2, 3.2, -1.6], r: 0.28, c: '#dfe7df', s: 0.5 },
      { p: [1.75, 1.15, 0.9], r: 0.12, c: '#e8dccb', s: 0.9 },
      { p: [-1.85, 1.5, 0.8], r: 0.15, c: '#ffffff', s: 0.8 },
      { p: [0.4, 3.75, -2.2], r: 0.11, c: '#c9d6cc', s: 1.1 },
    ],
    [],
  )
  const refs = useRef<(THREE.Mesh | null)[]>([])
  useFrame(({ clock }) => {
    if (!animated) return
    const t = clock.getElapsedTime()
    refs.current.forEach((m, i) => {
      if (!m) return
      const it = items[i]
      m.position.y = it.p[1] + Math.sin(t * it.s + i * 2.1) * 0.18
      m.position.x = it.p[0] + Math.cos(t * it.s * 0.6 + i) * 0.08
    })
  })
  return (
    <>
      {items.map((it, i) => (
        <mesh key={i} ref={(el) => void (refs.current[i] = el)} position={it.p as [number, number, number]}>
          <sphereGeometry args={[it.r, 32, 32]} />
          <meshPhysicalMaterial color={it.c} roughness={0.85} sheen={1} sheenRoughness={0.4} sheenColor="#ffffff" />
        </mesh>
      ))}
    </>
  )
}

/** Pausa el render cuando el canvas no está visible. */
function VisibilityPause({ target }: { target: React.RefObject<HTMLElement | null> }) {
  const setFrameloop = useThree((s) => s.setFrameloop)
  useEffect(() => {
    const el = target.current
    if (!el) return
    let visible = true
    const apply = () => setFrameloop(visible && !document.hidden ? 'always' : 'never')
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      apply()
    })
    io.observe(el)
    document.addEventListener('visibilitychange', apply)
    return () => {
      io.disconnect()
      document.removeEventListener('visibilitychange', apply)
    }
  }, [setFrameloop, target])
  return null
}

export default function Hero3D({ onReady, onHover }: { onReady: () => void; onHover?: (id: string | null) => void }) {
  const router = useRouter()
  const wrap = useRef<HTMLDivElement>(null)
  const pointer = useRef({ x: 0, y: 0 })
  const fontsReady = useCanvasFonts(FONTS)
  const [cfg] = useState(() => {
    const coarse = window.matchMedia('(pointer: coarse)').matches
    const small = window.innerWidth < 768
    return { interactive: !coarse, dpr: (small ? [1, 1.5] : [1, 1.75]) as [number, number] }
  })

  useEffect(() => {
    if (!cfg.interactive) return
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [cfg.interactive])

  const select = (id: string) => {
    const p = catalog.getProductById(id)
    if (p) router.push(`/producto/${p.slug}`)
  }
  const hover = (id: string | null) => {
    if (wrap.current) wrap.current.style.cursor = id ? 'pointer' : ''
    onHover?.(id)
  }

  return (
    <div ref={wrap} className="absolute inset-0">
      <Canvas
        dpr={cfg.dpr}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        camera={{ position: [0, 2.6, 11.6], fov: 26 }}
        onCreated={({ camera }) => camera.lookAt(0, 1.0, 0)}
        style={{ position: 'absolute', inset: 0 }}
      >
        <VisibilityPause target={wrap} />
        <Studio />
        {fontsReady && (
          <Rig pointer={pointer} interactive={cfg.interactive} onFirstFrame={onReady}>
            <HeroComposition
              fonts={FONTS}
              fontsReady={fontsReady}
              animated
              onSelect={select}
              onHover={cfg.interactive ? hover : undefined}
            />
            <Floaters animated />
          </Rig>
        )}
      </Canvas>
    </div>
  )
}
