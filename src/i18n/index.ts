import en, { type TranslationKeys } from './en'
import ar from './ar'

export type VueditTranslations = Record<TranslationKeys, string>

const locales: Record<string, VueditTranslations> = { en, ar }

export function resolveTranslations(
  locale: string | VueditTranslations
): (key: TranslationKeys) => string {
  const translations: VueditTranslations =
    typeof locale === 'string' ? locales[locale] || en : locale

  return (key: TranslationKeys) => translations[key] || en[key] || key
}

export function mergeTranslations(
  base: Partial<VueditTranslations>,
  overrides: Partial<VueditTranslations>
): VueditTranslations {
  return { ...en, ...base, ...overrides }
}

export { en as defaultTranslations }
export type { TranslationKeys }
