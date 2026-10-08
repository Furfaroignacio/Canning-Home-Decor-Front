import { api } from './client'

// Todos estos endpoints son solo para ADMIN.
export const listar = () => api.get('/users')

export const obtener = (id) => api.get(`/users/${id}`)

// Ojo: el PUT reemplaza el usuario completo, hay que mandar los cuatro campos.
export const actualizar = (id, { username, name, surname, role }) =>
  api.put(`/users/${id}`, { username, name, surname, role })

export const eliminar = (id) => api.del(`/users/${id}`)
