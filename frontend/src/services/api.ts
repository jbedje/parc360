import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

// Intercepteur pour ajouter le token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Service Utilisateurs
export const userService = {
  getAll: (params?: any) => api.get('/users', { params }),
  getOne: (id: string) => api.get(`/users/${id}`),
  create: (data: any) => api.post('/users', data),
  update: (id: string, data: any) => api.put(`/users/${id}`, data),
  delete: (id: string) => api.delete(`/users/${id}`),
};

// Véhicules
export const vehicleService = {
  getAll: (params?: any) => api.get('/vehicles', { params }),
  getOne: (id: string) => api.get(`/vehicles/${id}`),
  create: (data: any) => api.post('/vehicles', data),
  update: (id: string, data: any) => api.put(`/vehicles/${id}`, data),
  delete: (id: string) => api.delete(`/vehicles/${id}`),
  assignDriver: (id: string, driverId: string) =>
    api.put(`/vehicles/${id}/assign-driver`, { driverId }),
  getHistory: (id: string) => api.get(`/vehicles/${id}/history`),
};

// Conducteurs
export const driverService = {
  getAll: (params?: any) => api.get('/drivers', { params }),
  getOne: (id: string) => api.get(`/drivers/${id}`),
  create: (data: any) => api.post('/drivers', data),
  update: (id: string, data: any) => api.put(`/drivers/${id}`, data),
  delete: (id: string) => api.delete(`/drivers/${id}`),
  addInfraction: (id: string, data: any) => api.post(`/drivers/${id}/infractions`, data),
  addFormation: (id: string, data: any) => api.post(`/drivers/${id}/formations`, data),
};

// Maintenance
export const maintenanceService = {
  getAll: (params?: any) => api.get('/maintenance', { params }),
  getOne: (id: string) => api.get(`/maintenance/${id}`),
  create: (data: any) => api.post('/maintenance', data),
  update: (id: string, data: any) => api.put(`/maintenance/${id}`, data),
  delete: (id: string) => api.delete(`/maintenance/${id}`),
};

// Carburant
export const fuelService = {
  getAll: (params?: any) => api.get('/fuel', { params }),
  getOne: (id: string) => api.get(`/fuel/${id}`),
  create: (data: any) => api.post('/fuel', data),
  update: (id: string, data: any) => api.put(`/fuel/${id}`, data),
  delete: (id: string) => api.delete(`/fuel/${id}`),
  getStats: (params?: any) => api.get('/fuel/stats', { params }),
};

// Trajets
export const tripService = {
  getAll: (params?: any) => api.get('/trips', { params }),
  getOne: (id: string) => api.get(`/trips/${id}`),
  create: (data: any) => api.post('/trips', data),
  update: (id: string, data: any) => api.put(`/trips/${id}`, data),
  delete: (id: string) => api.delete(`/trips/${id}`),
  validate: (id: string) => api.put(`/trips/${id}/validate`),
};

// Documents
export const documentService = {
  getAll: (params?: any) => api.get('/documents', { params }),
  getOne: (id: string) => api.get(`/documents/${id}`),
  create: (data: any) => api.post('/documents', data),
  update: (id: string, data: any) => api.put(`/documents/${id}`, data),
  delete: (id: string) => api.delete(`/documents/${id}`),
  getExpiring: () => api.get('/documents/expiring'),
};

// Rapports
export const reportService = {
  getDashboard: () => api.get('/reports/dashboard'),
  getVehicles: (params?: any) => api.get('/reports/vehicles', { params }),
  getMaintenance: (params?: any) => api.get('/reports/maintenance', { params }),
  getFuel: (params?: any) => api.get('/reports/fuel', { params }),
  getDrivers: (params?: any) => api.get('/reports/drivers', { params }),
  getCosts: (params?: any) => api.get('/reports/costs', { params }),
};

// Assurances
export const insuranceService = {
  getAll: (params?: any) => api.get('/insurances', { params }),
  getOne: (id: string) => api.get(`/insurances/${id}`),
  create: (data: any) => api.post('/insurances', data),
  update: (id: string, data: any) => api.put(`/insurances/${id}`, data),
  delete: (id: string) => api.delete(`/insurances/${id}`),
  getStats: () => api.get('/insurances/stats'),
  addClaim: (id: string, data: any) => api.post(`/insurances/${id}/sinistres`, data),
  updateClaim: (id: string, claimId: string, data: any) =>
    api.put(`/insurances/${id}/sinistres/${claimId}`, data),
};

// Utilisateurs (Admin)
export const adminUserService = {
  getAll: () => api.get('/users'),
  getOne: (id: string) => api.get(`/users/${id}`),
  create: (data: any) => api.post('/users', data),
  update: (id: string, data: any) => api.put(`/users/${id}`, data),
  delete: (id: string) => api.delete(`/users/${id}`),
  updateRole: (id: string, role: string) => api.put(`/users/${id}/role`, { role }),
  toggleStatus: (id: string) => api.put(`/users/${id}/status`),
  getStats: () => api.get('/users/stats'),
};

// Paramètres
export const settingsService = {
  get: () => api.get('/settings'),
  update: (data: any) => api.put('/settings', data),
};

export default api;
