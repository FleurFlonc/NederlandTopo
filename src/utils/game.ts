import { PROVINCES } from '../data/provinces'

export type Subject = 'provincies' | 'hoofdsteden' | 'beide'
export type FeedbackState = 'active' | 'correct' | 'wrong'
export type ExerciseType = 'meerkeuze' | 'typen' | 'klik'
export type QuestionType = 'name' | 'capital'

export interface Question {
  provinceKey: string
  type: QuestionType
}

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function generateQuestions(subject: Subject, total = 50): Question[] {
  const keys = PROVINCES.map(p => p.key)
  // Ensure each province appears at least once
  const base = shuffle([...keys])
  const pool = [...base]
  while (pool.length < total) {
    pool.push(keys[Math.floor(Math.random() * keys.length)])
  }
  const allKeys = shuffle(pool).slice(0, total)

  return allKeys.map((provinceKey, i) => ({
    provinceKey,
    type: (
      subject === 'provincies' ? 'name' :
      subject === 'hoofdsteden' ? 'capital' :
      (i % 2 === 0 ? 'name' : 'capital')
    ) as QuestionType,
  }))
}

export function getOptions(question: Question): string[] {
  const prov = PROVINCES.find(p => p.key === question.provinceKey)!
  const correct = question.type === 'name' ? prov.name : prov.capital
  const others = shuffle(
    PROVINCES
      .filter(p => p.key !== question.provinceKey)
      .map(p => question.type === 'name' ? p.name : p.capital)
  ).slice(0, 3)
  return shuffle([correct, ...others])
}

export function normalize(s: string): string {
  return s.toLowerCase().replace(/['']/g, '').trim()
}

export function getAnswer(question: Question): string {
  const prov = PROVINCES.find(p => p.key === question.provinceKey)!
  return question.type === 'name' ? prov.name : prov.capital
}

export function getKlikText(question: Question): string {
  const prov = PROVINCES.find(p => p.key === question.provinceKey)!
  return question.type === 'name'
    ? `Klik op: ${prov.name}`
    : `Klik op de provincie van ${prov.capital}`
}

export function scoreEmoji(pct: number): string {
  if (pct === 100) return '🏆'
  if (pct >= 90) return '🌟'
  if (pct >= 75) return '😊'
  if (pct >= 60) return '👍'
  if (pct >= 40) return '😅'
  return '💪'
}
