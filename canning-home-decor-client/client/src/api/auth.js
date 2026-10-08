import { api, saveToken, clearToken } from './client'

// register y authenticate son publicos: no mandan token.
export const register = async (datos) => {
  const respuesta = await api.post('/api/v1/auth/register', datos, { auth: false })
  saveToken(respuesta.access_token)
  return respuesta
}

export const authenticate = async ({ email, password }) => {
  const respuesta = await api.post(
    '/api/v1/auth/authenticate',
    { email, password },
    { auth: false }
  )
  saveToken(respuesta.access_token)
  return respuesta
}

// Devuelve { id, username, email, name, surname, role } del dueño del token.
export const me = () => api.get('/api/v1/auth/me')

export const logout = () => clearToken()
