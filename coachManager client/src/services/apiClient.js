/**
 * Same-origin `/api` in dev (Vite proxy). Production: serve SPA and API on one origin or set VITE_API_ORIGIN.
 */
function apiOrigin() {
  if (typeof import.meta.env.VITE_API_ORIGIN === 'string' && import.meta.env.VITE_API_ORIGIN) {
    return import.meta.env.VITE_API_ORIGIN.replace(/\/$/, '');
  }
  return '';
}

export function buildApiUrl(path) {
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${apiOrigin()}${p}`;
}

/**
 * @param {string} path
 * @param {RequestInit & { body?: object | FormData }} [options]
 * @returns {Promise<any>}
 */
export async function apiRequest(path, options = {}) {
  const { body, headers: hdr = {}, ...rest } = options;
  /** @type {HeadersInit} */
  const headers = { ...hdr };

  /** @type {RequestInit} */
  const init = {
    credentials: 'include',
    ...rest,
    headers,
  };

  if (body !== undefined && body !== null) {
    if (body instanceof FormData) {
      init.body = body;
    } else {
      headers['Content-Type'] = 'application/json';
      init.body = JSON.stringify(body);
    }
  }

  const res = await fetch(buildApiUrl(path), init);

  if (res.status === 204) {
    return null;
  }

  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  if (!res.ok) {
    const err = new Error(data?.message || res.statusText || 'Request failed');
    err.status = res.status;
    err.body = data;
    throw err;
  }

  return data;
}
