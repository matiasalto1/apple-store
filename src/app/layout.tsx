import type { Metadata, Viewport } from 'next'
import { brand } from '@/config/brand'
import { seo } from '@/config/site'
import { fraunces, instrument } from './fonts'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(brand.url),
  title: { default: seo.defaultTitle, template: seo.titleTemplate },
  description: seo.description,
  applicationName: brand.name,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'es_AR',
    siteName: brand.name,
    title: seo.defaultTitle,
    description: seo.description,
    url: '/',
  },
  twitter: { card: 'summary_large_image', title: seo.defaultTitle, description: seo.description },
  formatDetection: { telephone: false },
}

export const viewport: Viewport = {
  themeColor: brand.colors.ivory,
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-AR" className={`${fraunces.variable} ${instrument.variable}`} suppressHydrationWarning>
      <head>
        {/* Oculta el texto del hero hasta que corra su animación (solo si se acepta movimiento). Red de seguridad: 3 s. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{if(!matchMedia('(prefers-reduced-motion: reduce)').matches){var d=document.documentElement;d.classList.add('js-intro');setTimeout(function(){d.classList.remove('js-intro')},3000)}}catch(e){}",
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
