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
import { getRequirement, CATEGORY_COLORS, CATEGORY_LABELS } from '@/lib/visa-data'
import { getCountryName } from '@/lib/countries'

export function CountrySheet() {
  const { selectedCountry, setSelectedCountry, passport } = useApp()

  const open = !!selectedCountry
  const req = passport && selectedCountry
    ? getRequirement(passport, selectedCountry)
    : null

  const countryName = selectedCountry ? getCountryName(selectedCountry) : ''
  const flagCode = selectedCountry?.toLowerCase() ?? ''

  const isOwnCountry = passport === selectedCountry

  return (
    <Sheet open={open} onOpenChange={v => !v && setSelectedCountry(null)}>
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
            <p className="text-sm text-muted-foreground">This is your home country.</p>
          ) : req ? (
            <>
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Access</p>
                <Badge
                  className="text-sm font-medium text-white border-0"
                  style={{ backgroundColor: CATEGORY_COLORS[req.category] }}
                >
                  {CATEGORY_LABELS[req.category]}
                </Badge>
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
                href={`https://www.passportindex.org/`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <ExternalLink className="h-3 w-3" />
                passportindex.org
              </a>
            </>
          ) : passport ? (
            <p className="text-sm text-muted-foreground">No visa data available for this destination.</p>
          ) : (
            <p className="text-sm text-muted-foreground">Select your passport to see visa requirements.</p>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
