/**
 * i18n Initialization
 * Sets up i18next with device language detection and fallback chain
 */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as RNLocalize from 'react-native-localize';

import {
  SUPPORTED_LANGUAGES,
  LANGUAGE_CODES,
  DEFAULT_LANGUAGE,
  I18N_CONFIG,
  mapDeviceLanguageToAppLanguage,
} from './config';

// Import translation resources
import enCommon from '../locales/en/common.json';
import msCommon from '../locales/ms/common.json';
import zhCommon from '../locales/zh/common.json';

const resources = {
  en: {
    common: enCommon,
  },
  ms: {
    common: msCommon,
  },
  zh: {
    common: zhCommon,
  },
};

/**
 * Detect device language using react-native-localize
 * @returns {string} - Detected app language code
 */
export function detectDeviceLanguage() {
  // Get device language preferences
  const locales = RNLocalize.getLocales();

  if (locales && locales.length > 0) {
    const deviceLanguageCode = locales[0].languageCode;
    const mappedLanguage = mapDeviceLanguageToAppLanguage(deviceLanguageCode);

    if (LANGUAGE_CODES.includes(mappedLanguage)) {
      return mappedLanguage;
    }
  }

  // Fallback to default if device language not supported
  return DEFAULT_LANGUAGE;
}

/**
 * Initialize i18n
 * Should be called before rendering the app
 */
export async function initializeI18n(initialLanguage = null) {
  // Use provided language or detect from device
  const detectedLanguage = initialLanguage || detectDeviceLanguage();

  i18n
    .use(initReactI18next)
    .init({
      ...I18N_CONFIG,
      lng: detectedLanguage,
      resources,
    });

  return i18n;
}

/**
 * Change language dynamically
 * @param {string} language - Language code to switch to
 * @returns {Promise} - Promise that resolves when language is changed
 */
export function changeLanguage(language) {
  if (!LANGUAGE_CODES.includes(language)) {
    console.warn(`Language '${language}' not supported. Available: ${LANGUAGE_CODES.join(', ')}`);
    return Promise.reject(new Error(`Language '${language}' not supported`));
  }

  return i18n.changeLanguage(language);
}

/**
 * Get current language
 * @returns {string} - Current language code
 */
export function getCurrentLanguage() {
  return i18n.language;
}

/**
 * Get supported languages
 * @returns {object} - Supported languages configuration
 */
export function getSupportedLanguages() {
  return SUPPORTED_LANGUAGES;
}

export default i18n;
