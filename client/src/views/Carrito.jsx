import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { formatearPrecio } from '../utils/formato'
import Loader from '../components/Loader'

const Carrito = () => {
  const { items, total, unidades, cargando, cambiarCantidad, quitar, vaciar, confirmarCompra } =
    useCart()

  const [trabajando, setTrabajando] = useState(false)
  const [error, setError] = useState(null)
  const [ordenConfirmada, setOrdenConfirmada] = useState(null)

  // Envuelve cualquier operacion del carrito: bloquea los botones mientras
  // viaja el pedido y muestra el motivo si la API lo rechaza.
  const operar = async (accion) => {
    setTrabajando(true)
    setError(null)
    try {
      await accion()
    } catch (fallo) {
      setError(fallo.message)
    } finally {
      setTrabajando(false)
    }
  }

  const comprar = () =>
    operar(async () => {
      const orden = await confirmarCompra()
      setOrdenConfirmada(orden)
    })

  if (cargando) return <Loader texto="Abriendo tu carrito" />

  if (ordenConfirmada) {
    return (
      <div className="pagina pagina--centrada">
        <h1 className="titulo titulo--grande">Compra confirmada</h1>
        <p className="parrafo">
          Tu orden quedó registrada con el número {ordenConfirmada.id} por{' '}
          {formatearPrecio(ordenConfirmada.total)}. Descontamos el stock de cada
          pieza.
        </p>
        <Link to="/catalogo" className="boton boton--principal">
          Seguir mirando el catálogo
        </Link>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="pagina">
        <div className="catalogo__encabezado">
          <h1 className="catalogo__titulo">Carrito</h1>
        </div>
        <div className="vacio">
          <p className="vacio__titulo">Tu carrito está vacío</p>
          <p className="vacio__texto">
            Cuando encuentres algo que te guste, agregalo desde su ficha y vuelve acá.
          </p>
          <Link to="/catalogo" className="boton boton--borde">
            Ir al catálogo
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="pagina">
      <div className="catalogo__encabezado">
        <h1 className="catalogo__titulo">Carrito</h1>
        <p className="catalogo__conteo">
          {unidades} {unidades === 1 ? 'unidad' : 'unidades'}
        </p>
      </div>

      {error && (
        <p className="aviso aviso--error" role="alert">
          {error}
        </p>
      )}

      <ul className="renglones">
        {items.map((item) => {
          const producto = item.product
          const foto = producto?.imageUrls?.[0]

          return (
            <li key={item.id} className="renglon">
              <Link to={`/productos/${producto?.id}`} className="renglon__foto">
                {foto ? (
                  <img src={foto} alt="" />
                ) : (
                  <span className="pieza__sin-foto" />
                )}
              </Link>

              <div className="renglon__cuerpo">
                <Link to={`/productos/${producto?.id}`} className="renglon__nombre">
                  {producto?.description}
                </Link>
                <p className="renglon__unitario">
                  {formatearPrecio(producto?.finalPrice ?? producto?.price)} por unidad
                </p>
              </div>

              <div className="renglon__cantidad">
                <label className="oculto" htmlFor={`cant-${item.id}`}>
                  Cantidad
                </label>
                <input
                  id={`cant-${item.id}`}
                  className="campo__control cantidad__control"
                  type="number"
                  min="1"
                  max={producto?.stock ?? 99}
                  value={item.quantity}
                  disabled={trabajando}
                  onChange={(e) => {
                    const valor = Number(e.target.value)
                    if (!valor || valor < 1) return
                    operar(() => cambiarCantidad(item.id, valor))
                  }}
                />
              </div>

              <p className="renglon__subtotal">{formatearPrecio(item.subtotal)}</p>

              <button
                type="button"
                className="boton boton--texto"
                onClick={() => operar(() => quitar(item.id))}
                disabled={trabajando}
              >
                Quitar
              </button>
            </li>
          )
        })}
      </ul>

      <div className="cierre">
        <button
          type="button"
          className="boton boton--texto"
          onClick={() => operar(vaciar)}
          disabled={trabajando}
        >
          Vaciar el carrito
        </button>

        <div className="cierre__total">
          <p className="cierre__etiqueta">Total</p>
          <p className="cierre__monto">{formatearPrecio(total)}</p>
        </div>

        <button
          type="button"
          className="boton boton--principal cierre__comprar"
          onClick={comprar}
          disabled={trabajando}
        >
          {trabajando ? 'Confirmando' : 'Confirmar compra'}
        </button>
      </div>
    </div>
  )
}

export default Carrito
