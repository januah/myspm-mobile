/**
 * Fetch Interceptor for Language Header
 * Automatically adds Accept-Language header to all API requests
 */

/**
 * Create a fetch wrapper that adds Accept-Language header
 * @param {Function} getLanguage - Function to get current language from Redux state
 * @returns {Function} - Wrapped fetch function
 */
export function createFetchWithLanguage(getLanguage) {
  return async (url, options = {}) => {
    const headers = {
      ...options.headers,
    };

    // Add Accept-Language header
    const currentLanguage = getLanguage();
    if (currentLanguage) {
      headers['Accept-Language'] = currentLanguage;
    }

    const fetchOptions = {
      ...options,
      headers,
    };

    return fetch(url, fetchOptions);
  };
}

/**
 * Standalone fetch wrapper with language support
 * Used when Redux store is available
 * @param {string} url - API endpoint URL
 * @param {object} options - Fetch options
 * @param {string} language - Current language code
 * @returns {Promise} - Fetch promise
 */
export async function fetchWithLanguage(url, options = {}, language = 'en') {
  const headers = {
    ...options.headers,
  };

  // Add Accept-Language header
  if (language) {
    headers['Accept-Language'] = language;
  }

  const fetchOptions = {
    ...options,
    headers,
  };

  return fetch(url, fetchOptions);
}
