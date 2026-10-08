import { api } from './client'

// Historial del usuario logueado, de la compra mas reciente a la mas vieja.
export const listar = () => api.get('/orders')

export const obtener = (id) => api.get(`/orders/${id}`)
