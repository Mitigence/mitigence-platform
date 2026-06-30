interface PageShellProps {
  title: string
  description: string
  phase: string
  module?: string
}

export function PageShell({ title, description, phase, module: moduleName }: PageShellProps) {
  return (
    <main className="min-h-screen pt-16">
      <div className="max-w-7xl mx-auto px-6 py-24">
        <div className="max-w-2xl">
          <div className="flex items-center gap-3 mb-6">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-zinc-900 text-zinc-400 border border-zinc-800">
              {phase}
            </span>
            {moduleName && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-950 text-red-400 border border-red-900">
                {moduleName}
              </span>
            )}
          </div>
          <div className="w-8 h-0.5 bg-red-600 mb-6" />
          <h1 className="text-4xl font-bold text-white mb-4 tracking-tight">
            {title}
          </h1>
          <p className="text-zinc-400 text-lg leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </main>
  )
}
