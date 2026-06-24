import { useMemo, useState } from 'react'
import india from '@svg-maps/india'

// Maps the free-text state names used in backend/data/variants.py population_data
// to the location ids used by @svg-maps/india. Entries with no current Indian
// state (e.g. pre-partition historical regions) are intentionally left unmapped
// and are listed separately below the map rather than silently dropped.
const NAME_TO_ID = {
  'andaman and nicobar islands': 'an',
  'andhra pradesh': 'ap',
  'arunachal pradesh': 'ar',
  assam: 'as',
  bihar: 'br',
  chandigarh: 'ch',
  chhattisgarh: 'ct',
  'dadra and nagar haveli': 'dn',
  'daman and diu': 'dd',
  delhi: 'dl',
  goa: 'ga',
  gujarat: 'gj',
  haryana: 'hr',
  'himachal pradesh': 'hp',
  'jammu and kashmir': 'jk',
  jharkhand: 'jh',
  karnataka: 'ka',
  kerala: 'kl',
  lakshadweep: 'ld',
  'madhya pradesh': 'mp',
  maharashtra: 'mh',
  manipur: 'mn',
  meghalaya: 'ml',
  mizoram: 'mz',
  nagaland: 'nl',
  odisha: 'or',
  puducherry: 'py',
  punjab: 'pb',
  rajasthan: 'rj',
  sikkim: 'sk',
  'tamil nadu': 'tn',
  telangana: 'tg',
  tripura: 'tr',
  'uttar pradesh': 'up',
  uttarakhand: 'ut',
  'west bengal': 'wb',
}

function colorFor(frequency, maxFrequency) {
  if (frequency == null) return '#27272a' // zinc-800, unmapped/no-data state
  const t = maxFrequency > 0 ? Math.min(frequency / maxFrequency, 1) : 0
  // interpolate zinc-800 -> teal-300 -> teal-500 for visual consistency with the rest of the app
  const l = 18 + t * 40 // lightness
  const s = 10 + t * 55
  const hue = 165
  return `hsl(${hue}, ${s}%, ${l}%)`
}

export default function IndiaChoropleth({ data }) {
  const [hovered, setHovered] = useState(null)

  const { byId, unmapped, maxFrequency } = useMemo(() => {
    const map = {}
    const missing = []
    let max = 0
    for (const d of data || []) {
      const id = NAME_TO_ID[d.state?.trim().toLowerCase()]
      if (id) {
        map[id] = d
        if (d.frequency > max) max = d.frequency
      } else {
        missing.push(d.state)
      }
    }
    return { byId: map, unmapped: missing, maxFrequency: max }
  }, [data])

  if (!data || data.length === 0) {
    return <p className="text-sm text-zinc-400 italic">No Indian population data available for this variant.</p>
  }

  return (
    <div>
      <div className="relative bg-zinc-950 rounded-2xl overflow-hidden border border-zinc-800 p-3" style={{ height: 280 }}>
        <svg viewBox={india.viewBox} className="w-full h-full" style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))' }}>
          {india.locations.map((loc) => {
            const entry = byId[loc.id]
            return (
              <path
                key={loc.id}
                d={loc.path}
                fill={colorFor(entry?.frequency, maxFrequency)}
                stroke="#09090b"
                strokeWidth={0.6}
                onMouseEnter={() => setHovered({ ...loc, entry })}
                onMouseLeave={() => setHovered((h) => (h?.id === loc.id ? null : h))}
                style={{ cursor: entry ? 'pointer' : 'default', transition: 'fill 0.15s' }}
              />
            )
          })}
        </svg>

        {hovered && (
          <div className="absolute top-3 left-3 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl px-3 py-2 shadow-lg text-xs pointer-events-none">
            <p className="font-medium text-zinc-900 dark:text-zinc-100">{hovered.name}</p>
            {hovered.entry ? (
              <>
                <p className="text-teal-500 dark:text-teal-300">
                  Carrier frequency: {(hovered.entry.frequency * 100).toFixed(1)}%
                </p>
                <p className="text-zinc-400 mt-0.5">{hovered.entry.source}</p>
              </>
            ) : (
              <p className="text-zinc-400">No data for this variant</p>
            )}
          </div>
        )}

        <div className="absolute bottom-3 right-3 flex items-center gap-2 text-[10px] text-zinc-400">
          <span>Lower</span>
          <div className="flex h-2 w-16 rounded-full overflow-hidden">
            {[0, 0.25, 0.5, 0.75, 1].map((t) => (
              <div key={t} className="flex-1" style={{ background: colorFor(t * maxFrequency || 0.0001, maxFrequency || 1) }} />
            ))}
          </div>
          <span>Higher</span>
        </div>
      </div>

      {unmapped.length > 0 && (
        <p className="text-xs text-zinc-400 dark:text-zinc-600 mt-2">
          Not shown on map (not a current Indian state/UT boundary): {unmapped.join(', ')}.
        </p>
      )}
    </div>
  )
}
