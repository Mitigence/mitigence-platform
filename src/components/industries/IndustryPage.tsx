import Link from 'next/link'
import industriesData from '@/data/industries.json'
import engagementsData from '@/data/engagements.json'

interface Props { industryId: string }

const nameToSlug = Object.fromEntries(
  engagementsData.engagements.map((e) => [e.name, e.id])
)

export function IndustryPage({ industryId }: Props) {
  const industry = industriesData.industries.find((i) => i.id === industryId)
  if (!industry) return <p className='text-zinc-500 text-sm'>Industry not found.</p>
  return (
    <div>
      <p className='text-zinc-300 text-base leading-relaxed mb-10'>{industry.description}</p>
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10'>
        <div>
          <h2 className='text-white font-semibold text-xs uppercase tracking-wide mb-4'>Key Challenges</h2>
          <ul className='space-y-3'>
            {industry.challenges.map((c) => (
              <li key={c} className='flex items-start gap-2 text-zinc-400 text-sm'>
                <span className='mt-1.5 w-1.5 h-1.5 rounded-full bg-red-600 flex-shrink-0' />{c}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className='text-white font-semibold text-xs uppercase tracking-wide mb-4'>Common Engagements</h2>
          <div className='flex flex-wrap gap-2'>
            {industry.commonEngagements.map((e) => {
              const slug = nameToSlug[e]
              return slug ? (
                <Link
                  key={e}
                  href={`/platform/engineer/delivery-framework/${slug}`}
                  className='text-xs text-zinc-300 bg-zinc-900 border border-zinc-800 hover:border-red-600/60 hover:text-red-400 hover:bg-zinc-900/80 rounded-full px-3 py-1.5 transition-colors'
                >
                  {e} →
                </Link>
              ) : (
                <span key={e} className='text-xs text-zinc-300 bg-zinc-900 border border-zinc-800 rounded-full px-3 py-1.5'>{e}</span>
              )
            })}
          </div>
          <p className='text-zinc-600 text-xs mt-3'>Click any engagement to see timeline, phases, and deliverables.</p>
        </div>
      </div>
      <div className='rounded-lg border border-red-600/30 bg-red-600/5 p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
        <div>
          <h3 className='text-white font-semibold mb-1'>Talk to a specialist</h3>
          <p className='text-zinc-400 text-sm'>Tell us about your environment and objectives — we&apos;ll come prepared.</p>
        </div>
        <Link href='/consultation' className='bg-red-600 hover:bg-red-700 text-white font-medium px-5 py-2.5 rounded-lg text-sm transition-colors whitespace-nowrap'>Schedule a call →</Link>
      </div>
    </div>
  )
}
