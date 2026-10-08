import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import * as productosApi from '../api/products'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { formatearPrecio } from '../utils/formato'
import Loader from '../components/Loader'

const Detalle = () => {
  const { id } = useParams()
  const { estaLogueado, esAdmin } = useAuth()
  const { agregar } = useCart()

  const [producto, setProducto] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  const [fotoActiva, setFotoActiva] = useState(0)
  const [fotosRotas, setFotosRotas] = useState({})
  const [cantidad, setCantidad] = useState(1)

  const [agregando, setAgregando] = useState(false)
  const [agregado, setAgregado] = useState(false)
  const [errorCarrito, setErrorCarrito] = useState(null)

  // Vuelve a pedir el producto cada vez que cambia el id de la URL, que es
  // lo que pasa al navegar de una pieza a otra sin salir de esta pantalla.
  useEffect(() => {
    let cancelado = false
    setCargando(true)
    setError(null)
    setFotoActiva(0)
    setCantidad(1)
    setAgregado(false)

    productosApi
      .obtener(id)
      .then((respuesta) => {
        if (!cancelado) setProducto(respuesta)
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
  }, [id])

  const sumarAlCarrito = async () => {
    setAgregando(true)
    setErrorCarrito(null)
    try {
      await agregar(producto.id, cantidad)
      setAgregado(true)
    } catch (fallo) {
      setErrorCarrito(fallo.message)
    } finally {
      setAgregando(false)
    }
  }

  if (cargando) return <Loader texto="Buscando la pieza" />

  if (error || !producto) {
    return (
      <div className="pagina pagina--centrada">
        <h1 className="titulo titulo--grande">No encontramos esta pieza</h1>
        <p className="parrafo">{error ?? 'Puede que ya no este en el catalogo.'}</p>
        <Link to="/catalogo" className="boton boton--principal">
          Volver al catálogo
        </Link>
      </div>
    )
  }

  const fotos = producto.imageUrls ?? []
  const fotoElegida = fotos[fotoActiva]
  const mostrarFoto = Boolean(fotoElegida) && !fotosRotas[fotoActiva]
  const tieneDescuento = producto.discount > 0
  const agotado = !producto.available
  const tope = Math.max(1, producto.stock ?? 1)

  return (
    <article className="detalle">
      <nav className="miga" aria-label="Donde estás">
        <Link to="/catalogo">Catálogo</Link>
        {producto.category && (
          <>
            <span className="miga__union" aria-hidden="true" />
            <Link to={`/catalogo?categoria=${producto.category.id}`}>
              {producto.category.description}
            </Link>
          </>
        )}
      </nav>

      <div className="detalle__cuerpo">
        <div className="detalle__fotos">
          <div className={`detalle__marco${agotado ? ' detalle__marco--agotado' : ''}`}>
            {mostrarFoto ? (
              <img
                className="detalle__foto"
                src={fotoElegida}
                alt={producto.description}
                onError={() => setFotosRotas((previas) => ({ ...previas, [fotoActiva]: true }))}
              />
            ) : (
              <div className="pieza__sin-foto" aria-hidden="true" />
            )}
          </div>

          {fotos.length > 1 && (
            <div className="miniaturas" role="group" aria-label="Fotos de la pieza">
              {fotos.map((foto, indice) => (
                <button
                  key={foto}
                  type="button"
                  className={`miniatura${indice === fotoActiva ? ' miniatura--activa' : ''}`}
                  onClick={() => setFotoActiva(indice)}
                  aria-label={`Ver foto ${indice + 1}`}
                >
                  {fotosRotas[indice] ? (
                    <span className="pieza__sin-foto" />
                  ) : (
                    <img
                      src={foto}
                      alt=""
                      onError={() =>
                        setFotosRotas((previas) => ({ ...previas, [indice]: true }))
                      }
                    />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="detalle__datos">
          <h1 className="detalle__nombre">{producto.description}</h1>

          <div className="detalle__precios">
            {tieneDescuento && (
              <span className="detalle__precio-lista">
                {formatearPrecio(producto.price)}
              </span>
            )}
            <span className="detalle__precio">
              {formatearPrecio(producto.finalPrice ?? producto.price)}
            </span>
            {tieneDescuento && (
              <span className="detalle__ahorro">−{producto.discount}%</span>
            )}
          </div>

          <p className={`disponibilidad${agotado ? ' disponibilidad--agotada' : ''}`}>
            {agotado
              ? 'Sin stock por ahora'
              : `${producto.stock} ${producto.stock === 1 ? 'unidad disponible' : 'unidades disponibles'}`}
          </p>

          {/* Quien ve que: el admin vende, no compra. El visitante tiene que
              entrar primero. El comprador ve el selector y el boton. */}
          {esAdmin ? (
            <p className="nota">
              Estás como administrador. La compra es para las cuentas de comprador.
            </p>
          ) : !estaLogueado ? (
            <div className="detalle__accion">
              <Link to="/login" className="boton boton--principal">
                Entrar para comprar
              </Link>
              <p className="nota">
                ¿Todavía no tenés cuenta? <Link to="/registro">Creá una</Link>.
              </p>
            </div>
          ) : agotado ? (
            <button type="button" className="boton boton--principal" disabled>
              Sin stock
            </button>
          ) : (
            <div className="detalle__accion">
              <div className="cantidad">
                <label className="campo__etiqueta" htmlFor="cantidad">
                  Cantidad
                </label>
                <input
                  id="cantidad"
                  className="campo__control cantidad__control"
                  type="number"
                  min="1"
                  max={tope}
                  value={cantidad}
                  onChange={(e) => {
                    const valor = Number(e.target.value)
                    setCantidad(Math.min(tope, Math.max(1, valor || 1)))
                    setAgregado(false)
                  }}
                />
              </div>

              <button
                type="button"
                className="boton boton--principal"
                onClick={sumarAlCarrito}
                disabled={agregando}
              >
                {agregando ? 'Agregando' : 'Agregar al carrito'}
              </button>

              {agregado && (
                <p className="aviso aviso--ok" role="status">
                  Listo, lo sumamos. <Link to="/carrito">Ver el carrito</Link>
                </p>
              )}

              {errorCarrito && (
                <p className="aviso aviso--error" role="alert">
                  {errorCarrito}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </article>
  )
}

export default Detalle
