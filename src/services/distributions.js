import { api } from './api.js';

const getDistributions = () => api.get('/distributions');

const getDistribution = (distributionId) => api.get(`/distributions/${distributionId}`);

const createDistribution = (distributionData) =>
  api.post('/distributions', distributionData);

const updateDistribution = (distributionId, distributionData) =>
  api.put(`/distributions/${distributionId}`, distributionData);

export { getDistributions, getDistribution, createDistribution, updateDistribution };