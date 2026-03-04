import { useRef, useEffect, useCallback, useState, useMemo } from 'react'
import { MeshPhongMaterial, Color } from 'three'
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

function getCountryColor(iso2: string, passports: string[], isDark: boolean): string {
  const noData = isDark ? '#3f3f46cc' : '#d4d4d8cc'
  if (passports.length === 0) return noData
  if (passports.includes(iso2)) return isDark ? '#52525bcc' : '#a1a1aacc'
  const best = getBestRequirement(passports, iso2)
  if (!best) return noData
  return (CATEGORY_COLORS[best.req.category] ?? (isDark ? '#3f3f46' : '#d4d4d8')) + 'cc'
}

function useGlobeDimensions() {
  const sidebarW = () => (window.innerWidth >= 640 ? 48 : 0)
  const [dims, setDims] = useState({
    width:  window.innerWidth  - sidebarW(),
    height: window.innerHeight - 88,
  })
  useEffect(() => {
    const update = () => setDims({ width: window.innerWidth - sidebarW(), height: window.innerHeight - 88 })
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])
  return dims
}

export function GlobeView() {
  const globeRef = useRef<GlobeMethods | undefined>(undefined)
  const { passports, setSelectedCountry } = useApp()
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'
  const [countries, setCountries] = useState<GeoFeature[]>([])
  const { width, height } = useGlobeDimensions()

  const globeMaterial = useMemo(() => {
    const mat = new MeshPhongMaterial()
    mat.color = new Color(isDark ? '#09090b' : '#cbd5e1')
    return mat
  }, [isDark])

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
      return getCountryColor(iso2, passports, isDark)
    },
    [passports, isDark]
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
      key={resolvedTheme}
      ref={globeRef}
      globeImageUrl=""
      globeMaterial={globeMaterial}
      backgroundColor={isDark ? '#09090b' : '#f4f4f5'}
      atmosphereColor={isDark ? '#3f3f46' : '#a1a1aa'}
      atmosphereAltitude={0.15}
      polygonsData={countries}
      polygonGeoJsonGeometry={(d: object) => (d as GeoFeature).geometry as never}
      polygonCapColor={getPolygonColor}
      polygonSideColor={() => isDark ? 'rgba(0,0,0,0.15)' : 'rgba(0,0,0,0.08)'}
      polygonStrokeColor={() => isDark ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.2)'}
      polygonAltitude={0.005}
      polygonLabel={getPolygonLabel}
      onPolygonClick={handleClick}
      polygonsTransitionDuration={300}
      width={width}
      height={height}
    />
  )
}
