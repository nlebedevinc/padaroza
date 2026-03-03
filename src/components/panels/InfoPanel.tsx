import { ExternalLink } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Separator } from '@/components/ui/separator'
import { CATEGORY_COLORS } from '@/lib/visa-data'
import type { VisaCategory } from '@/lib/types'
import metaRaw from '../../../data/meta.json'

const meta = metaRaw as {
  lastUpdated: string
  source: string
  passportCount: number
  destinationCount: number
}

const ORDERED_CATEGORIES: VisaCategory[] = [
  'visa-free', 'on-arrival', 'eta', 'e-visa', 'visa-required', 'no-admission',
]

export function InfoPanel() {
  const { t, i18n } = useTranslation()

  const lastUpdated = new Date(meta.lastUpdated).toLocaleDateString(
    i18n.resolvedLanguage === 'ru' ? 'ru-RU' : 'en-US',
    { year: 'numeric', month: 'long', day: 'numeric' }
  )

  return (
    <div className="p-4 space-y-5 text-xs">
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
        {t('info.title')}
      </p>

      {/* Data source */}
      <div className="space-y-1.5">
        <p className="font-medium text-foreground">{t('info.dataSource')}</p>
        <p className="text-muted-foreground leading-relaxed">{meta.source}</p>
        <p className="text-muted-foreground">{t('info.updatedOn', { date: lastUpdated })}</p>
        <p className="text-muted-foreground font-mono">
          {t('info.coverage', { passports: meta.passportCount, destinations: meta.destinationCount })}
        </p>
      </div>

      <Separator />

      {/* Categories */}
      <div className="space-y-3.5">
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
          {t('info.categories')}
        </p>
        {ORDERED_CATEGORIES.map(cat => (
          <div key={cat} className="flex gap-2.5">
            <span
              className="mt-0.5 inline-block h-2.5 w-2.5 rounded-sm shrink-0"
              style={{ backgroundColor: CATEGORY_COLORS[cat] }}
            />
            <div className="space-y-0.5">
              <p className="font-medium text-foreground">{t(`categories.${cat}`)}</p>
              <p className="text-muted-foreground leading-relaxed">{t(`categoryDesc.${cat}`)}</p>
            </div>
          </div>
        ))}
      </div>

      <Separator />

      {/* Links */}
      <div className="space-y-2.5">
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
          {t('info.sources')}
        </p>
        <a
          href="https://www.passportindex.org/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors duration-150"
        >
          <ExternalLink className="h-3 w-3 shrink-0" />
          passportindex.org
        </a>
        <a
          href="https://github.com/ilyankou/passport-index-dataset"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors duration-150"
        >
          <ExternalLink className="h-3 w-3 shrink-0" />
          passport-index-dataset
        </a>
      </div>
    </div>
  )
}
