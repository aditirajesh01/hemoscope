import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Filter, ArrowRight } from 'lucide-react'
import axios from 'axios'
import SeverityBadge from '../components/SeverityBadge'

const GENES = ['All', 'HBB', 'HBA1', 'HBA2']
const SEVERITIES = ['all', 'severe', 'mild', 'benign']

export default function BrowserPage() {
  const [variants, setVariants] = useState([])
  const [gene, setGene] = useState('All')
  const [severity, setSeverity] = useState('all')
  const navigate = useNavigate()

  useEffect(() => {
    axios.get('/api/variant/')
      .then(res => setVariants(res.data))
      .catch(() => setVariants([]))
  }, [])

  const filtered = variants.filter(v =>
    (gene === 'All' || v.gene === gene) &&
    (severity === 'all' || v.severity === severity)
  )

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 mb-2">
          Variant browser
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          {variants.length} curated hemoglobin variants with Indian population data
        </p>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <div className="flex items-center gap-2">
          <Filter size={13} className="text-zinc-400" />
          <span className="text-xs text-zinc-500">Gene:</span>
          <div className="flex gap-1">
            {GENES.map(g => (
              <button key={g} onClick={() => setGene(g)}
                className={`text-xs px-2.5 py-1 rounded-lg border transition-colors ${gene === g
                  ? 'bg-teal-300 border-teal-300 text-white'
                  : 'border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:border-teal-300'}`}>
                {g}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-500">Severity:</span>
          <div className="flex gap-1">
            {SEVERITIES.map(s => (
              <button key={s} onClick={() => setSeverity(s)}
                className={`text-xs px-2.5 py-1 rounded-lg border capitalize transition-colors ${severity === s
                  ? 'bg-teal-300 border-teal-300 text-white'
                  : 'border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:border-teal-300'}`}>
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="card overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-sm text-zinc-400">No variants match the current filters</div>
        ) : (
          <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {filtered.map(v => (
              <button key={v.variant_id} onClick={() => navigate(`/variant/${v.variant_id}`)}
                className="w-full flex items-center justify-between px-5 py-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors text-left group">
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-sm font-medium font-mono text-zinc-900 dark:text-zinc-100">{v.standard_name}</p>
                    {v.common_name && <p className="text-xs text-zinc-400 mt-0.5">{v.common_name}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-zinc-400">{v.gene}</span>
                  <SeverityBadge severity={v.severity} small />
                  <ArrowRight size={14} className="text-zinc-300 dark:text-zinc-600 group-hover:text-teal-400 transition-colors" />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
