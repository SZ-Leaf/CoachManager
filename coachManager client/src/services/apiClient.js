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

export async function apiRequest(path, options = {}) {
  const { body, headers: hdr = {}, ...rest } = options;
  const headers = {
    Accept: 'application/json',
    ...hdr,
  };

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

  const parseJson = () => {
    if (!text) return null;
    try {
      return JSON.parse(text);
    } catch {
      const preview = text.trim().replace(/\s+/g, ' ').slice(0, 200);
      const hint =
        preview.startsWith('<') || preview.startsWith('<!DOCTYPE')
          ? ' (réponse HTML : vérifiez que le backend tourne, l’URL API/proxy Vite, ou reconnectez-vous.)'
          : '';
      throw new Error(
        `Réponse du serveur non JSON (${res.status}). ${preview}${hint}`,
      );
    }
  };

  const data = parseJson();

  if (!res.ok) {
    const err = new Error(data?.message || res.statusText || 'Request failed');
    err.status = res.status;
    err.body = data;
    throw err;
  }

  return data;
}
