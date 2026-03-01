import { useApp } from '@/context/AppContext'
import { getStats, CATEGORY_COLORS } from '@/lib/visa-data'

export function StatsBar() {
  const { passport } = useApp()

  if (!passport) {
    return (
      <div className="absolute bottom-0 left-0 right-0 z-10 h-10 border-t border-border bg-background/80 backdrop-blur-sm flex items-center justify-center">
        <span className="text-xs text-muted-foreground">Select a passport to see access statistics</span>
      </div>
    )
  }

  const stats = getStats(passport)

  const items = [
    { label: 'Visa-free', count: stats['visa-free'], color: CATEGORY_COLORS['visa-free'] },
    { label: 'On arrival', count: stats['on-arrival'] + stats['eta'], color: CATEGORY_COLORS['on-arrival'] },
    { label: 'E-visa', count: stats['e-visa'], color: CATEGORY_COLORS['e-visa'] },
    { label: 'Visa req.', count: stats['visa-required'], color: CATEGORY_COLORS['visa-required'] },
    { label: 'No entry', count: stats['no-admission'], color: CATEGORY_COLORS['no-admission'] },
  ]

  return (
    <div className="absolute bottom-0 left-0 right-0 z-10 h-10 border-t border-border bg-background/80 backdrop-blur-sm flex items-center justify-center gap-4 px-4">
      {items.map(({ label, count, color }) => (
        <div key={label} className="flex items-center gap-1.5">
          <span className="inline-block h-2 w-2 rounded-sm" style={{ backgroundColor: color }} />
          <span className="font-mono text-xs font-medium">{count}</span>
          <span className="text-xs text-muted-foreground hidden sm:inline">{label}</span>
        </div>
      ))}
      <span className="text-xs text-muted-foreground ml-2">/ {stats.total}</span>
    </div>
  )
}
