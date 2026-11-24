'use client'

import dynamic from 'next/dynamic'
import type { ProductVisual } from '@/lib/catalog/types'

const RenderStage = dynamic(() => import('@/components/three/RenderStage').then((m) => m.RenderStage), { ssr: false })

export function RenderClient(props: { mode: 'product' | 'hero'; visual?: ProductVisual; brandLabel?: string; elev?: number }) {
  return (
    <>
      {/* fondo transparente para que el PNG/WebP conserve el canal alfa */}
      <style>{'html,body{background:transparent!important}'}</style>
      <RenderStage {...props} />
    </>
  )
}
