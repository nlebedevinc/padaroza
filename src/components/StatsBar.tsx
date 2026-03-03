import { useTranslation } from 'react-i18next'
import { useApp } from '@/context/AppContext'
import { getCombinedStats, CATEGORY_COLORS } from '@/lib/visa-data'

export function StatsBar() {
  const { passports } = useApp()
  const { t } = useTranslation()

  if (passports.length === 0) {
    return (
      <div className="absolute bottom-0 left-0 right-0 z-10 h-10 border-t border-border bg-background/80 backdrop-blur-sm flex items-center justify-center">
        <span className="text-xs text-muted-foreground">{t('statsBar.selectPassport')}</span>
      </div>
    )
  }

  const { combined: stats } = getCombinedStats(passports)

  const items = [
    { label: t('statsBar.visaFree'),    count: stats['visa-free'],                 color: CATEGORY_COLORS['visa-free']    },
    { label: t('statsBar.onArrival'),   count: stats['on-arrival'] + stats['eta'], color: CATEGORY_COLORS['on-arrival']   },
    { label: t('statsBar.eVisa'),       count: stats['e-visa'],                    color: CATEGORY_COLORS['e-visa']       },
    { label: t('statsBar.visaRequired'), count: stats['visa-required'],            color: CATEGORY_COLORS['visa-required'] },
    { label: t('statsBar.noEntry'),     count: stats['no-admission'],              color: CATEGORY_COLORS['no-admission'] },
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
