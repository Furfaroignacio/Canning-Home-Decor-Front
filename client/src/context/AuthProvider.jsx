import { useCallback, useEffect, useMemo, useState } from 'react'
import { AuthContext } from './AuthContext'
import * as authApi from '../api/auth'
import { getToken } from '../api/client'

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [cargando, setCargando] = useState(true)

  // UNICO efecto de la sesion. Corre una sola vez, al montar la app.
  //
  // El token sobrevive a que el usuario recargue la pagina (vive en
  // localStorage), pero los datos del usuario no. Entonces al arrancar
  // preguntamos una sola vez quien es el dueño de ese token.
  //
  // El array de dependencias vacio es lo que garantiza que corra una vez.
  // La variable "cancelado" evita avisar de un resultado que llega cuando el
  // componente ya se desmonto: en desarrollo React monta dos veces a
  // proposito para detectar justamente este tipo de error.
  useEffect(() => {
    if (!getToken()) {
      setCargando(false)
      return
    }

    let cancelado = false

    authApi
      .me()
      .then((usuario) => {
        if (!cancelado) setUser(usuario)
      })
      .catch(() => {
        // El token vencio o es invalido: lo tiramos y arrancamos deslogueados.
        authApi.logout()
      })
      .finally(() => {
        if (!cancelado) setCargando(false)
      })

    return () => {
      cancelado = true
    }
  }, [])

  const login = useCallback(async (email, password) => {
    await authApi.authenticate({ email, password })
    const usuario = await authApi.me()
    setUser(usuario)
    return usuario
  }, [])

  const register = useCallback(async (datos) => {
    await authApi.register(datos)
    const usuario = await authApi.me()
    setUser(usuario)
    return usuario
  }, [])

  const logout = useCallback(() => {
    authApi.logout()
    setUser(null)
  }, [])

  // esAdmin NO es un estado: es un valor que se deduce del usuario. Meterlo
  // en un useState con un useEffect que lo sincronice es el error clasico de
  // "efecto mal usado". Se calcula en el render y listo.
  const valor = useMemo(
    () => ({
      user,
      cargando,
      esAdmin: user?.role === 'ADMIN',
      estaLogueado: user !== null,
      login,
      register,
      logout,
    }),
    [user, cargando, login, register, logout]
  )

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>
}
