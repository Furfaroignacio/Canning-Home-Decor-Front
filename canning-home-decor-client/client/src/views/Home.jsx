import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Pantalla provisoria: ocupa el lugar del catalogo hasta que lo armemos.
// Es publica, asi que tiene que funcionar con y sin sesion iniciada.
const PENDIENTES_VISITANTE = [
  ['Catalogo', 'Grilla de productos con filtros por categoria, precio y texto.'],
  ['Detalle de producto', 'Fotos, descripcion y precio con descuento aplicado.'],
]

const PENDIENTES_COMPRADOR = [
  ['Catalogo', 'Grilla de productos con filtros por categoria, precio y texto.'],
  ['Detalle de producto', 'Fotos, descripcion, precio y boton de agregar al carrito.'],
  ['Carrito', 'Items, cantidades, total y confirmacion de compra.'],
  ['Mis compras', 'Historial de ordenes con su detalle.'],
]

const PENDIENTES_ADMIN = [
  ['Productos', 'Listado, alta, edicion, stock y baja.'],
  ['Categorias', 'Alta, edicion y baja.'],
  ['Usuarios', 'Listado, cambio de rol y baja de cuentas.'],
]

const Home = () => {
  const { user, esAdmin, estaLogueado } = useAuth()

  let pendientes = PENDIENTES_VISITANTE
  if (esAdmin) pendientes = PENDIENTES_ADMIN
  else if (estaLogueado) pendientes = PENDIENTES_COMPRADOR

  return (
    <div className="pagina">
      <h1 className="titulo titulo--grande">
        {estaLogueado ? `Hola, ${user.name}` : 'Canning Home Decor'}
      </h1>

      {estaLogueado ? (
        <p className="parrafo">
          La base del proyecto esta funcionando: la sesion se guarda, el token
          viaja en cada pedido y la API nos reconocio como{' '}
          <strong>{esAdmin ? 'administrador' : 'comprador'}</strong>.
        </p>
      ) : (
        <p className="parrafo">
          Estas viendo la tienda sin iniciar sesion, igual que cualquier
          visitante. Para comprar hace falta <Link to="/login">entrar</Link> o{' '}
          <Link to="/registro">crear una cuenta</Link>.
        </p>
      )}

      {estaLogueado && (
        <dl className="ficha">
          <div className="ficha__fila">
            <dt>Usuario</dt>
            <dd>{user.username}</dd>
          </div>
          <div className="ficha__fila">
            <dt>Email</dt>
            <dd>{user.email}</dd>
          </div>
          <div className="ficha__fila">
            <dt>Rol</dt>
            <dd>{user.role}</dd>
          </div>
        </dl>
      )}

      <h2 className="titulo titulo--chico">Lo que viene</h2>
      <ul className="lista-pendientes">
        {pendientes.map(([nombre, detalle]) => (
          <li key={nombre} className="pendiente">
            <span className="pendiente__nombre">{nombre}</span>
            <span className="pendiente__detalle">{detalle}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Home
