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

function noConsecutiveDuplicates(arr: string[]): string[] {
  const result = [...arr]
  for (let i = 1; i < result.length; i++) {
    if (result[i] === result[i - 1]) {
      for (let j = i + 1; j < result.length; j++) {
        if (result[j] !== result[i]) {
          ;[result[i], result[j]] = [result[j], result[i]]
          break
        }
      }
    }
  }
  return result
}

export function generateQuestions(subject: Subject, total: 20 | 30 = 20): Question[] {
  const keys = PROVINCES.map(p => p.key)

  // 20 vragen → elke provincie minstens 1x (1 ronde van 12)
  // 30 vragen → elke provincie minstens 2x (2 rondes van 12)
  const rounds = total === 30 ? 2 : 1
  let pool: string[] = []
  for (let r = 0; r < rounds; r++) {
    pool = [...pool, ...shuffle([...keys])]
  }

  // Vul resterende slots willekeurig aan (nooit zelfde als vorige)
  while (pool.length < total) {
    const last = pool[pool.length - 1]
    const others = keys.filter(k => k !== last)
    pool.push(others[Math.floor(Math.random() * others.length)])
  }

  // Zorg dat nooit twee dezelfde vragen achter elkaar staan
  pool = noConsecutiveDuplicates(pool.slice(0, total))

  return pool.map((provinceKey, i) => ({
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
