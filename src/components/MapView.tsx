import { ComposableMap, Geographies, Geography } from 'react-simple-maps'
import { useTheme } from 'next-themes'
import { useApp } from '@/context/AppContext'
import { getBestRequirement, CATEGORY_COLORS } from '@/lib/visa-data'
import { numericToIso2, getCountryName } from '@/lib/countries'

const GEO_URL = '/world-110m.json'

function getCountryColor(
  iso2: string,
  passports: string[],
  isDark: boolean
): string {
  const noData = isDark ? '#3f3f46' : '#e4e4e7'
  if (passports.length === 0) return noData
  if (passports.includes(iso2)) return '#52525b'
  const best = getBestRequirement(passports, iso2)
  if (!best) return noData
  return CATEGORY_COLORS[best.req.category] ?? noData
}

export function MapView() {
  const { passports, setSelectedCountry, setHoveredCountry, hoveredCountry } = useApp()
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'

  const oceanBg = isDark ? '#09090b' : '#f4f4f5'
  const borderColor = isDark ? 'rgba(39,39,42,0.6)' : 'rgba(212,212,216,0.8)'

  return (
    <div className="w-full h-full" style={{ backgroundColor: oceanBg }}>
      <ComposableMap
        projection="geoNaturalEarth1"
        projectionConfig={{ scale: 160 }}
        style={{ width: '100%', height: '100%' }}
      >
        <Geographies geography={GEO_URL}>
          {({ geographies }) =>
            geographies.map(geo => {
              const iso2 = numericToIso2(geo.id as string)
              const name = getCountryName(iso2) || (geo.properties.name as string) || iso2
              const isHovered = hoveredCountry === iso2
              const fill = getCountryColor(iso2, passports, isDark)

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={fill}
                  stroke={borderColor}
                  strokeWidth={0.5}
                  role={iso2 ? 'button' : undefined}
                  aria-label={name}
                  style={{
                    default: {
                      fill,
                      outline: 'none',
                      opacity: isHovered ? 0.75 : 1,
                      cursor: iso2 ? 'pointer' : 'default',
                      transition: 'opacity 100ms',
                    },
                    hover: { fill, outline: 'none', opacity: 0.75, cursor: iso2 ? 'pointer' : 'default' },
                    pressed: { fill, outline: 'none' },
                  }}
                  onMouseEnter={() => iso2 && setHoveredCountry(iso2)}
                  onMouseLeave={() => setHoveredCountry(null)}
                  onClick={() => iso2 && setSelectedCountry(iso2)}
                />
              )
            })
          }
        </Geographies>
      </ComposableMap>
    </div>
  )
}
