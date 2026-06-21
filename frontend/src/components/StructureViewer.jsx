import { useEffect, useRef, useState } from 'react'
import { Loader2, RotateCcw } from 'lucide-react'
import axios from 'axios'

const VIEWS = [
  { id: 'mutation', label: 'Mutation site' },
  { id: 'heme', label: 'Heme pocket' },
  { id: 'surface', label: 'Surface' },
  { id: 'cartoon', label: 'Full chain' },
]

export default function StructureViewer({ gene, mutationPosition, mutantAa }) {
  const viewerRef = useRef(null)
  const instanceRef = useRef(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeView, setActiveView] = useState('mutation')
  const [pdbLoaded, setPdbLoaded] = useState(false)

  useEffect(() => {
    if (!gene) return
    let cancelled = false

    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await axios.get(`/api/structure/${gene}`)
        if (cancelled) return

        if (!window.$3Dmol) {
          const script = document.createElement('script')
          script.src = 'https://cdnjs.cloudflare.com/ajax/libs/3Dmol/2.1.0/3Dmol-min.js'
          script.onload = () => renderStructure(res.data)
          document.head.appendChild(script)
        } else {
          renderStructure(res.data)
        }
      } catch {
        if (!cancelled) setError('Structure unavailable — AlphaFold2 API may be offline')
        setLoading(false)
      }
    }

    const renderStructure = (pdbData) => {
      if (!viewerRef.current || cancelled) return
      const $3Dmol = window.$3Dmol
      viewerRef.current.innerHTML = ''
      const viewer = $3Dmol.createViewer(viewerRef.current, {
        backgroundColor: 'transparent',
        antialias: true,
      })
      instanceRef.current = viewer
      viewer.addModel(pdbData, 'pdb')
      applyStyle(viewer, 'mutation')
      viewer.zoomTo()
      viewer.render()
      setPdbLoaded(true)
      setLoading(false)
    }

    load()
    return () => { cancelled = true }
  }, [gene])

  const applyStyle = (viewer, view) => {
    if (!viewer) return
    viewer.setStyle({}, {})

    if (view === 'mutation') {
      viewer.setStyle({}, { cartoon: { color: '#5DCAA5', opacity: 0.7 } })
      if (mutationPosition) {
        viewer.setStyle({ resi: mutationPosition }, { sphere: { color: '#E24B4A', radius: 0.9 } })
        viewer.addLabel(`${mutantAa}${mutationPosition}`, {
          position: { resi: mutationPosition },
          fontSize: 12, fontColor: '#ffffff', backgroundColor: '#E24B4A',
          borderRadius: 4, padding: 2
        })
      }
    } else if (view === 'heme') {
      viewer.setStyle({}, { cartoon: { color: '#9FE1CB', opacity: 0.5 } })
      viewer.setStyle({ resn: 'HEM' }, { stick: { colorscheme: 'orangeCarbon', radius: 0.3 } })
      viewer.setStyle({ resn: 'HEM' }, { sphere: { colorscheme: 'orangeCarbon', radius: 0.4 } })
    } else if (view === 'surface') {
      viewer.setStyle({}, { cartoon: { color: 'spectrum' } })
      viewer.addSurface(window.$3Dmol.SurfaceType.VDW, { opacity: 0.5, colorscheme: 'whiteCarbon' }, {})
    } else {
      viewer.setStyle({}, { cartoon: { color: 'spectrum' } })
    }

    viewer.render()
  }

  const handleView = (viewId) => {
    setActiveView(viewId)
    if (instanceRef.current && pdbLoaded) applyStyle(instanceRef.current, viewId)
  }

  const handleReset = () => {
    if (instanceRef.current) { instanceRef.current.zoomTo(); instanceRef.current.render() }
  }

  return (
    <div>
      <div className="relative bg-zinc-950 rounded-2xl overflow-hidden border border-zinc-800" style={{ height: 240 }}>
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex flex-col items-center gap-2">
              <Loader2 size={20} className="text-teal-300 animate-spin" />
              <span className="text-xs text-zinc-500">Loading AlphaFold2 structure...</span>
            </div>
          </div>
        )}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center p-6">
            <p className="text-xs text-zinc-500 text-center">{error}</p>
          </div>
        )}
        <div ref={viewerRef} className="w-full h-full" style={{ display: loading || error ? 'none' : 'block' }} />
        {pdbLoaded && (
          <button onClick={handleReset}
            className="absolute top-3 right-3 p-1.5 rounded-lg bg-zinc-800/80 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700 transition-colors"
            aria-label="Reset view">
            <RotateCcw size={13} />
          </button>
        )}
        {pdbLoaded && mutationPosition && (
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
            <span className="text-xs text-zinc-400">Mutation site</span>
          </div>
        )}
      </div>

      <div className="flex gap-1.5 mt-3 flex-wrap">
        {VIEWS.map(v => (
          <button key={v.id} onClick={() => handleView(v.id)}
            className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${activeView === v.id
              ? 'bg-teal-300 border-teal-300 text-white'
              : 'border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:border-teal-300 hover:text-teal-400 dark:hover:border-teal-400'}`}>
            {v.label}
          </button>
        ))}
      </div>
    </div>
  )
}
