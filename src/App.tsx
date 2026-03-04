import { lazy, Suspense } from 'react'
import { ThemeProvider } from 'next-themes'
import { TooltipProvider } from '@/components/ui/tooltip'
import { AppProvider, useApp } from '@/context/AppContext'
import { MapView } from '@/components/MapView'
import { Sidebar } from '@/components/Sidebar'
import { ViewToggle } from '@/components/ViewToggle'
import { ThemeToggle } from '@/components/ThemeToggle'
import { LanguageToggle } from '@/components/LanguageToggle'
import { MobileNav } from '@/components/MobileNav'
import { Legend } from '@/components/Legend'
import { StatsBar } from '@/components/StatsBar'
import { CountrySheet } from '@/components/CountrySheet'
import { WelcomeOverlay } from '@/components/WelcomeOverlay'
import { IdentityPanel } from '@/components/panels/IdentityPanel'
import { StatsPanel } from '@/components/panels/StatsPanel'
import { InfoPanel } from '@/components/panels/InfoPanel'

const GlobeView = lazy(() =>
  import('@/components/GlobeView').then(m => ({ default: m.GlobeView }))
)

function Layout() {
  const { viewMode, activePanel } = useApp()

  return (
    <div className="relative h-dvh w-full overflow-hidden bg-background">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-30 h-12 border-b border-border bg-background/80 backdrop-blur-sm flex items-center px-3">
        {/* Mobile: hamburger menu | Desktop: sidebar clearance + wordmark */}
        <div className="sm:hidden relative">
          <MobileNav />
        </div>
        <div className="hidden sm:flex flex-col justify-center pl-12 select-none">
          <span className="font-medium tracking-tight text-sm leading-tight">padaroza</span>
          <span className="text-[10px] text-muted-foreground leading-tight tracking-wide">падарожжа · journey</span>
        </div>
        <div className="flex-1 flex justify-center">
          <ViewToggle />
        </div>
        <LanguageToggle />
        <ThemeToggle />
      </header>

      {/* Icon rail — desktop only */}
      <div className="hidden sm:block">
        <Sidebar />
      </div>

      {/* Slide-out panel — desktop only */}
      {activePanel && (
        <div className="hidden sm:block absolute left-12 top-12 bottom-10 z-20 w-[280px] border-r border-border bg-background overflow-y-auto">
          {activePanel === 'identity' && <IdentityPanel />}
          {activePanel === 'stats'    && <StatsPanel />}
          {activePanel === 'info'     && <InfoPanel />}
        </div>
      )}

      {/* Map / Globe */}
      <div className="absolute inset-0 top-0">
        {viewMode === 'map' ? (
          <div className="w-full h-full pt-12 pb-10 sm:pl-12">
            <MapView />
          </div>
        ) : (
          <Suspense fallback={null}>
            <div className="w-full h-full pt-12 pb-10 sm:pl-12">
              <GlobeView />
            </div>
          </Suspense>
        )}
      </div>

      <WelcomeOverlay />
      <Legend />
      <StatsBar />
      <CountrySheet />
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <TooltipProvider>
        <AppProvider>
          <Layout />
        </AppProvider>
      </TooltipProvider>
    </ThemeProvider>
  )
}
