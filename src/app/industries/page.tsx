import type { Metadata } from 'next'
import Link from 'next/link'
import industriesData from '@/data/industries.json'
import { breadcrumbJsonLd } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Industries',
  description: 'Every sector faces distinct security pressures. Explore how Mitigence approaches financial services, healthcare, government, education, retail, and manufacturing.',
  alternates: {
    canonical: '/industries',
  },
}

export default function IndustriesPage() {
  return (
    <main className="min-h-screen pt-24 bg-black">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="w-8 h-0.5 bg-red-600 mb-6" />
        <h1 className="text-4xl font-bold text-white mb-4">Industries</h1>
        <p className="text-zinc-400 text-lg max-w-2xl mb-12">
          Every sector faces distinct security pressures. Explore challenges and recommended
          approaches for your industry.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {industriesData.industries.map((industry) => (
            <Link
              key={industry.id}
              href={industry.href}
              className="group block bg-zinc-900 border border-zinc-800 hover:border-red-600/50 rounded-lg p-6 transition-colors duration-200"
            >
              <div className="w-2 h-2 rounded-full bg-zinc-700 group-hover:bg-red-600 mb-4 transition-colors" />
              <h2 className="text-white font-bold text-lg mb-2 group-hover:text-red-500 transition-colors">
                {industry.name}
              </h2>
              <p className="text-zinc-500 text-sm leading-relaxed mb-4">{industry.description}</p>
              <span className="text-red-600 text-sm font-medium">Explore sector →</span>
            </Link>
          ))}
        </div>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([
        { name: 'Home', path: '/' },
        { name: 'Industries', path: '/industries' },
      ])) }} />
    </main>
  )
}
