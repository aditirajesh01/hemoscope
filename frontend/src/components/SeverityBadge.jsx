const CONFIG = {
  severe:  { label: 'Severe',  cls: 'severity-severe' },
  mild:    { label: 'Mild',    cls: 'severity-mild' },
  benign:  { label: 'Benign', cls: 'severity-benign' },
  unknown: { label: 'Unknown', cls: 'severity-unknown' },
}

export default function SeverityBadge({ severity, small = false }) {
  const { label, cls } = CONFIG[severity] ?? CONFIG.unknown
  return (
    <span className={`inline-flex items-center font-medium rounded-full ${cls} ${small ? 'text-xs px-2.5 py-0.5' : 'text-sm px-3.5 py-1'}`}>
      {label}
    </span>
  )
}
