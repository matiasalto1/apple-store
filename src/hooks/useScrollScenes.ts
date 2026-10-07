import { gsap, MQ, ScrollTrigger, useGSAP } from '@/lib/gsap'
import { setScene, systemState, type SceneId } from '@/three/systemStore'

/**
 * Wires every [data-scene] section to the 3D system and runs the generic
 * [data-reveal] entrance for supporting copy.
 */
export function useScrollScenes() {
  useGSAP(() => {
    const sections = gsap.utils.toArray<HTMLElement>('[data-scene]')
    sections.forEach((el) => {
      const id = el.dataset.scene as SceneId
      ScrollTrigger.create({
        trigger: el,
        start: 'top 55%',
        end: 'bottom 55%',
        onToggle: (self) => self.isActive && setScene(id),
      })
    })

    const mm = gsap.matchMedia()
    mm.add(MQ.motion, () => {
      ScrollTrigger.batch('[data-reveal]', {
        start: 'top 88%',
        once: true,
        onEnter: (batch) =>
          gsap.fromTo(batch, { autoAlpha: 0, y: 22 }, { autoAlpha: 1, y: 0, duration: 1.2, stagger: 0.08, ease: 'expo.out' }),
      })
      // hide before reveal (only when motion is allowed)
      gsap.set('[data-reveal]', { autoAlpha: 0 })
    })
    mm.add(MQ.reduced, () => {
      systemState.reducedMotion = true
    })

    // fonts / pinning change layout → recompute once everything is in place
    document.fonts?.ready.then(() => ScrollTrigger.refresh())
    return () => mm.revert()
  })
}
