import { X, ExternalLink } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useApp } from '@/context/AppContext'
import { getBestRequirement, CATEGORY_COLORS, CATEGORY_LABELS } from '@/lib/visa-data'
import { getCountryName } from '@/lib/countries'

export function CountrySheet() {
  const { selectedCountry, setSelectedCountry, passports } = useApp()

  const open = !!selectedCountry
  const isOwnCountry = passports.includes(selectedCountry ?? '')
  const bestResult =
    passports.length > 0 && selectedCountry && !isOwnCountry
      ? getBestRequirement(passports, selectedCountry)
      : null

  const req = bestResult?.req ?? null
  const bestPassport = bestResult?.passport ?? null

  const countryName = selectedCountry ? getCountryName(selectedCountry) : ''
  const flagCode = selectedCountry?.toLowerCase() ?? ''

  return (
    <div
      className={`absolute right-0 top-12 bottom-10 z-20 w-80 border-l border-border bg-background overflow-y-auto
        transition-transform duration-200 ease-in-out
        ${open ? 'translate-x-0' : 'translate-x-full'}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-border">
        <div className="flex items-center gap-3">
          {selectedCountry && (
            <img
              src={`https://flagcdn.com/w40/${flagCode}.png`}
              alt={countryName}
              width={28}
              height={20}
              className="shrink-0"
            />
          )}
          <span className="font-semibold text-base">{countryName}</span>
        </div>
        <button
          onClick={() => setSelectedCountry(null)}
          className="text-muted-foreground hover:text-foreground transition-colors rounded-md p-1"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Content */}
      <div className="px-4 py-5 space-y-4">
        {isOwnCountry ? (
          <p className="text-sm text-muted-foreground">
            {passports.length > 1
              ? 'This is one of your home countries.'
              : 'This is your home country.'}
          </p>
        ) : req ? (
          <>
            <div className="space-y-1.5">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Access</p>
              <Badge
                className="text-sm font-medium text-white border-0"
                style={{ backgroundColor: CATEGORY_COLORS[req.category] }}
              >
                {CATEGORY_LABELS[req.category]}
              </Badge>

              {passports.length > 1 && bestPassport && (
                <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  Best via
                  <img
                    src={`https://flagcdn.com/w20/${bestPassport.toLowerCase()}.png`}
                    alt={getCountryName(bestPassport)}
                    width={14}
                    height={10}
                    className="inline shrink-0"
                  />
                  {getCountryName(bestPassport)}
                </p>
              )}
            </div>

            {req.days && (
              <>
                <Separator />
                <div className="grid grid-cols-2 gap-y-2 text-sm">
                  <span className="text-muted-foreground">Duration</span>
                  <span className="font-mono text-right">{req.days} days</span>
                </div>
              </>
            )}

            <Separator />

            <a
              href="https://www.passportindex.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <ExternalLink className="h-3 w-3" />
              passportindex.org
            </a>
          </>
        ) : passports.length > 0 ? (
          <p className="text-sm text-muted-foreground">No visa data available for this destination.</p>
        ) : (
          <p className="text-sm text-muted-foreground">
            Add a passport in the Identity panel to see visa requirements.
          </p>
        )}
      </div>
    </div>
  )
}
