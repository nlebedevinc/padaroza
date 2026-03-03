import { useTranslation } from 'react-i18next'
import { useApp } from '@/context/AppContext'

export function WelcomeOverlay() {
  const { passports, setActivePanel } = useApp()
  const { t } = useTranslation()

  if (passports.length > 0) return null

  return (
    <div className="absolute inset-0 top-12 bottom-10 left-12 z-10 flex items-center justify-center pointer-events-none">
      <div className="flex flex-col items-center gap-3 text-center pointer-events-auto">
        <h1 className="text-2xl font-medium tracking-tight text-foreground/80">
          {t('welcome.headline')}
        </h1>
        <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
          {t('welcome.description')}
        </p>
        <button
          onClick={() => setActivePanel('identity')}
          className="mt-1 px-4 py-1.5 rounded-md border border-border bg-background/80 backdrop-blur-sm text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors duration-150"
        >
          {t('welcome.cta')}
        </button>
      </div>
    </div>
  )
}
