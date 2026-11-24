const ars = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  maximumFractionDigits: 0,
  minimumFractionDigits: 0,
})

/** $ 26.900 */
export function formatPrice(value: number): string {
  return ars.format(Math.round(value)).replace(/ /g, ' ')
}

export function discountPercent(price: number, compareAt?: number): number | null {
  if (!compareAt || compareAt <= price) return null
  return Math.round((1 - price / compareAt) * 100)
}

export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ')
}
