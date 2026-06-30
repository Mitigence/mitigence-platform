import type { Metadata } from 'next'
import { IndustryPage } from '@/components/industries/IndustryPage'

export const metadata: Metadata = {
  title: "Financial Services Cybersecurity",
  description: "Security challenges, common engagements, and recommended approaches for the Financial Services sector.",
  alternates: { canonical: "/industries/financial-services" },
}

export default function IndustryFinancialServicesPage() {
  return (
    <main className='min-h-screen pt-24 bg-black'>
      <div className='max-w-5xl mx-auto px-6 py-16'>
        <div className='w-8 h-0.5 bg-red-600 mb-6' />
        <h1 className='text-4xl font-bold text-white mb-12'>Financial Services</h1>
        <IndustryPage industryId="financial-services" />
      </div>
    </main>
  )
}
