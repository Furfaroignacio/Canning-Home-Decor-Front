import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Loader from './Loader'

// Envuelve una ruta para que solo entre quien corresponde.
//
//   <ProtectedRoute>            -> cualquier usuario logueado
//   <ProtectedRoute rol="ADMIN"> -> solo el administrador
const ProtectedRoute = ({ children, rol }) => {
  const { user, cargando } = useAuth()
  const location = useLocation()

  // Mientras preguntamos quien es el usuario no sabemos si tiene permiso.
  // Sin este paso, al recargar la pagina mandariamos al login a alguien que
  // en realidad tenia la sesion abierta.
  if (cargando) return <Loader texto="Verificando tu sesión" />

  if (!user) {
    // Guardamos de donde venia para volver ahi despues de loguearse.
    return <Navigate to="/login" state={{ volverA: location.pathname }} replace />
  }

  if (rol && user.role !== rol) {
    return <Navigate to="/" replace />
  }

  return children
}

export default ProtectedRoute
