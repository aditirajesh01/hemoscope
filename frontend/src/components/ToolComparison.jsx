import { CheckCircle, XCircle, Minus } from 'lucide-react'

function ResultIcon({ prediction }) {
  const p = prediction?.toLowerCase() ?? ''
  if (p.includes('deleterious') || p.includes('damaging') || p.includes('severe'))
    return <XCircle size={14} className="text-red-500 shrink-0" />
  if (p.includes('tolerated') || p.includes('benign'))
    return <CheckCircle size={14} className="text-teal-400 shrink-0" />
  return <Minus size={14} className="text-amber-500 shrink-0" />
}

export default function ToolComparison({ data }) {
  const rows = [
    {
      tool: 'SIFT',
      score: data.sift_score !== null ? data.sift_score?.toFixed(2) : '—',
      prediction: data.sift_prediction ?? 'N/A',
      note: 'Sequence conservation only',
      ours: false,
    },
    {
      tool: 'PolyPhen-2',
      score: data.polyphen_score !== null ? data.polyphen_score?.toFixed(3) : '—',
      prediction: data.polyphen_prediction ?? 'N/A',
      note: 'Sequence + limited structure',
      ours: false,
    },
    {
      tool: 'HemoScope',
      score: `${Math.round(data.hemoscope_confidence * 100)}%`,
      prediction: data.hemoscope_prediction.charAt(0).toUpperCase() + data.hemoscope_prediction.slice(1),
      note: 'Sequence + AlphaFold2 structure + Indian population',
      ours: true,
    },
  ]

  return (
    <div className="divide-y divide-zinc-100 dark:divide-zinc-800 rounded-xl border border-zinc-100 dark:border-zinc-800 overflow-hidden">
      {rows.map((row) => (
        <div key={row.tool}
          className={`flex items-center justify-between px-4 py-3 ${row.ours ? 'bg-teal-50 dark:bg-teal-950/30' : 'bg-white dark:bg-zinc-900'}`}>
          <div className="flex items-center gap-2.5">
            <ResultIcon prediction={row.prediction} />
            <div>
              <span className={`text-sm font-medium ${row.ours ? 'text-teal-500 dark:text-teal-300' : 'text-zinc-700 dark:text-zinc-300'}`}>
                {row.tool}
              </span>
              <p className="text-xs text-zinc-400 dark:text-zinc-500">{row.note}</p>
            </div>
          </div>
          <div className="text-right shrink-0">
            <div className={`text-sm font-medium font-mono ${row.ours ? 'text-teal-500 dark:text-teal-300' : 'text-zinc-600 dark:text-zinc-400'}`}>
              {row.prediction}
            </div>
            <div className="text-xs text-zinc-400 font-mono">{row.score}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
