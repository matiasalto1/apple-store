// Herramienta interna: hoja de contactos de los renders (para revisión visual).
import sharp from 'sharp'
import { readdirSync } from 'node:fs'
const out = process.argv[2] ?? 'contact.png'
const files = readdirSync('public/products').filter((f) => f.endsWith('.webp') && !f.startsWith('hero'))
const S = 360
const cols = 5
const rows = Math.ceil(files.length / cols)
const tiles = await Promise.all(
  files.map((f) => sharp(`public/products/${f}`).resize(S, S).flatten({ background: '#e9e1d4' }).png().toBuffer()),
)
await sharp({ create: { width: cols * S, height: rows * S, channels: 3, background: '#fff' } })
  .composite(tiles.map((input, i) => ({ input, left: (i % cols) * S, top: Math.floor(i / cols) * S })))
  .png()
  .toFile(out)
console.log(files.join('\n'))
