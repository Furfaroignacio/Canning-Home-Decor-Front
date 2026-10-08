import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import * as productosApi from '../api/products'
import * as categoriasApi from '../api/categories'
import FiltrosCatalogo from '../components/FiltrosCatalogo'
import ProductoCard, { PiezaFantasma } from '../components/ProductoCard'
import { contarPiezas } from '../utils/formato'

const POR_PAGINA = 12
const ESPERA_TIPEO = 400

const Catalogo = () => {
  const [categorias, setCategorias] = useState([])

  // Lo que el usuario esta escribiendo ahora mismo.
  const [texto, setTexto] = useState('')
  const [precioMin, setPrecioMin] = useState('')
  const [precioMax, setPrecioMax] = useState('')

  // Lo que efectivamente se le pide a la API. Se separa de lo anterior para
  // no disparar un pedido por cada tecla.
  const [filtros, setFiltros] = useState({ texto: '', min: '', max: '' })
  const [pagina, setPagina] = useState(0)

  // La categoria elegida vive en la URL, no en un useState. Asi el filtro se
  // puede compartir o guardar en favoritos, y el boton Atras del navegador
  // funciona como se espera.
  const [parametrosUrl, setParametrosUrl] = useSearchParams()
  const categoriaEnUrl = parametrosUrl.get('categoria')
  const categoriaId = categoriaEnUrl ? Number(categoriaEnUrl) : null

  const [productos, setProductos] = useState([])
  const [total, setTotal] = useState(0)
  const [totalPaginas, setTotalPaginas] = useState(1)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  // Las categorias no cambian mientras navegas: se piden una sola vez.
  useEffect(() => {
    let cancelado = false

    categoriasApi
      .listar()
      .then((respuesta) => {
        if (!cancelado) setCategorias(respuesta.content ?? [])
      })
      .catch(() => {
        // Si fallan, el catalogo igual funciona: solo no se puede filtrar.
        if (!cancelado) setCategorias([])
      })

    return () => {
      cancelado = true
    }
  }, [])

  // Espera a que el usuario deje de escribir antes de aplicar los filtros.
  // El return limpia el temporizador anterior, asi que mientras siga
  // tecleando el pedido nunca llega a salir.
  useEffect(() => {
    const temporizador = setTimeout(() => {
      setFiltros((anterior) => {
        // Si nada cambio devolvemos el mismo objeto: al mantener la
        // identidad, el efecto que pide los productos no se vuelve a correr.
        if (
          anterior.texto === texto &&
          anterior.min === precioMin &&
          anterior.max === precioMax
        ) {
          return anterior
        }
        return { texto, min: precioMin, max: precioMax }
      })
      setPagina(0)
    }, ESPERA_TIPEO)

    return () => clearTimeout(temporizador)
  }, [texto, precioMin, precioMax])

  // Unico pedido de productos. Vuelve a correr solo cuando cambia alguno de
  // los valores del array de dependencias.
  useEffect(() => {
    let cancelado = false
    setCargando(true)
    setError(null)

    productosApi
      .listar({
        categoryId: categoriaId,
        search: filtros.texto,
        minPrice: filtros.min,
        maxPrice: filtros.max,
        page: pagina,
        size: POR_PAGINA,
      })
      .then((respuesta) => {
        if (cancelado) return
        setProductos(respuesta.content ?? [])
        setTotal(respuesta.totalElements ?? 0)
        setTotalPaginas(respuesta.totalPages ?? 1)
      })
      .catch((fallo) => {
        if (cancelado) return
        setError(fallo.message)
        setProductos([])
        setTotal(0)
      })
      .finally(() => {
        if (!cancelado) setCargando(false)
      })

    return () => {
      cancelado = true
    }
  }, [categoriaId, filtros, pagina])

  const cambiarCategoria = (id) => {
    setParametrosUrl(id === null ? {} : { categoria: String(id) })
    setPagina(0)
  }

  const limpiar = () => {
    setTexto('')
    setPrecioMin('')
    setPrecioMax('')
    setParametrosUrl({})
    setPagina(0)
  }

  // Valores que se deducen del estado. No necesitan ni useState ni useEffect.
  const hayFiltros =
    categoriaId !== null || texto !== '' || precioMin !== '' || precioMax !== ''
  const nombreCategoria =
    categorias.find((c) => c.id === categoriaId)?.description ?? 'Catálogo'

  return (
    <div className="catalogo">
      <div className="catalogo__encabezado">
        <h1 className="catalogo__titulo">{nombreCategoria}</h1>
        {!cargando && !error && (
          <p className="catalogo__conteo">{contarPiezas(total)}</p>
        )}
      </div>

      <FiltrosCatalogo
        categorias={categorias}
        categoriaId={categoriaId}
        onCategoria={cambiarCategoria}
        texto={texto}
        onTexto={setTexto}
        precioMin={precioMin}
        onPrecioMin={setPrecioMin}
        precioMax={precioMax}
        onPrecioMax={setPrecioMax}
        hayFiltros={hayFiltros}
        onLimpiar={limpiar}
      />

      {error && (
        <p className="aviso aviso--error" role="alert">
          {error}
        </p>
      )}

      {cargando && (
        <div className="grilla">
          {Array.from({ length: POR_PAGINA }, (_, i) => (
            <PiezaFantasma key={i} />
          ))}
        </div>
      )}

      {!cargando && !error && productos.length === 0 && (
        <div className="vacio">
          <p className="vacio__titulo">No hay piezas con esa búsqueda</p>
          <p className="vacio__texto">
            Probá con menos filtros, o escribí algo más general como mesa o lino.
          </p>
          {hayFiltros && (
            <button type="button" className="boton boton--borde" onClick={limpiar}>
              Ver todo el catálogo
            </button>
          )}
        </div>
      )}

      {!cargando && !error && productos.length > 0 && (
        <div className="grilla">
          {productos.map((producto) => (
            <ProductoCard key={producto.id} producto={producto} />
          ))}
        </div>
      )}

      {!cargando && totalPaginas > 1 && (
        <nav className="paginador" aria-label="Páginas del catálogo">
          <button
            type="button"
            className="boton boton--borde"
            onClick={() => setPagina((p) => p - 1)}
            disabled={pagina === 0}
          >
            Anterior
          </button>

          <span className="paginador__posicion">
            {pagina + 1} de {totalPaginas}
          </span>

          <button
            type="button"
            className="boton boton--borde"
            onClick={() => setPagina((p) => p + 1)}
            disabled={pagina >= totalPaginas - 1}
          >
            Siguiente
          </button>
        </nav>
      )}
    </div>
  )
}

export default Catalogo
