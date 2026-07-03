import type { Metadata } from 'next'
import Link from 'next/link'
import { breadcrumbJsonLd } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Company',
  description: 'Mitigence is a Cybersecurity Delivery and Engineering Platform — built for organizations that want security done properly.',
  alternates: { canonical: '/company' },
}

const sections = [
  { label: 'About Us', href: '/about', description: 'Our story, why we exist, and the principles behind the Mitigence approach.' },
  { label: 'Our Approach', href: '/approach', description: 'How Mitigence structures every engagement — from discovery through continuous improvement.' },
  { label: 'Leadership', href: '/leadership', description: 'The security practitioners who built this platform and lead every engagement.' },
  { label: 'Careers', href: '/careers', description: 'Join a team of security engineers who build programs — not pitch decks.' },
]

export default function CompanyPage() {
  return (
    <main className="min-h-screen pt-24 bg-black">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="w-8 h-0.5 bg-red-600 mb-6" />
        <h1 className="text-4xl font-bold text-white mb-4">Mitigence</h1>
        <p className="text-zinc-400 text-lg mb-4 leading-relaxed max-w-2xl">
          A Cybersecurity Delivery and Engineering Platform — built for organizations that want to
          understand their risks, engineer resilient controls, operate with confidence, and
          continuously improve.
        </p>
        <p className="text-zinc-500 text-base mb-16 max-w-2xl">Not a reseller. Not a body shop. An engineering firm.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {sections.map((s) => (
            <Link key={s.href} href={s.href}
              className="group block bg-zinc-900 border border-zinc-800 hover:border-red-600/50 rounded-lg p-6 transition-colors duration-200"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-zinc-700 group-hover:bg-red-600 mb-4 transition-colors" />
              <h2 className="text-white font-bold mb-2 group-hover:text-red-400 transition-colors">{s.label}</h2>
              <p className="text-zinc-500 text-sm leading-relaxed">{s.description}</p>
            </Link>
          ))}
        </div>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([
        { name: 'Home', path: '/' },
        { name: 'Company', path: '/company' },
      ])) }} />
    </main>
  )
}
