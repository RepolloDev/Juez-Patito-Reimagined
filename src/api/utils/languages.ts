const availableLanguages = ['Python3.12', 'Java', 'C++11', 'default'] as const
export type LanguageKey = (typeof availableLanguages)[number]

type LanguageInfo = {
  id: string
  name: string
  extension: string
  compilerVersion: string
}

const languages: Record<LanguageKey, LanguageInfo> = {
  'Python3.12': {
    id: '19',
    name: 'Python',
    extension: 'py',
    compilerVersion: '3.12.0a1',
  },
  Java: {
    id: '3',
    name: 'Java',
    extension: 'java',
    compilerVersion: '1.8.0_201',
  },
  'C++11': {
    id: '16',
    name: 'C++',
    extension: 'cpp',
    compilerVersion: 'G++ 6.3.0',
  },
  default: {
    id: '0',
    name: 'Unknown',
    extension: 'txt',
    compilerVersion: 'Unknown',
  },
}

export const defaultLanguage = languages.default

export function getLanguageKey(entry: string) {
  return availableLanguages.find((language) => language === entry) || 'default'
}

export function getLanguageInfo(key: LanguageKey) {
  return languages[key]
}
