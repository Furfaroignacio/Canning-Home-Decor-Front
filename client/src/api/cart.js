import { api, toQuery } from './client'

// Importante: salvo el checkout, todos estos metodos devuelven el carrito
// COMPLETO y actualizado. Por eso nunca hace falta volver a pedir el
// carrito despues de modificarlo: se usa lo que devuelve la mutacion.

export const obtener = () => api.get('/cart')

export const agregarItem = (productId, quantity) =>
  api.post('/cart/items', { productId, quantity })

export const cambiarCantidad = (itemId, quantity) =>
  api.put(`/cart/items/${itemId}${toQuery({ quantity })}`)

export const quitarItem = (itemId) => api.del(`/cart/items/${itemId}`)

export const vaciar = () => api.del('/cart')

// Este si devuelve una Order, no el carrito: la compra confirmada.
export const confirmarCompra = () => api.post('/cart/checkout')
