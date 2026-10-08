import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import * as productosApi from '../api/products'
import * as categoriasApi from '../api/categories'
import ProductoCard from '../components/ProductoCard'

const CUANTAS_DESTACADAS = 4

const Home = () => {
  const [categorias, setCategorias] = useState([])
  const [productos, setProductos] = useState([])

  // Una sola consulta de cada cosa, al entrar. El home no cambia mientras
  // lo mirás, asi que no hay nada que volver a pedir.
  useEffect(() => {
    let cancelado = false

    Promise.all([categoriasApi.listar(), productosApi.listar({ size: 40 })])
      .then(([respuestaCategorias, respuestaProductos]) => {
        if (cancelado) return
        setCategorias(respuestaCategorias.content ?? [])
        setProductos(respuestaProductos.content ?? [])
      })
      .catch(() => {
        // El home no deja de funcionar si la API falla: muestra la portada
        // y los enlaces, sin las piezas.
        if (!cancelado) {
          setCategorias([])
          setProductos([])
        }
      })

    return () => {
      cancelado = true
    }
  }, [])

  // Se deducen de lo que ya trajimos. Ni estado ni efecto aparte.
  const conDescuento = productos
    .filter((p) => p.discount > 0 && p.available)
    .slice(0, CUANTAS_DESTACADAS)

  return (
    <div className="home">
      <section className="portada">
        <h1 className="portada__titulo">
          Muebles para una casa
          <br />
          que se usa
        </h1>
        <p className="portada__bajada">
          Sillones, mesas, iluminación y objetos elegidos de a uno.
        </p>
        <Link to="/catalogo" className="boton boton--claro">
          Ver el catálogo
        </Link>
      </section>

      {categorias.length > 0 && (
        <section className="bloque">
          <h2 className="bloque__titulo">Por dónde empezar</h2>
          <ul className="indice">
            {categorias.map((categoria) => (
              <li key={categoria.id}>
                <Link to={`/catalogo?categoria=${categoria.id}`} className="indice__link">
                  {categoria.description}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {conDescuento.length > 0 && (
        <section className="bloque">
          <div className="bloque__encabezado">
            <h2 className="bloque__titulo">Con descuento</h2>
            <Link to="/catalogo" className="bloque__mas">
              Ver todo el catálogo
            </Link>
          </div>
          <div className="grilla">
            {conDescuento.map((producto) => (
              <ProductoCard key={producto.id} producto={producto} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

export default Home
