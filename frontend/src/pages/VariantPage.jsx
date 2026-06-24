import { useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Download, Share2, AlertCircle, Loader2, Info } from 'lucide-react'
import { useVariant } from '../hooks/useVariant'
import SeverityBadge from '../components/SeverityBadge'
import StructureViewer from '../components/StructureViewer'
import PopulationChart from '../components/PopulationChart'
import IndiaChoropleth from '../components/IndiaChoropleth'
import ToolComparison from '../components/ToolComparison'
import ConfidenceBreakdown from '../components/ConfidenceBreakdown'

function StatCard({ label, value, sub, highlight }) {
  return (
    <div className={`stat-card ${highlight ? 'border-teal-200 dark:border-teal-800 bg-teal-50/50 dark:bg-teal-950/20' : ''}`}>
      <p className="section-label mb-1">{label}</p>
      <p className={`text-xl font-semibold font-mono ${highlight ? 'text-teal-500 dark:text-teal-300' : 'text-zinc-900 dark:text-zinc-100'}`}>
        {value}
      </p>
      {sub && <p className="text-xs text-zinc-400 mt-0.5">{sub}</p>}
    </div>
  )
}

export default function VariantPage() {
  const { variantId } = useParams()
  const { data, loading, error } = useVariant(variantId)
  const reportRef = useRef(null)

  const handleDownload = () => {
    window.print()
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh] gap-3 text-zinc-400">
      <Loader2 size={20} className="animate-spin text-teal-300" />
      <span className="text-sm">Loading variant report...</span>
    </div>
  )

  if (error) return (
    <div className="max-w-lg mx-auto px-6 py-24 text-center">
      <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-950/30 flex items-center justify-center mx-auto mb-4">
        <AlertCircle size={20} className="text-red-500" />
      </div>
      <h2 className="font-medium text-zinc-900 dark:text-zinc-100 mb-2">Variant not found</h2>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">{error}</p>
      <Link to="/" className="text-sm text-teal-500 hover:underline">Back to search</Link>
    </div>
  )

  const d = data
  const sf = d.sequence_features
  const stf = d.structural_features

  return (
    <>
      <style>{`
        @media print {
          nav { display: none !important; }
          body { background: white !important; }
          .card {
            border: 1px solid #e4e4e7 !important;
            box-shadow: none !important;
            break-inside: avoid;
          }
          .stat-card { break-inside: avoid; }
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `}</style>

      <div ref={reportRef} className="max-w-7xl mx-auto px-6 py-8 animate-fade-in">

        <div className="flex items-center gap-2 mb-6">
          <Link to="/" className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors">
            <ArrowLeft size={14} /> Search
          </Link>
          <span className="text-zinc-300 dark:text-zinc-700">/</span>
          <span className="text-sm text-zinc-500 font-mono">{d.gene}</span>
          <span className="text-zinc-300 dark:text-zinc-700">/</span>
          <span className="text-sm text-zinc-700 dark:text-zinc-300 font-mono">{d.standard_name}</span>
        </div>

        <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-semibold tracking-tight font-mono text-zinc-900 dark:text-zinc-50">
                {d.standard_name}
              </h1>
              <SeverityBadge severity={d.severity} />
            </div>
            {d.common_name && (
              <p className="text-zinc-500 dark:text-zinc-400 mt-1">{d.common_name}</p>
            )}
            <p className="text-sm text-zinc-400 mt-1">
              Gene <span className="font-mono text-zinc-600 dark:text-zinc-300">{d.gene}</span>
              {' · '}Position <span className="font-mono text-zinc-600 dark:text-zinc-300">{d.position}</span>
              {' · '}{d.wildtype_aa} to {d.mutant_aa}
              {' · '}UniProt <span className="font-mono text-zinc-600 dark:text-zinc-300">{d.uniprot_id}</span>
            </p>
          </div>

          <div className="flex gap-2 shrink-0">
            <button
              onClick={() => navigator.clipboard?.writeText(window.location.href)}
              className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:border-teal-300 hover:text-teal-500 transition-colors"
            >
              <Share2 size={13} /> Share
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl bg-teal-300 text-white hover:bg-teal-400 transition-colors font-medium"
            >
              <Download size={13} /> Download report
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          <StatCard label="HemoScope confidence" value={`${Math.round(d.confidence * 100)}%`} highlight />
          <StatCard label="BLOSUM62 score" value={sf.blosum62_score >= 0 ? `+${sf.blosum62_score}` : sf.blosum62_score} sub="Substitution cost" />
          <StatCard label="RMSD vs wildtype" value={`${stf.rmsd_angstrom}A`} sub="Structural deviation" />
          <StatCard label="Heme distance" value={`${stf.heme_distance_angstrom}A`} sub={stf.residue_exposure} />
        </div>

        <div className="grid lg:grid-cols-2 gap-6">

          <div className="space-y-6">
            <div className="card p-6">
              <p className="section-label">Prediction confidence</p>
              <ConfidenceBreakdown data={d} />
            </div>

            <div className="card p-6">
              <p className="section-label">Tool comparison</p>
              <ToolComparison data={d.tool_comparison} />
              <div className="flex items-start gap-2 mt-4 p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl">
                <Info size={13} className="text-zinc-400 shrink-0 mt-0.5" />
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  HemoScope integrates AlphaFold2 structural features and Indian population data alongside
                  sequence scores — providing context that sequence-only tools like SIFT and PolyPhen-2 cannot.
                </p>
              </div>
            </div>

            <div className="card p-6">
              <p className="section-label">Plain language summary</p>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed border-l-2 border-teal-300 pl-4">
                {d.plain_language_summary}
              </p>
              {d.clinical_notes && (
                <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                  <p className="section-label">Clinical notes</p>
                  <p className="text-sm text-zinc-500 leading-relaxed">{d.clinical_notes}</p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="card p-6">
              <p className="section-label">AlphaFold2 structure</p>
              <StructureViewer
                gene={d.gene}
                mutationPosition={d.position}
                mutantAa={d.mutant_aa}
              />
              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="stat-card">
                  <p className="section-label mb-1">Residue exposure</p>
                  <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200 capitalize">{stf.residue_exposure}</p>
                </div>
                <div className="stat-card">
                  <p className="section-label mb-1">Interface residue</p>
                  <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                    {stf.is_interface_residue ? 'Yes — alpha/beta interface' : 'No'}
                  </p>
                </div>
                <div className="stat-card">
                  <p className="section-label mb-1">AF2 confidence</p>
                  <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">{stf.af2_confidence} pLDDT</p>
                </div>
                <div className="stat-card">
                  <p className="section-label mb-1">Contact map delta</p>
                  <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">{stf.contact_map_delta} contacts</p>
                </div>
              </div>
            </div>

            <div className="card p-6">
              <p className="section-label">Indian population frequency</p>
              <IndiaChoropleth data={d.population_data} />
              <div className="mt-5 pt-5 border-t border-zinc-100 dark:border-zinc-800">
                <PopulationChart data={d.population_data} />
              </div>
            </div>
          </div>

        </div>

        <div className="mt-6 card p-5 flex items-start gap-2 bg-zinc-50 dark:bg-zinc-900/50">
          <AlertCircle size={14} className="text-zinc-400 shrink-0 mt-0.5" />
          <p className="text-xs text-zinc-400 leading-relaxed">
            HemoScope is a research and educational tool. All predictions should be interpreted in clinical
            context by a qualified genetic counselor or physician. Not a substitute for laboratory diagnosis
            or clinical genetic testing.
          </p>
        </div>

      </div>
    </>
  )
}