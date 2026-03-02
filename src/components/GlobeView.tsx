import { useRef, useEffect, useCallback, useState } from 'react'
import Globe, { type GlobeMethods } from 'react-globe.gl'
import { feature } from 'topojson-client'
import type { Topology } from 'topojson-specification'
import { useTheme } from 'next-themes'
import { useApp } from '@/context/AppContext'
import { getBestRequirement, CATEGORY_COLORS } from '@/lib/visa-data'
import { numericToIso2, getCountryName } from '@/lib/countries'

interface GeoFeature {
  type: string
  id: number | string
  properties: Record<string, string>
  geometry: unknown
}

// Globe is always dark regardless of app theme
function getCountryColor(iso2: string, passports: string[]): string {
  const noData = '#3f3f46cc'
  if (passports.length === 0) return noData
  if (passports.includes(iso2)) return '#52525bcc'
  const best = getBestRequirement(passports, iso2)
  if (!best) return noData
  return (CATEGORY_COLORS[best.req.category] ?? '#3f3f46') + 'cc'
}

export function GlobeView() {
  const globeRef = useRef<GlobeMethods | undefined>(undefined)
  const { passports, setSelectedCountry } = useApp()
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'
  const [countries, setCountries] = useState<GeoFeature[]>([])

  useEffect(() => {
    fetch('/world-110m.json')
      .then(r => r.json())
      .then((topo: Topology) => {
        const fc = feature(topo, topo.objects.countries as Parameters<typeof feature>[1])
        setCountries((fc as { features: GeoFeature[] }).features)
      })
  }, [])

  useEffect(() => {
    if (!countries.length) return
    const ctrl = globeRef.current?.controls()
    if (ctrl) {
      (ctrl as { autoRotate: boolean; autoRotateSpeed: number }).autoRotate = true;
      (ctrl as { autoRotate: boolean; autoRotateSpeed: number }).autoRotateSpeed = 0.3
    }
  }, [countries])

  const getPolygonColor = useCallback(
    (feat: object) => {
      const geo = feat as GeoFeature
      const iso2 = numericToIso2(geo.id as string)
      return getCountryColor(iso2, passports)
    },
    [passports]
  )

  const getPolygonLabel = useCallback((feat: object) => {
    const geo = feat as GeoFeature
    const iso2 = numericToIso2(geo.id as string)
    const name = getCountryName(iso2) || geo.properties.name || iso2
    return `<span style="font-size:12px;font-family:system-ui;padding:2px 6px;background:rgba(0,0,0,.75);color:#fff;border-radius:4px">${name}</span>`
  }, [])

  const handleClick = useCallback(
    (feat: object) => {
      const geo = feat as GeoFeature
      const iso2 = numericToIso2(geo.id as string)
      if (iso2) setSelectedCountry(iso2)
      const ctrl = globeRef.current?.controls()
      if (ctrl) (ctrl as { autoRotate: boolean }).autoRotate = false
    },
    [setSelectedCountry]
  )

  return (
    <Globe
      ref={globeRef}
      globeImageUrl=""
      backgroundColor={isDark ? '#09090b' : '#f4f4f5'}
      atmosphereColor="#3f3f46"
      atmosphereAltitude={0.15}
      polygonsData={countries}
      polygonGeoJsonGeometry={(d: object) => (d as GeoFeature).geometry as never}
      polygonCapColor={getPolygonColor}
      polygonSideColor={() => 'rgba(0,0,0,0.15)'}
      polygonStrokeColor={() => 'rgba(255,255,255,0.18)'}
      polygonAltitude={0.005}
      polygonLabel={getPolygonLabel}
      onPolygonClick={handleClick}
      polygonsTransitionDuration={300}
      width={window.innerWidth - 48}
      height={window.innerHeight - 88}
    />
  )
}
