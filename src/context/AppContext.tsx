import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import type { ViewMode, ActivePanel } from '@/lib/types'

interface AppState {
  passports: string[]
  setPassports: (iso2s: string[]) => void
  residencies: string[]
  setResidencies: (iso2s: string[]) => void
  activePanel: ActivePanel
  setActivePanel: (panel: ActivePanel) => void
  viewMode: ViewMode
  setViewMode: (mode: ViewMode) => void
  hoveredCountry: string | null
  setHoveredCountry: (iso2: string | null) => void
  selectedCountry: string | null
  setSelectedCountry: (iso2: string | null) => void
}

const AppContext = createContext<AppState | null>(null)

const PASSPORTS_KEY = 'mezha:passports'
const RESIDENCIES_KEY = 'mezha:residencies'
const LEGACY_KEY = 'mezha:passport'

function readPassports(): string[] {
  try {
    const raw = localStorage.getItem(PASSPORTS_KEY)
    if (raw) return JSON.parse(raw) as string[]
    // Migrate from old single-passport key
    const legacy = localStorage.getItem(LEGACY_KEY)
    if (legacy) return [legacy]
  } catch {}
  return []
}

function readResidencies(): string[] {
  try {
    const raw = localStorage.getItem(RESIDENCIES_KEY)
    if (raw) return JSON.parse(raw) as string[]
  } catch {}
  return []
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [passports, setPassportsState] = useState<string[]>(readPassports)
  const [residencies, setResidenciesState] = useState<string[]>(readResidencies)
  const [activePanel, setActivePanel] = useState<ActivePanel>(null)
  const [viewMode, setViewMode] = useState<ViewMode>('map')
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null)
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null)

  const setPassports = (iso2s: string[]) => {
    const clamped = iso2s.slice(0, 3)
    setPassportsState(clamped)
    try {
      if (clamped.length > 0) localStorage.setItem(PASSPORTS_KEY, JSON.stringify(clamped))
      else localStorage.removeItem(PASSPORTS_KEY)
      localStorage.removeItem(LEGACY_KEY)
    } catch {}
  }

  const setResidencies = (iso2s: string[]) => {
    setResidenciesState(iso2s)
    try {
      if (iso2s.length > 0) localStorage.setItem(RESIDENCIES_KEY, JSON.stringify(iso2s))
      else localStorage.removeItem(RESIDENCIES_KEY)
    } catch {}
  }

  // Close sheet when selected passports change
  const passportKey = passports.join(',')
  useEffect(() => {
    setSelectedCountry(null)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [passportKey])

  return (
    <AppContext.Provider
      value={{
        passports,
        setPassports,
        residencies,
        setResidencies,
        activePanel,
        setActivePanel,
        viewMode,
        setViewMode,
        hoveredCountry,
        setHoveredCountry,
        selectedCountry,
        setSelectedCountry,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
