import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Mitigence',
    short_name: 'Mitigence',
    description: 'Cybersecurity Delivery & Engineering Platform',
    start_url: '/',
    display: 'standalone',
    background_color: '#000000',
    theme_color: '#dc2626',
    icons: [
      { src: '/logo-icon.webp', sizes: '192x192', type: 'image/webp' },
      { src: '/logo-icon.webp', sizes: '512x512', type: 'image/webp' },
      { src: '/favicon.ico', sizes: 'any', type: 'image/x-icon' },
    ],
  }
}
