import type { Metadata } from 'next'
import { IndustryPage } from '@/components/industries/IndustryPage'
import { breadcrumbJsonLd } from '@/lib/seo'

export const metadata: Metadata = {
  title: "Retail Cybersecurity",
  description: "Security challenges, common engagements, and recommended approaches for the Retail sector.",
  alternates: { canonical: "/industries/retail" },
}

export default function IndustryRetailPage() {
  return (
    <main className='min-h-screen pt-24 bg-black'>
      <div className='max-w-5xl mx-auto px-6 py-16'>
        <div className='w-8 h-0.5 bg-red-600 mb-6' />
        <h1 className='text-4xl font-bold text-white mb-12'>Retail</h1>
        <IndustryPage industryId="retail" />
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([
        { name: 'Home', path: '/' },
        { name: 'Industries', path: '/industries' },
        { name: 'Retail', path: '/industries/retail' },
      ])) }} />
    </main>
  )
}
