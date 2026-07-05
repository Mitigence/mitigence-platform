interface OverviewStatCardProps {
  label: string
  children: React.ReactNode
  wide?: boolean
}

export function OverviewStatCard({ label, children, wide }: OverviewStatCardProps) {
  return (
    <div className={`rounded-lg border border-zinc-800 bg-zinc-900 p-4 ${wide ? 'sm:col-span-3' : ''}`}>
      <p className="text-zinc-500 text-xs mb-1">{label}</p>
      {children}
    </div>
  )
}
