import { useMemo, useRef, type RefObject } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { MODULES } from '@/data/modules'
import type { Tier } from '@/lib/device'
import { SCENES, systemState } from './systemStore'
import { COLORS, createCoreShellMaterial, createGlowMaterial, createPulseMaterial } from './materials'

/* ─────────────────────────────── helpers ─────────────────────────────── */

const clamp01 = (v: number) => Math.min(1, Math.max(0, v))
const ease = (t: number) => {
  const x = clamp01(t)
  return x * x * (3 - 2 * x)
}
const smoothstep = (a: number, b: number, v: number) => ease((v - a) / (b - a))
const damp = (cur: number, target: number, k: number, dt: number) => cur + (target - cur) * (1 - Math.exp(-k * dt))

/** Seeded pseudo-random so the layout is identical on every load. */
function rand(seed: number) {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453
  return x - Math.floor(x)
}

function bezier(a: THREE.Vector3, c: THREE.Vector3, b: THREE.Vector3, t: number, out: THREE.Vector3) {
  const it = 1 - t
  out.set(
    it * it * a.x + 2 * it * t * c.x + t * t * b.x,
    it * it * a.y + 2 * it * t * c.y + t * t * b.y,
    it * it * a.z + 2 * it * t * c.z + t * t * b.z,
  )
  return out
}

function circlePoints(r: number, segments = 128) {
  const pts: THREE.Vector3[] = []
  for (let i = 0; i <= segments; i++) {
    const a = (i / segments) * Math.PI * 2
    pts.push(new THREE.Vector3(Math.cos(a) * r, 0, Math.sin(a) * r))
  }
  return pts
}

function makeLine(geo: THREE.BufferGeometry, color: THREE.Color, opacity: number) {
  const line = new THREE.Line(geo, new THREE.LineBasicMaterial({ color, transparent: true, opacity, depthWrite: false }))
  line.frustumCulled = false
  return line
}

/* ─────────────────────────────── layout ─────────────────────────────── */

const N = MODULES.length
const SEG = 36

type LinkKind = 'core' | 'ring' | 'cross'
interface LinkDef {
  a: number // -1 = core
  b: number
  kind: LinkKind
}

const LINKS: LinkDef[] = [
  ...MODULES.map((_, i) => ({ a: -1, b: i, kind: 'core' as const })),
  ...MODULES.map((_, i) => ({ a: i, b: (i + 1) % N, kind: 'ring' as const })),
  { a: 0, b: 3, kind: 'cross' },
  { a: 1, b: 5, kind: 'cross' },
  { a: 2, b: 6, kind: 'cross' },
  { a: 4, b: 7, kind: 'cross' },
]

const BASE_POSITIONS = MODULES.map((_, i) => {
  const a = (i / N) * Math.PI * 2 + 0.35
  const r = i % 2 ? 2.95 : 2.4 // two orbits → two depth layers
  const y = Math.sin(i * 1.7) * 0.5
  return new THREE.Vector3(Math.cos(a) * r, y, Math.sin(a) * r)
})

/** Where each module drifts when the system is fragmented. */
const SCATTER_OFFSETS = BASE_POSITIONS.map((p, i) => {
  const dir = p.clone().setY(0).normalize()
  return dir
    .multiplyScalar(1.1 + rand(i) * 1.3)
    .add(new THREE.Vector3((rand(i + 9) - 0.5) * 1.6, (rand(i + 21) - 0.5) * 3.2, (rand(i + 33) - 0.5) * 2))
})

const LINK_BASE_OPACITY: Record<LinkKind, number> = { core: 0.34, ring: 0.13, cross: 0.07 }

/* ─────────────────────────────── component ─────────────────────────────── */

interface Props {
  tier: Tier
  isMobile: boolean
  interactive: boolean
  labelEls: RefObject<(HTMLDivElement | null)[]>
}

export function IntelligentSystem({ tier, isMobile, interactive, labelEls }: Props) {
  const { camera, gl } = useThree()

  const rig = useRef<THREE.Group>(null)
  const tilt = useRef<THREE.Group>(null)
  const spin = useRef<THREE.Group>(null)
  const coreLayer = useRef<THREE.Group>(null)
  const ico = useRef<THREE.LineSegments>(null)
  const orbitA = useRef<THREE.Group>(null)
  const orbitB = useRef<THREE.Group>(null)
  const coreInner = useRef<THREE.Mesh>(null)
  const instrument = useRef<THREE.Group>(null)
  const light = useRef<THREE.PointLight>(null)
  const moduleGroups = useRef<(THREE.Group | null)[]>([])
  const chipGroups = useRef<(THREE.Group | null)[]>([])
  const dots = useRef<(THREE.Mesh | null)[]>([])

  /* Materials & geometries (created once) */
  const shellMat = useMemo(createCoreShellMaterial, [])
  const glowMat = useMemo(() => createGlowMaterial(COLORS.signal), [])
  const pulseMat = useMemo(() => createPulseMaterial(Math.min(gl.getPixelRatio(), 2)), [gl])

  const icoGeo = useMemo(() => new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(0.78, 1)), [])
  const chipGeo = useMemo(() => new THREE.BoxGeometry(0.34, 0.34, 0.045), [])
  const chipEdges = useMemo(() => new THREE.EdgesGeometry(chipGeo), [chipGeo])
  const haloGeo = useMemo(() => new THREE.BufferGeometry().setFromPoints(circlePoints(0.3, 64)), [])
  const orbitLineA = useMemo(
    () => makeLine(new THREE.BufferGeometry().setFromPoints(circlePoints(1.08, 160)), COLORS.signalSoft, 0.22),
    [],
  )
  const orbitLineB = useMemo(
    () => makeLine(new THREE.BufferGeometry().setFromPoints(circlePoints(1.32, 160)), COLORS.fg, 0.1),
    [],
  )
  const haloLines = useMemo(() => MODULES.map(() => makeLine(haloGeo, COLORS.signal, 0)), [haloGeo])

  const instrumentGeos = useMemo(() => {
    const inner = new THREE.BufferGeometry().setFromPoints(circlePoints(1.75, 180))
    const outer = new THREE.BufferGeometry().setFromPoints(circlePoints(3.6, 240))
    const dashed = new THREE.BufferGeometry().setFromPoints(circlePoints(4.25, 240))
    const ticks: number[] = []
    const count = 96
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2
      const long = i % 8 === 0
      const r0 = 3.6
      const r1 = 3.6 + (long ? 0.16 : 0.07)
      ticks.push(Math.cos(a) * r0, 0, Math.sin(a) * r0, Math.cos(a) * r1, 0, Math.sin(a) * r1)
    }
    const tickGeo = new THREE.BufferGeometry()
    tickGeo.setAttribute('position', new THREE.Float32BufferAttribute(ticks, 3))
    const tickLines = new THREE.LineSegments(
      tickGeo,
      new THREE.LineBasicMaterial({ color: COLORS.fg, transparent: true, opacity: 0.14, depthWrite: false }),
    )
    return {
      inner: makeLine(inner, COLORS.fg, 0.05),
      outer: makeLine(outer, COLORS.fg, 0.07),
      dashed: makeLine(dashed, COLORS.fg, 0.035),
      ticks: tickLines,
    }
  }, [])

  /* Connections — one Line per link, positions rewritten each frame */
  const links = useMemo(
    () =>
      LINKS.map((def) => {
        const geo = new THREE.BufferGeometry()
        geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array((SEG + 1) * 3), 3))
        const mat = new THREE.LineBasicMaterial({
          color: def.kind === 'core' ? COLORS.signalSoft : COLORS.fg,
          transparent: true,
          opacity: 0,
          depthWrite: false,
        })
        const line = new THREE.Line(geo, mat)
        line.frustumCulled = false
        return { def, line, geo, mat, a: new THREE.Vector3(), b: new THREE.Vector3(), c: new THREE.Vector3(), draw: 0, hl: 0 }
      }),
    [],
  )

  /* Data pulses */
  const PULSES = tier === 'high' ? 60 : tier === 'mid' ? 36 : 18
  const pulses = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(PULSES * 3), 3))
    geo.setAttribute('aAlpha', new THREE.BufferAttribute(new Float32Array(PULSES), 1))
    geo.setAttribute('aSize', new THREE.BufferAttribute(new Float32Array(PULSES), 1))
    geo.setAttribute('aColor', new THREE.BufferAttribute(new Float32Array(PULSES * 3), 3))
    const state = Array.from({ length: PULSES }, (_, i) => {
      const onCore = rand(i * 3.1) < 0.72
      const link = onCore ? Math.floor(rand(i * 5.7) * N) : N + Math.floor(rand(i * 2.3) * (LINKS.length - N))
      const outward = rand(i * 7.3) < 0.55
      return { link, t: rand(i * 1.9), speed: 0.16 + rand(i * 4.1) * 0.22, outward, size: 3 + rand(i) * 3.5 }
    })
    const pts = new THREE.Points(geo, pulseMat)
    pts.frustumCulled = false
    return { geo, state, pts }
  }, [PULSES, pulseMat])

  /* Mutable per-frame state */
  const sim = useRef({
    t: 0,
    spinAngle: 0,
    snapped: false,
    pos: new THREE.Vector3(),
    scale: 1,
    scatter: 0,
    energy: 1,
    labels: 1,
    px: 0,
    py: 0,
    nextActivity: 1.6,
    activity: new Float32Array(N),
    prox: new Float32Array(N),
    focus: new Float32Array(N),
    current: BASE_POSITIONS.map((p) => p.clone()),
    coreOffset: new THREE.Vector3(),
    labelState: new Array<string>(N).fill(''),
    tmpV: new THREE.Vector3(),
    tmpQ: new THREE.Quaternion(),
    tmpC: new THREE.Color(),
    anchorEls: {} as Record<string, Element | null>,
  })

  useFrame((_, rawDt) => {
    const s = sim.current
    const dt = Math.min(rawDt, 1 / 20)
    const reduced = systemState.reducedMotion
    const scene = SCENES[systemState.scene]
    const boot = systemState.boot

    /* ── scene targets ── */
    let scatterTarget = scene.scatter
    if (systemState.scene === 'transform') scatterTarget = 1 - systemState.reconnect
    s.scatter = damp(s.scatter, scatterTarget, systemState.scene === 'transform' ? 9 : 2.2, dt)
    s.energy = damp(s.energy, scene.energy, 2, dt)
    s.labels = damp(s.labels, scene.labels, 3, dt)
    const speed = reduced ? 0 : 0.25 + s.energy * 0.75
    s.t += dt * speed

    /* ── dock into the DOM anchor ── */
    if (scene.anchor && rig.current) {
      let el = s.anchorEls[scene.anchor]
      if (!el || !el.isConnected) {
        el = document.querySelector(`[data-system-anchor="${scene.anchor}"]`)
        s.anchorEls[scene.anchor] = el
      }
      if (el) {
        const r = el.getBoundingClientRect()
        const persp = camera as THREE.PerspectiveCamera
        const dist = persp.position.z
        const visH = 2 * Math.tan(THREE.MathUtils.degToRad(persp.fov / 2)) * dist
        const visW = visH * (window.innerWidth / window.innerHeight)
        const tx = ((r.left + r.width / 2) / window.innerWidth - 0.5) * visW
        const ty = -((r.top + r.height / 2) / window.innerHeight - 0.5) * visH
        const wW = (r.width / window.innerWidth) * visW
        const wH = (r.height / window.innerHeight) * visH
        // on narrow screens the system may bleed past the edges a little
        const ts = Math.min(wW / (isMobile ? 6 : 7.4), wH / 4.6) * scene.fill
        if (!s.snapped) {
          s.pos.set(tx, ty, 0)
          s.scale = ts
          s.snapped = true
        } else {
          const k = reduced ? 30 : 5.5
          s.pos.x = damp(s.pos.x, tx, k, dt)
          s.pos.y = damp(s.pos.y, ty, k, dt)
          s.scale = damp(s.scale, ts, reduced ? 30 : 4, dt)
        }
        rig.current.position.copy(s.pos)
        rig.current.scale.setScalar(s.scale)
      }
    }

    /* ── pointer parallax: layers respond independently ── */
    const p = systemState.pointer
    const usePointer = interactive && !reduced
    s.px = damp(s.px, usePointer ? p.x : 0, 2.2, dt)
    s.py = damp(s.py, usePointer ? p.y : 0, 2.2, dt)
    if (tilt.current) {
      tilt.current.rotation.x = 0.36 - s.py * 0.09
      tilt.current.rotation.y = s.px * 0.16
      tilt.current.rotation.z = -0.05 + s.px * 0.02
    }
    // ambient rotation; in "solutions" the focused module turns to face the viewer
    const focusIdx = systemState.scene === 'solutions' ? systemState.focus : -1
    if (focusIdx >= 0) {
      const a = (focusIdx / N) * Math.PI * 2 + 0.35
      let target = a - Math.PI / 2 + 0.4
      target += Math.PI * 2 * Math.round((s.spinAngle - target) / (Math.PI * 2))
      s.spinAngle = damp(s.spinAngle, target, reduced ? 30 : 2.4, dt)
    } else {
      s.spinAngle += dt * speed * 0.045
    }
    if (spin.current) spin.current.rotation.y = s.spinAngle
    s.coreOffset.set(s.px * 0.12, s.py * 0.08, 0)
    if (coreLayer.current) coreLayer.current.position.copy(s.coreOffset)
    if (instrument.current) {
      instrument.current.scale.setScalar(0.85 + 0.15 * ease(boot / 0.35))
      instrument.current.visible = boot > 0.001
      const fade = ease(boot / 0.35)
      ;(
        [
          [instrumentGeos.inner, 0.05],
          [instrumentGeos.outer, 0.07],
          [instrumentGeos.dashed, 0.035],
          [instrumentGeos.ticks, 0.14],
        ] as const
      ).forEach(([obj, base]) => ((obj.material as THREE.LineBasicMaterial).opacity = base * fade))
      instrument.current.position.set(-s.px * 0.1, -0.02, -s.py * 0.1)
      instrument.current.rotation.y = -s.t * 0.02
    }
    if (light.current) {
      light.current.position.set(s.pos.x + s.px * 4.5 * s.scale, s.pos.y + s.py * 2.8 * s.scale, 3)
      light.current.intensity = 4 + s.energy * 4
    }

    /* ── core ── */
    const coreIn = ease(boot / 0.3)
    const breath = reduced ? 1 : 1 + Math.sin(s.t * 1.3) * 0.035
    if (coreLayer.current) coreLayer.current.scale.setScalar(Math.max(coreIn, 0.0001) * breath)
    shellMat.uniforms.uTime.value = s.t
    shellMat.uniforms.uEnergy.value = s.energy * (1 - s.scatter * 0.5)
    let actSum = 0
    for (let i = 0; i < N; i++) actSum += s.activity[i]
    glowMat.uniforms.uIntensity.value = coreIn * (0.42 + 0.38 * s.energy + actSum * 0.06) * (1 - s.scatter * 0.45)
    if (ico.current) {
      ico.current.rotation.y = s.t * 0.22
      ico.current.rotation.x = s.t * 0.13
      ;(ico.current.material as THREE.LineBasicMaterial).opacity = 0.2 * coreIn
    }
    if (orbitA.current) orbitA.current.rotation.y = s.t * 0.5
    if (orbitB.current) orbitB.current.rotation.y = -s.t * 0.34
    if (coreInner.current) {
      const m = coreInner.current.material as THREE.MeshBasicMaterial
      m.color.copy(COLORS.signal).lerp(COLORS.signalSoft, 0.4 + 0.3 * Math.sin(s.t * 2))
    }

    /* ── activity: random modules fire small signals ── */
    if (!reduced && boot > 0.95) {
      s.nextActivity -= dt * (0.4 + s.energy)
      if (s.nextActivity <= 0) {
        const i = Math.floor(Math.random() * N)
        s.activity[i] = 1
        s.nextActivity = 0.9 + Math.random() * 1.3
      }
    }

    /* ── modules ── */
    spin.current?.getWorldQuaternion(s.tmpQ)
    const parentInv = s.tmpQ.invert()
    for (let i = 0; i < N; i++) {
      const g = moduleGroups.current[i]
      if (!g) continue
      const appear = ease((boot - 0.22 - i * 0.045) / 0.2)
      const bob = reduced ? 0 : Math.sin(s.t * 0.9 + i * 1.3) * 0.06
      const drift = reduced ? 0 : Math.sin(s.t * 0.4 + i) * 0.25 * s.scatter
      const cur = s.current[i]
      cur.copy(BASE_POSITIONS[i]).addScaledVector(SCATTER_OFFSETS[i], s.scatter)
      cur.y += bob + drift
      g.position.copy(cur)

      s.activity[i] = Math.max(0, s.activity[i] - dt * 0.55)
      s.focus[i] = damp(s.focus[i], focusIdx === i ? 1 : 0, 4, dt)

      const prox = s.prox[i]
      const sc = Math.max(appear, 0.0001) * (1 + prox * 0.32 + s.focus[i] * 0.35)
      g.scale.setScalar(sc)

      const chip = chipGroups.current[i]
      if (chip) chip.quaternion.copy(parentInv).multiply(camera.quaternion)

      const dot = dots.current[i]
      if (dot) {
        const heat = Math.max(s.activity[i], prox, s.focus[i])
        const m = dot.material as THREE.MeshBasicMaterial
        m.color.copy(COLORS.fg).lerp(COLORS.signal, heat)
        m.opacity = (0.55 + heat * 0.45) * (1 - s.scatter * 0.5)
      }
      const halo = haloLines[i]
      {
        const a = s.activity[i]
        halo.scale.setScalar(1 + (1 - a) * 0.9 * (a > 0 ? 1 : 0) + s.focus[i] * 0.25)
        ;(halo.material as THREE.LineBasicMaterial).opacity = Math.min(1, a * 0.55 + prox * 0.5 + s.focus[i] * 0.6) * appear
      }
    }

    /* ── connections ── */
    const linkPhase = (boot - 0.42) / 0.42
    for (let li = 0; li < links.length; li++) {
      const L = links[li]
      const { def } = L
      if (def.a === -1) L.a.copy(s.coreOffset)
      else L.a.copy(s.current[def.a])
      L.b.copy(s.current[def.b])

      if (def.kind === 'core') {
        L.c.copy(L.b).multiplyScalar(0.5)
        L.c.y += 0.32
        L.c.x += -L.b.z * 0.12
        L.c.z += L.b.x * 0.12
      } else if (def.kind === 'ring') {
        L.c.copy(L.a).add(L.b).multiplyScalar(0.5 * 1.16)
      } else {
        L.c.copy(L.a).add(L.b).multiplyScalar(0.25)
        L.c.y += 0.9
      }

      const pos = L.geo.attributes.position as THREE.BufferAttribute
      for (let k = 0; k <= SEG; k++) {
        bezier(L.a, L.c, L.b, k / SEG, s.tmpV)
        pos.setXYZ(k, s.tmpV.x, s.tmpV.y, s.tmpV.z)
      }
      pos.needsUpdate = true

      const bootDraw = ease(linkPhase - li * 0.025)
      const broken = def.kind === 'core' ? 1 - s.scatter * 0.72 : 1 - s.scatter * 0.92
      L.draw = bootDraw * broken
      L.geo.setDrawRange(0, Math.max(0, Math.floor((SEG + 1) * L.draw)))

      const endA = def.a === -1 ? 0 : Math.max(s.prox[def.a], s.focus[def.a], s.activity[def.a] * 0.6)
      const endB = Math.max(s.prox[def.b], s.focus[def.b], s.activity[def.b] * 0.6)
      L.hl = Math.max(endA, endB)
      L.mat.opacity =
        (LINK_BASE_OPACITY[def.kind] * (0.55 + 0.45 * s.energy) * (1 - s.scatter * 0.45) + L.hl * 0.45) * Math.min(1, bootDraw * 2)
    }

    /* ── pulses ── */
    const pos = pulses.geo.attributes.position as THREE.BufferAttribute
    const alpha = pulses.geo.attributes.aAlpha as THREE.BufferAttribute
    const size = pulses.geo.attributes.aSize as THREE.BufferAttribute
    const col = pulses.geo.attributes.aColor as THREE.BufferAttribute
    const pulseVis = smoothstep(0.8, 1, boot) * (1 - s.scatter * 0.85)
    for (let i = 0; i < PULSES; i++) {
      const P = pulses.state[i]
      P.t += dt * P.speed * speed
      if (P.t > 1) {
        P.t -= 1
        const L = links[P.link]
        // data arriving at a module lights it up briefly
        if (L.def.kind === 'core' && P.outward) s.activity[L.def.b] = Math.max(s.activity[L.def.b], 0.35)
      }
      const L = links[P.link]
      const tt = P.outward ? P.t : 1 - P.t
      const visible = tt <= L.draw ? 1 : 0
      bezier(L.a, L.c, L.b, tt, s.tmpV)
      pos.setXYZ(i, s.tmpV.x, s.tmpV.y, s.tmpV.z)
      alpha.setX(i, Math.sin(Math.PI * P.t) * pulseVis * visible * (0.55 + L.hl * 0.6))
      size.setX(i, P.size * (1 + L.hl * 0.5))
      const c = P.outward ? COLORS.signalSoft : COLORS.ice
      col.setXYZ(i, c.r, c.g, c.b)
    }
    pos.needsUpdate = alpha.needsUpdate = size.needsUpdate = col.needsUpdate = true
    pulseMat.uniforms.uScale.value = s.scale

    /* ── labels + proximity (projected to screen) ── */
    rig.current?.updateMatrixWorld()
    const els = labelEls.current
    const w = window.innerWidth
    const h = window.innerHeight
    const canHover = interactive && p.inside && (systemState.scene === 'hero' || systemState.scene === 'solutions')
    for (let i = 0; i < N; i++) {
      const g = moduleGroups.current[i]
      if (!g) continue
      g.getWorldPosition(s.tmpV)
      const depth = s.tmpV.z
      s.tmpV.project(camera)
      const sx = (s.tmpV.x * 0.5 + 0.5) * w
      const sy = (-s.tmpV.y * 0.5 + 0.5) * h

      let target = 0
      if (canHover) {
        const d = Math.hypot(sx - p.px, sy - p.py)
        target = 1 - smoothstep(26, 130, d)
      }
      s.prox[i] = damp(s.prox[i], target, 7, dt)

      const el = els?.[i]
      if (!el) continue
      const appear = ease((boot - 0.3 - i * 0.045) / 0.2)
      const depthFade = 0.55 + 0.45 * smoothstep(-2.4 * s.scale, 2.4 * s.scale, depth)
      const op = appear * s.labels * depthFade * (isMobile ? 0.8 : 1)
      el.style.transform = `translate3d(${sx.toFixed(1)}px, ${sy.toFixed(1)}px, 0)`
      el.style.opacity = op.toFixed(3)

      const st =
        s.scatter > 0.55 ? 'off' : s.prox[i] > 0.5 ? 'hover' : s.focus[i] > 0.5 ? 'focus' : s.activity[i] > 0.4 ? 'active' : 'idle'
      if (s.labelState[i] !== st) {
        s.labelState[i] = st
        el.dataset.state = st
      }
    }
  })

  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight position={[2, 5, 4]} intensity={0.6} color="#dfe6ee" />
      <pointLight ref={light} color="#ffd2b0" intensity={8} distance={9} decay={1.6} />

      <group ref={rig}>
        <group ref={tilt} rotation={[0.36, 0, -0.05]}>
          {/* instrument dial under the system */}
          <group ref={instrument} position={[0, -0.02, 0]}>
            <primitive object={instrumentGeos.inner} />
            <primitive object={instrumentGeos.outer} />
            <primitive object={instrumentGeos.ticks} />
            {!isMobile && <primitive object={instrumentGeos.dashed} />}
          </group>

          <group ref={spin}>
            {/* AI core */}
            <group ref={coreLayer}>
              <mesh>
                <sphereGeometry args={[0.5, 48, 48]} />
                <primitive object={shellMat} attach="material" />
              </mesh>
              <mesh ref={coreInner}>
                <sphereGeometry args={[0.16, 24, 24]} />
                <meshBasicMaterial color={COLORS.signal} transparent opacity={0.95} />
              </mesh>
              <lineSegments ref={ico} geometry={icoGeo}>
                <lineBasicMaterial color={COLORS.fg} transparent opacity={0.2} depthWrite={false} />
              </lineSegments>
              <group rotation={[0.5, 0, 0.3]}>
                <group ref={orbitA}>
                  <primitive object={orbitLineA} />
                  <mesh position={[1.08, 0, 0]}>
                    <sphereGeometry args={[0.028, 12, 12]} />
                    <meshBasicMaterial color={COLORS.signalSoft} />
                  </mesh>
                </group>
              </group>
              <group rotation={[-0.7, 0, -0.4]}>
                <group ref={orbitB}>
                  <primitive object={orbitLineB} />
                  <mesh position={[0, 0, 1.32]}>
                    <sphereGeometry args={[0.022, 12, 12]} />
                    <meshBasicMaterial color={COLORS.ice} />
                  </mesh>
                </group>
              </group>
              <sprite scale={[3.6, 3.6, 1]}>
                <primitive object={glowMat} attach="material" />
              </sprite>
            </group>

            {/* connections + pulses */}
            {links.map((L, i) => (
              <primitive key={i} object={L.line} />
            ))}
            <primitive object={pulses.pts} />

            {/* business modules */}
            {MODULES.map((m, i) => (
              <group key={m.id} ref={(el) => void (moduleGroups.current[i] = el)}>
                <group ref={(el) => void (chipGroups.current[i] = el)}>
                  <mesh geometry={chipGeo}>
                    <meshStandardMaterial color={COLORS.chip} metalness={0.7} roughness={0.42} />
                  </mesh>
                  <lineSegments geometry={chipEdges}>
                    <lineBasicMaterial color={COLORS.fg} transparent opacity={0.28} depthWrite={false} />
                  </lineSegments>
                  <mesh ref={(el) => void (dots.current[i] = el)} position={[0, 0, 0.03]}>
                    <circleGeometry args={[0.045, 20]} />
                    <meshBasicMaterial color={COLORS.fg} transparent opacity={0.6} />
                  </mesh>
                  <primitive object={haloLines[i]} rotation={[Math.PI / 2, 0, 0]} />
                </group>
              </group>
            ))}
          </group>
        </group>
      </group>
    </>
  )
}
