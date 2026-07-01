import type { Metadata } from 'next'
import { IndustryPage } from '@/components/industries/IndustryPage'
import { breadcrumbJsonLd } from '@/lib/seo'

export const metadata: Metadata = {
  title: "Manufacturing Cybersecurity",
  description: "Security challenges, common engagements, and recommended approaches for the Manufacturing sector.",
  alternates: { canonical: "/industries/manufacturing" },
}

export default function IndustryManufacturingPage() {
  return (
    <main className='min-h-screen pt-24 bg-black'>
      <div className='max-w-5xl mx-auto px-6 py-16'>
        <div className='w-8 h-0.5 bg-red-600 mb-6' />
        <h1 className='text-4xl font-bold text-white mb-12'>Manufacturing</h1>
        <IndustryPage industryId="manufacturing" />
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([
        { name: 'Home', path: '/' },
        { name: 'Industries', path: '/industries' },
        { name: 'Manufacturing', path: '/industries/manufacturing' },
      ])) }} />
    </main>
  )
}
