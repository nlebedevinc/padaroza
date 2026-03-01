import type { VisaCategory, VisaRequirement, VisaData, BestRequirement } from './types'

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

export const CATEGORY_PRIORITY: Record<VisaCategory, number> = {
  'visa-free': 0,
  'on-arrival': 1,
  'eta': 2,
  'e-visa': 3,
  'visa-required': 4,
  'no-admission': 5,
}

export function getBestRequirement(
  passports: string[],
  destination: string
): BestRequirement | null {
  let best: BestRequirement | null = null
  for (const passport of passports) {
    const req = visaData[passport]?.[destination] ?? null
    if (!req) continue
    if (!best) {
      best = { req, passport }
      continue
    }
    const np = CATEGORY_PRIORITY[req.category]
    const bp = CATEGORY_PRIORITY[best.req.category]
    if (np < bp || (np === bp && (req.days ?? -1) > (best.req.days ?? -1))) {
      best = { req, passport }
    }
  }
  return best
}

export function getCombinedStats(passports: string[]): {
  perPassport: Record<string, ReturnType<typeof getStats>>
  combined: Record<VisaCategory, number> & { total: number }
} {
  const perPassport: Record<string, ReturnType<typeof getStats>> = {}
  for (const p of passports) perPassport[p] = getStats(p)

  const allDestinations = new Set<string>()
  for (const p of passports) {
    const reqs = visaData[p]
    if (reqs) Object.keys(reqs).forEach(d => allDestinations.add(d))
  }

  const counts: Record<VisaCategory, number> = {
    'visa-free': 0, 'on-arrival': 0, 'eta': 0,
    'e-visa': 0, 'visa-required': 0, 'no-admission': 0,
  }
  for (const destination of allDestinations) {
    if (passports.includes(destination)) continue
    const best = getBestRequirement(passports, destination)
    if (best) counts[best.req.category]++
  }
  const total = Object.values(counts).reduce((a, b) => a + b, 0)
  return { perPassport, combined: { ...counts, total } }
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
