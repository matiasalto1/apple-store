export type Tier = 'high' | 'mid' | 'low'

export interface DeviceProfile {
  reducedMotion: boolean
  coarsePointer: boolean
  isMobile: boolean
  isTablet: boolean
  tier: Tier
  webgl: boolean
}

function hasWebGL(): boolean {
  try {
    const c = document.createElement('canvas')
    return !!(c.getContext('webgl2') || c.getContext('webgl'))
  } catch {
    return false
  }
}

/** One-shot capability probe. Used to scale 3D complexity and interactions. */
export function getDeviceProfile(): DeviceProfile {
  if (typeof window === 'undefined') {
    return { reducedMotion: false, coarsePointer: false, isMobile: false, isTablet: false, tier: 'mid', webgl: false }
  }
  const mm = (q: string) => window.matchMedia(q).matches
  const reducedMotion = mm('(prefers-reduced-motion: reduce)')
  const coarsePointer = mm('(pointer: coarse)')
  const w = window.innerWidth
  const isMobile = w < 768
  const isTablet = !isMobile && w < 1024
  const nav = navigator as Navigator & { deviceMemory?: number }
  const cores = nav.hardwareConcurrency ?? 4
  const memory = nav.deviceMemory ?? 4

  let tier: Tier = 'high'
  if (isMobile || cores <= 4 || memory <= 4) tier = 'mid'
  if ((isMobile && (cores <= 4 || memory <= 3)) || cores <= 2) tier = 'low'

  return { reducedMotion, coarsePointer, isMobile, isTablet, tier, webgl: hasWebGL() }
}

let cached: DeviceProfile | null = null
export function device(): DeviceProfile {
  if (!cached) cached = getDeviceProfile()
  return cached
}
