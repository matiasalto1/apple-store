import { useEffect, useRef, useState } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { MODULES } from '@/data/modules'
import { device } from '@/lib/device'
import { IntelligentSystem } from './IntelligentSystem'
import { SCENES, markSystemReady, onSceneChange, systemState } from './systemStore'

/** Pauses rendering entirely while the system is hidden between sections. */
function FrameloopController() {
  const setFrameloop = useThree((s) => s.setFrameloop)
  useEffect(() => {
    let timer: number | undefined
    const apply = () => {
      window.clearTimeout(timer)
      if (SCENES[systemState.scene].opacity > 0) setFrameloop('always')
      // wait for the CSS fade-out before freezing the loop
      else timer = window.setTimeout(() => setFrameloop('never'), 900)
    }
    apply()
    const offScene = onSceneChange(apply)
    const onVis = () => (document.hidden ? setFrameloop('never') : apply())
    document.addEventListener('visibilitychange', onVis)
    return () => {
      offScene()
      window.clearTimeout(timer)
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [setFrameloop])
  return null
}

/**
 * Fixed WebGL layer behind the page. The same system travels through
 * the story: it docks into DOM anchors declared by each section.
 */
export default function SystemCanvas() {
  const profile = device()
  const wrapper = useRef<HTMLDivElement>(null)
  const labelEls = useRef<(HTMLDivElement | null)[]>([])
  const [dpr] = useState<[number, number]>(() =>
    profile.tier === 'high' ? [1, 2] : profile.tier === 'mid' ? [1, 1.5] : [1, 1],
  )

  useEffect(() => {
    const el = wrapper.current
    if (!el) return
    const apply = () => {
      el.style.opacity = String(SCENES[systemState.scene].opacity)
    }
    apply()
    return onSceneChange(apply)
  }, [])

  const interactive = !profile.coarsePointer

  return (
    <div
      ref={wrapper}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-[900ms] ease-[var(--ease-out-expo)]"
    >
      <Canvas
        dpr={dpr}
        gl={{ antialias: profile.tier !== 'low', alpha: true, powerPreference: 'high-performance' }}
        camera={{ position: [0, 0, 10], fov: 32, near: 0.1, far: 60 }}
        onCreated={() => {
          // first frame is on screen → start the boot sequence
          requestAnimationFrame(() => markSystemReady())
        }}
        style={{ position: 'absolute', inset: 0 }}
      >
        <FrameloopController />
        <IntelligentSystem tier={profile.tier} isMobile={profile.isMobile} interactive={interactive} labelEls={labelEls} />
      </Canvas>

      {/* Module labels — positioned every frame from the projected 3D nodes */}
      <div className="absolute inset-0 overflow-hidden">
        {MODULES.map((m, i) => (
          <div
            key={m.id}
            ref={(el) => void (labelEls.current[i] = el)}
            className="sys-label"
            data-state="idle"
            style={{ opacity: 0 }}
          >
            <div className="sys-label__inner">
              <span className="sys-label__name">
                <span className="sys-label__dot" />
                {m.label}
              </span>
              <span className="sys-label__status">{m.status}</span>
              <span className="sys-label__off">Sin conexión</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
