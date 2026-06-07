import apiClient from './axios.config';

export const ganadoApi = {
    getAll:   ()         => apiClient.get('/ganado'),
    getById:  (id)       => apiClient.get(`/ganado/${id}`),
    create:   (data)     => apiClient.post('/ganado', data),
    update:   (id, data) => apiClient.put(`/ganado/${id}`, data),
    delete:   (id)       => apiClient.delete(`/ganado/${id}`),
};