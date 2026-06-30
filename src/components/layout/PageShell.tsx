interface PageShellProps {
  title: string
  description: string
  phase?: string
  module?: string
}

export function PageShell({ title, description, phase, module }: PageShellProps) {
  return (
    <main className="min-h-screen pt-24 bg-black">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="w-8 h-0.5 bg-red-600 mb-6" />
        <h1 className="text-4xl font-bold text-white mb-4">{title}</h1>
        <p className="text-zinc-400 text-lg max-w-2xl">{description}</p>
        {(phase || module) && (
          <div className="mt-8 flex flex-wrap gap-3">
            {phase && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-zinc-900 text-zinc-400 border border-zinc-800">
                {phase}
              </span>
            )}
            {module && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-zinc-900 text-red-500 border border-zinc-800">
                {module}
              </span>
            )}
          </div>
        )}
      </div>
    </main>
  )
}
