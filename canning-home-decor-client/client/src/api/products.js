import { api, toQuery } from './client'

// Todos los filtros son opcionales y se combinan entre si.
// Devuelve el objeto paginado de Spring: los productos estan en .content
export const listar = (filtros = {}) => api.get(`/products${toQuery(filtros)}`)

export const obtener = (id) => api.get(`/products/${id}`)

// Solo ADMIN de aca para abajo.
export const crear = (producto) => api.post('/products', producto)

export const actualizar = (id, producto) => api.put(`/products/${id}`, producto)

export const actualizarStock = (id, stock) =>
  api.patch(`/products/${id}/stock${toQuery({ stock })}`)

export const eliminar = (id) => api.del(`/products/${id}`)
