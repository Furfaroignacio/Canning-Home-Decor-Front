import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Loader from './Loader'

// Lo opuesto a ProtectedRoute: evita que alguien ya logueado vuelva a ver
// el login o el registro. Si tiene sesion, lo manda al catalogo.
const SoloVisitantes = ({ children }) => {
  const { estaLogueado, cargando } = useAuth()

  if (cargando) return <Loader texto="Verificando tu sesion" />
  if (estaLogueado) return <Navigate to="/" replace />

  return children
}

export default SoloVisitantes
