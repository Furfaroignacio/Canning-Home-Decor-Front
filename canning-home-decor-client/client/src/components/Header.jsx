import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Header = () => {
  const { user, esAdmin, estaLogueado, logout } = useAuth()
  const navigate = useNavigate()

  const cerrarSesion = () => {
    logout()
    navigate('/', { replace: true })
  }

  return (
    <header className="header">
      <div className="header__interior">
        <Link to="/" className="marca">
          <span className="marca__nombre">Canning</span>
          <span className="marca__bajada">Home Decor</span>
        </Link>

        <nav className="nav" aria-label="Principal">
          <NavLink to="/" end className="nav__link">
            Catalogo
          </NavLink>

          {/* El carrito y las compras solo tienen sentido con sesion */}
          {estaLogueado && !esAdmin && (
            <>
              <NavLink to="/carrito" className="nav__link">
                Carrito
              </NavLink>
              <NavLink to="/mis-compras" className="nav__link">
                Mis compras
              </NavLink>
            </>
          )}

          {esAdmin && (
            <>
              <NavLink to="/admin/productos" className="nav__link">
                Productos
              </NavLink>
              <NavLink to="/admin/categorias" className="nav__link">
                Categorias
              </NavLink>
              <NavLink to="/admin/usuarios" className="nav__link">
                Usuarios
              </NavLink>
            </>
          )}
        </nav>

        <div className="sesion">
          {estaLogueado ? (
            <>
              <span className="sesion__nombre">{user.name}</span>
              <button type="button" className="boton boton--texto" onClick={cerrarSesion}>
                Cerrar sesion
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav__link">
                Entrar
              </Link>
              <Link to="/registro" className="boton boton--borde">
                Crear cuenta
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
