import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="min-h-screen pt-24 bg-black flex items-center">
      <div className="max-w-2xl mx-auto px-6 py-16 text-center">
        <div className="w-8 h-0.5 bg-red-600 mb-6 mx-auto" />
        <p className="text-red-600 text-sm font-semibold uppercase tracking-widest mb-4">404</p>
        <h1 className="text-4xl font-bold text-white mb-4">Page not found</h1>
        <p className="text-zinc-400 text-lg mb-10">
          The page you&apos;re looking for doesn&apos;t exist or may have moved.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/"
            className="bg-red-600 hover:bg-red-700 text-white font-medium px-5 py-2.5 rounded-lg text-sm transition-colors"
          >
            Back to Home
          </Link>
          <Link
            href="/platform"
            className="border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-white font-medium px-5 py-2.5 rounded-lg text-sm transition-colors"
          >
            Explore the Platform
          </Link>
          <Link
            href="/contact"
            className="border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-white font-medium px-5 py-2.5 rounded-lg text-sm transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </main>
  )
}
