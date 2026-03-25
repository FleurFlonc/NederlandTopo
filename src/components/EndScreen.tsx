import { scoreEmoji } from '../utils/game'
import type { Question, ExerciseType } from '../utils/game'

interface Props {
  correct: number
  total: number
  wrongQuestions: Question[]
  isRetryRound: boolean
  exerciseType: ExerciseType
  onRestart: () => void
  onRetry: (qs: Question[], exType: ExerciseType) => void
}

export default function EndScreen({ correct, total, wrongQuestions, isRetryRound, exerciseType, onRestart, onRetry }: Props) {
  const pct = Math.round((correct / total) * 100)
  const emoji = scoreEmoji(pct)
  const wrongCount = wrongQuestions.length

  // Deduplicate wrong questions by provinceKey+type (keep last occurrence)
  const dedupedWrong = wrongQuestions.filter(
    (q, i, arr) => arr.findLastIndex(x => x.provinceKey === q.provinceKey && x.type === q.type) === i
  )

  let msg = ''
  if (isRetryRound) {
    if (wrongCount === 0) msg = 'Alle fouten geoefend! Goed gedaan!'
    else msg = `Je had nog ${wrongCount} fout. Wil je ze opnieuw proberen?`
  } else {
    if (pct === 100) msg = 'Perfect! Je kent alle provincies!'
    else if (pct >= 90) msg = 'Geweldig! Bijna perfect!'
    else if (pct >= 75) msg = 'Goed gedaan! Blijf oefenen.'
    else if (pct >= 60) msg = 'Aardig op weg! Nog even oefenen.'
    else if (pct >= 40) msg = 'Je bent goed bezig, oefen nog wat meer!'
    else msg = 'Nog veel te leren — doe gewoon nog een ronde!'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl p-10 w-full max-w-sm text-center">

        <div className="text-7xl mb-4">
          {isRetryRound && wrongCount === 0 ? '🎉' : emoji}
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          {isRetryRound ? (wrongCount === 0 ? 'Gelukt!' : 'Nog niet af…') : 'Klaar!'}
        </h1>
        <p className="text-gray-500 mb-8">{msg}</p>

        <div className="bg-indigo-50 rounded-2xl p-6 mb-8">
          <div className="text-5xl font-bold text-indigo-700 mb-1">{pct}%</div>
          <div className="text-gray-500 text-sm">{correct} van {total} goed</div>
        </div>

        {/* Score bar */}
        <div className="w-full bg-gray-200 rounded-full h-3 mb-8 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-indigo-400 to-indigo-600 transition-all duration-700"
            style={{ width: `${pct}%` }}
          />
        </div>

        <div className="flex flex-col gap-3">
          {/* Retry wrong answers button — show if there are wrong answers */}
          {dedupedWrong.length > 0 && (
            <button
              onClick={() => onRetry(dedupedWrong, exerciseType)}
              className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white text-lg font-semibold rounded-2xl transition-colors shadow-md"
            >
              Oefen {dedupedWrong.length} foute antwoord{dedupedWrong.length === 1 ? '' : 'en'} opnieuw →
            </button>
          )}

          <button
            onClick={onRestart}
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white text-lg font-semibold rounded-2xl transition-colors shadow-md"
          >
            Nieuwe sessie starten
          </button>
        </div>
      </div>
    </div>
  )
}
