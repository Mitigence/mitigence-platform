import type { Metadata } from 'next'
import { breadcrumbJsonLd } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms governing use of the Mitigence website.',
  alternates: {
    canonical: '/terms',
  },
}

const sections = [
  {
    heading: 'Acceptance of Terms',
    body: 'By accessing mitigence.com, you agree to these terms of service. If you do not agree, please do not use this site.',
  },
  {
    heading: 'Website Use',
    body: 'Content on this site is provided for informational purposes about Mitigence’s cybersecurity services. It does not constitute professional advice, and no client relationship is formed by browsing this website or submitting a contact form.',
  },
  {
    heading: 'Intellectual Property',
    body: 'All content on this site — including text, graphics, logos, and design — is the property of Mitigence and may not be reproduced without permission.',
  },
  {
    heading: 'Content Accuracy',
    body: 'The information on this site reflects our current knowledge and is updated as the field evolves. Cybersecurity guidance changes quickly — if you are making decisions based on something you read here, we encourage you to reach out directly so we can give you context specific to your situation.',
  },
  {
    heading: 'Engagements',
    body: 'Any actual security engagement, statement of work, or service agreement with Mitigence is governed by a separate signed contract, not by these website terms.',
  },
  {
    heading: 'Changes to These Terms',
    body: 'We may update these terms from time to time. Continued use of the site after changes constitutes acceptance of the revised terms.',
  },
  {
    heading: 'Contact',
    body: 'Questions about these terms can be sent to business@mitigence.com.',
  },
]

export default function TermsPage() {
  return (
    <main className="min-h-screen pt-24 bg-black">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="w-8 h-0.5 bg-red-600 mb-6" />
        <h1 className="text-4xl font-bold text-white mb-4">Terms of Service</h1>
        <p className="text-zinc-400 text-lg mb-12">
          Last updated: January 2026. These terms govern your use of mitigence.com.
        </p>

        <div className="space-y-10">
          {sections.map((section) => (
            <div key={section.heading}>
              <h2 className="text-white font-semibold text-lg mb-2">{section.heading}</h2>
              <p className="text-zinc-400 text-sm leading-relaxed">{section.body}</p>
            </div>
          ))}
        </div>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([
        { name: 'Home', path: '/' },
        { name: 'Terms of Service', path: '/terms' },
      ])) }} />
    </main>
  )
}
