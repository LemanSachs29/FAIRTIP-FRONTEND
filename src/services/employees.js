import { api } from './api.js';

const getEmployees = () => api.get('/employees');

const createEmployee = ({ name, surname, average_daily_hours }) =>
  api.post('/employees', { name, surname, average_daily_hours });

export { getEmployees, createEmployee };
