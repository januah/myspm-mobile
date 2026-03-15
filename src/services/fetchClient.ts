/**
 * Fetch Client with Language Header Support
 * Wrapper around native fetch that automatically adds Accept-Language header
 */

import { fetchWithLanguage } from '@/i18n/interceptor';

export interface FetchOptions extends RequestInit {
  headers?: Record<string, string>;
}

/**
 * Fetch wrapper that adds Accept-Language header
 * @param {string} url - API endpoint URL
 * @param {FetchOptions} options - Fetch options
 * @param {string} language - Current language code (will be passed by caller)
 * @returns {Promise<Response>} - Fetch response
 */
export async function fetchClient(url: string, options: FetchOptions = {}, language: string = 'en'): Promise<Response> {
  return fetchWithLanguage(url, options, language);
}

/**
 * GET request helper
 */
export async function get(url: string, language: string = 'en', headers: Record<string, string> = {}): Promise<Response> {
  return fetchClient(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  }, language);
}

/**
 * POST request helper
 */
export async function post(
  url: string,
  data: any,
  language: string = 'en',
  headers: Record<string, string> = {},
): Promise<Response> {
  return fetchClient(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: JSON.stringify(data),
  }, language);
}

/**
 * PUT request helper
 */
export async function put(
  url: string,
  data: any,
  language: string = 'en',
  headers: Record<string, string> = {},
): Promise<Response> {
  return fetchClient(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: JSON.stringify(data),
  }, language);
}

/**
 * DELETE request helper
 */
export async function del(
  url: string,
  language: string = 'en',
  headers: Record<string, string> = {},
): Promise<Response> {
  return fetchClient(url, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  }, language);
}

/**
 * PATCH request helper
 */
export async function patch(
  url: string,
  data: any,
  language: string = 'en',
  headers: Record<string, string> = {},
): Promise<Response> {
  return fetchClient(url, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: JSON.stringify(data),
  }, language);
}

// Export named object for convenience
export default {
  fetch: fetchClient,
  get,
  post,
  put,
  delete: del,
  patch,
};
