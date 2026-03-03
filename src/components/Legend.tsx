import { useTranslation } from 'react-i18next'
import { useApp } from '@/context/AppContext'
import { CATEGORY_COLORS } from '@/lib/visa-data'
import type { VisaCategory } from '@/lib/types'

const LEGEND_ITEMS: VisaCategory[] = [
  'visa-free',
  'on-arrival',
  'e-visa',
  'visa-required',
  'no-admission',
]

export function Legend() {
  const { selectedCountry } = useApp()
  const { t } = useTranslation()
  const panelOpen = !!selectedCountry

  return (
    <div
      className={`absolute bottom-12 z-10 rounded-md border border-border bg-background/80 backdrop-blur-sm px-3 py-2 space-y-1
        transition-all duration-200 ease-in-out
        ${panelOpen ? 'right-[336px]' : 'right-4'}`}
    >
      {LEGEND_ITEMS.map(cat => (
        <div key={cat} className="flex items-center gap-2">
          <span
            className="inline-block h-2.5 w-2.5 rounded-sm shrink-0"
            style={{ backgroundColor: CATEGORY_COLORS[cat] }}
          />
          <span className="text-xs text-foreground">{t(`categories.${cat}`)}</span>
        </div>
      ))}
      <div className="flex items-center gap-2">
        <span className="inline-block h-2.5 w-2.5 rounded-sm shrink-0 bg-zinc-400 dark:bg-zinc-700" />
        <span className="text-xs text-muted-foreground">{t('legend.noData')}</span>
      </div>
    </div>
  )
}
