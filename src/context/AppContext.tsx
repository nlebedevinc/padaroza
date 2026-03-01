import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import type { ViewMode } from '@/lib/types'

interface AppState {
  passport: string | null
  setPassport: (iso2: string | null) => void
  viewMode: ViewMode
  setViewMode: (mode: ViewMode) => void
  hoveredCountry: string | null
  setHoveredCountry: (iso2: string | null) => void
  selectedCountry: string | null
  setSelectedCountry: (iso2: string | null) => void
}

const AppContext = createContext<AppState | null>(null)

const PASSPORT_KEY = 'mezha:passport'

export function AppProvider({ children }: { children: ReactNode }) {
  const [passport, setPassportState] = useState<string | null>(() => {
    try {
      return localStorage.getItem(PASSPORT_KEY)
    } catch {
      return null
    }
  })
  const [viewMode, setViewMode] = useState<ViewMode>('map')
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null)
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null)

  const setPassport = (iso2: string | null) => {
    setPassportState(iso2)
    try {
      if (iso2) localStorage.setItem(PASSPORT_KEY, iso2)
      else localStorage.removeItem(PASSPORT_KEY)
    } catch {}
  }

  // Close sheet when passport changes
  useEffect(() => {
    setSelectedCountry(null)
  }, [passport])

  return (
    <AppContext.Provider
      value={{
        passport,
        setPassport,
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
