# Pañalera online premium

Tienda online de productos para bebés (pañales, toallitas, higiene, cremas, accesorios y alimentación),
pensada para vender en Argentina: español, pesos argentinos (ARS), mobile-first.

> **Nombre provisorio:** la marca se llama "Cuna" solo como nombre de trabajo. Se cambia en un único archivo
> (`src/config/brand.ts`) y se actualiza en todo el sitio.
>
> **Catálogo de demostración:** productos, marcas (Nube, Mimo, Brote, Lumi, Lino), precios y stock son de ejemplo
> y están marcados con `demo: true`. Mientras sea así, la barra superior lo avisa y no se publican datos
> estructurados de producto para Google.

---

## Cómo ejecutarla

Necesitás [Node.js](https://nodejs.org) 20.9 o superior.

```bash
npm install        # instala dependencias (solo la primera vez)
npm run dev        # modo desarrollo → http://localhost:3000
npm run build      # build de producción (verifica tipos y genera páginas estáticas)
npm run start      # sirve el build de producción
npm run typecheck  # revisa errores de TypeScript
```

---

## Dirección creativa

**Concepto: "calma premium".** Una tienda que se siente como una marca de diseño escandinavo con tecnología de
producto: superficies cálidas, mucho aire, tipografía editorial y objetos con profundidad real.

- **Paleta:** blanco cálido, ivory, arena, beige, gris piedra y negro suave, con un único acento **eucalipto**
  (`#3f5d4f`). Sin gradientes violetas, sin colores saturados infantiles.
- **Tipografía:** *Fraunces* (eje SOFT, curvas suaves) para titulares editoriales, a veces en itálica;
  *Instrument Sans* para interfaz y textos. Autohospedadas con `next/font` (sin pedidos a terceros).
- **3D con propósito:** los productos se modelan como empaques reales (paquete de pañales, toallitas, tubo de
  crema, pote, biberón…). El hero muestra una composición interactiva que **vende**: al pasar el cursor
  sobre un producto se muestra su precio, y al hacer clic se abre su ficha.
- **Movimiento:** entrada del hero por líneas, reveals al hacer scroll, parallax sutil en el banner de campaña,
  storytelling con imagen fija, microinteracciones en cards y carrito. Todo respeta `prefers-reduced-motion`.

## Stack

| Área | Tecnología |
|---|---|
| Framework | Next.js 16 (App Router, páginas estáticas) + React 19 + TypeScript |
| Estilos | Tailwind CSS v4 con tokens en `src/app/globals.css` |
| Animación | Motion (Framer Motion) · Lenis (scroll suave solo en desktop) |
| 3D | Three.js + React Three Fiber (carga diferida, con imagen de respaldo) |
| Estado | Zustand (carrito y favoritos persistidos en el navegador) |
| Íconos | Lucide |

---

## Estructura

```
src/
├─ app/
│  ├─ (store)/               páginas de la tienda (comparten header, footer, carrito)
│  │  ├─ page.tsx            home
│  │  ├─ tienda/             catálogo completo con filtros
│  │  ├─ categoria/[slug]/   páginas por categoría (SEO)
│  │  ├─ producto/[slug]/    ficha de producto
│  │  ├─ packs/  marca/  ayuda/  checkout/  favoritos/  cuenta/
│  ├─ api/checkout/          inicia pagos (recalcula precios en el servidor)
│  ├─ api/newsletter/        suscripción (webhook configurable)
│  ├─ dev/render/            escenario para generar imágenes de producto (solo desarrollo)
│  ├─ sitemap.ts  robots.ts  opengraph-image.tsx  icon.svg
├─ config/
│  ├─ brand.ts               nombre, dominio, colores para JS
│  └─ site.ts                WhatsApp, contacto, redes, beneficios, envíos, pagos, promociones, navegación
├─ content/                  textos editables: ayuda/FAQ, reseñas, historia de marca, Instagram
├─ lib/
│  ├─ catalog/               tipos, datos demo, repository (acceso a datos) y filtros
│  ├─ cart/                  store del carrito, cálculo de totales, límites
│  ├─ payments/              métodos de pago (cliente) y proveedores (servidor)
│  ├─ whatsapp.ts            mensajes dinámicos de WhatsApp
│  └─ seo.ts                 datos estructurados schema.org
├─ components/
│  ├─ layout/                Navbar, MobileMenu, SearchOverlay, Footer, FloatingActions, SmoothScroll…
│  ├─ product/               ProductCard, ProductGrid, ProductCarousel, ProductQuickView, ProductDetail…
│  ├─ catalog/               CatalogView, ProductFilters
│  ├─ cart/                  CartDrawer, CartItem, CartSummary, CheckoutButton
│  ├─ packs/  ui/  seo/  whatsapp/
│  └─ three/                 Package (empaques 3D), Hero3D, ProductViewer3D, Studio, geometrías y etiquetas
└─ sections/home/            Hero, Categories, FeaturedProducts, CampaignBanner, SmartPacks,
                             BrandStory, Benefits, Testimonials, Social, Newsletter
```

---

## Guía para personalizar (sin tocar componentes)

### Marca
- **Nombre, descriptor, dominio:** `src/config/brand.ts`.
- **Logo:** `src/components/ui/Logo.tsx` (monograma SVG provisorio + nombre). Para usar un logo real, reemplazá el
  `<svg>` por `<Image src="/brand/logo.svg" … />`. El favicon está en `src/app/icon.svg`.
- **Paleta completa:** bloque `@theme` en `src/app/globals.css` (y los valores espejo de `brand.colors`).

### WhatsApp, contacto y redes
Todo en `src/config/site.ts` → `contact` y `social`. **El número de WhatsApp está solo ahí**; los botones del header,
el menú, la ficha, el carrito, el checkout y el footer arman el mensaje automáticamente con producto, variante,
cantidad y precio.

### Beneficios, envíos, pagos y promociones
`src/config/site.ts`:
- `benefits`: cada beneficio tiene `enabled`. Si no está confirmado, ponelo en `false` y desaparece.
- `shipping.freeShippingThreshold`: monto para envío gratis (activa la barra de progreso en el carrito). `null` = no se promete.
- `payments.transfer`: datos bancarios y `discountPercent` opcional.
- `promotions`: descuentos automáticos del carrito (vacío por defecto).

### Productos
1. Editá `src/lib/catalog/data/products.ts` (o reemplazalo). Cada producto define variantes (talle, presentación
   o color), precio, `compareAtPrice` **solo si hubo un precio anterior real**, disponibilidad y `demo`.
2. Categorías en `data/categories.ts` (incluyen el texto SEO de cada página). Packs en `data/packs.ts`
   (precio = suma de productos; `discountPercent` en `null` hasta tener una promoción real).
3. Cuando cargues productos reales, poné `demo: false`: se activan los datos estructurados de Google y
   el aviso de demostración se reemplaza por `site.announcement.message`.

### Imágenes de producto
- **Con fotos reales:** cargalas en `/public/products/…` y completá `images` en el producto
  (`{ src, alt, width, height }`). Se usan automáticamente en cards, ficha, carrito y Open Graph.
- **Sin fotos (como ahora):** las imágenes son renders de los empaques 3D. Si cambiás colores o textos de un
  empaque (`visual` en cada producto), regenerá las imágenes:
  ```bash
  npm i -D playwright && npx playwright install chromium   # solo la primera vez
  npm run dev                                              # en una terminal
  npm run render:products                                  # en otra terminal
  ```
  La composición del hero se define en `src/components/three/HeroComposition.tsx` (`HERO_ITEMS`).

### Reseñas e Instagram
- `src/content/reviews.ts`: hoy hay 3 reseñas **de prueba**, visibles con la etiqueta "Demo" y un aviso.
  Agregá reseñas reales con `kind: 'real'` (con autorización) y poné `site.showDemoReviews = false`.
- `src/content/social.ts`: cargá las publicaciones reales. Mientras esté vacío se muestran imágenes del catálogo
  aclaradas como ilustrativas.

### Textos legales y de ayuda
`src/content/help.ts`. Donde dice **[completar]** falta un dato que solo el negocio puede confirmar
(plazos, costos de envío, razón social, CUIT).

---

## Carrito y checkout

- Carrito lateral con miniaturas, cambio de variante, cantidades, eliminación, subtotal, descuentos y total.
  Persiste entre páginas y recargas (localStorage).
- Checkout en una página: contacto → entrega (provincias de Argentina) → pago.
- **Medios de pago hoy:**
  - **Transferencia:** registra el pedido y muestra los datos bancarios configurados + botón para enviar el comprobante.
  - **WhatsApp:** envía el pedido completo con los datos del cliente.
  - **Mercado Pago / tarjetas:** se muestra como "Próximamente". **No hay ningún cobro simulado.**
- `/api/checkout` **recalcula los precios en el servidor** con el catálogo: nunca confía en el precio del navegador.

### Integrar Mercado Pago (cuando tengas credenciales)
1. `npm i mercadopago`.
2. En `src/lib/payments/server.ts`, implementá `createPayment` del proveedor `mercadopago`: crear una preferencia con
   los ítems de `totals.lines` y devolver `{ ok: true, kind: 'redirect', url: preference.init_point }`.
3. Agregá un webhook (`src/app/api/webhooks/mercadopago/route.ts`) para confirmar pagos.
4. Probá con **credenciales de prueba** y recién después definí `MERCADOPAGO_ACCESS_TOKEN` y
   `NEXT_PUBLIC_MERCADOPAGO_ENABLED=true` en el servidor de producción.

---

## Preparado para un panel administrativo

- El frontend nunca lee los archivos de datos directamente: usa `catalog` (`src/lib/catalog/repository.ts`),
  que implementa la interfaz `CatalogRepository`. Para pasar a una base de datos (Postgres, Supabase, un CMS),
  se implementa esa interfaz con la nueva fuente.
- Los tipos (`src/lib/catalog/types.ts`) están pensados como tablas: `products`, `product_variants`,
  `categories`, `brands`, `packs`.
- Contenido de home (banner de campaña, historia de marca, reseñas, beneficios) separado en `config/` y `content/`,
  listo para moverse a un CMS.
- Pedidos: `src/lib/payments/server.ts` marca con `TODO(pedidos)` dónde persistir cada pedido.

## SEO

- Metadata por página (título, descripción, canonical, Open Graph), imagen OG generada, `sitemap.xml`, `robots.txt`.
- URLs en español: `/categoria/panales`, `/producto/panales-nube-premium`, `/ayuda/envios`.
- Datos estructurados: `OnlineStore`, `WebSite` con buscador, `BreadcrumbList` en todas las páginas internas,
  `FAQPage` en ayuda y `ProductGroup` con ofertas **solo para productos reales**.
- Las 49 páginas se generan estáticas en el build: rápidas e indexables. Los filtros viven en la URL
  (`/tienda?talle=M&orden=precio-asc`) y se pueden compartir.

## Rendimiento y accesibilidad

- El hero muestra primero una imagen optimizada (LCP) y monta el 3D en tiempo ocioso, con fundido; si no hay WebGL o
  el usuario prefiere menos movimiento, queda la imagen. El render 3D se pausa fuera de pantalla.
- Medido sobre el build de producción (iPhone emulado con red lenta): LCP ≈ 1,3 s, CLS ≈ 0.
- Overlays accesibles (foco atrapado, Esc, retorno de foco), "Saltar al contenido", etiquetas ARIA, áreas táctiles
  de 44 px, inputs de 16 px (sin zoom en iOS).

---

## Checklist antes de publicar

- [ ] Nombre y logo definitivos (`brand.ts`, `Logo.tsx`, `icon.svg`).
- [ ] `NEXT_PUBLIC_SITE_URL` con el dominio real.
- [ ] WhatsApp, email, horario, ubicación y redes reales (`site.ts`).
- [ ] Datos bancarios reales para transferencias.
- [ ] Productos, precios, stock y fotos reales (`demo: false`).
- [ ] Revisar beneficios y textos de ayuda/legales (buscar `[completar]` y `TODO`).
- [ ] Quitar o reemplazar reseñas de prueba (`showDemoReviews: false`).
- [ ] Conectar newsletter (`NEWSLETTER_WEBHOOK_URL`) y, cuando esté listo, Mercado Pago.

---

La landing anterior que había en este repositorio (sistemas de IA) se conserva sin cambios en
`archive/nodo-ai-landing/`, fuera del build.
