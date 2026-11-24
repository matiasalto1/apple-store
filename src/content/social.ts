/**
 * Publicaciones de Instagram.
 * Cargá acá las publicaciones reales (imagen descargada en /public/social y link al post).
 * Mientras esté vacío, la sección muestra imágenes del catálogo marcadas como ilustrativas.
 */
export interface SocialPost {
  id: string
  image: string
  alt: string
  href: string
}

export const socialPosts: SocialPost[] = []
