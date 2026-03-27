
interface Props {
  correct: number
  wrong: number
  current: number
  total: number
  onReset: () => void
}

export default function HUD({ correct, wrong, current, total, onReset }: Props) {
  const pct = Math.round(((current - 1) / total) * 100)

  return (
    <div className="sticky top-0 z-10 bg-white/95 backdrop-blur border-b border-gray-200 shadow-sm">
      <div className="max-w-5xl mx-auto px-4 py-2 flex items-center gap-4">
        {/* Score */}
        <div className="flex items-center gap-3 shrink-0">
          <span className="flex items-center gap-1 text-green-600 font-bold text-lg">
            <span>✓</span>
            <span>{correct}</span>
          </span>
          <span className="flex items-center gap-1 text-red-500 font-bold text-lg">
            <span>✗</span>
            <span>{wrong}</span>
          </span>
        </div>

        {/* Progress bar */}
        <div className="flex-1 flex items-center gap-2">
          <div className="flex-1 bg-gray-200 rounded-full h-2.5 overflow-hidden">
            <div
              className="h-full bg-indigo-500 rounded-full transition-all duration-300"
              style={{ width: `${pct}%` }}
            />
          </div>
          <span className="text-sm text-gray-500 font-medium shrink-0 tabular-nums">
            {current}/{total}
          </span>
        </div>

        {/* Reset */}
        <button
          onClick={onReset}
          title="Stoppen"
          className="shrink-0 text-sm text-gray-400 hover:text-gray-600 px-3 py-1 rounded-lg hover:bg-gray-100 transition-colors"
        >
          ✕ Stoppen
        </button>

      </div>
    </div>
  )
}
