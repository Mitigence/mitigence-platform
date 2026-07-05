import type { RiskResult } from '@/lib/risk'

const RISK_STYLES: Record<RiskResult['level'], string> = {
  'On track': 'bg-green-500/10 text-green-500 border-green-500/20',
  'At risk': 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  Delayed: 'bg-red-600/10 text-red-500 border-red-600/20',
}

export function RiskBadge({ risk }: { risk: RiskResult }) {
  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-4 mb-8">
      <p className="text-white text-sm font-medium mb-2">Risk</p>
      <span
        className={`inline-block text-xs font-semibold rounded-full px-2.5 py-1 border ${RISK_STYLES[risk.level]}`}
      >
        {risk.level}
      </span>
      {risk.reasons.length > 0 && (
        <ul className="mt-2 space-y-1">
          {risk.reasons.map((reason) => (
            <li key={reason} className="text-zinc-500 text-xs">
              {reason}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
