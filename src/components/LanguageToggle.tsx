import { useState } from 'react'
import { Languages, Check } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'ru', label: 'Русский' },
] as const

export function LanguageToggle() {
  const { i18n } = useTranslation()
  const [open, setOpen] = useState(false)
  const current = i18n.resolvedLanguage ?? 'en'

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          aria-label="Select language"
          className={cn(
            'flex items-center gap-1.5 h-8 px-2 rounded-md text-xs font-mono uppercase',
            'text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors duration-150'
          )}
        >
          <Languages className="h-3.5 w-3.5" />
          {current}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-36 p-1" align="end" sideOffset={8}>
        {LANGUAGES.map(lang => {
          const isActive = current === lang.code
          return (
            <button
              key={lang.code}
              onClick={() => { i18n.changeLanguage(lang.code); setOpen(false) }}
              className={cn(
                'w-full flex items-center gap-2 px-2 py-1.5 rounded-sm text-sm transition-colors duration-150',
                isActive
                  ? 'text-foreground'
                  : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
              )}
            >
              <span className="font-mono text-[10px] uppercase text-muted-foreground w-5 shrink-0">
                {lang.code}
              </span>
              <span className="flex-1 text-left">{lang.label}</span>
              {isActive && <Check className="h-3 w-3 shrink-0" />}
            </button>
          )
        })}
      </PopoverContent>
    </Popover>
  )
}
