import { useState } from 'react'
import { X, ChevronsUpDown, AlertCircle, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
import { useApp } from '@/context/AppContext'
import { getAllCountries, getCountryName } from '@/lib/countries'
import { getPassportList } from '@/lib/visa-data'

const passportSet = new Set(getPassportList())
const PASSPORT_COUNTRIES = getAllCountries().filter(c => passportSet.has(c.iso2))
const ALL_COUNTRIES = getAllCountries()

function CountryChip({
  iso2,
  onRemove,
}: {
  iso2: string
  onRemove: () => void
}) {
  const name = getCountryName(iso2)
  return (
    <span className="inline-flex items-center gap-1.5 pl-1.5 pr-1 py-0.5 rounded-md bg-muted text-xs">
      <img
        src={`https://flagcdn.com/w20/${iso2.toLowerCase()}.png`}
        alt={name}
        width={14}
        height={10}
        className="shrink-0"
      />
      <span className="max-w-[110px] truncate">{name}</span>
      <button
        onClick={onRemove}
        className="ml-0.5 text-muted-foreground hover:text-foreground transition-colors rounded"
        aria-label={`Remove ${name}`}
      >
        <X className="h-3 w-3" />
      </button>
    </span>
  )
}

function CountryCombobox({
  countries,
  selected,
  onSelect,
  placeholder,
  disabled,
}: {
  countries: typeof ALL_COUNTRIES
  selected: string[]
  onSelect: (iso2: string) => void
  placeholder: string
  disabled?: boolean
}) {
  const [open, setOpen] = useState(false)
  const available = countries.filter(c => !selected.includes(c.iso2))

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          disabled={disabled}
          className="h-7 text-xs gap-1 font-normal border-dashed"
        >
          <Plus className="h-3 w-3" />
          {placeholder}
          <ChevronsUpDown className="h-3 w-3 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0" align="start">
        <Command>
          <CommandInput placeholder="Search…" className="h-8 text-xs" />
          <CommandList>
            <CommandEmpty>Not found.</CommandEmpty>
            <CommandGroup>
              {available.map(country => (
                <CommandItem
                  key={country.iso2}
                  value={`${country.name} ${country.iso2}`}
                  onSelect={() => {
                    onSelect(country.iso2)
                    setOpen(false)
                  }}
                  className="text-xs cursor-pointer"
                >
                  <img
                    src={`https://flagcdn.com/w20/${country.iso2.toLowerCase()}.png`}
                    alt={country.name}
                    width={14}
                    height={10}
                    className="shrink-0"
                  />
                  {country.name}
                  <span className="ml-auto font-mono text-[10px] text-muted-foreground">
                    {country.iso2}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export function IdentityPanel() {
  const { passports, setPassports, residencies, setResidencies } = useApp()

  const addPassport = (iso2: string) => setPassports([...passports, iso2])
  const removePassport = (iso2: string) => setPassports(passports.filter(p => p !== iso2))

  const addResidency = (iso2: string) => setResidencies([...residencies, iso2])
  const removeResidency = (iso2: string) => setResidencies(residencies.filter(r => r !== iso2))

  return (
    <div className="p-4 space-y-5">
      {/* Passports */}
      <div className="space-y-3">
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
          Passports
          <span className="ml-1 text-muted-foreground/60">({passports.length}/3)</span>
        </p>

        {passports.length === 0 && (
          <p className="text-xs text-muted-foreground">
            Add up to 3 passports — the map shows your best access across all of them.
          </p>
        )}

        {passports.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {passports.map(iso2 => (
              <CountryChip key={iso2} iso2={iso2} onRemove={() => removePassport(iso2)} />
            ))}
          </div>
        )}

        <CountryCombobox
          countries={PASSPORT_COUNTRIES}
          selected={passports}
          onSelect={addPassport}
          placeholder="Add passport"
          disabled={passports.length >= 3}
        />
      </div>

      <Separator />

      {/* Residencies */}
      <div className="space-y-3">
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
          Residency
        </p>

        {residencies.length === 0 && (
          <p className="text-xs text-muted-foreground">
            Countries where you hold a residence permit.
          </p>
        )}

        {residencies.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {residencies.map(iso2 => (
              <CountryChip key={iso2} iso2={iso2} onRemove={() => removeResidency(iso2)} />
            ))}
          </div>
        )}

        <CountryCombobox
          countries={ALL_COUNTRIES}
          selected={residencies}
          onSelect={addResidency}
          placeholder="Add residency"
        />

        <div className={cn('flex gap-1.5 text-xs text-muted-foreground', residencies.length > 0 ? 'mt-2' : '')}>
          <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
          <span>
            Residency-based travel rights are not reflected on the map — no comprehensive open dataset covers this yet.
          </span>
        </div>
      </div>
    </div>
  )
}
