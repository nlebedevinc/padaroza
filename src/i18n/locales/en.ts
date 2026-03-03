const en = {
  nav: {
    map:   'Map',
    globe: 'Globe',
  },
  sidebar: {
    identity: 'Identity',
    stats:    'Statistics',
    about:    'About',
  },
  identity: {
    passports:              'Passports',
    passportsCount:         '({{count}}/3)',
    passportsHint:          'Add up to 3 passports — the map shows your best access across all of them.',
    addPassport:            'Add passport',
    residency:              'Residency',
    residencyComingSoon:    'coming soon',
    residencyDescription:   'Residence permits unlock real travel access — a US Green Card, Schengen residence permit, or UAE residence each let you enter certain countries that your passport alone wouldn\'t. We\'re working on mapping this data.',
    addResidency:           'Add residency',
    residencySaved:         'Saved for when the data is ready — not yet reflected on the map.',
  },
  stats: {
    title:       'Statistics',
    noPassport:  'Add a passport in the Identity panel to see statistics.',
    combined:    'Combined · best access',
    allPassports: 'All passports',
  },
  info: {
    title:      'About',
    dataSource: 'Data source',
    updatedOn:  'Updated {{date}}',
    coverage:   '{{passports}} passports · {{destinations}} destinations',
    categories: 'Categories',
    sources:    'Sources',
  },
  sheet: {
    access:        'Access',
    bestVia:       'Best via',
    duration:      'Duration',
    days_one:      '{{count}} day',
    days_other:    '{{count}} days',
    homeCountry:   'This is your home country.',
    homeCountries: 'This is one of your home countries.',
    noData:        'No visa data available for this destination.',
    noPassport:    'Add a passport in the Identity panel to see visa requirements.',
  },
  categories: {
    'visa-free':    'Visa-free',
    'on-arrival':   'On arrival',
    'eta':          'eTA required',
    'e-visa':       'E-visa required',
    'visa-required': 'Visa required',
    'no-admission': 'No admission',
  },
  categoryDesc: {
    'visa-free':    'No visa needed — arrive and stay for the indicated duration.',
    'on-arrival':   'Obtain a visa stamp at the port of entry on arrival.',
    'eta':          'Electronic travel authorisation — apply online before departure.',
    'e-visa':       'Electronic visa — apply online in advance from your home country.',
    'visa-required': 'Must obtain a visa from the embassy or consulate before travel.',
    'no-admission': 'Entry not permitted.',
  },
  legend: {
    noData: 'No data',
  },
  statsBar: {
    selectPassport: 'Select a passport to see access statistics',
    visaFree:       'Visa-free',
    onArrival:      'On arrival',
    eVisa:          'E-visa',
    visaRequired:   'Visa req.',
    noEntry:        'No entry',
  },
  welcome: {
    headline:    'Where can you go?',
    description: 'Select your passport — every country fills with a color showing your visa access conditions.',
    cta:         'Add your passport',
  },
  language: {
    en: 'English',
    ru: 'Русский',
  },
} as const

export default en
export type Translations = typeof en
