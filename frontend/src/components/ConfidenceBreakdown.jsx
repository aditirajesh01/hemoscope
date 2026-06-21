const SIGNALS = [
  { key: 'conservation', label: 'Evolutionary conservation', desc: 'How conserved this position is across species' },
  { key: 'structural', label: 'Structural disruption', desc: 'RMSD and contact map change vs wildtype' },
  { key: 'heme', label: 'Heme pocket proximity', desc: 'Distance from oxygen-binding iron center' },
  { key: 'sequence', label: 'Sequence features', desc: 'BLOSUM62 and PSSM scores' },
]

function deriveSignals(data) {
  const { sequence_features: sf, structural_features: stf, confidence } = data
  return {
    conservation: Math.min(sf.conservation_score, 1),
    structural: Math.min(stf.contact_map_delta / 5, 1),
    heme: Math.max(0, 1 - stf.heme_distance_angstrom / 40),
    sequence: Math.min(Math.abs(sf.blosum62_score) / 4, 1) * 0.8 + confidence * 0.2,
  }
}

export default function ConfidenceBreakdown({ data }) {
  const signals = deriveSignals(data)

  return (
    <div className="space-y-3">
      {SIGNALS.map(({ key, label, desc }) => {
        const val = signals[key]
        const pct = Math.round(val * 100)
        return (
          <div key={key}>
            <div className="flex items-center justify-between mb-1">
              <div>
                <span className="text-sm text-zinc-700 dark:text-zinc-300">{label}</span>
                <span className="text-xs text-zinc-400 dark:text-zinc-500 ml-2 hidden sm:inline">{desc}</span>
              </div>
              <span className="text-sm font-medium font-mono text-zinc-600 dark:text-zinc-400">{pct}%</span>
            </div>
            <div className="h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700 ease-out"
                style={{
                  width: `${pct}%`,
                  background: `hsl(${160 - pct * 0.6}, 60%, ${pct > 70 ? 35 : 50}%)`
                }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}
