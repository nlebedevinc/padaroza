// Russian has 3 plural forms: one (1, 21…), few (2–4, 22–24…), many (5–20, 25–30…)
// i18next resolves these automatically via Intl.PluralRules

const ru = {
  nav: {
    map:   'Карта',
    globe: 'Глобус',
  },
  sidebar: {
    identity: 'Документы',
    stats:    'Статистика',
    about:    'О приложении',
  },
  identity: {
    passports:              'Паспорта',
    passportsCount:         '({{count}}/3)',
    passportsHint:          'Добавьте до 3 паспортов — карта покажет лучший доступ из всех.',
    addPassport:            'Добавить паспорт',
    residency:              'Вид на жительство',
    residencyComingSoon:    'скоро',
    residencyDescription:   'ВНЖ открывает реальные возможности для путешествий — Green Card США, ВНЖ Шенгена или ОАЭ позволяют въезжать в страны, недоступные по паспорту. Мы работаем над добавлением этих данных.',
    addResidency:           'Добавить ВНЖ',
    residencySaved:         'Сохранено — пока не отображается на карте.',
  },
  stats: {
    title:        'Статистика',
    noPassport:   'Добавьте паспорт во вкладке «Документы», чтобы увидеть статистику.',
    combined:     'Объединённый · лучший доступ',
    allPassports: 'Все паспорта',
  },
  info: {
    title:      'О приложении',
    dataSource: 'Источник данных',
    updatedOn:  'Обновлено {{date}}',
    coverage:   '{{passports}} паспортов · {{destinations}} направлений',
    categories: 'Категории',
    sources:    'Источники',
  },
  sheet: {
    access:        'Доступ',
    bestVia:       'Лучший через',
    duration:      'Длительность',
    days_one:      '{{count}} день',
    days_few:      '{{count}} дня',
    days_many:     '{{count}} дней',
    days_other:    '{{count}} дней',
    homeCountry:   'Это ваша домашняя страна.',
    homeCountries: 'Это одна из ваших домашних стран.',
    noData:        'Данные о визе для этого направления отсутствуют.',
    noPassport:    'Добавьте паспорт во вкладке «Документы».',
  },
  categories: {
    'visa-free':     'Без визы',
    'on-arrival':    'По прилёту',
    'eta':           'Нужна эТА',
    'e-visa':        'Нужна э-виза',
    'visa-required': 'Нужна виза',
    'no-admission':  'Въезд запрещён',
  },
  categoryDesc: {
    'visa-free':     'Виза не нужна — въезжайте и оставайтесь указанный срок.',
    'on-arrival':    'Получите визу-штамп по прилёту в порту въезда.',
    'eta':           'Электронное разрешение — оформите онлайн до вылета.',
    'e-visa':        'Электронная виза — оформите онлайн заранее из своей страны.',
    'visa-required': 'Необходимо получить визу в посольстве или консульстве.',
    'no-admission':  'Въезд запрещён.',
  },
  legend: {
    noData: 'Нет данных',
  },
  statsBar: {
    selectPassport: 'Добавьте паспорт, чтобы увидеть статистику',
    visaFree:       'Без визы',
    onArrival:      'По прилёту',
    eVisa:          'Э-виза',
    visaRequired:   'С визой',
    noEntry:        'Запрещено',
  },
  language: {
    en: 'English',
    ru: 'Русский',
  },
}

export default ru
