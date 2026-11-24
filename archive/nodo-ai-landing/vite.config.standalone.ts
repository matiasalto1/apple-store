import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'

/**
 * Build used by `npm run build:standalone`.
 *
 * Produces one bundle with no code splitting and with the fonts embedded,
 * so `scripts/standalone.mjs` can fold everything into a single .html file
 * that opens straight from the file system — no server, no install.
 * The regular `npm run build` (vite.config.ts) stays split and lazy-loaded.
 */
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  build: {
    target: 'es2022',
    outDir: 'dist-standalone',
    emptyOutDir: true,
    cssCodeSplit: false,
    // embed the woff2 files as data: URIs inside the stylesheet
    assetsInlineLimit: 10 * 1024 * 1024,
    chunkSizeWarningLimit: 4000,
    rollupOptions: {
      output: {
        // a classic script with everything in it: ES modules are blocked on file://
        format: 'iife',
        inlineDynamicImports: true,
        entryFileNames: 'bundle.js',
        assetFileNames: 'bundle.[ext]',
      },
    },
  },
})
