import { User, BarChart2, Info } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useApp } from '@/context/AppContext'
import type { ActivePanel } from '@/lib/types'

const RAIL_ITEMS: { panel: NonNullable<ActivePanel>; Icon: React.ElementType; label: string }[] = [
  { panel: 'identity', Icon: User,      label: 'Identity'   },
  { panel: 'stats',    Icon: BarChart2, label: 'Statistics' },
  { panel: 'info',     Icon: Info,      label: 'About'      },
]

export function Sidebar() {
  const { activePanel, setActivePanel, passports } = useApp()

  return (
    <div className="absolute left-0 top-12 bottom-10 z-20 w-12 flex flex-col items-center py-2 gap-1 border-r border-border bg-background/80 backdrop-blur-sm">
      {RAIL_ITEMS.map(({ panel, Icon, label }) => {
        const isActive = activePanel === panel
        const showBadge = panel === 'identity' && passports.length > 0

        return (
          <div key={panel} className="relative">
            <button
              aria-label={label}
              aria-pressed={isActive}
              onClick={() => setActivePanel(isActive ? null : panel)}
              className={cn(
                'w-9 h-9 flex items-center justify-center rounded-md',
                'transition-colors duration-150',
                isActive
                  ? 'bg-muted text-foreground'
                  : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
              )}
            >
              <Icon className="h-4 w-4" />
            </button>
            {showBadge && (
              <span className="absolute -top-0.5 -right-0.5 h-3.5 w-3.5 flex items-center justify-center rounded-full bg-foreground text-background text-[9px] font-mono leading-none pointer-events-none">
                {passports.length}
              </span>
            )}
          </div>
        )
      })}
    </div>
  )
}
