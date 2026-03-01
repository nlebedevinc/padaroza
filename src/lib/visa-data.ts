import type { VisaCategory, VisaRequirement, VisaData } from './types'

// Vite handles JSON imports natively — bundled at build time
import rawData from '../../data/visa-requirements.json'

const visaData = rawData as VisaData

export function getVisaRequirements(
  passport: string
): Record<string, VisaRequirement> | null {
  return visaData[passport] ?? null
}

export function getRequirement(
  passport: string,
  destination: string
): VisaRequirement | null {
  return visaData[passport]?.[destination] ?? null
}

export function getPassportList(): string[] {
  return Object.keys(visaData).sort()
}

export function getStats(passport: string): Record<VisaCategory, number> & { total: number } {
  const reqs = visaData[passport]
  const counts: Record<VisaCategory, number> = {
    'visa-free': 0,
    'on-arrival': 0,
    'eta': 0,
    'e-visa': 0,
    'visa-required': 0,
    'no-admission': 0,
  }
  if (!reqs) return { ...counts, total: 0 }
  for (const req of Object.values(reqs)) {
    counts[req.category] = (counts[req.category] ?? 0) + 1
  }
  const total = Object.values(counts).reduce((a, b) => a + b, 0)
  return { ...counts, total }
}

export const CATEGORY_COLORS: Record<VisaCategory, string> = {
  'visa-free': '#16a34a',
  'on-arrival': '#2563eb',
  'eta': '#2563eb',
  'e-visa': '#7c3aed',
  'visa-required': '#d97706',
  'no-admission': '#dc2626',
}

export const CATEGORY_LABELS: Record<VisaCategory, string> = {
  'visa-free': 'Visa-free',
  'on-arrival': 'On arrival',
  'eta': 'eTA required',
  'e-visa': 'E-visa',
  'visa-required': 'Visa required',
  'no-admission': 'No admission',
}
