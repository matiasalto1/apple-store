/**
 * Folds the standalone build into one self-contained .html file.
 *
 *   npm run build:standalone
 *   → dist-standalone/nodo-landing.html
 *
 * The result has the script, the styles, the fonts and the icon inlined,
 * so it can be opened by double-clicking it or sent as a single attachment.
 */
import { readFileSync, writeFileSync, rmSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const dir = 'dist-standalone'
const out = join(dir, 'nodo-landing.html')

const read = (name) => readFileSync(join(dir, name), 'utf8')
let html = read('index.html')
const js = read('bundle.js')
const css = read('bundle.css')
const favicon = readFileSync('public/favicon.svg', 'utf8')

// Replacements go through a function: minified code contains $& and $`,
// which a string replacement would expand as patterns.
const put = (re, text) => {
  html = html.replace(re, () => text)
}

put(/\s*<link rel="stylesheet"[^>]*href="[^"]*bundle\.css"[^>]*>/, `\n    <style>${css}</style>`)
// The bundle becomes a classic script (file:// blocks modules) at the end of
// the body, where #root already exists — an inline script is never deferred.
put(/\s*<script type="module"[^>]*src="[^"]*bundle\.js"[^>]*><\/script>/, '')
put(/<\/body>/, `  <script>${js}</script>\n  </body>`)
// Inline the icon so the file has no outside references at all
put(/href="\/favicon\.svg"/, `href="data:image/svg+xml;base64,${Buffer.from(favicon).toString('base64')}"`)

if (html.includes('bundle.js') || html.includes('bundle.css')) {
  console.error('✗ Something was left linked instead of inlined. Check dist-standalone/index.html.')
  process.exit(1)
}

writeFileSync(out, html)
for (const f of ['index.html', 'bundle.js', 'bundle.css']) {
  if (existsSync(join(dir, f))) rmSync(join(dir, f))
}

console.log(`✓ ${out} — ${(Buffer.byteLength(html) / 1024 / 1024).toFixed(2)} MB, un solo archivo`)
