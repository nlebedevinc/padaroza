import { Separator } from '@/components/ui/separator'
import { useApp } from '@/context/AppContext'
import { getCombinedStats, getStats, CATEGORY_COLORS, CATEGORY_LABELS } from '@/lib/visa-data'
import { getCountryName } from '@/lib/countries'
import type { VisaCategory } from '@/lib/types'

const BAR_CATEGORIES: VisaCategory[] = [
  'visa-free', 'on-arrival', 'e-visa', 'visa-required', 'no-admission',
]

function StatRow({
  label,
  flagIso2,
  stats,
}: {
  label: string
  flagIso2?: string
  stats: ReturnType<typeof getStats>
}) {
  // Merge eta into on-arrival for display
  const displayCounts: Record<string, number> = {
    'visa-free': stats['visa-free'],
    'on-arrival': stats['on-arrival'] + stats['eta'],
    'e-visa': stats['e-visa'],
    'visa-required': stats['visa-required'],
    'no-admission': stats['no-admission'],
  }
  const displayTotal = Object.values(displayCounts).reduce((a, b) => a + b, 0) || 1

  return (
    <div className="space-y-2">
      {/* Header */}
      <div className="flex items-center gap-1.5">
        {flagIso2 && (
          <img
            src={`https://flagcdn.com/w20/${flagIso2.toLowerCase()}.png`}
            alt={label}
            width={16}
            height={12}
            className="shrink-0"
          />
        )}
        <span className="text-xs font-medium truncate">{label}</span>
        <span className="ml-auto font-mono text-[10px] text-muted-foreground shrink-0">
          {displayTotal}
        </span>
      </div>

      {/* Stacked bar */}
      <div className="flex h-1.5 w-full overflow-hidden rounded-sm bg-muted">
        {BAR_CATEGORIES.map(cat => {
          const key = cat === 'on-arrival' ? 'on-arrival' : cat
          const count = displayCounts[key] ?? 0
          if (!count) return null
          return (
            <div
              key={cat}
              title={`${CATEGORY_LABELS[cat]}: ${count}`}
              style={{
                width: `${(count / displayTotal) * 100}%`,
                backgroundColor: CATEGORY_COLORS[cat],
              }}
            />
          )
        })}
      </div>

      {/* Numeric breakdown */}
      <div className="flex gap-x-3 gap-y-0.5 flex-wrap">
        {BAR_CATEGORIES.map(cat => {
          const count = displayCounts[cat === 'on-arrival' ? 'on-arrival' : cat] ?? 0
          return (
            <span key={cat} className="flex items-center gap-1 text-[11px] text-muted-foreground">
              <span
                className="inline-block h-1.5 w-1.5 rounded-sm shrink-0"
                style={{ backgroundColor: CATEGORY_COLORS[cat] }}
              />
              <span className="font-mono">{count}</span>
            </span>
          )
        })}
      </div>
    </div>
  )
}

export function StatsPanel() {
  const { passports } = useApp()

  if (passports.length === 0) {
    return (
      <div className="p-4 text-xs text-muted-foreground">
        Add a passport in the Identity panel to see statistics.
      </div>
    )
  }

  const { perPassport, combined } = getCombinedStats(passports)

  return (
    <div className="p-4 space-y-5">
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
        Statistics
      </p>

      {passports.map(iso2 => (
        <StatRow
          key={iso2}
          label={getCountryName(iso2)}
          flagIso2={iso2}
          stats={perPassport[iso2]}
        />
      ))}

      {passports.length > 1 && (
        <>
          <Separator />
          <div className="space-y-1">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70">
              Combined · best access
            </p>
            <StatRow label="All passports" stats={combined} />
          </div>
        </>
      )}
    </div>
  )
}
