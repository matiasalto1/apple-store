'use client'

import { useEffect, useMemo, useState } from 'react'
import * as THREE from 'three'
import type { ProductVisual } from '@/lib/catalog/types'
import { contactShadowTexture, lathe, pillowBox, roundedBox, sleeve, tubeGeometry } from './geometry'
import { createLabelTexture, type LabelFonts } from './labelTexture'

/* ───────── fuentes listas para dibujar en canvas ───────── */
export function useCanvasFonts(fonts: LabelFonts): boolean {
  const [ready, setReady] = useState(false)
  useEffect(() => {
    let alive = true
    Promise.all([
      document.fonts.load(`italic 400 120px ${fonts.display}`),
      document.fonts.load(`600 30px ${fonts.sans}`),
      document.fonts.load(`500 30px ${fonts.sans}`),
    ])
      .catch(() => undefined)
      .then(() => alive && setReady(true))
    return () => {
      alive = false
    }
  }, [fonts.display, fonts.sans])
  return ready
}

/* ───────── materiales ───────── */
function filmMaterial(color: string, map?: THREE.Texture) {
  return new THREE.MeshPhysicalMaterial({
    color: map ? '#ffffff' : color,
    map: map ?? null,
    roughness: 0.48,
    metalness: 0,
    clearcoat: 0.45,
    clearcoatRoughness: 0.38,
    sheen: 0.4,
    sheenRoughness: 0.6,
    sheenColor: new THREE.Color('#ffffff'),
  })
}
function plasticMaterial(color: string, rough = 0.32) {
  return new THREE.MeshPhysicalMaterial({ color, roughness: rough, metalness: 0, clearcoat: 0.6, clearcoatRoughness: 0.2 })
}
function paperMaterial(color: string, map?: THREE.Texture) {
  return new THREE.MeshStandardMaterial({ color: map ? '#ffffff' : color, map: map ?? null, roughness: 0.82, metalness: 0 })
}

/** Altura aproximada de cada modelo (para componer escenas). */
export const PACKAGE_HEIGHT: Record<ProductVisual['kind'], number> = {
  diaperPack: 1.9,
  pants: 1.75,
  wipes: 0.48,
  tube: 2.15,
  jar: 1.0,
  pumpBottle: 2.0,
  bottle: 1.78,
  feedingBottle: 1.75,
  box: 1.65,
  pouch: 1.7,
}

export interface PackageProps {
  visual: ProductVisual
  brandLabel: string
  fonts: LabelFonts
  fontsReady: boolean
  shadow?: boolean
}

/**
 * Empaque 3D generado a partir de `ProductVisual`.
 * Origen en la base (y = 0), frente mirando a +Z.
 */
export function Package({ visual, brandLabel, fonts, fontsReady, shadow = true }: PackageProps) {
  const built = useMemo(() => {
    if (!fontsReady) return null
    return buildPackage(visual, brandLabel, fonts)
  }, [visual, brandLabel, fonts, fontsReady])

  useEffect(() => () => built?.dispose(), [built])

  if (!built) return null
  return (
    <group>
      <primitive object={built.object} />
      {shadow && (
        <mesh rotation-x={-Math.PI / 2} position-y={0.002} scale={[built.footprint[0] * 1.9, built.footprint[1] * 1.9, 1]} renderOrder={-1}>
          <planeGeometry />
          <meshBasicMaterial map={contactShadowTexture()} transparent depthWrite={false} toneMapped={false} />
        </mesh>
      )}
    </group>
  )
}

interface Built {
  object: THREE.Group
  footprint: [number, number]
  dispose: () => void
}

function buildPackage(v: ProductVisual, brandLabel: string, fonts: LabelFonts): Built {
  const g = new THREE.Group()
  const disposables: Array<{ dispose: () => void }> = []
  const track = <T extends { dispose: () => void }>(x: T) => (disposables.push(x), x)
  const add = (geo: THREE.BufferGeometry, mat: THREE.Material | THREE.Material[], y = 0, x = 0, z = 0) => {
    track(geo)
    ;(Array.isArray(mat) ? mat : [mat]).forEach(track)
    const m = new THREE.Mesh(geo, mat)
    m.position.set(x, y, z)
    m.castShadow = true
    g.add(m)
    return m
  }
  const label = (layout: Parameters<typeof createLabelTexture>[3], aspect: number, visual = v) =>
    track(createLabelTexture(visual, brandLabel, fonts, layout, aspect))

  let footprint: [number, number] = [1, 1]

  switch (v.kind) {
    case 'diaperPack':
    case 'pants': {
      const [w, h, d] = v.kind === 'pants' ? [1.62, 1.72, 1.0] : [1.5, 1.9, 0.95]
      const side = filmMaterial(v.color)
      const front = filmMaterial(v.color, label('front', w / h))
      // orden de grupos de BoxGeometry: +x, -x, +y, -y, +z, -z
      add(pillowBox(w, h, d, 0.2, 0.11), [side, side, side, side, front, front], h / 2)
      // costura térmica superior
      add(roundedBox(w * 0.96, 0.07, 0.14, 0.03), filmMaterial(v.color), h - 0.01)
      footprint = [w, d]
      break
    }
    case 'wipes': {
      const [w, h, d] = [1.72, 0.42, 1.08]
      const side = filmMaterial(v.color)
      const top = filmMaterial(v.color, label('top', w / d))
      add(pillowBox(w, h, d, 0.18, 0.06, 'y'), [side, side, top, side, side, side], h / 2)
      // tapa rígida
      const lid = add(roundedBox(0.78, 0.07, 0.42, 0.03), plasticMaterial(v.accent, 0.4), h + 0.035, 0, -0.27)
      lid.rotation.x = 0.02
      footprint = [w, d]
      break
    }
    case 'tube': {
      const r = 0.36
      const capH = 0.34
      const bodyH = 1.72
      add(new THREE.CylinderGeometry(r * 0.82, r * 0.86, capH, 48), plasticMaterial(v.accent, 0.35), capH / 2)
      add(tubeGeometry(r, bodyH), filmMaterial(v.color, label('wrap', (Math.PI * 2 * r * 1.1) / bodyH)), capH)
      add(roundedBox(r * 2 * 1.32, 0.12, 0.05, 0.02), filmMaterial(v.color), capH + bodyH)
      footprint = [r * 2.4, r * 2]
      break
    }
    case 'jar': {
      const r = 0.66
      add(
        lathe([[0, 0], [r - 0.06, 0], [r, 0.05], [r, 0.62], [r - 0.05, 0.66], [r - 0.05, 0.7], [0, 0.7]]),
        plasticMaterial(v.color, 0.38),
      )
      add(sleeve(r + 0.004, 0.1, 0.58), paperMaterial('#fff', label('wrap', (Math.PI * 2 * r) / 0.48)))
      add(
        lathe([[0, 0.69], [r + 0.01, 0.69], [r + 0.02, 0.71], [r + 0.02, 0.97], [r - 0.01, 1.0], [0, 1.0]]),
        plasticMaterial(v.accent, 0.3),
      )
      footprint = [r * 2, r * 2]
      break
    }
    case 'pumpBottle': {
      const r = 0.46
      add(
        lathe([[0, 0], [r - 0.05, 0], [r, 0.05], [r, 1.3], [r - 0.08, 1.44], [0.2, 1.52], [0.17, 1.56], [0, 1.56]]),
        plasticMaterial(v.color, 0.36),
      )
      add(sleeve(r + 0.004, 0.18, 1.2), paperMaterial('#fff', label('wrap', (Math.PI * 2 * r) / 1.02)))
      add(new THREE.CylinderGeometry(0.19, 0.19, 0.16, 40), plasticMaterial(v.accent, 0.3), 1.62)
      add(new THREE.CylinderGeometry(0.045, 0.045, 0.18, 16), plasticMaterial('#f2eee8', 0.3), 1.78)
      add(roundedBox(0.24, 0.12, 0.24, 0.05), plasticMaterial(v.accent, 0.3), 1.9)
      const nozzle = add(roundedBox(0.34, 0.06, 0.07, 0.025), plasticMaterial(v.accent, 0.3), 1.9, 0.24)
      nozzle.rotation.z = -0.05
      footprint = [r * 2, r * 2]
      break
    }
    case 'bottle': {
      const r = 0.36
      add(
        lathe([[0, 0], [r - 0.04, 0], [r, 0.04], [r, 1.05], [r - 0.06, 1.22], [0.14, 1.36], [0.12, 1.46], [0, 1.46]]),
        new THREE.MeshPhysicalMaterial({ color: v.color, roughness: 0.12, clearcoat: 1, clearcoatRoughness: 0.08 }),
      )
      add(
        sleeve(r + 0.004, 0.18, 0.92),
        paperMaterial('#fff', label('wrap', (Math.PI * 2 * r) / 0.74, { ...v, color: v.accent, accent: v.color, ink: 'dark' })),
      )
      add(new THREE.CylinderGeometry(0.15, 0.15, 0.32, 40), plasticMaterial('#2b2926', 0.45), 1.6)
      footprint = [r * 2, r * 2]
      break
    }
    case 'feedingBottle': {
      const r = 0.42
      add(
        lathe([[0, 0], [r - 0.05, 0], [r, 0.05], [r - 0.03, 0.55], [r, 1.05], [r - 0.02, 1.2], [0, 1.2]]),
        new THREE.MeshPhysicalMaterial({
          color: v.color,
          roughness: 0.22,
          transparent: true,
          opacity: 0.78,
          clearcoat: 1,
          clearcoatRoughness: 0.1,
        }),
      )
      add(
        sleeve(r + 0.006, 0.2, 0.95),
        new THREE.MeshBasicMaterial({ map: label('wrap', (Math.PI * 2 * r) / 0.75, { ...v, color: v.color }), transparent: true, opacity: 0.9 }),
      )
      add(new THREE.CylinderGeometry(r + 0.03, r + 0.03, 0.24, 48), plasticMaterial(v.accent, 0.35), 1.28)
      add(
        lathe([[0, 1.4], [0.28, 1.4], [0.22, 1.5], [0.1, 1.58], [0.09, 1.68], [0.05, 1.74], [0, 1.75]]),
        new THREE.MeshPhysicalMaterial({ color: '#e9d7b9', roughness: 0.4, transparent: true, opacity: 0.92 }),
      )
      footprint = [r * 2, r * 2]
      break
    }
    case 'box': {
      const [w, h, d] = [1.35, 1.65, 0.85]
      const side = paperMaterial(v.color)
      const front = paperMaterial(v.color, label('front', w / h))
      add(roundedBox(w, h, d, 0.045), [side, side, side, side, front, side], h / 2)
      footprint = [w, d]
      break
    }
    case 'pouch': {
      const [w, h, d] = [1.8, 1.3, 0.46]
      const side = filmMaterial(v.color)
      const front = new THREE.MeshPhysicalMaterial({
        map: label('front', w / h),
        roughness: 0.7,
        sheen: 0.6,
        sheenRoughness: 0.5,
        sheenColor: new THREE.Color('#ffffff'),
      })
      side.roughness = 0.7
      add(pillowBox(w, h, d, 0.22, 0.08), [side, side, side, side, front, side], h / 2)
      const handle = add(new THREE.TorusGeometry(0.42, 0.05, 14, 48, Math.PI), plasticMaterial(v.accent, 0.5), h - 0.04)
      handle.scale.set(1, 0.95, 1)
      footprint = [w, d]
      break
    }
  }

  return {
    object: g,
    footprint,
    dispose: () => disposables.forEach((x) => x.dispose()),
  }
}
