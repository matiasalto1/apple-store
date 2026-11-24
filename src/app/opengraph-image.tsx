import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import sharp from 'sharp'
import { brand } from '@/config/brand'

export const alt = `${brand.name} — pañalera online`
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OG() {
  // Satori no lee WebP: se convierte a PNG en el build.
  const hero = await sharp(await readFile(join(process.cwd(), 'public/products/hero-composition.webp'))).png().toBuffer()
  const heroSrc = `data:image/png;base64,${hero.toString('base64')}`
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', background: brand.colors.ivory, padding: 64, alignItems: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', width: 560 }}>
          <div style={{ fontSize: 28, letterSpacing: 6, color: brand.colors.accent, textTransform: 'uppercase' }}>{`${brand.descriptor} online`}</div>
          <div style={{ fontSize: 96, lineHeight: 1, color: brand.colors.ink, marginTop: 24, fontStyle: 'italic', fontFamily: 'serif' }}>{brand.name}</div>
          <div style={{ fontSize: 40, lineHeight: 1.15, color: brand.colors.ink, marginTop: 28 }}>{brand.tagline}</div>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={heroSrc} width={560} height={448} alt="" style={{ objectFit: 'contain' }} />
      </div>
    ),
    size,
  )
}
