import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// React Router no reinicia el scroll al cambiar de ruta: si venias scrolleado
// en el home, el catalogo abria por la mitad. Esto lo corrige.
// Depende solo de pathname, asi cambiar un filtro de la URL no te sube.
const IrArriba = () => {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

export default IrArriba
