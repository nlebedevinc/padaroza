import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ExternalLink } from 'lucide-react'
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
    <Sheet open={open} onOpenChange={(v: boolean) => !v && setSelectedCountry(null)}>
      <SheetContent
        side="right"
        className="w-80 sm:w-96 border-l border-border bg-background p-0"
      >
        <SheetHeader className="px-6 py-4 border-b border-border">
          <SheetTitle className="flex items-center gap-3 font-semibold text-base">
            {selectedCountry && (
              <img
                src={`https://flagcdn.com/w40/${flagCode}.png`}
                alt={countryName}
                width={28}
                height={20}
                className="shrink-0"
              />
            )}
            {countryName}
          </SheetTitle>
        </SheetHeader>

        <div className="px-6 py-5 space-y-4">
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
      </SheetContent>
    </Sheet>
  )
}
