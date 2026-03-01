import { lazy, Suspense } from 'react'
import { ThemeProvider } from 'next-themes'
import { TooltipProvider } from '@/components/ui/tooltip'
import { AppProvider, useApp } from '@/context/AppContext'
import { MapView } from '@/components/MapView'
import { PassportSelector } from '@/components/PassportSelector'
import { ViewToggle } from '@/components/ViewToggle'
import { ThemeToggle } from '@/components/ThemeToggle'
import { Legend } from '@/components/Legend'
import { StatsBar } from '@/components/StatsBar'
import { CountrySheet } from '@/components/CountrySheet'

const GlobeView = lazy(() =>
  import('@/components/GlobeView').then(m => ({ default: m.GlobeView }))
)

function Layout() {
  const { viewMode } = useApp()

  return (
    <div className="relative h-dvh w-full overflow-hidden bg-background">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-30 h-12 border-b border-border bg-background/80 backdrop-blur-sm flex items-center px-4">
        <span className="font-medium tracking-tight text-sm select-none">mezha</span>
        <div className="flex-1 flex justify-center">
          <ViewToggle />
        </div>
        <ThemeToggle />
      </header>

      {/* Passport selector (floats below header) */}
      <PassportSelector />

      {/* Map / Globe */}
      <div className="absolute inset-0 top-0">
        {viewMode === 'map' ? (
          <div className="w-full h-full pt-12 pb-10">
            <MapView />
          </div>
        ) : (
          <Suspense fallback={null}>
            <div className="w-full h-full pt-12 pb-10">
              <GlobeView />
            </div>
          </Suspense>
        )}
      </div>

      {/* Legend */}
      <Legend />

      {/* Stats bar */}
      <StatsBar />

      {/* Country detail sheet */}
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
