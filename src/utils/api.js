/**
 * Thin client for the NITJ Hostel backend (see /server).
 * In dev, Vite proxies /api to the Express server; in production set VITE_API_URL.
 */
export const API_BASE = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '');

const TOKEN_KEY = 'nitj_admin_token';

export const getToken = () => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
};

export const setToken = (token) => {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
};

/** Decode the JWT payload (no verification — the server verifies). Returns null if missing/expired. */
export const getTokenPayload = () => {
  const token = getToken();
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      setToken(null);
      return null;
    }
    return payload;
  } catch {
    return null;
  }
};

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

export const apiRequest = async (path, { method = 'GET', body, auth = false } = {}) => {
  const headers = {};
  if (body !== undefined && !(body instanceof FormData)) headers['Content-Type'] = 'application/json';
  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : body instanceof FormData ? body : JSON.stringify(body),
  });

  let data = null;
  try {
    data = await res.json();
  } catch {
    /* empty body */
  }

  if (!res.ok) {
    if (res.status === 401 && auth) {
      setToken(null);
      window.dispatchEvent(new CustomEvent('adminSessionChanged', { detail: { hostelKey: null } }));
    }
    throw new ApiError(data?.message || `Request failed (${res.status})`, res.status);
  }
  return data;
};

/** Upload an image file to Cloudinary via the backend. Resolves to the public URL. */
export const uploadImage = async (file) => {
  const form = new FormData();
  form.append('image', file);
  const { url } = await apiRequest('/upload', { method: 'POST', body: form, auth: true });
  return url;
};
