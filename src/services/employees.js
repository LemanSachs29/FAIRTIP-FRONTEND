import { api } from './api.js';

const getEmployees = ({ includeInactive = false } = {}) => {
  const query = includeInactive ? '?include_inactive=true' : '';
  return api.get(`/employees${query}`);
};

const getEmployee = (employeeId) => api.get(`/employees/${employeeId}`);

const createEmployee = ({ name, surname, average_daily_hours }) =>
  api.post('/employees', { name, surname, average_daily_hours });

const updateEmployee = (employeeId, { name, surname, average_daily_hours }) =>
  api.put(`/employees/${employeeId}`, { name, surname, average_daily_hours });

const deactivateEmployee = (employeeId) => api.delete(`/employees/${employeeId}`);

const reactivateEmployee = (employeeId) => api.patch(`/employees/${employeeId}/reactivate`);

const getEmployeeDistributionEntries = (employeeId) =>
  api.get(`/employees/${employeeId}/distribution-entries`);

export {
  getEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  getEmployeeDistributionEntries,
  deactivateEmployee,
  reactivateEmployee,
};
