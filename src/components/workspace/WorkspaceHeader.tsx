export function WorkspaceHeader() {
  return (
    <div className="bg-zinc-900 px-6 py-4 flex items-center justify-between border-b border-zinc-800">
      <div className="flex items-center gap-3">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-zinc-700" />
          <div className="w-3 h-3 rounded-full bg-zinc-700" />
          <div className="w-3 h-3 rounded-full bg-zinc-700" />
        </div>
        <span className="text-zinc-400 text-xs">Mitigence Workspace</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-green-500" />
        <span className="text-zinc-500 text-xs">Live session</span>
      </div>
    </div>
  )
}
