/**
 * Genera las imágenes de producto a partir de los empaques 3D.
 *
 *   1) npm run dev            (en otra terminal)
 *   2) npm run render:products
 *
 * Guarda /public/products/{id}.webp (1200×1200, fondo transparente)
 * y /public/products/hero-composition.webp (respaldo estático del hero).
 * Cuando tengas fotos reales, cargalas en `images` de cada producto y
 * este script deja de ser necesario.
 *
 * Opcional: node scripts/render-products.mjs panales-nube-premium   (solo ese id)
 */
import { createRequire } from 'node:module'
import sharp from 'sharp'
import { mkdirSync } from 'node:fs'

// Playwright no es dependencia del proyecto: instalalo con `npm i -D playwright && npx playwright install chromium`.
const { chromium } = createRequire(import.meta.url)('playwright')

const BASE = process.env.RENDER_BASE ?? 'http://localhost:3000'
const OUT = 'public/products'
mkdirSync(OUT, { recursive: true })

const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] })
const page = await browser.newPage({ viewport: { width: 1300, height: 1300 }, deviceScaleFactor: 1 })

async function shoot(url, file, width) {
  await page.goto(url, { waitUntil: 'networkidle' })
  await page.waitForFunction(() => window.__renderReady === true, null, { timeout: 120_000 })
  const png = await page.locator('#stage canvas').screenshot({ omitBackground: true })
  await sharp(png).resize({ width }).webp({ quality: 86, alphaQuality: 90, effort: 5 }).toFile(file)
  console.log('✓', file)
}

const only = process.argv.slice(2)
await page.goto(`${BASE}/dev/render`, { waitUntil: 'networkidle' })
const ids = (await page.locator('pre').innerText()).split('\n').filter(Boolean)

for (const id of ids) {
  if (only.length && !only.includes(id)) continue
  await shoot(`${BASE}/dev/render?id=${id}`, `${OUT}/${id}.webp`, 1200)
}
if (!only.length || only.includes('hero')) {
  await shoot(`${BASE}/dev/render?mode=hero`, `${OUT}/hero-composition.webp`, 1200)
}

await browser.close()
