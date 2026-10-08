import { Link } from 'react-router-dom'

const NotFound = () => (
  <div className="pagina pagina--centrada">
    <h1 className="titulo titulo--grande">Esta página no existe</h1>
    <p className="parrafo">
      El link puede estar mal escrito o la pantalla todavía no está hecha.
    </p>
    <Link to="/catalogo" className="boton boton--principal">
      Ir al catálogo
    </Link>
  </div>
)

export default NotFound
