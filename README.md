# Nodo — Landing de sistemas de IA

Landing premium para una empresa de soluciones de Inteligencia Artificial.
Concepto: **“Construimos sistemas de IA que hacen que las empresas funcionen de manera más inteligente.”**

```bash
npm install
npm run dev               # desarrollo (http://localhost:5173)
npm run build             # typecheck + build de producción (dist/)
npm run preview           # servir el build
npm run build:standalone  # un único .html autocontenido, para abrir con doble clic
```

`build:standalone` genera `dist-standalone/nodo-landing.html`: la página entera
(script, estilos, fuentes e icono) en un solo archivo de ~1,5 MB que funciona
desde el sistema de archivos, sin servidor. Útil para compartir una demo por
correo o verla sin instalar nada.

Stack: React 19 · TypeScript · Tailwind CSS v4 · GSAP + ScrollTrigger + SplitText · Three.js + React Three Fiber · Vite.

---

## 1. Concepto visual

El visitante recorre **el interior de un sistema inteligente**. Una única pieza 3D —un núcleo de IA rodeado de ocho módulos
de negocio (CRM, Ventas, Clientes, Datos, Operaciones, Finanzas, Marketing, Logística)— acompaña toda la narrativa:
se enciende, se fragmenta, se reconecta y termina en calma.

- **Paleta**: grafito casi negro (`#07080a`) con superficies apenas diferenciadas, una sola señal cálida *ember*
  (`#ff9447`) para decisiones/acciones y un tono *ice* (`#a8d4ff`) reservado a datos entrantes. Sin gradientes violetas.
- **Tipografía**: Instrument Sans (display + body, con eje de ancho para titulares levemente condensados) y JetBrains Mono
  como voz del “sistema” (etiquetas, logs, estados). Dos familias, auto-hospedadas.
- **Lenguaje gráfico**: marcos de instrumento con ticks en las esquinas, diales, logs en monoespaciada, mucho espacio negativo.

## 2. Arquitectura de la página

| # | Sección | Rol narrativo | Estado del sistema 3D |
|---|---------|---------------|-----------------------|
| — | Hero | El sistema se enciende | Completo, interactivo |
| 01 | El problema | El mundo actual, fragmentado | Módulos dispersos, “Sin conexión” |
| 02 | La transformación | Antes → IA → Después (pin + scrub) | Se reconecta con el scroll (0→100 %) |
| 03 | Soluciones | Cada módulo se vuelve una capacidad | Gira hasta enfocar el nodo de origen |
| 04 | Demostración | Caso completo paso a paso | Oculto (render pausado) |
| 05 | Casos de uso | Selector por área | Oculto |
| 06 | Impacto potencial | Escenarios ilustrativos | Oculto |
| 07 | Experiencias | Testimonios demostrativos | Oculto |
| 08 | Arquitectura | Capas de infraestructura | Oculto |
| 09 | Cómo trabajamos | Proceso en 5 etapas | Oculto |
| 10 | Integración | Panel de conexiones + principios | Oculto |
| — | CTA final | Espacio oscuro y tranquilo | Vuelve, en calma |

## 3. Sistema de animaciones

- **Entrada (hero)**: un timeline GSAP anima `systemState.boot` 0→1 (núcleo → nodos → conexiones → pulsos) y, superpuesto,
  revela el titular por líneas con máscara (SplitText), luego subtítulo (blur→nítido) y CTAs con stagger.
- **Scroll**: ScrollTrigger para reveals con máscara (`RevealText`), batch de `[data-reveal]`, pin + scrub en
  “Transformación”, líneas de progreso en “Arquitectura” y “Proceso”, contadores en “Impacto”.
- **Microinteracciones**: botones magnéticos con luz que sigue al cursor, indicador deslizante en el navbar,
  superficies con *spotlight*, leve inclinación 3D en testimonios, cursor personalizado (solo desktop).
- `gsap.matchMedia()` separa desktop / mobile / `prefers-reduced-motion`.

## 4. Cómo funciona el 3D

`src/three/IntelligentSystem.tsx` dibuja todo con geometrías livianas (sin modelos ni texturas):

- **Núcleo**: membrana con shader fresnel + líneas de escaneo, icosaedro en wireframe, dos órbitas y un halo aditivo.
- **Módulos**: chips metálicos que miran a cámara, iluminados por una luz que sigue al mouse.
- **Conexiones**: curvas Bézier núcleo→módulo, entre vecinos y cruzadas, recalculadas cada frame (se “rompen” al dispersarse).
- **Pulsos**: `Points` con shader propio; ember = decisiones que salen del núcleo, ice = datos que vuelven.
- **Interacción**: parallax por capas (núcleo, módulos y dial se mueven distinto), rotación suave, y detección de
  **proximidad** en pantalla: el nodo cercano crece, sus conexiones se iluminan y aparece su etiqueta de estado
  (“CRM conectado”, “Agente activo”…).
- **Rendimiento**: three.js se carga en un chunk diferido; el render se **pausa** cuando el sistema no es visible o la
  pestaña está oculta; DPR, antialias y cantidad de pulsos dependen del dispositivo (`src/lib/device.ts`).

## 5. Experiencia de scroll

Hay **un solo canvas fijo** detrás de la página. Cada sección declara `data-scene` y, opcionalmente, un
`data-system-anchor`. El sistema calcula cada frame el rectángulo de ese ancla y se “acopla” a él con amortiguación:
viaja del hero al lateral del problema, al centro de la transformación, a la ventana de soluciones y, al final, al CTA.
Los parámetros por escena (opacidad, dispersión, energía, etiquetas) están en `src/three/systemStore.ts`.

## 6. Testimonios demostrativos

`src/data/testimonials.ts` define un modelo con `kind: 'illustrative' | 'real'`.

- Hoy los tres son `illustrative`: llevan la etiqueta **“Testimonio demostrativo”**, firma “Experiencia ilustrativa”,
  un avatar abstracto generado (no es un rostro) y una nota al pie aclarando que no son clientes reales.
- Para publicar un testimonio real, agregá una entrada `kind: 'real'` con `author.name`, `author.photo`,
  `author.company`, `author.logo` y `quote`. El componente muestra automáticamente foto, nombre, empresa y logo, y quita
  los avisos. No hace falta tocar el componente.
- Las métricas de “Impacto” y la “Demostración” también están marcadas como **ilustrativas** y no se presentan como
  resultados de clientes. No se publica schema de reseñas.

## 7. Componentes

```
src/
├─ config/site.ts            marca, navegación y enlace de contacto (reemplazar placeholders)
├─ data/                     contenido editable (módulos, soluciones, casos, impacto, testimonios…)
├─ three/                    SystemCanvas · IntelligentSystem · materials (shaders) · systemStore
├─ components/layout/        Navbar · Footer
├─ components/ui/            MagneticButton · Cursor · RevealText · SectionLabel · IllustrativeTag · IllustrativeAvatar · Logo
├─ sections/                 Hero · Problem · Transformation · Solutions (+ 4 demos) · LiveDemo · UseCases
│                            Impact · Testimonials · Architecture · Process · Integrations · FinalCTA
└─ hooks/                    useScrollScenes · useSequence · useInView · useMediaQuery
```

## Antes de publicar

- `src/config/site.ts`: reemplazar `contactHref` y, si cambia, el nombre de marca.
- `index.html`, `public/robots.txt`, `public/sitemap.xml`: reemplazar `https://nodo.example/` por el dominio real.
- `public/og.png`: imagen Open Graph generada desde el hero (1200×630).

## Accesibilidad y SEO

HTML semántico (`header`, `main`, `section` con `aria-labelledby`, `figure/blockquote`), un solo `h1`, jerarquía de
encabezados correcta, tabs accesibles por teclado, link “Saltar al contenido”, foco visible, `prefers-reduced-motion`
respetado (sin animaciones de entrada, el 3D queda estático). Meta title/description, Open Graph, Twitter Card,
canonical y JSON-LD (`Organization`, `WebSite`, lista de `Service`).
