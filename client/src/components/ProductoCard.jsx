import { useState } from 'react'
import { Link } from 'react-router-dom'
import { formatearPrecio } from '../utils/formato'

// Una pieza del catalogo. No tiene caja ni sombra: se apoya sobre el fondo
// y lo unico que la separa de sus datos es una linea, que se alinea con la
// de las piezas vecinas. Ese ritmo horizontal es el del catalogo impreso.
const ProductoCard = ({ producto }) => {
  const [imagenRota, setImagenRota] = useState(false)

  const foto = producto.imageUrls?.[0]
  const hayFoto = Boolean(foto) && !imagenRota
  const tieneDescuento = producto.discount > 0
  const agotado = !producto.available

  return (
    <article className={`pieza${agotado ? ' pieza--agotada' : ''}`}>
      <Link to={`/productos/${producto.id}`} className="pieza__enlace">
        <div className="pieza__marco">
          {hayFoto ? (
            <img
              className="pieza__foto"
              src={foto}
              alt={producto.description}
              loading="lazy"
              onError={() => setImagenRota(true)}
            />
          ) : (
            <div className="pieza__sin-foto" aria-hidden="true" />
          )}

          {tieneDescuento && !agotado && (
            <span className="pieza__descuento">−{producto.discount}%</span>
          )}

          {agotado && <p className="pieza__agotado">Sin stock</p>}
        </div>

        <div className="pieza__datos">
          <h3 className="pieza__nombre">{producto.description}</h3>

          <p className="pieza__precios">
            {tieneDescuento && (
              <span className="pieza__precio-lista">
                {formatearPrecio(producto.price)}
              </span>
            )}
            <span className="pieza__precio">
              {formatearPrecio(producto.finalPrice ?? producto.price)}
            </span>
          </p>
        </div>
      </Link>
    </article>
  )
}

// Se muestra mientras la API responde: ocupa el mismo lugar que una pieza,
// asi la grilla no salta cuando llegan los datos.
export const PiezaFantasma = () => (
  <article className="pieza pieza--fantasma" aria-hidden="true">
    <div className="pieza__marco" />
    <div className="pieza__datos">
      <span className="fantasma fantasma--titulo" />
      <span className="fantasma fantasma--precio" />
    </div>
  </article>
)

export default ProductoCard
