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

type Screen = 'start' | 'game' | 'end'

function buildInitialFeedback(qs: Question[], idx: number, type: ExerciseType): Record<string, FeedbackState> {
  return type !== 'klik' ? { [qs[idx].provinceKey]: 'active' } : {}
}

export default function GameApp() {
  const [screen, setScreen] = useState<Screen>('start')
  const [exerciseType, setExerciseType] = useState<ExerciseType>('meerkeuze')
  const [total, setTotal] = useState<number>(20)
  const [wrongQuestions, setWrongQuestions] = useState<Question[]>([])
  const [isRetryRound, setIsRetryRound] = useState(false)
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [correct, setCorrect] = useState(0)
  const [wrong, setWrong] = useState(0)
  const [feedbackMap, setFeedbackMap] = useState<Record<string, FeedbackState>>({})
  const [answered, setAnswered] = useState(false)
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState<boolean | null>(null)
  const [lastClickedKey, setLastClickedKey] = useState<string | null>(null)

  const currentQuestion = questions[currentIndex]

  const startGame = useCallback((subject: Subject, exType: ExerciseType, sessionTotal: 20 | 30) => {
    const qs = generateQuestions(subject, sessionTotal)
    setTotal(sessionTotal as number)
    setExerciseType(exType)
    setQuestions(qs)
    setCurrentIndex(0)
    setCorrect(0)
    setWrong(0)
    setWrongQuestions([])
    setIsRetryRound(false)
    setFeedbackMap(buildInitialFeedback(qs, 0, exType))
    setAnswered(false)
    setScreen('game')
  }, [])

  const startRetry = useCallback((qs: Question[], exType: ExerciseType) => {
    setQuestions(qs)
    setTotal(qs.length)
    setCurrentIndex(0)
    setCorrect(0)
    setWrong(0)
    setWrongQuestions([])
    setIsRetryRound(true)
    setFeedbackMap(buildInitialFeedback(qs, 0, exType))
    setAnswered(false)
    setScreen('game')
  }, [])

  const handleAnswer = useCallback((isCorrect: boolean, selectedKey?: string) => {
    setAnswered(true)
    setLastAnswerCorrect(isCorrect)
    setLastClickedKey(selectedKey ?? null)
    const q = questions[currentIndex]
    if (isCorrect) {
      setCorrect(c => c + 1)
      setFeedbackMap({ [q.provinceKey]: 'correct' })
    } else {
      setWrong(w => w + 1)
      setWrongQuestions(prev => [...prev, q])
      const map: Record<string, FeedbackState> = { [q.provinceKey]: 'correct' }
      if (selectedKey && selectedKey !== q.provinceKey) map[selectedKey] = 'wrong'
      setFeedbackMap(map)
    }
  }, [questions, currentIndex])

  const handleMapClick = useCallback((clickedKey: string) => {
    if (answered) return
    handleAnswer(clickedKey === questions[currentIndex].provinceKey, clickedKey)
  }, [answered, handleAnswer, questions, currentIndex])

  const nextQuestion = useCallback(() => {
    const next = currentIndex + 1
    if (next >= total) {
      setScreen('end')
      return
    }
    setCurrentIndex(next)
    setFeedbackMap(buildInitialFeedback(questions, next, exerciseType))
    setAnswered(false)
    setLastAnswerCorrect(null)
    setLastClickedKey(null)
  }, [currentIndex, questions, exerciseType, total])

  const reset = useCallback(() => setScreen('start'), [])

  if (screen === 'start') return <StartScreen onStart={startGame} />
  if (screen === 'end') return (
    <EndScreen
      correct={correct}
      total={total}
      wrongQuestions={wrongQuestions}
      isRetryRound={isRetryRound}
      exerciseType={exerciseType}
      onRestart={reset}
      onRetry={startRetry}
    />
  )

  if (!currentQuestion) return null

  const activeCapitalKey =
    (exerciseType !== 'klik' || answered) ? currentQuestion.provinceKey : null
  const correctProv = PROVINCES.find(p => p.key === currentQuestion.provinceKey)!

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <HUD correct={correct} wrong={wrong} current={currentIndex + 1} total={total} onReset={reset} />
      <div className="flex-1 flex flex-col md:flex-row">
        <div className="md:w-[58%] p-3 md:p-6">
          <NetherlandsMap
            feedbackMap={feedbackMap}
            onProvinceClick={exerciseType === 'klik' && !answered ? handleMapClick : undefined}
            clickable={exerciseType === 'klik' && !answered}
            activeCapitalKey={activeCapitalKey}
          />
        </div>
        <div className="md:w-[42%] flex flex-col justify-center p-4 md:p-8 md:border-l border-gray-200 bg-white">
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
            klickWasCorrect={lastAnswerCorrect}
            klickClickedKey={lastClickedKey}
            onAnswer={handleAnswer}
            onNext={nextQuestion}
          />
          <p className="text-center text-xs text-gray-300 mt-6">
            Vraag {currentIndex + 1} van {total}
          </p>
        </div>
      </div>
    </div>
  )
}

