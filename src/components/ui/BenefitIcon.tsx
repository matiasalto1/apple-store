import { CreditCard, MessageCircle, ShieldCheck, Truck, type LucideIcon } from 'lucide-react'

const ICONS: Record<string, LucideIcon> = { truck: Truck, card: CreditCard, chat: MessageCircle, shield: ShieldCheck }

export function BenefitIcon({ name, size = 22, className }: { name: string; size?: number; className?: string }) {
  const Icon = ICONS[name] ?? ShieldCheck
  return <Icon size={size} strokeWidth={1.6} className={className} />
}
