import { useState, useCallback } from 'react'
import {
  type Subject,
  type ExerciseType,
  type Question,
  type FeedbackState,
  generateQuestions,
} from './utils/game'
import { PROVINCES } from './data/provinces'
import NetherlandsMap from './components/NetherlandsMap'
import StartScreen from './components/StartScreen'
import HUD from './components/HUD'
import QuestionPanel from './components/QuestionPanel'
import EndScreen from './components/EndScreen'

const TOTAL = 50

type Screen = 'start' | 'game' | 'end'

export default function App() {
  const [screen, setScreen] = useState<Screen>('start')
  const [exerciseType, setExerciseType] = useState<ExerciseType>('meerkeuze')
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [correct, setCorrect] = useState(0)
  const [wrong, setWrong] = useState(0)
  const [feedbackMap, setFeedbackMap] = useState<Record<string, FeedbackState>>({})
  const [answered, setAnswered] = useState(false)

  const currentQuestion = questions[currentIndex]

  // Build feedbackMap for a given question index (pre-answer state)
  function buildInitialFeedback(qs: Question[], idx: number, type: ExerciseType): Record<string, FeedbackState> {
    return type !== 'klik' ? { [qs[idx].provinceKey]: 'active' } : {}
  }

  const startGame = useCallback((subject: Subject, exType: ExerciseType) => {
    const qs = generateQuestions(subject, TOTAL)
    setExerciseType(exType)
    setQuestions(qs)
    setCurrentIndex(0)
    setCorrect(0)
    setWrong(0)
    setFeedbackMap(buildInitialFeedback(qs, 0, exType))
    setAnswered(false)
    setScreen('game')
  }, [])

  const handleAnswer = useCallback((isCorrect: boolean, selectedKey?: string) => {
    setAnswered(true)
    const q = questions[currentIndex]
    if (isCorrect) {
      setCorrect(c => c + 1)
      setFeedbackMap({ [q.provinceKey]: 'correct' })
    } else {
      setWrong(w => w + 1)
      const map: Record<string, FeedbackState> = { [q.provinceKey]: 'correct' }
      if (selectedKey && selectedKey !== q.provinceKey) map[selectedKey] = 'wrong'
      setFeedbackMap(map)
    }
  }, [questions, currentIndex])

  // Called from map in klik mode
  const handleMapClick = useCallback((clickedKey: string) => {
    if (answered) return
    handleAnswer(clickedKey === questions[currentIndex].provinceKey, clickedKey)
  }, [answered, handleAnswer, questions, currentIndex])

  const nextQuestion = useCallback(() => {
    const next = currentIndex + 1
    if (next >= TOTAL) {
      setScreen('end')
      return
    }
    setCurrentIndex(next)
    setFeedbackMap(buildInitialFeedback(questions, next, exerciseType))
    setAnswered(false)
  }, [currentIndex, questions, exerciseType])

  const reset = useCallback(() => setScreen('start'), [])

  // ---- Screens ----
  if (screen === 'start') return <StartScreen onStart={startGame} />
  if (screen === 'end')   return <EndScreen correct={correct} total={TOTAL} onRestart={reset} />

  if (!currentQuestion) return null

  // Determine active capital dot
  const activeCapitalKey =
    (exerciseType !== 'klik' || answered)
      ? currentQuestion.provinceKey
      : null

  // In klik mode we also want to show answered province name after click
  const correctProv = PROVINCES.find(p => p.key === currentQuestion.provinceKey)!

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <HUD
        correct={correct}
        wrong={wrong}
        current={currentIndex + 1}
        total={TOTAL}
        onReset={reset}
      />

      {/* Main layout */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">

        {/* Map */}
        <div className="md:w-[58%] flex items-center justify-center p-3 md:p-6 md:min-h-0">
          <div className="w-full h-full max-h-[45vh] md:max-h-none">
            <NetherlandsMap
              feedbackMap={feedbackMap}
              onProvinceClick={exerciseType === 'klik' && !answered ? handleMapClick : undefined}
              clickable={exerciseType === 'klik' && !answered}
              activeCapitalKey={activeCapitalKey}
            />
          </div>
        </div>

        {/* Question panel */}
        <div className="md:w-[42%] flex flex-col justify-center p-4 md:p-8 md:border-l border-gray-200 bg-white">
          {/* Klik mode: show province context label when answered */}
          {exerciseType === 'klik' && answered && (
            <div className="text-center mb-4">
              <span className="inline-block bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">
                {correctProv.name} — {correctProv.capital}
              </span>
            </div>
          )}

          <QuestionPanel
            key={currentIndex}
            question={currentQuestion}
            exerciseType={exerciseType}
            answered={answered}
            onAnswer={handleAnswer}
            onNext={nextQuestion}
          />

          {/* Question counter */}
          <p className="text-center text-xs text-gray-300 mt-6">
            Vraag {currentIndex + 1} van {TOTAL}
          </p>
        </div>
      </div>
    </div>
  )
}
