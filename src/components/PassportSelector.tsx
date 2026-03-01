import { useState } from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'
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
import { useApp } from '@/context/AppContext'
import { getAllCountries } from '@/lib/countries'
import { getPassportList } from '@/lib/visa-data'

// Only show countries that have passport data
const passportSet = new Set(getPassportList())
const PASSPORT_COUNTRIES = getAllCountries().filter(c => passportSet.has(c.iso2))

export function PassportSelector() {
  const { passport, setPassport } = useApp()
  const [open, setOpen] = useState(false)

  const selected = PASSPORT_COUNTRIES.find(c => c.iso2 === passport)

  return (
    <div className="absolute top-[52px] left-4 z-20 w-72">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between bg-background/80 backdrop-blur-sm border-border text-sm h-9 font-normal"
          >
            {selected ? (
              <span className="flex items-center gap-2 truncate">
                <img
                  src={`https://flagcdn.com/w20/${selected.iso2.toLowerCase()}.png`}
                  alt={selected.name}
                  width={20}
                  height={14}
                  className="shrink-0"
                />
                {selected.name}
              </span>
            ) : (
              <span className="text-muted-foreground">Select your passport…</span>
            )}
            <ChevronsUpDown className="ml-2 h-3.5 w-3.5 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-72 p-0 bg-background/95 backdrop-blur-sm border-border" align="start">
          <Command>
            <CommandInput placeholder="Search country or ISO code…" className="h-8 text-sm" />
            <CommandList>
              <CommandEmpty>No passport found.</CommandEmpty>
              <CommandGroup>
                {PASSPORT_COUNTRIES.map(country => (
                  <CommandItem
                    key={country.iso2}
                    value={`${country.name} ${country.iso2}`}
                    onSelect={() => {
                      setPassport(country.iso2 === passport ? null : country.iso2)
                      setOpen(false)
                    }}
                    className="text-sm cursor-pointer"
                  >
                    <img
                      src={`https://flagcdn.com/w20/${country.iso2.toLowerCase()}.png`}
                      alt={country.name}
                      width={20}
                      height={14}
                      className="shrink-0"
                    />
                    {country.name}
                    <span className="ml-auto font-mono text-xs text-muted-foreground">{country.iso2}</span>
                    <Check
                      className={cn('ml-2 h-3.5 w-3.5', passport === country.iso2 ? 'opacity-100' : 'opacity-0')}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
