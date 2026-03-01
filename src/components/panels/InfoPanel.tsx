import { ExternalLink } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { CATEGORY_COLORS, CATEGORY_LABELS } from '@/lib/visa-data'
import type { VisaCategory } from '@/lib/types'
import metaRaw from '../../../data/meta.json'

const meta = metaRaw as {
  lastUpdated: string
  source: string
  passportCount: number
  destinationCount: number
}

const CATEGORY_DESCRIPTIONS: Record<VisaCategory, string> = {
  'visa-free':     'No visa needed — arrive and stay for the indicated duration.',
  'on-arrival':    'Obtain a visa stamp at the port of entry on arrival.',
  'eta':           'Electronic travel authorisation — apply online before departure.',
  'e-visa':        'Electronic visa — apply online in advance from your home country.',
  'visa-required': 'Must obtain a visa from the embassy or consulate before travel.',
  'no-admission':  'Entry not permitted.',
}

const ORDERED_CATEGORIES: VisaCategory[] = [
  'visa-free', 'on-arrival', 'eta', 'e-visa', 'visa-required', 'no-admission',
]

export function InfoPanel() {
  const lastUpdated = new Date(meta.lastUpdated).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="p-4 space-y-5 text-xs">
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
        About
      </p>

      {/* Data source */}
      <div className="space-y-1.5">
        <p className="font-medium text-foreground">Data source</p>
        <p className="text-muted-foreground leading-relaxed">{meta.source}</p>
        <p className="text-muted-foreground">Updated {lastUpdated}</p>
        <p className="text-muted-foreground font-mono">
          {meta.passportCount} passports · {meta.destinationCount} destinations
        </p>
      </div>

      <Separator />

      {/* Categories */}
      <div className="space-y-3.5">
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
          Categories
        </p>
        {ORDERED_CATEGORIES.map(cat => (
          <div key={cat} className="flex gap-2.5">
            <span
              className="mt-0.5 inline-block h-2.5 w-2.5 rounded-sm shrink-0"
              style={{ backgroundColor: CATEGORY_COLORS[cat] }}
            />
            <div className="space-y-0.5">
              <p className="font-medium text-foreground">{CATEGORY_LABELS[cat]}</p>
              <p className="text-muted-foreground leading-relaxed">{CATEGORY_DESCRIPTIONS[cat]}</p>
            </div>
          </div>
        ))}
      </div>

      <Separator />

      {/* Links */}
      <div className="space-y-2.5">
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
          Sources
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
