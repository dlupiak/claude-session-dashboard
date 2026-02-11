import { createFileRoute } from '@tanstack/react-router'
import { SessionList } from '@/features/sessions/SessionList'

export const Route = createFileRoute('/_dashboard/sessions/')({
  component: SessionsPage,
})

function SessionsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-white">Sessions</h1>
      <p className="mt-1 text-sm text-gray-400">
        All Claude Code sessions from ~/.claude
      </p>
      <div className="mt-6">
        <SessionList />
      </div>
    </div>
  )
}
