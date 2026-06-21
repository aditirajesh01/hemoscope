import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Loader2, AlertCircle } from 'lucide-react'
import axios from 'axios'
import SeverityBadge from './SeverityBadge'

export default function SearchBar({ large = false }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  const wrapRef = useRef(null)

  useEffect(() => {
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  useEffect(() => {
    if (!query.trim()) { setResults([]); setOpen(false); return }
    const timer = setTimeout(async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await axios.get(`/api/search/?q=${encodeURIComponent(query)}`)
        setResults(res.data)
        setOpen(true)
      } catch {
        setError('Search unavailable')
        setResults([])
      } finally {
        setLoading(false)
      }
    }, 220)
    return () => clearTimeout(timer)
  }, [query])

  const handleSelect = (variantId) => {
    setOpen(false)
    setQuery('')
    navigate(`/variant/${variantId}`)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (results.length > 0) handleSelect(results[0].variant_id)
  }

  return (
    <div ref={wrapRef} className={`relative w-full ${large ? 'max-w-2xl' : 'max-w-md'}`}>
      <form onSubmit={handleSubmit}>
        <div className={`flex items-center gap-2 border rounded-2xl bg-white dark:bg-zinc-900 transition-all
          ${open ? 'border-teal-300 dark:border-teal-400 ring-4 ring-teal-300/10' : 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600'}
          ${large ? 'px-5 py-3.5' : 'px-4 py-2.5'}`}>
          {loading
            ? <Loader2 size={large ? 18 : 15} className="text-teal-300 animate-spin shrink-0" />
            : <Search size={large ? 18 : 15} className="text-zinc-400 shrink-0" />}
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query && results.length > 0 && setOpen(true)}
            placeholder={large ? 'Search by variant name, gene, or common name...' : 'Search variants...'}
            className={`flex-1 bg-transparent outline-none text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 ${large ? 'text-base' : 'text-sm'}`}
          />
          {query && (
            <button type="button" onClick={() => { setQuery(''); setOpen(false) }}
              className="text-zinc-300 hover:text-zinc-500 dark:text-zinc-600 dark:hover:text-zinc-400 text-lg leading-none">×</button>
          )}
        </div>
      </form>

      {open && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl shadow-xl shadow-zinc-100/50 dark:shadow-black/30 overflow-hidden z-50 animate-fade-in">
          {error && (
            <div className="flex items-center gap-2 px-4 py-3 text-sm text-red-500">
              <AlertCircle size={14} /> {error}
            </div>
          )}
          {results.length === 0 && !error && (
            <div className="px-4 py-3 text-sm text-zinc-400">No variants found</div>
          )}
          {results.map((r) => (
            <button
              key={r.variant_id}
              onClick={() => handleSelect(r.variant_id)}
              className="w-full flex items-center justify-between px-4 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors text-left border-b border-zinc-50 dark:border-zinc-800/50 last:border-0"
            >
              <div>
                <div className="text-sm font-medium font-mono text-zinc-900 dark:text-zinc-100">{r.standard_name}</div>
                {r.common_name && <div className="text-xs text-zinc-400 mt-0.5">{r.common_name}</div>}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs text-zinc-400 font-mono">{r.gene}</span>
                <SeverityBadge severity={r.severity} small />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
