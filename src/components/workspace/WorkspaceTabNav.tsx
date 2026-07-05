'use client'

interface WorkspaceTabNavProps {
  tabs: readonly string[]
  activeTab: string
  onTabChange: (tab: string) => void
}

export function WorkspaceTabNav({ tabs, activeTab, onTabChange }: WorkspaceTabNavProps) {
  return (
    <div className="flex border-b border-zinc-800 overflow-x-auto">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          className={`flex-shrink-0 px-5 py-3 text-xs font-medium border-b-2 transition-colors cursor-pointer ${
            activeTab === tab
              ? 'border-red-600 text-white bg-red-600/5'
              : 'border-transparent text-zinc-500 hover:text-zinc-300'
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  )
}
