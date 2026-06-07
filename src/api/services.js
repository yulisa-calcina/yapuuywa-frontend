import apiClient from './axiosConfig'

export const authApi = {
  login:    (data) => apiClient.post('/login', data),
  register: (data) => apiClient.post('/register', data),
  logout:   ()     => apiClient.post('/logout'),
  me:       ()     => apiClient.get('/me'),
}

export const ganadoApi = {
  getAll:  ()           => apiClient.get('/animales'),
  getById: (id)         => apiClient.get(`/animales/${id}`),
  create:  (data)       => apiClient.post('/animales', data),
  update:  (id, data)   => apiClient.put(`/animales/${id}`, data),
  remove:  (id)         => apiClient.delete(`/animales/${id}`),
}

export const historialApi = {
  getByAnimal: (animalId)       => apiClient.get(`/animales/${animalId}/historial`),
  create:      (animalId, data) => apiClient.post(`/animales/${animalId}/historial`, data),
}

export const alertasApi = {
  getVacunacion: ()    => apiClient.get('/alertas/vacunacion'),
  getStock:      ()    => apiClient.get('/alertas/stock'),
  atender:       (id)  => apiClient.put(`/alertas/${id}/atender`),
}

export const dashboardApi = {
  getKpis: () => apiClient.get('/dashboard/kpis'),
}

export const insumosApi = {
  getAll:     ()           => apiClient.get('/insumos'),
  create:     (data)       => apiClient.post('/insumos', data),
  update:     (id, data)   => apiClient.put(`/insumos/${id}`, data),
  remove:     (id)         => apiClient.delete(`/insumos/${id}`),
  movimiento: (id, data)   => apiClient.post(`/insumos/${id}/movimiento`, data),
}