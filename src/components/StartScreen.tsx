import type { Subject, ExerciseType } from '../utils/game'

interface Props {
  onStart: (subject: Subject, exerciseType: ExerciseType) => void
}

const SUBJECTS: { value: Subject; label: string; emoji: string; desc: string }[] = [
  { value: 'provincies',  label: 'Provincies',  emoji: '🗺️', desc: 'Provincienamen leren' },
  { value: 'hoofdsteden', label: 'Hoofdsteden', emoji: '🏛️', desc: 'Hoofdsteden leren' },
  { value: 'beide',       label: 'Beide',       emoji: '⭐', desc: 'Mix van alles' },
]

const EXERCISES: { value: ExerciseType; label: string; emoji: string; desc: string }[] = [
  { value: 'meerkeuze', label: 'Meerkeuze', emoji: '🔘', desc: 'Kies uit 4 opties' },
  { value: 'typen',     label: 'Typen',     emoji: '⌨️', desc: 'Typ het antwoord' },
  { value: 'klik',      label: 'Klik op kaart', emoji: '👆', desc: 'Klik de juiste provincie' },
]

import { useState } from 'react'

export default function StartScreen({ onStart }: Props) {
  const [subject, setSubject] = useState<Subject>('provincies')
  const [exercise, setExercise] = useState<ExerciseType>('meerkeuze')

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-lg">
        {/* Title */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🇳🇱</div>
          <h1 className="text-3xl font-bold text-gray-800">Nederland Topo</h1>
          <p className="text-gray-500 mt-1">Leer de provincies en hoofdsteden</p>
        </div>

        {/* Subject */}
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Onderwerp
          </h2>
          <div className="grid grid-cols-3 gap-2">
            {SUBJECTS.map(s => (
              <button
                key={s.value}
                onClick={() => setSubject(s.value)}
                className={`
                  flex flex-col items-center p-3 rounded-xl border-2 transition-all text-sm font-medium
                  ${subject === s.value
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'}
                `}
              >
                <span className="text-2xl mb-1">{s.emoji}</span>
                <span>{s.label}</span>
                <span className="text-xs font-normal text-gray-400 mt-0.5 hidden sm:block">{s.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Exercise type */}
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Oefentype
          </h2>
          <div className="grid grid-cols-3 gap-2">
            {EXERCISES.map(e => (
              <button
                key={e.value}
                onClick={() => setExercise(e.value)}
                className={`
                  flex flex-col items-center p-3 rounded-xl border-2 transition-all text-sm font-medium
                  ${exercise === e.value
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'}
                `}
              >
                <span className="text-2xl mb-1">{e.emoji}</span>
                <span className="text-center leading-tight">{e.label}</span>
                <span className="text-xs font-normal text-gray-400 mt-0.5 hidden sm:block text-center">{e.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Start button */}
        <button
          onClick={() => onStart(subject, exercise)}
          className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-lg font-semibold rounded-2xl transition-colors shadow-md"
        >
          Start — 50 vragen →
        </button>
      </div>
    </div>
  )
}
