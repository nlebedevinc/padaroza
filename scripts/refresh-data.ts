/**
 * Fallback data refresh: downloads the passport-index CSV from GitHub
 * and converts it to the required JSON format.
 *
 * Usage: pnpm refresh-data
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DATA_DIR = path.resolve(__dirname, '../data')

const CSV_URL =
  'https://raw.githubusercontent.com/ilyankou/passport-index-dataset/master/passport-index-tidy-iso2.csv'

type VisaCategory =
  | 'visa-free'
  | 'on-arrival'
  | 'eta'
  | 'e-visa'
  | 'visa-required'
  | 'no-admission'

interface VisaEntry {
  category: VisaCategory
  days: number | null
  raw: string
}

function parseCategory(raw: string): VisaCategory {
  const v = raw.trim().toLowerCase()
  if (v === 'visa free' || v === 'visa-free') return 'visa-free'
  if (v === 'visa on arrival' || v === 'on arrival') return 'on-arrival'
  if (v === 'eta') return 'eta'
  if (v === 'e-visa' || v === 'evisa') return 'e-visa'
  if (v === 'visa required') return 'visa-required'
  if (v === 'no admission') return 'no-admission'
  // Numeric = visa-free with day limit
  const num = parseInt(v, 10)
  if (!isNaN(num)) return 'visa-free'
  return 'visa-required'
}

function parseDays(raw: string): number | null {
  const num = parseInt(raw.trim(), 10)
  return isNaN(num) ? null : num
}

async function main() {
  console.log(`Downloading CSV from ${CSV_URL}...`)
  const res = await fetch(CSV_URL)
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`)
  const text = await res.text()

  const lines = text.trim().split('\n')
  const header = lines[0].split(',').map(h => h.trim().replace(/"/g, ''))
  // Expected columns: Passport, Destination, Requirement
  const passportIdx = header.findIndex(h => h.toLowerCase().includes('passport'))
  const destIdx = header.findIndex(h => h.toLowerCase().includes('destination'))
  const reqIdx = header.findIndex(h => h.toLowerCase().includes('requirement'))

  if (passportIdx === -1 || destIdx === -1 || reqIdx === -1) {
    console.log('Header:', header)
    throw new Error('Could not find expected columns in CSV')
  }

  const result: Record<string, Record<string, VisaEntry>> = {}
  const passports = new Set<string>()
  const destinations = new Set<string>()

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i]
    if (!line.trim()) continue
    // Simple CSV parse (no quoted commas in this dataset)
    const cols = line.split(',').map(c => c.trim().replace(/"/g, ''))
    const passport = cols[passportIdx]
    const destination = cols[destIdx]
    const rawReq = cols[reqIdx] ?? ''

    if (!passport || !destination || passport === destination) continue

    passports.add(passport)
    destinations.add(destination)

    if (!result[passport]) result[passport] = {}
    result[passport][destination] = {
      category: parseCategory(rawReq),
      days: parseDays(rawReq),
      raw: rawReq,
    }
  }

  fs.mkdirSync(DATA_DIR, { recursive: true })

  fs.writeFileSync(
    path.join(DATA_DIR, 'visa-requirements.json'),
    JSON.stringify(result, null, 2)
  )

  const meta = {
    lastUpdated: new Date().toISOString(),
    source: 'ilyankou/passport-index-dataset (GitHub CSV)',
    passportCount: passports.size,
    destinationCount: destinations.size,
  }
  fs.writeFileSync(path.join(DATA_DIR, 'meta.json'), JSON.stringify(meta, null, 2))

  console.log(
    `Done. ${passports.size} passports × ${destinations.size} destinations → data/visa-requirements.json`
  )
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
