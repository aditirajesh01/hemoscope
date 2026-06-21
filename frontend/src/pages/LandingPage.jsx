import { useNavigate } from 'react-router-dom'
import { ArrowRight, Dna, FlaskConical, Globe } from 'lucide-react'
import SearchBar from '../components/SearchBar'

const QUICK_VARIANTS = [
  { id: 'HBB-Glu6Val', label: 'HBB:p.Glu6Val', sub: 'Sickle cell disease', severity: 'severe' },
  { id: 'HBB-Glu26Lys', label: 'HBB:p.Glu26Lys', sub: 'Hemoglobin E', severity: 'mild' },
  { id: 'HBB-Lys17Asn', label: 'HBB:p.Lys17Asn', sub: 'Benign surface variant', severity: 'benign' },
  { id: 'HBA1-Asp74His', label: 'HBA1:p.Asp74His', sub: 'Hb Q-India', severity: 'mild' },
]

const SEVERITY_DOT = { severe: 'bg-red-400', mild: 'bg-amber-400', benign: 'bg-teal-300' }

const FEATURES = [
  {
    icon: <Dna size={18} className="text-teal-300" />,
    title: 'Structure-informed',
    desc: 'AlphaFold2 3D structures reveal why a mutation is pathogenic beyond what sequence alone can tell you.'
  },
  {
    icon: <Globe size={18} className="text-teal-300" />,
    title: 'India-specific',
    desc: 'Population frequencies from Indian cohort studies, ICMR registries, and HbVar — not European databases.'
  },
  {
    icon: <FlaskConical size={18} className="text-teal-300" />,
    title: 'Clinically usable',
    desc: 'Plain-language summaries and downloadable reports designed for genetic counselors, not just bioinformaticians.'
  },
]

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col">
      <section className="relative overflow-hidden border-b border-zinc-100 dark:border-zinc-800">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="absolute rounded-full border border-teal-300/10 dark:border-teal-400/5 animate-pulse-slow"
              style={{
                width: `${220 + i * 100}px`, height: `${220 + i * 100}px`,
                top: '50%', left: '50%',
                transform: `translate(-50%, -50%)`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${4 + i}s`
              }} />
          ))}
        </div>

        <div className="relative max-w-3xl mx-auto px-6 py-20 text-center">
          <div className="inline-flex items-center gap-2 text-xs font-medium text-teal-500 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/50 border border-teal-100 dark:border-teal-900 px-3.5 py-1.5 rounded-full mb-8">
            <Dna size={12} />
            Built for India's hemoglobinopathy screening programs
          </div>

          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 leading-[1.1] mb-5">
            Interpret hemoglobin
            <br />
            <span className="text-teal-300">variants with precision</span>
          </h1>

          <p className="text-lg text-zinc-500 dark:text-zinc-400 max-w-lg mx-auto mb-10 leading-relaxed">
            Structure-informed severity classification for Indian globin gene variants.
            Powered by AlphaFold2, HbVar, and Indian population data.
          </p>

          <div className="flex justify-center mb-8">
            <SearchBar large />
          </div>

          <div className="flex flex-wrap gap-2 justify-center">
            <span className="text-xs text-zinc-400 self-center mr-1">Try:</span>
            {QUICK_VARIANTS.map(v => (
              <button key={v.id} onClick={() => navigate(`/variant/${v.id}`)}
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:border-teal-300 hover:text-teal-500 dark:hover:border-teal-400 dark:hover:text-teal-300 transition-colors bg-white dark:bg-zinc-900">
                <div className={`w-1.5 h-1.5 rounded-full ${SEVERITY_DOT[v.severity]}`} />
                <span className="font-mono">{v.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-16 w-full">
        <div className="grid sm:grid-cols-3 gap-6">
          {FEATURES.map((f, i) => (
            <div key={i} className="card p-6">
              <div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-950/50 flex items-center justify-center mb-4">
                {f.icon}
              </div>
              <h3 className="font-medium text-zinc-900 dark:text-zinc-100 mb-2">{f.title}</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 card p-6 flex items-center justify-between gap-6 flex-wrap">
          <div>
            <h3 className="font-medium text-zinc-900 dark:text-zinc-100 mb-1">Browse all variants</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Explore the full database filtered by gene, severity, or Indian state</p>
          </div>
          <button onClick={() => navigate('/browse')}
            className="flex items-center gap-2 text-sm font-medium text-teal-500 dark:text-teal-300 hover:gap-3 transition-all shrink-0">
            Open browser <ArrowRight size={15} />
          </button>
        </div>
      </section>
    </div>
  )
}
