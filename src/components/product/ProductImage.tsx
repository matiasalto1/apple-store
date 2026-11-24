import Image from 'next/image'
import { primaryImage } from '@/lib/catalog/repository'
import type { Product } from '@/lib/catalog/types'
import { cn } from '@/lib/format'

/** Imagen de producto sobre su fondo de color. Funciona igual con renders o fotos reales. */
export function ProductImage({
  product,
  sizes = '(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw',
  priority,
  className,
  imgClassName,
  backdrop = true,
}: {
  product: Product
  sizes?: string
  priority?: boolean
  className?: string
  imgClassName?: string
  backdrop?: boolean
}) {
  const img = primaryImage(product)
  return (
    <div
      className={cn('relative overflow-hidden', className)}
      style={backdrop ? { background: `radial-gradient(120% 90% at 50% 30%, color-mix(in oklab, ${product.visual.backdrop} 70%, white) 0%, ${product.visual.backdrop} 70%)` } : undefined}
    >
      <Image
        src={img.src}
        alt={img.alt}
        width={img.width}
        height={img.height}
        sizes={sizes}
        priority={priority}
        className={cn('h-full w-full object-contain', imgClassName)}
      />
    </div>
  )
}
