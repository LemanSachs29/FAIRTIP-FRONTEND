import { api } from './api.js';

const getEmployees = () => api.get('/employees');

const getEmployee = (employeeId) => api.get(`/employees/${employeeId}`);

const createEmployee = ({ name, surname, average_daily_hours }) =>
  api.post('/employees', { name, surname, average_daily_hours });

const updateEmployee = (employeeId, { name, surname, average_daily_hours }) =>
  api.put(`/employees/${employeeId}`, { name, surname, average_daily_hours });

const getEmployeeDistributionEntries = (employeeId) =>
  api.get(`/employees/${employeeId}/distribution-entries`);

export { getEmployees, getEmployee, createEmployee, updateEmployee, getEmployeeDistributionEntries };
