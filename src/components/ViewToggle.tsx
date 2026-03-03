import { useTranslation } from 'react-i18next'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { useApp } from '@/context/AppContext'

export function ViewToggle() {
  const { viewMode, setViewMode } = useApp()
  const { t } = useTranslation()

  return (
    <ToggleGroup
      type="single"
      value={viewMode}
      onValueChange={v => v && setViewMode(v as 'map' | 'globe')}
      className="border border-border rounded-md"
    >
      <ToggleGroupItem value="map" className="text-xs px-3 h-7 rounded-l-md">
        {t('nav.map')}
      </ToggleGroupItem>
      <ToggleGroupItem value="globe" className="text-xs px-3 h-7 rounded-r-md">
        {t('nav.globe')}
      </ToggleGroupItem>
    </ToggleGroup>
  )
}
