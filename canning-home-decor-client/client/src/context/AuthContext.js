import { createContext, useContext } from 'react'

// Separamos el contexto y el hook del componente Provider para no romper el
// Fast Refresh de Vite: un archivo deberia exportar componentes o cosas que
// no son componentes, pero no las dos a la vez.
export const AuthContext = createContext(null)

export const useAuth = () => {
  const contexto = useContext(AuthContext)
  if (!contexto) {
    throw new Error('useAuth se tiene que usar adentro de <AuthProvider>')
  }
  return contexto
}
