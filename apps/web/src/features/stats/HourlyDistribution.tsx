export function HourlyDistribution({
  hourCounts,
}: {
  hourCounts: Record<string, number>
}) {
  const hours = Array.from({ length: 24 }, (_, i) => ({
    hour: i,
    label: `${i.toString().padStart(2, '0')}:00`,
    count: hourCounts[String(i)] ?? 0,
  }))

  const maxCount = Math.max(...hours.map((h) => h.count), 1)

  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-4">
      <h3 className="text-sm font-semibold text-gray-300">
        Hourly Distribution
      </h3>
      <p className="mt-1 text-xs text-gray-500">
        Session starts by hour of day
      </p>

      <div className="mt-4 flex items-end gap-0.5" style={{ height: '120px' }}>
        {hours.map((h) => {
          const height = h.count > 0 ? Math.max((h.count / maxCount) * 100, 4) : 0
          const intensity = h.count / maxCount

          return (
            <div
              key={h.hour}
              className="group relative flex-1"
              style={{ height: '100%' }}
            >
              <div
                className="absolute bottom-0 w-full rounded-t transition-colors"
                style={{
                  height: `${height}%`,
                  backgroundColor: `rgba(217, 119, 87, ${0.2 + intensity * 0.6})`,
                }}
              />
              {/* Tooltip on hover */}
              <div className="absolute -top-8 left-1/2 hidden -translate-x-1/2 whitespace-nowrap rounded bg-gray-800 px-1.5 py-0.5 text-[10px] text-gray-300 group-hover:block">
                {h.label}: {h.count}
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-1 flex justify-between text-[10px] text-gray-600">
        <span>00:00</span>
        <span>06:00</span>
        <span>12:00</span>
        <span>18:00</span>
        <span>23:00</span>
      </div>
    </div>
  )
}
