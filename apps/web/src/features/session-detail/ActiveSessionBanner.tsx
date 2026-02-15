export function ActiveSessionBanner() {
  return (
    <div className="mb-4 flex items-center gap-2 rounded-lg border border-emerald-800 bg-emerald-900/30 px-4 py-2 text-sm text-emerald-300">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
      </span>
      This session is currently active. Data refreshes automatically.
    </div>
  )
}
