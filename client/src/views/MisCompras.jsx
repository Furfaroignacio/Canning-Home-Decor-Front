import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import * as ordersApi from '../api/orders'
import { formatearFecha, formatearPrecio } from '../utils/formato'
import Loader from '../components/Loader'

const MisCompras = () => {
  const [ordenes, setOrdenes] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  // Un solo pedido: la API ya devuelve cada orden con sus items adentro,
  // asi que no hace falta consultar el detalle de cada una por separado.
  useEffect(() => {
    let cancelado = false

    ordersApi
      .listar()
      .then((respuesta) => {
        if (!cancelado) setOrdenes(respuesta ?? [])
      })
      .catch((fallo) => {
        if (!cancelado) setError(fallo.message)
      })
      .finally(() => {
        if (!cancelado) setCargando(false)
      })

    return () => {
      cancelado = true
    }
  }, [])

  if (cargando) return <Loader texto="Buscando tus compras" />

  return (
    <div className="pagina">
      <div className="catalogo__encabezado">
        <h1 className="catalogo__titulo">Mis compras</h1>
        {!error && ordenes.length > 0 && (
          <p className="catalogo__conteo">
            {ordenes.length} {ordenes.length === 1 ? 'orden' : 'órdenes'}
          </p>
        )}
      </div>

      {error && (
        <p className="aviso aviso--error" role="alert">
          {error}
        </p>
      )}

      {!error && ordenes.length === 0 && (
        <div className="vacio">
          <p className="vacio__titulo">Todavía no compraste nada</p>
          <p className="vacio__texto">
            Cuando confirmes una compra la vas a ver acá, con el detalle de cada
            pieza.
          </p>
          <Link to="/catalogo" className="boton boton--borde">
            Ir al catálogo
          </Link>
        </div>
      )}

      {ordenes.map((orden) => (
        <section key={orden.id} className="orden">
          <header className="orden__encabezado">
            <div>
              <h2 className="orden__numero">Orden {orden.id}</h2>
              <p className="orden__fecha">{formatearFecha(orden.createdAt)}</p>
            </div>
            <p className="orden__total">{formatearPrecio(orden.total)}</p>
          </header>

          <ul className="orden__items">
            {(orden.items ?? []).map((item) => (
              <li key={item.id} className="orden__item">
                <Link
                  to={`/productos/${item.product?.id}`}
                  className="orden__pieza"
                >
                  {item.product?.description}
                </Link>
                <span className="orden__cantidad">
                  {item.quantity} {item.quantity === 1 ? 'unidad' : 'unidades'}
                </span>
                <span className="orden__subtotal">
                  {formatearPrecio(item.subtotal)}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}

export default MisCompras
