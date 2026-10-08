import { useCallback, useEffect, useMemo, useState } from 'react'
import { CartContext } from './CartContext'
import { useAuth } from './AuthContext'
import * as cartApi from '../api/cart'

export const CartProvider = ({ children }) => {
  const { estaLogueado, esAdmin } = useAuth()
  const [carrito, setCarrito] = useState(null)
  const [cargando, setCargando] = useState(false)

  // El carrito se pide UNA vez, cuando el usuario inicia sesion. A partir de
  // ahi cada operacion devuelve el carrito actualizado, asi que no hace falta
  // volver a pedirlo nunca.
  useEffect(() => {
    if (!estaLogueado || esAdmin) {
      setCarrito(null)
      return
    }

    let cancelado = false
    setCargando(true)

    cartApi
      .obtener()
      .then((respuesta) => {
        if (!cancelado) setCarrito(respuesta)
      })
      .catch(() => {
        if (!cancelado) setCarrito(null)
      })
      .finally(() => {
        if (!cancelado) setCargando(false)
      })

    return () => {
      cancelado = true
    }
  }, [estaLogueado, esAdmin])

  const agregar = useCallback(async (productId, quantity) => {
    const actualizado = await cartApi.agregarItem(productId, quantity)
    setCarrito(actualizado)
    return actualizado
  }, [])

  const cambiarCantidad = useCallback(async (itemId, quantity) => {
    setCarrito(await cartApi.cambiarCantidad(itemId, quantity))
  }, [])

  const quitar = useCallback(async (itemId) => {
    setCarrito(await cartApi.quitarItem(itemId))
  }, [])

  const vaciar = useCallback(async () => {
    setCarrito(await cartApi.vaciar())
  }, [])

  const confirmarCompra = useCallback(async () => {
    // El checkout devuelve la orden, no el carrito. Como sabemos que el back
    // deja el carrito vacio, lo reflejamos sin pedirlo de nuevo.
    const orden = await cartApi.confirmarCompra()
    setCarrito((anterior) => ({ ...anterior, items: [], total: 0, itemCount: 0 }))
    return orden
  }, [])

  // Unidades totales, no lineas: si hay 3 sillas y 2 mesas, el numerito
  // del header dice 5. Se calcula, no se guarda.
  const unidades =
    carrito?.items?.reduce((suma, item) => suma + (item.quantity ?? 0), 0) ?? 0

  const valor = useMemo(
    () => ({
      carrito,
      items: carrito?.items ?? [],
      total: carrito?.total ?? 0,
      unidades,
      cargando,
      agregar,
      cambiarCantidad,
      quitar,
      vaciar,
      confirmarCompra,
    }),
    [carrito, unidades, cargando, agregar, cambiarCantidad, quitar, vaciar, confirmarCompra]
  )

  return <CartContext.Provider value={valor}>{children}</CartContext.Provider>
}
