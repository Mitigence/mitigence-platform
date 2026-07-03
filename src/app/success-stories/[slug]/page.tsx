import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import storiesData from '@/data/success-stories.json'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return storiesData.stories.map((s) => ({ slug: s.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const story = storiesData.stories.find((s) => s.slug === slug)
  if (!story) return { title: 'Story Not Found' }
  return {
    title: `${story.title} | Mitigence`,
    description: story.summary,
    alternates: { canonical: `/success-stories/${slug}` },
  }
}

export default async function SuccessStoryPage({ params }: Props) {
  const { slug } = await params
  const story = storiesData.stories.find((s) => s.slug === slug)
  if (!story) notFound()

  return (
    <main className="min-h-screen pt-24 bg-black">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <Link href="/success-stories" className="text-zinc-500 hover:text-zinc-300 text-sm transition-colors mb-8 inline-block">
          ← All success stories
        </Link>

        <div className="w-8 h-0.5 bg-red-600 mb-6" />
        <h1 className="text-4xl font-bold text-white mb-4">{story.title}</h1>

        {/* Meta tags */}
        <div className="flex flex-wrap gap-2 mb-8">
          {[story.industry, story.organizationSize, story.securityObjective, story.deliveryModel].map((tag) => (
            <span key={tag} className="text-zinc-400 text-xs border border-zinc-700 rounded px-2.5 py-1">
              {tag}
            </span>
          ))}
        </div>

        <p className="text-zinc-300 text-lg leading-relaxed mb-12">{story.summary}</p>

        {/* Challenge */}
        <div className="mb-8">
          <h2 className="text-white font-semibold text-xs uppercase tracking-wide mb-3">Challenge</h2>
          <p className="text-zinc-400 text-sm leading-relaxed">{story.challenge}</p>
        </div>

        {/* Approach */}
        <div className="mb-8">
          <h2 className="text-white font-semibold text-xs uppercase tracking-wide mb-3">Approach</h2>
          <p className="text-zinc-400 text-sm leading-relaxed">{story.approach}</p>
        </div>

        {/* Timeline */}
        <div className="mb-8">
          <h2 className="text-white font-semibold text-xs uppercase tracking-wide mb-3">Timeline</h2>
          <p className="text-red-600 font-bold text-xl">{story.timeline}</p>
        </div>

        {/* Outcomes */}
        <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-6 mb-8">
          <h2 className="text-white font-semibold text-xs uppercase tracking-wide mb-4">Outcomes</h2>
          <ul className="space-y-3">
            {story.outcomes.map((outcome, i) => (
              <li key={i} className="flex items-start gap-3 text-zinc-300 text-sm">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-600 flex-shrink-0" />
                {outcome}
              </li>
            ))}
          </ul>
        </div>

        {/* Continuous improvement */}
        {story.continuousImprovement && (
          <div className="mb-12">
            <h2 className="text-white font-semibold text-xs uppercase tracking-wide mb-3">Continuous Improvement</h2>
            <p className="text-zinc-400 text-sm leading-relaxed">{story.continuousImprovement}</p>
          </div>
        )}

        {/* CTA */}
        <div className="flex flex-wrap gap-4 pt-8 border-t border-zinc-900">
          <Link href="/platform/engineer/engagement-studio" className="bg-red-600 hover:bg-red-700 text-white font-medium px-5 py-2.5 rounded-lg text-sm transition-colors cyber-glow-hover">
            Design a similar engagement →
          </Link>
          <Link href="/consultation" className="border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white font-medium px-5 py-2.5 rounded-lg text-sm transition-colors">
            Talk to a specialist
          </Link>
        </div>
      </div>
    </main>
  )
}
