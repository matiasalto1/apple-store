import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [390, 640, 828, 1080, 1280, 1600, 1920],
    imageSizes: [96, 160, 256, 384, 512],
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'motion'],
  },
}

export default nextConfig
