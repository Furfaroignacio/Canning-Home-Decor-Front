import { api, toQuery } from './client'

// Devuelve el objeto paginado de Spring: las categorias estan en .content
export const listar = (filtros = {}) => api.get(`/categories${toQuery(filtros)}`)

export const obtener = (id) => api.get(`/categories/${id}`)

// Solo ADMIN de aca para abajo.
export const crear = (descripcion) => api.post('/categories', { description: descripcion })

export const actualizar = (id, descripcion) =>
  api.put(`/categories/${id}`, { description: descripcion })

export const eliminar = (id) => api.del(`/categories/${id}`)
