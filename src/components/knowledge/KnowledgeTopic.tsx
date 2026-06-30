import Link from 'next/link'
import knowledgeData from '@/data/knowledge.json'

interface KnowledgeTopicProps {
  topicId: string
}

export function KnowledgeTopic({ topicId }: KnowledgeTopicProps) {
  const topic = knowledgeData.topics.find((t) => t.id === topicId || t.slug === topicId)

  if (!topic) {
    return (
      <div className="text-zinc-500 text-sm">
        Topic not found.{' '}
        <Link href="/knowledge" className="text-red-600 hover:text-red-500">
          Browse all topics
        </Link>
      </div>
    )
  }

  return (
    <article>
      <div className="prose prose-invert max-w-none">
        <p className="text-zinc-300 text-base leading-relaxed mb-10">{topic.overview}</p>

        <div className="space-y-10">
          {topic.sections.map((section, i) => (
            <div key={i} className="border-l-2 border-red-600/30 pl-6">
              <h2 className="text-white font-bold text-xl mb-3">{section.title}</h2>
              <p className="text-zinc-400 text-sm leading-relaxed">{section.content}</p>
            </div>
          ))}
        </div>

        {topic.relatedEngagements.length > 0 && (
          <div className="mt-12 pt-8 border-t border-zinc-900">
            <h3 className="text-white font-semibold text-sm uppercase tracking-wide mb-4">
              Related Engagements
            </h3>
            <div className="flex flex-wrap gap-2">
              {topic.relatedEngagements.map((e) => (
                <span
                  key={e}
                  className="text-sm text-zinc-300 bg-zinc-900 border border-zinc-800 rounded-full px-4 py-1.5"
                >
                  {e}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-zinc-900 flex flex-wrap gap-4">
          <Link
            href="/platform/engineer/engagement-studio"
            className="bg-red-600 hover:bg-red-700 text-white font-medium px-5 py-2.5 rounded-lg text-sm transition-colors"
          >
            Design an engagement →
          </Link>
          <Link
            href="/knowledge"
            className="text-zinc-400 hover:text-white text-sm font-medium self-center"
          >
            ← All topics
          </Link>
        </div>
      </div>
    </article>
  )
}
