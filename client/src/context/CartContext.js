import { createContext, useContext } from 'react'

export const CartContext = createContext(null)

export const useCart = () => {
  const contexto = useContext(CartContext)
  if (!contexto) {
    throw new Error('useCart se tiene que usar adentro de <CartProvider>')
  }
  return contexto
}
