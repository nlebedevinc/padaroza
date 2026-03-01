export type VisaCategory =
  | 'visa-free'
  | 'on-arrival'
  | 'eta'
  | 'e-visa'
  | 'visa-required'
  | 'no-admission'

export interface VisaRequirement {
  category: VisaCategory
  days: number | null
  raw: string
}

export type VisaData = Record<string, Record<string, VisaRequirement>>

export interface CountryMeta {
  iso2: string
  name: string
  flag: string // emoji
}

export type ViewMode = 'map' | 'globe'

export type ActivePanel = 'identity' | 'stats' | 'info' | null

export interface BestRequirement {
  req: VisaRequirement
  passport: string // ISO-2 of the passport that yields this result
}
