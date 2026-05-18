/**
 * apiFetch — drop-in replacement for `fetch()` that automatically injects
 * the `lang` header required by the backend LanguageMiddleware.
 *
 * The current locale is read from the Next.js `NEXT_LOCALE` cookie so it
 * works in both client components (browser) and server-side calls.
 *
 * Usage:
 *   import { apiFetch } from '@/lib/api';
 *   const res = await apiFetch('/api/products?page=1&limit=6');
 */

function getLocale(): string {
  if (typeof document === 'undefined') return 'ar'; // SSR fallback

  // Next.js stores the active locale in the NEXT_LOCALE cookie
  const match = document.cookie
    .split('; ')
    .find((row) => row.startsWith('NEXT_LOCALE='));

  const locale = match ? match.split('=')[1] : 'ar';
  return locale === 'en' ? 'en' : 'ar';
}

export async function apiFetch(
  input: RequestInfo | URL,
  init: RequestInit = {},
): Promise<Response> {
  const lang = getLocale();

  const headers = new Headers(init.headers ?? {});
  // Only set if the caller has not already specified a lang header
  if (!headers.has('lang')) {
    headers.set('lang', lang);
  }

  return fetch(input, { ...init, headers });
}
