/**
 * Mutable, render-free state shared between the DOM (GSAP / ScrollTrigger)
 * and the WebGL scene. Mutating it never triggers React renders; the scene
 * reads it every frame and eases towards it.
 */
export type SceneId = 'hero' | 'problem' | 'transform' | 'solutions' | 'hidden' | 'cta'

export interface SceneTarget {
  /** Element (by data-system-anchor) the system docks into */
  anchor: string | null
  /** Global visibility of the canvas layer */
  opacity: number
  /** 0 = connected system, 1 = fragmented */
  scatter: number
  /** Overall activity: pulses, glow, rotation speed */
  energy: number
  /** Module labels visibility */
  labels: number
  /** Fraction of the anchor the system should fill */
  fill: number
}

export const SCENES: Record<SceneId, SceneTarget> = {
  hero: { anchor: 'hero', opacity: 1, scatter: 0, energy: 1, labels: 1, fill: 1 },
  problem: { anchor: 'problem', opacity: 0.55, scatter: 1, energy: 0.2, labels: 0.35, fill: 1 },
  transform: { anchor: 'transform', opacity: 1, scatter: 1, energy: 0.6, labels: 0.6, fill: 1 },
  solutions: { anchor: 'solutions', opacity: 1, scatter: 0, energy: 0.8, labels: 1, fill: 0.86 },
  hidden: { anchor: null, opacity: 0, scatter: 0, energy: 0.4, labels: 0, fill: 1 },
  cta: { anchor: 'cta', opacity: 0.4, scatter: 0, energy: 0.15, labels: 0, fill: 0.72 },
}

type Listener = (scene: SceneId) => void

export const systemState = {
  scene: 'hero' as SceneId,
  /** 0→1 boot sequence, driven by the intro timeline */
  boot: 0,
  /** Scrubbed by the transformation section: 0 = scattered, 1 = connected */
  reconnect: 0,
  /** Module index highlighted by the solutions section (-1 none) */
  focus: -1,
  pointer: { x: 0, y: 0, px: -9999, py: -9999, inside: false },
  reducedMotion: false,
}

const listeners = new Set<Listener>()

export function setScene(scene: SceneId) {
  if (systemState.scene === scene) return
  systemState.scene = scene
  listeners.forEach((l) => l(scene))
}

export function onSceneChange(l: Listener) {
  listeners.add(l)
  return () => {
    listeners.delete(l)
  }
}

let ready = false
const readyListeners = new Set<() => void>()
export function markSystemReady() {
  ready = true
  readyListeners.forEach((l) => l())
  readyListeners.clear()
}
export function onSystemReady(l: () => void) {
  if (ready) l()
  else readyListeners.add(l)
  return () => {
    readyListeners.delete(l)
  }
}

/** Track the pointer once for the whole app (NDC + px). */
if (typeof window !== 'undefined') {
  window.addEventListener(
    'pointermove',
    (e) => {
      const p = systemState.pointer
      p.px = e.clientX
      p.py = e.clientY
      p.x = (e.clientX / window.innerWidth) * 2 - 1
      p.y = -(e.clientY / window.innerHeight) * 2 + 1
      p.inside = true
    },
    { passive: true },
  )
  document.addEventListener('pointerleave', () => {
    systemState.pointer.inside = false
    systemState.pointer.px = -9999
  })
}
