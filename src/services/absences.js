import { api } from './api.js';

const getEmployeeAbsences = (employeeId) => api.get(`/employees/${employeeId}/absences`);

const addEmployeeAbsence = (employeeId, date) =>
  api.post(`/employees/${employeeId}/absences`, { date });

const deleteEmployeeAbsence = (employeeId, absenceId) =>
  api.delete(`/employees/${employeeId}/absences/${absenceId}`);

export { getEmployeeAbsences, addEmployeeAbsence, deleteEmployeeAbsence };
