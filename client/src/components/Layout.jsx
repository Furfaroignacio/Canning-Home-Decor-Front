import { Outlet } from 'react-router-dom'
import Header from './Header'

// Marco comun de las pantallas con sesion iniciada. El <Outlet> es el lugar
// donde React Router inserta la vista de la ruta actual.
const Layout = () => (
  <div className="app">
    <Header />
    <main className="contenido">
      <Outlet />
    </main>
  </div>
)

export default Layout
