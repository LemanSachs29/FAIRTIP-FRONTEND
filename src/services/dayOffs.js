import { api } from './api.js';

const getEmployeeDayOffs = (employeeId) => api.get(`/employees/${employeeId}/day-offs`);

const addEmployeeDayOff = (employeeId, weekday) =>
  api.post(`/employees/${employeeId}/day-offs`, { weekday });

const deleteEmployeeDayOff = (employeeId, dayOffId) =>
  api.delete(`/employees/${employeeId}/day-offs/${dayOffId}`);

export { getEmployeeDayOffs, addEmployeeDayOff, deleteEmployeeDayOff };
