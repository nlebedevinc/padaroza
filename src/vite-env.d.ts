/// <reference types="vite/client" />

declare module 'react-simple-maps' {
  import type { ReactNode, SVGProps } from 'react'

  export interface GeoFeature {
    rsmKey: string
    id: string | number
    properties: Record<string, string>
    geometry: unknown
  }

  export interface GeographyStyle {
    fill?: string
    stroke?: string
    strokeWidth?: number
    outline?: string
    opacity?: number
    cursor?: string
    transition?: string
  }

  export interface GeographyProps extends SVGProps<SVGPathElement> {
    geography: GeoFeature
    fill?: string
    stroke?: string
    strokeWidth?: number
    style?: {
      default?: GeographyStyle
      hover?: GeographyStyle
      pressed?: GeographyStyle
    }
  }

  export function ComposableMap(props: {
    projection?: string
    projectionConfig?: Record<string, unknown>
    style?: React.CSSProperties
    children?: ReactNode
  }): JSX.Element

  export function Geographies(props: {
    geography: string | object
    children: (props: { geographies: GeoFeature[] }) => ReactNode
  }): JSX.Element

  export function Geography(props: GeographyProps): JSX.Element
}
