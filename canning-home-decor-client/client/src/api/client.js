// Unico lugar del front que habla con la API.
//
// Ningun componente llama a fetch directamente: todos pasan por aca. El token
// se agrega en un solo lugar, los errores llegan siempre con la misma forma y
// no hay logica de red repetida en cada pantalla.

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4002'

const TOKEN_KEY = 'chd_token'

export const getToken = () => localStorage.getItem(TOKEN_KEY)
export const saveToken = (token) => localStorage.setItem(TOKEN_KEY, token)
export const clearToken = () => localStorage.removeItem(TOKEN_KEY)

// Error propio para poder distinguir en las vistas si fue 403, 404, etc.
export class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

const DEFAULT_MESSAGES = {
  0: 'No se pudo conectar con el servidor. Fijate que la API este levantada.',
  400: 'Los datos enviados no son validos.',
  401: 'Tu sesion expiro. Volve a iniciar sesion.',
  403: 'No tenes permiso para hacer esto.',
  404: 'No encontramos lo que buscabas.',
  409: 'Ese registro ya existe.',
  500: 'La API tuvo un error inesperado.',
}

function parseBody(text) {
  if (!text) return null
  try {
    return JSON.parse(text)
  } catch {
    return { message: text }
  }
}

function buildMessage(status, data) {
  // El back manda el motivo en "message" cuando esta activado
  // server.error.include-message=always. Si no viene, usamos el nuestro.
  const fromApi = data?.message?.trim()
  if (fromApi) return fromApi
  return DEFAULT_MESSAGES[status] ?? `Error ${status}.`
}

async function request(path, { method = 'GET', body, auth = true } = {}) {
  const headers = {}
  if (body !== undefined) headers['Content-Type'] = 'application/json'

  const token = getToken()
  if (auth && token) headers.Authorization = `Bearer ${token}`

  let response
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
  } catch {
    // Cae aca si la API esta apagada o si el navegador bloqueo por CORS.
    throw new ApiError(DEFAULT_MESSAGES[0], 0)
  }

  // 204 No Content: un DELETE exitoso no devuelve cuerpo.
  if (response.status === 204) return null

  const data = parseBody(await response.text())

  if (!response.ok) {
    throw new ApiError(buildMessage(response.status, data), response.status)
  }

  return data
}

// Arma un query string salteando los parametros vacios, para no mandar
// ?categoryId=undefined cuando el filtro no esta puesto.
export function toQuery(params = {}) {
  const search = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return
    search.append(key, value)
  })
  const query = search.toString()
  return query ? `?${query}` : ''
}

export const api = {
  get: (path, options) => request(path, { ...options, method: 'GET' }),
  post: (path, body, options) => request(path, { ...options, method: 'POST', body }),
  put: (path, body, options) => request(path, { ...options, method: 'PUT', body }),
  patch: (path, body, options) => request(path, { ...options, method: 'PATCH', body }),
  del: (path, options) => request(path, { ...options, method: 'DELETE' }),
}
