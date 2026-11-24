/**
 * Etiquetas de empaque dibujadas en canvas → CanvasTexture.
 * Mantienen una gráfica consistente (marca, línea, detalle) sin depender de
 * imágenes externas. Al tener fotos/renders reales, este archivo deja de usarse.
 */
import * as THREE from 'three'
import type { ProductVisual } from '@/lib/catalog/types'

export interface LabelFonts {
  display: string
  sans: string
}

export type LabelLayout = 'front' | 'wrap' | 'top' | 'plain'

const INK_DARK = '#1e1c1a'
const INK_LIGHT = '#f7f2ea'

function makeCanvas(w: number, h: number) {
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  return c
}

function tracked(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, spacing: number) {
  // canvas letterSpacing (Chrome/Safari 2023+) con fallback manual
  const anyCtx = ctx as CanvasRenderingContext2D & { letterSpacing?: string }
  if ('letterSpacing' in anyCtx) {
    anyCtx.letterSpacing = `${spacing}px`
    ctx.fillText(text, x, y)
    anyCtx.letterSpacing = '0px'
    return
  }
  ctx.fillText(text.split('').join(String.fromCharCode(8202)), x, y)
}

function fitText(ctx: CanvasRenderingContext2D, text: string, font: (size: number) => string, maxW: number, start: number) {
  let size = start
  ctx.font = font(size)
  while (ctx.measureText(text).width > maxW && size > 12) {
    size -= 4
    ctx.font = font(size)
  }
  return size
}

/**
 * Dibuja el frente de un empaque. `region` es la zona visible del canvas
 * (en etiquetas envolventes solo una franja central mira a cámara).
 */
function drawFront(
  ctx: CanvasRenderingContext2D,
  v: ProductVisual,
  brandLabel: string,
  fonts: LabelFonts,
  region: { x: number; y: number; w: number; h: number },
  opts: { band?: 'wave' | 'arc' | 'line' | 'none'; scale?: number } = {},
) {
  const ink = v.ink === 'light' ? INK_LIGHT : INK_DARK
  const s = opts.scale ?? 1
  const cx = region.x + region.w / 2
  const { y, h, w } = region

  // banda de acento
  ctx.fillStyle = v.accent
  if (opts.band === 'wave') {
    ctx.beginPath()
    ctx.moveTo(region.x - 4, y + h * 0.78)
    ctx.bezierCurveTo(region.x + w * 0.3, y + h * 0.7, region.x + w * 0.62, y + h * 0.9, region.x + w + 4, y + h * 0.76)
    ctx.lineTo(region.x + w + 4, y + h + 4)
    ctx.lineTo(region.x - 4, y + h + 4)
    ctx.closePath()
    ctx.fill()
  } else if (opts.band === 'arc') {
    ctx.beginPath()
    ctx.arc(cx, y + h * 1.18, w * 0.62, 0, Math.PI * 2)
    ctx.fill()
  } else if (opts.band === 'line') {
    ctx.fillRect(region.x, y + h * 0.86, w, h * 0.035)
  }

  ctx.textAlign = 'center'
  ctx.textBaseline = 'alphabetic'

  // marca
  ctx.fillStyle = ink
  ctx.globalAlpha = 0.85
  ctx.font = `600 ${Math.round(30 * s)}px ${fonts.sans}`
  tracked(ctx, brandLabel.toUpperCase(), cx, y + h * 0.17, 10 * s)
  ctx.globalAlpha = 1

  // pequeño separador
  ctx.fillStyle = v.accent
  ctx.beginPath()
  ctx.arc(cx, y + h * 0.215, 5 * s, 0, Math.PI * 2)
  ctx.fill()

  // nombre de línea, display italic
  ctx.fillStyle = ink
  const size = fitText(ctx, v.label, (px) => `italic 400 ${px}px ${fonts.display}`, w * 0.82, Math.round(150 * s))
  ctx.font = `italic 400 ${size}px ${fonts.display}`
  ctx.fillText(v.label, cx, y + h * 0.44)

  // detalle
  if (v.sublabel) {
    ctx.globalAlpha = 0.7
    ctx.font = `500 ${Math.round(28 * s)}px ${fonts.sans}`
    tracked(ctx, v.sublabel, cx, y + h * 0.52, 1.5 * s)
    ctx.globalAlpha = 1
  }

  // sello inferior
  const onBand = opts.band === 'wave' || opts.band === 'arc'
  ctx.fillStyle = onBand ? (v.ink === 'light' ? INK_DARK : INK_LIGHT) : ink
  ctx.globalAlpha = 0.9
  ctx.font = `600 ${Math.round(20 * s)}px ${fonts.sans}`
  tracked(ctx, 'CUIDADO DIARIO', cx, y + h * 0.93, 6 * s)
  ctx.globalAlpha = 1
}

export function createLabelTexture(
  v: ProductVisual,
  brandLabel: string,
  fonts: LabelFonts,
  layout: LabelLayout,
  aspect: number,
): THREE.CanvasTexture {
  // aspect = ancho / alto de la superficie que recibe la textura
  const H = Math.round(Math.min(1024, 4096 / aspect))
  const W = Math.round(H * aspect)
  const canvas = makeCanvas(W, H)
  const ctx = canvas.getContext('2d')!

  ctx.fillStyle = v.color
  ctx.fillRect(0, 0, W, H)

  // textura sutil de papel / film
  const grd = ctx.createLinearGradient(0, 0, 0, H)
  grd.addColorStop(0, 'rgba(255,255,255,0.10)')
  grd.addColorStop(1, 'rgba(0,0,0,0.06)')
  ctx.fillStyle = grd
  ctx.fillRect(0, 0, W, H)

  if (layout === 'front') {
    const band = v.kind === 'diaperPack' || v.kind === 'pants' ? 'wave' : 'line'
    drawFront(ctx, v, brandLabel, fonts, { x: 0, y: 0, w: W, h: H }, { band, scale: W / 820 })
  } else if (layout === 'wrap') {
    // el frente ocupa ~32% central del perímetro
    const fw = W * 0.34
    // franja de acento en todo el perímetro
    ctx.fillStyle = v.accent
    ctx.fillRect(0, H * 0.84, W, H * 0.04)
    drawFront(ctx, v, brandLabel, fonts, { x: (W - fw) / 2, y: H * 0.06, w: fw, h: H * 0.88 }, { band: 'none', scale: Math.min(fw / 760, H / 1024) })
  } else if (layout === 'top') {
    // la mitad trasera queda bajo la tapa: el frente impreso va en la mitad delantera (abajo en el canvas)
    ctx.fillStyle = v.accent
    ctx.fillRect(0, H * 0.955, W, H * 0.045)
    drawFront(ctx, v, brandLabel, fonts, { x: W * 0.1, y: H * 0.34, w: W * 0.8, h: H * 0.64 }, { band: 'none', scale: 1.05 })
  }

  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 8
  tex.needsUpdate = true
  return tex
}
