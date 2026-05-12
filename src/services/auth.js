import { api } from './api.js';

const TOKEN_KEY = 'fairtip_token';

const getToken = () => localStorage.getItem(TOKEN_KEY);

const isAuthenticated = () => Boolean(getToken());

const login = async (email, password) => {
  const data = await api.post('/auth/login', { email, password });
  const token = data?.access_token;

  if (!token) {
    throw {
      status: 500,
      message: 'Login succeeded, but no access token was returned.',
      data,
    };
  }

  localStorage.setItem(TOKEN_KEY, token);
  return token;
};

const register = (email, password) => api.post('/auth/register', { email, password });

const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
};

export { login, register, logout, getToken, isAuthenticated };
