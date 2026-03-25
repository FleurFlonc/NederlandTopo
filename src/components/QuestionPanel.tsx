import { useState, useEffect, useRef } from 'react'
import { PROVINCES } from '../data/provinces'
import {
  type Question,
  type ExerciseType,
  getOptions,
  getAnswer,
  getKlikText,
  normalize,
} from '../utils/game'

interface Props {
  question: Question
  exerciseType: ExerciseType
  answered: boolean
  onAnswer: (isCorrect: boolean, selectedKey?: string) => void
  onNext: () => void
}

export default function QuestionPanel({ question, exerciseType, answered, onAnswer, onNext }: Props) {
  const [selected, setSelected] = useState<string | null>(null)
  const [typed, setTyped] = useState('')
  const [options] = useState(() => getOptions(question))
  const inputRef = useRef<HTMLInputElement>(null)

  // Reset local state when question changes
  useEffect(() => {
    setSelected(null)
    setTyped('')
    // Auto-focus input for typing mode
    if (exerciseType === 'typen') {
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [question, exerciseType])

  const correctAnswer = getAnswer(question)
  const correctProv = PROVINCES.find(p => p.key === question.provinceKey)!

  // --- Meerkeuze ---
  function handleMCClick(option: string) {
    if (answered) return
    const prov = PROVINCES.find(p =>
      question.type === 'name' ? p.name === option : p.capital === option
    )!
    setSelected(option)
    onAnswer(prov.key === question.provinceKey, prov.key)
  }

  function mcButtonClass(option: string): string {
    const base = 'w-full text-left px-4 py-3 rounded-xl border-2 font-medium transition-all text-sm md:text-base'
    if (!answered) return `${base} bg-white border-gray-200 hover:border-indigo-400 hover:bg-indigo-50 cursor-pointer`
    const prov = PROVINCES.find(p =>
      question.type === 'name' ? p.name === option : p.capital === option
    )
    const isCorrect = prov?.key === question.provinceKey
    const isSelected = option === selected
    if (isCorrect) return `${base} bg-green-500 border-green-600 text-white`
    if (isSelected) return `${base} bg-red-500 border-red-600 text-white`
    return `${base} bg-gray-100 border-gray-200 text-gray-400`
  }

  // --- Typen ---
  function handleTypingSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (answered || !typed.trim()) return
    const isCorrect = normalize(typed) === normalize(correctAnswer)
    onAnswer(isCorrect)
  }

  // --- Shared feedback message ---
  function FeedbackMsg() {
    if (!answered) return null
    const wasCorrect = selected
      ? PROVINCES.find(p => question.type === 'name' ? p.name === selected : p.capital === selected)?.key === question.provinceKey
      : exerciseType === 'typen'
        ? normalize(typed) === normalize(correctAnswer)
        : null // klik — determined by parent

    return (
      <div className={`mt-4 p-3 rounded-xl text-sm font-medium ${wasCorrect === false ? 'bg-red-50 text-red-700' : wasCorrect === true ? 'bg-green-50 text-green-700' : 'bg-blue-50 text-blue-700'}`}>
        {wasCorrect === false && (
          <>Het juiste antwoord is: <strong>{correctAnswer}</strong></>
        )}
        {wasCorrect === true && <>Goed gedaan! 🎉</>}
        {wasCorrect === null && (
          <>Antwoord: <strong>{correctAnswer}</strong> ({correctProv.name})</>
        )}
      </div>
    )
  }

  const prompt = question.type === 'name'
    ? 'Welke provincie is dit?'
    : 'Wat is de hoofdstad van deze provincie?'

  // ============================
  // KLIK OP KAART
  // ============================
  if (exerciseType === 'klik') {
    return (
      <div className="w-full max-w-sm mx-auto flex flex-col gap-4">
        <div className="bg-indigo-600 text-white rounded-2xl p-6 text-center shadow-md">
          <p className="text-xs uppercase tracking-widest font-semibold text-indigo-200 mb-2">Vraag</p>
          <p className="text-xl md:text-2xl font-bold leading-snug">
            {getKlikText(question)}
          </p>
        </div>

        {!answered && (
          <p className="text-center text-gray-400 text-sm">Klik op de juiste provincie op de kaart</p>
        )}

        {answered && (
          <>
            <FeedbackMsg />
            <button
              onClick={onNext}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors"
            >
              Volgende →
            </button>
          </>
        )}
      </div>
    )
  }

  // ============================
  // MEERKEUZE
  // ============================
  if (exerciseType === 'meerkeuze') {
    return (
      <div className="w-full max-w-sm mx-auto flex flex-col gap-3">
        <p className="text-center font-semibold text-gray-700 text-lg">{prompt}</p>

        <div className="flex flex-col gap-2">
          {options.map(opt => (
            <button
              key={opt}
              onClick={() => handleMCClick(opt)}
              className={mcButtonClass(opt)}
              disabled={answered}
            >
              {opt}
            </button>
          ))}
        </div>

        <FeedbackMsg />

        {answered && (
          <button
            onClick={onNext}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors"
          >
            Volgende →
          </button>
        )}
      </div>
    )
  }

  // ============================
  // TYPEN
  // ============================
  return (
    <div className="w-full max-w-sm mx-auto flex flex-col gap-3">
      <p className="text-center font-semibold text-gray-700 text-lg">{prompt}</p>

      <form onSubmit={handleTypingSubmit} className="flex gap-2">
        <input
          ref={inputRef}
          value={typed}
          onChange={e => setTyped(e.target.value)}
          disabled={answered}
          placeholder="Typ het antwoord…"
          className="flex-1 border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-400 disabled:bg-gray-50 disabled:text-gray-400"
          autoComplete="off"
          spellCheck={false}
        />
        {!answered && (
          <button
            type="submit"
            className="px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors"
          >
            ✓
          </button>
        )}
      </form>

      <FeedbackMsg />

      {answered && (
        <button
          onClick={onNext}
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors"
        >
          Volgende →
        </button>
      )}
    </div>
  )
}
