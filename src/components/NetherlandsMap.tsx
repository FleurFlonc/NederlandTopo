import * as d3 from 'd3'
import { PROVINCES } from '../data/provinces'
import { GEO_DATA } from '../data/geoData'
import type { FeedbackState } from '../utils/game'

const W = 500
const H = 620

// Compute projection + paths once at module load (synchronous, no fetch)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const proj = d3.geoMercator().fitSize([W, H], GEO_DATA as any)
const pathGen = d3.geoPath(proj)

function normKey(statnaam: string): string {
  const s = statnaam.toLowerCase()
  if (s === 'fryslân') return 'friesland'
  return s.replace(/\s+/g, '-')
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const PATHS = GEO_DATA.features.map((f: any) => ({
  key: normKey(f.properties?.statnaam ?? ''),
  d: pathGen(f) ?? '',
}))

const CAPITALS = PROVINCES.map(p => {
  const [x, y] = proj(p.capitalCoords) ?? [0, 0]
  return { key: p.key, x, y }
})

interface Props {
  feedbackMap?: Record<string, FeedbackState>
  onProvinceClick?: (key: string) => void
  clickable?: boolean
  activeCapitalKey?: string | null
}

export default function NetherlandsMap({
  feedbackMap = {},
  onProvinceClick,
  clickable = false,
  activeCapitalKey = null,
}: Props) {
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width="100%"
      style={{ display: 'block' }}
    >
      <defs>
        <filter id="shadow-active" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#1e293b" floodOpacity="0.35" />
        </filter>
      </defs>

      {PATHS.map(({ key, d }) => {
        const province = PROVINCES.find(p => p.key === key)
        const fb = feedbackMap[key]

        let fill = province?.color ?? '#d1d5db'
        let stroke = 'white'
        let strokeWidth = 1.5
        let filter: string | undefined

        if (fb === 'correct') {
          fill = '#22c55e'; stroke = '#16a34a'; strokeWidth = 2.5
          filter = 'url(#shadow-active)'
        } else if (fb === 'wrong') {
          fill = '#ef4444'; stroke = '#b91c1c'; strokeWidth = 2.5
          filter = 'url(#shadow-active)'
        } else if (fb === 'active') {
          stroke = '#1e293b'; strokeWidth = 3
          filter = 'url(#shadow-active)'
        }

        return (
          <path
            key={key}
            d={d}
            fill={fill}
            stroke={stroke}
            strokeWidth={strokeWidth}
            filter={filter}
            style={{
              cursor: clickable ? 'pointer' : 'default',
              transition: 'fill 0.25s ease',
            }}
            onClick={() => clickable && onProvinceClick?.(key)}
            onMouseEnter={e => { if (clickable) (e.target as SVGPathElement).style.opacity = '0.75' }}
            onMouseLeave={e => { if (clickable) (e.target as SVGPathElement).style.opacity = '1' }}
          />
        )
      })}

      {CAPITALS.map(({ key, x, y }) => (
        <circle
          key={key}
          cx={x}
          cy={y}
          r={activeCapitalKey === key ? 7 : 4}
          fill="#dc2626"
          stroke="white"
          strokeWidth={1.5}
          style={{ pointerEvents: 'none' }}
        />
      ))}
    </svg>
  )
}
