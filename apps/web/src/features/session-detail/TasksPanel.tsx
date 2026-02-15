import type { TaskItem } from '@/lib/parsers/types'
import { format } from 'date-fns'

const statusConfig: Record<
  TaskItem['status'],
  { label: string; bg: string; text: string }
> = {
  pending: { label: 'Pending', bg: 'bg-gray-500/20', text: 'text-gray-400' },
  in_progress: {
    label: 'In Progress',
    bg: 'bg-brand-500/20',
    text: 'text-brand-400',
  },
  completed: {
    label: 'Done',
    bg: 'bg-emerald-500/20',
    text: 'text-emerald-400',
  },
  deleted: { label: 'Deleted', bg: 'bg-red-500/20', text: 'text-red-400' },
}

export function TasksPanel({ tasks }: { tasks: TaskItem[] }) {
  if (tasks.length === 0) return null

  const completed = tasks.filter((t) => t.status === 'completed').length
  const total = tasks.filter((t) => t.status !== 'deleted').length

  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-4">
      <h3 className="text-sm font-semibold text-gray-300">Tasks</h3>
      <p className="mt-1 text-xs text-gray-500">
        {completed}/{total} completed
      </p>

      <div className="mt-3 space-y-1">
        {tasks.map((task, i) => {
          const cfg = statusConfig[task.status]
          return (
            <div
              key={task.taskId || i}
              className="flex items-start gap-2 rounded bg-gray-950/40 px-2 py-1.5"
            >
              <span
                className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-semibold ${cfg.bg} ${cfg.text}`}
              >
                {cfg.label}
              </span>
              <div className="min-w-0 flex-1">
                <span className="text-xs text-gray-300">{task.subject}</span>
                {task.description && (
                  <p className="mt-0.5 truncate text-[10px] text-gray-500">
                    {task.description}
                  </p>
                )}
              </div>
              {task.taskId && (
                <span className="shrink-0 text-[10px] font-mono text-gray-600">
                  #{task.taskId}
                </span>
              )}
              {task.timestamp && (
                <span className="shrink-0 text-[10px] text-gray-600">
                  {format(new Date(task.timestamp), 'HH:mm:ss')}
                </span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
