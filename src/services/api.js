const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

function getToken() {
  return localStorage.getItem('fairtip_token');
}

async function request(path, options = {}) {
  const token = getToken();

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw {
      status: res.status,
      message: data?.error || data?.message || 'Request failed',
      data,
    };
  }

  return data;
}

export const api = {
  get: (path) => request(path),
  post: (path, body) =>
    request(path, {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  delete: (path) =>
    request(path, {
      method: 'DELETE',
    }),
};