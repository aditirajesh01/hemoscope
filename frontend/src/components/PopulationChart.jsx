import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl p-3 shadow-lg text-xs">
      <p className="font-medium text-zinc-900 dark:text-zinc-100 mb-1">{label}</p>
      <p className="text-teal-400">Carrier frequency: {(payload[0].value * 100).toFixed(1)}%</p>
      <p className="text-zinc-400 mt-0.5">{payload[0].payload.source}</p>
    </div>
  )
}

export default function PopulationChart({ data }) {
  if (!data || data.length === 0) {
    return <p className="text-sm text-zinc-400 italic">No Indian population data available for this variant.</p>
  }

  const chartData = data.map(d => ({ ...d, pct: parseFloat((d.frequency * 100).toFixed(1)) }))

  return (
    <div>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={chartData} layout="vertical" margin={{ left: 8, right: 24, top: 4, bottom: 4 }}>
          <XAxis type="number" domain={[0, 'auto']} tickFormatter={v => `${v}%`}
            tick={{ fontSize: 11, fill: '#a1a1aa' }} axisLine={false} tickLine={false} />
          <YAxis type="category" dataKey="state" width={110}
            tick={{ fontSize: 12, fill: '#71717a' }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(29,158,117,0.05)' }} />
          <Bar dataKey="pct" radius={[0, 6, 6, 0]} maxBarSize={16}>
            {chartData.map((_, i) => (
              <Cell key={i} fill={`hsl(${160 - i * 12}, ${65 - i * 5}%, ${42 - i * 3}%)`} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <p className="text-xs text-zinc-400 dark:text-zinc-600 mt-2">
        Sources: HbVar, ICMR national registries, published Indian cohort studies
      </p>
    </div>
  )
}
