import type { Metadata } from 'next'
import Link from 'next/link'
import solutionsData from '@/data/solutions.json'

export const metadata: Metadata = {
  title: 'Security Solutions',
  description: 'Security capabilities across eight domains — applications, cloud, identity, network, endpoints, data, remote access, and monitoring.',
  alternates: {
    canonical: '/solutions',
  },
}

export default function SolutionsPage() {
  return (
    <main className="min-h-screen pt-24 bg-black">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="w-8 h-0.5 bg-red-600 mb-6" />
        <h1 className="text-4xl font-bold text-white mb-4">Security Solutions</h1>
        <p className="text-zinc-400 text-lg max-w-2xl mb-12">
          Eight security domains, each one an engineering discipline. Select a domain to see
          common challenges, business risks, and how Mitigence approaches it.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {solutionsData.solutions.map((s) => (
            <Link
              key={s.id}
              href={s.href}
              className="group block bg-zinc-900 border border-zinc-800 hover:border-red-600/50 rounded-lg p-6 transition-colors duration-200"
            >
              <div className="w-2 h-2 rounded-full bg-zinc-700 group-hover:bg-red-600 mb-4 transition-colors" />
              <h2 className="text-white font-bold mb-2 group-hover:text-red-500 transition-colors">{s.name}</h2>
              <p className="text-zinc-500 text-sm leading-relaxed">{s.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
