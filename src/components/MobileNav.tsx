import { useState } from 'react'
import { Menu, User, BarChart2, Info } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { IdentityPanel } from '@/components/panels/IdentityPanel'
import { StatsPanel } from '@/components/panels/StatsPanel'
import { InfoPanel } from '@/components/panels/InfoPanel'
import { useApp } from '@/context/AppContext'
import { cn } from '@/lib/utils'

type Tab = 'identity' | 'stats' | 'info'

export function MobileNav() {
  const [open, setOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<Tab>('identity')
  const { t } = useTranslation()
  const { passports } = useApp()

  const tabs: { id: Tab; Icon: React.ElementType; label: string }[] = [
    { id: 'identity', Icon: User,      label: t('sidebar.identity') },
    { id: 'stats',    Icon: BarChart2, label: t('sidebar.stats')    },
    { id: 'info',     Icon: Info,      label: t('sidebar.about')    },
  ]

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          aria-label="Open menu"
          className="flex items-center justify-center w-9 h-9 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors duration-150"
        >
          <Menu className="h-4 w-4" />
          {passports.length > 0 && (
            <span className="absolute top-2 left-2 h-3.5 w-3.5 flex items-center justify-center rounded-full bg-foreground text-background text-[9px] font-mono leading-none pointer-events-none">
              {passports.length}
            </span>
          )}
        </button>
      </SheetTrigger>

      <SheetContent side="left" className="p-0 flex flex-col gap-0" showCloseButton={false}>
        {/* Tab bar */}
        <div className="flex border-b border-border shrink-0">
          {tabs.map(({ id, Icon, label }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={cn(
                'flex flex-1 flex-col items-center gap-1 py-3 text-[10px] uppercase tracking-wider transition-colors duration-150',
                activeTab === id
                  ? 'text-foreground border-b-2 border-foreground -mb-px'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Panel content */}
        <div className="overflow-y-auto flex-1">
          {activeTab === 'identity' && <IdentityPanel />}
          {activeTab === 'stats'    && <StatsPanel />}
          {activeTab === 'info'     && <InfoPanel />}
        </div>
      </SheetContent>
    </Sheet>
  )
}
