import type { RiskResult } from '@/lib/risk'
import { RISK_STYLES } from '@/lib/risk-styles'

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
