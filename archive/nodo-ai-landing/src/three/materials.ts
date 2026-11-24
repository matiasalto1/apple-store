import * as THREE from 'three'

export const COLORS = {
  signal: new THREE.Color('#ff9447'),
  signalSoft: new THREE.Color('#ffc49a'),
  ice: new THREE.Color('#a8d4ff'),
  fg: new THREE.Color('#e9ebee'),
  chip: new THREE.Color('#1a1e23'),
}

/** Fresnel shell — the luminous membrane of the AI core. */
export function createCoreShellMaterial() {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uTime: { value: 0 },
      uEnergy: { value: 1 },
      uColor: { value: COLORS.signal.clone() },
      uRim: { value: COLORS.signalSoft.clone() },
    },
    vertexShader: /* glsl */ `
      varying vec3 vNormal;
      varying vec3 vView;
      varying vec3 vPos;
      void main() {
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        vNormal = normalize(normalMatrix * normal);
        vView = normalize(-mv.xyz);
        vPos = position;
        gl_Position = projectionMatrix * mv;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform float uTime;
      uniform float uEnergy;
      uniform vec3 uColor;
      uniform vec3 uRim;
      varying vec3 vNormal;
      varying vec3 vView;
      varying vec3 vPos;
      void main() {
        float f = 1.0 - max(dot(vNormal, vView), 0.0);
        float rim = pow(f, 2.4);
        // slow latitudinal scan lines moving across the membrane
        float scan = smoothstep(0.92, 1.0, sin(vPos.y * 26.0 - uTime * 1.6) * 0.5 + 0.5) * 0.25;
        float breath = 0.82 + 0.18 * sin(uTime * 1.3);
        vec3 col = mix(uColor, uRim, rim);
        float a = (rim * 0.95 + scan * (1.0 - rim) + 0.05) * breath * (0.35 + 0.65 * uEnergy);
        gl_FragColor = vec4(col * a, a);
      }
    `,
  })
}

/** Camera-facing radial glow quad. */
export function createGlowMaterial(color = COLORS.signal) {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uColor: { value: color.clone() },
      uIntensity: { value: 1 },
    },
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 uColor;
      uniform float uIntensity;
      varying vec2 vUv;
      void main() {
        float d = length(vUv - 0.5) * 2.0;
        float g = pow(max(1.0 - d, 0.0), 2.6) * uIntensity;
        gl_FragColor = vec4(uColor * g, g);
      }
    `,
  })
}

/** Soft round points for data pulses travelling along connections. */
export function createPulseMaterial(pixelRatio: number) {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uPixelRatio: { value: pixelRatio },
      uScale: { value: 1 },
    },
    vertexShader: /* glsl */ `
      attribute float aAlpha;
      attribute float aSize;
      attribute vec3 aColor;
      uniform float uPixelRatio;
      uniform float uScale;
      varying float vAlpha;
      varying vec3 vColor;
      void main() {
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * mv;
        gl_PointSize = aSize * uPixelRatio * uScale * (10.0 / -mv.z);
        vAlpha = aAlpha;
        vColor = aColor;
      }
    `,
    fragmentShader: /* glsl */ `
      varying float vAlpha;
      varying vec3 vColor;
      void main() {
        float d = length(gl_PointCoord - 0.5) * 2.0;
        float core = smoothstep(0.35, 0.0, d);
        float halo = pow(max(1.0 - d, 0.0), 2.0) * 0.55;
        float a = (core + halo) * vAlpha;
        if (a < 0.003) discard;
        gl_FragColor = vec4(vColor * a, a);
      }
    `,
  })
}
