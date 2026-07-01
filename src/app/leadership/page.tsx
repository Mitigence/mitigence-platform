import type { Metadata } from 'next'
import { PageShell } from '@/components/layout/PageShell'
import { breadcrumbJsonLd } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Leadership',
  description: 'Meet the Mitigence team — the people behind the platform and the engineering.',
  alternates: {
    canonical: '/leadership',
  },
}

export default function LeadershipPage() {
  return (
    <>
      <PageShell
        title="Leadership"
        description="Meet the Mitigence team — the people behind the platform, the engineering methodology, and the delivery approach. Security practitioners who built this because they saw a better way."
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([
        { name: 'Home', path: '/' },
        { name: 'Leadership', path: '/leadership' },
      ])) }} />
    </>
  )
}
