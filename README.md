# padaroza

**Live at [padaroza.nikolaylebedev.com](https://padaroza.nikolaylebedev.com)**

> Where can I go, and on what terms?

**padaroza** (Belarusian: падарожжа, romanized: *padarožža*, lit. "journey") — A minimal, full-screen world visa map. Select your passport — every country fills with a color showing your access conditions. Hold multiple citizenships or residencies? Add them all; the map shows your best access across the board.

![padaroza screenshot](./docs/screenshot.png)

## Features

- **2D map** — SVG Natural Earth projection, zero WebGL, instant render
- **3D globe** — Three.js globe, lazy-loaded only when you switch to it
- **Multi-passport** — add up to 3 passports; map colors by best access across all
- **Residency** — track residence permits (map integration coming when data becomes available)
- **Country detail** — click any country to see visa category, duration, and which passport gets you in best
- **Statistics** — per-passport breakdown with combined access comparison
- **Dark / light** — follows system preference, toggle in header
- **Zero runtime API calls** — all visa data bundled at build time

## Visa categories

| Color | Category | Meaning |
|---|---|---|
| 🟢 Green | Visa-free | No visa needed |
| 🔵 Blue | On arrival / eTA | Get a stamp at the border or apply online briefly |
| 🟣 Violet | E-visa | Apply online in advance |
| 🟡 Amber | Visa required | Embassy or consulate appointment needed |
| 🔴 Red | No admission | Entry not permitted |

## Data

Visa requirements sourced from [passportindex.org](https://www.passportindex.org/) and the [passport-index-dataset](https://github.com/ilyankou/passport-index-dataset) by ilyankou. Covers 199 passports × 199 destinations.

To refresh data:

```bash
pnpm refresh-data   # download latest CSV snapshot from GitHub
pnpm scrape         # live scrape from passportindex.org (requires Playwright)
```

## Stack

| | |
|---|---|
| Framework | Vite + React 19 (TypeScript) |
| Styling | Tailwind CSS v4 |
| UI | shadcn/ui — New York style, zinc base |
| 2D map | react-simple-maps |
| 3D globe | react-globe.gl (lazy-loaded) |
| State | React Context + localStorage |
| Deploy | Cloudflare Pages |

## Development

```bash
pnpm install
pnpm dev
```

```bash
pnpm build    # production build → dist/
pnpm preview  # preview the production build locally
```

## Deployment

Connects directly to Cloudflare Pages — push to `main` and it deploys automatically.

```
Build command:  pnpm build
Output dir:     dist
Node version:   24
```

## License

MIT
