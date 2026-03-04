import { useTranslation } from 'react-i18next'
import { useApp } from '@/context/AppContext'

const STEPS = ['step1', 'step2', 'step3'] as const

export function WelcomeOverlay() {
  const { passports, setActivePanel } = useApp()
  const { t } = useTranslation()

  if (passports.length > 0) return null

  return (
    <div className="absolute inset-0 top-12 bottom-10 sm:left-12 z-10 flex items-center justify-center pointer-events-none px-4">
      <div className="flex flex-col items-center gap-4 text-center pointer-events-auto w-full max-w-sm">
        <h1 className="text-2xl font-medium tracking-tight text-foreground/80">
          {t('welcome.headline')}
        </h1>

        <p className="text-sm text-muted-foreground leading-relaxed">
          {t('welcome.description')}
        </p>

        <ol className="flex flex-col gap-2 text-left w-full mt-1">
          {STEPS.map((key, i) => (
            <li key={key} className="flex items-start gap-3">
              <span className="shrink-0 mt-0.5 h-5 w-5 flex items-center justify-center rounded-full border border-border text-[10px] font-mono text-muted-foreground">
                {i + 1}
              </span>
              <span className="text-sm text-muted-foreground">{t(`welcome.${key}`)}</span>
            </li>
          ))}
        </ol>

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
