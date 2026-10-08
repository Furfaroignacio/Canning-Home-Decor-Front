import { Link } from 'react-router-dom'

const NotFound = () => (
  <div className="pagina pagina--centrada">
    <h1 className="titulo titulo--grande">Esta pagina no existe</h1>
    <p className="parrafo">
      El link puede estar mal escrito o la pantalla todavia no esta hecha.
    </p>
    <Link to="/" className="boton boton--principal">
      Ir al catalogo
    </Link>
  </div>
)

export default NotFound
