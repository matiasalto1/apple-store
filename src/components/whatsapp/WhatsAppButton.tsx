import { WhatsAppIcon } from '@/components/ui/BrandIcons'
import { cn } from '@/lib/format'
import { whatsappUrl } from '@/lib/whatsapp'

/** Enlace a WhatsApp con mensaje prearmado. El número sale de la configuración. */
export function WhatsAppButton({
  message,
  children = 'Consultar por WhatsApp',
  variant = 'solid',
  className,
}: {
  message: string
  children?: React.ReactNode
  variant?: 'solid' | 'outline' | 'link'
  className?: string
}) {
  return (
    <a
      href={whatsappUrl(message)}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        variant === 'solid' && 'btn btn-whatsapp',
        variant === 'outline' && 'btn btn-ghost',
        variant === 'link' && 'inline-flex items-center gap-2 font-medium text-whatsapp hover:underline',
        className,
      )}
    >
      <WhatsAppIcon size={variant === 'link' ? 16 : 18} className={variant === 'outline' ? 'text-whatsapp' : undefined} />
      {children}
    </a>
  )
}
