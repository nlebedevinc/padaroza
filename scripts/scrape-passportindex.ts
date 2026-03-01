/**
 * Primary data scraper: fetches visa data from passportindex.org via Playwright.
 *
 * Strategy 1: Intercept XHR/fetch responses for JSON blobs (fast, preferred)
 * Strategy 2: DOM extraction per passport (fallback, slow ~5-8 min)
 *
 * Usage: pnpm scrape
 */

import { chromium } from 'playwright'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DATA_DIR = path.resolve(__dirname, '../data')

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
  const num = parseInt(v, 10)
  if (!isNaN(num)) return 'visa-free'
  return 'visa-required'
}

function looksLikeVisaData(json: unknown): boolean {
  if (typeof json !== 'object' || json === null) return false
  const keys = Object.keys(json as object)
  if (keys.length < 10) return false
  // Check if nested structure looks like passport → destination → value
  const first = (json as Record<string, unknown>)[keys[0]]
  return typeof first === 'object' && first !== null && Object.keys(first).length > 5
}

async function main() {
  fs.mkdirSync(DATA_DIR, { recursive: true })

  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext()
  const page = await context.newPage()

  const result: Record<string, Record<string, VisaEntry>> = {}
  const errors: Array<{ passport: string; error: string }> = []

  // --- Strategy 1: XHR interception ---
  console.log('Attempting XHR interception...')

  let intercepted = false
  const interceptPromise = new Promise<Record<string, unknown> | null>(resolve => {
    const timeout = setTimeout(() => resolve(null), 15000)

    page.on('response', async response => {
      const url = response.url()
      const ct = response.headers()['content-type'] ?? ''
      if (
        ct.includes('json') ||
        url.includes('.json') ||
        url.includes('api') ||
        url.includes('data')
      ) {
        try {
          const json = await response.json()
          if (looksLikeVisaData(json)) {
            clearTimeout(timeout)
            resolve(json as Record<string, unknown>)
          }
        } catch {}
      }
    })

    page.goto('https://www.passportindex.org/').catch(() => resolve(null))
  })

  const interceptedData = await interceptPromise

  if (interceptedData) {
    console.log('XHR interception succeeded!')
    intercepted = true
    // Map the intercepted data to our format
    for (const [passport, destinations] of Object.entries(interceptedData)) {
      if (typeof destinations !== 'object' || !destinations) continue
      result[passport] = {}
      for (const [dest, val] of Object.entries(destinations as Record<string, unknown>)) {
        const raw = String(val ?? '')
        result[passport][dest] = {
          category: parseCategory(raw),
          days: parseInt(raw, 10) || null,
          raw,
        }
      }
    }
  }

  // --- Strategy 2: DOM extraction (fallback) ---
  if (!intercepted) {
    console.log('XHR interception found no data. Falling back to DOM extraction...')

    await page.goto('https://www.passportindex.org/', { waitUntil: 'networkidle' })

    // Get list of passports from the select dropdown
    const passportOptions = await page.evaluate(() => {
      const select = document.querySelector('select[name="passport"], #passport-select, .passport-select')
      if (!select) return [] as string[]
      return Array.from((select as HTMLSelectElement).options)
        .map(o => o.value)
        .filter(v => v && v.length === 2)
    })

    console.log(`Found ${passportOptions.length} passports in DOM`)

    for (let i = 0; i < passportOptions.length; i++) {
      const passport = passportOptions[i]
      try {
        console.log(`[${i + 1}/${passportOptions.length}] Scraping ${passport}...`)

        await page.selectOption('select[name="passport"], #passport-select', passport)
        await page.waitForTimeout(1500)

        const destinations = await page.evaluate(() => {
          const entries: Array<{ iso2: string; raw: string }> = []
          // Adjust selectors based on actual site structure
          document.querySelectorAll('[data-country], .country-card, .destination').forEach(el => {
            const iso2 = el.getAttribute('data-iso') ?? el.getAttribute('data-country') ?? ''
            const raw = el.getAttribute('data-access') ?? el.getAttribute('data-visa') ?? el.textContent?.trim() ?? ''
            if (iso2.length === 2) entries.push({ iso2, raw })
          })
          return entries
        })

        result[passport] = {}
        for (const { iso2, raw } of destinations) {
          result[passport][iso2] = {
            category: parseCategory(raw),
            days: parseInt(raw, 10) || null,
            raw,
          }
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err)
        console.error(`  Error scraping ${passport}: ${msg}`)
        errors.push({ passport, error: msg })
      }
    }
  }

  await browser.close()

  // Write output
  const passports = Object.keys(result)
  const destinations = new Set(passports.flatMap(p => Object.keys(result[p])))

  fs.writeFileSync(
    path.join(DATA_DIR, 'visa-requirements.json'),
    JSON.stringify(result, null, 2)
  )

  fs.writeFileSync(
    path.join(DATA_DIR, 'meta.json'),
    JSON.stringify(
      {
        lastUpdated: new Date().toISOString(),
        source: 'passportindex.org',
        passportCount: passports.length,
        destinationCount: destinations.size,
      },
      null,
      2
    )
  )

  if (errors.length > 0) {
    fs.writeFileSync(
      path.join(DATA_DIR, 'scrape-errors.json'),
      JSON.stringify(errors, null, 2)
    )
    console.log(`Completed with ${errors.length} errors — see data/scrape-errors.json`)
  } else {
    console.log('Completed with no errors.')
  }

  console.log(
    `${passports.length} passports × ${destinations.size} destinations → data/visa-requirements.json`
  )
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
