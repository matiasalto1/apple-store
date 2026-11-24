'use client'

import { useFrame, type ThreeEvent } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { brandName, catalog } from '@/lib/catalog/repository'
import { lathe } from './geometry'
import { Package } from './Package'
import type { LabelFonts } from './labelTexture'

/**
 * Composición del hero: productos reales del catálogo sobre un pedestal.
 * Cambiar los ids acá cambia el hero (y el render estático de respaldo).
 */
export const HERO_ITEMS: Array<{
  productId: string
  position: [number, number, number]
  rotationY: number
  scale: number
  float: number
}> = [
  { productId: 'panales-nube-premium', position: [0, 0, -0.25], rotationY: -0.32, scale: 1.24, float: 0.05 },
  { productId: 'biberon-lumi', position: [-1.62, 0, -0.6], rotationY: 0.4, scale: 0.92, float: 0.08 },
  { productId: 'crema-cambio-brote', position: [1.6, 0, -0.55], rotationY: -0.5, scale: 0.94, float: 0.07 },
  { productId: 'toallitas-nube-agua', position: [-1.05, 0, 1.08], rotationY: 0.26, scale: 0.92, float: 0.04 },
  { productId: 'crema-hidratante-brote', position: [1.32, 0, 1.0], rotationY: -0.3, scale: 0.74, float: 0.06 },
]

interface Props {
  fonts: LabelFonts
  fontsReady: boolean
  animated?: boolean
  onSelect?: (productId: string) => void
  onHover?: (productId: string | null) => void
}

export function HeroComposition({ fonts, fontsReady, animated = false, onSelect, onHover }: Props) {
  const items = useMemo(
    () =>
      HERO_ITEMS.flatMap((it) => {
        const p = catalog.getProductById(it.productId)
        return p ? [{ ...it, product: p, brand: brandName(p) }] : []
      }),
    [],
  )
  const refs = useRef<(THREE.Group | null)[]>([])

  useFrame(({ clock }) => {
    if (!animated) return
    const t = clock.getElapsedTime()
    refs.current.forEach((g, i) => {
      if (!g) return
      const it = items[i]
      g.position.y = it.position[1] + (Math.sin(t * 0.9 + i * 1.7) * 0.5 + 0.5) * it.float
      g.rotation.y = it.rotationY + Math.sin(t * 0.45 + i) * 0.035
    })
  })

  const pedestal = useMemo(
    () =>
      lathe(
        [
          [0, -0.34],
          [2.45, -0.34],
          [2.62, -0.28],
          [2.66, -0.12],
          [2.6, -0.02],
          [2.5, 0],
          [0, 0],
        ],
        96,
      ),
    [],
  )

  const handle = (id: string) => ({
    onClick: (e: ThreeEvent<MouseEvent>) => {
      e.stopPropagation()
      onSelect?.(id)
    },
    onPointerOver: (e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation()
      onHover?.(id)
    },
    onPointerOut: () => onHover?.(null),
  })

  return (
    <group>
      <mesh geometry={pedestal} receiveShadow>
        <meshStandardMaterial color="#e2d5c1" roughness={0.92} />
      </mesh>
      {items.map((it, i) => (
        <group
          key={it.productId}
          ref={(el) => void (refs.current[i] = el)}
          position={it.position}
          rotation-y={it.rotationY}
          scale={it.scale}
          {...(onSelect ? handle(it.productId) : {})}
        >
          <Package visual={it.product.visual} brandLabel={it.brand} fonts={fonts} fontsReady={fontsReady} />
        </group>
      ))}
    </group>
  )
}
