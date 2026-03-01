import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { useApp } from '@/context/AppContext'

export function ViewToggle() {
  const { viewMode, setViewMode } = useApp()

  return (
    <ToggleGroup
      type="single"
      value={viewMode}
      onValueChange={v => v && setViewMode(v as 'map' | 'globe')}
      className="border border-border rounded-md"
    >
      <ToggleGroupItem value="map" className="text-xs px-3 h-7 rounded-l-md">
        Map
      </ToggleGroupItem>
      <ToggleGroupItem value="globe" className="text-xs px-3 h-7 rounded-r-md">
        Globe
      </ToggleGroupItem>
    </ToggleGroup>
  )
}
