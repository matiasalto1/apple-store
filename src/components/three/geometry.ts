import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'

/** Caja redondeada con "panza": simula el film blando de un paquete de pañales. */
export function pillowBox(w: number, h: number, d: number, radius: number, bulge: number, axis: 'z' | 'y' = 'z') {
  const geo = new RoundedBoxGeometry(w, h, d, 6, radius)
  const pos = geo.attributes.position as THREE.BufferAttribute
  const v = new THREE.Vector3()
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i)
    if (axis === 'z') {
      const nx = v.x / (w / 2)
      const ny = v.y / (h / 2)
      const f = Math.max(0, 1 - nx * nx) * Math.max(0, 1 - ny * ny)
      v.z += Math.sign(v.z) * f * bulge
      const nz = v.z / (d / 2)
      v.x += Math.sign(v.x) * Math.max(0, 1 - ny * ny) * Math.max(0, 1 - nz * nz) * bulge * 0.35
    } else {
      const nx = v.x / (w / 2)
      const nz = v.z / (d / 2)
      const f = Math.max(0, 1 - nx * nx) * Math.max(0, 1 - nz * nz)
      v.y += Math.sign(v.y) * f * bulge
    }
    pos.setXYZ(i, v.x, v.y, v.z)
  }
  pos.needsUpdate = true
  geo.computeBoundingBox()
  return geo
}

export function roundedBox(w: number, h: number, d: number, radius: number) {
  return new RoundedBoxGeometry(w, h, d, 5, radius)
}

/** Tubo de crema: redondo abajo, se aplana hacia el pliegue superior. */
export function tubeGeometry(radius: number, height: number) {
  const segU = 64
  const segV = 48
  const positions: number[] = []
  const uvs: number[] = []
  const indices: number[] = []
  const smooth = (a: number, b: number, x: number) => {
    const t = Math.min(1, Math.max(0, (x - a) / (b - a)))
    return t * t * (3 - 2 * t)
  }
  for (let j = 0; j <= segV; j++) {
    const v = j / segV
    const t = smooth(0.18, 1, v)
    const shoulder = v < 0.05 ? 0.78 + 0.22 * Math.sin((v / 0.05) * (Math.PI / 2)) : 1
    const rx = radius * (1 + 0.32 * t) * shoulder
    const rz = radius * (1 - 0.93 * t) * shoulder
    for (let i = 0; i <= segU; i++) {
      const u = i / segU
      const theta = Math.PI + u * Math.PI * 2
      positions.push(Math.sin(theta) * rx, v * height, Math.cos(theta) * rz)
      uvs.push(u, v)
    }
  }
  for (let j = 0; j < segV; j++) {
    for (let i = 0; i < segU; i++) {
      const a = j * (segU + 1) + i
      const b = a + segU + 1
      indices.push(a, a + 1, b, b, a + 1, b + 1)
    }
  }
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2))
  geo.setIndex(indices)
  geo.computeVertexNormals()
  return geo
}

/** Lathe con el frente (u = 0.5) mirando a +Z. */
export function lathe(points: [number, number][], segments = 64) {
  return new THREE.LatheGeometry(
    points.map(([x, y]) => new THREE.Vector2(x, y)),
    segments,
    Math.PI,
    Math.PI * 2,
  )
}

/** Manga cilíndrica para etiquetas envolventes, frente en u = 0.5. */
export function sleeve(radius: number, y0: number, y1: number) {
  const geo = new THREE.CylinderGeometry(radius, radius, y1 - y0, 72, 1, true, Math.PI, Math.PI * 2)
  geo.translate(0, (y0 + y1) / 2, 0)
  return geo
}

let shadowTex: THREE.CanvasTexture | null = null
/** Textura radial para sombras de contacto suaves (barata y estable en mobile). */
export function contactShadowTexture() {
  if (shadowTex) return shadowTex
  const c = document.createElement('canvas')
  c.width = c.height = 256
  const ctx = c.getContext('2d')!
  const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128)
  g.addColorStop(0, 'rgba(40,32,24,0.55)')
  g.addColorStop(0.35, 'rgba(40,32,24,0.28)')
  g.addColorStop(0.7, 'rgba(40,32,24,0.07)')
  g.addColorStop(1, 'rgba(40,32,24,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, 256, 256)
  shadowTex = new THREE.CanvasTexture(c)
  shadowTex.colorSpace = THREE.SRGBColorSpace
  return shadowTex
}
