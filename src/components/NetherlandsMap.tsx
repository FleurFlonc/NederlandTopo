import { useEffect, useState } from 'react'
import * as d3 from 'd3'
import { PROVINCES } from '../data/provinces'
import type { FeedbackState } from '../utils/game'

const GEOJSON_URL = 'https://cartomap.github.io/nl/wgs84/provincie_2023.geojson'
const W = 500
const H = 620

interface Props {
  feedbackMap?: Record<string, FeedbackState>
  onProvinceClick?: (key: string) => void
  clickable?: boolean
  activeCapitalKey?: string | null
}

interface PathData {
  key: string
  d: string
}

interface CapitalPoint {
  key: string
  x: number
  y: number
}

function normKey(statnaam: string): string {
  const s = statnaam.toLowerCase()
  if (s === 'fryslân') return 'friesland'
  return s.replace(/\s+/g, '-')
}

export default function NetherlandsMap({
  feedbackMap = {},
  onProvinceClick,
  clickable = false,
  activeCapitalKey = null,
}: Props) {
  const [paths, setPaths] = useState<PathData[]>([])
  const [capitals, setCapitals] = useState<CapitalPoint[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetch(GEOJSON_URL)
      .then(r => r.json())
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then((geo: any) => {
        const proj = d3.geoMercator().fitSize([W, H], geo)
        const pathGen = d3.geoPath(proj)

        setPaths(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          geo.features.map((f: any) => ({
            key: normKey(f.properties?.statnaam ?? ''),
            d: pathGen(f) ?? '',
          }))
        )

        setCapitals(
          PROVINCES.map(p => {
            const [x, y] = proj(p.capitalCoords) ?? [0, 0]
            return { key: p.key, x, y }
          })
        )

        setLoading(false)
      })
      .catch(() => {
        setError(true)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-3 border-blue-300 border-t-blue-600 rounded-full animate-spin" />
          <span>Kaart laden…</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center text-red-400 text-sm text-center p-4">
        Kon de kaart niet laden.
        <br />Controleer je internetverbinding.
      </div>
    )
  }

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="w-full h-full"
      style={{ display: 'block', maxHeight: '100%' }}
    >
      <defs>
        <filter id="shadow-active" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#1e293b" floodOpacity="0.35" />
        </filter>
      </defs>

      {paths.map(({ key, d }) => {
        const province = PROVINCES.find(p => p.key === key)
        const fb = feedbackMap[key]

        let fill = province?.color ?? '#d1d5db'
        let stroke = 'white'
        let strokeWidth = 1.5
        let filter: string | undefined
        let opacity = 1

        if (fb === 'correct') {
          fill = '#22c55e'
          stroke = '#16a34a'
          strokeWidth = 2.5
          filter = 'url(#shadow-active)'
        } else if (fb === 'wrong') {
          fill = '#ef4444'
          stroke = '#b91c1c'
          strokeWidth = 2.5
          filter = 'url(#shadow-active)'
        } else if (fb === 'active') {
          stroke = '#1e293b'
          strokeWidth = 3
          filter = 'url(#shadow-active)'
        } else if (clickable) {
          opacity = 0.9
        }

        return (
          <path
            key={key}
            d={d}
            fill={fill}
            stroke={stroke}
            strokeWidth={strokeWidth}
            opacity={opacity}
            filter={filter}
            style={{
              cursor: clickable ? 'pointer' : 'default',
              transition: 'fill 0.25s ease, opacity 0.2s',
            }}
            onClick={() => clickable && onProvinceClick?.(key)}
            onMouseEnter={e => {
              if (clickable) (e.target as SVGPathElement).style.opacity = '0.75'
            }}
            onMouseLeave={e => {
              if (clickable) (e.target as SVGPathElement).style.opacity = String(opacity)
            }}
          />
        )
      })}

      {/* Capital dots */}
      {capitals.map(({ key, x, y }) => {
        const isActive = activeCapitalKey === key
        return (
          <circle
            key={key}
            cx={x}
            cy={y}
            r={isActive ? 7 : 4}
            fill="#dc2626"
            stroke="white"
            strokeWidth={1.5}
            style={{ pointerEvents: 'none', transition: 'r 0.2s ease' }}
          />
        )
      })}
    </svg>
  )
}
