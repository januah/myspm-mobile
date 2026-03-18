/**
 * i18n Configuration
 * Defines supported languages, language detection settings, and fallback chain
 */

export const SUPPORTED_LANGUAGES = {
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
  },
  ms: {
    code: 'ms',
    name: 'Malay',
    nativeName: 'Bahasa Melayu',
  },
  zh: {
    code: 'zh',
    name: 'Chinese Simplified',
    nativeName: '中文',
  },
};

// Language codes supported by the app
export const LANGUAGE_CODES = Object.keys(SUPPORTED_LANGUAGES);

// Default language
export const DEFAULT_LANGUAGE = 'en';

// Language detection configuration
export const LANGUAGE_DETECTION_CONFIG = {
  // Check in this order: saved preference > device language > default
  order: ['localStorage', 'navigator', 'htmlTag'],
  caches: ['localStorage'],
  lookupLocalStorage: 'user_language_preference',
};

// Namespace configuration
export const NAMESPACES = ['common'];

// i18next configuration options
export const I18N_CONFIG = {
  fallbackLng: DEFAULT_LANGUAGE,
  ns: NAMESPACES,
  defaultNS: 'common',
  interpolation: {
    escapeValue: false, // React already protects from XSS
  },
  react: {
    useSuspense: false, // Disable suspense for now, can enable later with proper loading UI
  },
  debug: false, // Set to true for debugging
};

// Map device language codes to app language codes
// Handles cases where device language doesn't exactly match app language code
export const LANGUAGE_CODE_MAP = {
  'en-US': 'en',
  'en-GB': 'en',
  'en-AU': 'en',
  'en-CA': 'en',
  'en-NZ': 'en',
  'en': 'en',
  'ms-MY': 'ms',
  'ms': 'ms',
  'zh-CN': 'zh',
  'zh-Hans': 'zh',
  'zh-SG': 'zh',
  'zh': 'zh',
};

/**
 * Map device language code to supported app language
 * @param {string} deviceLanguage - Device language code (e.g., 'en-US')
 * @returns {string} - App language code (e.g., 'en')
 */
export function mapDeviceLanguageToAppLanguage(deviceLanguage) {
  if (!deviceLanguage) return DEFAULT_LANGUAGE;

  // Try exact match first
  if (LANGUAGE_CODE_MAP[deviceLanguage]) {
    return LANGUAGE_CODE_MAP[deviceLanguage];
  }

  // Try matching base language (e.g., 'en' from 'en-US')
  const baseLanguage = deviceLanguage.split('-')[0];
  if (LANGUAGE_CODE_MAP[baseLanguage]) {
    return LANGUAGE_CODE_MAP[baseLanguage];
  }

  // Fall back to default
  return DEFAULT_LANGUAGE;
}
